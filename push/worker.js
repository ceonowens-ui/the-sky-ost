// the-sky-push（P1）— THE SKY App 推播獨立後台
// - 只綁自己的 KV（PUSH）。不碰 the-sky-ost-api 的 KV／R2／金流／兌換碼。
// - 發送權限：用 Service Binding `OST` 打 GET /feed/auth（跟發文台同一把 X-Feed-Key），唯讀。
// - VAPID 金鑰：第一次需要時在 Worker 裡自己產生，私鑰只存在 KV，不經過任何人／聊天室。
// - 加密：RFC 8291（aes128gcm）＋ RFC 8292（VAPID），全用 WebCrypto，沒有外部套件。
//
// 路由
//   GET  /health                → {ok, v, kv, vapid, ost}
//   GET  /vapid                 → {ok, key}（公鑰，前端訂閱用）
//   POST /subscribe             {sub, src, lang, unlocked, standalone} → 存訂閱
//   POST /unsubscribe           {endpoint}
//   GET  /stats      X-Feed-Key → {ok, count, bySrc}
//   POST /send       X-Feed-Key {title, body, url, tag, src?, dry?} → 推給所有訂閱（src 可只推某一群）
//   POST /send-one   X-Feed-Key {endpoint, title, body} → 只推一個（測試用）

const V = "P1";
const MAX_TITLE = 40, MAX_BODY = 120;
const SEND_GAP_MS = 20 * 1000;          // 防手滑連按：20 秒內只能推一次
const PER_REQ = 40;                     // 一次請求最多打幾個推播服務（免費方案子請求上限 50）

/* ---------- 小工具 ---------- */
const te = new TextEncoder();
function b64u(buf) {
  const b = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = ""; for (let i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function unb64u(str) {
  str = String(str || "").replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  const bin = atob(str), out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
function cat(...parts) {
  let n = 0; for (const p of parts) n += p.length;
  const out = new Uint8Array(n); let o = 0;
  for (const p of parts) { out.set(p, o); o += p.length; }
  return out;
}
async function sha(s) {
  const d = await crypto.subtle.digest("SHA-256", te.encode(s));
  return b64u(d).slice(0, 32);
}
function clip(s, n) { s = String(s == null ? "" : s).replace(/\s+/g, " ").trim(); return s.length > n ? s.slice(0, n - 1) + "…" : s; }

function cors(req, env) {
  const origin = req.headers.get("Origin") || "";
  const allow = String(env.ALLOW_ORIGINS || "https://chance1228.com").split(",").map(s => s.trim()).filter(Boolean);
  const ok = allow.includes(origin) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  return {
    "Access-Control-Allow-Origin": ok ? origin : allow[0],
    "Vary": "Origin",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,X-Feed-Key",
    "Access-Control-Max-Age": "600",
  };
}
function J(obj, status, req, env) {
  return new Response(JSON.stringify(obj), { status: status || 200, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...cors(req, env) } });
}

/* ---------- VAPID 金鑰（存在 KV，第一次自動產生） ---------- */
async function vapid(env, create) {
  let v = await env.PUSH.get("cfg:vapid", "json");
  if (v || !create) return v;
  const kp = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
  const pub = new Uint8Array(await crypto.subtle.exportKey("raw", kp.publicKey));
  const jwk = await crypto.subtle.exportKey("jwk", kp.privateKey);
  v = { pub: b64u(pub), jwk, at: Date.now() };
  await env.PUSH.put("cfg:vapid", JSON.stringify(v));
  // 若同時有兩個請求都在產生，以 KV 最後留下的為準，再讀一次
  return (await env.PUSH.get("cfg:vapid", "json")) || v;
}
async function vapidHeader(env, v, endpoint) {
  const aud = new URL(endpoint).origin;
  const head = b64u(te.encode(JSON.stringify({ typ: "JWT", alg: "ES256" })));
  const body = b64u(te.encode(JSON.stringify({ aud, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: env.VAPID_SUB || "mailto:heartbeats0693@gmail.com" })));
  const key = await crypto.subtle.importKey("jwk", v.jwk, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, key, te.encode(head + "." + body));
  return "vapid t=" + head + "." + body + "." + b64u(sig) + ", k=" + v.pub;
}

/* ---------- RFC 8291 aes128gcm 加密 ---------- */
async function hkdf(salt, ikm, info, len) {
  const k = await crypto.subtle.importKey("raw", ikm, "HKDF", false, ["deriveBits"]);
  return new Uint8Array(await crypto.subtle.deriveBits({ name: "HKDF", hash: "SHA-256", salt, info }, k, len * 8));
}
export async function encrypt(payload, p256dh, auth) {
  const uaPub = unb64u(p256dh), authSecret = unb64u(auth);
  if (uaPub.length !== 65 || authSecret.length < 16) throw new Error("bad_keys");
  const as = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]);
  const asPub = new Uint8Array(await crypto.subtle.exportKey("raw", as.publicKey));
  const uaKey = await crypto.subtle.importKey("raw", uaPub, { name: "ECDH", namedCurve: "P-256" }, false, []);
  const shared = new Uint8Array(await crypto.subtle.deriveBits({ name: "ECDH", public: uaKey }, as.privateKey, 256));
  const ikm = await hkdf(authSecret, shared, cat(te.encode("WebPush: info\0"), uaPub, asPub), 32);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const cek = await hkdf(salt, ikm, te.encode("Content-Encoding: aes128gcm\0"), 16);
  const nonce = await hkdf(salt, ikm, te.encode("Content-Encoding: nonce\0"), 12);
  const key = await crypto.subtle.importKey("raw", cek, "AES-GCM", false, ["encrypt"]);
  const plain = cat(te.encode(payload), new Uint8Array([2]));
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce }, key, plain));
  const rs = new Uint8Array([0, 0, 16, 0]);   // 4096
  return cat(salt, rs, new Uint8Array([asPub.length]), asPub, ct);
}

async function pushOne(env, v, sub, payload, fetcher) {
  const body = await encrypt(payload, sub.keys.p256dh, sub.keys.auth);
  const r = await (fetcher || fetch)(sub.endpoint, {
    method: "POST",
    headers: {
      "Authorization": await vapidHeader(env, v, sub.endpoint),
      "Content-Encoding": "aes128gcm",
      "Content-Type": "application/octet-stream",
      "TTL": "86400",
      "Urgency": "high",
    },
    body,
  });
  return r.status;
}

/* ---------- 權限：跟發文台同一把 X-Feed-Key，交給主後台判斷 ---------- */
async function role(req, env) {
  const k = req.headers.get("X-Feed-Key") || "";
  if (!k || !env.OST) return null;
  try {
    const r = await env.OST.fetch("https://ost.internal/feed/auth", { headers: { "X-Feed-Key": k } });
    if (!r.ok) return null;
    const d = await r.json();
    return d && d.ok ? (d.role || "artist") : null;
  } catch (e) { return null; }
}

function validSub(s) {
  return s && typeof s.endpoint === "string" && /^https:\/\//.test(s.endpoint) && s.endpoint.length < 1024 &&
    s.keys && typeof s.keys.p256dh === "string" && typeof s.keys.auth === "string";
}

async function listSubs(env, src, withSrc) {
  const out = []; let cursor;
  do {
    const page = await env.PUSH.list({ prefix: "sub:", cursor });
    for (const k of page.keys) {
      const m = k.metadata || {};
      if (src && m.src !== src) continue;
      out.push(withSrc ? { name: k.name, src: m.src || "?" } : k.name);
    }
    cursor = page.list_complete ? null : page.cursor;
  } while (cursor);
  return out;
}

export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    const p = url.pathname.replace(/\/+$/, "") || "/";
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(req, env) });

    try {
      if (p === "/health") {
        const v = env.PUSH ? await vapid(env, false) : null;
        return J({ ok: true, v: V, kv: !!env.PUSH, vapid: !!v, ost: !!env.OST }, 200, req, env);
      }
      if (!env.PUSH) return J({ ok: false, err: "kv_missing" }, 500, req, env);

      if (p === "/vapid" && req.method === "GET") {
        const v = await vapid(env, true);
        return J({ ok: true, key: v.pub }, 200, req, env);
      }

      if (p === "/subscribe" && req.method === "POST") {
        const d = await req.json().catch(() => ({}));
        if (!validSub(d.sub)) return J({ ok: false, err: "bad_sub" }, 400, req, env);
        const id = "sub:" + await sha(d.sub.endpoint);
        const meta = { src: clip(d.src || "test", 12), at: Date.now() };
        const rec = { sub: { endpoint: d.sub.endpoint, keys: { p256dh: d.sub.keys.p256dh, auth: d.sub.keys.auth } },
          lang: clip(d.lang, 8), unlocked: !!d.unlocked, standalone: !!d.standalone, ua: clip(req.headers.get("User-Agent"), 160), at: meta.at };
        await env.PUSH.put(id, JSON.stringify(rec), { metadata: meta });
        return J({ ok: true }, 200, req, env);
      }

      if (p === "/unsubscribe" && req.method === "POST") {
        const d = await req.json().catch(() => ({}));
        if (!d.endpoint) return J({ ok: false, err: "bad_endpoint" }, 400, req, env);
        await env.PUSH.delete("sub:" + await sha(d.endpoint));
        return J({ ok: true }, 200, req, env);
      }

      // ↓ 以下要發文台金鑰
      if (p === "/stats" || p === "/send" || p === "/send-one") {
        const r = await role(req, env);
        if (!r) return J({ ok: false, err: "unauthorized" }, 401, req, env);

        if (p === "/stats") {
          const keys = await listSubs(env, null, true);
          const bySrc = {};
          for (const k of keys) bySrc[k.src] = (bySrc[k.src] || 0) + 1;
          const last = await env.PUSH.get("log:last", "json");
          return J({ ok: true, count: keys.length, bySrc, last }, 200, req, env);
        }

        if (req.method !== "POST") return J({ ok: false, err: "method" }, 405, req, env);
        const d = await req.json().catch(() => ({}));
        const title = clip(d.title || "THE SKY", MAX_TITLE);
        const body = clip(d.body || "CHANCE 發了新動態", MAX_BODY);
        const link = /^\.?\/?[\w\-./?=&%]*$/.test(d.url || "") && d.url ? d.url : "./test.html";
        const payload = JSON.stringify({ t: title, b: body, u: link, tag: clip(d.tag || "signal", 24), at: Date.now() });
        const v = await vapid(env, true);

        if (p === "/send-one") {
          if (!d.endpoint) return J({ ok: false, err: "bad_endpoint" }, 400, req, env);
          const rec = await env.PUSH.get("sub:" + await sha(d.endpoint), "json");
          if (!rec) return J({ ok: false, err: "not_found" }, 404, req, env);
          const st = await pushOne(env, v, rec.sub, payload);
          return J({ ok: st >= 200 && st < 300, status: st }, 200, req, env);
        }

        // /send
        const keys = await listSubs(env, d.src || null);
        if (d.dry) return J({ ok: true, dry: true, count: keys.length }, 200, req, env);
        const last = await env.PUSH.get("log:last", "json");
        if (last && Date.now() - last.at < SEND_GAP_MS) return J({ ok: false, err: "too_soon", wait: Math.ceil((SEND_GAP_MS - (Date.now() - last.at)) / 1000) }, 429, req, env);

        let sent = 0, gone = 0, failed = 0, skipped = 0;
        const batch = keys.slice(0, PER_REQ);
        skipped = keys.length - batch.length;
        await Promise.all(batch.map(async (k) => {
          const rec = await env.PUSH.get(k, "json");
          if (!rec) return;
          try {
            const st = await pushOne(env, v, rec.sub, payload);
            if (st >= 200 && st < 300) sent++;
            else if (st === 404 || st === 410) { gone++; await env.PUSH.delete(k); }
            else failed++;
          } catch (e) { failed++; }
        }));
        const log = { at: Date.now(), by: r, title, body, total: keys.length, sent, gone, failed, skipped };
        await env.PUSH.put("log:last", JSON.stringify(log));
        return J({ ok: true, ...log }, 200, req, env);
      }

      return J({ ok: false, err: "not_found" }, 404, req, env);
    } catch (e) {
      return J({ ok: false, err: "server", msg: String(e && e.message || e).slice(0, 120) }, 500, req, env);
    }
  },
};
