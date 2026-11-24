/* live-v2.js — CHANCE App 直播（第 1 階段，只給測試站 test-v2.html 用）
   CÉON 11/25：在 App 裡開直播，可以留言、看線上人數、按愛心；只給有 SIGNAL 私訊頻道的人看。
   - 後台：測試後台 /live/ws（WebSocket，m84）。email＋兌換碼不放網址，連上後第一則訊息才送。
   - 入口：SIGNAL 頁右上「LIVE」（直播中才出現）；網址加 #live 也會直接打開（測試用）。
   - 畫面參考 Mobbin 的 Weverse／TikTok／Insight Timer 直播：滿版直式、左上 LIVE＋人數、留言疊在左下、愛心從右下往上飄。
   - 影像第 1 階段用一支測試 HLS 影片假裝直播（後台給網址）；第 2 階段換成 Cloudflare Stream。
   - 提示一律用 window.skyBanner（iOS 通知樣式）。字都不小於 15px。 */
(function () {
  "use strict";
  var API = "https://the-sky-ost-api-test.anthonywen0693.workers.dev", ROOM = "main";
  var WS_URL = API.replace(/^http/, "ws") + "/live/ws?room=" + ROOM;
  var NICK_KEY = "album-the-sky:nick";
  var EN = function () { return window.SKY_LANG === "en"; };
  var T = function (zh, en) { return EN() ? en : zh; };

  /* ---------- 樣式 ---------- */
  var css = [
    "#lv{position:fixed;inset:0;z-index:100001;background:#000;color:#fff;display:none;overflow:hidden;-webkit-user-select:none;user-select:none;touch-action:manipulation;font-family:-apple-system,BlinkMacSystemFont,'PingFang TC','Noto Sans TC',sans-serif}",
    "#lv.on{display:block}",
    "#lv video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#000}",
    "#lv .lv-shade{position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,rgba(0,0,0,.55) 0,rgba(0,0,0,0) 22%,rgba(0,0,0,0) 48%,rgba(0,0,0,.7) 100%)}",
    "#lv .lv-top{position:absolute;left:0;right:0;top:0;padding:calc(10px + env(safe-area-inset-top)) 12px 0 14px;display:flex;align-items:center;gap:8px}",
    "#lv .lv-badge{display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 11px;border-radius:8px;background:#E5322D;font:800 16px/1 -apple-system,sans-serif;letter-spacing:1px}",
    "#lv .lv-badge i{width:8px;height:8px;border-radius:50%;background:#fff;animation:lvBlink 1.4s infinite}",
    "#lv .lv-badge.off{background:rgba(255,255,255,.22)}#lv .lv-badge.off i{animation:none;opacity:.6}",
    "@keyframes lvBlink{50%{opacity:.25}}",
    "#lv .lv-pill{display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 11px;border-radius:8px;background:rgba(0,0,0,.42);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);font:700 16px/1 -apple-system,sans-serif;font-variant-numeric:tabular-nums}",
    "#lv .lv-pill svg{width:17px;height:17px}",
    "#lv .lv-sp{flex:1}",
    "#lv .lv-x{width:44px;height:44px;border:0;border-radius:50%;background:rgba(0,0,0,.42);color:#fff;display:flex;align-items:center;justify-content:center;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);padding:0}",
    "#lv .lv-x svg{width:20px;height:20px}",
    "#lv .lv-title{position:absolute;left:14px;right:70px;top:calc(54px + env(safe-area-inset-top));font:700 17px/1.35 -apple-system,'PingFang TC',sans-serif;text-shadow:0 1px 4px rgba(0,0,0,.6);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    /* 置頂：主辦置頂一句話或一張圖（第 3 階段後台才能設定，先留位置） */
    "#lv .lv-pin{position:absolute;left:12px;right:12px;top:calc(88px + env(safe-area-inset-top));display:none;align-items:center;gap:10px;padding:10px 12px;border-radius:14px;background:rgba(0,0,0,.5);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);border:1px solid rgba(214,182,111,.45);font:600 16px/1.4 -apple-system,'PingFang TC',sans-serif}",
    "#lv .lv-pin.on{display:flex}#lv .lv-pin img{width:56px;height:56px;border-radius:8px;object-fit:cover}",
    /* 留言：疊在左下，新的在最下面 */
    "#lv .lv-chat{position:absolute;left:12px;right:84px;bottom:calc(76px + env(safe-area-inset-bottom) + var(--lv-kb,0px));max-height:40vh;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;gap:6px;-webkit-mask-image:linear-gradient(180deg,transparent 0,#000 22%);mask-image:linear-gradient(180deg,transparent 0,#000 22%);pointer-events:none;transition:bottom .2s}",
    "#lv .lv-m{align-self:flex-start;max-width:100%;padding:7px 11px;border-radius:14px;background:rgba(0,0,0,.34);font:500 16px/1.4 -apple-system,'PingFang TC',sans-serif;text-shadow:0 1px 2px rgba(0,0,0,.5);word-break:break-word;animation:lvIn .22s ease-out}",
    "#lv .lv-m b{font-weight:700;color:rgba(255,255,255,.72);margin-right:7px}",
    "#lv .lv-m.me b{color:#9FD3FF}",
    "#lv .lv-m.artist{background:rgba(120,90,30,.55);border:1px solid rgba(240,220,168,.7)}#lv .lv-m.artist b{color:#F0DCA8}",
    "#lv .lv-m.sys{background:rgba(255,255,255,.14);color:rgba(255,255,255,.85)}",
    "@keyframes lvIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}",
    /* 愛心飄 */
    "#lv .lv-hearts{position:absolute;right:8px;bottom:calc(70px + env(safe-area-inset-bottom) + var(--lv-kb,0px));width:80px;height:46vh;pointer-events:none;overflow:visible}",
    "#lv .lv-h{position:absolute;bottom:0;left:22px;font-size:30px;line-height:1;will-change:transform,opacity;animation:lvUp var(--d,2.4s) cubic-bezier(.25,.6,.4,1) forwards}",
    "@keyframes lvUp{0%{transform:translate(0,0) scale(.4);opacity:0}12%{transform:translate(calc(var(--x) * .2),-8%) scale(1.05);opacity:1}100%{transform:translate(var(--x),-100%) scale(.9);opacity:0}}",
    "#lv .lv-h.mine{font-size:34px}",
    /* 底部：留言框、愛心、貼圖 */
    "#lv .lv-bar{position:absolute;left:0;right:0;bottom:0;padding:8px 10px calc(10px + env(safe-area-inset-bottom)) 12px;display:flex;align-items:center;gap:8px;transform:translateY(calc(var(--lv-kb,0px) * -1));transition:transform .2s}",
    "#lv .lv-in{flex:1;min-width:0;height:46px;border-radius:23px;border:1px solid rgba(255,255,255,.28);background:rgba(0,0,0,.4);color:#fff;padding:0 16px;font:500 16px/1 -apple-system,'PingFang TC',sans-serif;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);outline:none;-webkit-user-select:text;user-select:text}",
    "#lv .lv-in::placeholder{color:rgba(255,255,255,.62)}",
    "#lv .lv-btn{flex:none;width:46px;height:46px;border-radius:50%;border:0;background:rgba(0,0,0,.4);color:#fff;font-size:23px;line-height:1;display:flex;align-items:center;justify-content:center;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);padding:0}",
    "#lv .lv-send{display:none;background:#D6B66F;color:#111}#lv .lv-send svg{width:20px;height:20px}",
    "#lv.typing .lv-send{display:flex}#lv.typing .lv-heart,#lv.typing .lv-stk{display:none}",
    "#lv .lv-heart{background:rgba(229,50,45,.85)}#lv .lv-heart:active{transform:scale(.9)}",
    "#lv .lv-btn[disabled]{opacity:.45}",
    /* 中間狀態：連線中、還沒開播、已結束、只給會員 */
    "#lv .lv-state{position:absolute;left:24px;right:24px;top:50%;transform:translateY(-50%);text-align:center;display:none}",
    "#lv .lv-state.on{display:block}",
    "#lv .lv-state h3{margin:0 0 10px;font:800 22px/1.35 -apple-system,'PingFang TC',sans-serif}",
    "#lv .lv-state p{margin:0 0 18px;font:500 17px/1.6 -apple-system,'PingFang TC',sans-serif;color:rgba(255,255,255,.8)}",
    "#lv .lv-state button{height:48px;padding:0 26px;border-radius:24px;border:0;background:#D6B66F;color:#111;font:700 17px/1 -apple-system,'PingFang TC',sans-serif}",
    "#lv .lv-spin{width:34px;height:34px;margin:0 auto 14px;border-radius:50%;border:3px solid rgba(255,255,255,.25);border-top-color:#fff;animation:lvSpin .9s linear infinite}",
    "@keyframes lvSpin{to{transform:rotate(360deg)}}",
    "#lv .lv-sound{position:absolute;left:50%;top:44%;transform:translate(-50%,-50%);display:none;height:48px;padding:0 20px;border-radius:24px;border:0;background:rgba(0,0,0,.6);color:#fff;font:700 17px/1 -apple-system,'PingFang TC',sans-serif;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}",
    "#lv .lv-sound.on{display:block}",
    "#lv.ready .lv-wait{display:none}",
    /* SIGNAL 頁的入口 */
    "#lv-entry{position:absolute;right:14px;top:calc(12px + env(safe-area-inset-top));z-index:13;display:none;align-items:center;gap:7px;height:36px;padding:0 14px;border-radius:18px;border:0;background:#E5322D;color:#fff;font:800 16px/1 -apple-system,'PingFang TC',sans-serif;letter-spacing:.5px;pointer-events:auto;box-shadow:0 4px 14px rgba(229,50,45,.35)}",
    "#lv-entry.on{display:inline-flex}#lv-entry i{width:8px;height:8px;border-radius:50%;background:#fff;animation:lvBlink 1.4s infinite}",
    "@media (prefers-reduced-motion:reduce){#lv .lv-h{animation-duration:1.2s}#lv .lv-badge i,#lv-entry i{animation:none}}"
  ].join("\n");
  var st = document.createElement("style"); st.id = "lv-css"; st.textContent = css; document.head.appendChild(st);

  /* ---------- 畫面 ---------- */
  var EYE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
  var root = document.createElement("div"); root.id = "lv"; root.setAttribute("role", "dialog"); root.setAttribute("aria-modal", "true");
  root.innerHTML =
    '<video playsinline webkit-playsinline preload="none"></video><div class="lv-shade"></div>' +
    '<div class="lv-top"><span class="lv-badge"><i></i>LIVE</span><span class="lv-pill lv-vw">' + EYE + '<span class="lv-v">0</span></span>' +
    '<span class="lv-sp"></span><span class="lv-pill">❤️ <span class="lv-ht">0</span></span>' +
    '<button type="button" class="lv-x" aria-label="關閉"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
    '<div class="lv-title"></div><div class="lv-pin" aria-live="polite"></div>' +
    '<div class="lv-chat" aria-live="polite"></div><div class="lv-hearts" aria-hidden="true"></div>' +
    '<button type="button" class="lv-sound"></button>' +
    '<div class="lv-state"></div>' +
    '<form class="lv-bar" autocomplete="off"><input class="lv-in" type="text" enterkeyhint="send" maxlength="80">' +
    '<button type="submit" class="lv-btn lv-send" aria-label="送出"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg></button>' +
    '<button type="button" class="lv-btn lv-heart" aria-label="愛心">❤️</button>' +
    '<button type="button" class="lv-btn lv-stk" aria-label="貼圖">🎁</button></form>';
  var $ = function (s) { return root.querySelector(s); };
  var video = $("video"), chat = $(".lv-chat"), hearts = $(".lv-hearts"), input = $(".lv-in"), stateBox = $(".lv-state"), soundBtn = $(".lv-sound");

  /* ---------- 狀態 ---------- */
  var ws = null, opened = false, wantOpen = false, tries = 0, retryT = null, pingT = null, lastRx = 0, netBanner = null;
  var room = null, me = null, denied = false, hls = null, hlsUrl = "", seen = {}, myHearts = 0, heartBuf = 0, heartT = null, sending = null, kb = 0;

  function fmt(n) { n = Number(n) || 0; if (n >= 1e4) return (EN() ? (n / 1e3).toFixed(n >= 1e5 ? 0 : 1) + "K" : (n / 1e4).toFixed(n >= 1e5 ? 0 : 1) + "萬"); return String(n); }
  function who() { try { return window.skyLiveWho ? window.skyLiveWho() : null; } catch (e) { return null; } }
  function nick() { try { return (localStorage.getItem(NICK_KEY) || "").trim(); } catch (e) { return ""; } }
  function banner(id, title, body, ms, busy) {
    if (!window.skyBanner) return null;
    var b = window.skyBanner({ id: id, title: title, body: body, ms: ms || 0 }); if (b && busy) b.set(title, body, true); return b;
  }

  function showState(kind) {
    root.classList.toggle("ready", kind === "ready");
    if (kind === "ready") { stateBox.classList.remove("on"); stateBox.innerHTML = ""; return; }
    var h = "";
    if (kind === "wait") h = '<div class="lv-spin"></div><p>' + T("連線中…", "Connecting…") + "</p>";
    else if (kind === "signal") h = "<h3>" + T("直播是給 SIGNAL 會員看的", "This live is for SIGNAL members") + "</h3><p>" + T("有 SIGNAL 私訊頻道（或全解鎖方案）就能看直播、留言、按愛心。", "Members of the SIGNAL channel (or the full unlock plan) can watch, chat and send hearts.") + '</p><button type="button" data-lv="close">' + T("知道了", "OK") + "</button>";
    else if (kind === "idle") h = "<h3>" + T("還沒開播", "Not live yet") + "</h3><p>" + T("開播的時候這裡就會亮起來。", "This lights up when Chance goes live.") + '</p><button type="button" data-lv="close">' + T("知道了", "OK") + "</button>";
    else if (kind === "ended") h = "<h3>" + T("直播已結束", "The live has ended") + "</h3><p>" + T("謝謝你來。", "Thanks for being here.") + '</p><button type="button" data-lv="close">' + T("關閉", "Close") + "</button>";
    stateBox.innerHTML = h; stateBox.classList.add("on");
  }
  function paintRoom() {
    if (!room) return;
    var live = room.status === "live";
    $(".lv-badge").classList.toggle("off", !live);
    $(".lv-title").textContent = room.title || "";
    $(".lv-ht").textContent = fmt(room.hearts);
    var pin = $(".lv-pin"); pin.textContent = "";
    if (room.pin && (room.pin.text || room.pin.img)) {
      if (room.pin.img) { var im = document.createElement("img"); im.src = room.pin.img; im.alt = ""; pin.appendChild(im); }
      var sp = document.createElement("span"); sp.textContent = "📌 " + (room.pin.text || ""); pin.appendChild(sp);
      pin.classList.add("on");
    } else pin.classList.remove("on");
    input.disabled = !live;
    if (!naming) input.placeholder = me && me.banned ? T("你目前不能留言", "You can't chat right now") : T("說點什麼…", "Say something…");
    if (me && me.banned) input.disabled = true;
    $(".lv-heart").disabled = !live; $(".lv-stk").disabled = !live;
    if (live) showState("ready"); else showState(room.status === "ended" ? "ended" : "idle");
    if (live && room.hls) playHls(room.hls); else stopVideo();
  }

  /* ---------- 影像（iPhone 用內建 HLS；電腦瀏覽器才載入 hls.js） ---------- */
  function playHls(url) {
    if (hlsUrl === url && !video.paused) return;
    hlsUrl = url;
    var go = function () { var p = video.play(); if (p && p.catch) p.catch(function () { video.muted = true; video.play().catch(function () {}); soundBtn.textContent = T("🔇 點一下開聲音", "🔇 Tap for sound"); soundBtn.classList.add("on"); }); };
    if (video.canPlayType("application/vnd.apple.mpegurl")) { if (video.getAttribute("src") !== url) video.src = url; go(); return; }
    loadHlsJs(function (H) {
      if (!H || !H.isSupported()) { video.src = url; go(); return; }
      if (hls) hls.destroy();
      hls = new H({ lowLatencyMode: true, liveSyncDurationCount: 3 }); hls.loadSource(url); hls.attachMedia(video);
      hls.on(H.Events.MANIFEST_PARSED, go);
    });
  }
  function stopVideo() { hlsUrl = ""; try { video.pause(); } catch (e) {} if (hls) { hls.destroy(); hls = null; } video.removeAttribute("src"); try { video.load(); } catch (e) {} }
  var hlsJsP = null;
  function loadHlsJs(cb) {
    if (window.Hls) return cb(window.Hls);
    if (!hlsJsP) hlsJsP = new Promise(function (res) { var s = document.createElement("script"); s.src = "https://cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.min.js"; s.onload = function () { res(window.Hls); }; s.onerror = function () { res(null); }; document.head.appendChild(s); });
    hlsJsP.then(cb);
  }
  soundBtn.addEventListener("click", function () { video.muted = false; video.play().catch(function () {}); soundBtn.classList.remove("on"); });

  /* ---------- 留言 ---------- */
  function addMsg(m, mine) {
    if (!m || (m.id && seen[m.id])) return; if (m.id) seen[m.id] = 1;
    var d = document.createElement("div"); d.className = "lv-m" + (m.artist ? " artist" : "") + (mine ? " me" : "") + (m.sys ? " sys" : "");
    if (m.n) { var b = document.createElement("b"); b.textContent = m.n; d.appendChild(b); }
    d.appendChild(document.createTextNode(m.x || ""));
    chat.appendChild(d);
    while (chat.children.length > 40) chat.removeChild(chat.firstChild);
  }
  function sysMsg(t) { addMsg({ sys: 1, x: t }); }

  /* ---------- 愛心 ---------- */
  var HEARTS = ["❤️", "💛", "🤍", "💗"];
  var liveHearts = 0;
  function floatHeart(mine) {
    if (liveHearts > 24 || document.hidden) return; liveHearts++;
    var h = document.createElement("span"); h.className = "lv-h" + (mine ? " mine" : "");
    h.textContent = mine ? "❤️" : HEARTS[(Math.random() * HEARTS.length) | 0];
    h.style.setProperty("--x", Math.round(Math.random() * 60 - 40) + "px");
    h.style.setProperty("--d", (2 + Math.random() * 1.2).toFixed(2) + "s");
    h.addEventListener("animationend", function () { h.remove(); liveHearts--; });
    hearts.appendChild(h);
  }
  function tapHeart() {
    if (!room || room.status !== "live") return;
    try { if (navigator.vibrate) navigator.vibrate(6); } catch (e) {}
    floatHeart(true); heartBuf++; myHearts++;
    room.hearts = (room.hearts || 0) + 1; $(".lv-ht").textContent = fmt(room.hearts);
    if (!heartT) heartT = setTimeout(flushHearts, 400);
  }
  function flushHearts() { heartT = null; if (!heartBuf) return; var n = heartBuf; heartBuf = 0; send({ t: "heart", n: n }); }

  /* ---------- 連線 ---------- */
  function send(o) { if (ws && ws.readyState === 1) { try { ws.send(JSON.stringify(o)); return true; } catch (e) {} } return false; }
  function connect() {
    clearTimeout(retryT); retryT = null;
    if (!opened || denied) return;
    if (ws && (ws.readyState === 0 || ws.readyState === 1)) return;
    var w = who();
    if (!w || !w.ok || !w.email || !w.code) { denied = true; showState("signal"); return; }
    var sock; try { sock = new WebSocket(WS_URL); } catch (e) { return retry(); }
    ws = sock; lastRx = Date.now();
    sock.onopen = function () { if (ws !== sock) return; sock.send(JSON.stringify({ t: "hello", e: w.email, c: w.code, n: nick() })); };
    sock.onmessage = function (ev) { if (ws !== sock) return; lastRx = Date.now(); var m; try { m = JSON.parse(ev.data); } catch (e) { return; } onMsg(m); };
    sock.onclose = function () { if (ws !== sock) return; ws = null; if (opened && !denied) retry(); };
    sock.onerror = function () {};
  }
  function retry() {
    if (!opened || denied || retryT) return;
    tries++;
    if (tries >= 2 && !netBanner) netBanner = banner("lv-net", T("連線中斷", "Connection lost"), T("正在重新連線…", "Reconnecting…"), 0, true);
    var wait = Math.min(10000, 800 * Math.pow(2, Math.min(tries - 1, 4))) + Math.random() * 400;
    retryT = setTimeout(connect, wait);
  }
  function onMsg(m) {
    if (m.t === "hi") {
      var wasRetry = tries > 0; tries = 0;
      if (netBanner) { netBanner.set(T("已重新連上", "Reconnected"), "", false); netBanner.arm(1500); netBanner = null; }
      me = m.me; room = m.room;
      if (!wasRetry) chat.innerHTML = "";
      (m.recent || []).forEach(function (x) { addMsg(x, false); });
      $(".lv-v").textContent = fmt(m.viewers);
      paintRoom();
      return;
    }
    if (m.t === "deny") { denied = true; stopVideo(); showState("signal"); return; }
    if (m.t === "v") { $(".lv-v").textContent = fmt(m.n); if (room && m.tot > (room.hearts || 0)) { room.hearts = m.tot; $(".lv-ht").textContent = fmt(m.tot); } return; }
    if (m.t === "h") {
      var others = Math.max(0, m.n - myHearts); myHearts = Math.max(0, myHearts - m.n);
      for (var i = 0; i < Math.min(others, 8); i++) setTimeout(function () { floatHeart(false); }, i * 110);
      if (room && m.tot > (room.hearts || 0)) { room.hearts = m.tot; $(".lv-ht").textContent = fmt(m.tot); }
      return;
    }
    if (m.t === "m") { addMsg(m.m, !!m.mine); if (m.mine && sending === m.k) doneSending(true); return; }
    if (m.t === "me") { me = m.me; if (pendingText) { var t = pendingText; pendingText = ""; say(t); } return; }
    if (m.t === "room") { room = m.room; paintRoom(); return; }
    if (m.t === "err") {
      if (sending && m.k === sending) doneSending(false);
      var msg = { slow: T("留言太快了，等 3 秒再送", "Too fast. Wait 3 seconds."), long: T("一則最多 80 個字", "80 characters max"), banned: T("你目前不能留言", "You can't chat right now"), closed: T("直播已經結束了", "The live has ended") }[m.why];
      if (msg) banner("lv-err", msg, "", 2600);
    }
  }

  /* ---------- 送出留言 ---------- */
  var pendingText = "";
  function doneSending(ok) { sending = null; clearTimeout(doneSending.t); if (ok) { input.value = ""; root.classList.remove("typing"); } input.disabled = !!(me && me.banned) || !(room && room.status === "live"); }
  function say(text) {
    var k = "k" + Date.now().toString(36);
    if (!send({ t: "say", x: text, k: k })) { banner("lv-err", T("還沒連上，等一下再送", "Not connected yet"), "", 2400); return; }
    sending = k; input.disabled = true;
    clearTimeout(doneSending.t); doneSending.t = setTimeout(function () { if (sending === k) doneSending(false); }, 8000);
  }
  /* 還沒取名字：第一次送出時，輸入框變成「取名字」，取好就把剛剛那句送出（名字規則跟歌曲留言一樣） */
  var naming = false;
  function startNaming(text) {
    naming = true; pendingText = text; input.value = ""; input.maxLength = 12;
    input.placeholder = T("先取個名字（12 字內）", "Pick a name (12 max)");
    root.classList.remove("typing");
    banner("lv-name", T("先取個名字", "Pick a name first"), T("大家會看到這個名字，取好就會送出你剛剛那句。", "Others will see it. Your message goes out right after."), 3600);
    try { input.focus(); } catch (e) {}
  }
  $(".lv-bar").addEventListener("submit", function (e) {
    e.preventDefault();
    var text = (input.value || "").trim(); if (!text || sending) return;
    if (naming) {
      var v = text.slice(0, 12); naming = false; input.maxLength = 80; input.value = "";
      try { localStorage.setItem(NICK_KEY, v); } catch (e2) {}
      root.classList.remove("typing"); paintRoom();
      if (!send({ t: "name", n: v })) { var t0 = pendingText; pendingText = ""; input.value = t0; }
      return;
    }
    if (Array.from(text).length > 80) { banner("lv-err", T("一則最多 80 個字", "80 characters max"), "", 2400); return; }
    if (!nick()) { startNaming(text); return; }
    say(text);
  });
  input.addEventListener("input", function () { root.classList.toggle("typing", !!input.value.trim()); });
  $(".lv-heart").addEventListener("click", tapHeart);
  $(".lv-stk").addEventListener("click", function () { banner("lv-stk", T("貼圖快開放了", "Stickers are coming soon"), T("下一個版本就能送 CHANCE 專屬貼圖。", "You'll be able to send CHANCE stickers in the next version."), 2800); });
  $(".lv-x").addEventListener("click", function () { close(true); });
  stateBox.addEventListener("click", function (e) { if (e.target.closest("[data-lv=close]")) close(true); });

  /* iPhone 鍵盤：底列和留言一起往上，不被鍵盤蓋住 */
  function vvFit() {
    if (!opened || !window.visualViewport) return;
    var vv = window.visualViewport, k = Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop));
    if (k !== kb) { kb = k; root.style.setProperty("--lv-kb", k + "px"); }
  }
  if (window.visualViewport) { window.visualViewport.addEventListener("resize", vvFit); window.visualViewport.addEventListener("scroll", vvFit); }

  /* 開、關 */
  function open() {
    if (opened) return;
    opened = true; denied = false; tries = 0; seen = {}; me = null; room = null; myHearts = 0;
    chat.innerHTML = ""; root.classList.add("on"); document.body.style.overflow = "hidden";
    showState("wait");
    try { if (window.skyLivePauseMusic) window.skyLivePauseMusic(); } catch (e) {}
    video.muted = false; try { var p = video.play(); if (p && p.catch) p.catch(function () {}); } catch (e) {}   /* 在按下去的那一下先解鎖播放，之後拿到網址才能有聲音 */
    try { window.SKY_BACK.push("live", function () { close(false); }); } catch (e) {}
    connect();
    clearInterval(pingT);
    pingT = setInterval(function () {
      if (!opened) return;
      if (ws && ws.readyState === 1) {
        if (Date.now() - lastRx > 16000) { try { ws.close(); } catch (e) {} ws = null; retry(); return; }   /* 背景回來時連線可能已經默默斷了：16 秒沒收到東西就重連 */
        send({ t: "ping" });
      }
    }, 8000);
  }
  function close(viaUi) {
    if (!opened) return;
    opened = false; naming = false; pendingText = ""; input.maxLength = 80; clearInterval(pingT); clearTimeout(retryT); retryT = null; flushHearts();
    if (ws) { var w = ws; ws = null; try { w.close(1000); } catch (e) {} }
    if (netBanner) { netBanner.hide(); netBanner = null; }
    stopVideo(); soundBtn.classList.remove("on");
    root.classList.remove("on", "typing"); input.value = ""; input.blur();
    document.body.style.overflow = "";
    if (viaUi) try { window.SKY_BACK.done("live"); } catch (e) {}
    if (/(^#|&)live\b/.test(location.hash)) try { history.replaceState(history.state, "", location.pathname + location.search); } catch (e) {}
  }
  document.addEventListener("visibilitychange", function () {
    if (!opened || document.hidden) return;
    if (!ws || ws.readyState > 1 || Date.now() - lastRx > 12000) { if (ws) { try { ws.close(); } catch (e) {} ws = null; } tries = 0; connect(); }
    if (hlsUrl && video.paused) video.play().catch(function () {});
  });
  window.addEventListener("online", function () { if (opened && (!ws || ws.readyState > 1)) { clearTimeout(retryT); retryT = null; connect(); } });

  /* ---------- SIGNAL 頁的入口（直播中才出現） ---------- */
  var entry = document.createElement("button"); entry.type = "button"; entry.id = "lv-entry";
  entry.innerHTML = "<i></i>LIVE";
  entry.setAttribute("aria-label", "直播中，進入直播");
  entry.addEventListener("click", function () {
    var w = who();
    if (!w || !w.ok || !w.code) { banner("lv-lock", T("直播是給 SIGNAL 會員看的", "This live is for SIGNAL members"), T("有 SIGNAL 私訊頻道（或全解鎖方案）就能看。", "Join the SIGNAL channel (or the full unlock plan) to watch."), 4200); return; }
    open();
  });
  var infoT = null;
  function pollInfo() {
    clearTimeout(infoT);
    var sm = document.getElementById("screen-mood");
    var onSignal = sm && sm.classList.contains("active") && !document.hidden;
    if (onSignal) {
      var head = sm.querySelector(".feed-tabs"); if (head && entry.parentNode !== head) head.appendChild(entry);
      fetch(API + "/live/info?room=" + ROOM, { cache: "no-store", credentials: "omit" }).then(function (r) { return r.json(); }).then(function (d) {
        entry.classList.toggle("on", !!(d && d.ok && d.room && d.room.status === "live"));
      }).catch(function () {});
    }
    infoT = setTimeout(pollInfo, onSignal ? 30000 : 3000);
  }

  function boot() {
    document.body.appendChild(root);
    pollInfo();
    var lt = /(?:^#|&)livetest=(\d+)/.exec(location.hash);   /* 只給測試：#livetest=N（見 test-v2.html 的 skyLiveTestLogin） */
    if (lt) { try { if (window.skyLiveTestLogin) window.skyLiveTestLogin(lt[1]); } catch (e) {} try { history.replaceState(history.state, "", location.pathname + location.search + "#live"); } catch (e) {} }
    if (/(^#|&)live\b/.test(location.hash)) open();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
  window.skyLive = { open: open, close: function () { close(true); } };
})();
