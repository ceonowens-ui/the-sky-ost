@echo off
cd /d "%~dp0"
python -m pip install -q -U yt-dlp
start "" http://localhost:8765
python app.py
pause
