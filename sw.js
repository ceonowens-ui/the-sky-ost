/* CHANCE App Service Worker — 版本號跟著 build 印章走，每次部署要改 */
var VERSION = "B65";
var CACHE = "chance-app-" + VERSION;

self.addEventListener("install", function (e) {
  /* 不搶跑：等頁面上的「點此更新」按鈕叫我們接手 */
  e.waitUntil(caches.open(CACHE));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("message", function (e) {
  if (e.data && e.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;              // Worker API 等跨域不碰
  if (req.method !== "GET") return;
  if (/\.(mp3|wav|m4a|mp4)$/i.test(url.pathname)) return;           // 音檔不經過 SW（iOS Range 串流）
  if (url.pathname.endsWith("/content.json")) return;           // 內容檔永遠即時抓

  if (req.mode === "navigate") {
    /* 頁面：網路優先，失敗用快取（基本離線） */
    e.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
        return res;
      }).catch(function () { return caches.match(req); })
    );
    return;
  }
  /* 圖片等靜態資源：快取優先、背景更新 */
  e.respondWith(
    caches.match(req).then(function (hit) {
      var net = fetch(req).then(function (res) {
        if (res && res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
        return res;
      }).catch(function () { return hit; });
      return hit || net;
    })
  );
});
