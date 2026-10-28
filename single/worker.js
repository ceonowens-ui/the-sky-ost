// chance-single：CHANCE 單曲卡後台。
// 持卡者打開卡片連結 https://chance1228.com/?album=the-sky&track=im-sorry#single=<鑰匙>，
// 首頁用鑰匙問這裡 /single/check，通過就只解鎖《I'm Sorry》，音檔走 /single/track。
// 鑰匙格式 S1-<卡號三位>-<32 位 hex>；這裡只存 SHA-256，比對卡號＋雜湊都符合才放行。
// 權限只有這一首：不回任何其他曲目、不給下載、不碰 the-sky-ost-api 的會員或兌換碼。
import { CARD_HASHES } from "./cards.js";

const TRACK_OBJECT = "im-sorry.mp3";      // chance-single-audio 裡唯一的檔案
const TRACK_PATH = "sky/03.mp3";          // 首頁 config 的 protectedPath，給前端比對用
const LIMIT = 50;
const KEY_RE = /^S1-(\d{3})-([0-9a-f]{32})$/;

function cors(req, env) {
  const allowed = (env.ALLOW_ORIGINS || "https://chance1228.com").split(",").map((s) => s.trim()).filter(Boolean);
  const origin = req.headers.get("Origin") || "";
  return {
    "Access-Control-Allow-Origin": allowed.includes(origin) ? origin : allowed[0],
    "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS",
    "Access-Control-Allow-Headers": "Range",
    "Access-Control-Expose-Headers": "Content-Range,Content-Length,Accept-Ranges",
    Vary: "Origin",
  };
}
function json(req, env, data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...cors(req, env), "Content-Type": "application/json;charset=utf-8", "Cache-Control": "no-store" },
  });
}
async function sha256(s) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function same(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let n = 0;
  for (let i = 0; i < a.length; i++) n |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return n === 0;
}

/* 回傳卡號（"001"）或 null。關閉、作廢、超出 50、雜湊不符一律 null。 */
async function cardOf(env, key) {
  if (env.SINGLE_ENABLED !== "on") return null;
  const m = KEY_RE.exec(String(key || ""));
  if (!m) return null;
  const ed = m[1], n = parseInt(ed, 10);
  if (n < 1 || n > LIMIT) return null;
  const voided = (env.SINGLE_VOID || "").split(",").map((s) => s.trim()).filter(Boolean);
  if (voided.includes(ed)) return null;
  const want = CARD_HASHES[ed];
  if (!want || !same(await sha256(m[0]), want)) return null;
  return ed;
}

async function handleTrack(req, env, key) {
  const ed = await cardOf(env, key);
  if (!ed) return new Response("unauthorized", { status: 401, headers: cors(req, env) });
  const headers = new Headers(cors(req, env));
  headers.set("accept-ranges", "bytes");
  headers.set("cache-control", "private, no-store");
  headers.set("content-type", "audio/mpeg");
  /* iOS Safari 一定會用 Range 要音檔，沒有 206 就不能拖進度、也常常放不出來 */
  const range = req.headers.get("range");
  const head = await env.SINGLE_AUDIO.head(TRACK_OBJECT);
  if (!head) return new Response("file not found", { status: 404, headers: cors(req, env) });
  const size = head.size;
  if (req.method === "HEAD") {
    headers.set("content-length", String(size));
    return new Response(null, { status: 200, headers });
  }
  const m = range ? /^bytes=(\d*)-(\d*)$/.exec(range.trim()) : null;
  if (m && (m[1] || m[2])) {
    let start = m[1] ? parseInt(m[1], 10) : NaN, end = m[2] ? parseInt(m[2], 10) : size - 1;
    if (isNaN(start)) { start = Math.max(0, size - end); end = size - 1; }   // bytes=-N（最後 N bytes）
    if (end >= size) end = size - 1;
    if (start >= size || start > end) {
      headers.set("content-range", `bytes */${size}`);
      return new Response(null, { status: 416, headers });
    }
    const obj = await env.SINGLE_AUDIO.get(TRACK_OBJECT, { range: { offset: start, length: end - start + 1 } });
    headers.set("etag", obj.httpEtag);
    headers.set("content-range", `bytes ${start}-${end}/${size}`);
    headers.set("content-length", String(end - start + 1));
    return new Response(obj.body, { status: 206, headers });
  }
  const obj = await env.SINGLE_AUDIO.get(TRACK_OBJECT);
  headers.set("etag", obj.httpEtag);
  headers.set("content-length", String(size));
  return new Response(obj.body, { headers });
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (req.method === "OPTIONS") return new Response(null, { headers: cors(req, env) });
    if (req.method !== "GET" && req.method !== "HEAD") return json(req, env, { ok: false, error: "method_not_allowed" }, 405);
    if (url.pathname === "/single/health") {
      return json(req, env, { ok: true, enabled: env.SINGLE_ENABLED === "on", cards: Object.keys(CARD_HASHES).length, limit: LIMIT });
    }
    if (url.pathname === "/single/check") {
      const ed = await cardOf(env, url.searchParams.get("k"));
      if (!ed) return json(req, env, { ok: false, error: "invalid_card" }, 401);
      return json(req, env, { ok: true, edition: ed + "/" + String(LIMIT).padStart(3, "0"), track: TRACK_PATH });
    }
    if (url.pathname === "/single/track") return handleTrack(req, env, url.searchParams.get("k"));
    return json(req, env, { ok: false, error: "not_found" }, 404);
  },
};
