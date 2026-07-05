/* =====================================================================
 * ALBUM APP TEMPLATE — album-config.js
 * =====================================================================
 * 這是「唯一需要為新專輯修改」的檔案。
 * index.html / styles.css / app.js 不含任何專輯資料，全部從這裡讀。
 *
 * 目前專輯：THE SKY（成晞 Chance）
 * ===================================================================== */

const ALBUM_CONFIG = {

  /* ---- 基本資料 ------------------------------------------------- */
  albumId: "the-sky",                              // 英文小寫-dash，作為此專輯的唯一 ID
  albumTitle: "THE SKY",                            // 中文全名（曲目頁、分享用）
  albumTitleEn: "THE SKY",                          // 封面上的英文斜體大標
  albumEyebrow: "AI FUTURE CONCEPT ALBUM",          // 封面最上方的小字（全大寫顯示）
  artistName: "成晞 Chance",                        // 藝人名（Media Session 鎖定畫面顯示）

  /* ---- 圖片（換封面就改這裡）------------------------------------ */
  coverImage: "assets/images/cover.png",           // 主封面（也是鎖定畫面 artwork，影片載入前的 fallback）
  coverVideo: "assets/video/cover.mp4",            // 選填：6 秒循環影片取代靜態封面（自動靜音播放）
  backgroundImage: "",                             // 選填：整頁背景圖，留空 = 用純色主題

  /* ---- 品牌配色（每張專輯的色系）-------------------------------- */
  theme: {
    bg:        "#07111F",                          // 全域背景（深藍黑，夜空/資料雲）
    bgTop:     "#102030",                          // 頁面頂部 radial 漸層的亮端
    surface:   "rgba(16,32,48,.55)",               // 玻璃卡片底色
    primary:   "#DDEBFF",                          // 主色（冷銀白藍）：標題、進度條、按鈕
    secondary: "#7FA6C9",                          // 次色（霧藍）：漸層中段
    accent:    "#AFC7F6",                          // 點綴（淡藍紫光）：漸層尾端
    text:      "#ffffff",
    muted:     "rgba(255,255,255,.62)",
    themeColor: "#07111F",                         // <meta name="theme-color">（iOS 狀態列）
    // 進度條圓點的角色標籤，依曲目單/雙數交替。
    progressDot: {
      labels:    ["SKY", "AI"],                     // [單數曲, 雙數曲]
      gradients: [
        "linear-gradient(135deg,#DDEBFF,#AFC7F6)", // 單數曲
        "linear-gradient(135deg,#7FA6C9,#AFC7F6)", // 雙數曲
      ],
    },
  },

  /* ---- 金流（Stripe Payment Links 在這裡換）--------------------- *
   * 目前只有 299 單一價位，還沒開典藏版（599 + WAV）。
   * deluxe 暫時設成跟 basic 一樣，避免頁面顯示兩種不同價格造成混淆；
   * 之後真的要做典藏版時，把 deluxePrice/stripeLinkDeluxe/wavDriveLink
   * 換成正式值，再把 worker.js 的 PROTECTED_WAV_FILES 填上就好。
   * ---------------------------------------------------------------- */
  payment: {
    stripeLinkBasic:  "https://buy.stripe.com/test_dRm14m8mUgKB6zR9Z96Na00",  // 數位版 NT$299
    stripeLinkDeluxe: "https://buy.stripe.com/test_dRm14m8mUgKB6zR9Z96Na00",  // 暫同數位版（尚未開典藏版）
    currency: "NT$",
    basicPrice: 299,
    deluxePrice: 299,
    basicName:  "數位專輯",
    deluxeName: "數位專輯",
    basicFeatures:  ["完整曲目線上聆聽", "不限次數隨時重播", "可加入手機主畫面"],
    deluxeFeatures: ["完整曲目線上聆聽", "不限次數隨時重播", "可加入手機主畫面"],
    deluxeBadge: "",
  },

  /* ---- 後端 API（Cloudflare Worker 網址在這裡換）----------------- */
  api: {
    workerBaseUrl: "https://the-sky-ost-api.anthonywen0693.workers.dev",
    wavDriveLink: "",                              // 還沒有典藏版 WAV，先留空
  },

  /* ---- 解鎖設定 -------------------------------------------------- */
  unlock: {
    // ⚠️ DEMO 模式測試碼，跟 worker.js 的 DEMO_CODES 對應。
    //    正式上線前記得兩邊都清空。
    demoCodes: { "SKY1DEMO": "299" },

    localStorageKey: "album-the-sky",              // 每張專輯必須唯一
    codePlaceholder: "SKY1-XXXX-XXXX",
  },

  /* ---- 曲目 -------------------------------------------------------
   * 01~03 免費試聽，04~10 付費（R2 key 用 sky/ 前綴）。
   * ⚠️ 05、08 是 WAV 原始檔（不是 mp3），protectedPath 副檔名要對，
   *    worker.js 的 PROTECTED_FILES 白名單也要用一樣的副檔名。
   * ---------------------------------------------------------------- */
  tracks: [
    { n: 1,  title: "Don't Wanna Wake Up", subtitle: "在夢境與現實崩塌之間，我仍不願醒來", free: true,  audioPath: "assets/audio/01.mp3", protectedPath: null,          lyricsPath: null,                   artwork: null },
    { n: 2,  title: "Painkiller",          subtitle: "用疼痛止住雜訊，讓情緒重新上線",     free: true,  audioPath: "assets/audio/02.mp3", protectedPath: null,          lyricsPath: "assets/lyrics/02.txt", artwork: null },
    { n: 3,  title: "Still Awake",         subtitle: "世界已經重啟，我卻還清醒著",         free: true,  audioPath: "assets/audio/03.mp3", protectedPath: null,          lyricsPath: null,                   artwork: null },
    { n: 4,  title: "Silent Flex",         subtitle: "不靠宣告，用結果完成低調反擊",       free: false, audioPath: null,                  protectedPath: "sky/04.mp3", lyricsPath: null,                   artwork: null },
    { n: 5,  title: "The SKY",             subtitle: "抬頭望向資料雲，找回最後的自由訊號", free: false, audioPath: null,                  protectedPath: "sky/05.wav", lyricsPath: null,                   artwork: null },
    { n: 6,  title: "怎麼在划船",           subtitle: "在資訊洪流裡，只能靠節奏向前",       free: false, audioPath: null,                  protectedPath: "sky/06.mp3", lyricsPath: null,                   artwork: null },
    { n: 7,  title: "無字天書",             subtitle: "沒有命運預先寫好，每一次選擇都在改寫故事", free: false, audioPath: null,            protectedPath: "sky/07.mp3", lyricsPath: "assets/lyrics/07.txt", artwork: null },
    { n: 8,  title: "爽到並軌",             subtitle: "慾望高速併線，快感與失控同時到達",   free: false, audioPath: null,                  protectedPath: "sky/08.wav", lyricsPath: null,                   artwork: null },
    { n: 9,  title: "無視",                 subtitle: "被世界忽略以後，反而聽見真正的自己", free: false, audioPath: null,                  protectedPath: "sky/09.mp3", lyricsPath: null,                   artwork: null },
    { n: 10, title: "I'm Sorry",           subtitle: "把所有訊號收回成一句來不及的道歉",   free: false, audioPath: null,                  protectedPath: "sky/10.mp3", lyricsPath: "assets/lyrics/10.txt", artwork: null },
  ],

  /* ---- 心情牆 ---------------------------------------------------- */
  moodWall: {
    heading: "SIGNAL WALL",
    subheading: "把沒被世界聽見的訊號，留在這裡。",
    eyebrow: "Leave your signal here",
    tags: ["失眠", "清醒", "抬頭看", "資料雲", "重新連線", "還在找訊號", "AI也懂", "抵達"],
    seedComments: [
      { name: "匿名訊號",   mood: "清醒",     text: "半夜聽 Still Awake，感覺自己還連著線。", time: "剛剛" },
      { name: "抬頭看的人", mood: "抬頭看",   text: "The SKY 這首每次聽都像在找一個訊號。",     time: "5 分鐘前" },
      { name: "AI也懂",     mood: "AI也懂",   text: "無字天書聽完覺得，故事真的是自己寫的。",   time: "20 分鐘前" },
    ],
  },

  /* ---- 寫真牆（滑動相簿，橫向 swipe 一次一張）--------------------- *
   * photos[].src 換成真正的照片檔（放 assets/images/gallery/），
   * 目前先用封面圖佔位，記得換成真的照片（檔名維持 01.jpg/02.jpg/03.jpg 即可）。
   * ---------------------------------------------------------------- */
  gallery: {
    heading: "GALLERY",
    subheading: "成晞 Chance · 寫真牆",
    photos: [
      { src: "assets/images/gallery/01.jpg", caption: "" },
      { src: "assets/images/gallery/02.jpg", caption: "" },
      { src: "assets/images/gallery/03.jpg", caption: "" },
    ],
  },

  /* ---- 介面文案 ---------------------------------------------------- */
  strings: {
    navTabs: ["聽歌", "完整版", "解鎖", "心情牆", "寫真牆"],
    nowPlayingLabel: "Now Playing",
    nextScene: "Next Signal",
    purchaseTitleEn: "Unlock the Album",
    unlockTitleEn: "Unlock",
    unlockSubtitle: "輸入序號解鎖完整版",
    lyricsLabel: "Lyrics",
    noLyrics: "這首歌暫時沒有歌詞",
  },
};

/* 讓 app.js 讀得到（不要動這行） */
window.ALBUM_CONFIG = ALBUM_CONFIG;
