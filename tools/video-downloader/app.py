#!/usr/bin/env python3
"""IG / YouTube 影片下載器 —— 貼網址，按下載，就這樣。

在自己電腦上跑：python3 app.py，然後打開 http://localhost:8765
需要：pip install -U yt-dlp（有裝 ffmpeg 的話 YouTube 可以下到最高畫質）
"""
import json
import os
import shutil
import socket
import tempfile
import threading
import time
import uuid
import zipfile
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, quote, urlparse

try:
    import yt_dlp
except ImportError:
    raise SystemExit("還沒裝 yt-dlp，請先執行：pip install -U yt-dlp")

PORT = int(os.environ.get("PORT", "8765"))
WORK = Path(tempfile.gettempdir()) / "video-downloader"
WORK.mkdir(exist_ok=True)
HAS_FFMPEG = shutil.which("ffmpeg") is not None
# IG 有些影片要登入才看得到：設定 COOKIES_BROWSER=chrome（或 safari / edge / firefox）
# 就會借用你瀏覽器裡已登入的 IG。
COOKIES_BROWSER = os.environ.get("COOKIES_BROWSER", "").strip()

PAGE = r"""<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>影片下載</title>
<style>
  :root { --bg:#f5f5f7; --card:#fff; --text:#1d1d1f; --muted:#6e6e73; --line:#d2d2d7; --accent:#0071e3; --err:#d70015; }
  @media (prefers-color-scheme: dark) {
    :root { --bg:#000; --card:#1c1c1e; --text:#f5f5f7; --muted:#98989d; --line:#3a3a3c; --accent:#0a84ff; --err:#ff453a; }
  }
  * { box-sizing:border-box; }
  body { margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center;
         background:var(--bg); color:var(--text); font:16px/1.5 -apple-system,BlinkMacSystemFont,"PingFang TC","Noto Sans TC",sans-serif; padding:16px; }
  main { width:100%; max-width:560px; }
  h1 { font-size:22px; margin:0 0 4px; }
  p.sub { margin:0 0 20px; color:var(--muted); font-size:14px; }
  form { display:flex; gap:8px; }
  input { flex:1; min-width:0; padding:14px 16px; font-size:16px; border:1px solid var(--line); border-radius:12px;
          background:var(--card); color:var(--text); outline:none; }
  input:focus { border-color:var(--accent); }
  button { padding:0 22px; font-size:16px; font-weight:600; border:0; border-radius:12px; background:var(--accent); color:#fff; cursor:pointer; white-space:nowrap; }
  button:disabled { opacity:.5; cursor:default; }
  #status { margin-top:16px; min-height:24px; font-size:15px; }
  #status.err { color:var(--err); }
  .spin { display:inline-block; width:14px; height:14px; border:2px solid var(--line); border-top-color:var(--accent);
          border-radius:50%; animation:r .8s linear infinite; vertical-align:-2px; margin-right:8px; }
  @keyframes r { to { transform:rotate(360deg); } }
  footer { margin-top:40px; font-size:13px; color:var(--muted); }
  footer a { color:var(--accent); }
</style>
</head>
<body>
<main>
  <h1>影片下載</h1>
  <p class="sub">貼上 YouTube 或 Instagram 的影片網址，按下載。</p>
  <form id="f">
    <input id="url" type="url" placeholder="https://www.instagram.com/reel/…" autocomplete="off" autofocus required>
    <button id="go" type="submit">下載</button>
  </form>
  <div id="status"></div>
  <footer>
    一鍵小技巧：把這個 <a id="bm" href="#">⬇ 下載這支影片</a> 拖到書籤列。之後在 YouTube / IG 影片頁按一下書籤就會直接下載。
  </footer>
</main>
<script>
  const f = document.getElementById('f'), input = document.getElementById('url'),
        go = document.getElementById('go'), status = document.getElementById('status');

  function show(html, err) { status.innerHTML = html; status.className = err ? 'err' : ''; }

  async function download(url) {
    go.disabled = true;
    show('<span class="spin"></span>處理中…（長影片會比較久）');
    try {
      const r = await fetch('/api/fetch', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ url }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || '下載失敗');
      location.href = '/file?t=' + d.token;
      show('✓ 完成，檔案開始下載了');
      input.value = '';
    } catch (e) {
      show(e.message, true);
    } finally {
      go.disabled = false;
      input.focus();
    }
  }

  f.addEventListener('submit', e => { e.preventDefault(); download(input.value.trim()); });

  // 貼上網址後自動開始
  input.addEventListener('paste', () => setTimeout(() => {
    if (/^https?:\/\//.test(input.value.trim())) download(input.value.trim());
  }, 0));

  // 書籤：http://localhost:8765/?url=影片網址 會自動下載
  document.getElementById('bm').href =
    "javascript:location.href='" + location.origin + "/?url='+encodeURIComponent(location.href)";
  const q = new URLSearchParams(location.search).get('url');
  if (q) { input.value = q; history.replaceState(null, '', '/'); download(q); }
</script>
</body>
</html>
"""

READY = {}  # token -> (檔案路徑, 下載檔名, 建立時間)
LOCK = threading.Lock()


def fetch(url: str) -> str:
    job = WORK / uuid.uuid4().hex
    job.mkdir()
    opts = {
        "outtmpl": str(job / "%(title).80s.%(ext)s"),
        "format": "bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]/bv*+ba/b" if HAS_FFMPEG else "b[ext=mp4]/b",
        "merge_output_format": "mp4",
        "noplaylist": True,
        "quiet": True,
        "no_warnings": True,
        "restrictfilenames": False,
        "windowsfilenames": True,
    }
    if COOKIES_BROWSER:
        opts["cookiesfrombrowser"] = (COOKIES_BROWSER,)
    try:
        with yt_dlp.YoutubeDL(opts) as ydl:
            ydl.download([url])
    except Exception:
        shutil.rmtree(job, ignore_errors=True)
        raise

    files = [p for p in job.iterdir() if p.is_file() and not p.name.endswith((".part", ".ytdl"))]
    if not files:
        shutil.rmtree(job, ignore_errors=True)
        raise RuntimeError("沒有抓到影片")
    if len(files) == 1:
        path, name = files[0], files[0].name
    else:  # IG 多張貼文：打包成 zip
        path = job / "videos.zip"
        with zipfile.ZipFile(path, "w") as z:
            for f in files:
                z.write(f, f.name)
        name = "videos.zip"

    token = uuid.uuid4().hex
    with LOCK:
        READY[token] = (path, name, time.time())
    return token


def friendly_error(e: Exception) -> str:
    msg = str(e)
    low = msg.lower()
    if "instagram" in low and ("login" in low or "cookies" in low or "rate" in low):
        return "IG 要求登入才能看這支影片。請用「啟動（IG 登入版）」重開，或確認是公開帳號。"
    if "private" in low:
        return "這是私人影片，抓不到。"
    if "unsupported url" in low:
        return "這個網址不支援，請貼 YouTube 或 IG 的影片連結。"
    if "sign in to confirm" in low:
        return "YouTube 要求驗證，請更新 yt-dlp（pip install -U yt-dlp）後再試。"
    if "unable to download" in low or "timed out" in low or "connection" in low:
        return "連不上網站，請檢查網路，或確認網址打得對。"
    print("下載失敗：", msg)
    return "下載失敗。可能網址不對，或 yt-dlp 需要更新（關掉再重新雙擊啟動檔就會自動更新）。"


def cleanup_loop():
    while True:
        time.sleep(300)
        cutoff = time.time() - 3600
        with LOCK:
            for t, (p, _, ts) in list(READY.items()):
                if ts < cutoff:
                    READY.pop(t, None)
        for d in WORK.iterdir():
            try:
                if d.stat().st_mtime < cutoff:
                    shutil.rmtree(d, ignore_errors=True)
            except FileNotFoundError:
                pass


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        pass

    def send_json(self, code, obj):
        body = json.dumps(obj, ensure_ascii=False).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        u = urlparse(self.path)
        if u.path == "/":
            body = PAGE.encode()
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        if u.path == "/file":
            token = parse_qs(u.query).get("t", [""])[0]
            with LOCK:
                item = READY.pop(token, None)
            if not item or not item[0].exists():
                self.send_error(404, "File expired")
                return
            path, name, _ = item
            self.send_response(200)
            self.send_header("Content-Type", "application/octet-stream")
            self.send_header("Content-Length", str(path.stat().st_size))
            self.send_header("Content-Disposition", f"attachment; filename=\"video.mp4\"; filename*=UTF-8''{quote(name)}")
            self.end_headers()
            try:
                with open(path, "rb") as f:
                    shutil.copyfileobj(f, self.wfile, 1024 * 1024)
            except (BrokenPipeError, ConnectionResetError):
                pass
            finally:
                shutil.rmtree(path.parent, ignore_errors=True)
            return
        self.send_error(404)

    def do_POST(self):
        if self.path != "/api/fetch":
            self.send_error(404)
            return
        try:
            data = json.loads(self.rfile.read(int(self.headers.get("Content-Length", 0))) or b"{}")
            url = (data.get("url") or "").strip()
            if not url.startswith(("http://", "https://")):
                self.send_json(400, {"error": "請貼上完整網址（https:// 開頭）"})
                return
            self.send_json(200, {"token": fetch(url)})
        except Exception as e:
            self.send_json(500, {"error": friendly_error(e)})


def lan_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except OSError:
        return None


if __name__ == "__main__":
    threading.Thread(target=cleanup_loop, daemon=True).start()
    server = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    print(f"\n  影片下載器已啟動 → http://localhost:{PORT}")
    ip = lan_ip()
    if ip:
        print(f"  同一個 Wi-Fi 的手機可開 → http://{ip}:{PORT}")
    if not HAS_FFMPEG:
        print("  （沒偵測到 ffmpeg：YouTube 最高只能下到 720p，裝了 ffmpeg 可下最高畫質）")
    print("  關掉這個視窗就會停止。\n")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
