/* THE SKY 測試版專用 Service Worker（B325T）— 只管 test.html（註冊時 scope 設成 ./test.html）
 * 只做推播：收到推播 → 跳通知＋主畫面圖示的數字 +1；點通知 → 打開 App。
 * 不攔網路請求、不做快取、不搶已經打開的頁面（不 claim）→ 不影響正式版 sw.js，也不會讓頁面突然重新整理。
 * 推播後台：the-sky-push（獨立 Worker）。 */
var SWT = "B327T";

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

/* B327T：目的地只接受同源的 test.html（防止被帶去正式頁或外站）；
   已經開著的 test.html 視窗：網址不同就先 navigate 再 focus；navigate／focus 失敗才另開視窗。 */
function swtTarget(u) {
  var home = new URL("./test.html", self.registration.scope);
  try {
    var t = new URL(u || "./test.html", self.registration.scope);
    if (t.origin === home.origin && t.pathname === home.pathname) return t;
  } catch (e) {}
  return home;
}
function swtSame(a, b) { try { var x = new URL(a); return x.pathname === b.pathname && x.search === b.search && x.hash === b.hash; } catch (e) { return false; } }
self.addEventListener("notificationclick", function (e) {
  e.notification.close();
  var target = swtTarget(e.notification.data && e.notification.data.u);
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (cs) {
    var home = new URL("./test.html", self.registration.scope).pathname, c = null;
    for (var i = 0; i < cs.length; i++) { try { if (new URL(cs[i].url).pathname === home) { c = cs[i]; break; } } catch (x) {} }
    var open = function () { return self.clients.openWindow ? self.clients.openWindow(target.href) : null; };
    if (!c) return open();
    var step = (!swtSame(c.url, target) && typeof c.navigate === "function")
      ? Promise.resolve().then(function () { return c.navigate(target.href); }).then(function (nc) { if (!nc) throw new Error("nav"); return nc; })
      : Promise.resolve(c);
    return step.then(function (wc) { return wc.focus(); }).catch(open);
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
