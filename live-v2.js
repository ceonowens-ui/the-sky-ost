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
    /* V2-9（CÉON 11/25）：照 IG 直播的版面：左上大頭貼＋名字＋LIVE＋人數，右上只有 ✕；留言是「小圓頭像＋粗體名字＋內容」，沒有泡泡 */
    "#lv .lv-host{display:flex;align-items:center;gap:9px;min-width:0}",
    "#lv .lv-ava{width:38px;height:38px;border-radius:50%;object-fit:cover;flex:none;box-shadow:0 0 0 2px #000,0 0 0 4px #FF2D78}",
    "#lv .lv-name{font:700 16px/1.2 -apple-system,'PingFang TC',sans-serif;text-shadow:0 1px 3px rgba(0,0,0,.55);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:34vw}",
    "#lv .lv-badge{display:inline-flex;align-items:center;height:26px;padding:0 9px;border-radius:6px;background:linear-gradient(90deg,#E0006E,#FF2D55);font:800 15px/1 -apple-system,sans-serif;letter-spacing:.8px}",
    "#lv .lv-badge.off{background:rgba(255,255,255,.25)}",
    "@keyframes lvBlink{50%{opacity:.25}}",
    "#lv .lv-pill{display:inline-flex;align-items:center;gap:5px;height:26px;padding:0 9px;border-radius:6px;background:rgba(0,0,0,.45);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);font:700 15px/1 -apple-system,sans-serif;font-variant-numeric:tabular-nums}",
    "#lv .lv-pill svg{width:16px;height:16px}",
    "#lv .lv-sp{flex:1}",
    "#lv .lv-x{width:44px;height:44px;border:0;border-radius:50%;background:transparent;color:#fff;display:flex;align-items:center;justify-content:center;padding:0;filter:drop-shadow(0 1px 3px rgba(0,0,0,.5))}",
    "#lv .lv-x svg{width:26px;height:26px}",
    "#lv .lv-title{display:none;position:absolute;left:14px;right:70px;top:calc(54px + env(safe-area-inset-top));font:700 17px/1.35 -apple-system,'PingFang TC',sans-serif;text-shadow:0 1px 4px rgba(0,0,0,.6);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    /* 置頂：主辦置頂一句話或一張圖（第 3 階段後台才能設定，先留位置） */
    /* V2-10（CÉON 11/25）：直播中開賣。後台按「開搶」→ 畫面左上出現商品卡（照 Shopee／TikTok 直播的置頂商品卡）：照片＋名稱＋價格＋剩幾件＋金色「立刻搶」 */
    "#lv .lv-pin{position:absolute;left:12px;top:calc(62px + env(safe-area-inset-top));width:min(310px,calc(100vw - 24px));display:none;align-items:center;gap:10px;padding:10px;border-radius:16px;background:rgba(255,255,255,.94);color:#111;box-shadow:0 8px 24px rgba(0,0,0,.35);font:600 16px/1.3 -apple-system,'PingFang TC',sans-serif}",
    "#lv .lv-pin.on{display:flex;animation:lvPop .32s cubic-bezier(.2,1.3,.4,1)}",
    "@keyframes lvPop{from{opacity:0;transform:translateY(-10px) scale(.94)}to{opacity:1;transform:none}}",
    "#lv .lv-pin img{width:64px;height:64px;border-radius:10px;object-fit:cover;flex:none;background:#eee}",
    "#lv .lv-pt{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}",
    "#lv .lv-pt b{font-size:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    "#lv .lv-pt .lv-pp{font:700 16px/1.2 -apple-system,sans-serif;color:#C8102E}",
    "#lv .lv-pt .lv-pl{font-size:15px;color:#555}#lv .lv-pt .lv-pl.hot{color:#C8102E}",
    "#lv .lv-buy{flex:none;height:44px;padding:0 14px;border:0;border-radius:22px;background:linear-gradient(90deg,#B8913F,#E8C878);color:#111;font:800 16px/1 -apple-system,'PingFang TC',sans-serif;white-space:nowrap}",
    "#lv .lv-buy[disabled]{background:#ccc;color:#666}",
    "#lv .lv-px{position:absolute;right:-8px;top:-8px;width:30px;height:30px;border-radius:50%;border:0;background:#333;color:#fff;font:700 17px/1 sans-serif;padding:0}",
    /* 留言：疊在左下，新的在最下面 */
    "#lv .lv-chat{position:absolute;left:14px;right:72px;bottom:calc(76px + env(safe-area-inset-bottom) + var(--lv-kb,0px));max-height:40vh;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;gap:12px;-webkit-mask-image:linear-gradient(180deg,transparent 0,#000 30%);mask-image:linear-gradient(180deg,transparent 0,#000 30%);pointer-events:none;transition:bottom .2s}",
    "#lv .lv-m{display:flex;align-items:flex-start;gap:10px;max-width:100%;font:500 16px/1.38 -apple-system,'PingFang TC',sans-serif;text-shadow:0 1px 3px rgba(0,0,0,.75),0 0 8px rgba(0,0,0,.35);word-break:break-word;animation:lvIn .22s ease-out}",
    "#lv .lv-m .lv-mi{flex:none;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font:700 15px/1 -apple-system,'PingFang TC',sans-serif;color:#fff;text-shadow:none;object-fit:cover}",
    "#lv .lv-m .lv-mt{min-width:0;display:flex;flex-direction:column;gap:1px}",
    "#lv .lv-m b{font-weight:700;font-size:15px;color:#fff}",
    "#lv .lv-m.me b{color:#BFE3FF}",
    "#lv .lv-m.artist b{color:#F0DCA8}#lv .lv-m.artist .lv-mi{box-shadow:0 0 0 2px #F0DCA8}",
    "#lv .lv-m.sys{color:rgba(255,255,255,.85)}",
    "@keyframes lvIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}",
    /* 愛心飄 */
    "#lv .lv-hearts{position:absolute;right:2px;bottom:calc(70px + env(safe-area-inset-bottom) + var(--lv-kb,0px));width:80px;height:46vh;pointer-events:none;overflow:visible}",
    "#lv .lv-h{position:absolute;bottom:0;left:22px;font-size:30px;line-height:1;will-change:transform,opacity;animation:lvUp var(--d,2.4s) cubic-bezier(.25,.6,.4,1) forwards}",
    "@keyframes lvUp{0%{transform:translate(0,0) scale(.4);opacity:0}12%{transform:translate(calc(var(--x) * .2),-8%) scale(1.05);opacity:1}100%{transform:translate(var(--x),-100%) scale(.9);opacity:0}}",
    "#lv .lv-h.mine{font-size:34px}",
    /* 底部：留言框、愛心、貼圖 */
    "#lv .lv-bar{position:absolute;left:0;right:0;bottom:0;padding:8px 10px calc(10px + env(safe-area-inset-bottom)) 12px;display:flex;align-items:center;gap:8px;transform:translateY(calc(var(--lv-kb,0px) * -1));transition:transform .2s}",
    "#lv .lv-in{flex:1;min-width:0;height:46px;border-radius:23px;border:1.5px solid rgba(255,255,255,.7);background:transparent;color:#fff;padding:0 18px;font:500 16px/1 -apple-system,'PingFang TC',sans-serif;outline:none;-webkit-user-select:text;user-select:text}",
    "#lv .lv-in::placeholder{color:rgba(255,255,255,.85)}",
    "#lv .lv-btn{flex:none;width:44px;height:46px;border:0;background:transparent;color:#fff;display:flex;align-items:center;justify-content:center;padding:0;filter:drop-shadow(0 1px 3px rgba(0,0,0,.45))}",
    "#lv .lv-btn svg{width:30px;height:30px}",
    "#lv .lv-send{display:none;width:auto;padding:0 6px;font:700 17px/1 -apple-system,'PingFang TC',sans-serif;color:#fff}",
    "#lv.typing .lv-send{display:flex}#lv.typing .lv-heart,#lv.typing .lv-stk{display:none}",
    "#lv .lv-heart:active svg{transform:scale(.86)}#lv .lv-heart svg{transition:transform .12s}",
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
    /* 第 2 階段：直播室開著、但 Chance 還沒開始推畫面（或網路卡住）→ 中間顯示等待，畫面一來就自己播 */
    "#lv .lv-offair{position:absolute;left:24px;right:24px;top:40%;transform:translateY(-50%);text-align:center;display:none;pointer-events:none}",
    "#lv.ready .lv-offair.on{display:block}",
    "#lv .lv-offair p{margin:0;font:600 18px/1.6 -apple-system,'PingFang TC',sans-serif;color:rgba(255,255,255,.88);text-shadow:0 1px 4px rgba(0,0,0,.6)}",
    "#lv:not(.ready) .lv-bar,#lv:not(.ready) .lv-chat,#lv:not(.ready) .lv-hearts,#lv:not(.ready) .lv-sound,#lv:not(.ready) .lv-pill,#lv:not(.ready) .lv-pin{display:none}",
    "#lv .lv-why{margin-top:-6px;font-size:15px;color:rgba(255,255,255,.6)}",
    /* SIGNAL 頁的入口 */
    "#lv-entry{position:fixed;right:14px;top:calc(12px + env(safe-area-inset-top));z-index:9000;display:none;align-items:center;gap:7px;height:36px;padding:0 14px;border-radius:18px;border:0;background:#E5322D;color:#fff;font:800 16px/1 -apple-system,'PingFang TC',sans-serif;letter-spacing:.5px;pointer-events:auto;box-shadow:0 4px 14px rgba(229,50,45,.35)}",
    "#lv-entry.on{display:inline-flex}#lv-entry i{width:8px;height:8px;border-radius:50%;background:#fff;animation:lvBlink 1.4s infinite}",
    "@media (prefers-reduced-motion:reduce){#lv .lv-h{animation-duration:1.2s}#lv .lv-badge i,#lv-entry i{animation:none}}"
  ].join("\n");
  var st = document.createElement("style"); st.id = "lv-css"; st.textContent = css; document.head.appendChild(st);

  /* ---------- 畫面 ---------- */
  var EYE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
  var root = document.createElement("div"); root.id = "lv"; root.setAttribute("role", "dialog"); root.setAttribute("aria-modal", "true");
  root.innerHTML =
    '<video playsinline webkit-playsinline preload="none"></video><div class="lv-shade"></div>' +
    '<div class="lv-top"><span class="lv-host"><img class="lv-ava" src="assets/images/avatar.jpg" alt=""><span class="lv-name">成晞 Chance</span></span><span class="lv-badge">LIVE</span><span class="lv-pill lv-vw">' + EYE + '<span class="lv-v">0</span></span>' +
    '<span class="lv-sp"></span><span class="lv-ht" hidden>0</span>' +
    '<button type="button" class="lv-x" aria-label="關閉"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
    '<div class="lv-title"></div><div class="lv-pin" aria-live="polite"></div>' +
    '<div class="lv-chat" aria-live="polite"></div><div class="lv-hearts" aria-hidden="true"></div>' +
    '<button type="button" class="lv-sound"></button><div class="lv-offair"><div class="lv-spin"></div><p></p></div>' +
    '<div class="lv-state"></div>' +
    '<form class="lv-bar" autocomplete="off"><input class="lv-in" type="text" enterkeyhint="send" maxlength="80">' +
    '<button type="submit" class="lv-btn lv-send">送出</button>' +
    '<button type="button" class="lv-btn lv-stk" aria-label="貼圖"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 21H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v6.5L14.5 21z"/><path d="M14.5 21v-3.5a3 3 0 0 1 3-3H21"/><circle cx="9" cy="10" r=".6" fill="currentColor"/><circle cx="15" cy="10" r=".6" fill="currentColor"/><path d="M8.5 14c1 1 2.2 1.5 3.5 1.5"/></svg></button>' +
    '<button type="button" class="lv-btn lv-heart" aria-label="愛心"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.4 4.5 6.9 4.5c2.1 0 3.6 1.2 5.1 3 1.5-1.8 3-3 5.1-3 3.5 0 5.5 3.5 4.2 6.8-1.8 4.6-9.3 9.2-9.3 9.2z"/></svg></button></form>';
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

  function lastWho() {   /* 只給測試站：被擋時用的是哪個測試帳號（真實帳號不顯示 email） */
    var w = who(); if (!w) return "；沒有登入資料";
    return "；" + (/@load\.test$/.test(w.email) ? w.email : (w.email ? "真實帳號" : "沒有 email")) + "，碼 " + String(w.code || "").length + " 字" + (w.card ? "，錢包卡" : "");
  }
  function showState(kind, why) {
    root.classList.toggle("ready", kind === "ready");
    if (kind === "ready") { stateBox.classList.remove("on"); stateBox.innerHTML = ""; return; }
    var h = "";
    if (kind === "wait") h = '<div class="lv-spin"></div><p>' + T("連線中…", "Connecting…") + "</p>";
    else if (kind === "signal") h = "<h3>" + T("直播是給 SIGNAL 會員看的", "This live is for SIGNAL members") + "</h3><p>" + T("有 SIGNAL 私訊頻道（或全解鎖方案）就能看直播、留言、按愛心。", "Members of the SIGNAL channel (or the full unlock plan) can watch, chat and send hearts.") + "</p>" + (why && /test-v2/.test(location.pathname) ? '<p class="lv-why">（測試資訊：' + ({ nocred: "這支手機沒有讀到 SIGNAL 登入", server: "後台說不是會員", timeout: "連線太久沒回應" }[why] || why) + lastWho() + "）</p>" : "") + '<button type="button" data-lv="close">' + T("知道了", "OK") + "</button>";
    else if (kind === "idle") h = "<h3>" + T("還沒開播", "Not live yet") + "</h3><p>" + T("Chance 一開播，這裡就會自動開始，不用重新整理。", "It starts here by itself as soon as Chance goes live.") + '</p><button type="button" data-lv="close">' + T("知道了", "OK") + "</button>";
    else if (kind === "ended") h = "<h3>" + T("直播已結束", "The live has ended") + "</h3><p>" + T("謝謝你來。", "Thanks for being here.") + '</p><button type="button" data-lv="close">' + T("關閉", "Close") + "</button>";
    stateBox.innerHTML = h; stateBox.classList.add("on");
  }
  function paintRoom() {
    if (!room) return;
    var live = room.status === "live";
    $(".lv-badge").classList.toggle("off", !live);
    $(".lv-title").textContent = room.title || "";
    $(".lv-ht").textContent = fmt(room.hearts);
    paintOffer();
    input.disabled = !live;
    if (!naming) input.placeholder = me && me.banned ? T("你目前不能留言", "You can't chat right now") : T("留言…", "Comment…");
    if (me && me.banned) input.disabled = true;
    $(".lv-heart").disabled = !live; $(".lv-stk").disabled = !live;
    if (live) showState("ready"); else showState(room.status === "ended" ? "ended" : "idle");
    if (live && room.hls) playHls(room.hls); else stopVideo();
  }

  /* ---------- 影像（iPhone 用內建 HLS；電腦瀏覽器才載入 hls.js） ---------- */
  /* ---------- 直播中開賣（置頂商品卡） ----------
     庫存讀公開的資料（跟 SHOP 頁同一份）：門票 /ticket/events、生日周邊 /ticket/merch、官方卡包 the-sky-shop /shop/items。
     按「立刻搶」→ 收起直播 → 打開 SHOP → 按 SHOP 自己的那顆按鈕，走原本的購票／周邊付款流程（付款程式完全不動）。 */
  var SHOP_API = window.THE_SKY_SHOP_API || "https://the-sky-shop.anthonywen0693.workers.dev";
  var offerId = "", offerHidden = "", stockT = null, cdT = null, stock = null;
  function pinNow() { var p = room && room.pin; if (!p || (p.endsAt && p.endsAt < Date.now())) return null; return p; }
  function paintOffer() {
    var box = $(".lv-pin"), p = pinNow();
    clearInterval(cdT); cdT = null;
    if (!p || offerHidden === p.id) { box.classList.remove("on"); box.textContent = ""; clearTimeout(stockT); stockT = null; offerId = p ? p.id : ""; return; }
    if (p.id !== offerId) {   /* 新的開搶：跳出來＋iOS 通知樣式提示 */
      var first = !!offerId || (Date.now() - (p.at || 0) < 15000); offerId = p.id; stock = null;
      if (first && opened) { try { if (navigator.vibrate) navigator.vibrate([10, 40, 10]); } catch (e) {} banner("lv-offer", p.kind === "link" ? T("Chance 分享了一個連結", "Chance shared a link") : T("開賣了！", "On sale now!"), p.title, 3200); }
      box.classList.remove("on"); void box.offsetWidth;
      loadStock();
    }
    box.textContent = "";
    var im = document.createElement("img"); im.alt = ""; im.src = p.img || (stock && stock.img) || "assets/images/avatar.jpg"; box.appendChild(im);
    var t = document.createElement("div"); t.className = "lv-pt";
    var b = document.createElement("b"); b.textContent = p.title; t.appendChild(b);
    var price = (stock && stock.price) || p.price;
    if (price) { var pr = document.createElement("span"); pr.className = "lv-pp"; pr.textContent = "NT$" + Number(price).toLocaleString("en-US"); t.appendChild(pr); }
    var line = document.createElement("span"); line.className = "lv-pl";
    var left = stock ? stock.left : null, soldOut = !!(stock && stock.soldOut);
    if (soldOut) line.textContent = T("已售完", "Sold out");
    else if (left != null && left < 9999) { line.textContent = (p.kind === "ticket" ? T("剩 ", "") + left + T(" 張", " left") : T("剩 ", "") + left + T(" 件", " left")); if (left <= 10) line.classList.add("hot"); }
    else if (p.sub) line.textContent = p.sub;
    if (p.endsAt) { var cd = document.createElement("span"); cd.className = "lv-pl hot"; t.appendChild(cd); var tick = function () { var ms = p.endsAt - Date.now(); if (ms <= 0) { paintOffer(); return; } var m = Math.floor(ms / 60000), sec = Math.floor(ms % 60000 / 1000); cd.textContent = T("限時 ", "Ends in ") + m + ":" + (sec < 10 ? "0" : "") + sec; }; tick(); cdT = setInterval(tick, 1000); }
    if (line.textContent) t.appendChild(line);
    box.appendChild(t);
    var go = document.createElement("button"); go.type = "button"; go.className = "lv-buy";
    go.textContent = p.kind === "link" ? T("打開", "Open") : soldOut ? T("已售完", "Sold out") : T("立刻搶", "Buy now");
    go.disabled = soldOut; go.addEventListener("click", function () { buyNow(p); }); box.appendChild(go);
    var x = document.createElement("button"); x.type = "button"; x.className = "lv-px"; x.textContent = "×"; x.setAttribute("aria-label", T("收起", "Hide"));
    x.addEventListener("click", function () { offerHidden = p.id; paintOffer(); }); box.appendChild(x);
    box.classList.add("on");
  }
  function getJSON(u) { return fetch(u, { cache: "no-store", credentials: "omit" }).then(function (r) { return r.json(); }); }
  function loadStock() {
    clearTimeout(stockT); stockT = null;
    var p = pinNow(); if (!p || !opened || p.kind === "link") return;
    var pid = p.id, q;
    if (p.kind === "ticket") q = getJSON(API + "/ticket/events").then(function (d) {
      var e = (d.events || []).filter(function (x) { return x.id === p.ev; })[0]; if (!e) return null;
      var ts = e.tiers || [], left = e.left, minP = e.price;
      if (ts.length) { var open = ts.filter(function (t) { return t.onSale !== false; }); if (open.length && open.every(function (t) { return t.left != null; })) left = open.reduce(function (a, t) { return a + Number(t.left || 0); }, 0); }
      return { left: left, soldOut: left === 0, price: minP };
    });
    else if (p.kind === "merch") q = getJSON(API + "/ticket/merch?eventId=" + encodeURIComponent(p.ev)).then(function (d) {
      var it = d.merch && d.merch.items && d.merch.items[p.k]; if (!it) return null;
      return { left: it.left, soldOut: !(it.left > 0) || !(d.merch.onSale !== false), price: it.price, img: it.img };
    });
    else q = getJSON(SHOP_API + "/shop/items").then(function (d) {
      var it = (d.items || []).filter(function (x) { return !p.k || x.key === p.k; })[0]; if (!it) return null;
      return { left: it.left, soldOut: !!it.soldOut || it.onSale === false, price: it.price, img: it.img };
    });
    q.then(function (s2) { if (pid !== offerId) return; stock = s2; paintOffer(); }, function () {}).then(function () { if (pid === offerId && opened) stockT = setTimeout(loadStock, 10000); });
  }
  function buyNow(p) {
    if (p.kind === "link") { try { window.open(p.url, "_blank", "noopener"); } catch (e) { location.href = p.url; } return; }
    var sel = p.kind === "ticket" ? '[data-act="open-buy"][data-ev="' + p.ev + '"]' : p.kind === "merch" ? '[data-act="m-open-k"][data-k="' + p.k + '"]' : '[data-act="cxl-pack"]';
    close(true);
    /* 等直播的「返回」紀錄退完再開 SHOP，不然 SHOP 剛打開的視窗會被那一次返回關掉 */
    setTimeout(function () {
      var nav = document.querySelector('.navbtn[data-screen="merch"]'); if (nav) nav.click();
      var t0 = Date.now();
      (function poll() {
        var root2 = document.getElementById("tk-root"), el = root2 && (root2.querySelector(sel) || (p.kind === "ticket" ? root2.querySelector('[data-act="open-buy"]') : null));
        if (el && !el.disabled && !el.classList.contains("disabled")) { el.click(); return; }
        if (Date.now() - t0 > 9000) { banner("lv-buy", T("已經幫你打開 SHOP", "SHOP is open"), T("在這一頁就能買，直播在 SIGNAL 頁右上角回得去。", "You can buy here. Go back to the live from the top right of SIGNAL."), 4200); return; }
        setTimeout(poll, 250);
      })();
    }, 450);
  }

  /* 影像：iPhone 用內建 HLS；電腦瀏覽器才載入 hls.js。
     第 2 階段（Cloudflare Stream）：還沒開播時網址會失敗 → 顯示「等待畫面」，每 6 秒再試一次；畫面一出來就自動播。 */
  var offT = null, offBox = $(".lv-offair");
  function offAir(on) {
    if (on) { offBox.querySelector("p").textContent = T("Chance 還沒開始，畫面一出來就會自動播放", "Chance hasn't started yet. It will play as soon as the video comes in."); offBox.classList.add("on"); }
    else offBox.classList.remove("on");
  }
  function retryVideo() {
    clearTimeout(offT);
    if (!hlsUrl || !opened) return;
    offAir(true);
    offT = setTimeout(function () { var u = hlsUrl; if (!u || !opened) return; hlsUrl = ""; if (hls) { hls.destroy(); hls = null; } video.removeAttribute("src"); try { video.load(); } catch (e) {} playHls(u); }, 6000);
  }
  video.addEventListener("playing", function () { clearTimeout(offT); offAir(false); });
  /* 只算「現在這個直播網址」的錯誤；按進直播那一下先解鎖播放（還沒有網址）留下的錯誤不算 */
  video.addEventListener("error", function () { if (hlsUrl && !hls && (video.currentSrc || "") === hlsUrl) retryVideo(); });
  video.addEventListener("ended", function () { if (hlsUrl) retryVideo(); });   /* 推流中斷（手機沒訊號、按了停止）→ 回到等待，重新推就接回來 */
  function playHls(url) {
    if (hlsUrl === url && !video.paused) return;
    hlsUrl = url;
    var go = function () { var p = video.play(); if (p && p.catch) p.catch(function (e) { if (e && e.name === "NotAllowedError") { video.muted = true; video.play().catch(function () {}); soundBtn.textContent = T("🔇 點一下開聲音", "🔇 Tap for sound"); soundBtn.classList.add("on"); } }); };
    if (video.canPlayType("application/vnd.apple.mpegurl")) { if (video.getAttribute("src") !== url) video.src = url; go(); return; }
    loadHlsJs(function (H) {
      if (!H || !H.isSupported()) { video.src = url; go(); return; }
      if (hls) hls.destroy();
      hls = new H({ lowLatencyMode: true, liveSyncDurationCount: 3 }); hls.loadSource(url); hls.attachMedia(video);
      hls.on(H.Events.MANIFEST_PARSED, go);
      hls.on(H.Events.ERROR, function (ev, d) { if (d && d.fatal) retryVideo(); });
    });
  }
  function stopVideo() { hlsUrl = ""; clearTimeout(offT); offAir(false); try { video.pause(); } catch (e) {} if (hls) { hls.destroy(); hls = null; } video.removeAttribute("src"); try { video.load(); } catch (e) {} }
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
    if (!m.sys) d.appendChild(avaOf(m));
    var t = document.createElement("div"); t.className = "lv-mt";
    if (m.n) { var b = document.createElement("b"); b.textContent = m.n; t.appendChild(b); }
    var x = document.createElement("span"); x.textContent = m.x || ""; t.appendChild(x); d.appendChild(t);
    chat.appendChild(d);
    while (chat.children.length > 40) chat.removeChild(chat.firstChild);
  }
  /* 粉絲沒有大頭貼：用名字第一個字＋依名字固定的顏色；Chance 本人用他的照片 */
  var AVA_C = ["#E0006E", "#7B61FF", "#00A3FF", "#00B37E", "#FF8A00", "#D6B66F", "#FF4D6D", "#5C7CFA"];
  function avaOf(m) {
    if (m.artist) { var im = document.createElement("img"); im.className = "lv-mi"; im.src = "assets/images/avatar.jpg"; im.alt = ""; return im; }
    var n = String(m.n || "?"), h = 0; for (var i = 0; i < n.length; i++) h = (h * 31 + n.charCodeAt(i)) >>> 0;
    var a = document.createElement("span"); a.className = "lv-mi"; a.style.background = AVA_C[h % AVA_C.length]; a.textContent = Array.from(n)[0] || "?"; return a;
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
    if (!w || !w.ok || !w.email || !w.code) { denied = true; showState("signal", "nocred"); return; }
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
    if (m.t === "deny") { if (m.why === "timeout") return;   /* 打招呼太晚被後台關掉（手機剛開 App 很忙）：不是不給看，連線斷了會自動重連 */
      denied = true; stopVideo(); showState("signal", "server"); return; }
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
  /* 送出中不鎖輸入框（鎖了 iPhone 鍵盤會收起來）；只擋重複送出。成功才清掉，失敗留著讓他改 */
  function doneSending(ok) { sending = null; clearTimeout(doneSending.t); if (ok) { input.value = ""; root.classList.remove("typing"); } }
  function say(text) {
    var k = "k" + Date.now().toString(36);
    if (!send({ t: "say", x: text, k: k })) { banner("lv-err", T("還沒連上，等一下再送", "Not connected yet"), "", 2400); return; }
    sending = k;
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
  /* 愛心要能連按：手指一碰就算（click 在 iPhone 連點時會被當成雙擊吃掉） */
  var hb = $(".lv-heart");
  if (window.PointerEvent) hb.addEventListener("pointerdown", function (e) { if (e.button > 0) return; e.preventDefault(); tapHeart(); });
  else hb.addEventListener("touchstart", function (e) { e.preventDefault(); tapHeart(); }, { passive: false });
  hb.addEventListener("click", function (e) { e.preventDefault(); if (e.detail === 0) tapHeart(); });   /* 鍵盤（Enter／空白鍵）按愛心 */
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
    opened = true; paintEntry(); denied = false; offerId = ""; tries = 0; seen = {}; me = null; room = null; myHearts = 0;
    $(".lv-send").textContent = T("送出", "Send"); input.placeholder = T("留言…", "Comment…");
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
    opened = false; clearTimeout(stockT); stockT = null; clearInterval(cdT); naming = false; pendingText = ""; input.maxLength = 80; clearInterval(pingT); clearTimeout(retryT); retryT = null; flushHearts();
    if (ws) { var w = ws; ws = null; try { w.close(1000); } catch (e) {} }
    if (netBanner) { netBanner.hide(); netBanner = null; }
    stopVideo(); soundBtn.classList.remove("on");
    root.classList.remove("on", "typing"); input.value = ""; input.blur();
    document.body.style.overflow = ""; paintEntry();
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
  var infoT = null, isLive = false;
  function onSignal() { var sm = document.getElementById("screen-mood"); return !!(sm && sm.classList.contains("active")); }
  function paintEntry() { entry.classList.toggle("on", isLive && onSignal() && !opened); }
  function pollInfo() {
    clearTimeout(infoT);
    var here = onSignal() && !document.hidden;
    if (here) fetch(API + "/live/info?room=" + ROOM, { cache: "no-store", credentials: "omit" }).then(function (r) { return r.json(); }).then(function (d) {
      isLive = !!(d && d.ok && d.room && d.room.status === "live"); paintEntry();
    }).catch(function () {});
    paintEntry();
    infoT = setTimeout(pollInfo, here ? 30000 : 4000);
  }
  function boot() {
    document.body.appendChild(root); document.body.appendChild(entry);
    var sm = document.getElementById("screen-mood");   /* 換分頁時入口馬上跟著出現／消失 */
    if (sm && window.MutationObserver) new MutationObserver(function () { paintEntry(); if (onSignal()) pollInfo(); }).observe(sm, { attributes: true, attributeFilter: ["class"] });
    pollInfo();
    var lt = /(?:^#|&)livetest=(\d+)/.exec(location.hash);   /* 只給測試：#livetest=N（見 test-v2.html 的 skyLiveTestLogin） */
    if (lt) { try { if (window.skyLiveTestLogin) window.skyLiveTestLogin(lt[1]); } catch (e) {} try { history.replaceState(history.state, "", location.pathname + location.search + "#live"); } catch (e) {} }
    if (/(^#|&)live\b/.test(location.hash)) open();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
  window.skyLive = { open: open, close: function () { close(true); } };
  /* 只給測試站：不用後台鑰匙也能看商品卡長怎樣（只改這支手機的畫面，不會送到後台） */
  if (/test-v2/.test(location.pathname)) window.skyLive.previewPin = function (p) { if (!room) return "先打開直播"; p = p || {}; p.id = p.id || "preview" + Date.now(); p.at = Date.now(); room.pin = p; paintOffer(); return "ok"; };
})();
