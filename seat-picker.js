/* 選位畫面（CÉON 11/05）：購票時在座位圖點位子。只有場次設了 seatMap 才會載入。
   座位表、誰被買走都以後台 /ticket/seats 為準；這裡只負責顯示和選取，真正鎖位在建立付款時由後台決定。 */
(function () {
  if (window.SkySeat) return;
  var POLL_MS = 8000;
  var CSS = "\
.sk-seat{position:fixed;inset:0;z-index:99995;display:flex;flex-direction:column;background:#0a0a0b;color:#f3efe6;font-family:var(--font-sans-tc,-apple-system,'PingFang TC',sans-serif);overscroll-behavior:contain;-webkit-user-select:none;user-select:none}\
.sk-seat *{box-sizing:border-box}\
.sk-top{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:calc(8px + env(safe-area-inset-top)) 12px 6px}\
.sk-tb .sk-top{padding-top:calc(50px + env(safe-area-inset-top))}\
.sk-back{justify-self:start;min-height:44px;padding:0 14px 0 10px;border:1px solid rgba(255,255,255,.22);border-radius:22px;background:none;color:#f3efe6;font:inherit;font-size:15px;cursor:pointer}\
.sk-back i{font-style:normal;color:#ecc67f;font-size:20px;margin-right:4px}\
.sk-top h2{margin:0;font-size:17px;font-weight:600;letter-spacing:.04em;outline:none}\
.sk-tabs{display:flex;gap:6px;justify-content:center;padding:4px 16px 8px}\
.sk-tabs button{min-height:36px;min-width:64px;padding:0 12px;border:1px solid rgba(255,255,255,.18);border-radius:18px;background:none;color:#cfc8ba;font:inherit;font-size:14px;cursor:pointer}\
.sk-tabs button[aria-pressed=true]{border-color:#ecc67f;color:#ecc67f}\
.sk-map{position:relative;flex:1;min-height:0;overflow:auto;-webkit-overflow-scrolling:touch;touch-action:pan-x pan-y;padding-bottom:12px}\
.sk-in{display:inline-block;min-width:100%;padding:0 6px}\
.sk-screen{margin:6px 40px 14px;padding-top:6px;border-top:3px solid #ecc67f;border-radius:50%/10px 10px 0 0;text-align:center;color:#ecc67f;font-size:12px;letter-spacing:.5em}\
.sk-row{display:flex;align-items:center;height:var(--sk-h,35px)}\
.sk-no{position:sticky;left:0;z-index:1;flex:none;width:22px;height:100%;display:flex;align-items:center;justify-content:center;text-align:center;font-size:12px;color:#a59d8e;background:#0a0a0b}\
.sk-no.r{position:static;background:none}\
.sk-blk{flex:none;display:flex;justify-content:center}\
.sk-gap{flex:none;width:14px}\
.sk-s{flex:none;width:calc(var(--sk-c,31px) - 3px);height:calc(var(--sk-h,35px) - 5px);margin:0 1.5px;padding:0;border:1px solid rgba(255,255,255,.34);border-radius:7px 7px 4px 4px;background:none;color:#e9e3d6;font:600 12px/1 -apple-system,sans-serif;cursor:pointer;-webkit-tap-highlight-color:transparent}\
.sk-s[aria-pressed=true]{background:#ecc67f;border-color:#ecc67f;color:#1d1915}\
.sk-s:disabled{border-color:transparent;background:rgba(255,255,255,.07);color:rgba(255,255,255,.2);cursor:default}\
.sk-s.x:disabled{border:1px dashed rgba(255,255,255,.12);background:none;color:transparent}\
.sk-s.w{width:calc(var(--sk-c,31px) * 2 - 3px);border-style:dashed;border-color:rgba(255,255,255,.2);color:#a59d8e;font-size:15px}\
.sk-exit{margin:10px 40px 0;text-align:center;font-size:12px;color:#a59d8e;letter-spacing:.2em}\
.sk-leg{display:flex;gap:14px;justify-content:center;padding:8px 12px 2px;font-size:12px;color:#cfc8ba}\
.sk-leg span{display:flex;align-items:center;gap:5px}\
.sk-leg i{width:14px;height:14px;border-radius:4px;border:1px solid rgba(255,255,255,.34)}\
.sk-leg i.on{background:#ecc67f;border-color:#ecc67f}.sk-leg i.off{background:rgba(255,255,255,.1);border-color:transparent}.sk-leg i.x{border:1px dashed rgba(255,255,255,.3)}.sk-leg span[hidden]{display:none}\
.sk-foot{padding:8px 16px calc(12px + env(safe-area-inset-bottom));border-top:1px solid rgba(255,255,255,.1);background:#0f0f10}\
.sk-sel{min-height:24px;margin-bottom:8px;font-size:15px;line-height:1.5;color:#f3efe6}\
.sk-sel small{font-size:14px;color:#a59d8e}\
.sk-left{box-sizing:border-box;width:max-content;max-width:100%;margin:0 auto 6px;padding:3px 12px;border-radius:999px;background:rgba(236,198,127,.12);font-size:15px;font-weight:600;line-height:20px;color:#ecc67f;text-align:center;font-variant-numeric:tabular-nums}.sk-left[hidden]{display:none}.sk-left.warn{background:rgba(255,170,100,.18);color:#ffb070}\
.sk-ok{width:100%;min-height:50px;border:0;border-radius:25px;background:#ecc67f;color:#1d1915;font:inherit;font-size:16px;font-weight:700;cursor:pointer}\
.sk-ok:disabled{background:rgba(255,255,255,.12);color:rgba(255,255,255,.4);cursor:default}\
.sk-msg{position:absolute;left:16px;right:16px;bottom:calc(136px + env(safe-area-inset-bottom));padding:10px 14px;border-radius:12px;background:#f3efe6;color:#1d1915;font-size:14px;line-height:1.45;text-align:center;opacity:0;pointer-events:none;transition:opacity .18s}\
.sk-msg.on{opacity:1}\
.sk-state{padding:60px 24px;text-align:center;color:#cfc8ba;font-size:15px;line-height:1.6}\
.sk-state button{display:block;margin:14px auto 0;min-height:44px;padding:0 20px;border:1px solid #ecc67f;border-radius:22px;background:none;color:#ecc67f;font:inherit;cursor:pointer}\
@media (prefers-reduced-motion:reduce){.sk-msg{transition:none}}";

  var rowName = {};   // 顯示用排名，由後台給（第 1 排＝A）
  function name(id) { var m = /^(\d+)-(\d+)$/.exec(id || ""); return !m ? "" : (rowName[m[1]] || m[1]) + m[2]; }
  function order(a, b) { var x = a.split("-"), y = b.split("-"); return x[0] - y[0] || x[1] - y[1]; }

  function open(o) {
    var acctLeft = null, acctTx = function () { var m = o.perAcct || 5; return o.en ? (acctLeft > 0 ? "Up to " + m + " tickets per account for this event. You can choose " + acctLeft + " more." : "Up to " + m + " tickets per account for this event. You already have " + m + ", including unpaid orders.") : (acctLeft > 0 ? "每個帳號這場最多 " + m + " 張，你還可以選 " + acctLeft + " 張。" : "每個帳號這場最多 " + m + " 張，你已經買滿了（含付款中的訂單）。"); };   // B459T：每個帳號最多 5 張（後台 m57 回 acctLeft）
    var goneTx = function (ids) { var n = ids.map(name).join(o.en ? ", " : "、"), many = ids.length > 1; return o.en ? n + (many ? " were" : " was") + " just taken. Pick another seat you like." : n + (many ? " 這些位置" : " 這個位置") + "剛被選走了，再挑一個喜歡的位置吧。"; };
    if (!document.getElementById("sk-seat-css")) { var st = document.createElement("style"); st.id = "sk-seat-css"; st.textContent = CSS; document.head.appendChild(st); }
    var en = !!o.en, T = en
      ? { title: "Choose seats", back: "Back", L: "Left", C: "Center", R: "Right", screen: "SCREEN", exit: "ENTRANCE", free: "Open", shut: "Not for sale", on: "Yours", off: "Taken", none: "Pick a seat you love. We’ll meet you there.", ok: "Confirm", seats: " seats", seat: " seat", max: "Up to " + o.max + " per order", wheel: "Wheelchair seats are not sold online. Please contact the organizer.", fail: "Could not load the seat map.", retry: "Try again", load: "Loading seats…" }
      : { title: "選擇座位", back: "返回", L: "左側", C: "中間", R: "右側", screen: "銀幕", exit: "出入口", free: "可選", shut: "不開放", on: "已選", off: "已售出", none: "選一個喜歡的位置，我們在這裡見。", ok: "確認", seats: " 個座位", seat: " 個座位", max: "一筆最多 " + o.max + " 張", wheel: "輪椅席不開放線上選位，請聯繫主辦", fail: "座位圖載入失敗", retry: "再試一次", load: "座位載入中…" };
    var own = (o.own || []).slice(), sel = (o.selected || []).slice(), busy = {}, shut = {}, map = null, timer = 0, msgT = 0, closed = false;
    var el = document.createElement("div");
    el.className = "sk-seat" + (document.getElementById("tk-test-banner") ? " sk-tb" : ""); el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-label", T.title);
    el.innerHTML = '<div class="sk-top"><button type="button" class="sk-back" data-k="back"><i>‹</i>' + T.back + '</button><h2 tabindex="-1">' + T.title + '</h2><span></span></div>' +
      '<div class="sk-tabs" hidden><button type="button" data-k="tab" data-b="L">' + T.L + '</button><button type="button" data-k="tab" data-b="C" aria-pressed="true">' + T.C + '</button><button type="button" data-k="tab" data-b="R">' + T.R + '</button></div>' +
      '<div class="sk-map"><div class="sk-state">' + T.load + '</div></div>' +
      '<div class="sk-leg"><span><i></i>' + T.free + '</span><span><i class="on"></i>' + T.on + '</span><span><i class="off"></i>' + T.off + '</span><span class="sk-shut" hidden><i class="x"></i>' + T.shut + '</span></div>' +
      '<div class="sk-foot"><div class="sk-left" hidden></div><div class="sk-sel" aria-live="polite"></div><button type="button" class="sk-ok" data-k="ok" disabled></button></div><div class="sk-msg" role="status"></div>';
    document.body.appendChild(el);
    var leftEl = el.querySelector(".sk-left"), leftT = 0, mapEl = el.querySelector(".sk-map"), selEl = el.querySelector(".sk-sel"), okEl = el.querySelector(".sk-ok"), msgEl = el.querySelector(".sk-msg"), tabs = el.querySelector(".sk-tabs");
    el.querySelector("h2").focus({ preventScroll: true });

    function say(t, ms) { msgEl.textContent = t; msgEl.classList.add("on"); clearTimeout(msgT); msgT = setTimeout(function () { msgEl.classList.remove("on"); }, ms || 2600); }
    function foot() {
      var n = sel.length;
      selEl.innerHTML = n ? sel.slice().sort(order).map(name).join(en ? ", " : "、") : "<small>" + T.none + "</small>";
      okEl.disabled = !n;
      okEl.innerHTML = n ? "<span>" + T.ok + " " + n + (n > 1 ? T.seats : T.seat) + "</span>" + (o.price ? "<small>NT$" + (o.price * n).toLocaleString("en-US") + "</small>" : "") : "<span>" + T.ok + "</span>";   // B449T：動作左、價格右，樣式在 ticket-b441.css
    }
    function seatBtn(id, r, s) {
      var x = !!shut[id], off = x || !!busy[id] && sel.indexOf(id) < 0;   // B452T：前四排不開放，不顯示座位號
      return '<button type="button" class="sk-s' + (x ? " x" : "") + '" data-k="seat" data-id="' + id + '" aria-pressed="' + (sel.indexOf(id) >= 0) + '" aria-label="' + name(id) + (x ? " " + T.shut : "") + '"' + (off ? " disabled" : "") + ">" + (x ? "" : s) + "</button>";
    }
    function block(r, list, cols) {
      var h = list.map(function (s) { return seatBtn(r + "-" + s, r, s); });
      if (map.wheel && Number(map.wheel.row) === Number(r) && cols === 12) {
        var w = ""; for (var i = 0; i < map.wheel.n; i++) w += '<button type="button" class="sk-s w" data-k="wheel" aria-label="' + T.wheel + '">♿︎</button>';
        var at = list.filter(function (s) { return s <= map.wheel.after; }).length; h.splice(at, 0, w);
      }
      return '<div class="sk-blk" style="width:calc(var(--sk-c,31px) * ' + cols + ')">' + h.join("") + "</div>";
    }
    function size() {
      var c = Math.max(25, Math.min(34, Math.floor((mapEl.clientWidth - 30) / 12))), free = mapEl.clientHeight - 84, h = Math.max(33, Math.min(44, Math.floor(free / 11)));
      el.style.setProperty("--sk-c", c + "px"); el.style.setProperty("--sk-h", h + "px");
    }
    function draw() {
      size();
      var rows = Object.keys(map.rows).sort(function (a, b) { return a - b; }), h = '<div class="sk-in"><div class="sk-screen">' + T.screen + "</div>";
      rows.forEach(function (r) {
        var all = map.rows[r], last = all[all.length - 1], wide = all.length && all[0] > 4;   // 第 11 排只有中間一段
        var L = wide ? [] : all.filter(function (s) { return s <= 4; }), R = wide ? [] : all.filter(function (s) { return s >= 15; }), C = wide ? all : all.filter(function (s) { return s > 4 && s < 15; });
        var rn = rowName[r] || r;
        h += '<div class="sk-row"><div class="sk-no">' + rn + "</div>" + block(r, L, 4) + '<div class="sk-gap"></div>' + block(r, C, 12) + '<div class="sk-gap"></div>' + block(r, R, 4) + '<div class="sk-no r">' + rn + "</div></div>";
      });
      mapEl.innerHTML = h + '<div class="sk-exit">' + T.exit + "</div></div>";
      tabs.hidden = false; foot();
    }
    function paint() {
      mapEl.querySelectorAll(".sk-s[data-id]").forEach(function (b) {
        var id = b.getAttribute("data-id"), on = sel.indexOf(id) >= 0;
        b.setAttribute("aria-pressed", String(on)); b.disabled = !!shut[id] || !!busy[id] && !on;
      });
      foot();
    }
    function setBusy(list) {
      busy = {}; (list || []).forEach(function (k) { if (own.indexOf(k) < 0) busy[k] = 1; });
      var gone = sel.filter(function (k) { return busy[k]; });
      if (gone.length) { sel = sel.filter(function (k) { return !busy[k]; }); say(goneTx(gone)); }
    }
    var seq = 0;
    function sync() {   // 點選即鎖（CÉON 11/05 定）：每次點選都送後台鎖 2 分鐘；被別人先鎖住的就退掉並提示
      if (!o.pick) return Promise.resolve();
      var my = ++seq;
      return o.pick(sel.slice()).then(function (j) {
        if (closed || my !== seq || !j || !j.ok) return;
        var lost = (j.taken || []).filter(function (k) { return sel.indexOf(k) >= 0; });
        if (lost.length) { sel = sel.filter(function (k) { return lost.indexOf(k) < 0; }); say(goneTx(lost)); }
        if (j.acctLeft != null) acctLeft = Number(j.acctLeft);
        var ov = (j.over || []).filter(function (k) { return sel.indexOf(k) >= 0; });
        if (ov.length) { sel = sel.filter(function (k) { return ov.indexOf(k) < 0; }); say(acctTx(), 4000); }
        setBusy(j.busy); paint();
      }).catch(function () {});
    }
    function pull(first) {
      if (!first && sel.length && o.pick) return sync();   // 有選位時用續鎖代替單純刷新
      return o.load().then(function (j) {
        if (closed) return;
        if (!j || !j.ok) throw 0;
        setBusy(j.busy);
        if (first) { map = j; rowName = j.rowName || {}; (j.closed || []).forEach(function (k) { shut[k] = 1; }); el.querySelector(".sk-shut").hidden = !(j.closed || []).length; draw(); go("C", true); } else paint();
      }).catch(function () {
        if (closed || !first) return;
        mapEl.innerHTML = '<div class="sk-state">' + T.fail + '<button type="button" data-k="retry">' + T.retry + "</button></div>";
      });
    }
    function go(b, now) {
      var w = mapEl.scrollWidth - mapEl.clientWidth, mid = mapEl.querySelectorAll(".sk-blk")[1], x = b === "L" ? 0 : b === "R" ? w : mid ? Math.min(w, Math.max(0, mid.offsetLeft - 24)) : w / 2;
      try { mapEl.scrollTo({ left: x, behavior: now ? "auto" : "smooth" }); } catch (e) { mapEl.scrollLeft = x; }
      tabs.querySelectorAll("button").forEach(function (t) { t.setAttribute("aria-pressed", String(t.getAttribute("data-b") === b)); });
    }
    /* B453T：選位總時限，時間以後台回的為準 */
    function tick() { var ms = o.left ? o.left() : null; if (ms == null) { leftEl.hidden = true; return; } var s2 = Math.max(0, Math.ceil(ms / 1000)); leftEl.hidden = false; leftEl.textContent = (en ? "Seats held " : "座位保留中 ") + Math.floor(s2 / 60) + ":" + ("0" + s2 % 60).slice(-2); leftEl.classList.toggle("warn", ms <= 60e3); if (ms <= 0 && o.onTimeUp) o.onTimeUp(); }
    function close() {
      closed = true; clearInterval(timer); clearInterval(leftT); clearTimeout(msgT);
      document.removeEventListener("keydown", onKey); document.removeEventListener("visibilitychange", onVis);
      el.remove();
    }
    function onKey(e) { if (e.key === "Escape") { close(); if (o.onClose) o.onClose(); } }
    function onVis() { if (!document.hidden && map) pull(false); }
    el.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest("[data-k]"); if (!b) return;
      var k = b.getAttribute("data-k");
      if (k === "back") { close(); if (o.onClose) o.onClose(); else if (o.pick) o.pick([]).catch(function () {}); return; }   // 沒確認就離開：由呼叫方決定放掉或鎖回原本的位子
      if (k === "tab") return go(b.getAttribute("data-b"));
      if (k === "wheel") return say(T.wheel);
      if (k === "retry") { mapEl.innerHTML = '<div class="sk-state">' + T.load + "</div>"; return pull(true); }
      if (k === "ok") { var out = sel.slice().sort(order), names = out.map(name); close(); o.onDone(out, names); return; }
      if (k === "seat") {
        var id = b.getAttribute("data-id"), i = sel.indexOf(id);
        if (i >= 0) sel.splice(i, 1);
        else if (acctLeft != null && acctLeft < o.max && sel.length >= acctLeft) return say(acctTx(), 4000);
        else if (sel.length >= o.max) { if (o.max === 1) sel = [id]; else return say(T.max); }
        else sel.push(id);
        try { navigator.vibrate && navigator.vibrate(6); } catch (x) {}
        paint(); sync();
      }
    });
    document.addEventListener("keydown", onKey); document.addEventListener("visibilitychange", onVis);
    foot(); pull(true);
    timer = setInterval(function () { if (!document.hidden && map) pull(false); }, POLL_MS);
    leftT = setInterval(tick, 1000); tick();
    return { close: close, expired: function (tx) { sel = []; own = []; paint(); say(tx, 6000); pull(false); tick(); } };
  }
  window.SkySeat = { open: open, name: name };
})();
