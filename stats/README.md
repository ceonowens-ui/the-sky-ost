# the-sky-stats · 匿名使用統計（S1）

- `worker.js`：獨立 Worker。POST /ev 收前端埋點；GET /report?key=REPORT_KEY&days=30 給 stats-report.html；GET /health。
- D1：`the-sky-stats`（id 952c6812-59b3-452e-91d8-4b7401cbcf59，APAC；表 events 已建）。
- 前端：`stats-track.js`（只在 test.html 的 <head> 載入）；報表頁 `stats-report.html`。
- 不碰 the-sky-ost-api、金流、解鎖；不收 email／兌換碼／IP／GPS。

## 部署（Dashboard，CÉON 按 Deploy）
1. Workers & Pages → Create → Create Worker → 名稱 `the-sky-stats` → Deploy（先部署預設的 hello world）
2. Edit code → 整份貼上 `worker.js` → Deploy
3. Settings → Bindings → Add → D1 database：Variable name `DB`、Database `the-sky-stats`
4. Settings → Variables and Secrets → Add → Secret：`REPORT_KEY` ＝ 自己想一組（給看報表的人）
5. 檢查：https://the-sky-stats.anthonywen0693.workers.dev/health → {"ok":true,"db":true,"key":true}

## 或用 wrangler
cd stats && npx wrangler deploy && npx wrangler secret put REPORT_KEY
