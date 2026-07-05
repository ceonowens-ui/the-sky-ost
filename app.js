/* =====================================================================
 * ALBUM APP TEMPLATE — app.js（引擎）
 * =====================================================================
 * 完全從 window.ALBUM_CONFIG 讀取資料。這個檔案不含任何專輯內容，
 * 換專輯「不需要」修改它 —— 只改 album-config.js。
 *
 * ⚠️ 已在 iPhone Safari 實測過的關鍵寫法（不要改壞）：
 *   1. 播放一律 audio.src = 串流網址 + audio.play()，且 play() 要在
 *      使用者手勢的同一個 tick 呼叫。不要改成 fetch → Blob → 播放，
 *      iOS 的自動播放限制會擋掉（手勢過期）。
 *   2. 付費曲串流靠 Worker /track 支援 HTTP Range（206）。
 *   3. 付費曲的 file 參數 = config 的 protectedPath（含資料夾前綴，
 *      例如 "os3/03.mp3"），必須與 Worker 白名單、R2 key 完全一致。
 *
 * ⚠️ 安全模型：
 *   - localStorage 的 unlocked 只是「前端顯示狀態」。就算有人手動改，
 *     也拿不到付費音檔 —— 每個 /track 請求都由 Worker 用 email+code
 *     對 KV 驗證（server-side verification）。
 *   - demo 碼（LOVE/SECRET）只是展示捷徑，正式版請在 config 清空
 *     unlock.demoCodes，並移除 Worker 內的 DEMO_CODES。
 * ===================================================================== */
(function () {
  "use strict";

  /* ---------- 真實可視高度（iPhone 貼底的最終解）----------
   * iOS 在 Safari 網址列收合/展開、PWA standalone 等狀態下，
   * 100vh / 100dvh / fixed 的高度回報常常對不上實際畫面，
   * 造成底部黑 bar、浮動 nav 浮在半空中。
   * visualViewport.height 永遠等於「使用者現在真正看得到的高度」，
   * 量出來寫進 --vvh，styles.css 的 #stage 直接用它。 */
  (function () {
    function setVVH() {
      var vv = window.visualViewport;
      var h = vv ? vv.height : window.innerHeight;
      if (h) document.documentElement.style.setProperty("--vvh", Math.round(h) + "px");
    }
    setVVH();
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", setVVH);
      window.visualViewport.addEventListener("scroll", setVVH);
    }
    window.addEventListener("resize", setVVH);
    window.addEventListener("orientationchange", function () { setTimeout(setVVH, 250); });
  })();

  var CFG = window.ALBUM_CONFIG;
  if (!CFG) { console.error("找不到 ALBUM_CONFIG，請確認 album-config.js 有先載入"); return; }

  /* ---------- 小工具 ---------- */
  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function fmt(s) {
    if (!s || !isFinite(s)) return "0:00";
    return Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0");
  }
  function pad2(n) { return String(n).padStart(2, "0"); }
  function hap(p) { if (navigator.vibrate) { try { navigator.vibrate(p); } catch (e) {} } }
  function hexToRgb(hex) {
    var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || "");
    return m ? parseInt(m[1], 16) + "," + parseInt(m[2], 16) + "," + parseInt(m[3], 16) : "242,155,194";
  }

  var TRACKS = CFG.tracks || [];
  var STR = CFG.strings || {};
  var TOTAL = TRACKS.length;

  /* ---------- localStorage keys（依專輯 namespace，避免不同專輯互相污染）---------- */
  var NS = (CFG.unlock && CFG.unlock.localStorageKey) || ("album-" + CFG.albumId);
  var LS = { unlock: NS + ":unlock", pos: NS + ":pos", mood: NS + ":mood", hearts: NS + ":hearts" };
  function lsGet(k, fb) { try { var v = JSON.parse(localStorage.getItem(k) || "null"); return v == null ? fb : v; } catch (e) { return fb; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  /* ---------- 主題注入：把 ALBUM_CONFIG.theme 寫進 CSS 變數 ---------- */
  (function applyTheme() {
    var t = CFG.theme || {}, r = document.documentElement.style;
    if (t.bg) r.setProperty("--bg", t.bg);
    if (t.bgTop) r.setProperty("--bg-top", t.bgTop);
    if (t.surface) r.setProperty("--surface", t.surface);
    if (t.primary) { r.setProperty("--primary", t.primary); r.setProperty("--primary-rgb", hexToRgb(t.primary)); }
    if (t.secondary) r.setProperty("--secondary", t.secondary);
    if (t.accent) r.setProperty("--accent", t.accent);
    if (t.text) r.setProperty("--text", t.text);
    if (t.muted) r.setProperty("--muted", t.muted);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = t.themeColor || t.bg || "#0d0a12";
    document.title = CFG.albumTitle || "Album App";
    var icon = $("apple-touch-icon"); if (icon && CFG.coverImage) icon.href = CFG.coverImage;
    if (CFG.backgroundImage) {
      document.body.style.background = 'url("' + CFG.backgroundImage + '") center/cover fixed';
    }
  })();

  /* ---------- 靜態文案填入 ---------- */
  $("cover-img").src = CFG.coverImage || "";
  // 選填：coverVideo 設定就用循環影片取代靜態封面（自動播放需 muted+playsinline）
  if (CFG.coverVideo) {
    var cv = $("cover-video");
    cv.muted = true; cv.defaultMuted = true; // iOS Safari 自動播放必須用 JS 也設一次
    cv.src = CFG.coverVideo;
    $("cover-card").classList.add("has-video");
    cv.play && cv.play().catch(function(){});
  }
  $("cover-eyebrow").textContent = CFG.albumEyebrow || "";
  $("cover-title-en").textContent = CFG.albumTitleEn || CFG.albumTitle || "";
  $("np-label").textContent = STR.nowPlayingLabel || "Now Playing";
  $("next-scene-label").textContent = (STR.nextScene || "Next Scene") + " · 共 " + TOTAL + " 首";
  $("tracklist-caption").textContent = "Tracks · " + TOTAL + " 首";
  $("sheet-title").textContent = "曲目列表 · " + TOTAL + " 首";
  $("purchase-title-en").textContent = STR.purchaseTitleEn || "Unlock the Album";
  $("purchase-title-tc").textContent = "解鎖完整 " + TOTAL + " 首專輯";
  $("unlock-title-en").textContent = STR.unlockTitleEn || "Secret";
  $("unlock-subtitle").textContent = STR.unlockSubtitle || "兌換與解鎖";
  $("unlocked-title").textContent = "已解鎖完整 " + TOTAL + " 首專輯";
  $("unlocked-desc").textContent = "所有曲目都已開放，可線上聽 + 下載收藏";
  $("in-code").placeholder = (CFG.unlock && CFG.unlock.codePlaceholder) || "XXXX-XXXX";
  var freeCount = TRACKS.filter(function (t) { return t.free; }).length;
  $("purchase-note").textContent = "免費試聽前 " + freeCount + " 首 · 解鎖後可線上聽 + 下載收藏";
  (CFG.moodWall || {}).heading != null && ($("mood-heading").textContent = CFG.moodWall.heading);
  $("mood-subheading").textContent = (CFG.moodWall || {}).subheading || "";
  $("mood-eyebrow").textContent = (CFG.moodWall || {}).eyebrow || "";
  (function () {
    var GAL = CFG.gallery || {};
    if (GAL.heading != null) $("gallery-heading").textContent = GAL.heading;
    $("gallery-subheading").textContent = GAL.subheading || "";
    var photos = GAL.photos || [];
    var scroll = $("gallery-scroll"), dots = $("gallery-dots");
    scroll.innerHTML = photos.map(function (p) {
      return '<div class="gallery-slide"><img src="' + esc(p.src) + '" alt="">' +
        '<div class="gallery-shade"></div>' +
        (p.caption ? '<div class="gallery-caption">' + esc(p.caption) + '</div>' : "") +
        "</div>";
    }).join("");
    dots.innerHTML = photos.map(function (_, i) {
      return '<div class="gallery-dot' + (i === 0 ? " active" : "") + '"></div>';
    }).join("");
    var dotEls = Array.prototype.slice.call(dots.children);
    var slideEls = Array.prototype.slice.call(scroll.children);
    if (slideEls.length) {
      scroll.addEventListener("scroll", function () {
        var center = scroll.scrollLeft + scroll.clientWidth / 2;
        var closest = 0, best = Infinity;
        slideEls.forEach(function (el, i) {
          var mid = el.offsetLeft + el.offsetWidth / 2;
          var d = Math.abs(mid - center);
          if (d < best) { best = d; closest = i; }
        });
        dotEls.forEach(function (d, i) { d.classList.toggle("active", i === closest); });
      }, { passive: true });
    }
  })();
  (function () {
    var labels = STR.navTabs || ["聽歌", "完整版", "秘密", "心情牆"];
    document.querySelectorAll("#nav .navbtn .navlbl").forEach(function (el, i) { el.textContent = labels[i] || ""; });
  })();

  /* ---------- 狀態 ---------- */
  var pos = lsGet(LS.pos, {});
  var state = {
    screen: "player",
    cur: Math.min(pos.cur || 0, TOTAL - 1),
    playing: false,
    dur: 0,
    selectedPlan: "basic",           // basic(299) / deluxe(599)
    unlocked: !!(lsGet(LS.unlock, {}).unlocked),
  };
  var seeking = false, saveT = 0, durFixing = false, resumeAt = 0;
  var lyricsCache = {};

  function unlockInfo() { return lsGet(LS.unlock, {}); }
  /* 分級正規化：只有真正的 599/deluxe 才算典藏版，其餘一律 basic。
   * （對後端回傳做防呆 —— 見 PITFALLS #2） */
  function purchasedProduct() {
    var p = String(unlockInfo().product || "");
    var pay = CFG.payment || {};
    /* BUG FIX：deluxePrice 與 basicPrice 相同（尚未開典藏版）時，
       不能拿價格字串判斷典藏版，否則所有 299 購買都被誤判成 deluxe */
    var priceIsDeluxe = String(pay.deluxePrice) !== String(pay.basicPrice) && p === String(pay.deluxePrice);
    return (p === "599" || p === "deluxe" || priceIsDeluxe) ? "deluxe" : "basic";
  }
  function isLocked(t) { return !t.free && !state.unlocked; }

  /* ---------- 音源路徑 ----------
   * 免費曲：本地檔（assets/audio/，可公開部署在 GitHub Pages）。
   * 付費曲：一律走 Worker /track 驗證後串流 —— 真實音檔在私有 R2，
   *         「絕對不要」把付費音檔放進前端 repo。
   * ⚠️ PITFALLS #3：file 參數用 protectedPath（含 "os3/" 之類前綴），
   *    必須與 worker.js 的 PROTECTED_FILES、R2 object key 完全一致。 */
  function srcFor(t) {
    if (t.free) return t.audioPath;
    var u = unlockInfo();
    return CFG.api.workerBaseUrl + "/track?file=" + encodeURIComponent(t.protectedPath || "") +
      "&email=" + encodeURIComponent(u.email || "") + "&code=" + encodeURIComponent(u.code || "");
  }

  /* ---------- Audio 引擎 ---------- */
  var audio = new Audio();
  audio.preload = "none";

  audio.addEventListener("timeupdate", function () {
    if (seeking) return;
    var d = audio.duration;
    if (isFinite(d) && d > 0) state.dur = d;
    renderProgress(audio.currentTime);
    if (Date.now() - saveT > 4000) { saveT = Date.now(); lsSet(LS.pos, { cur: state.cur, time: audio.currentTime }); }
  });
  /* 串流檔常回報 duration:Infinity → 逼瀏覽器解析真實長度 */
  function resolveDur() {
    var d = audio.duration;
    if (isFinite(d) && d > 0) { state.dur = d; renderProgress(audio.currentTime); return; }
    if (durFixing) return; durFixing = true;
    resumeAt = audio.currentTime || 0;
    var onSeek = function () {
      audio.removeEventListener("timeupdate", onSeek);
      var real = audio.duration;
      if (isFinite(real) && real > 0) state.dur = real;
      try { audio.currentTime = resumeAt || 0; } catch (e) {}
      resumeAt = 0; durFixing = false;
    };
    audio.addEventListener("timeupdate", onSeek);
    try { audio.currentTime = 1e7; } catch (e) { durFixing = false; }
  }
  audio.addEventListener("loadedmetadata", resolveDur);
  audio.addEventListener("durationchange", function () {
    var d = audio.duration; if (isFinite(d) && d > 0) { state.dur = d; renderProgress(audio.currentTime); }
  });
  audio.addEventListener("play", function () { state.playing = true; renderPlayState(); });
  audio.addEventListener("pause", function () { state.playing = false; renderPlayState(); });
  audio.addEventListener("ended", function () { next(); });

  function playTrack(i) {
    var t = TRACKS[i];
    if (isLocked(t)) { toast("需解鎖完整專輯才能播放"); go("purchase"); return; }
    durFixing = false; resumeAt = 0;
    state.cur = i; state.dur = 0;
    audio.src = srcFor(t);
    audio.play().catch(function () {});   // 同一手勢 tick 內呼叫（iOS 必要）
    renderNowPlaying(); renderTrackLists(); renderProgress(0);
    updateMediaSession();
  }
  function togglePlay() {
    if (!audio.src) { playTrack(state.cur); return; }
    if (audio.paused) audio.play().catch(function () {}); else audio.pause();
  }
  function next() {
    var i = state.cur;
    do { i = (i + 1) % TOTAL; } while (isLocked(TRACKS[i]) && i !== state.cur);
    if (isLocked(TRACKS[i])) { toast("其餘曲目需解鎖完整專輯"); return; }
    playTrack(i);
  }
  function prev() {
    if (audio.currentTime > 3) { audio.currentTime = 0; return; }
    var i = state.cur;
    do { i = (i - 1 + TOTAL) % TOTAL; } while (isLocked(TRACKS[i]) && i !== state.cur);
    if (isLocked(TRACKS[i])) return;
    playTrack(i);
  }

  /* ---------- Media Session（鎖定畫面 + 耳機控制）---------- */
  function updateMediaSession() {
    if (!("mediaSession" in navigator)) return;
    var t = TRACKS[state.cur];
    var art = t.artwork || CFG.coverImage;
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: isLocked(t) ? "Secret Track" : t.title,
        artist: CFG.artistName || "",
        album: CFG.albumTitle || "",
        artwork: art ? [{ src: art, sizes: "512x512", type: "image/png" }] : [],
      });
      navigator.mediaSession.setActionHandler("play", function () { audio.play().catch(function () {}); });
      navigator.mediaSession.setActionHandler("pause", function () { audio.pause(); });
      navigator.mediaSession.setActionHandler("previoustrack", prev);
      navigator.mediaSession.setActionHandler("nexttrack", next);
      navigator.mediaSession.setActionHandler("seekto", function (d) {
        if (d.seekTime != null) { try { audio.currentTime = d.seekTime; } catch (e) {} }
      });
    } catch (e) {}
  }

  /* ---------- 進度條（點擊 + 拖曳）---------- */
  var progEl = $("prog");
  function renderProgress(cur) {
    var pct = state.dur ? Math.max(0, Math.min(100, (cur / state.dur) * 100)) : 0;
    $("prog-fill").style.width = pct + "%";
    /* BUG FIX：帶角色標籤的圓點寬 26px，0%/100% 時 clamp 住不凸出進度條外 */
    $("prog-dot").style.left = "clamp(13px, " + pct + "%, calc(100% - 13px))";
    $("prog-glow").style.left = pct + "%";
    $("t-cur").textContent = fmt(cur);
    $("t-dur").textContent = fmt(state.dur);
  }
  function seekAt(e) {
    var r = progEl.getBoundingClientRect();
    var p = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    var ad = audio.duration;
    var dur = (isFinite(ad) && ad > 0) ? ad : (state.dur || 0);
    if (dur > 0) { try { audio.currentTime = p * dur; } catch (err) {} }
    renderProgress(p * dur);
  }
  progEl.addEventListener("pointerdown", function (e) {
    seeking = true; seekAt(e);
    var move = function (ev) { seekAt(ev); };
    var up = function () { seeking = false; document.removeEventListener("pointermove", move); document.removeEventListener("pointerup", up); };
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", up);
  });

  /* ---------- Now Playing 卡片 ---------- */
  function renderNowPlaying() {
    var t = TRACKS[state.cur];
    var locked = isLocked(t);
    $("np-title").textContent = locked ? "Secret Track" : t.title;
    $("np-sub").textContent = "track " + pad2(t.n) + (t.subtitle ? " · " + t.subtitle : "");
    /* 進度圓點：config 有 progressDot 就交替顯示角色標籤 */
    var pd = (CFG.theme || {}).progressDot;
    var dot = $("prog-dot");
    if (pd && pd.labels && pd.labels.length) {
      var idx = (t.n % 2 === 1) ? 0 : 1;
      dot.textContent = pd.labels[idx % pd.labels.length];
      if (pd.gradients && pd.gradients[idx]) {
        dot.style.background = pd.gradients[idx];
        $("prog-fill").style.background = pd.gradients[idx];
      }
    } else { dot.textContent = ""; }
    /* 歌詞按鈕：沒歌詞就藏起來（頁面不會壞） */
    $("btn-lyrics").classList.toggle("hidden", !t.lyricsPath);
  }
  function renderPlayState() {
    $("play-icon-path").setAttribute("d", state.playing ? "M6 5h4v14H6zM14 5h4v14h-4z" : "M8 5v14l11-7z");
    $("cover-card").classList.toggle("playing", state.playing);   // 封面呼吸動畫
    $("prog-glow").classList.toggle("pulsing", state.playing);
    if ("mediaSession" in navigator) { try { navigator.mediaSession.playbackState = state.playing ? "playing" : "paused"; } catch (e) {} }
  }

  /* ---------- 曲目列表（主頁 + Bottom Sheet 共用同一份渲染）---------- */
  function trackRowHTML(t, i, revealing) {
    var locked = isLocked(t);
    var isCur = i === state.cur;
    var cls = "track-row" + (isCur ? " current" : "") + (locked ? " locked" : "") + (revealing && !t.free ? " revealing" : "");
    var style = revealing && !t.free ? ' style="animation-delay:' + ((i - freeCount) * 0.05).toFixed(2) + 's"' : "";
    var right;
    if (locked) {
      right = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6f6680" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';
    } else if (state.unlocked && purchasedProduct() === "deluxe" && !t.free) {
      right = '<button class="track-dl" data-dl="' + i + '" title="下載這首"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button>';
    } else {
      right = '<svg width="14" height="14" viewBox="0 0 24 24" fill="var(--primary)"><path d="M8 5v14l11-7z"/></svg>';
    }
    return '<div class="' + cls + '" data-i="' + i + '"' + style + '>' +
      '<span class="track-num">' + pad2(t.n) + "</span>" +
      '<div class="track-name">' + (locked ? "Secret Track" : esc(t.title)) + "</div>" + right + "</div>";
  }
  function renderTrackLists(revealing) {
    var html = TRACKS.map(function (t, i) { return trackRowHTML(t, i, revealing); }).join("");
    $("tracklist").innerHTML = html;
    $("sheet-list").innerHTML = html;
  }
  function bindTrackListClicks(container) {
    container.addEventListener("click", function (e) {
      var dl = e.target.closest("[data-dl]");
      if (dl) { e.stopPropagation(); downloadTrack(parseInt(dl.getAttribute("data-dl"), 10)); return; }
      var row = e.target.closest(".track-row");
      if (row) playTrack(parseInt(row.getAttribute("data-i"), 10));
    });
  }
  bindTrackListClicks($("tracklist"));
  bindTrackListClicks($("sheet-list"));

  /* 單曲下載：典藏版限定（Worker 端同樣會驗證，前端只是 UI 把關） */
  function downloadTrack(i) {
    var t = TRACKS[i];
    if (isLocked(t)) { toast("需解鎖完整專輯才能下載"); go("purchase"); return; }
    if (!t.free && purchasedProduct() !== "deluxe") { toast("下載為典藏版限定"); return; }
    var url = srcFor(t) + (t.free ? "" : "&download=1");
    try {
      var a = document.createElement("a");
      /* BUG FIX：副檔名跟著實際檔案走（05/08 是 .wav，不能寫死 .mp3） */
      var ext = ((t.protectedPath || t.audioPath || "").match(/\.(\w+)$/) || [0, "mp3"])[1];
      a.href = url; a.download = pad2(t.n) + " " + t.title + "." + ext; a.rel = "noopener";
      document.body.appendChild(a); a.click(); a.remove();
    } catch (e) { window.open(url, "_blank"); }
    hap(10); toast("開始下載 · " + t.title);
  }

  /* ---------- Bottom Sheet（含 iOS 風格拖曳關閉）---------- */
  var sheet = $("sheet"), backdrop = $("sheet-backdrop");
  function openSheet() { sheet.classList.remove("hidden"); backdrop.classList.remove("hidden"); sheet.style.transform = ""; }
  function closeSheet() { sheet.classList.add("hidden"); backdrop.classList.add("hidden"); sheet.classList.remove("dragging", "snapping"); sheet.style.transform = ""; }
  $("btn-open-sheet").addEventListener("click", openSheet);
  $("btn-close-sheet").addEventListener("click", closeSheet);
  backdrop.addEventListener("click", closeSheet);
  /* 拖把手往下拉：跟手移動，放開超過 1/4 高度或速度夠快 → 關閉 */
  (function () {
    var startY = 0, curY = 0, startT = 0, active = false;
    function onStart(e) {
      active = true; startY = curY = (e.touches ? e.touches[0].clientY : e.clientY); startT = Date.now();
      sheet.classList.add("dragging"); sheet.classList.remove("snapping");
    }
    function onMove(e) {
      if (!active) return;
      curY = (e.touches ? e.touches[0].clientY : e.clientY);
      var dy = Math.max(0, curY - startY);
      sheet.style.transform = "translateY(" + dy + "px)";
      if (e.cancelable) e.preventDefault();
    }
    function onEnd() {
      if (!active) return; active = false;
      sheet.classList.remove("dragging");
      var dy = Math.max(0, curY - startY);
      var v = dy / Math.max(1, Date.now() - startT); // px/ms
      if (dy > sheet.offsetHeight / 4 || v > 0.6) { closeSheet(); }
      else { sheet.classList.add("snapping"); sheet.style.transform = "translateY(0)"; }
    }
    var g = $("sheet-grabber"), h = sheet.querySelector(".sheet-head");
    [g, h].forEach(function (el) {
      el.addEventListener("touchstart", onStart, { passive: true });
      el.addEventListener("mousedown", onStart);
    });
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("mousemove", onMove);
    document.addEventListener("touchend", onEnd);
    document.addEventListener("mouseup", onEnd);
  })();

  /* ---------- 歌詞 ---------- */
  $("btn-lyrics").addEventListener("click", function () {
    var t = TRACKS[state.cur];
    $("lyrics-eyebrow").textContent = STR.lyricsLabel || "Lyrics";
    $("lyrics-title").textContent = isLocked(t) ? "Secret Track" : t.title;
    var body = $("lyrics-body");
    $("lyrics-overlay").classList.remove("hidden");
    if (!t.lyricsPath) { body.innerHTML = '<div class="lyrics-empty">' + esc(STR.noLyrics || "這首歌暫時沒有歌詞") + "</div>"; return; }
    if (lyricsCache[t.n] != null) { body.textContent = lyricsCache[t.n]; return; }
    body.innerHTML = '<div class="lyrics-empty">載入中…</div>';
    fetch(t.lyricsPath).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.text();
    }).then(function (txt) {
      lyricsCache[t.n] = txt;
      body.textContent = txt;
      /* 之後要做同步歌詞（LRC）可在這裡解析時間標記 */
    }).catch(function () {
      body.innerHTML = '<div class="lyrics-empty">' + esc(STR.noLyrics || "這首歌暫時沒有歌詞") + "</div>";
    });
  });
  $("btn-close-lyrics").addEventListener("click", function () { $("lyrics-overlay").classList.add("hidden"); });

  /* ---------- 分頁切換 + Floating Island Nav ---------- */
  var navBtns = Array.prototype.slice.call(document.querySelectorAll("#nav .navbtn"));
  var ORDER = ["player", "purchase", "unlock", "mood", "gallery"];
  function go(screen) {
    state.screen = screen;
    closeSheet();
    ORDER.forEach(function (s) {
      $("screen-" + s).classList.toggle("active", s === screen);
    });
    var i = ORDER.indexOf(screen);
    $("nav-ind").style.transform = "translateX(" + (i * 64) + "px)";
    navBtns.forEach(function (b, j) {
      b.classList.toggle("active", j === i);
      b.classList.remove("pop");
    });
    if (i >= 0) { void navBtns[i].offsetWidth; navBtns[i].classList.add("pop"); }
    if (screen === "unlock") renderUnlockView();
  }
  navBtns.forEach(function (b) { b.addEventListener("click", function () { go(b.getAttribute("data-screen")); }); });

  /* ---------- 付費解鎖頁 ---------- */
  function renderPlans() {
    var P = CFG.payment || {};
    var plans = [
      { key: "basic", name: P.basicName, price: P.basicPrice, features: P.basicFeatures || [], deluxe: false },
      { key: "deluxe", name: P.deluxeName, price: P.deluxePrice, features: P.deluxeFeatures || [], deluxe: true },
    ];
    /* BUG FIX：尚未開典藏版（兩方案同名同價同連結）時只顯示一張方案卡 */
    if (P.deluxeName === P.basicName && P.deluxePrice === P.basicPrice &&
        P.stripeLinkDeluxe === P.stripeLinkBasic) {
      plans = plans.slice(0, 1);
      state.selectedPlan = "basic";
    }
    $("plans").innerHTML = plans.map(function (p) {
      var check = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
      return '<div class="plan' + (p.deluxe ? " deluxe" : "") + (state.selectedPlan === p.key ? " selected" : "") + '" data-plan="' + p.key + '">' +
        (p.deluxe && P.deluxeBadge ? '<div class="plan-badge">' + esc(P.deluxeBadge) + "</div>" : "") +
        '<div class="plan-name">' + esc(p.name) + "</div>" +
        '<div class="plan-price">' + esc(P.currency || "NT$") + p.price + "</div>" +
        '<div class="plan-features">' + p.features.map(function (f) {
          return '<div class="plan-feature">' + check + esc(f) + "</div>";
        }).join("") + "</div></div>";
    }).join("");
    var P2 = CFG.payment || {};
    $("btn-checkout").textContent = "前往結帳 · " + (P2.currency || "NT$") +
      (state.selectedPlan === "deluxe" ? P2.deluxePrice : P2.basicPrice);
  }
  $("plans").addEventListener("click", function (e) {
    var card = e.target.closest("[data-plan]");
    if (!card) return;
    state.selectedPlan = card.getAttribute("data-plan");
    renderPlans();
  });
  /* Stripe Payment Link 在 album-config.js → payment 換 */
  $("btn-checkout").addEventListener("click", function () {
    var P = CFG.payment || {};
    var link = state.selectedPlan === "deluxe" ? P.stripeLinkDeluxe : P.stripeLinkBasic;
    if (!link) { toast("尚未設定付款連結"); return; }
    window.open(link, "_blank");
  });
  $("btn-goto-unlock").addEventListener("click", function () { go("unlock"); });
  $("btn-goto-purchase").addEventListener("click", function () { go("purchase"); });
  $("btn-goto-player").addEventListener("click", function () { go("player"); });

  /* ---------- 兌換 / 解鎖 ---------- */
  function renderUnlockView() {
    $("unlock-form-view").classList.toggle("hidden", state.unlocked);
    $("unlock-done-view").classList.toggle("hidden", !state.unlocked);
    if (!state.unlocked) return;
    var deluxe = purchasedProduct() === "deluxe";
    var wav = $("btn-wav");
    var hasWav = deluxe && CFG.api && CFG.api.wavDriveLink;
    wav.classList.toggle("hidden", !hasWav);
    if (hasWav) wav.href = CFG.api.wavDriveLink;
    $("unlocked-plan-note").textContent = deluxe
      ? "你的方案：典藏版 + WAV 無損 · 點上方按鈕前往雲端下載完整 WAV ♡"
      : "你的方案：數位專輯 · 可線上聆聽完整 " + TOTAL + " 首（WAV 無損下載為典藏版限定）";
  }

  function unlockNow(data) {
    lsSet(LS.unlock, Object.assign({ unlocked: true }, data));
    state.unlocked = true;
    go("player");
    openSheet();
    renderTrackLists(true);
    renderNowPlaying();
    unlockBurstFx();
    hap([12, 30, 12, 30, 40]);
    toast("解鎖成功 · " + TOTAL + " 首全部屬於你了 ♡");
  }

  $("btn-redeem").addEventListener("click", function () {
    var email = ($("in-email").value || "").trim();
    var code = ($("in-code").value || "").trim().toUpperCase();
    if (!email || !code) { toast("請輸入 email 和兌換碼"); return; }

    /* ⚠️ DEMO 模式：config 的 demoCodes 是「純前端」捷徑，方便展示。
     *    每個 demo 碼都寫死對應方案（不會誤用畫面上選的方案 —— PITFALLS #2）。
     *    正式版：demoCodes 設成 {}，所有兌換一律走下面的 Worker /verify
     *    （server-side verification：碼綁購買 email、存在 KV）。 */
    var demo = (CFG.unlock && CFG.unlock.demoCodes) || {};
    if (demo[code]) {
      unlockNow({ email: email, code: code, product: demo[code] });
      return;
    }

    if (!CFG.api || !CFG.api.workerBaseUrl) { toast("後端尚未設定 · 可先用 demo 兌換碼體驗"); return; }
    fetch(CFG.api.workerBaseUrl + "/verify", {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=UTF-8" },  // 避免 CORS preflight
      body: JSON.stringify({ email: email, code: code }),
    }).then(function (r) { return r.json(); }).then(function (data) {
      if (data.ok) unlockNow({ email: email, code: code, product: data.product || "299" });
      else toast(data.message || "兌換碼或 email 不正確");
    }).catch(function () { toast("連線失敗 · 後端未回應"); });
  });

  $("btn-reset-unlock").addEventListener("click", function () {
    try { localStorage.removeItem(LS.unlock); } catch (e) {}
    state.unlocked = false;
    renderUnlockView(); renderTrackLists(); renderNowPlaying();
    toast("已重設 · 回到未解鎖狀態");
  });

  /* ---------- 心情牆 ---------- */
  var MW = CFG.moodWall || {};
  var moods = lsGet(LS.mood, null);
  if (!Array.isArray(moods) || !moods.length) {
    moods = (MW.seedComments || []).map(function (c, i) { return Object.assign({ id: i + 1 }, c); });
  }
  var selectedMood = "", newMoodId = null;

  function renderMoodWall() {
    $("mood-count").textContent = moods.length;
    $("mood-tags").innerHTML = (MW.tags || []).map(function (m) {
      return '<button class="mood-tag' + (selectedMood === m ? " selected" : "") + '" data-mood="' + esc(m) + '">' + esc(m) + "</button>";
    }).join("");
    $("mood-notes").innerHTML = moods.map(function (c) {
      return '<div class="mood-note' + (c.id === newMoodId ? " new" : "") + '">' +
        '<div class="mood-note-head"><span class="mood-note-name">' + esc(c.name) + "</span>" +
        '<span class="mood-note-tag">♡ ' + esc(c.mood) + "</span></div>" +
        '<div class="mood-note-text">' + esc(c.text) + "</div>" +
        '<div class="mood-note-time">' + esc(c.time) + "</div></div>";
    }).join("");
  }
  $("mood-tags").addEventListener("click", function (e) {
    var b = e.target.closest("[data-mood]");
    if (!b) return;
    var m = b.getAttribute("data-mood");
    selectedMood = selectedMood === m ? "" : m;
    renderMoodWall();
  });
  $("mood-text").addEventListener("input", function () {
    $("mood-chars").textContent = this.value.length;
    $("mood-err").classList.add("hidden");
  });
  $("btn-mood-submit").addEventListener("click", function () {
    var text = ($("mood-text").value || "").trim();
    if (!text) { $("mood-err").classList.remove("hidden"); return; }
    var name = ($("mood-name").value || "").trim() || "匿名聽眾";
    var c = { id: Date.now(), name: name, mood: selectedMood || "聽歌中", text: text.slice(0, 80), time: "剛剛" };
    moods.unshift(c);
    lsSet(LS.mood, moods);           // localStorage key 依專輯 namespace，不會跟其他專輯混
    newMoodId = c.id; selectedMood = "";
    $("mood-name").value = ""; $("mood-text").value = ""; $("mood-chars").textContent = "0";
    hap(15); renderMoodWall();
    var btn = $("btn-mood-submit");
    btn.textContent = "已收藏這個瞬間 ♡";
    setTimeout(function () { btn.textContent = "留下心情"; }, 1100);
  });

  /* ---------- Toast ---------- */
  var toastT = null;
  function toast(msg, dur) {
    var el = $("toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(function () { el.classList.remove("show"); }, dur || 2200);
  }

  /* ---------- 特效：心動收藏 / 解鎖慶祝 ---------- */
  var HEART_PATH = "M12 21s-7.5-4.6-10-9.3C.3 8.3 1.9 4.8 5.2 4.8c2 0 3.3 1.2 3.9 2.2.6-1 1.9-2.2 3.9-2.2 3.3 0 4.9 3.5 3.2 6.9C19.5 16.4 12 21 12 21z";
  function heartSVG(size, color, style) {
    return '<svg class="fx-heart" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="' + color + '" style="' + style + '"><path d="' + HEART_PATH + '"/></svg>';
  }
  $("btn-heart").addEventListener("click", function (e) {
    var t = TRACKS[state.cur];
    if (isLocked(t)) { toast("解鎖後才能收藏這首的心動瞬間"); return; }
    var stage = $("stage").getBoundingClientRect();
    var b = e.currentTarget.getBoundingClientRect();
    var ox = ((b.left + b.width / 2 - stage.left) / stage.width * 100).toFixed(1);
    var oy = ((b.top + b.height / 2 - stage.top) / stage.height * 100).toFixed(1);
    var fx = $("fx-layer");
    var cols = [getComputedStyle(document.documentElement).getPropertyValue("--primary").trim() || "#f29bc2",
                getComputedStyle(document.documentElement).getPropertyValue("--secondary").trim() || "#c9b0ec",
                getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#afc7f6"];
    var html = '<div class="fx-glow" style="left:' + ox + "%;top:" + oy + '%"></div>' +
               '<div class="fx-ring" style="left:' + ox + "%;top:" + oy + '%"></div>' +
               '<svg class="fx-bloom" width="60" height="60" viewBox="0 0 24 24" fill="' + cols[0] + '" style="left:' + ox + "%;top:" + oy + '%"><path d="' + HEART_PATH + '"/></svg>';
    for (var k = 0; k < 16; k++) {
      var dx = ((Math.random() * 2 - 1) * 72).toFixed(0);
      var rise = (120 + Math.random() * 150).toFixed(0);
      var sc = (0.65 + Math.random() * 0.85).toFixed(2);
      var r2 = ((Math.random() * 2 - 1) * 45).toFixed(0);
      var dur = (1.1 + Math.random() * 0.9).toFixed(2);
      var delay = (Math.random() * 0.4).toFixed(2);
      var size = (13 + Math.random() * 15).toFixed(0);
      var col = cols[Math.floor(Math.random() * cols.length)];
      html += heartSVG(size, col,
        "left:" + ox + "%;top:" + oy + "%;transform:translate(-50%,-50%);--dx:" + dx + "px;--rise:" + rise + "px;--s:" + sc + ";--r2:" + r2 + "deg;" +
        "animation:floatHeart " + dur + "s cubic-bezier(.4,.7,.5,1) " + delay + "s both");
    }
    fx.innerHTML = html;
    var hearts = (lsGet(LS.hearts, 0) || 0) + 1;
    lsSet(LS.hearts, hearts);
    var btn = $("btn-heart");
    btn.classList.add("liked");
    setTimeout(function () { btn.classList.remove("liked"); }, 1200);
    hap([8, 40, 12]); toast("已收藏這一刻", 1000);
    setTimeout(function () { fx.innerHTML = ""; }, 2600);
  });
  function unlockBurstFx() {
    var fx = $("fx-layer");
    var html = '<div id="unlock-fx"><div class="fx-ring2"></div></div>';
    for (var k = 0; k < 8; k++) {
      var left = (10 + Math.random() * 78).toFixed(0);
      var size = (13 + Math.random() * 13).toFixed(0);
      var dur = (0.95 + Math.random() * 0.45).toFixed(2);
      var delay = (Math.random() * 0.3).toFixed(2);
      html += '<svg class="fx-float" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="var(--primary)" style="left:' + left + "%;animation-duration:" + dur + "s;animation-delay:" + delay + 's"><path d="' + HEART_PATH + '"/></svg>';
    }
    fx.innerHTML = html;
    setTimeout(function () { fx.innerHTML = ""; }, 2200);
  }

  /* ---------- 控制鍵綁定 ---------- */
  $("btn-play").addEventListener("click", togglePlay);
  $("btn-prev").addEventListener("click", prev);
  $("btn-next").addEventListener("click", next);

  /* ---------- 開機 ---------- */
  renderNowPlaying();
  renderPlayState();
  renderTrackLists();
  renderPlans();
  renderUnlockView();
  renderMoodWall();
  renderProgress(pos.time || 0);
})();
