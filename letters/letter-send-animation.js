/* ═══════════════════════════════════════════════════════════════════
   LetterSendAnimation — Dear CHANCE 寄信動畫（奶油粉信紙 × 玫瑰金信封）
   摺信 → 裝入 → 封口 →〔等待伺服器確認〕→ 飛出 → 送達紀念卡

   用法：
     var anim = LetterSendAnimation.create(hostEl, {
       letter: { body: "…", signature: "…" },   // 用戶真實信件
       reducedMotion: false,                     // 不給就跟隨系統設定
       resume: false,                            // 重掛載：直接停在封口，不重播摺信
       onSkip, onVisualComplete, onRetry, onHelp, onViewLetter
     });
     anim.start();                               // 由「明確寄出」觸發；元件本身不送信、不付款
     anim.setStatus({ state: "pending" | "unknown" | "confirmed" | "failed",
                      readBy: <後端保存的閱讀期限 ms>, orderId, message, actions: ["retry","help"] });
     anim.skip(); anim.destroy();

   規則：只有 state === "confirmed"（伺服器確認收件）才會飛出與顯示成功。
         onVisualComplete 只代表畫面播完，不能拿來更新送達、名額或扣款。
         跳過只跳過畫面；重掛載、跳過、回到前景都不會重送。
   ═══════════════════════════════════════════════════════════════════ */
(function (root) {
  "use strict";
  var seq = 0;
  var W = 320, H = 350;                       /* 分鏡座標系 */
  var LET = { x: 50, y: 32, w: 216, h: 252 }; /* 01 完整信紙 */
  var INSERT_DY = 70;                         /* 摺好後（中段 y116–200）滑入信封到 y186–270 */
  var T = { prepare: 500, foldB: 300, foldT: 300, insert: 500, seal: 400, depart: 600, confirm: 420 };

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function fmtTaipei(ts) {                    /* 後端時間戳 → 台北時間顯示（不從裝置日期推算期限） */
    var d = new Date(Number(ts) + 8 * 3600e3);
    return d.getUTCFullYear() + " 年 " + (d.getUTCMonth() + 1) + " 月 " + d.getUTCDate() + " 日 " + pad(d.getUTCHours()) + ":" + pad(d.getUTCMinutes());
  }
  function sysReduced() { try { return matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } }

  /* ── SVG 素材（取自 storyboard 01–06 的 letter／envelope-back／envelope-front／envelope-flap／seal 群組） ── */
  function defs(p) {
    return '<defs>' +
      '<linearGradient id="' + p + 'paper" x2=".9" y2="1"><stop stop-color="#fff8ef"/><stop offset="1" stop-color="#f0dbd9"/></linearGradient>' +
      '<linearGradient id="' + p + 'rose" x2=".8" y2="1"><stop stop-color="#ebc4cb"/><stop offset=".5" stop-color="#dbacb8"/><stop offset="1" stop-color="#bf8b9b"/></linearGradient>' +
      '<linearGradient id="' + p + 'flap" x2="0" y2="1"><stop stop-color="#f4dce0"/><stop offset="1" stop-color="#d4a7b4"/></linearGradient>' +
      '<linearGradient id="' + p + 'lining"><stop stop-color="#c79b9d"/><stop offset="1" stop-color="#f0d0c4"/></linearGradient>' +
      '<linearGradient id="' + p + 'gold"><stop stop-color="#a87d57"/><stop offset=".46" stop-color="#f1dba8"/><stop offset="1" stop-color="#be9768"/></linearGradient>' +
      '<radialGradient id="' + p + 'halo"><stop stop-color="#976679" stop-opacity=".30"/><stop offset="1" stop-color="#976679" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="' + p + 'sheen" x2="1"><stop stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
      '<clipPath id="' + p + 'sealclip"><circle cx="160" cy="235" r="21"/></clipPath>' +
      '</defs>';
  }
  var STAR = 'M0 -18Q2 -2 16 0Q2 2 0 18Q-2 2 -16 0Q-2 -2 0 -18Z';
  var HANDS = '<g fill="none" stroke="#a16f79" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"><path d="M22 89C51 119 65 129 89 136C107 140 119 150 132 164L151 178C159 184 155 194 147 191L122 177C120 188 112 196 98 202L71 212C61 216 58 208 66 203L91 188L106 174C96 169 91 156 99 151C105 148 109 156 111 166M67 204C58 205 57 198 65 192L89 173M298 89C269 123 252 132 232 143L205 167L183 184C176 189 169 182 175 176L195 154M232 143C213 142 201 150 189 162L164 179C157 184 151 178 157 171L183 147M205 168L207 210C207 219 197 220 195 210L190 188M194 207C192 220 183 219 180 209L176 193M181 209C175 218 167 211 167 202L165 187"/><path d="M51 52L62 52M257 246L269 246"/></g>';
  function envBack(p) { return '<rect x="30" y="145" width="260" height="158" rx="7" fill="#b98192" stroke="#d4aa97"/>'; }
  function envFront(p) { return '<path d="M30 151L160 226L290 151V295Q290 303 282 303H38Q30 303 30 295Z" fill="url(#' + p + 'rose)" stroke="#d5b497"/><path d="M32 299L126 218M288 299L194 218" fill="none" stroke="#ac7280" opacity=".6"/>'; }
  function flapClosed(p) { return '<path d="M31 147H289L171 237Q160 246 149 237Z" fill="url(#' + p + 'flap)" stroke="#ddbbb1" stroke-width=".8"/><path d="M33 149H287" stroke="#fff0df" stroke-opacity=".8"/>'; }
  /* 打開的上蓋：以關閉上蓋沿摺線 y=147 鏡射，露出內襯（與 03 開啟場景的內襯一致） */
  function flapOpen(p) { return '<path d="M31 147H289L171 57Q160 48 149 57Z" fill="url(#' + p + 'lining)" stroke="#d5b497"/><path d="M47 146L160 61L274 146" fill="none" stroke="#edc9be" stroke-width=".8"/>'; }
  function sealG(p) { return '<circle cx="160" cy="235" r="21" fill="url(#' + p + 'gold)" stroke="#f9e6b8"/><circle cx="160" cy="235" r="16" fill="none" stroke="#9f715c" stroke-opacity=".5"/><path transform="translate(160 235) scale(.6)" d="' + STAR + '" fill="#fff4da"/>'; }

  function sheetDecor(p) {   /* 信紙上的角線、相遇鉤手、星芒（01 的 letter 群組，平移到紙張自己的座標） */
    return '<svg class="lsa-sheet-art" viewBox="0 0 216 252" preserveAspectRatio="none" aria-hidden="true">' +
      '<path d="M11 22V11H26M191 11H205V22" fill="none" stroke="#b88e72" stroke-width=".8"/>' +
      '<g transform="translate(138 164) scale(.18)">' + HANDS + '</g>' +
      '<path transform="translate(192 210) scale(.5)" d="' + STAR + '" fill="url(#' + p + 'gold)"/></svg>';
  }

  var CSS = '' +
  '.lsa{position:relative;width:100%;max-width:400px;margin:0 auto;color:#f6ece6;font-family:"Noto Sans TC",-apple-system,"PingFang TC",sans-serif}' +
  '.lsa-wrap{position:relative;width:100%;aspect-ratio:320/350;container-type:inline-size;pointer-events:none}' +
  '.lsa-wrap>*{position:absolute;inset:0}' +
  '.lsa svg{width:100%;height:100%;display:block;overflow:visible}' +
  '.lsa-dim{background:radial-gradient(70% 60% at 50% 50%,rgba(29,22,30,.0),rgba(29,22,30,.55));opacity:0;pointer-events:none}' +
  '.lsa-env{perspective:1100px;transform-origin:50% 64%}' +
  '.lsa-envlayer{position:absolute;inset:0;opacity:0}' +
  '.lsa-letter{position:absolute;left:15.625%;top:9.1429%;width:67.5%;height:72%;transform-style:preserve-3d}' +
  '.lsa-panel{position:absolute;left:0;width:100%;height:33.3334%;transform-style:preserve-3d}' +
  '.lsa-p0{top:0;transform-origin:50% 100%}.lsa-p1{top:33.3333%}.lsa-p2{top:66.6666%;transform-origin:50% 0%}' +
  '.lsa-face{position:absolute;inset:0;overflow:hidden;backface-visibility:hidden;-webkit-backface-visibility:hidden}' +
  '.lsa-front{background:linear-gradient(160deg,#fff8ef,#f0dbd9);border-left:.5px solid #d5adb0;border-right:.5px solid #d5adb0}' +
  '.lsa-p0 .lsa-front{border-top:.5px solid #d5adb0;border-radius:1.2cqw 1.2cqw 0 0}.lsa-p2 .lsa-front{border-bottom:.5px solid #d5adb0;border-radius:0 0 1.2cqw 1.2cqw}' +
  '.lsa-back{transform:rotateX(180deg);background:linear-gradient(160deg,#f3e2dc,#e6cdcb);border:.5px solid #d5adb0}' +
  '.lsa-p1 .lsa-front{box-shadow:0 1.6cqw 3cqw rgba(8,6,12,.22)}' +
  '.lsa-shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(120,70,80,.0),rgba(120,70,80,.28));opacity:0;pointer-events:none}' +
  '.lsa-sheet{position:absolute;left:0;width:100%;height:300%}' +
  '.lsa-p0 .lsa-sheet{top:0}.lsa-p1 .lsa-sheet{top:-100%}.lsa-p2 .lsa-sheet{top:-200%}' +
  '.lsa-sheet-art{position:absolute;inset:0;width:100%;height:100%}' +
  '.lsa-text{position:absolute;left:9%;right:9%;top:9.5%;bottom:13%;overflow:hidden;color:#3a332e}' +
  '.lsa-sal{font-family:Caveat,"Snell Roundhand",cursive;font-size:6.2cqw;line-height:1.1;margin-bottom:1.6cqw;color:#4a3a36}' +
  '.lsa-body{font-family:"Noto Serif TC","Songti TC",serif;font-size:3.05cqw;line-height:1.75;white-space:pre-wrap;overflow-wrap:anywhere;max-height:44cqw;overflow:hidden;' +
    '-webkit-mask-image:linear-gradient(#000 78%,transparent);mask-image:linear-gradient(#000 78%,transparent)}' +
  '.lsa-sign{position:absolute;left:9%;bottom:6.5%;font-family:Caveat,"Snell Roundhand",cursive;color:#5e4a44;font-size:5cqw;line-height:1.1;max-width:58%;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}' +
  '.lsa-sign small{display:block;font-size:3.6cqw;color:#8a6f68}' +
  '.lsa-flapOpen{transform-box:fill-box;transform-origin:50% 100%}' +
  '.lsa-flapClosed{transform-box:fill-box;transform-origin:50% 0%;transform:scaleY(0)}' +
  '.lsa-seal{transform-box:fill-box;transform-origin:50% 50%;opacity:0}' +
  '.lsa-sheen{opacity:0}' +
  '.lsa-arc{opacity:0}' +
  '.lsa-memorial{opacity:0;pointer-events:none}' +
  '.lsa-panel-ui{display:flex;flex-direction:column;gap:12px;align-items:stretch;margin-top:8px;min-height:120px}' +
  '.lsa-status{display:flex;align-items:center;justify-content:center;gap:10px;min-height:28px;text-align:center;font-size:15.5px;line-height:1.6;color:#f6ece6}' +
  '.lsa-spin{width:15px;height:15px;border-radius:50%;border:2px solid rgba(241,219,168,.3);border-top-color:#f1dba8;animation:lsaspin .9s linear infinite;flex:none}' +
  '@keyframes lsaspin{to{transform:rotate(360deg)}}' +
  '.lsa-note{font-size:13.5px;line-height:1.65;color:#d9c5c4;text-align:center;margin:0}' +
  '.lsa-done h3{font-family:"Noto Serif TC","Songti TC",serif;font-weight:600;font-size:clamp(20px,6vw,24px);line-height:1.45;margin:0;text-align:center;color:#fff3ef;text-wrap:balance}' +
  '.lsa-done p{margin:0;text-align:center;font-size:15px;line-height:1.7;color:#ecd7d5}' +
  '.lsa-err{border:1px solid rgba(235,160,160,.55);background:rgba(235,160,160,.09);border-radius:16px;padding:14px 16px;font-size:15px;line-height:1.65;color:#fbe9e7}' +
  '.lsa-err b{display:block;font-family:"Noto Serif TC",serif;font-size:17px;margin-bottom:4px}' +
  '.lsa-row{display:flex;gap:10px;flex-wrap:wrap}' +
  '.lsa-btn{flex:1;min-height:48px;padding:0 16px;border-radius:15px;border:1px solid rgba(219,172,184,.55);background:transparent;color:#f6ece6;font:500 15px/1.2 "Noto Sans TC",sans-serif;cursor:pointer}' +
  '.lsa-btn.primary{border:0;background:linear-gradient(110deg,#e6bfc6,#f6dccd 50%,#d9a9b5);color:#3a2229;font-weight:700}' +
  '.lsa-skip{align-self:center;flex:none;min-height:44px;padding:0 14px;border:0;background:transparent;color:#e9c9cf;font:500 14px/1 "Noto Sans TC",sans-serif;text-decoration:underline;text-underline-offset:4px;cursor:pointer}' +
  '.lsa-demo{display:inline-flex;align-self:center;align-items:center;gap:6px;font-size:12.5px;color:#e9d3d2;border:1px solid rgba(241,219,168,.5);border-radius:10px;padding:5px 9px}' +
  '.lsa-demo em{font-style:normal;font-weight:700;font-size:10.5px;letter-spacing:.12em;color:#2a1d16;background:#f1dba8;padding:3px 5px;border-radius:4px}' +
  '.lsa :focus-visible{outline:2px solid #f1dba8;outline-offset:3px}';

  function injectCSS() { if (document.getElementById("lsa-css")) return; var s = el("style"); s.id = "lsa-css"; s.textContent = CSS; document.head.appendChild(s); }

  /* 沿細金弧線取樣（三次貝茲），飛出用 */
  var ARC = [[160, 226], [228, 214], [252, 126], [296, 40]];
  function bez(t) { var a = ARC, u = 1 - t; return [u*u*u*a[0][0] + 3*u*u*t*a[1][0] + 3*u*t*t*a[2][0] + t*t*t*a[3][0], u*u*u*a[0][1] + 3*u*u*t*a[1][1] + 3*u*t*t*a[2][1] + t*t*t*a[3][1]]; }

  function create(host, opts) {
    opts = opts || {};
    injectCSS();
    var id = "lsa" + (++seq) + "-";
    var reduced = opts.reducedMotion != null ? !!opts.reducedMotion : sysReduced();
    var L = opts.letter || {};
    var anims = [], timers = [], destroyed = false;
    var visual = "idle";          /* idle → playing → sealed → departing → done ｜ failed */
    var net = { state: "pending" };
    var gateShown = false, completed = false;

    var root = el("div", "lsa"); root.setAttribute("data-visual", "idle");
    var wrap = el("div", "lsa-wrap"); wrap.setAttribute("aria-hidden", "true");
    var bg = '<svg viewBox="0 0 320 350">' + defs(id) +
      '<ellipse cx="160" cy="185" rx="154" ry="163" fill="url(#' + id + 'halo)"/>' +
      '<ellipse class="lsa-shadow" cx="160" cy="295" rx="126" ry="18" fill="#08060b" opacity=".2"/>' +
      '<path transform="translate(35 62) scale(.6)" d="' + STAR + '" fill="url(#' + id + 'gold)"/>' +
      '<path transform="translate(287 309) scale(.45)" d="' + STAR + '" fill="url(#' + id + 'gold)"/>' +
      '<circle cx="279" cy="81" r="1.5" fill="#f3d6bb"/><circle cx="44" cy="321" r="1" fill="#f3d6bb"/>' +
      '<g class="lsa-arc"><path d="M160 226C228 214 252 126 296 40" fill="none" stroke="#d1ac80" stroke-opacity=".22" stroke-width="3" stroke-linecap="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/>' +
      '<path d="M160 226C228 214 252 126 296 40" fill="none" stroke="#d1ac80" stroke-width="1" stroke-linecap="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/></g></svg>';
    var bgDiv = el("div", "lsa-bg", bg);
    var dim = el("div", "lsa-dim");
    var env = el("div", "lsa-env");
    var backLayer = el("div", "lsa-envlayer lsa-backlayer", '<svg viewBox="0 0 320 350">' + defs(id + "b") +
      '<g class="lsa-envback">' + envBack(id + "b") + '</g><g class="lsa-flapOpen">' + flapOpen(id + "b") + '</g></svg>');
    var letter = el("div", "lsa-letter");
    var sheetHTML = '<div class="lsa-sheet">' + sheetDecor(id + "s") +
      '<div class="lsa-text"><div class="lsa-sal">Dear Chance,</div><div class="lsa-body">' + esc(L.body || "") + '</div></div>' +
      '<div class="lsa-sign">' + (String(L.signature || "").trim() ? '<small>With love,</small>' + esc(L.signature) : '') + '</div></div>';
    /* 紙張的漸層 ID 只在第一個面板定義一次 */
    for (var i = 0; i < 3; i++) {
      var pn = el("div", "lsa-panel lsa-p" + i);
      var fr = el("div", "lsa-face lsa-front", (i === 0 ? '<svg width="0" height="0" style="position:absolute">' + defs(id + "s") + '</svg>' : '') + sheetHTML);
      var bk = el("div", "lsa-face lsa-back");
      var sh = el("div", "lsa-shade");
      fr.appendChild(sh); pn.appendChild(fr); pn.appendChild(bk); letter.appendChild(pn);
    }
    var frontLayer = el("div", "lsa-envlayer lsa-frontlayer", '<svg viewBox="0 0 320 350">' + defs(id + "f") +
      '<g class="lsa-envfront">' + envFront(id + "f") + '</g>' +
      '<g class="lsa-flapClosed">' + flapClosed(id + "f") + '</g>' +
      '<g class="lsa-seal">' + sealG(id + "f") + '</g>' +
      '<g clip-path="url(#' + id + 'fsealclip)"><g transform="rotate(18 160 235)"><rect class="lsa-sheen" x="120" y="205" width="26" height="60" fill="url(#' + id + 'fsheen)"/></g></g></svg>');
    env.appendChild(backLayer); env.appendChild(letter); env.appendChild(frontLayer);
    var memorial = el("div", "lsa-memorial", '<svg viewBox="0 0 320 350">' + defs(id + "m") +
      '<ellipse cx="160" cy="176" rx="137" ry="56" transform="rotate(-20 160 176)" fill="none" stroke="#d1ac80" stroke-width=".7" stroke-opacity=".55"/>' +
      '<g transform="translate(32 0) scale(.8)">' + envBack(id + "m") + envFront(id + "m") + flapClosed(id + "m") + sealG(id + "m") + '</g>' +
      '<path transform="translate(255 125) scale(.8)" d="' + STAR + '" fill="url(#' + id + 'mgold)"/></svg>');
    wrap.appendChild(bgDiv); wrap.appendChild(dim); wrap.appendChild(env); wrap.appendChild(memorial);
    var ui = el("div", "lsa-panel-ui");
    var status = el("div", "lsa-status"); status.setAttribute("role", "status"); status.setAttribute("aria-live", "polite");
    var body = el("div", "lsa-body-ui");
    var skipBtn = el("button", "lsa-skip", "跳過動畫"); skipBtn.type = "button"; skipBtn.hidden = true;
    ui.appendChild(status); ui.appendChild(skipBtn); ui.appendChild(body);
    root.appendChild(wrap); root.appendChild(ui);
    host.appendChild(root);

    var q = function (s) { return root.querySelector(s); };
    var P0 = q(".lsa-p0"), P2 = q(".lsa-p2");
    var flapO = q(".lsa-flapOpen"), flapC = q(".lsa-flapClosed"), seal = q(".lsa-seal"), sheen = q(".lsa-sheen");
    var arc = q(".lsa-arc"), arcPaths = arc.querySelectorAll("path");

    function setVisual(v) { visual = v; root.setAttribute("data-visual", v); }
    function A(node, kf, o) {           /* WAAPI；只動 transform／opacity */
      if (destroyed) return null;
      var a = node.animate(kf, Object.assign({ fill: "both", easing: "cubic-bezier(.45,0,.2,1)" }, o));
      anims.push(a); return a;
    }
    function later(fn, ms) { var t = setTimeout(function () { if (!destroyed) fn(); }, ms); timers.push(t); return t; }
    function unitPx() { return wrap.getBoundingClientRect().width / W; }
    function setStatusHTML(h) { status.innerHTML = h; }

    /* 靜態最終狀態（跳過、減少動態、重掛載共用） */
    function paintSealed() {
      anims.forEach(function (a) { try { a.finish(); } catch (e) {} });
      dim.style.opacity = "1";
      backLayer.style.opacity = "1"; frontLayer.style.opacity = "1";
      P2.style.transform = "rotateX(180deg) translateZ(-1px)";
      P0.style.transform = "rotateX(-180deg) translateZ(-2px)";
      letter.style.transform = "translateY(" + (INSERT_DY * unitPx()) + "px)";
      flapO.style.transform = "scaleY(0)"; flapC.style.transform = "scaleY(1)";
      seal.style.opacity = "1"; seal.style.transform = "none";
      anims.forEach(function (a) { try { a.cancel(); } catch (e) {} }); anims = [];
    }

    function playFull() {
      setVisual("playing"); skipBtn.hidden = false;
      var u = unitPx(), t0 = 0;
      /* 1 準備：信件預覽 → 中央信紙，背景變暗 */
      A(letter, [{ opacity: 0, transform: "translateY(" + (10 * u) + "px) scale(1.04)" }, { opacity: 1, transform: "none" }], { duration: T.prepare, easing: "cubic-bezier(.2,.7,.2,1)" });
      A(dim, [{ opacity: 0 }, { opacity: 1 }], { duration: T.prepare });
      t0 = T.prepare;
      /* 2 摺信：下三分之一向上、上三分之一向下（以摺線為軸，有紙背與陰影） */
      A(P2, [{ transform: "rotateX(0deg)" }, { transform: "rotateX(180deg) translateZ(-1px)" }], { delay: t0, duration: T.foldB });
      A(P2.querySelector(".lsa-shade"), [{ opacity: 0 }, { opacity: 1, offset: .5 }, { opacity: 0 }], { delay: t0, duration: T.foldB });
      A(P0, [{ transform: "rotateX(0deg)" }, { transform: "rotateX(-180deg) translateZ(-2px)" }], { delay: t0 + T.foldB, duration: T.foldT });
      A(P0.querySelector(".lsa-shade"), [{ opacity: 0 }, { opacity: 1, offset: .5 }, { opacity: 0 }], { delay: t0 + T.foldB, duration: T.foldT });
      /* 信封在摺信後段淡入、微微升起（開著的上蓋） */
      [backLayer, frontLayer].forEach(function (n) { A(n, [{ opacity: 0, transform: "translateY(" + (14 * u) + "px)" }, { opacity: 1, transform: "none" }], { delay: t0 + 200, duration: 400, easing: "cubic-bezier(.2,.7,.2,1)" }); });
      t0 += T.foldB + T.foldT;
      /* 3 裝入：信紙在背面與正面之間滑入，正面圖層自然遮擋 */
      A(letter, [{ transform: "none" }, { transform: "translateY(" + (INSERT_DY * u) + "px)" }], { delay: t0, duration: T.insert, easing: "cubic-bezier(.5,0,.25,1)" });
      t0 += T.insert;
      /* 4 封口：開啟的上蓋收到摺線 → 關閉的上蓋從摺線展開 → 星芒封口浮現 → 柔光掃過一次 */
      A(flapO, [{ transform: "scaleY(1)" }, { transform: "scaleY(0)" }], { delay: t0, duration: 150, easing: "cubic-bezier(.5,0,1,1)" });
      A(flapC, [{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }], { delay: t0 + 150, duration: 140, easing: "cubic-bezier(0,0,.3,1)" });
      A(seal, [{ opacity: 0, transform: "scale(.6)" }, { opacity: 1, transform: "scale(1.06)", offset: .7 }, { opacity: 1, transform: "scale(1)" }], { delay: t0 + 250, duration: 150, easing: "ease-out" });
      A(sheen, [{ opacity: 0, transform: "translateX(-30px)" }, { opacity: 1, offset: .3 }, { opacity: 0, transform: "translateX(50px)" }], { delay: t0 + 330, duration: 420, easing: "ease-in-out" });
      t0 += T.seal;
      later(onSealed, t0);
    }
    function playReduced() {
      setVisual("playing");
      backLayer.style.opacity = "0"; frontLayer.style.opacity = "0";
      A(letter, [{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: "linear" });
      later(function () {
        paintSealed(); letter.style.opacity = "0";
        A(backLayer, [{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: "linear" });
        A(frontLayer, [{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: "linear" });
        later(onSealed, 220);
      }, 210);
    }

    function onSealed() {
      if (destroyed) return;
      skipBtn.hidden = true;
      setVisual("sealed");
      gate();
    }
    /* 閘門：封口後依「伺服器真實狀態」決定 */
    function gate() {
      if (visual !== "sealed") return;
      if (net.state === "confirmed") return depart();
      if (net.state === "failed") return showFailed();
      showWaiting();
    }
    function showWaiting() {
      gateShown = true; body.innerHTML = "";
      var unknown = net.state === "unknown";
      setStatusHTML('<span class="lsa-spin" aria-hidden="true"></span><span>' + esc(net.waitText || (unknown ? "連線較慢，正在查詢這封信的寄送狀態…" : "正在確認收件…")) + '</span>');
      if (unknown) body.innerHTML = '<p class="lsa-note">不會重新寄出，也不會重複扣款。請不要再付款一次。</p>';
      else if (net.note) body.innerHTML = '<p class="lsa-note">' + esc(net.note) + '</p>';
      if (!reduced) { seal.getAnimations().forEach(function (a) { a.cancel(); }); A(seal, [{ opacity: 1 }, { opacity: .78 }, { opacity: 1 }], { duration: 2000, iterations: Infinity, easing: "ease-in-out", fill: "none" }); }
    }
    function stopGlow() { seal.getAnimations().forEach(function (a) { try { a.cancel(); } catch (e) {} }); seal.style.opacity = "1"; }
    function showFailed() {
      stopGlow(); setVisual("failed");
      env.style.opacity = ".72";
      setStatusHTML("");
      var acts = net.actions || ["retry", "help"];
      body.innerHTML = '<div class="lsa-err" role="alert"><b>' + esc(net.title || "這封信沒有寄出") + '</b>' + esc(net.message || "你的信件內容已保留。") + '</div>' +
        '<div class="lsa-row">' + (acts.indexOf("retry") > -1 ? '<button type="button" class="lsa-btn primary" data-act="retry">' + esc(net.retryLabel || "確認狀態後重試") + '</button>' : '') +
        (acts.indexOf("help") > -1 ? '<button type="button" class="lsa-btn" data-act="help">聯絡協助</button>' : '') + '</div>';
      var r = body.querySelector('[data-act="retry"]'), h = body.querySelector('[data-act="help"]');
      if (r) r.onclick = function () { r.disabled = true; if (opts.onRetry) opts.onRetry(); };
      if (h) h.onclick = function () { if (opts.onHelp) opts.onHelp(); };
    }
    function depart() {
      if (visual === "departing" || visual === "done") return;
      stopGlow(); setVisual("departing"); setStatusHTML(""); body.innerHTML = "";
      try { if (navigator.vibrate) navigator.vibrate(10); } catch (e) {}
      if (reduced) {
        A(env, [{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: "linear" });
        return later(showDone, 210);
      }
      skipBtn.hidden = false;
      var u = unitPx(), kf = [], n = 8;
      for (var i = 0; i <= n; i++) {
        var t = i / n, p = bez(t), dx = (p[0] - ARC[0][0]) * u, dy = (p[1] - ARC[0][1]) * u;
        kf.push({ offset: t, transform: "translate(" + dx.toFixed(1) + "px," + dy.toFixed(1) + "px) rotate(" + (-12 * t).toFixed(2) + "deg) scale(" + (1 - .82 * t).toFixed(3) + ")", opacity: t < .7 ? 1 : 1 - (t - .7) / .3 });
      }
      A(env, kf, { duration: T.depart, easing: "cubic-bezier(.5,0,.6,1)" });
      A(q(".lsa-shadow"), [{ opacity: .2 }, { opacity: 0 }], { duration: 250 });
      A(arc, [{ opacity: 0 }, { opacity: 1, offset: .15 }, { opacity: .8, offset: .65 }, { opacity: 0 }], { duration: T.depart, easing: "linear" });   /* 光跡短而克制，送達卡出現前就消失 */
      arcPaths.forEach(function (p) { A(p, [{ strokeDashoffset: 100 }, { strokeDashoffset: 0 }], { duration: T.depart, easing: "cubic-bezier(.5,0,.6,1)" }); });
      later(showDone, T.depart + 60);
    }
    function showDone() {
      if (visual === "done") return;
      skipBtn.hidden = true; setVisual("done");
      env.style.opacity = "0"; arc.style.opacity = "0";
      A(memorial, [{ opacity: 0, transform: "translateY(" + (8 * unitPx()) + "px)" }, { opacity: 1, transform: "none" }], { duration: reduced ? 200 : T.confirm, easing: "cubic-bezier(.2,.7,.2,1)" });
      var readBy = net.readBy ? '<p>Chance 將於 ' + esc(fmtTaipei(net.readBy)) + ' 前親自讀完。</p>' : '';
      setStatusHTML("");
      body.innerHTML = '<div class="lsa-done" style="display:flex;flex-direction:column;gap:10px">' +
        '<h3 tabindex="-1">你的信，已送達<br>Chance 的專屬信箱。</h3>' + readBy +
        '<p class="lsa-note">送達代表信箱已接收，不代表已讀。Chance 本人讀完後會另外顯示。</p>' +
        (net.demo ? '<span class="lsa-demo"><em>DEMO</em>模擬送達 · 沒有真的寄出</span>' : '') +
        '<div class="lsa-row"><button type="button" class="lsa-btn primary" data-act="view">查看信件</button></div></div>';
      body.querySelector('[data-act="view"]').onclick = function () { if (opts.onViewLetter) opts.onViewLetter(); };
      try { body.querySelector("h3").focus({ preventScroll: true }); } catch (e) {}
      if (!completed) { completed = true; if (opts.onVisualComplete) opts.onVisualComplete(); }   /* 只代表畫面播完 */
    }

    skipBtn.onclick = function () {
      if (opts.onSkip) opts.onSkip();
      if (visual === "playing") { timers.forEach(clearTimeout); timers = []; paintSealed(); if (reduced) letter.style.opacity = "0"; onSealed(); }
      else if (visual === "departing") { timers.forEach(clearTimeout); timers = []; anims.forEach(function (a) { try { a.finish(); } catch (e) {} }); showDone(); }
    };

    var api = {
      start: function () {
        if (visual !== "idle") return;              /* 重複點擊不會重播、不會重送 */
        try { if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); } catch (e) {}   /* 收鍵盤 */
        if (opts.resume) {
          paintSealed(); if (reduced) letter.style.opacity = "0";
          if (opts.skipToDone && net.state === "confirmed") { setVisual("sealed"); showDone(); return; }   /* 已看過飛出：回來直接是送達卡 */
          onSealed(); return;
        }
        reduced ? playReduced() : playFull();
      },
      setStatus: function (s) {
        if (destroyed || !s) return;
        if (net.state === "confirmed" && s.state !== "confirmed") return;   /* 成功後不倒退 */
        net = Object.assign({}, net, s);
        if (visual === "sealed") gate();
        else if (visual === "failed" && (s.state === "pending" || s.state === "unknown")) { env.style.opacity = "1"; setVisual("sealed"); gate(); }
        else if (visual === "failed" && s.state === "confirmed") { env.style.opacity = "1"; setVisual("sealed"); gate(); }
      },
      skip: function () { skipBtn.click(); },
      get visual() { return visual; },
      get reduced() { return reduced; },
      destroy: function () {
        destroyed = true; timers.forEach(clearTimeout); timers = [];
        anims.forEach(function (a) { try { a.cancel(); } catch (e) {} }); anims = [];
        if (root.parentNode) root.parentNode.removeChild(root);
      }
    };
    return api;
  }
  root.LetterSendAnimation = { create: create, _arc: ARC };
})(window);
