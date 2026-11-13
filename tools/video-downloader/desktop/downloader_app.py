"""影片下載 —— 桌面版（Mac / Windows 雙擊就能用）

複製 YouTube 或 IG 的影片網址 → 按「貼上並下載」→ 影片存到「下載」資料夾。
打包時會一起放進 yt-dlp、ffmpeg、deno，使用者什麼都不用裝。
yt-dlp 會在背景自動更新（下次打開 App 生效），YouTube 改版也不怕。
"""
import os
import re
import shutil
import ssl
import subprocess
import sys
import threading
import urllib.request
import zipfile
from pathlib import Path

BASE = Path(getattr(sys, "_MEIPASS", Path(__file__).resolve().parent))
if sys.platform == "darwin":
    DATA = Path.home() / "Library" / "Application Support" / "VideoDownloader"
elif os.name == "nt":
    DATA = Path(os.environ.get("APPDATA", Path.home())) / "VideoDownloader"
else:
    DATA = Path.home() / ".video-downloader"
DATA.mkdir(parents=True, exist_ok=True)
DOWNLOADS = Path.home() / "Downloads"
DOWNLOADS.mkdir(exist_ok=True)


# ---------- yt-dlp：優先用自動更新過的新版，壞掉就退回內建版 ----------
def _drop_ytdlp_modules():
    for k in list(sys.modules):
        if k == "yt_dlp" or k.startswith("yt_dlp."):
            del sys.modules[k]


def load_ytdlp():
    for d in sorted(DATA.glob("yt-dlp-*"), reverse=True):
        sys.path.insert(0, str(d))
        try:
            import yt_dlp  # noqa: F401
            return yt_dlp, f"{d.name}（自動更新版）"
        except Exception:
            sys.path.remove(str(d))
            _drop_ytdlp_modules()
            shutil.rmtree(d, ignore_errors=True)
    import yt_dlp
    return yt_dlp, "內建版"


yt_dlp, YTDLP_SOURCE = load_ytdlp()
from yt_dlp.version import __version__ as YTDLP_VERSION  # noqa: E402


def ssl_ctx():
    try:
        import certifi
        return ssl.create_default_context(cafile=certifi.where())
    except Exception:
        return ssl.create_default_context()


def _ver(v):
    return tuple(int(x) for x in re.findall(r"\d+", v))


def auto_update():
    """背景下載最新版 yt-dlp，下次打開 App 時使用。失敗就算了，不影響使用。"""
    try:
        ctx = ssl_ctx()
        req = urllib.request.Request("https://github.com/yt-dlp/yt-dlp/releases/latest", method="HEAD")
        with urllib.request.urlopen(req, context=ctx, timeout=15) as r:
            latest = r.url.rstrip("/").rsplit("/", 1)[-1]
        if not re.fullmatch(r"\d{4}\.\d{2}\.\d{2}(\.\d+)?", latest) or _ver(latest) <= _ver(YTDLP_VERSION):
            return
        target = DATA / f"yt-dlp-{latest}"
        if target.exists():
            return
        tmp = DATA / "download.tmp"
        url = f"https://github.com/yt-dlp/yt-dlp/releases/download/{latest}/yt-dlp"
        with urllib.request.urlopen(url, context=ctx, timeout=60) as r, open(tmp, "wb") as f:
            shutil.copyfileobj(r, f)
        staging = DATA / "staging"
        shutil.rmtree(staging, ignore_errors=True)
        with zipfile.ZipFile(tmp) as z:
            z.extractall(staging)
        tmp.unlink()
        if (staging / "yt_dlp" / "__init__.py").exists():
            staging.rename(target)
            for old in DATA.glob("yt-dlp-*"):
                if old != target:
                    shutil.rmtree(old, ignore_errors=True)
    except Exception:
        pass


# ---------- 下載 ----------
def ffmpeg_path():
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        return shutil.which("ffmpeg")


def deno_path():
    p = BASE / ("deno.exe" if os.name == "nt" else "deno")
    return str(p) if p.exists() else shutil.which("deno")


def base_opts(progress=None):
    ff = ffmpeg_path()
    opts = {
        "outtmpl": str(DOWNLOADS / "%(title).80s [%(id)s].%(ext)s"),
        # 一定要有畫面：影片軌 + 聲音軌合併，或本來就有畫面+聲音的檔案。優先 H.264
        "format": "bv*+ba/b[vcodec!=none]/b" if ff else "b[vcodec!=none][ext=mp4]/b[vcodec!=none]/b",
        "format_sort": ["vcodec:h264", "acodec:aac", "res", "fps"],
        "merge_output_format": "mp4",
        "noplaylist": True,
        "windowsfilenames": True,
        "quiet": True,
        "no_warnings": True,
        "noprogress": True,
        "remote_components": ["ejs:github"],
    }
    if ff:
        opts["ffmpeg_location"] = ff
    deno = deno_path()
    if deno:
        opts["js_runtimes"] = {"deno": {"path": deno}}
    if progress:
        opts["progress_hooks"] = [progress]
    return opts


def needs_login(msg):
    low = msg.lower()
    return any(k in low for k in ("login", "log in", "logged-in", "cookies", "rate-limit", "rate limit",
                                  "not available", "sign in", "not a bot"))


def site_name(url):
    low = url.lower()
    if "instagram.com" in low:
        return "IG"
    if "youtube.com" in low or "youtu.be" in low:
        return "YouTube"
    return None


BROWSERS = ["chrome", "safari", "edge", "firefox", "brave"] if sys.platform == "darwin" else ["chrome", "edge", "firefox", "brave"]


NO_WINDOW = {"creationflags": 0x08000000} if os.name == "nt" else {}  # Windows 不跳出黑色視窗


def streams(path):
    """回傳 (影片格式, 有沒有聲音)。例如 ("h264", True)；沒有畫面時影片格式是 None。"""
    ff = ffmpeg_path()
    if not ff:
        return "unknown", True
    r = subprocess.run([ff, "-hide_banner", "-i", path], capture_output=True, text=True,
                       encoding="utf-8", errors="replace", **NO_WINDOW)
    video = None
    audio = False
    for line in r.stderr.splitlines():
        if "Stream #" not in line:
            continue
        if "Video:" in line and "attached pic" not in line and video is None:
            video = line.split("Video:", 1)[1].strip().split()[0].strip(",")
        elif "Audio:" in line:
            audio = True
    return video, audio


def to_h264(path, status=None):
    """把不是 H.264 的影片轉成 H.264 + AAC 的 mp4（所有電腦、手機、剪輯軟體都能開）。"""
    if status:
        status("轉成通用的 mp4 格式中…（影片越長越久）")
    src = Path(path)
    out = src.with_name(src.stem + ".converting.mp4")
    ff = ffmpeg_path()
    base = [ff, "-y", "-hide_banner", "-loglevel", "error", "-i", str(src), "-map", "0:v:0", "-map", "0:a:0?",
            "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart"]
    encoders = [["-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p"]]
    if sys.platform == "darwin":
        encoders.append(["-c:v", "h264_videotoolbox", "-b:v", "8M", "-pix_fmt", "yuv420p"])
    last = ""
    for enc in encoders:
        r = subprocess.run(base + enc + [str(out)], capture_output=True, text=True,
                           encoding="utf-8", errors="replace", **NO_WINDOW)
        if r.returncode == 0 and out.exists() and out.stat().st_size > 0:
            final = src.with_suffix(".mp4")
            src.unlink()
            out.replace(final)
            return str(final)
        last = r.stderr[-300:]
        out.unlink(missing_ok=True)
    raise RuntimeError("轉檔失敗：" + last)


def download(url, progress=None, status=None):
    """下載並確認是「有畫面、所有地方都能播」的 mp4。"""
    path = _download(url, progress, status)
    video, _ = streams(path)
    if video is None:
        # 只抓到聲音 → 改抓「本來就有畫面+聲音」的版本
        Path(path).unlink(missing_ok=True)
        if status:
            status("只抓到聲音，改抓有畫面的版本…")
        try:
            path = _download(url, progress, status, fmt="b[vcodec!=none]/bv*")
        except Exception:
            raise RuntimeError("NO_VIDEO")
        video, _ = streams(path)
        if video is None:
            Path(path).unlink(missing_ok=True)
            raise RuntimeError("NO_VIDEO")
    if video not in ("h264", "unknown") or not path.lower().endswith(".mp4"):
        path = to_h264(path, status)
    return path


def _download(url, progress=None, status=None, fmt=None):
    """回傳下載好的檔案路徑。IG / YouTube 要登入時，自動借用瀏覽器裡已登入的帳號再試一次。"""
    def run(extra):
        opts = base_opts(progress)
        if fmt:
            opts["format"] = fmt
        with yt_dlp.YoutubeDL({**opts, **extra}) as ydl:
            info = ydl.extract_info(url, download=True)
        if info.get("entries"):
            info = next(e for e in info["entries"] if e)
        reqs = info.get("requested_downloads") or []
        return reqs[0]["filepath"] if reqs else None

    try:
        return run({})
    except Exception as e:
        first = e
        site = site_name(url)
        if not site or not needs_login(str(e)):
            raise
    for b in BROWSERS:
        if status:
            status(f"{site} 要登入，借用 {b} 裡的登入再試一次…")
        try:
            return run({"cookiesfrombrowser": (b,)})
        except Exception:
            continue
    raise first


def friendly_error(e):
    msg = str(e)
    low = msg.lower()
    if msg == "NO_VIDEO":
        return "這個網址只有聲音、沒有影片畫面（可能是圖片貼文配音樂）。"
    if msg.startswith("轉檔失敗"):
        return "影片下載好了，但轉成通用格式時失敗。請截圖給開發者。"
    if "instagram" in low and needs_login(msg):
        return "IG 要登入才能看這支影片。\n請先用 Chrome 或 Safari 登入 IG，再按一次下載。"
    if "private" in low:
        return "這是私人影片，抓不到。"
    if "unsupported url" in low:
        return "這個網址不支援，請複製 YouTube 或 IG 的影片網址。"
    if "sign in to confirm" in low or "not a bot" in low:
        return "YouTube 要確認你不是機器人。\n請先用 Chrome 或 Safari 登入 YouTube，再按一次下載。"
    if "timed out" in low or "unable to download webpage" in low or "connection" in low:
        return "連不上網站，請檢查網路。"
    return "下載失敗。請關掉 App 再打開（會自動更新）後再試一次。"


def reveal(path):
    try:
        if sys.platform == "darwin":
            subprocess.Popen(["open", "-R", path] if path else ["open", str(DOWNLOADS)])
        elif os.name == "nt":
            subprocess.Popen(f'explorer /select,"{path}"' if path else f'explorer "{DOWNLOADS}"')
        else:
            subprocess.Popen(["xdg-open", str(DOWNLOADS)])
    except Exception:
        pass


# ---------- 自我測試（給打包流程用，不會開視窗） ----------
def selftest(out_file, urls):
    lines = [f"yt-dlp {YTDLP_VERSION} {YTDLP_SOURCE}", f"ffmpeg {ffmpeg_path()}", f"deno {deno_path()}"]
    ok = True
    for u in urls:
        try:
            p = download(u)
            size = os.path.getsize(p) if p and os.path.exists(p) else 0
            video, audio = streams(p)
            good = size > 0 and video == "h264" and p.endswith(".mp4")
            lines.append(f"{'OK  ' if good else 'BAD '} {u} -> {os.path.basename(p or '')} "
                         f"({size} bytes, video={video}, audio={audio})")
            ok = ok and good
        except Exception as e:
            lines.append(f"FAIL {u} -> {str(e)[:400]}")
            ok = False
    Path(out_file).write_text("\n".join(lines) + "\n", encoding="utf-8")
    return 0 if ok else 1


def converttest(out_file):
    """不用網路：做一支 VP9 影片，確認打包好的 ffmpeg 能轉成 H.264。"""
    work = DATA / "converttest"
    work.mkdir(exist_ok=True)
    src = work / "vp9.webm"
    ff = ffmpeg_path()
    subprocess.run([ff, "-y", "-loglevel", "error", "-f", "lavfi", "-i", "testsrc=size=640x360:rate=25",
                    "-f", "lavfi", "-i", "sine=frequency=440", "-t", "2", "-c:v", "libvpx-vp9", "-c:a", "libopus",
                    str(src)], check=True, **NO_WINDOW)
    before = streams(str(src))
    out = to_h264(str(src))
    after = streams(out)
    good = after == ("h264", True)
    Path(out_file).write_text(f"{'OK' if good else 'BAD'} convert {before} -> {after}\n", encoding="utf-8")
    return 0 if good else 1


# ---------- 視窗 ----------
def gui():
    import tkinter as tk
    from tkinter import ttk

    root = tk.Tk()
    root.title("影片下載")
    root.geometry("460x300")
    root.minsize(400, 280)

    frm = ttk.Frame(root, padding=24)
    frm.pack(fill="both", expand=True)
    ttk.Label(frm, text="影片下載", font=("", 22, "bold")).pack(anchor="w")
    ttk.Label(frm, text="複製 YouTube 或 IG 的影片網址，再按下面的按鈕。", foreground="gray").pack(anchor="w", pady=(2, 16))

    style = ttk.Style()
    style.configure("Big.TButton", font=("", 16, "bold"), padding=(10, 12))
    url_var = tk.StringVar()
    status_var = tk.StringVar(value="影片會存到「下載」資料夾。")
    last = {"path": None, "busy": False}

    def set_status(text):
        root.after(0, status_var.set, text)

    def progress(d):
        if d.get("status") == "downloading":
            total = d.get("total_bytes") or d.get("total_bytes_estimate")
            if total:
                set_status(f"下載中… {d.get('downloaded_bytes', 0) * 100 // total}%")
        elif d.get("status") == "finished":
            set_status("整理檔案中…")

    def done(path, err):
        last["busy"] = False
        btn.state(["!disabled"])
        if err:
            status_var.set("✗ " + friendly_error(err))
        else:
            last["path"] = path
            status_var.set("✓ 完成！影片已存到「下載」資料夾")
            url_var.set("")
            reveal(path)

    def start(url):
        url = url.strip()
        if last["busy"]:
            return
        if not url.startswith(("http://", "https://")):
            status_var.set("✗ 剪貼簿裡沒有影片網址。請先在 YouTube / IG 按「分享 → 複製連結」。")
            return
        url_var.set(url)
        last["busy"] = True
        btn.state(["disabled"])
        status_var.set("準備中…")

        def work():
            try:
                p = download(url, progress, set_status)
                root.after(0, done, p, None)
            except Exception as e:
                root.after(0, done, None, e)

        threading.Thread(target=work, daemon=True).start()

    def paste_and_go():
        try:
            clip = root.clipboard_get()
        except tk.TclError:
            clip = ""
        m = re.search(r"https?://\S+", clip)
        start(m.group(0) if m else url_var.get())

    btn = ttk.Button(frm, text="貼上並下載", style="Big.TButton", command=paste_and_go)
    btn.pack(fill="x")
    entry = ttk.Entry(frm, textvariable=url_var)
    entry.pack(fill="x", pady=(12, 0))
    entry.bind("<Return>", lambda e: start(url_var.get()))
    ttk.Label(frm, textvariable=status_var, wraplength=400, justify="left").pack(anchor="w", pady=(12, 0))
    ttk.Button(frm, text="打開下載資料夾", command=lambda: reveal(last["path"])).pack(anchor="w", side="bottom")

    threading.Thread(target=auto_update, daemon=True).start()
    root.lift()
    root.attributes("-topmost", True)
    root.after(300, lambda: root.attributes("-topmost", False))
    root.mainloop()


if __name__ == "__main__":
    if len(sys.argv) == 3 and sys.argv[1] == "--converttest":
        sys.exit(converttest(sys.argv[2]))
    if len(sys.argv) >= 3 and sys.argv[1] == "--selftest":
        sys.exit(selftest(sys.argv[2], sys.argv[3:]))
    gui()
