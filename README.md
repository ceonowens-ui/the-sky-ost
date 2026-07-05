# THE SKY — Album App

成晞 Chance《THE SKY》數位專輯播放器（基於 Album App Template）

可重複套用的付費數位專輯 / OST 播放器模板。
以《秘密關係》Secret Lover 實測過的版本為基礎，抽掉所有硬寫死的資料。
**換一張新專輯 = 只改 `album-config.js` + 換 assets + 更新 `worker.js` 白名單。**

## 檔案結構（可直接推上 GitHub）

```
/index.html            靜態骨架（不含專輯資料，不用改）
/styles.css            視覺（顏色全走 CSS 變數，不用改）
/app.js                引擎（完全從 ALBUM_CONFIG 讀，不用改）
/album-config.js       ★ 專輯資料，換專輯只改這裡
/worker.js             Cloudflare Worker（部署到 CF，不放 GitHub Pages 也可以，
                       但放著沒關係 —— 裡面沒有 secret）
/assets/images/        cover.png（封面）、bg.jpg（選用背景）
/assets/audio/         ⚠️ 只放「免費試聽曲」！01.mp3、02.mp3
/assets/lyrics/        01.txt、02.txt…（純文字歌詞，選用）
```

## 音檔安全規則（最重要）

| 曲目 | 放哪裡 | 原因 |
|------|--------|------|
| 免費試聽（`free:true`） | `assets/audio/`，跟著 repo 公開部署 | 本來就要給人聽 |
| 付費曲（`free:false`） | **Cloudflare R2 私有 bucket**，key 如 `os3/03.mp3` | 直接放前端 = 全部免費 |
| WAV 無損 | R2 `os3/wav/NN.wav` | 僅典藏版可下載 |

付費曲播放流程：前端 → `Worker /track?file=os3/03.mp3&email=…&code=…`
→ Worker 對 KV 驗證 email+code → 從 R2 串流（支援 Range/206，iPhone 必要）。

`localStorage` 的解鎖狀態只是前端顯示；真正的把關在 Worker，每次請求都重新驗證。

## 換新專輯 Checklist

1. `album-config.js`：albumId、標題、藝人、theme 配色、tracks、字串
2. `assets/`：cover.png、免費曲 mp3、歌詞 txt
3. 付費曲 mp3（+WAV）上傳到 R2，`protectedPath` 填 R2 key
4. `worker.js` → `WORKER_CONFIG`：專輯名、碼前綴、**PROTECTED_FILES 白名單**、價位門檻
5. Stripe 建兩條 Payment Link → 填進 `payment.stripeLinkBasic/Deluxe`
6. Stripe webhook 指到 `https://你的worker/stripe-webhook`，secret 設進環境變數
7. `unlock.localStorageKey` 換成新專輯專屬（避免留言/解鎖狀態互相污染）
8. 部署（見下）

### 四個識別字必須完全一致（實測踩過的雷）

```
前端 tracks[].protectedPath  ==  Worker PROTECTED_FILES  ==  R2 object key
（例：全部都是 "os3/03.mp3"，含資料夾前綴）
```

## 部署

### 前端（GitHub Pages / Cloudflare Pages / Netlify 皆可）
把整個資料夾（除了 worker.js 可留可不留）推上 repo，開 Pages。
Push 後 rebuild 可能要 1–8 分鐘，驗證時加 `?cb=時間戳` 避免 CDN 快取；
手機測試用**無痕視窗**。

### 後端（Cloudflare Worker）
1. 建 Worker，貼上 `worker.js`
2. 綁定：KV namespace `CODES`、R2 bucket `AUDIO`
3. 環境變數：`STRIPE_WEBHOOK_SECRET`、`RESEND_API_KEY`、`RESEND_FROM`、`ALLOWED_ORIGINS`
4. Resend：**驗證自己的網域**（SPF/DKIM），否則只能寄給自己帳號的 email
5. Stripe Dashboard → Webhooks → 加 `checkout.session.completed` 指到 `/stripe-webhook`

## Demo 模式 vs 正式版

|  | Demo | 正式 |
|--|------|------|
| 兌換碼 | 前端 `unlock.demoCodes`（LOVE=數位版、SECRET=典藏版，email 填 test@test.com） | Worker `/verify` 對 KV 驗證，碼綁購買 email |
| 上線前 | — | 前端 `demoCodes: {}`、Worker `DEMO_CODES: {}` 兩邊都清空 |

## iPhone 鐵則（違反任一條 Safari 就壞）

1. 每個 `backdrop-filter` 都同時有 `-webkit-backdrop-filter`
2. `viewport-fit=cover` + `env(safe-area-inset-*)` + `100dvh`
3. 播放用 `audio.src + audio.play()`（同一手勢 tick），**不要** fetch→Blob
4. Worker `/track` 必須支援 Range（206）
5. 一定要用真 iPhone Safari（無痕）測，不要只看桌機

## 未來擴充（架構已預留）

- `strings` 整組換掉 = 多語系入口
- config 底部預留 photocards / supporterWall / emailList 欄位
- `app.js` 歌詞 fetch 處已標記同步歌詞（LRC）擴充點
- 多專輯：每張專輯一個資料夾（各自的 config + assets），Worker 可共用
  （PROTECTED_FILES 用不同前綴區分，如 `album2/03.mp3`）
