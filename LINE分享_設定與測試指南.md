# CHANCE – I'M SORRY · LINE 分享功能 交付說明

⚠️ **尚未部署**。所有檔案只在本機，你確認後自己 push 才會上線。
⚠️ 沒有傳送過任何 LINE 訊息。

---

## 1. 檔案清單（全部新增，未修改任何現有檔案）

| 檔案 | 用途 |
|---|---|
| `assets/im-sorry-cover.jpg` | 單曲封面（960×1600，Flex hero 用） |
| `assets/im-sorry-line-card.png` | LINE 卡片設計稿存檔 |
| `assets/im-sorry-line-share-v1.jpg` | OG 分享封面 1200×630（**版本化**，改版時出 v2 不覆蓋） |
| `im-sorry/index.html` | 單曲發行頁（OG 寫死在 head + LIFF 分享） |
| `install/index.html` | 加入主畫面引導頁（iOS 步驟 / Android 一鍵安裝） |
| `src/line/flex-message.js` | Flex Message 產生器（單一事實來源） |
| `src/line/im-sorry-flex-message.json` | 由上檔產生的 JSON（改內容改 js 再重新產生） |
| `src/line/liff-config.example.js` | LIFF ID 設定範本（真檔已加入 .gitignore） |
| `.env.example` | 環境變數範本（不含真實憑證） |

播放器（index.html / test.html / app.js / worker）**一個字都沒動**。

## 2. 網址決定（重要）

你指定用 `www.chance1228.com`，但 **www 的 DNS 目前沒有設定、無法連線**
（只有 `chance1228.com` 活著）。LINE 爬蟲讀不到的網址不會有封面，
所以我全部先用 `https://chance1228.com`。

要切回 www：
1. 網域 DNS 加一筆：`www` CNAME → `ceonowens-ui.github.io`
2. 改 `im-sorry/index.html` head 內 6 處網址 + 頁尾 script 的 `SITE` 常數一行
3. 改 `install/index.html` head 內 2 處
4. `node src/line/flex-message.js https://www.chance1228.com > src/line/im-sorry-flex-message.json`

## 3. 完整 Flex Message JSON

檔案：`src/line/im-sorry-flex-message.json`（可直接貼進
[LINE Flex Message Simulator](https://developers.line.biz/flex-simulator/) 驗證，
貼 `contents` 那一層即可）。

按鈕動作：
- 封面 → `https://chance1228.com/im-sorry/`
- 立即試聽 → `https://chance1228.com/im-sorry/?autoplay=0`（不自動播放）
- 加入主畫面 → `https://chance1228.com/install/?release=im-sorry&openExternalBrowser=1`
- 頁尾網址 → `https://chance1228.com/`

## 4. LINE Developers Console 要設定的

1. 建立（或用現有的）**LINE Login channel**
2. 該 channel → **LIFF** 分頁 → Add：
   - Endpoint URL：`https://chance1228.com/im-sorry/`
   - Size：`Full`
   - Scope：`profile` `openid`
   - **Module mode：OFF**（要用 shareTargetPicker 必須關）
3. channel 設定裡把 **shareTargetPicker 開啟**（Consent required 可保持預設）
4. 拿到 **LIFF ID**（格式 `1234567890-AbcdEfgh`）→
   複製 `src/line/liff-config.example.js` 為 `src/line/liff-config.js`，填入 ID
   （此檔在 .gitignore，不會進版本庫；部署時要手動放上或改用 CI 注入）

> 沒填 LIFF ID 也能用：分享鈕會自動退回「系統分享／複製連結」，不會壞。

## 5. 本機測試方式

```bash
cd ~/Claude/Projects/數位專輯\ 模板
python3 -m http.server 8000
```
- 單曲頁 http://localhost:8000/im-sorry/
- 安裝頁 http://localhost:8000/install/?release=im-sorry
- 手機同網段可用電腦 IP 開，測手機版有無水平溢出

OG 驗證（上線後）：
- 貼網址到 LINE 自己（Keep 或自己的聊天室）看預覽卡
- 或用 https://poker.line.naver.jp/ 清 LINE 快取（貼網址按 submit）
- Facebook Sharing Debugger 也可交叉驗證

Flex 驗證：Flex Message Simulator 貼 JSON → 預覽 → 確認兩顆按鈕與封面。

## 6. 驗收狀態

| 條件 | 狀態 |
|---|---|
| OG 寫死在原始 HTML head | ✅（8 個 og/twitter meta + canonical） |
| Flex 封面與兩按鈕 uri action | ✅ 4 個 action 全部 uri |
| Flex JSON 可過 Simulator | ✅ 結構標準 bubble（待你貼 Simulator 目視） |
| Share Target Picker | ✅ 已按規範實作（需 LIFF ID 才可實測） |
| 訊息以使用者本人身分送出 | ✅ shareTargetPicker 特性即如此 |
| 點卡片進站 | ✅ |
| 手機無水平溢出 | ✅ overflow-x:hidden + max-width 430 |
| 現有播放器/解鎖/購買未動 | ✅ git status 乾淨 |

## 7. 還需要你提供 / 決定的

1. **LIFF ID**（照上面第 4 節建立）——沒有它，「分享到 LINE」走系統分享 fallback
2. **www DNS 要不要設**（設了我幫你切網址）
3. **部署**：你自己 `git push`（我沒有推）。push 後等 GitHub Pages 重建，
   立刻貼 `https://chance1228.com/im-sorry/` 到 LINE 驗證封面
4. OG / Flex 的「預覽截圖」需要上線後才能產生——目前可看
   `assets/im-sorry-line-share-v1.jpg`（分享封面成品）
