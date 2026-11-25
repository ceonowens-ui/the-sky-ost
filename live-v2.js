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
    /* V2-12（CÉON 11/25 選 B）：照 TikTok 直播的版面。左上「大頭貼＋名字＋幾人在看」膠囊、下面 LIVE；右上最近留言的人＋✕；
       留言一行一則「名字：內容」半透明底；商品卡在留言上方；底部購物袋、說點什麼、禮物、愛心。字一律 15 以上 */
    "#lv .lv-host{display:flex;align-items:center;gap:8px;min-width:0;background:rgba(0,0,0,.38);border-radius:26px;padding:4px 16px 4px 4px;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}",
    "#lv .lv-ava{width:40px;height:40px;border-radius:50%;object-fit:cover;flex:none}",
    "#lv .lv-hn{display:flex;flex-direction:column;gap:1px;min-width:0}",
    "#lv .lv-name{font:700 16px/1.15 -apple-system,'PingFang TC',sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:38vw}",
    "#lv .lv-hs{font:500 15px/1.15 -apple-system,'PingFang TC',sans-serif;color:rgba(255,255,255,.85);white-space:nowrap;font-variant-numeric:tabular-nums}",
    "#lv .lv-badge{position:absolute;left:14px;top:calc(62px + env(safe-area-inset-top));display:inline-flex;align-items:center;height:26px;padding:0 9px;border-radius:6px;background:#FE2C55;font:800 15px/1 -apple-system,sans-serif;letter-spacing:.6px}",
    "#lv .lv-badge.off{background:rgba(255,255,255,.25)}",
    "@keyframes lvBlink{50%{opacity:.25}}",
    "#lv .lv-sp{flex:1}",
    "#lv .lv-vav{display:flex;align-items:center;margin-right:4px}",
    "#lv .lv-vav span{width:30px;height:30px;border-radius:50%;border:2px solid rgba(0,0,0,.6);margin-left:-9px;display:flex;align-items:center;justify-content:center;font:700 15px/1 -apple-system,'PingFang TC',sans-serif;color:#fff}",
    "#lv .lv-x{width:44px;height:44px;border:0;border-radius:50%;background:transparent;color:#fff;display:flex;align-items:center;justify-content:center;padding:0;filter:drop-shadow(0 1px 3px rgba(0,0,0,.5))}",
    "#lv .lv-x svg{width:26px;height:26px}",
    "#lv .lv-title{display:none}",
    /* 下半部：商品卡＋留言，一起貼在底列上方 */
    "#lv .lv-low{position:absolute;left:12px;right:78px;bottom:calc(68px + env(safe-area-inset-bottom) + var(--lv-kb,0px));display:flex;flex-direction:column;align-items:flex-start;gap:10px;transition:bottom .2s;pointer-events:none}",
    "#lv .lv-pin{position:relative;width:min(290px,100%);display:none;align-items:center;gap:9px;padding:8px;border-radius:14px;background:rgba(255,255,255,.96);color:#111;box-shadow:0 6px 20px rgba(0,0,0,.3);font:600 16px/1.3 -apple-system,'PingFang TC',sans-serif;pointer-events:auto}",
    "#lv .lv-pin.on{display:flex;animation:lvPop .32s cubic-bezier(.2,1.3,.4,1)}",
    "@keyframes lvPop{from{opacity:0;transform:translateY(10px) scale(.94)}to{opacity:1;transform:none}}",
    "#lv .lv-pin img{width:56px;height:56px;border-radius:9px;object-fit:cover;flex:none;background:#eee}",
    "#lv .lv-pt{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}",
    "#lv .lv-pt b{font-size:16px;line-height:1.25;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}",
    "#lv .lv-pt .lv-pp{font:800 16px/1.25 -apple-system,sans-serif;color:#FE2C55}",
    "#lv .lv-pt .lv-pl{font-size:15px;color:#555}#lv .lv-pt .lv-pl.hot{color:#FE2C55}",
    "#lv .lv-pt .lv-pp s{display:block;font-weight:500;color:#888;font-size:15px}#lv .lv-pt .lv-lp{display:inline-block;margin-right:5px;padding:1px 5px;border-radius:4px;background:#FE2C55;color:#fff;font-size:15px}",
    "#lv .lv-buy{flex:none;min-width:52px;height:44px;padding:0 14px;border:0;border-radius:22px;background:#FE2C55;color:#fff;font:800 17px/1 -apple-system,'PingFang TC',sans-serif;white-space:nowrap}",
    "#lv .lv-buy[disabled]{background:#ccc;color:#666}",
    "#lv .lv-buy.got{background:#111;color:#F0DCA8}",
    "#lv .lv-state .lv-rs{display:flex;align-items:center;gap:12px;margin:0 0 12px;padding:12px 14px;border-radius:14px;background:rgba(255,255,255,.1);text-align:left;font:600 17px/1.4 -apple-system,'PingFang TC',sans-serif}",
    "#lv .lv-state .lv-rs span{flex:1;min-width:0}#lv .lv-state .lv-rs button{flex:none;height:44px;padding:0 18px}",
    "#lv .lv-state button.ghost{background:transparent;color:#fff;border:1.5px solid rgba(255,255,255,.5)}",
    "#screen-live .lt-res{margin:16px 14px 0;padding:16px;border-radius:18px;background:#1C1813;border:1px solid rgba(232,200,120,.5)}",
    "#screen-live .lt-res h4{margin:0 0 4px;font:700 18px/1.4 'Noto Sans TC',-apple-system,sans-serif;color:#E8C878}",
    "#screen-live .lt-res p{margin:0 0 12px;font:400 15px/1.6 'Noto Sans TC',-apple-system,sans-serif;color:#B9AD99}",
    "#screen-live .lt-res-r{display:flex;align-items:center;gap:12px;padding:10px 0;border-top:1px solid rgba(255,255,255,.1)}",
    "#screen-live .lt-res-r div{flex:1;min-width:0;font:500 16px/1.45 'Noto Sans TC',-apple-system,sans-serif;color:#F6F1E7}#screen-live .lt-res-r div b{display:block;font-weight:700}",
    "#screen-live .lt-res-r .lt-btn{flex:none;height:46px;padding:0 20px}",
    "#lv .lv-px{position:absolute;right:-8px;top:-8px;width:30px;height:30px;border-radius:50%;border:0;background:#333;color:#fff;font:700 17px/1 sans-serif;padding:0}",
    "#lv .lv-chat{width:100%;max-height:34vh;overflow:hidden;display:flex;flex-direction:column;align-items:flex-start;justify-content:flex-end;gap:6px;-webkit-mask-image:linear-gradient(180deg,transparent 0,#000 22%);mask-image:linear-gradient(180deg,transparent 0,#000 22%)}",
    "#lv .lv-m{max-width:100%;padding:6px 12px;border-radius:16px;background:rgba(0,0,0,.38);font:500 15px/1.4 -apple-system,'PingFang TC',sans-serif;text-shadow:0 1px 2px rgba(0,0,0,.4);word-break:break-word;animation:lvIn .22s ease-out}",
    "#lv .lv-m b{font-weight:700}",
    "#lv .lv-m.sys{color:rgba(255,255,255,.82)}",
    "#lv .lv-m.artist{background:rgba(160,120,40,.55);border:1px solid #F0DCA8}#lv .lv-m.artist b{color:#F0DCA8}",
    "@keyframes lvIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}",
    /* 愛心飄 */
    "#lv .lv-hearts{position:absolute;right:4px;bottom:calc(64px + env(safe-area-inset-bottom) + var(--lv-kb,0px));width:76px;height:46vh;pointer-events:none;overflow:visible}",
    "#lv .lv-h{position:absolute;bottom:0;left:20px;font-size:30px;line-height:1;will-change:transform,opacity;animation:lvUp var(--d,2.4s) cubic-bezier(.25,.6,.4,1) forwards}",
    "@keyframes lvUp{0%{transform:translate(0,0) scale(.4);opacity:0}12%{transform:translate(calc(var(--x) * .2),-8%) scale(1.05);opacity:1}100%{transform:translate(var(--x),-100%) scale(.9);opacity:0}}",
    "#lv .lv-h.mine{font-size:34px}",
    /* 底部：購物袋、說點什麼、禮物、愛心 */
    "#lv .lv-bar{position:absolute;left:0;right:0;bottom:0;padding:8px 10px calc(10px + env(safe-area-inset-bottom));display:flex;align-items:center;gap:8px;transform:translateY(calc(var(--lv-kb,0px) * -1));transition:transform .2s}",
    "#lv .lv-in{flex:1;min-width:0;height:44px;border-radius:22px;border:0;background:rgba(0,0,0,.42);color:#fff;padding:0 16px;font:500 16px/1 -apple-system,'PingFang TC',sans-serif;outline:none;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);-webkit-user-select:text;user-select:text}",
    "#lv .lv-in::placeholder{color:rgba(255,255,255,.75)}",
    "#lv .lv-btn{position:relative;flex:none;width:44px;height:44px;border:0;border-radius:50%;background:rgba(0,0,0,.4);color:#fff;display:flex;align-items:center;justify-content:center;padding:0;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}",
    "#lv .lv-btn svg{width:25px;height:25px}",
    "#lv .lv-bag{color:#FFB648}#lv .lv-bag em{position:absolute;top:-4px;right:-4px;min-width:20px;height:20px;border-radius:10px;background:#FE2C55;color:#fff;font:700 15px/20px -apple-system,sans-serif;font-style:normal;text-align:center;padding:0 4px;display:none}#lv .lv-bag.has em{display:block}",
    "#lv .lv-send{display:none;width:auto;border-radius:22px;padding:0 16px;background:#FE2C55;font:700 16px/1 -apple-system,'PingFang TC',sans-serif;color:#fff}",
    "#lv.typing .lv-send{display:flex}#lv.typing .lv-heart,#lv.typing .lv-stk,#lv.typing .lv-bag{display:none}",
    "#lv .lv-heart:active svg{transform:scale(.86)}#lv .lv-heart svg{transition:transform .12s}",
    "#lv .lv-btn[disabled]{opacity:.45}",
    /* V2-13（CÉON 11/25 選 A）：送 SIGNAL 給朋友。按「送朋友」→ 下面滑出填朋友 email 的小視窗 */
    "#lv .lv-gs{position:absolute;left:0;right:0;bottom:0;z-index:3;background:#fff;color:#111;border-radius:20px 20px 0 0;padding:20px 18px calc(18px + env(safe-area-inset-bottom));transform:translateY(110%);transition:transform .28s cubic-bezier(.2,.9,.3,1);box-shadow:0 -10px 30px rgba(0,0,0,.3)}",
    "#lv .lv-gs.on{transform:translateY(calc(var(--lv-kb,0px) * -1))}",
    "#lv .lv-gs h3{margin:0 0 6px;font:800 19px/1.35 -apple-system,'PingFang TC',sans-serif}",
    "#lv .lv-gs p{margin:0 0 14px;font:500 16px/1.55 -apple-system,'PingFang TC',sans-serif;color:#444}",
    "#lv .lv-gs input{width:100%;box-sizing:border-box;height:50px;border-radius:12px;border:1.5px solid #ccc;padding:0 14px;font:500 17px/1 -apple-system,sans-serif;color:#111;background:#fff;-webkit-user-select:text;user-select:text}",
    "#lv .lv-gs .lv-gb{display:flex;gap:10px;margin-top:14px}",
    "#lv .lv-gs button{flex:1;height:50px;border-radius:25px;border:0;font:800 17px/1 -apple-system,'PingFang TC',sans-serif}",
    "#lv .lv-gs .go{background:#FE2C55;color:#fff}#lv .lv-gs .no{background:#eee;color:#333;flex:0 0 34%}",
    "#lv .lv-gs button[disabled]{opacity:.5}",
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
    "#lv:not(.ready) .lv-bar,#lv:not(.ready) .lv-low,#lv:not(.ready) .lv-hearts,#lv:not(.ready) .lv-sound,#lv:not(.ready) .lv-hs,#lv:not(.ready) .lv-vav{display:none}",
    "#lv .lv-why{margin-top:-6px;font-size:15px;color:rgba(255,255,255,.6)}",
    /* SIGNAL 頁的入口 */
    "#lv-entry{position:fixed;right:14px;top:calc(12px + env(safe-area-inset-top));z-index:9000;display:none;align-items:center;gap:7px;height:36px;padding:0 14px;border-radius:18px;border:0;background:#E5322D;color:#fff;font:800 16px/1 -apple-system,'PingFang TC',sans-serif;letter-spacing:.5px;pointer-events:auto;box-shadow:0 4px 14px rgba(229,50,45,.35)}",
    "#lv-entry.on{display:inline-flex}#lv-entry i{width:8px;height:8px;border-radius:50%;background:#fff;animation:lvBlink 1.4s infinite}",
    /* V2-14（CÉON 11/25，照 Figma「CHANCE App · LIVE 分頁」）：LIVE 分頁 */
    "#screen-live{padding:calc(14px + env(safe-area-inset-top)) 0 calc(130px + env(safe-area-inset-bottom));color:#F3EADB}",
    "#screen-live .lt-head{display:flex;align-items:center;justify-content:space-between;padding:14px 16px 16px}",
    "#screen-live .lt-ttl{font-family:var(--font-label,'Bodoni Moda',serif);font-weight:600;font-size:32px;letter-spacing:.14em;color:#F3EADB}",
    "#screen-live .lt-chip{display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 14px 0 12px;border-radius:20px;border:1px solid #3A3128;background:transparent;color:#F3EADB;font:500 15px/1 'Noto Sans TC',-apple-system,sans-serif}",
    "#screen-live .lt-chip svg{width:18px;height:18px;color:#E8C878}",
    "#screen-live .lt-hero{position:relative;margin:0 14px;min-height:418px;border-radius:22px;overflow:hidden;background:#1C1813 url(assets/images/artist-background.jpg) center 28%/cover no-repeat;display:flex;flex-direction:column;justify-content:flex-end;padding:16px 18px 18px;box-sizing:border-box}",
    "#screen-live .lt-hero::before{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.35) 0,rgba(0,0,0,.05) 40%,rgba(8,8,9,.92) 100%)}",
    "#screen-live .lt-hero>*{position:relative}",
    "#screen-live .lt-tags{position:absolute;left:16px;top:16px;display:flex;gap:8px}",
    "#screen-live .lt-pill{display:inline-flex;align-items:center;height:30px;padding:0 10px;border-radius:8px;background:rgba(8,8,9,.6);font:500 15px/1 'Noto Sans TC',-apple-system,sans-serif;color:#F3EADB}",
    "#screen-live .lt-pill.red{background:#FE2C55;color:#fff;font-weight:700;letter-spacing:.04em}",
    "#screen-live .lt-host{display:flex;align-items:center;gap:8px;margin-bottom:6px;font:500 16px/1.2 'Noto Sans TC',sans-serif}",
    "#screen-live .lt-host img{width:32px;height:32px;border-radius:50%;object-fit:cover;box-shadow:0 0 0 2px #FE2C55}",
    "#screen-live .lt-date{font-family:var(--font-serif-tc,'Noto Serif TC',serif);font-weight:600;font-size:26px;line-height:1.3}",
    "#screen-live .lt-big{font-family:var(--font-serif-tc,'Noto Serif TC',serif);font-weight:600;font-size:23px;line-height:1.35}",
    "#screen-live .lt-sub{margin-top:4px;font:400 16px/1.45 'Noto Sans TC',sans-serif;color:#B9AD99}",
    "#screen-live .lt-cd{display:flex;justify-content:center;gap:10px;margin:14px 0 12px}",
    "#screen-live .lt-u{min-width:66px;padding:6px 10px 8px;border-radius:12px;background:rgba(8,8,9,.62);border:1px solid rgba(255,255,255,.1);text-align:center;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}",
    "#screen-live .lt-u b{display:block;font-family:var(--font-label,'Bodoni Moda',serif);font-weight:500;font-size:40px;line-height:1.1;font-variant-numeric:tabular-nums}",
    "#screen-live .lt-u span{font:500 15px/1.2 'Noto Sans TC',sans-serif;color:#E8C878}",
    "#screen-live .lt-btns{display:flex;gap:10px;margin-top:14px}",
    "#screen-live .lt-btn{flex:1;height:50px;border-radius:25px;border:0;display:inline-flex;align-items:center;justify-content:center;gap:8px;font:700 17px/1 'Noto Sans TC',-apple-system,sans-serif}",
    "#screen-live .lt-btn svg{width:20px;height:20px}",
    "#screen-live .lt-btn.w{background:#fff;color:#111}#screen-live .lt-btn.r{background:#FE2C55;color:#fff}#screen-live .lt-btn.o{flex:0 0 auto;padding:0 18px;background:transparent;border:1.5px solid #E8C878;color:#E8C878}",
    "#screen-live .lt-btn.on{background:rgba(255,255,255,.16);color:#fff}",
    "#screen-live .lt-note{display:flex;align-items:center;gap:8px;margin:16px 18px 0;font:400 15px/1.5 'Noto Sans TC',sans-serif;color:#B9AD99}",
    "#screen-live .lt-note svg{width:18px;height:18px;flex:none;color:#D6B66F}",
    ".navbtn[data-screen=live] .navico{position:relative}.nav-live-dot{position:absolute;top:-3px;right:-6px;width:9px;height:9px;border-radius:50%;background:#FE2C55;box-shadow:0 0 0 2px rgba(20,16,12,.9);display:none}body.sky-live-on .nav-live-dot{display:block}",
    "@media (prefers-reduced-motion:reduce){#lv .lv-h{animation-duration:1.2s}#lv .lv-badge i,#lv-entry i{animation:none}}"
  ].join("\n");
  var st = document.createElement("style"); st.id = "lv-css"; st.textContent = css; document.head.appendChild(st);

  /* ---------- 畫面 ---------- */
  var EYE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
  var root = document.createElement("div"); root.id = "lv"; root.setAttribute("role", "dialog"); root.setAttribute("aria-modal", "true");
  root.innerHTML =
    '<video playsinline webkit-playsinline preload="none"></video><div class="lv-shade"></div>' +
    '<div class="lv-top"><span class="lv-host"><img class="lv-ava" src="assets/images/avatar.jpg" alt=""><span class="lv-hn"><span class="lv-name">成晞 Chance</span><span class="lv-hs"><span class="lv-v">0</span><span class="lv-vt"> 人在看</span></span></span></span>' +
    '<span class="lv-sp"></span><span class="lv-vav" aria-hidden="true"></span><span class="lv-ht" hidden>0</span>' +
    '<button type="button" class="lv-x" aria-label="關閉"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
    '<span class="lv-badge">LIVE</span><div class="lv-title"></div>' +
    '<div class="lv-low"><div class="lv-pin" aria-live="polite"></div><div class="lv-chat" aria-live="polite"></div></div><div class="lv-hearts" aria-hidden="true"></div>' +
    '<button type="button" class="lv-sound"></button><div class="lv-offair"><div class="lv-spin"></div><p></p></div>' +
    '<div class="lv-state"></div>' +
    '<form class="lv-gs" autocomplete="off" novalidate><h3></h3><p></p><input type="email" inputmode="email" autocapitalize="off" spellcheck="false" maxlength="120"><div class="lv-gb"><button type="button" class="no"></button><button type="submit" class="go"></button></div></form>' +
    '<form class="lv-bar" autocomplete="off"><button type="button" class="lv-btn lv-bag" aria-label="商品"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7h12l-1 13H7L6 7z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg><em>1</em></button><input class="lv-in" type="text" enterkeyhint="send" maxlength="80">' +
    '<button type="submit" class="lv-btn lv-send">送出</button>' +
    '<button type="button" class="lv-btn lv-stk" aria-label="禮物、貼圖"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="8" width="17" height="4" rx="1"/><path d="M5 12v8h14v-8M12 8v12M12 8c-1.5-3-5-3.5-5-1.2C7 8 9.5 8 12 8zM12 8c1.5-3 5-3.5 5-1.2C17 8 14.5 8 12 8z"/></svg></button>' +
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
    else if (kind === "ended") {
      var rs = resAll(), pb = room && room.payBy;
      h = "<h3>" + T("直播已結束", "The live has ended") + "</h3>";
      if (rs.length) {
        endSeen = true;   /* 已經在結束畫面看過付款提醒，回到 App 不再跳一次通知 */
        h += "<p>" + (pb ? T("你搶到的還沒付款。請在 " + hhmm(pb) + " 前付款，時間到沒付會自動釋出。", "You haven't paid yet. Please pay before " + hhmm(pb) + " or it will be released.") : T("你搶到的還沒付款。請在 30 分鐘內付款，時間到沒付會自動釋出。", "You haven't paid yet. Please pay within 30 minutes or it will be released.")) + "</p>";
        rs.forEach(function (r) { h += '<div class="lv-rs"><span>' + esc(r.title) + "　NT$" + resPrice(r) + '</span><button type="button" data-lv="payres" data-rid="' + esc(r.rid) + '">' + T("去付款", "Pay") + "</button></div>"; });
        h += '<button type="button" class="ghost" data-lv="close">' + T("稍後再付", "Pay later") + "</button>";
        resSync(function (ch) { if (ch && room && room.status === "ended" && opened) showState("ended"); });
      } else h += "<p>" + T("謝謝你來。", "Thanks for being here.") + '</p><button type="button" data-lv="close">' + T("關閉", "Close") + "</button>";
    }
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
    if (!naming) input.placeholder = me && me.banned ? T("你目前不能留言", "You can't chat right now") : T("說點什麼…", "Say something…");
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
  var offerId = "", offerHidden = "", stockT = null, cdT = null, stock = null, offerPrice = 0, claimCb = null;
  /* ---------- V2-15（CÉON 11/25 選 C）：先搶、播完再付 ----------
     按「搶」→ 直播間幫你保留 1 份，人留在直播；直播結束後 30 分鐘內付款（原本的周邊結帳），沒付自動釋出。
     搶到的那一份記在這支手機（localStorage sky:liveRes），重新整理、關掉再開都還在；重新進直播時後台也會再給一次。 */
  var RES_KEY = "sky:liveRes", resK = "", resT = null, resAt = 0, resSyncAt = 0, endSeen = false;
  function resAll() { try { var a = JSON.parse(localStorage.getItem(RES_KEY) || "[]"); return Array.isArray(a) ? a.filter(function (x) { return x && x.rid && x.tok; }) : []; } catch (e) { return []; } }
  function resPut(a) { try { localStorage.setItem(RES_KEY, JSON.stringify(a.slice(-10))); } catch (e) {} }
  function resAdd(r) { var a = resAll().filter(function (x) { return x.rid !== r.rid; }); a.push(r); resPut(a); }
  function resDrop(rid) { resPut(resAll().filter(function (x) { return x.rid !== rid; })); }
  function resOf(pinId) { return resAll().filter(function (x) { return x.pin === pinId; })[0] || null; }
  function resPrice(r) { return r.live > 0 && r.live < r.base ? r.live : r.base; }
  function hhmm(t) { var d = new Date(t); return ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2); }
  function payRes(r) {
    try { sessionStorage.setItem("sky:liveoffer", JSON.stringify({ tok: r.tok, kind: "merch", ev: r.ev, k: r.k, live: resPrice(r), base: r.base, exp: Date.now() + 6 * 36e5, res: 1 })); } catch (e) {}
    goShop({ kind: "merch", ev: r.ev, k: r.k });
  }
  function onRes(m) {
    if (!resK || m.k !== resK) return; resK = ""; clearTimeout(resT);
    if (m.ok && m.r) {
      resAdd(m.r); resAt = Date.now(); paintOffer();
      if (!m.again) { try { if (navigator.vibrate) navigator.vibrate([10, 40, 10]); } catch (e) {} }
      banner("lv-res", m.again ? T("你已經搶到了", "You already have one") : T("搶到了！", "You got it!"), T("已經幫你保留 1 份。直播結束後 30 分鐘內付款就可以，現在繼續看直播。", "1 is saved for you. Pay within 30 minutes after the live ends. Keep watching."), 4600);
      return;
    }
    var why = { closed: T("已經結束了", "It has ended"), gone: T("搶完了", "All taken"), paid: T("你已經買過了", "You already bought it") }[m.why] || T("沒有搶成功", "Couldn't get it");
    banner("lv-res", why, m.why === "gone" ? T("有人沒付款的話會再釋出。", "It may come back if someone doesn't pay.") : m.why === "paid" ? T("每個人 1 份。", "One per person.") : T("等一下再試一次。", "Try again in a moment."), 3600);
    paintOffer();
  }
  /* 跟後台對一次：付款了、過期了的就從這支手機拿掉；直播價有變就更新。onDone(changed) */
  function resSync(onDone) {
    var a = resAll(); if (!a.length || Date.now() - resSyncAt < 8000) { if (onDone) onDone(false); return; }
    resSyncAt = Date.now();
    fetch(API + "/live/resinfo?room=" + ROOM, { method: "POST", cache: "no-store", credentials: "omit", headers: { "Content-Type": "text/plain;charset=UTF-8" }, body: JSON.stringify({ toks: a.map(function (x) { return x.tok; }) }) }).then(function (r) { return r.json(); }).then(function (d) {
      if (!d || !d.ok || !Array.isArray(d.list)) { if (onDone) onDone(false); return; }
      var st = {}, ch = false; d.list.forEach(function (x) { st[x.rid] = x; });
      var keep = resAll().filter(function (x) { var s2 = st[x.rid]; if (!s2 || s2.state !== "open") { ch = true; return false; } if ((s2.live || 0) !== (x.live || 0)) { x.live = s2.live || 0; ch = true; } return true; });
      if (ch) resPut(keep);
      if (onDone) onDone(ch);
    }).catch(function () { if (onDone) onDone(false); });
  }
  function pinNow() { var p = room && room.pin; if (!p || (p.endsAt && p.endsAt < Date.now())) return null; return p; }
  function paintOffer() {
    var box = $(".lv-pin"), p = pinNow(); paintBag();
    clearInterval(cdT); cdT = null;
    if (!p || offerHidden === p.id) { box.classList.remove("on"); box.textContent = ""; clearTimeout(stockT); stockT = null; offerId = p ? p.id : ""; return; }
    if (p.id === offerId && (p.livePrice || 0) !== offerPrice && opened) {   /* V2-11：同一張卡改價 → 提示 */
      if (p.livePrice > 0) { try { if (navigator.vibrate) navigator.vibrate([10, 40, 10]); } catch (e) {} banner("lv-offer", T("直播價 NT$", "Live price NT$") + p.livePrice + "！", p.title, 3200); }
      box.classList.remove("on"); void box.offsetWidth;
    }
    offerPrice = p.livePrice || 0;
    if (p.id !== offerId) {   /* 新的開搶：跳出來＋iOS 通知樣式提示 */
      var first = !!offerId || (Date.now() - (p.at || 0) < 15000); offerId = p.id; stock = null;
      if (first && opened) { try { if (navigator.vibrate) navigator.vibrate([10, 40, 10]); } catch (e) {} banner("lv-offer", p.kind === "link" ? T("Chance 分享了一個連結", "Chance shared a link") : p.kind === "gift" ? T("Chance 送禮了！", "Chance is giving gifts!") : T("開賣了！", "On sale now!"), p.title, 3200); }
      box.classList.remove("on"); void box.offsetWidth;
      loadStock();
    }
    box.textContent = "";
    var im = document.createElement("img"); im.alt = ""; im.src = p.img || (stock && stock.img) || "assets/images/avatar.jpg"; box.appendChild(im);
    var t = document.createElement("div"); t.className = "lv-pt";
    var b = document.createElement("b"); b.textContent = p.title; t.appendChild(b);
    var price = (stock && stock.price) || p.price, nt = function (n) { return "NT$" + Number(n).toLocaleString("en-US"); };
    if (p.livePrice > 0 && p.livePrice < price) {   /* V2-11 直播價：紅底「直播價」＋新價格＋劃掉的原價 */
      var pr2 = document.createElement("span"); pr2.className = "lv-pp";
      var tag = document.createElement("span"); tag.className = "lv-lp"; tag.textContent = T("直播價", "Live"); pr2.appendChild(tag);
      pr2.appendChild(document.createTextNode(nt(p.livePrice)));
      var was = document.createElement("s"); was.textContent = nt(price); pr2.appendChild(was); t.appendChild(pr2);
    } else if (price) { var pr = document.createElement("span"); pr.className = "lv-pp"; pr.textContent = nt(price); t.appendChild(pr); }
    var line = document.createElement("span"); line.className = "lv-pl";
    var left = stock ? stock.left : null, soldOut = !!(stock && stock.soldOut);
    if (p.kind === "gift") { left = null; soldOut = !(p.giftLeft > 0); line.textContent = soldOut ? T("送完了", "All gone") : T("剩 " + p.giftLeft + "／" + p.giftTotal + " 個", p.giftLeft + " of " + p.giftTotal + " left"); if (p.giftLeft > 0 && p.giftLeft <= 3) line.classList.add("hot"); }
    var mine = p.res ? resOf(p.id) : null;
    if (p.res) {
      if (mine && p.livePrice > 0 && (!mine.live || p.livePrice < mine.live)) { mine.live = p.livePrice; resAdd(mine); }   /* 搶到之後 Chance 又降價 → 照比較低的價錢 */
      left = null; soldOut = !mine && !(p.resLeft > 0);
      line.textContent = mine ? T("已幫你保留 1 份・播完再付", "Saved for you · pay after the live") : soldOut ? T("搶完了", "All taken") : T("剩 " + p.resLeft + "／" + p.resTotal + " 份・播完再付", p.resLeft + " of " + p.resTotal + " left · pay later");
      if (!mine && p.resLeft > 0 && p.resLeft <= 3) line.classList.add("hot");
    }
    if (p.kind === "gift" || p.res) {}
    else if (soldOut) line.textContent = T("已售完", "Sold out");
    else if (left != null && left < 9999) { line.textContent = (p.kind === "ticket" ? T("剩 ", "") + left + T(" 張", " left") : T("剩 ", "") + left + T(" 件", " left")); if (left <= 10) line.classList.add("hot"); }
    else if (p.sub) line.textContent = p.sub;
    if (p.endsAt) { var cd = document.createElement("span"); cd.className = "lv-pl hot"; t.appendChild(cd); var tick = function () { var ms = p.endsAt - Date.now(); if (ms <= 0) { paintOffer(); return; } var m = Math.floor(ms / 60000), sec = Math.floor(ms % 60000 / 1000); cd.textContent = T("限時 ", "Ends in ") + m + ":" + (sec < 10 ? "0" : "") + sec; }; tick(); cdT = setInterval(tick, 1000); }
    if (line.textContent) t.appendChild(line);
    box.appendChild(t);
    var go = document.createElement("button"); go.type = "button"; go.className = "lv-buy";
    go.textContent = p.kind === "link" ? T("打開", "Open") : p.kind === "gift" ? (soldOut ? T("送完了", "Gone") : T("送朋友", "Gift")) : p.res ? (mine ? T("去付款", "Pay") : soldOut ? T("搶完了", "Gone") : T("搶", "Grab")) : soldOut ? T("售完", "Sold out") : T("搶", "Buy");
    if (mine) go.classList.add("got");
    go.disabled = soldOut; go.addEventListener("click", function () { buyNow(p); }); box.appendChild(go);
    var x = document.createElement("button"); x.type = "button"; x.className = "lv-px"; x.textContent = "×"; x.setAttribute("aria-label", T("收起", "Hide"));
    x.addEventListener("click", function () { offerHidden = p.id; paintOffer(); }); box.appendChild(x);
    box.classList.add("on");
  }
  /* V2-12：購物袋。有商品卡時顯示 1；卡片被收起來時按購物袋再叫出來 */
  function paintBag() { var p = pinNow(), bag = $(".lv-bag"); bag.classList.toggle("has", !!p); }
  $(".lv-bag").addEventListener("click", function () {
    var p = pinNow();
    if (!p) { banner("lv-bag", T("現在沒有商品", "Nothing on sale right now"), T("Chance 開賣時，商品會出現在這裡。", "Items show up here when Chance starts selling."), 2800); return; }
    offerHidden = ""; offerId = offerId === p.id ? offerId : ""; paintOffer();
    var box = $(".lv-pin"); box.classList.remove("on"); void box.offsetWidth; box.classList.add("on");
  });
  function getJSON(u) { return fetch(u, { cache: "no-store", credentials: "omit" }).then(function (r) { return r.json(); }); }
  function loadStock() {
    clearTimeout(stockT); stockT = null;
    var p = pinNow(); if (!p || !opened || p.kind === "link" || p.kind === "gift") return;
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
    q.then(function (s2) {
      if (pid !== offerId) return;
      if (stock && s2 && stock.left != null && s2.left != null && s2.left < stock.left && stock.left < 9999) { var d = stock.left - s2.left; sysMsg(T("有人剛搶到 " + d + (p.kind === "ticket" ? " 張" : " 件"), "Someone just got " + d)); }   /* V2-12：剩下的數量變少 → 留言區跳一行 */
      stock = s2; paintOffer(); }, function () {}).then(function () { if (pid === offerId && opened) stockT = setTimeout(loadStock, 10000); });
  }
  /* ---------- V2-13：送 SIGNAL 給朋友 ---------- */
  var gs = $(".lv-gs"), gsIn = gs.querySelector("input"), gsGo = gs.querySelector(".go"), gsK = "";
  function openGift(p) {
    gs.querySelector("h3").textContent = p.title || T("送 SIGNAL 私訊頻道給朋友", "Gift SIGNAL to a friend");
    gs.querySelector("p").textContent = T("填朋友的 email，系統會把 SIGNAL 兌換碼直接寄給他。每個人只能送 1 次，送完為止。", "Enter your friend's email. We'll send them a SIGNAL code. One gift per person, while they last.");
    gsIn.placeholder = T("朋友的 email", "Friend's email"); gs.querySelector(".no").textContent = T("取消", "Cancel"); gsGo.textContent = T("送出", "Send"); gsGo.disabled = false;
    gs.classList.add("on"); setTimeout(function () { try { gsIn.focus(); } catch (e) {} }, 300);
  }
  function closeGift() { gs.classList.remove("on"); gsIn.blur(); gsK = ""; }
  gs.querySelector(".no").addEventListener("click", closeGift);
  gs.addEventListener("submit", function (e) {
    e.preventDefault();
    var to = (gsIn.value || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) { banner("lv-gift", T("email 好像不對", "Check the email"), T("請再確認一次朋友的 email。", "Please check your friend's email."), 2800); return; }
    gsK = "g" + Date.now().toString(36);
    if (!send({ t: "gift", to: to, k: gsK })) { banner("lv-gift", T("還沒連上", "Not connected"), T("等一下再送一次。", "Try again in a moment."), 2600); gsK = ""; return; }
    gsGo.disabled = true; gsGo.textContent = T("送出中…", "Sending…");
    setTimeout(function () { if (gsK) { gsK = ""; gsGo.disabled = false; gsGo.textContent = T("送出", "Send"); banner("lv-gift", T("沒有回應", "No response"), T("網路好像有點慢，等一下再試。", "The network seems slow. Try again."), 3000); } }, 12000);
  });
  function onGift(m) {
    if (!gsK || m.k !== gsK) return; gsK = ""; gsGo.disabled = false; gsGo.textContent = T("送出", "Send");
    if (m.ok) { closeGift(); gsIn.value = ""; try { if (navigator.vibrate) navigator.vibrate([10, 40, 10]); } catch (e) {} banner("lv-gift", T("送出了！", "Sent!"), m.mailed ? T("兌換碼已經寄到 " + m.to + "。", "The code was sent to " + m.to + ".") : T("兌換碼已經建立，但信寄不出去，我們會再補寄給 " + m.to + "。", "The code was made but the email failed. We'll resend it to " + m.to + "."), 4200); return; }
    var why = { closed: T("送禮已經結束了", "The gift has ended"), email: T("email 好像不對", "Check the email"), self: T("要送給朋友喔", "Send it to a friend"), used: T("你已經送過了", "You've already sent one"), dup_to: T("這位朋友已經收到了", "Your friend already got one"), gone: T("送完了", "All gone"), fail: T("沒有送成功", "Couldn't send it") }[m.why] || T("沒有送成功", "Couldn't send it");
    var sub = { self: T("這份是送給還沒有 SIGNAL 的朋友。", "This is for a friend who doesn't have SIGNAL yet."), used: T("每個人只能送 1 次。", "One gift per person."), gone: T("下次直播再來搶！", "Catch the next one!"), fail: T("等一下再試一次。", "Try again in a moment.") }[m.why] || "";
    banner("lv-gift", why, sub, 3600);
    if (m.why === "used" || m.why === "gone" || m.why === "closed") closeGift();
  }

  function buyNow(p) {
    if (p.kind === "gift") { if (p.giftLeft > 0) openGift(p); return; }
    if (p.kind === "link") { try { window.open(p.url, "_blank", "noopener"); } catch (e) { location.href = p.url; } return; }
    if (p.res) {   /* V2-15：先搶、播完再付 */
      var mine = resOf(p.id);
      if (mine) { if (Date.now() - resAt < 1500) return;   /* 剛搶到的那一下連點，不要馬上被帶去付款 */ payRes(mine); return; }
      if (resK) return;
      resK = "r" + Date.now().toString(36);
      if (!send({ t: "res", k: resK })) { resK = ""; banner("lv-res", T("還沒連上", "Not connected"), T("等一下再搶一次。", "Try again in a moment."), 2600); return; }
      clearTimeout(resT); resT = setTimeout(function () { if (resK) { resK = ""; banner("lv-res", T("沒有回應", "No response"), T("網路好像有點慢，再按一次「搶」。", "The network seems slow. Tap Grab again."), 3200); } }, 8000);
      return;
    }
    try { sessionStorage.removeItem("sky:liveoffer"); } catch (e) {}
    if (p.livePrice > 0 && !buyNow.claimed) {   /* V2-11：有直播價 → 先跟直播室拿直播價憑證（等最多 3 秒；拿不到就照原價進去買） */
      var done = false, fin = function () { if (done) return; done = true; claimCb = null; buyNow.claimed = true; buyNow(p); buyNow.claimed = false; };
      claimCb = function (m) { if (m && m.ok && m.tok) { try { sessionStorage.setItem("sky:liveoffer", JSON.stringify({ tok: m.tok, kind: m.kind, ev: m.ev, k: m.k, live: m.live, base: m.base, exp: m.exp })); } catch (e) {} } fin(); };
      if (!send({ t: "claim" })) fin(); else setTimeout(fin, 3000);
      return;
    }
    goShop(p);
  }
  function goShop(p) {
    var sel = p.kind === "ticket" ? '[data-act="open-buy"][data-ev="' + p.ev + '"]' : p.kind === "merch" ? '[data-act="m-open-k"][data-k="' + p.k + '"]' : '[data-act="cxl-pack"]';
    if (opened) close(true);
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
    /* 只有 iPhone／iPad／Mac Safari 用內建播放器（支援低延遲）；新版 Chrome 也說會播 HLS，但不支援低延遲、會慢 6 秒以上，所以改用 hls.js */
    var ua = navigator.userAgent, appleNative = /iPhone|iPad|iPod/.test(ua) || (/Safari/.test(ua) && !/Chrome|Chromium|CriOS|Edg|Claude/.test(ua));
    if (appleNative && video.canPlayType("application/vnd.apple.mpegurl")) { if (video.getAttribute("src") !== url) video.src = url; go(); return; }
    loadHlsJs(function (H) {
      if (!H || !H.isSupported()) { video.src = url; go(); return; }
      if (hls) hls.destroy();
      hls = new H({ lowLatencyMode: true, maxLiveSyncPlaybackRate: 1.15, backBufferLength: 30 }); hls.loadSource(url); hls.attachMedia(video);
      hls.on(H.Events.MANIFEST_PARSED, go);
      hls.on(H.Events.ERROR, function (ev, d) { if (d && d.fatal) retryVideo(); });
    });
  }
  /* 追上直播：網路卡一下、切到背景再回來，畫面會越落越後面 → 落後超過 4 秒就跳到最新（留 1.5 秒緩衝） */
  setInterval(function () {
    if (!hlsUrl || !opened || video.paused || !video.buffered.length) return;
    var end = video.buffered.end(video.buffered.length - 1);
    if (end - video.currentTime > 4) { try { video.currentTime = end - 1.5; } catch (e) {} }
  }, 2000);
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
    if (m.n) { var b = document.createElement("b"); b.textContent = m.n + T("：", ": "); if (!m.artist) b.style.color = NAME_C[hashN(m.n) % NAME_C.length]; d.appendChild(b); if (!m.sys) noteName(m.n); }
    d.appendChild(document.createTextNode(m.x || ""));
    chat.appendChild(d);
    while (chat.children.length > 40) chat.removeChild(chat.firstChild);
  }
  /* V2-12：名字用固定的淺色（依名字算），一行一則「名字：內容」；最近留言的 3 個人顯示在右上 */
  var NAME_C = ["#FFD7A0", "#A8D8FF", "#FFB3C8", "#B8F2C8", "#D9C6FF", "#FFE58F", "#9EE6E6", "#FFC3A0"], AVA_C = ["#E0006E", "#7B61FF", "#00A3FF", "#00B37E", "#FF8A00", "#B8913F", "#FF4D6D", "#5C7CFA"], recentNames = [];
  function hashN(n) { var h = 0; n = String(n || "?"); for (var i = 0; i < n.length; i++) h = (h * 31 + n.charCodeAt(i)) >>> 0; return h; }
  function paintVav() {
    var box = $(".lv-vav"); box.textContent = "";
    recentNames.forEach(function (n) { var sp = document.createElement("span"); sp.style.background = AVA_C[hashN(n) % AVA_C.length]; sp.textContent = Array.from(n)[0] || "?"; box.appendChild(sp); });
  }
  function noteName(n) { if (!n) return; recentNames = recentNames.filter(function (x) { return x !== n; }); recentNames.unshift(n); recentNames = recentNames.slice(0, 3); paintVav(); }
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
      if (Array.isArray(m.mine)) m.mine.forEach(function (r) { if (r && r.rid && r.tok) resAdd(r); });   /* V2-15：我搶到、還沒付的 */
      if (!wasRetry) chat.innerHTML = "";
      (m.recent || []).forEach(function (x) { addMsg(x, false); });
      $(".lv-v").textContent = fmt(m.viewers); $(".lv-vt").textContent = T(" 人在看", " watching");
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
    if (m.t === "claim") { if (claimCb) claimCb(m); return; }
    if (m.t === "gift") { onGift(m); return; }
    if (m.t === "res") { onRes(m); return; }
    if (m.t === "respaid") { resDrop(m.rid); paintOffer(); banner("lv-res", T("付款成功", "Payment received"), T("你搶到的那一份已經完成付款。", "Your saved item is paid."), 3600); return; }
    if (m.t === "j") { if (m.n && Date.now() - (onMsg.joinAt || 0) > 1500) { onMsg.joinAt = Date.now(); sysMsg(m.n + T(" 進入直播間", " joined")); } return; }   /* V2-12：進入直播間（最多 1.5 秒一行，人多不洗版） */
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
  stateBox.addEventListener("click", function (e) {
    var pr = e.target.closest("[data-lv=payres]");
    if (pr) { var r = resAll().filter(function (x) { return x.rid === pr.getAttribute("data-rid"); })[0]; if (r) payRes(r); return; }
    if (e.target.closest("[data-lv=close]")) close(true);
  });

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
    $(".lv-send").textContent = T("送出", "Send"); input.placeholder = T("說點什麼…", "Say something…");
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
    opened = false; closeGift(); clearTimeout(stockT); stockT = null; clearInterval(cdT); naming = false; pendingText = ""; input.maxLength = 80; clearInterval(pingT); clearTimeout(retryT); retryT = null; flushHearts();
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
  /* ---------- V2-14：LIVE 分頁＋全 App 的開播狀態（每 30 秒問一次 /live/info） ---------- */
  var infoT = null, isLive = false, info = null, cdTab = null, REMIND_K = "sky:liveRemind";
  function onSignal() { var sm = document.getElementById("screen-mood"); return !!(sm && sm.classList.contains("active")); }
  function onTab() { var sl = document.getElementById("screen-live"); return !!(sl && sl.classList.contains("active")); }
  function paintEntry() { entry.classList.toggle("on", isLive && onSignal() && !opened); document.body.classList.toggle("sky-live-on", isLive); }
  function remindGet() { try { return localStorage.getItem(REMIND_K) || ""; } catch (e) { return ""; } }
  function remindSet(v) { try { if (v) localStorage.setItem(REMIND_K, v); else localStorage.removeItem(REMIND_K); } catch (e) {} }
  function pollInfo() {
    clearTimeout(infoT);
    if (!document.hidden) fetch(API + "/live/info?room=" + ROOM, { cache: "no-store", credentials: "omit" }).then(function (r) { return r.json(); }).then(function (d) {
      if (!d || !d.ok || !d.room) return;
      var was = isLive; info = d; isLive = d.room.status === "live"; paintEntry();
      if (was && !isLive && !opened && !endSeen && resAll().length && window.skyBanner) window.skyBanner({ id: "lv-res", title: T("直播結束了，你搶到的還沒付款", "The live ended. You still need to pay"), body: T("30 分鐘內付款，點這裡去付。", "Pay within 30 minutes. Tap here."), ms: 9000, onTap: function (api) { api.hide(); if (window.skyGo) window.skyGo("live"); } });   /* V2-15 */
      /* 有按「開播時提醒我」→ 開播的那一刻（App 開著時）跳 iOS 樣式通知，點了直接進直播 */
      if (isLive && !was && remindGet() && remindGet() !== String(d.room.startedAt || "")) {
        remindSet(String(d.room.startedAt || "1"));
        if (window.skyBanner && !opened) window.skyBanner({ id: "lv-remind", title: T("Chance 開播了！", "Chance is live!"), body: T("點這裡進直播", "Tap to watch"), ms: 9000, onTap: function (api) { api.hide(); open(); } });
      }
      if (onTab()) renderTab();
    }).catch(function () {});
    paintEntry();
    infoT = setTimeout(pollInfo, onTab() ? 15000 : 30000);
  }
  var WK = ["日", "一", "二", "三", "四", "五", "六"], WKE = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  function fmtNext(t) { var d = new Date(t), hh = ("0" + d.getHours()).slice(-2), mm = ("0" + d.getMinutes()).slice(-2); return EN() ? (d.getMonth() + 1) + "/" + d.getDate() + " (" + WKE[d.getDay()] + ") " + hh + ":" + mm : (d.getMonth() + 1) + "/" + d.getDate() + "（" + WK[d.getDay()] + "）" + hh + ":" + mm; }
  var SVG_BELL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 16v-5a6 6 0 1 0-12 0v5l-2 2h16l-2-2z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>';
  var SVG_LIVE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8a6 6 0 0 1 0 8.4M7.8 16.2a6 6 0 0 1 0-8.4M19 5a10 10 0 0 1 0 14M5 19A10 10 0 0 1 5 5"/></svg>';
  var SVG_CARDS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="6" width="12" height="15" rx="2"/><path d="M8 6V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2"/></svg>';
  var SVG_LOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function renderTab() {
    var el = document.getElementById("screen-live"); if (!el) return;
    clearInterval(cdTab); cdTab = null;
    var r = (info && info.room) || {}, live = r.status === "live", nx = r.next && r.next.at > Date.now() ? r.next : null, pin = r.pin && (!r.pin.endsAt || r.pin.endsAt > Date.now()) ? r.pin : null, rem = !!remindGet();
    var h = '<div class="lt-head"><div class="lt-ttl">LIVE</div><button type="button" class="lt-chip" data-lt="lucky">' + SVG_CARDS + esc(T("每日抽卡", "Daily draw")) + '</button></div><div class="lt-hero">';
    if (live) {
      h += '<div class="lt-tags"><span class="lt-pill red">LIVE</span><span class="lt-pill">' + esc(fmt(info.viewers || 0) + T(" 人在看", " watching")) + '</span></div>' +
        '<div class="lt-host"><img src="assets/images/avatar.jpg" alt="">成晞 Chance</div>' +
        '<div class="lt-big">' + esc(r.title || T("成晞 Chance 正在直播", "Chance is live")) + '</div>' +
        '<div class="lt-sub">' + esc(T("愛心 " + fmt(r.hearts || 0) + "・留言 " + fmt(r.msgs || 0), fmt(r.hearts || 0) + " hearts · " + fmt(r.msgs || 0) + " comments")) + '</div>' +
        '<div class="lt-btns"><button type="button" class="lt-btn r" data-lt="watch">' + SVG_LIVE + esc(T("進入直播", "Watch live")) + '</button>' + (pin && pin.kind !== "link" ? '<button type="button" class="lt-btn o" data-lt="watch">' + esc(pin.kind === "gift" ? T("送禮中", "Gifts") : T("搶購中", "On sale")) + '</button>' : "") + '</div>';
    } else {
      h += '<div class="lt-tags"><span class="lt-pill">' + esc(r.status === "ended" && !nx ? T("直播已結束", "Live ended") : T("下一場直播", "Next live")) + '</span></div>';
      if (nx) h += '<div class="lt-date">' + esc(fmtNext(nx.at)) + '</div><div class="lt-sub">' + esc(nx.sub || nx.title || "") + '</div><div class="lt-cd" data-at="' + nx.at + '"></div>';
      else h += '<div class="lt-big">' + esc(r.status === "ended" ? T("謝謝你來看直播", "Thanks for watching") : T("下一場直播時間還沒公布", "Next live not scheduled yet")) + '</div><div class="lt-sub">' + esc(T("先開提醒，Chance 一開播就會通知你。", "Turn on the reminder and we'll tell you when Chance goes live.")) + '</div>';
      h += '<div class="lt-btns"><button type="button" class="lt-btn ' + (rem ? "on" : "w") + '" data-lt="remind">' + SVG_BELL + esc(rem ? T("已開提醒（再按取消）", "Reminder on (tap to cancel)") : T("開播時提醒我", "Remind me when live")) + '</button></div>';
    }
    h += '</div>';
    var rs = resAll();   /* V2-15：你搶到的（還沒付款） */
    if (rs.length) {
      var pb = r.payBy || 0;
      h += '<div class="lt-res"><h4>' + esc(T("你搶到的", "Saved for you")) + '</h4><p>' + esc(pb ? T("請在 " + hhmm(pb) + " 前付款，時間到沒付會自動釋出。", "Please pay before " + hhmm(pb) + " or it will be released.") : live ? T("已經幫你保留。直播結束後 30 分鐘內付款就可以。", "Saved for you. Pay within 30 minutes after the live ends.") : T("已經幫你保留，請盡快付款。", "Saved for you. Please pay soon.")) + '</p>' +
        rs.map(function (x) { return '<div class="lt-res-r"><div><b>' + esc(x.title) + '</b>NT$' + resPrice(x) + '</div><button type="button" class="lt-btn w" data-lt="payres" data-rid="' + esc(x.rid) + '">' + esc(T("去付款", "Pay")) + '</button></div>'; }).join("") + '</div>';
      resSync(function (ch) { if (ch && onTab()) renderTab(); });
    }
    h += '<div class="lt-note">' + SVG_LOCK + esc(live ? T("SIGNAL 會員專屬：留言、按愛心、搶直播價", "SIGNAL members: chat, hearts and live prices") : T("SIGNAL 會員可以看直播、留言、搶直播價", "SIGNAL members can watch, chat and get live prices")) + '</div>';
    el.innerHTML = h;
    var cd = el.querySelector(".lt-cd");
    if (cd) { var at = Number(cd.getAttribute("data-at")), tick = function () { var ms = Math.max(0, at - Date.now()), d = Math.floor(ms / 864e5), hh = Math.floor(ms % 864e5 / 36e5), mm = Math.floor(ms % 36e5 / 6e4), ss = Math.floor(ms % 6e4 / 1e3), p = function (n) { return (n < 10 ? "0" : "") + n; };
        cd.innerHTML = [[p(d), T("天", "d")], [p(hh), T("時", "h")], [p(mm), T("分", "m")], [p(ss), T("秒", "s")]].map(function (x) { return '<div class="lt-u"><b>' + x[0] + '</b><span>' + x[1] + '</span></div>'; }).join("");
        if (ms <= 0) { clearInterval(cdTab); pollInfo(); } }; tick(); cdTab = setInterval(function () { if (!onTab()) { clearInterval(cdTab); return; } tick(); }, 1000); }
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("#screen-live [data-lt]"); if (!b) return;
    var a = b.getAttribute("data-lt");
    if (a === "lucky") { if (window.skyGo) window.skyGo("lucky"); return; }
    if (a === "payres") { var pr = resAll().filter(function (x) { return x.rid === b.getAttribute("data-rid"); })[0]; if (pr) payRes(pr); return; }
    if (a === "watch") { var w = who(); if (!w || !w.ok || !w.code) { banner("lv-lock", T("直播是給 SIGNAL 會員看的", "This live is for SIGNAL members"), T("有 SIGNAL 私訊頻道（或全解鎖方案）就能看。", "Join the SIGNAL channel (or the full unlock plan) to watch."), 4200); return; } open(); return; }
    if (a === "remind") {
      if (remindGet()) { remindSet(""); banner("lv-remind", T("已取消提醒", "Reminder off"), "", 2200); }
      else { remindSet("on"); banner("lv-remind", T("開播時會提醒你", "We'll remind you"), T("App 開著的時候，Chance 一開播就會跳通知。", "While the app is open, you'll get a notice the moment Chance goes live."), 3600); }
      renderTab();
    }
  });
  window.skyLiveTab = { render: function () { renderTab(); pollInfo(); } };
  /* 只給測試站：不用後台鑰匙也能看 LIVE 分頁不同狀態的樣子（只改這支手機的畫面） */
  if (/test-v2/.test(location.pathname)) window.skyLiveTab.preview = function (room) { info = { ok: true, viewers: room.viewers || 0, room: room }; clearTimeout(infoT); renderTab(); return "ok"; };
  function boot() {
    document.body.appendChild(root); document.body.appendChild(entry);
    var sm = document.getElementById("screen-mood");   /* 換分頁時入口馬上跟著出現／消失 */
    if (sm && window.MutationObserver) new MutationObserver(function () { paintEntry(); if (onSignal()) pollInfo(); }).observe(sm, { attributes: true, attributeFilter: ["class"] });
    pollInfo();
    document.addEventListener("visibilitychange", function () { if (!document.hidden) pollInfo(); });   /* V2-14：回到 App 時馬上更新開播狀態 */
    var lt = /(?:^#|&)livetest=(\d+)/.exec(location.hash);   /* 只給測試：#livetest=N（見 test-v2.html 的 skyLiveTestLogin） */
    if (lt) { try { if (window.skyLiveTestLogin) window.skyLiveTestLogin(lt[1]); } catch (e) {} try { history.replaceState(history.state, "", location.pathname + location.search + "#live"); } catch (e) {} }
    if (/(^#|&)live\b/.test(location.hash)) open();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
  window.skyLive = { open: open, close: function () { close(true); } };
  /* 只給測試站：不用後台鑰匙也能看商品卡長怎樣（只改這支手機的畫面，不會送到後台） */
  if (/test-v2/.test(location.pathname)) window.skyLive.previewPin = function (p) { if (!room) return "先打開直播"; p = p || {}; p.id = p.id || "preview" + Date.now(); p.at = Date.now(); room.pin = p; paintOffer(); return "ok"; };
})();
