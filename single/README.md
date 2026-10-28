# chance-single：單曲卡只解鎖《I'm Sorry》（只在 test.html，未轉正）

持卡者點 Wallet 卡的聽歌 → `https://chance1228.com/test.html?album=the-sky&track=1#single=<鑰匙>`（test.html 的 track 是曲號）。
test.html `<head>` 最早的 script 存下鑰匙、從網址拿掉；開機時問 `chance-single /single/check`，
通過才把 THE SKY 第 1 首（`sky/03.mp3`）解鎖，音檔改走 `/single/track`。其他曲目、下載、收藏、付費內容不變，其他兩首仍是 30 秒試聽。
⚠️ 正式首頁 index.html 沒有這段。CÉON 說「轉正」前不得改 index.html 或推 main。

- 不碰 `the-sky-ost-api`、`the-sky-audio`、會員 Email＋兌換碼。已完整解鎖的會員照原路徑播放。
- `cards.js` 只有 SHA-256；鑰匙只在卡片裡，私人鑰匙檔在 `outputs/CHANCE_single_private/keys.json`（不進 repo）。
- 卡片被轉給別人，對方也能聽；這是持卡＝有權的取捨。

## 路由

| 路由 | 說明 |
| --- | --- |
| `GET /single/health` | 開關狀態、已發卡數 |
| `GET /single/check?k=` | 有效回 `{ok, edition, track}`，否則 401 |
| `GET/HEAD /single/track?k=` | 串流 `im-sorry.mp3`，支援 Range 206 |

## 發卡

```bash
python3 outputs/chance-wallet/scripts/issue_single_cards.py --edition 1 \
  --base outputs/CHANCE-IM-SORRY-D-001-050-listen-im-sorry.pkpass \
  --keys outputs/CHANCE_single_private/keys.json \
  --cards-js work/the-sky-ost/single/cards.js \
  --output outputs/CHANCE-IM-SORRY-single-001-050.pkpass
```

卡面用 D-FULL 滿版（D 內容完整，背景延伸到整張 Wallet 畫布）：先算圖再發卡，每一號都要算（編號畫在圖上）。

```bash
python3 outputs/chance-wallet/scripts/render_full_bleed.py --edition 2 --output outputs/CHANCE_D-FULL_art/002
python3 outputs/chance-wallet/scripts/issue_single_cards.py --edition 2 --art outputs/CHANCE_D-FULL_art/002 --design D-FULL \
  --base outputs/CHANCE-IM-SORRY-single-001-050-full.pkpass --keys outputs/CHANCE_single_private/keys.json \
  --cards-js work/the-sky-ost/single/cards.js --output outputs/CHANCE-IM-SORRY-single-002-050.pkpass
```

發新卡後要重新部署 Worker，`cards.js` 才生效。同一號重發（例如換卡面）沿用原鑰匙與序號，`cards.js` 不變、不用重新部署。

## 部署（本人操作）

1. Cloudflare R2 建 `chance-single-audio`，上傳《I'm Sorry》音檔，檔名 `im-sorry.mp3`（與 `the-sky-audio/sky/03.mp3` 同一首）。
2. `cd single && npx wrangler deploy -c ./wrangler.jsonc`，確認網址是 `https://chance-single.anthonywen0693.workers.dev`。
   ⚠️ 一定要帶 `-c ./wrangler.jsonc`：不帶的話 wrangler 會讀到 repo 根目錄的 `wrangler.json`（正式 `the-sky-ost-api`）。部署前先 `--dry-run` 看綁定只有 `chance-single-audio`。
3. `curl https://chance-single.anthonywen0693.workers.dev/single/health` → `enabled: true, cards: 1`。
4. test.html 推上 GitHub（測試頁；index.html 不動，轉正另議）。
5. iPhone 加入新 001 卡 → 點聽歌 → 應顯示「I'm Sorry」並能播放；其他兩首仍是 Unlock。

## 停用與回滾

- 緊急停用：`wrangler.jsonc` 的 `SINGLE_ENABLED` 改 `off` 重新部署，所有卡立即失效，首頁回到鎖定。
- 作廢單張：`SINGLE_VOID` 加卡號（例 `"007"`）重新部署。
- test.html 回滾：revert 這次 commit；沒有鑰匙的訪客行為本來就不變。

## 測試

`node single/test.mjs <001 的鑰匙>`：假 R2，20 項（鑰匙錯一碼、未發卡號、051、開關、作廢、Range/416/HEAD、只有一首、CORS）。
