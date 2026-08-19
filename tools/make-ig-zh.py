#!/usr/bin/env python3
"""
Chinese I'M SORRY share card, sized for Instagram so nothing gets cropped.

Outputs (card centred on a safe-margin canvas):
  assets/share/im-sorry-zh-ig-story.jpg   1080x1920  (IG story / 9:16)
  assets/share/im-sorry-zh-ig-feed.jpg     1080x1350  (IG feed / 4:5)

No QR (Chinese version). Rebuilds the page look with the real fonts.
"""
import os, math
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT  = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COVER = os.path.join(ROOT, "assets/images/sky/cover.jpg")
OUT   = os.path.join(ROOT, "assets/share")

BG      = (8, 6, 12)
CARD_BG = (13, 10, 20)
INK     = (244, 237, 249)
GOLD    = (217, 178, 106)
PURPLE  = (59, 27, 84)
TEXT_SAFE_TOP = 490

F_SERIF = "/usr/share/fonts/truetype/google-fonts/Lora-Variable.ttf"      # latin serif
F_CJK   = "/usr/share/fonts/opentype/noto/NotoSerifCJK-Regular.ttc"        # 中文襯線
F_SANS  = "/usr/share/fonts/truetype/google-fonts/Poppins-Medium.ttf"

EYEBROW = "OUT NOW"
SONG    = "I'M SORRY"
KICKER  = "單曲介紹"
URLTXT  = "chance1228.com"
BTN     = "立即聆聽"
PARAS = [
    "〈I'm Sorry〉是一句說得很輕的道歉，也是一個人決定不再回應的時刻。",
    "她仍然靠近，帶著熟悉的溫度、期待，以及那些反覆拉扯他的情緒。他卻已經懶得解釋，懶得追尋，也不想再證明什麼。不是沒有感覺，只是所有聲音累積得太久，最後都變成了噪音。",
    "深夜的影子落在沙發，煙沿著肩線游移。指尖仍記得彼此的距離，呼吸也交換著溫度；身體還停留在原地，意識卻早已漂向黑暗以外。",
    "世界被劃成四等份，他曾站在中央，承受所有方向投來的重量。如今理智追著自由，他不再被情緒拖著走，也不再為離開向誰乞求。",
    "煙慢慢消失在天花板，時間重新開始流動。",
]

def font(p, s): return ImageFont.truetype(p, s)

def tracked(d, xy, text, fnt, fill, tracking=0, anchor_x="left"):
    total = sum(d.textlength(c, font=fnt) + tracking for c in text) - (tracking if text else 0)
    x, y = xy
    if anchor_x == "center": x -= total/2
    elif anchor_x == "right": x -= total
    for c in text:
        d.text((x, y), c, font=fnt, fill=fill); x += d.textlength(c, font=fnt) + tracking
    return total

def wrap_cjk(d, text, fnt, maxw):
    lines, cur = [], ""
    for ch in text:
        if d.textlength(cur + ch, font=fnt) <= maxw:
            cur += ch
        else:
            lines.append(cur); cur = ch
    if cur: lines.append(cur)
    return lines

def radial_bg(w, h):
    sm = (max(2, w//10), max(2, h//10))
    im = Image.new("RGB", sm, BG); px = im.load()
    cx, cy = sm[0]*0.5, sm[1]*-0.06
    md = math.hypot(sm[0]*0.75, sm[1]*0.95)
    for yy in range(sm[1]):
        for xx in range(sm[0]):
            t = max(0.0, 1.0 - min(1.0, math.hypot(xx-cx, yy-cy)/md))**1.5
            px[xx, yy] = tuple(int(BG[i] + (PURPLE[i]-BG[i])*t) for i in range(3))
    return im.resize((w, h), Image.LANCZOS)

def rmask(size, r):
    m = Image.new("L", size, 0)
    ImageDraw.Draw(m).rounded_rectangle([0,0,size[0]-1,size[1]-1], r, fill=255); return m

def cover_crop(tw, th):
    im = Image.open(COVER).convert("RGB")
    dr = tw/th
    nh = int(im.width/dr)
    top = max(0, min(TEXT_SAFE_TOP, im.height-nh))
    return im.crop((0, top, im.width, top+nh)).resize((tw, th), Image.LANCZOS)

def hero_shade(w, h):
    g = Image.new("L", (1, h)); gp = g.load()
    for y in range(h):
        t = y/max(1, h-1)
        a = int(76*(1-t/0.30)) if t < 0.30 else (0 if t < 0.52 else int(238*((t-0.52)/0.48)**1.35))
        gp[0, y] = min(255, a)
    return Image.new("RGB", (w, h), CARD_BG), g.resize((w, h))

def build_card(CW, show_button=True, show_url=True):
    """Render the card at width CW; height is computed from content. Returns RGBA.
    show_button=False drops the LISTEN NOW-style button entirely — used for the
    plain image version, where a "button" can't actually be tapped.
    show_url=False drops the chance1228.com line too, for a pure image with
    no text call-to-action at all."""
    S = CW/980.0
    pad = int(56*S)
    hero_h = int(CW*0.72)
    inner_w = CW - pad*2

    f_eye  = font(F_SERIF, int(30*S))
    f_song = font(F_SERIF, int(96*S))
    f_kick = font(F_CJK,   int(22*S))
    f_body = font(F_CJK,   int(29*S))
    f_url  = font(F_SERIF, int(34*S))
    f_btn  = font(F_CJK,   int(30*S))

    line_h = int(29*S*1.92)
    para_gap = int(16*S)

    # measure paragraphs
    wrapped = [wrap_cjk(ImageDraw.Draw(Image.new("RGB",(10,10))), p, f_body, inner_w) for p in PARAS]
    body_h = 0
    for i, ls in enumerate(wrapped):
        body_h += len(ls)*line_h + (para_gap if i else 0)

    # vertical budget
    y_kick = hero_h + int(40*S)
    y_body = y_kick + int(38*S)
    y_url  = y_body + body_h + int(34*S)
    if show_button:
        y_btn = y_url + int(52*S)
        btn_h = int(76*S)
        CH = y_btn + btn_h + int(40*S)
    elif show_url:
        CH = y_url + int(46*S) + int(44*S)   # url line height + bottom margin
    else:
        CH = y_body + body_h + int(48*S)     # body text + bottom margin, nothing else

    card = Image.new("RGB", (CW, CH), CARD_BG)
    cd = ImageDraw.Draw(card)

    # hero
    hero = cover_crop(CW, hero_h)
    sh, al = hero_shade(CW, hero_h)
    hero = Image.composite(sh, hero, al)
    card.paste(hero, (0, 0))
    hd = ImageDraw.Draw(card)
    ty = hero_h - int(150*S)
    tracked(hd, (pad, ty - int(46*S)), EYEBROW, f_eye, GOLD, tracking=int(12*S))
    tracked(hd, (pad, ty), SONG, f_song, INK, tracking=int(6*S))

    # kicker + body
    tracked(cd, (pad, y_kick), KICKER, f_kick, (217,178,106), tracking=int(8*S))
    y = y_body
    for i, ls in enumerate(wrapped):
        if i: y += para_gap
        for ln in ls:
            cd.text((pad, y), ln, font=f_body, fill=(238,231,246)); y += line_h

    # url (optional)
    if show_url:
        cd.text((pad, y_url), URLTXT, font=f_url, fill=INK)

    # button (optional)
    if show_button:
        bx0, bx1 = pad, CW - pad
        cd.rounded_rectangle([bx0, y_btn, bx1, y_btn+btn_h], int(16*S), fill=(225,192,120))
        bw = cd.textlength(BTN, font=f_btn)
        cd.text(((bx0+bx1)/2 - bw/2, y_btn + (btn_h-int(30*S))/2 - int(4*S)), BTN, font=f_btn, fill=(36,21,5))

    # round the card corners over transparency
    out = Image.new("RGBA", (CW, CH), (0,0,0,0))
    out.paste(card, (0,0), rmask((CW, CH), int(46*S)))
    return out

def compose(W, H, name, show_button=True, show_url=True, side_margin_ratio=0.10):
    base = radial_bg(W, H).convert("RGBA")
    # card width: leave safe side margins; also cap height to fit with top/bottom margins
    CW = int(W*(1 - side_margin_ratio))
    card = build_card(CW, show_button=show_button, show_url=show_url)
    max_h = int(H*0.96)
    if card.height > max_h:
        scale = max_h/card.height
        CW = int(CW*scale)
        card = build_card(CW, show_button=show_button, show_url=show_url)
    x = (W - card.width)//2
    y = (H - card.height)//2
    # soft shadow
    sh = Image.new("RGBA", (W, H), (0,0,0,0))
    sh.paste(Image.new("RGBA", card.size, (0,0,0,150)),
             (x, y+int(14)), card.split()[3])
    sh = sh.filter(ImageFilter.GaussianBlur(26))
    base = Image.alpha_composite(base, sh)
    base.alpha_composite(card, (x, y))
    out = base.convert("RGB")
    os.makedirs(OUT, exist_ok=True)
    p = os.path.join(OUT, name)
    out.save(p, "JPEG", quality=90, optimize=True, progressive=True)
    return p, card.width, card.height

if __name__ == "__main__":
    jobs = [
        # IG-safe canvases (unchanged)
        dict(W=1080, H=1920, name="im-sorry-zh-ig-story.jpg", show_button=True, side_margin_ratio=0.10),
        dict(W=1080, H=1350, name="im-sorry-zh-ig-feed.jpg",  show_button=True, side_margin_ratio=0.10),
        # Same canvas size as the English page-portrait screenshot (709x1309).
        # No button, no chance1228.com line — pure image, photo + copy only.
        dict(W=709, H=1309, name="im-sorry-zh-page-portrait.jpg",
             show_button=False, show_url=False, side_margin_ratio=0.0),
    ]
    for j in jobs:
        p, cw, ch = compose(j["W"], j["H"], j["name"],
                             show_button=j["show_button"],
                             show_url=j.get("show_url", True),
                             side_margin_ratio=j["side_margin_ratio"])
        print(f"{os.path.relpath(p, ROOT):46s} {os.path.getsize(p)/1024:6.0f}KB  card {cw}x{ch}  canvas {j['W']}x{j['H']}")
