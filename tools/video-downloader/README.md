# 影片下載器（YouTube / Instagram）

貼網址 → 按下載 → 影片存進電腦。沒有別的功能。

## 第一次（只要做一次）
1. 裝 Python 3：https://www.python.org/downloads/
2. （建議）裝 ffmpeg，YouTube 才能下到最高畫質：Mac 終端機打 `brew install ffmpeg`
   - 沒裝也能用，只是 YouTube 最高 720p。

## 每次用
- **Mac**：雙擊 `啟動-Mac.command`（第一次若被擋：右鍵 → 打開）
- **Windows**：雙擊 `啟動-Windows.bat`

瀏覽器會自動打開 http://localhost:8765 ，貼上網址就會自己開始下載。

## 一鍵下載（書籤）
網頁下面有一個「⬇ 下載這支影片」，把它拖到書籤列。
之後在 YouTube / IG 影片頁按一下這個書籤就直接下載（下載器要先開著）。

## 手機用
電腦開著下載器時，同一個 Wi-Fi 的手機打開終端機視窗上顯示的 `http://192.168.x.x:8765` 就能用。

## 下載失敗？
- **IG 說要登入**：先在 Chrome 登入 IG，改用 `啟動-Mac（IG登入版）.command`。
- **YouTube 突然不能下**：YouTube 常常改版，重新啟動一次就會自動更新 yt-dlp。
- 私人帳號 / 私人影片抓不到。

> 只下載你有權使用的影片（自己的、或拿到授權的）。
