// chance-single 本機測試：node single/test.mjs <001 的鑰匙>
// 用記憶體假 R2（隨機 bytes），不連 Cloudflare。
import worker from "./worker.js";
import assert from "node:assert/strict";

const KEY = process.argv[2];
if (!KEY) { console.error("用法：node single/test.mjs <001 的鑰匙>"); process.exit(2); }

const AUDIO = new Uint8Array(1000).map((_, i) => i % 251);
const r2 = {
  async head(k) { return k === "im-sorry.mp3" ? { size: AUDIO.length } : null; },
  async get(k, o) {
    if (k !== "im-sorry.mp3") return null;
    const r = o && o.range, b = r ? AUDIO.slice(r.offset, r.offset + r.length) : AUDIO;
    return { body: b, httpEtag: '"t"' };
  },
};
const env = (over = {}) => ({ SINGLE_AUDIO: r2, SINGLE_ENABLED: "on", SINGLE_VOID: "", ALLOW_ORIGINS: "https://chance1228.com", ...over });
const go = (path, init, e = env()) => worker.fetch(new Request("https://x" + path, init), e);
const k = (s) => encodeURIComponent(s);
const flip = KEY.slice(0, -1) + (KEY.endsWith("0") ? "1" : "0");
let n = 0;
const t = async (name, fn) => { await fn(); n++; console.log("ok", name); };

await t("health", async () => { const d = await (await go("/single/health")).json(); assert.equal(d.ok, true); assert.equal(d.enabled, true); assert.equal(d.cards, 1); });
await t("check 有效卡", async () => { const r = await go("/single/check?k=" + k(KEY)); assert.equal(r.status, 200); const d = await r.json(); assert.equal(d.edition, "001/050"); assert.equal(d.track, "sky/03.mp3"); });
await t("check 錯一碼", async () => assert.equal((await go("/single/check?k=" + k(flip))).status, 401));
await t("check 沒鑰匙", async () => assert.equal((await go("/single/check")).status, 401));
await t("check 未發的卡號", async () => assert.equal((await go("/single/check?k=" + k(KEY.replace("S1-001-", "S1-002-")))).status, 401));
await t("check 卡號 051", async () => assert.equal((await go("/single/check?k=" + k(KEY.replace("S1-001-", "S1-051-")))).status, 401));
await t("總開關 off", async () => assert.equal((await go("/single/check?k=" + k(KEY), {}, env({ SINGLE_ENABLED: "off" }))).status, 401));
await t("總開關沒設定", async () => assert.equal((await go("/single/check?k=" + k(KEY), {}, env({ SINGLE_ENABLED: undefined }))).status, 401));
await t("作廢 001", async () => assert.equal((await go("/single/track?k=" + k(KEY), {}, env({ SINGLE_VOID: "005, 001" }))).status, 401));
await t("track 整檔", async () => { const r = await go("/single/track?k=" + k(KEY)); assert.equal(r.status, 200); assert.equal((await r.arrayBuffer()).byteLength, 1000); assert.equal(r.headers.get("accept-ranges"), "bytes"); assert.equal(r.headers.get("content-type"), "audio/mpeg"); });
await t("track Range 0-1", async () => { const r = await go("/single/track?k=" + k(KEY), { headers: { Range: "bytes=0-1" } }); assert.equal(r.status, 206); assert.equal(r.headers.get("content-range"), "bytes 0-1/1000"); assert.equal((await r.arrayBuffer()).byteLength, 2); });
await t("track Range 開放結尾", async () => { const r = await go("/single/track?k=" + k(KEY), { headers: { Range: "bytes=990-" } }); assert.equal(r.status, 206); assert.equal(r.headers.get("content-range"), "bytes 990-999/1000"); });
await t("track Range 最後 N", async () => { const r = await go("/single/track?k=" + k(KEY), { headers: { Range: "bytes=-10" } }); assert.equal(r.status, 206); assert.equal(r.headers.get("content-range"), "bytes 990-999/1000"); });
await t("track Range 超出", async () => assert.equal((await go("/single/track?k=" + k(KEY), { headers: { Range: "bytes=5000-" } })).status, 416));
await t("track Range 亂寫 → 整檔", async () => assert.equal((await go("/single/track?k=" + k(KEY), { headers: { Range: "items=1-2" } })).status, 200));
await t("track HEAD", async () => { const r = await go("/single/track?k=" + k(KEY), { method: "HEAD" }); assert.equal(r.status, 200); assert.equal(r.headers.get("content-length"), "1000"); });
await t("track 錯鑰匙", async () => assert.equal((await go("/single/track?k=" + k(flip))).status, 401));
await t("沒有其他曲目路徑", async () => { for (const p of ["/track?file=sky/01.mp3", "/single/track/sky/01.mp3", "/download"]) assert.equal((await go(p + "&k=" + k(KEY))).status, 404); });
await t("POST 拒絕", async () => assert.equal((await go("/single/check?k=" + k(KEY), { method: "POST" })).status, 405));
await t("CORS 只給正式站", async () => {
  assert.equal((await go("/single/check?k=" + k(KEY), { headers: { Origin: "https://chance1228.com" } })).headers.get("access-control-allow-origin"), "https://chance1228.com");
  assert.equal((await go("/single/check?k=" + k(KEY), { headers: { Origin: "https://evil.example" } })).headers.get("access-control-allow-origin"), "https://chance1228.com");
});
console.log(`\n${n} 項通過`);
