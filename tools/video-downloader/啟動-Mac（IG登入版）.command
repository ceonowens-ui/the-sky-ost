#!/bin/bash
# IG 影片要登入才看得到時用這個：借用 Chrome 裡已登入的 IG（用 Safari 就把 chrome 改成 safari）
cd "$(dirname "$0")"
python3 -m pip install -q -U yt-dlp 2>/dev/null || python3 -m pip install -q -U --user yt-dlp
(sleep 1.5; open "http://localhost:8765") &
COOKIES_BROWSER=chrome python3 app.py
