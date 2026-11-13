#!/bin/bash
cd "$(dirname "$0")"
python3 -m pip install -q -U yt-dlp 2>/dev/null || python3 -m pip install -q -U --user yt-dlp
(sleep 1.5; open "http://localhost:8765") &
python3 app.py
