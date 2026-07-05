/**
 * ALBUM APP TEMPLATE — Cloudflare Worker（付費曲驗證 / 串流後端）
 * =====================================================================
 * 這是「經過實測修正」的 Worker。換新專輯時只改最上面的 WORKER_CONFIG，
 * 下面的邏輯不要動（兩個關鍵修正都在裡面）：
 *
 *   [FIX 1] Stripe 金額判斷：TWD 是「兩位小數」貨幣，amount_total 會 ×100
 *           （NT$299 = 29900、NT$599 = 59900）。分級門檻要用「兩個價位
 *           換算後的中間值」，不能直接拿標價比。
 *   [FIX 2] /track 支援 HTTP Range（回 206）—— iPhone Safari 串流 <audio>
 *           的必要條件。拿掉 iPhone 就播不了付費曲。
 *
 * 端點：
 *   POST /stripe-webhook  付款完成 → 產生兌換碼 → 存 KV → Resend 寄信
 *   POST /verify          前端解鎖：驗證 email + 兌換碼（server-side）
 *   GET  /track           已解鎖串流付費 MP3（basic / deluxe 都可，支援 Range）
 *   GET  /download        僅 deluxe：下載無損 WAV
 *
 * 需要的綁定（wrangler.toml 或 Dashboard）：
 *   KV binding:  CODES     （兌換碼）
 *   R2 binding:  AUDIO     （私有音檔，key 要和下方白名單一致）
 *   環境變數:    STRIPE_WEBHOOK_SECRET, RESEND_API_KEY, RESEND_FROM,
 *                ALLOWED_ORIGINS（你的前端網址，逗號分隔）
 *
 * ⚠️ secret 一律放環境變數，「絕對不要」寫進前端或這個檔案。
 * ⚠️ Resend 未驗證網域前只能寄給自己帳號的 email；上線前要驗證網域
 *    並把 RESEND_FROM 換成自己網域的寄件人。
 */

/* =====================================================================
 * ① 換專輯只改這一區
 * =================================================================== */
const WORKER_CONFIG = {
  ALBUM_NAME: "THE SKY",                  // 兌換信件的專輯名
  CODE_PREFIX: "SKY1",                    // 兌換碼前綴（SKY1-XXXX-XXXX）
  BASIC_LABEL: "數位專輯",
  DELUXE_LABEL: "典藏版（+WAV）",

  // [FIX 1] 分級門檻：TWD ×100 之後的「中間值」。
  // 價位 299/599 → 29900/59900 → 門檻 45000。
  // 若改價（例如 399/799 → 39900/79900），門檻改成 60000 之類的中間值。
  DELUXE_AMOUNT_THRESHOLD: 45000,

  // 付費 MP3 白名單 = R2 的 object key（含資料夾前綴）。
  // ⚠️ 必須與前端 album-config.js 每首歌的 protectedPath 完全一致。
  // （04~10 共 7 首；05、08 是 .wav，副檔名要對，需與 R2 key 完全一致）
  PROTECTED_FILES: new Set([
    "sky/04.mp3", "sky/05.wav", "sky/06.mp3", "sky/07.mp3",
    "sky/08.wav", "sky/09.mp3", "sky/10.mp3",
  ]),

  // WAV 白名單（deluxe 典藏版下載專用）
  PROTECTED_WAV_FILES: new Set([]),  // THE SKY 尚未開典藏版，先留空

  // ⚠️ DEMO 測試碼（免付費解鎖，僅供開發）。email 固定 test@test.com。
  //    正式上線：把這個物件清空 {}（前端 album-config.js 的 demoCodes 也要清）。
  // ⚠️ DEMO 碼的 email 必須 = 兌換時輸入的 email，付費曲才串得出來
  DEMO_CODES: {
    "SKY1DEMO": { email: "anthonywen0693@gmail.com", product: "299" },
  },
};

/* =====================================================================
 * ② 以下邏輯不需要為新專輯修改
 * =================================================================== */

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
  return `${WORKER_CONFIG.CODE_PREFIX}-${s.slice(0, 4)}-${s.slice(4, 8)}`;
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
  const C = WORKER_CONFIG;
  const productName = `${C.ALBUM_NAME} ${product === "599" ? C.DELUXE_LABEL : C.BASIC_LABEL}`;
  const html = `
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;padding:32px;color:#3d3d44;background:#faf7f2">
      <h2 style="color:#3d3d44">感謝購買《${C.ALBUM_NAME}》</h2>
      <p>您購買的方案：<b>${productName}</b></p>
      <p>請回到 app 的「解鎖」頁，輸入以下資訊：</p>
      <p style="margin:4px 0">Email：${email}</p>
      <p style="font-size:22px;font-weight:bold;letter-spacing:2px;color:#6b8fc7;margin:8px 0">兌換碼：${code}</p>
      <p style="font-size:13px;color:#9a93a8">請保留這封信，之後在其他裝置上也能用這組 Email + 兌換碼解鎖。</p>
    </div>`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.RESEND_FROM || "Album <onboarding@resend.dev>",
      to: email,
      subject: `《${C.ALBUM_NAME}》兌換碼`,
      html,
    }),
  });
  if (!res.ok) console.log("Resend send failed", res.status, await res.text());
}

/* 付款完成 → 產碼 → 存 KV（綁定購買 email）→ 寄信。
 * 這才是「正式的」解鎖來源；前端 localStorage 只是顯示狀態。 */
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
      // [FIX 1] 見 WORKER_CONFIG.DELUXE_AMOUNT_THRESHOLD 的說明
      const product = amount >= WORKER_CONFIG.DELUXE_AMOUNT_THRESHOLD ? "599" : "299";
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

  const demo = WORKER_CONFIG.DEMO_CODES[code];
  if (demo) {
    if (demo.email !== email) return json({ ok: false, message: "兌換碼或 email 不正確" }, 403, request, env);
    return json({ ok: true, product: demo.product }, 200, request, env);
  }

  const rec = await env.CODES.get(code);
  if (!rec) return json({ ok: false, message: "兌換碼或 email 不正確" }, 404, request, env);
  const data = JSON.parse(rec);
  // ⚠️ 解鎖 email 必須等於「購買時的 email」（大小寫不拘）
  if ((data.email || "").trim().toLowerCase() !== email) {
    return json({ ok: false, message: "兌換碼或 email 不正確" }, 403, request, env);
  }
  return json({ ok: true, product: data.product }, 200, request, env);
}

/* 共用驗證：每一次音檔請求都重新驗（server-side），
 * 所以就算前端 localStorage 被竄改也拿不到檔案。 */
async function authenticate(env, email, code) {
  if (!email || !code) return null;
  const demo = WORKER_CONFIG.DEMO_CODES[code];
  if (demo) return demo.email === email ? demo : null;
  const rec = await env.CODES.get(code);
  if (!rec) return null;
  const data = JSON.parse(rec);
  if ((data.email || "").trim().toLowerCase() !== email) return null;
  return data;
}

/* [FIX 2] /track：支援 HTTP Range（回 206）。iPhone Safari 播 <audio> 必要。 */
async function handleTrack(request, env, url) {
  const file = url.searchParams.get("file") || "";
  const email = (url.searchParams.get("email") || "").trim().toLowerCase();
  const code = (url.searchParams.get("code") || "").trim().toUpperCase();

  if (!WORKER_CONFIG.PROTECTED_FILES.has(file)) {
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
    if (!headers.get("content-type")) headers.set("content-type", "audio/mpeg");
    headers.set("content-range", `bytes ${start}-${end}/${size}`);
    headers.set("content-length", String(end - start + 1));
    return new Response(obj.body, { status: 206, headers });
  }

  const obj = await env.AUDIO.get(file);
  if (!obj) return new Response("file not found", { status: 404, headers: corsHeaders(request, env) });
  obj.writeHttpMetadata(headers);
  headers.set("etag", obj.httpEtag);
  if (!headers.get("content-type")) headers.set("content-type", "audio/mpeg");
  return new Response(obj.body, { headers });
}

/* deluxe 典藏版專屬：下載無損 WAV */
async function handleDownload(request, env, url) {
  const file = url.searchParams.get("file") || "";
  const email = (url.searchParams.get("email") || "").trim().toLowerCase();
  const code = (url.searchParams.get("code") || "").trim().toUpperCase();

  if (!WORKER_CONFIG.PROTECTED_WAV_FILES.has(file)) {
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
