#!/usr/bin/env python3
"""
Render the CHANCE ticket-stub share card as flat images (JPG + PNG).

Outputs:
  assets/share/im-sorry-share-card-story.jpg   1080x1920  the card you send to people
  assets/share/im-sorry-share-card-og.jpg      1200x630   what og:image points at

The QR code embedded in every image is a real, scannable QR pointing at QR_TARGET.

Run:  python3 tools/make-share-card.py
"""

import os
import math
import segno
from PIL import Image, ImageDraw, ImageFilter, ImageFont

# ----------------------------------------------------------------------------
# Content — edit these to re-skin the card
# ----------------------------------------------------------------------------
ARTIST      = "CHANCE"
ALBUM       = "THE SKY"
SONG        = "I'M SORRY"
SERIAL      = "No 001228"
URL_LABEL   = "chance1228.com"
QR_TARGET   = "https://chance1228.com/im-sorry/"   # where scanning takes you
SCAN_LABEL  = "SCAN TO LISTEN"
TAGLINE     = "NEW SINGLE  ·  LISTEN NOW"

ROOT   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COVER  = os.path.join(ROOT, "assets/images/sky/cover.jpg")
OUTDIR = os.path.join(ROOT, "assets/share")

# ----------------------------------------------------------------------------
# Palette (matches the HTML card)
# ----------------------------------------------------------------------------
BG      = (8, 6, 12)
CARD_BG = (13, 10, 20)
INK     = (244, 237, 249)
GOLD    = (217, 178, 106)
GOLD_LT = (233, 205, 139)
PURPLE  = (59, 27, 84)
LINE_C  = (201, 162, 232)

F_SERIF = "/usr/share/fonts/truetype/google-fonts/Lora-Variable.ttf"
F_MONO  = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"
F_SANS  = "/usr/share/fonts/truetype/google-fonts/Poppins-Medium.ttf"
F_SANSB = "/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf"


def font(path, size):
    return ImageFont.truetype(path, size)


def tracked(draw, xy, text, fnt, fill, tracking=0, anchor_x="left"):
    """Draw text with manual letter-spacing. Returns total width drawn."""
    total = 0
    for ch in text:
        total += draw.textlength(ch, font=fnt) + tracking
    total -= tracking if text else 0

    x, y = xy
    if anchor_x == "center":
        x -= total / 2
    elif anchor_x == "right":
        x -= total

    for ch in text:
        draw.text((x, y), ch, font=fnt, fill=fill)
        x += draw.textlength(ch, font=fnt) + tracking
    return total


def radial_bg(w, h):
    """Purple radial glow fading into near-black, like the CSS background."""
    small = max(2, w // 12), max(2, h // 12)
    img = Image.new("RGB", small, BG)
    px = img.load()
    cx, cy = small[0] * 0.5, small[1] * -0.10
    maxd = math.hypot(small[0] * 0.75, small[1] * 0.95)
    for yy in range(small[1]):
        for xx in range(small[0]):
            d = min(1.0, math.hypot(xx - cx, yy - cy) / maxd)
            t = max(0.0, 1.0 - d) ** 1.5
            px[xx, yy] = (
                int(BG[0] + (PURPLE[0] - BG[0]) * t),
                int(BG[1] + (PURPLE[1] - BG[1]) * t),
                int(BG[2] + (PURPLE[2] - BG[2]) * t),
            )
    return img.resize((w, h), Image.LANCZOS)


def rounded_mask(size, radius):
    m = Image.new("L", size, 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, size[0] - 1, size[1] - 1], radius, fill=255)
    return m


""" The supplied artwork has "CHANCE / I'M SORRY" typeset across its top
    (measured: y=271..457 of 1800). We always crop below that band so the title
    is not printed twice — this script's own typography carries the text. """
TEXT_SAFE_TOP = 490          # first source row that is clear of the baked-in title


def cover_crop(target_w, target_h):
    im = Image.open(COVER).convert("RGB")
    src_ratio = im.width / im.height
    dst_ratio = target_w / target_h
    if src_ratio > dst_ratio:                      # too wide -> crop sides
        nw = int(im.height * dst_ratio)
        im = im.crop(((im.width - nw) // 2, 0, (im.width + nw) // 2, im.height))
    else:                                          # too tall -> start below the baked title
        nh = int(im.width / dst_ratio)
        top = max(0, min(TEXT_SAFE_TOP, im.height - nh))
        im = im.crop((0, top, im.width, top + nh))
    return im.resize((target_w, target_h), Image.LANCZOS)


def gradient_shade(w, h):
    """Transparent at the top, opaque card-colour at the bottom."""
    g = Image.new("L", (1, h))
    gp = g.load()
    for y in range(h):
        t = y / max(1, h - 1)
        if t < 0.30:
            a = int(76 * (1 - t / 0.30))           # slight purple veil up top
        elif t < 0.52:
            a = 0
        else:
            a = int(240 * ((t - 0.52) / 0.48) ** 1.35)
        gp[0, y] = min(255, a)
    alpha = g.resize((w, h))
    shade = Image.new("RGB", (w, h), CARD_BG)
    return shade, alpha


def qr_image(px_size):
    """Real scannable QR, quiet zone included, dark modules in card ink."""
    qr = segno.make(QR_TARGET, error="h")
    modules = [[bool(m) for m in row] for row in qr.matrix]
    n = len(modules)
    quiet = 4
    total = n + quiet * 2
    scale = max(1, px_size // total)
    img = Image.new("RGB", (total * scale, total * scale), (255, 255, 255))
    d = ImageDraw.Draw(img)
    for r in range(n):
        for c in range(n):
            if modules[r][c]:
                x0 = (c + quiet) * scale
                y0 = (r + quiet) * scale
                d.rectangle([x0, y0, x0 + scale - 1, y0 + scale - 1], fill=BG)
    return img.resize((px_size, px_size), Image.NEAREST)


def barcode(draw, x, y, w, h):
    """Decorative ticket barcode (not a real code — the QR is the scannable one)."""
    cx = x
    i = 0
    while cx < x + w:
        bw = 2 if i % 3 else 4
        if cx + bw > x + w:
            bw = x + w - cx
        draw.rectangle([cx, y, cx + bw - 1, y + h], fill=(217, 178, 106, 220))
        cx += bw + (3 if i % 2 else 5)
        i += 1


# ----------------------------------------------------------------------------
# Main renderer
# ----------------------------------------------------------------------------
def render(W, H, name, hero_ratio=0.60, pad_ratio=0.045):
    s = W / 1080.0                      # scale factor, 1080-wide is the reference

    base = radial_bg(W, H).convert("RGB")

    pad = int(W * pad_ratio)
    card_w = W - pad * 2
    card_h = H - pad * 2
    radius = int(46 * s)

    card = Image.new("RGB", (card_w, card_h), CARD_BG)
    cd = ImageDraw.Draw(card)

    # ---------------- hero ----------------
    hero_h = int(card_h * hero_ratio)
    hero = cover_crop(card_w, hero_h)
    shade, alpha = gradient_shade(card_w, hero_h)
    hero = Image.composite(shade, hero, alpha)
    card.paste(hero, (0, 0))

    hd = ImageDraw.Draw(card)
    m = int(52 * s)

    # serial, top right
    f_mono_sm = font(F_MONO, int(20 * s))
    tracked(hd, (card_w - m, int(40 * s)), SERIAL, f_mono_sm, GOLD,
            tracking=int(3 * s), anchor_x="right")

    # artist + song title, bottom left of hero
    f_artist = font(F_SERIF, int(26 * s))
    f_title  = font(F_SERIF, int(88 * s))
    title_y  = hero_h - int(150 * s)
    tracked(hd, (m, title_y - int(38 * s)), ARTIST, f_artist, GOLD, tracking=int(14 * s))
    tracked(hd, (m, title_y), SONG, f_title, INK, tracking=int(7 * s))

    # ---------------- meta row ----------------
    y = hero_h + int(46 * s)
    f_k = font(F_SANS, int(19 * s))
    f_v = font(F_SERIF, int(31 * s))
    cols = [("ARTIST", ARTIST), ("ALBUM", ALBUM), ("SONG", SONG)]
    col_x = [m, m + int(card_w * 0.36), m + int(card_w * 0.655)]
    for (k, v), cx in zip(cols, col_x):
        tracked(cd, (cx, y), k, f_k, (217, 178, 106), tracking=int(4 * s))
        cd.text((cx, y + int(30 * s)), v, font=f_v, fill=INK)

    # ---------------- perforation ----------------
    perf_y = y + int(96 * s)
    dash, gap = int(16 * s), int(12 * s)
    dx = m
    while dx < card_w - m:
        cd.line([(dx, perf_y), (min(dx + dash, card_w - m), perf_y)],
                fill=(140, 112, 168), width=max(2, int(2.5 * s)))
        dx += dash + gap
    hole = int(24 * s)
    for hx in (0, card_w):
        cd.ellipse([hx - hole, perf_y - hole, hx + hole, perf_y + hole], fill=BG)

    # ---------------- stub: QR + text ----------------
    stub_y = perf_y + int(52 * s)
    qr_px  = int(min(268 * s, (card_h - stub_y) * 0.78))
    qpad   = int(18 * s)

    qr_card = Image.new("RGB", (qr_px + qpad * 2, qr_px + qpad * 2), (255, 255, 255))
    qr_card.paste(qr_image(qr_px), (qpad, qpad))
    qr_card = qr_card.resize(qr_card.size)
    qmask = rounded_mask(qr_card.size, int(20 * s))
    card.paste(qr_card, (m, stub_y), qmask)

    tx = m + qr_card.width + int(36 * s)
    f_scan = font(F_MONO, int(20 * s))
    f_url  = font(F_SERIF, int(40 * s))
    f_tag  = font(F_SANS, int(21 * s))

    ty = stub_y + int(14 * s)
    tracked(cd, (tx, ty), SCAN_LABEL, f_scan, GOLD, tracking=int(6 * s))
    cd.text((tx, ty + int(38 * s)), URL_LABEL, font=f_url, fill=INK)
    tracked(cd, (tx, ty + int(102 * s)), TAGLINE, f_tag, (168, 150, 190), tracking=int(2 * s))

    bar_y = stub_y + qr_card.height - int(34 * s)
    barcode(cd, tx, bar_y, min(int(420 * s), card_w - tx - m), int(34 * s))

    # ---------------- compose ----------------
    card_mask = rounded_mask((card_w, card_h), radius)

    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sh = Image.new("RGBA", (card_w, card_h), (0, 0, 0, 170))
    shadow.paste(sh, (pad, pad + int(18 * s)), card_mask)
    shadow = shadow.filter(ImageFilter.GaussianBlur(int(26 * s)))
    base = Image.alpha_composite(base.convert("RGBA"), shadow).convert("RGB")

    base.paste(card, (pad, pad), card_mask)

    # hairline border
    bd = ImageDraw.Draw(base)
    bd.rounded_rectangle([pad, pad, pad + card_w - 1, pad + card_h - 1],
                         radius, outline=(70, 55, 92), width=max(1, int(2 * s)))

    os.makedirs(OUTDIR, exist_ok=True)
    jpg = os.path.join(OUTDIR, name + ".jpg")
    base.save(jpg, "JPEG", quality=92, optimize=True, progressive=True)
    return jpg


def render_landscape(W, H, name, pad_ratio=0.030):
    """Wide ticket: artwork on the left, stub with the QR on the right."""
    s = H / 630.0

    base = radial_bg(W, H).convert("RGB")
    pad = int(H * pad_ratio)
    card_w, card_h = W - pad * 2, H - pad * 2
    radius = int(34 * s)

    card = Image.new("RGB", (card_w, card_h), CARD_BG)
    cd = ImageDraw.Draw(card)

    # ---------------- left: artwork ----------------
    art_w = int(card_w * 0.50)
    art = cover_crop(art_w, card_h)

    # fade the right edge of the artwork into the stub
    g = Image.new("L", (art_w, 1))
    gp = g.load()
    for x in range(art_w):
        t = x / max(1, art_w - 1)
        gp[x, 0] = 0 if t < 0.55 else int(255 * ((t - 0.55) / 0.45) ** 1.5)
    art = Image.composite(Image.new("RGB", (art_w, card_h), CARD_BG), art,
                          g.resize((art_w, card_h)))
    card.paste(art, (0, 0))

    m = int(46 * s)
    f_artist = font(F_SERIF, int(22 * s))
    f_song   = font(F_SERIF, int(68 * s))
    f_album  = font(F_SANS,  int(20 * s))

    ay = card_h - int(178 * s)
    tracked(cd, (m, ay), ARTIST, f_artist, GOLD, tracking=int(12 * s))
    tracked(cd, (m, ay + int(30 * s)), SONG, f_song, INK, tracking=int(5 * s))
    tracked(cd, (m, ay + int(112 * s)), "FROM THE ALBUM " + ALBUM, f_album,
            (185, 165, 205), tracking=int(4 * s))

    # ---------------- vertical perforation ----------------
    px_ = art_w + int(6 * s)
    dash, gap = int(14 * s), int(11 * s)
    dy = m
    while dy < card_h - m:
        cd.line([(px_, dy), (px_, min(dy + dash, card_h - m))],
                fill=(140, 112, 168), width=max(2, int(2.5 * s)))
        dy += dash + gap
    hole = int(20 * s)
    for hy in (0, card_h):
        cd.ellipse([px_ - hole, hy - hole, px_ + hole, hy + hole], fill=BG)

    # ---------------- right: stub ----------------
    sx = px_ + int(54 * s)
    f_mono_sm = font(F_MONO, int(17 * s))
    tracked(cd, (card_w - m, int(38 * s)), SERIAL, f_mono_sm, GOLD,
            tracking=int(3 * s), anchor_x="right")

    # Stub contents are stacked and centred inside the right-hand panel so
    # nothing can run past the card edge regardless of string length.
    panel_l, panel_r = px_, card_w
    ccx = (panel_l + panel_r) / 2

    f_scan = font(F_MONO, int(18 * s))
    f_url  = font(F_SERIF, int(36 * s))
    f_tag  = font(F_SANS, int(17 * s))

    qr_px = int(210 * s)
    qpad = int(14 * s)
    qr_card = Image.new("RGB", (qr_px + qpad * 2, qr_px + qpad * 2), (255, 255, 255))
    qr_card.paste(qr_image(qr_px), (qpad, qpad))

    block_h = int(26 * s) + qr_card.height + int(20 * s) + int(46 * s) + int(34 * s)
    top = int((card_h - block_h) / 2)

    tracked(cd, (ccx, top), SCAN_LABEL, f_scan, GOLD, tracking=int(6 * s), anchor_x="center")
    qy = top + int(38 * s)
    card.paste(qr_card, (int(ccx - qr_card.width / 2), qy),
               rounded_mask(qr_card.size, int(16 * s)))

    uy = qy + qr_card.height + int(20 * s)
    tracked(cd, (ccx, uy), URL_LABEL, f_url, INK, tracking=int(1 * s), anchor_x="center")
    tracked(cd, (ccx, uy + int(50 * s)), TAGLINE, f_tag, (168, 150, 190),
            tracking=int(2 * s), anchor_x="center")

    bw = int(min(300 * s, (panel_r - panel_l) * 0.62))
    barcode(cd, int(ccx - bw / 2), uy + int(82 * s), bw, int(26 * s))

    # ---------------- compose ----------------
    card_mask = rounded_mask((card_w, card_h), radius)
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    shadow.paste(Image.new("RGBA", (card_w, card_h), (0, 0, 0, 170)),
                 (pad, pad + int(14 * s)), card_mask)
    shadow = shadow.filter(ImageFilter.GaussianBlur(int(22 * s)))
    base = Image.alpha_composite(base.convert("RGBA"), shadow).convert("RGB")
    base.paste(card, (pad, pad), card_mask)
    ImageDraw.Draw(base).rounded_rectangle(
        [pad, pad, pad + card_w - 1, pad + card_h - 1], radius,
        outline=(70, 55, 92), width=max(1, int(2 * s)))

    os.makedirs(OUTDIR, exist_ok=True)
    jpg, png = os.path.join(OUTDIR, name + ".jpg"), os.path.join(OUTDIR, name + ".png")
    base.save(jpg, "JPEG", quality=92, optimize=True, progressive=True)
    return jpg


if __name__ == "__main__":
    made = [
        # the card you actually send to people (IG story / AirDrop / LINE / DM)
        render(1080, 1920, "im-sorry-share-card-story", hero_ratio=0.66, pad_ratio=0.045),
        # not for sending by hand: this is what og:image points at, so that
        # pasting the LINK into LINE/FB renders a tappable preview card
        render_landscape(1200, 630, "im-sorry-share-card-og"),
    ]
    for f in made:
        print(f"{os.path.relpath(f, ROOT):52s} {os.path.getsize(f)/1024:7.0f} KB")
