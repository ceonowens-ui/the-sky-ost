/**
 * THE SKY OST — Cloudflare Worker
 * 改寫自秘密關係 OST 的驗證版 worker.js，架構與已踩過的雷完全一致。
 *
 * 端點：
 *   POST /stripe-webhook    付款完成 → 產生兌換碼 → 存 KV → 用 Resend 寄信
 *   POST /verify             前端解鎖頁：驗證 email + 兌換碼
 *   GET  /track              已解鎖線上收聽 → 從 R2 讀 mp3（支援 Range/206）
 *   GET  /download           典藏版專屬下載 WAV（目前尚未啟用典藏版，先保留端點）
 *
 * 需要的綁定（wrangler.toml 已設定好，不用再改）：
 *   KV:  CODES   → the-sky-ost CODES（id: 9babe85b9b9d49ad980dae058e529467）
 *   R2:  AUDIO   → the-sky-audio
 *   ENV: STRIPE_WEBHOOK_SECRET, RESEND_API_KEY, RESEND_FROM, ALLOWED_ORIGINS
 *        （這四個環境變數要用 `wrangler secret put` 個別設定，不要寫進這個檔案）
 *
 * 目前狀態：只有 299 單一價位（04~10 共 7 首付費曲），還沒開典藏版。
 * 之後要加 599 典藏版 + WAV 下載，把 PROTECTED_WAV_FILES 填好、
 * 把 handleStripeWebhook 的門檻邏輯打開即可（下面有標記 TODO）。
 */

// 測試用 demo codes（不需付費即可解鎖，僅供開發測試，正式上線前清空）
// 解鎖時 email 固定填 test@test.com，code 填 SKY1DEMO
const DEMO_CODES = {
  "SKY1DEMO": { email: "test@test.com", product: "299" },
};

// 04~10 首付費音檔白名單（要跟前端 album-config.js 的 tracks[].protectedPath 對得上）
// ⚠️ 05、08 是 WAV 原始檔，不是 mp3，副檔名要對，不然會 404。
const PROTECTED_FILES = new Set([
  "sky/04.mp3", "sky/05.wav", "sky/06.mp3", "sky/07.mp3",
  "sky/08.wav", "sky/09.mp3", "sky/10.mp3",
]);

// TODO：要做 599 典藏版時，把 WAV 檔 key 填進來（例如 sky/wav/04.wav）
const PROTECTED_WAV_FILES = new Set([
  // "sky/wav/04.wav", "sky/wav/05.wav", ...
]);

function corsHeaders(request, env) {
  const allowed = (env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
  const origin = request.headers.get("Origin") || "";
  const allow = allowed.includes(origin) ? origin : (allowed[0] || "*");
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Range",
    "Access-Control-Expose-Headers": "Content-Range,Accept-Ranges,Content-Length",
    "Vary": "Origin",
  };
}

function json(data, status, request, env) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders(request, env) },
  });
}

function genCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 避開易混淆的 0/O、1/I
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  let s = "";
  for (let i = 0; i < 8; i++) s += chars[bytes[i] % chars.length];
  return `SKY1-${s.slice(0, 4)}-${s.slice(4, 8)}`;
}

async function verifyStripeSignature(body, sigHeader, secret) {
  if (!sigHeader) return false;
  const parts = {};
  for (const kv of sigHeader.split(",")) {
    const idx = kv.indexOf("=");
    if (idx === -1) continue;
    parts[kv.slice(0, idx)] = kv.slice(idx + 1);
  }
  if (!parts.t || !parts.v1) return false;
  const signedPayload = `${parts.t}.${body}`;
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sigBuf = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signedPayload));
  const expectedHex = [...new Uint8Array(sigBuf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  if (expectedHex.length !== parts.v1.length) return false;
  let diff = 0;
  for (let i = 0; i < expectedHex.length; i++) diff |= expectedHex.charCodeAt(i) ^ parts.v1.charCodeAt(i);
  return diff === 0;
}

async function sendRedeemEmail(env, email, code, product) {
  const productName = product === "599" ? "THE SKY 典藏版（+WAV）" : "THE SKY 數位專輯";
  const html = `
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;padding:32px;color:#0d1420;background:#f4f8ff">
      <h2 style="color:#0d1420">感謝購買《THE SKY》</h2>
      <p>您購買的方案：<b>${productName}</b></p>
      <p>請回到 app 的「解鎖」頁，輸入以下資訊：</p>
      <p style="margin:4px 0">Email：${email}</p>
      <p style="font-size:22px;font-weight:bold;letter-spacing:2px;color:#7fa6c9;margin:8px 0">兌換碼：${code}</p>
      <p style="font-size:13px;color:#6b7a90">請保留這封信，之後在其他裝置上也能用這組 Email + 兌換碼解鎖。</p>
    </div>`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.RESEND_FROM || "THE SKY <noreply@ceon0693.uk>",
      to: email,
      subject: "《THE SKY》OST 兌換碼",
      html,
    }),
  });
  if (!res.ok) console.log("Resend send failed", res.status, await res.text());
}

async function handleStripeWebhook(request, env) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");
  const ok = await verifyStripeSignature(body, sig, env.STRIPE_WEBHOOK_SECRET);
  if (!ok) return new Response("invalid signature", { status: 400 });

  let event;
  try { event = JSON.parse(body); } catch { return new Response("bad json", { status: 400 }); }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const email = session.customer_details?.email || session.customer_email;
    if (email) {
      const amount = session.amount_total || 0;
      // TWD 是兩位小數貨幣 → amount 已 ×100。目前只有 299 單一價位（29900）。
      // 之後要開 599 典藏版，門檻改用兩者中間值（例如 45000）。
      const product = amount >= 45000 ? "599" : "299";
      const code = genCode();
      await env.CODES.put(code, JSON.stringify({ email, product, ts: Date.now() }));
      await sendRedeemEmail(env, email, code, product);
    }
  }
  return new Response("ok", { status: 200 });
}

async function handleVerify(request, env) {
  let body;
  try { body = await request.json(); } catch { return json({ ok: false, message: "bad request" }, 400, request, env); }
  const email = (body.email || "").trim().toLowerCase();
  const code = (body.code || "").trim().toUpperCase();
  if (!email || !code) return json({ ok: false, message: "請輸入 email 和兌換碼" }, 400, request, env);

  if (DEMO_CODES[code]) {
    const demo = DEMO_CODES[code];
    if (demo.email !== email) return json({ ok: false, message: "兌換碼或 email 不正確" }, 403, request, env);
    return json({ ok: true, product: demo.product }, 200, request, env);
  }

  const rec = await env.CODES.get(code);
  if (!rec) return json({ ok: false, message: "兌換碼或 email 不正確" }, 404, request, env);
  const data = JSON.parse(rec);
  if ((data.email || "").trim().toLowerCase() !== email) {
    return json({ ok: false, message: "兌換碼或 email 不正確" }, 403, request, env);
  }
  return json({ ok: true, product: data.product }, 200, request, env);
}

async function authenticate(env, email, code) {
  if (!email || !code) return null;
  if (DEMO_CODES[code]) {
    const demo = DEMO_CODES[code];
    return demo.email === email ? demo : null;
  }
  const rec = await env.CODES.get(code);
  if (!rec) return null;
  const data = JSON.parse(rec);
  if ((data.email || "").trim().toLowerCase() !== email) return null;
  return data;
}

// /track：支援 HTTP Range（回 206）。iPhone Safari 播 <audio> 必要，不要改成 fetch+Blob。
async function handleTrack(request, env, url) {
  const file = url.searchParams.get("file") || "";
  const email = (url.searchParams.get("email") || "").trim().toLowerCase();
  const code = (url.searchParams.get("code") || "").trim().toUpperCase();

  if (!PROTECTED_FILES.has(file)) {
    return new Response("not found", { status: 404, headers: corsHeaders(request, env) });
  }
  const data = await authenticate(env, email, code);
  if (!data) return new Response("unauthorized", { status: 401, headers: corsHeaders(request, env) });

  const headers = new Headers(corsHeaders(request, env));
  headers.set("accept-ranges", "bytes");
  headers.set("cache-control", "private, max-age=0, must-revalidate");

  const rangeHeader = request.headers.get("range");
  if (rangeHeader) {
    const head = await env.AUDIO.head(file);
    if (!head) return new Response("file not found", { status: 404, headers: corsHeaders(request, env) });
    const size = head.size;
    const m = /bytes=(\d*)-(\d*)/.exec(rangeHeader);
    let start = m && m[1] ? parseInt(m[1], 10) : 0;
    let end = m && m[2] ? parseInt(m[2], 10) : size - 1;
    if (isNaN(start) || start < 0) start = 0;
    if (isNaN(end) || end >= size) end = size - 1;
    const obj = await env.AUDIO.get(file, { range: { offset: start, length: end - start + 1 } });
    obj.writeHttpMetadata(headers);
    headers.set("etag", obj.httpEtag);
    if (!headers.get("content-type")) headers.set("content-type", file.endsWith(".wav") ? "audio/wav" : "audio/mpeg");
    headers.set("content-range", `bytes ${start}-${end}/${size}`);
    headers.set("content-length", String(end - start + 1));
    return new Response(obj.body, { status: 206, headers });
  }

  const obj = await env.AUDIO.get(file);
  if (!obj) return new Response("file not found", { status: 404, headers: corsHeaders(request, env) });
  obj.writeHttpMetadata(headers);
  headers.set("etag", obj.httpEtag);
  if (!headers.get("content-type")) headers.set("content-type", file.endsWith(".wav") ? "audio/wav" : "audio/mpeg");
  return new Response(obj.body, { headers });
}

// 典藏版專屬：下載無損 WAV（目前 PROTECTED_WAV_FILES 是空的，尚未啟用）
async function handleDownload(request, env, url) {
  const file = url.searchParams.get("file") || "";
  const email = (url.searchParams.get("email") || "").trim().toLowerCase();
  const code = (url.searchParams.get("code") || "").trim().toUpperCase();

  if (!PROTECTED_WAV_FILES.has(file)) {
    return new Response("not found", { status: 404, headers: corsHeaders(request, env) });
  }
  const data = await authenticate(env, email, code);
  if (!data) return new Response("unauthorized", { status: 401, headers: corsHeaders(request, env) });
  if (data.product !== "599") {
    return new Response("upgrade required", { status: 403, headers: corsHeaders(request, env) });
  }

  const obj = await env.AUDIO.get(file);
  if (!obj) return new Response("file not found", { status: 404, headers: corsHeaders(request, env) });
  const headers = new Headers(corsHeaders(request, env));
  obj.writeHttpMetadata(headers);
  headers.set("etag", obj.httpEtag);
  if (!headers.get("content-type")) headers.set("content-type", "audio/wav");
  headers.set("content-disposition", `attachment; filename="${file.split("/").pop()}"`);
  headers.set("cache-control", "private, max-age=0, must-revalidate");
  return new Response(obj.body, { headers });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders(request, env) });

    if (url.pathname === "/stripe-webhook" && request.method === "POST") return handleStripeWebhook(request, env);
    if (url.pathname === "/verify" && request.method === "POST") return handleVerify(request, env);
    if (url.pathname === "/track" && request.method === "GET") return handleTrack(request, env, url);
    if (url.pathname === "/download" && request.method === "GET") return handleDownload(request, env, url);
    return json({ ok: false, message: "not found" }, 404, request, env);
  },
};
