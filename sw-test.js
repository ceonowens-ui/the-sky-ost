/* THE SKY 測試版專用 Service Worker（B325T）— 只管 test.html（註冊時 scope 設成 ./test.html）
 * 只做推播：收到推播 → 跳通知＋主畫面圖示的數字 +1；點通知 → 打開 App。
 * 不攔網路請求、不做快取、不搶已經打開的頁面（不 claim）→ 不影響正式版 sw.js，也不會讓頁面突然重新整理。
 * 推播後台：the-sky-push（獨立 Worker）。 */
var SWT = "B325T";

self.addEventListener("install", function () { self.skipWaiting(); });

/* 小計數器：主畫面圖示上的數字（頁面打開時會歸零） */
function idb(fn) {
  return new Promise(function (res) {
    try {
      var rq = indexedDB.open("sky-push", 1);
      rq.onupgradeneeded = function () { rq.result.createObjectStore("kv"); };
      rq.onsuccess = function () { var db = rq.result; try { fn(db, function (v) { db.close(); res(v); }); } catch (e) { db.close(); res(0); } };
      rq.onerror = function () { res(0); };
    } catch (e) { res(0); }
  });
}
function bump() {
  return idb(function (db, done) {
    var st = db.transaction("kv", "readwrite").objectStore("kv");
    var g = st.get("badge");
    g.onsuccess = function () { var n = (+g.result || 0) + 1; st.put(n, "badge"); done(n); };
    g.onerror = function () { done(1); };
  });
}

self.addEventListener("push", function (e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { try { d = { b: e.data.text() }; } catch (y) {} }
  var title = d.t || "THE SKY", body = d.b || "CHANCE 發了新動態";
  /* iPhone 規定：每次推播都一定要跳出通知，不然會被取消訂閱 */
  e.waitUntil(Promise.all([
    self.registration.showNotification(title, {
      body: body,
      icon: "assets/images/icon-180.png",
      badge: "assets/images/icon-180.png",
      tag: "sky-" + (d.at || Date.now()),
      data: { u: d.u || "./test.html" }
    }),
    bump().then(function (n) {
      if (self.navigator && self.navigator.setAppBadge) return self.navigator.setAppBadge(n).catch(function () {});
    })
  ]));
});

self.addEventListener("notificationclick", function (e) {
  e.notification.close();
  var u = new URL((e.notification.data && e.notification.data.u) || "./test.html", self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (cs) {
    for (var i = 0; i < cs.length; i++) {
      if (cs[i].url.indexOf("/test.html") > -1 && "focus" in cs[i]) return cs[i].focus();
    }
    return self.clients.openWindow ? self.clients.openWindow(u) : null;
  }));
});

/* 瀏覽器換了訂閱（少見）→ 把新的告訴後台 */
self.addEventListener("pushsubscriptionchange", function (e) {
  var ns = e.newSubscription;
  if (!ns) return;
  e.waitUntil(fetch("https://the-sky-push.anthonywen0693.workers.dev/subscribe", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sub: ns.toJSON(), src: "test" })
  }).catch(function () {}));
});
