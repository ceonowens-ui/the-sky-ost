# 影片下載（YouTube / Instagram）

## 下載 App（什麼都不用裝）
到 https://github.com/ceonowens-ui/the-sky-ost/releases/tag/video-downloader 下載：

| 你的電腦 | 下載這個 |
|---|---|
| Mac（2020 年後買的，大多是這個） | `影片下載-Mac-M晶片.zip` |
| 比較舊的 Mac（Intel） | `影片下載-Mac-Intel.zip` |
| Windows | `影片下載-Windows.exe` |

> 不知道 Mac 是哪種？左上角  →「關於這台 Mac」，看到「晶片 Apple M…」就是 M 晶片。

## 第一次打開（只有第一次要做）
因為這個 App 沒有付錢給 Apple / 微軟認證，第一次會被擋一下：

**Mac**
1. 雙擊下載的 zip，會變出「影片下載」App，把它拖到「應用程式」資料夾。
2. 雙擊打開 → 出現「無法打開」→ 按「完成」。
3. 打開「系統設定」→「隱私權與安全性」→ 拉到最下面 → 按「強制打開」→ 輸入密碼。

**Windows**
1. 雙擊 `影片下載-Windows.exe`。
2. 出現藍色「Windows 已保護您的電腦」→ 按「其他資訊」→「仍要執行」。

之後就跟一般 App 一樣，雙擊就開。

## 每次用
1. 在 YouTube / IG 按「分享」→「複製連結」。
2. 打開「影片下載」App，按 **貼上並下載**。
3. 好了。影片在「下載」資料夾，App 會自動幫你打開它。

## 小問題
- **IG 說要登入**：先用 Chrome 或 Safari 登入 IG，再按一次。App 會自動借用登入（Mac 可能跳出鑰匙圈詢問，按「允許」）。
- **YouTube 突然不能下**：關掉 App 再打開。App 會在背景自動更新。
- 影片格式是 mp4（H.264），iPhone、剪映、Premiere、Final Cut 都能直接用。
- 只下載你有權使用的影片（自己的、或拿到授權的）。

---
開發者用：`app.py` 是網頁版（`python3 app.py`），`desktop/` 是桌面 App 原始碼，
推到分支後 GitHub Actions（`.github/workflows/video-downloader.yml`）會自動打包並更新 Release。
