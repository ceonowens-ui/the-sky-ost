/* stats-track.js · THE SKY 匿名使用統計埋點（S1，2026-10-22；先只在 test.html 載入）
 * 收什麼：分頁停留秒數、每首歌播放次數／聽了幾秒／是否聽完、30 秒試聽、每次使用時間、裝置種類。
 * 國家／城市由 Worker 從連線判斷（不開 GPS）。不送 email、兌換碼、網址參數、任何可辨識個人的東西。
 * 送到獨立的 the-sky-stats Worker；送不出去就算了，不影響 App。
 * 要在主程式之前載入（<head>），才能接到播放器的 Audio。 */
(function () {
  "use strict";
  var EP = "https://the-sky-stats.anthonywen0693.workers.dev/ev";
  if (/[?&](tune|t267|t264)=/.test(location.search)) return;   /* 調版面／預覽模式不算使用 */
  var OA = window.Audio, audio = null;
  window.Audio = function () { var a = new OA(); if (!audio) { audio = a; hookAudio(a); } return a; };
  window.Audio.prototype = OA.prototype;

  var sid = "";
  try { sid = localStorage.getItem("sky:stats:sid") || ""; if (!sid) { sid = "s" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10); localStorage.setItem("sky:stats:sid", sid); } } catch (e) { sid = "s" + Math.random().toString(36).slice(2, 12); }
  var ua = navigator.userAgent, dev = /iPhone|iPad|iPod/.test(ua) ? "ios" : /Android/.test(ua) ? "android" : /Mobile/.test(ua) ? "mobile" : "desktop";
  var pwa = !!(navigator.standalone || (window.matchMedia && matchMedia("(display-mode: standalone)").matches));
  var build = "";
  var queue = [], NAMES = { player: "PLAY", mood: "SIGNAL", merch: "SHOP", purchase: "OWN", lucky: "LUCKY", gallery: "GALLERY" };

  function push(e) { e.at = Date.now(); queue.push(e); if (queue.length >= 40) flush(); }
  function flush() {
    if (!queue.length) return;
    if (!build) { var b = document.getElementById("__build"); build = b ? b.textContent.trim() : ""; }
    var body = JSON.stringify({ sid: sid, dev: dev, pwa: pwa, build: build, ev: queue.splice(0, 60) });
    try {
      if (navigator.sendBeacon && navigator.sendBeacon(EP, new Blob([body], { type: "text/plain" }))) return;
    } catch (e) {}
    try { fetch(EP, { method: "POST", body: body, headers: { "content-type": "text/plain" }, keepalive: true, mode: "cors", credentials: "omit" }).catch(function () {}); } catch (e) {}
  }

  /* ---- 分頁停留與每次使用時間（每秒數一次，只算畫面看得到的時候） ---- */
  var curTab = null, tabSecs = 0, sessSecs = 0;
  function activeTab() { var s = document.querySelector(".screen.active"); return s ? (NAMES[s.id.replace(/^screen-/, "")] || s.id) : null; }
  function tick() {
    if (document.visibilityState !== "visible") return;
    var t = activeTab(); if (!t) return;
    if (t !== curTab) { closeTab(); curTab = t; tabSecs = 0; }
    tabSecs++; sessSecs++;
  }
  function closeTab() { if (curTab && tabSecs > 0) push({ t: "tab", name: curTab, secs: tabSecs, n: 1 }); tabSecs = 0; }
  setInterval(tick, 1000);
  setInterval(function () { if (queue.length) flush(); }, 45000);

  function endSession() {
    closeTab(); closePlay(false);
    if (sessSecs > 0) { push({ t: "session", secs: sessSecs, n: 1 }); sessSecs = 0; }
    flush();
  }
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") endSession(); });
  window.addEventListener("pagehide", endSession);
  push({ t: "open", n: 1 });

  /* ---- 播放：哪首歌、聽了幾秒、有沒有聽完、30 秒試聽 ---- */
  var cur = null, lastT = 0;
  function trackOf(src) {
    var cfg = window.ALBUM_CONFIG || {}, tracks = cfg.tracks || [];
    var s = ""; try { s = decodeURIComponent(src || ""); } catch (e) { s = src || ""; }
    if (/im-sorry-30s/.test(s)) return { t: "preview", album: cfg.albumId || "the-sky", track: 1, name: "I'm Sorry (30s)" };
    for (var i = 0; i < tracks.length; i++) {
      var tr = tracks[i], pp = tr.protectedPath, ap = tr.audioPath;
      if ((pp && s.indexOf(pp) >= 0) || (ap && s.indexOf(ap.replace(/^\.?\//, "")) >= 0)) return { t: "play", album: cfg.albumId || "", track: tr.n, name: tr.title || "" };
    }
    return null;
  }
  function closePlay(done) {
    if (!cur) return;
    if (cur.secs >= 1 || cur.n) push({ t: cur.t, name: cur.name, album: cur.album, track: cur.track, secs: Math.round(cur.secs), n: cur.n, done: done ? 1 : 0 });
    cur = null;
  }
  function hookAudio(a) {
    a.addEventListener("play", function () {
      var info = trackOf(a.src || a.currentSrc); if (!info) return;
      if (!cur || cur.src !== (a.src || a.currentSrc)) { closePlay(false); cur = { t: info.t, name: info.name, album: info.album, track: info.track, src: a.src || a.currentSrc, secs: 0, n: 0 }; }
      if ((a.currentTime || 0) < 1.5) cur.n++;   /* 從頭播才算一次播放；暫停後續播不重複算 */
      lastT = a.currentTime || 0;
    });
    a.addEventListener("timeupdate", function () {
      if (!cur || a.paused) { lastT = a.currentTime || 0; return; }
      var t = a.currentTime || 0, d = t - lastT; lastT = t;
      if (d > 0 && d < 2) cur.secs += d;
    });
    a.addEventListener("seeking", function () { lastT = a.currentTime || 0; });
    a.addEventListener("ended", function () { closePlay(true); });
    a.addEventListener("emptied", function () { closePlay(false); });
  }
})();
