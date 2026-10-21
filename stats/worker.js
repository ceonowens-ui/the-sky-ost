/* the-sky-stats · 獨立的匿名使用統計 Worker（S1，2026-10-22）
 * 只收：分頁停留秒數、歌曲播放次數／秒數／是否聽完、30 秒試聽、每次使用時間、國家／城市（Cloudflare 判斷）、裝置種類。
 * 不收 email、兌換碼、IP、GPS。和 the-sky-ost-api／金流／解鎖完全無關。
 * 綁定：D1 `DB`（the-sky-stats）；Secret `REPORT_KEY`（看報表用）。
 * 路由：POST /ev（前端 sendBeacon）、GET /report?key=…&days=30、GET /health
 */
var ALLOW = ["https://chance1228.com", "https://www.chance1228.com", "http://localhost", "http://127.0.0.1"];
var KINDS = { tab: 1, play: 1, preview: 1, session: 1, signal: 1, open: 1 };

function cors(req) {
  var o = req.headers.get("Origin") || "";
  var ok = ALLOW.some(function (a) { return o === a || o.indexOf(a + ":") === 0; });
  return { "Access-Control-Allow-Origin": ok ? o : ALLOW[0], "Access-Control-Allow-Methods": "POST, GET, OPTIONS", "Access-Control-Allow-Headers": "content-type", "Access-Control-Max-Age": "86400", "Vary": "Origin" };
}
function json(obj, status, extra) {
  return new Response(JSON.stringify(obj), { status: status || 200, headers: Object.assign({ "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }, extra || {}) });
}
function clampStr(v, n) { v = v == null ? null : String(v); return v && v.length > n ? v.slice(0, n) : v; }
function num(v, max) { v = Number(v); if (!isFinite(v) || v < 0) return 0; return max != null && v > max ? max : v; }

async function ingest(req, env) {
  var H = cors(req);
  var text = await req.text();
  if (text.length > 20000) return json({ ok: false, reason: "too_big" }, 413, H);
  var body; try { body = JSON.parse(text); } catch (e) { return json({ ok: false, reason: "bad_json" }, 400, H); }
  var ev = Array.isArray(body.ev) ? body.ev.slice(0, 60) : [];
  if (!ev.length) return json({ ok: true, n: 0 }, 200, H);
  var cf = req.cf || {};
  var sid = clampStr(body.sid, 40) || "anon";
  var dev = clampStr(body.dev, 16) || "other";
  var pwa = body.pwa ? 1 : 0;
  var build = clampStr(body.build, 16) || "";
  var country = clampStr(cf.country, 8) || null, city = clampStr(cf.city, 48) || null;
  var now = Date.now();
  var stmt = env.DB.prepare("INSERT INTO events (ts,sid,kind,name,secs,n,album,track,done,country,city,dev,pwa,build,extra) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
  var rows = [];
  ev.forEach(function (e) {
    if (!e || !KINDS[e.t]) return;
    var ts = num(e.at, now + 60000) || now; if (ts < now - 7 * 864e5) ts = now;   /* 太舊或壞掉的時間戳一律用現在 */
    rows.push(stmt.bind(ts, sid, e.t, clampStr(e.name, 80), num(e.secs, 86400), num(e.n, 1000) | 0, clampStr(e.album, 32), e.track == null ? null : (num(e.track, 999) | 0), e.done ? 1 : 0, country, city, dev, pwa, build, e.extra ? clampStr(JSON.stringify(e.extra), 200) : null));
  });
  if (rows.length) await env.DB.batch(rows);
  return json({ ok: true, n: rows.length }, 200, H);
}

async function report(req, env) {
  var u = new URL(req.url);
  var key = u.searchParams.get("key") || req.headers.get("x-report-key") || "";
  if (!env.REPORT_KEY || key !== env.REPORT_KEY) return json({ ok: false, reason: "unauthorized" }, 401);
  var days = Math.max(1, Math.min(180, Number(u.searchParams.get("days")) || 30));
  var since = Date.now() - days * 864e5;
  var q = function (sql, params) { var s = env.DB.prepare(sql); return (params ? s.bind.apply(s, params) : s).all().then(function (r) { return r.results || []; }); };
  var TZ = "(ts/1000 + 8*3600)";   /* 台北時間 */
  var r = {};
  r.totals = (await q("SELECT COUNT(DISTINCT sid) AS users, COUNT(*) AS events, COUNT(DISTINCT country) AS countries, MIN(ts) AS first_ts, MAX(ts) AS last_ts FROM events WHERE ts>=?", [since]))[0];
  r.byDay = await q("SELECT date(" + TZ + ",'unixepoch') AS day, COUNT(DISTINCT sid) AS users, SUM(CASE WHEN kind='session' THEN secs ELSE 0 END) AS secs, SUM(CASE WHEN kind='open' THEN 1 ELSE 0 END) AS opens FROM events WHERE ts>=? GROUP BY day ORDER BY day", [since]);
  r.byHour = await q("SELECT CAST(strftime('%H'," + TZ + ",'unixepoch') AS INTEGER) AS hour, COUNT(DISTINCT sid || date(" + TZ + ",'unixepoch')) AS user_days, SUM(CASE WHEN kind='tab' THEN secs ELSE 0 END) AS secs FROM events WHERE ts>=? GROUP BY hour ORDER BY hour", [since]);
  r.byWeekday = await q("SELECT CAST(strftime('%w'," + TZ + ",'unixepoch') AS INTEGER) AS wd, COUNT(DISTINCT sid || date(" + TZ + ",'unixepoch')) AS user_days FROM events WHERE ts>=? GROUP BY wd ORDER BY wd", [since]);
  r.tabs = await q("SELECT name, SUM(secs) AS secs, COUNT(*) AS visits, COUNT(DISTINCT sid) AS users FROM events WHERE kind='tab' AND ts>=? GROUP BY name ORDER BY secs DESC", [since]);
  r.tracks = await q("SELECT album, track, MAX(name) AS title, SUM(n) AS plays, SUM(secs) AS secs, SUM(done) AS completes, COUNT(DISTINCT sid) AS listeners FROM events WHERE kind='play' AND ts>=? GROUP BY album, track ORDER BY plays DESC", [since]);
  r.preview = (await q("SELECT SUM(n) AS plays, SUM(secs) AS secs, SUM(done) AS completes, COUNT(DISTINCT sid) AS listeners FROM events WHERE kind='preview' AND ts>=?", [since]))[0];
  r.signal = await q("SELECT name, SUM(secs) AS secs, COUNT(*) AS views, COUNT(DISTINCT sid) AS users FROM events WHERE kind='signal' AND ts>=? GROUP BY name ORDER BY secs DESC LIMIT 50", [since]);
  r.geo = await q("SELECT country, city, COUNT(DISTINCT sid) AS users, COUNT(*) AS events FROM events WHERE ts>=? GROUP BY country, city ORDER BY users DESC LIMIT 60", [since]);
  r.devices = await q("SELECT dev, pwa, COUNT(DISTINCT sid) AS users FROM events WHERE ts>=? GROUP BY dev, pwa ORDER BY users DESC", [since]);
  r.sessions = (await q("SELECT COUNT(*) AS n, AVG(secs) AS avg_secs, SUM(secs) AS secs FROM events WHERE kind='session' AND ts>=?", [since]))[0];
  r.builds = await q("SELECT build, COUNT(DISTINCT sid) AS users FROM events WHERE ts>=? GROUP BY build ORDER BY users DESC", [since]);
  r.days = days; r.generatedAt = new Date().toISOString(); r.tz = "Asia/Taipei"; r.ok = true;
  return json(r);
}

export default {
  async fetch(req, env) {
    var u = new URL(req.url);
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(req) });
    try {
      if (u.pathname === "/ev" && req.method === "POST") return await ingest(req, env);
      if (u.pathname === "/report" && req.method === "GET") return await report(req, env);
      if (u.pathname === "/health") return json({ ok: true, v: "S1", db: !!env.DB, key: !!env.REPORT_KEY });
      return json({ ok: false, reason: "not_found" }, 404);
    } catch (e) {
      return json({ ok: false, reason: "error", message: String(e && e.message || e).slice(0, 200) }, 500, cors(req));
    }
  }
};
