// outputs/wallet-v1/vendor/fflate.js
var u8 = Uint8Array;
var u16 = Uint16Array;
var i32 = Int32Array;
var fleb = new u8([
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  3,
  3,
  3,
  3,
  4,
  4,
  4,
  4,
  5,
  5,
  5,
  5,
  0,
  /* unused */
  0,
  0,
  /* impossible */
  0
]);
var fdeb = new u8([
  0,
  0,
  0,
  0,
  1,
  1,
  2,
  2,
  3,
  3,
  4,
  4,
  5,
  5,
  6,
  6,
  7,
  7,
  8,
  8,
  9,
  9,
  10,
  10,
  11,
  11,
  12,
  12,
  13,
  13,
  /* unused */
  0,
  0
]);
var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
var freb = function(eb, start) {
  var b = new u16(31);
  for (var i2 = 0; i2 < 31; ++i2) {
    b[i2] = start += 1 << eb[i2 - 1];
  }
  var r = new i32(b[30]);
  for (var i2 = 1; i2 < 30; ++i2) {
    for (var j = b[i2]; j < b[i2 + 1]; ++j) {
      r[j] = j - b[i2] << 5 | i2;
    }
  }
  return { b, r };
};
var _a = freb(fleb, 2);
var fl = _a.b;
var revfl = _a.r;
fl[28] = 258, revfl[258] = 28;
var _b = freb(fdeb, 0);
var fd = _b.b;
var revfd = _b.r;
var rev = new u16(32768);
for (i = 0; i < 32768; ++i) {
  x = (i & 43690) >> 1 | (i & 21845) << 1;
  x = (x & 52428) >> 2 | (x & 13107) << 2;
  x = (x & 61680) >> 4 | (x & 3855) << 4;
  rev[i] = ((x & 65280) >> 8 | (x & 255) << 8) >> 1;
}
var x;
var i;
var hMap = (function(cd, mb, r) {
  var s = cd.length;
  var i2 = 0;
  var l = new u16(mb);
  for (; i2 < s; ++i2) {
    if (cd[i2])
      ++l[cd[i2] - 1];
  }
  var le = new u16(mb);
  for (i2 = 1; i2 < mb; ++i2) {
    le[i2] = le[i2 - 1] + l[i2 - 1] << 1;
  }
  var co;
  if (r) {
    co = new u16(1 << mb);
    var rvb = 15 - mb;
    for (i2 = 0; i2 < s; ++i2) {
      if (cd[i2]) {
        var sv = i2 << 4 | cd[i2];
        var r_1 = mb - cd[i2];
        var v = le[cd[i2] - 1]++ << r_1;
        for (var m = v | (1 << r_1) - 1; v <= m; ++v) {
          co[rev[v] >> rvb] = sv;
        }
      }
    }
  } else {
    co = new u16(s);
    for (i2 = 0; i2 < s; ++i2) {
      if (cd[i2]) {
        co[i2] = rev[le[cd[i2] - 1]++] >> 15 - cd[i2];
      }
    }
  }
  return co;
});
var flt = new u8(288);
for (i = 0; i < 144; ++i)
  flt[i] = 8;
var i;
for (i = 144; i < 256; ++i)
  flt[i] = 9;
var i;
for (i = 256; i < 280; ++i)
  flt[i] = 7;
var i;
for (i = 280; i < 288; ++i)
  flt[i] = 8;
var i;
var fdt = new u8(32);
for (i = 0; i < 32; ++i)
  fdt[i] = 5;
var i;
var flrm = /* @__PURE__ */ hMap(flt, 9, 1);
var fdrm = /* @__PURE__ */ hMap(fdt, 5, 1);
var max = function(a) {
  var m = a[0];
  for (var i2 = 1; i2 < a.length; ++i2) {
    if (a[i2] > m)
      m = a[i2];
  }
  return m;
};
var bits = function(d, p, m) {
  var o = p / 8 | 0;
  return (d[o] | d[o + 1] << 8) >> (p & 7) & m;
};
var bits16 = function(d, p) {
  var o = p / 8 | 0;
  return (d[o] | d[o + 1] << 8 | d[o + 2] << 16) >> (p & 7);
};
var shft = function(p) {
  return (p + 7) / 8 | 0;
};
var slc = function(v, s, e) {
  if (s == null || s < 0)
    s = 0;
  if (e == null || e > v.length)
    e = v.length;
  return new u8(v.subarray(s, e));
};
var ec = [
  "unexpected EOF",
  "invalid block type",
  "invalid length/literal",
  "invalid distance",
  "stream finished",
  "no stream handler",
  ,
  "no callback",
  "invalid UTF-8 data",
  "extra field too long",
  "date not in range 1980-2099",
  "filename too long",
  "stream finishing",
  "invalid zip data"
  // determined by unknown compression method
];
var err = function(ind, msg, nt) {
  var e = new Error(msg || ec[ind]);
  e.code = ind;
  if (Error.captureStackTrace)
    Error.captureStackTrace(e, err);
  if (!nt)
    throw e;
  return e;
};
var inflt = function(dat, st, buf, dict) {
  var sl = dat.length, dl = dict ? dict.length : 0;
  if (!sl || st.f && !st.l)
    return buf || new u8(0);
  var noBuf = !buf;
  var resize = noBuf || st.i != 2;
  var noSt = st.i;
  if (noBuf)
    buf = new u8(sl * 3);
  var cbuf = function(l2) {
    var bl = buf.length;
    if (l2 > bl) {
      var nbuf = new u8(Math.max(bl * 2, l2));
      nbuf.set(buf);
      buf = nbuf;
    }
  };
  var final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
  var tbts = sl * 8;
  do {
    if (!lm) {
      final = bits(dat, pos, 1);
      var type = bits(dat, pos + 1, 3);
      pos += 3;
      if (!type) {
        var s = shft(pos) + 4, l = dat[s - 4] | dat[s - 3] << 8, t = s + l;
        if (t > sl) {
          if (noSt)
            err(0);
          break;
        }
        if (resize)
          cbuf(bt + l);
        buf.set(dat.subarray(s, t), bt);
        st.b = bt += l, st.p = pos = t * 8, st.f = final;
        continue;
      } else if (type == 1)
        lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
      else if (type == 2) {
        var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
        var tl = hLit + bits(dat, pos + 5, 31) + 1;
        pos += 14;
        var ldt = new u8(tl);
        var clt = new u8(19);
        for (var i2 = 0; i2 < hcLen; ++i2) {
          clt[clim[i2]] = bits(dat, pos + i2 * 3, 7);
        }
        pos += hcLen * 3;
        var clb = max(clt), clbmsk = (1 << clb) - 1;
        var clm = hMap(clt, clb, 1);
        for (var i2 = 0; i2 < tl; ) {
          var r = clm[bits(dat, pos, clbmsk)];
          pos += r & 15;
          var s = r >> 4;
          if (s < 16) {
            ldt[i2++] = s;
          } else {
            var c = 0, n = 0;
            if (s == 16)
              n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i2 - 1];
            else if (s == 17)
              n = 3 + bits(dat, pos, 7), pos += 3;
            else if (s == 18)
              n = 11 + bits(dat, pos, 127), pos += 7;
            while (n--)
              ldt[i2++] = c;
          }
        }
        var lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
        lbt = max(lt);
        dbt = max(dt);
        lm = hMap(lt, lbt, 1);
        dm = hMap(dt, dbt, 1);
      } else
        err(1);
      if (pos > tbts) {
        if (noSt)
          err(0);
        break;
      }
    }
    if (resize)
      cbuf(bt + 131072);
    var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
    var lpos = pos;
    for (; ; lpos = pos) {
      var c = lm[bits16(dat, pos) & lms], sym = c >> 4;
      pos += c & 15;
      if (pos > tbts) {
        if (noSt)
          err(0);
        break;
      }
      if (!c)
        err(2);
      if (sym < 256)
        buf[bt++] = sym;
      else if (sym == 256) {
        lpos = pos, lm = null;
        break;
      } else {
        var add = sym - 254;
        if (sym > 264) {
          var i2 = sym - 257, b = fleb[i2];
          add = bits(dat, pos, (1 << b) - 1) + fl[i2];
          pos += b;
        }
        var d = dm[bits16(dat, pos) & dms], dsym = d >> 4;
        if (!d)
          err(3);
        pos += d & 15;
        var dt = fd[dsym];
        if (dsym > 3) {
          var b = fdeb[dsym];
          dt += bits16(dat, pos) & (1 << b) - 1, pos += b;
        }
        if (pos > tbts) {
          if (noSt)
            err(0);
          break;
        }
        if (resize)
          cbuf(bt + 131072);
        var end = bt + add;
        if (bt < dt) {
          var shift = dl - dt, dend = Math.min(dt, end);
          if (shift + bt < 0)
            err(3);
          for (; bt < dend; ++bt)
            buf[bt] = dict[shift + bt];
        }
        for (; bt < end; ++bt)
          buf[bt] = buf[bt - dt];
      }
    }
    st.l = lm, st.p = lpos, st.b = bt, st.f = final;
    if (lm)
      final = 1, st.m = lbt, st.d = dm, st.n = dbt;
  } while (!final);
  return bt != buf.length && noBuf ? slc(buf, 0, bt) : buf.subarray(0, bt);
};
var et = /* @__PURE__ */ new u8(0);
var b2 = function(d, b) {
  return d[b] | d[b + 1] << 8;
};
var b4 = function(d, b) {
  return (d[b] | d[b + 1] << 8 | d[b + 2] << 16 | d[b + 3] << 24) >>> 0;
};
var b8 = function(d, b) {
  return b4(d, b) + b4(d, b + 4) * 4294967296;
};
function inflateSync(data, opts) {
  return inflt(data, { i: 2 }, opts && opts.out, opts && opts.dictionary);
}
var td = typeof TextDecoder != "undefined" && /* @__PURE__ */ new TextDecoder();
var tds = 0;
try {
  td.decode(et, { stream: true });
  tds = 1;
} catch (e) {
}
var dutf8 = function(d) {
  for (var r = "", i2 = 0; ; ) {
    var c = d[i2++];
    var eb = (c > 127) + (c > 223) + (c > 239);
    if (i2 + eb > d.length)
      return { s: r, r: slc(d, i2 - 1) };
    if (!eb)
      r += String.fromCharCode(c);
    else if (eb == 3) {
      c = ((c & 15) << 18 | (d[i2++] & 63) << 12 | (d[i2++] & 63) << 6 | d[i2++] & 63) - 65536, r += String.fromCharCode(55296 | c >> 10, 56320 | c & 1023);
    } else if (eb & 1)
      r += String.fromCharCode((c & 31) << 6 | d[i2++] & 63);
    else
      r += String.fromCharCode((c & 15) << 12 | (d[i2++] & 63) << 6 | d[i2++] & 63);
  }
};
function strFromU8(dat, latin1) {
  if (latin1) {
    var r = "";
    for (var i2 = 0; i2 < dat.length; i2 += 16384)
      r += String.fromCharCode.apply(null, dat.subarray(i2, i2 + 16384));
    return r;
  } else if (td) {
    return td.decode(dat);
  } else {
    var _a2 = dutf8(dat), s = _a2.s, r = _a2.r;
    if (r.length)
      err(8);
    return s;
  }
}
var slzh = function(d, b) {
  return b + 30 + b2(d, b + 26) + b2(d, b + 28);
};
var zh = function(d, b, z) {
  var fnl = b2(d, b + 28), fn = strFromU8(d.subarray(b + 46, b + 46 + fnl), !(b2(d, b + 8) & 2048)), es = b + 46 + fnl, bs = b4(d, b + 20);
  var _a2 = z && bs == 4294967295 ? z64e(d, es) : [bs, b4(d, b + 24), b4(d, b + 42)], sc = _a2[0], su = _a2[1], off = _a2[2];
  return [b2(d, b + 10), sc, su, fn, es + b2(d, b + 30) + b2(d, b + 32), off];
};
var z64e = function(d, b) {
  for (; b2(d, b) != 1; b += 4 + b2(d, b + 2))
    ;
  return [b8(d, b + 12), b8(d, b + 4), b8(d, b + 20)];
};
function unzipSync(data, opts) {
  var files = {};
  var e = data.length - 22;
  for (; b4(data, e) != 101010256; --e) {
    if (!e || data.length - e > 65558)
      err(13);
  }
  ;
  var c = b2(data, e + 8);
  if (!c)
    return {};
  var o = b4(data, e + 16);
  var z = o == 4294967295 || c == 65535;
  if (z) {
    var ze = b4(data, e - 12);
    z = b4(data, ze) == 101075792;
    if (z) {
      c = b4(data, ze + 32);
      o = b4(data, ze + 48);
    }
  }
  var fltr = opts && opts.filter;
  for (var i2 = 0; i2 < c; ++i2) {
    var _a2 = zh(data, o, z), c_2 = _a2[0], sc = _a2[1], su = _a2[2], fn = _a2[3], no = _a2[4], off = _a2[5], b = slzh(data, off);
    o = no;
    if (!fltr || fltr({
      name: fn,
      size: sc,
      originalSize: su,
      compression: c_2
    })) {
      if (!c_2)
        files[fn] = slc(data, b, b + sc);
      else if (c_2 == 8)
        files[fn] = inflateSync(data.subarray(b, b + sc), { out: new u8(su) });
      else
        err(14, "unknown compression type " + c_2);
    }
  }
  return files;
}

// outputs/wallet-v1/wallet-core.js
var enc = new TextEncoder();
var SESSION_MS = 5 * 60 * 1e3;
var TRANSFER_MS = 10 * 60 * 1e3;
var ALBUM = "the-sky";
var hex = (b) => [...new Uint8Array(b)].map((x2) => x2.toString(16).padStart(2, "0")).join("").toUpperCase();
var unhex = (s) => {
  if (!/^(?:[a-f0-9]{2})+$/i.test(s)) throw new Error("invalid_encoding");
  return Uint8Array.from(s.match(/../g), (x2) => parseInt(x2, 16));
};
var digest = async (s) => hex(await crypto.subtle.digest("SHA-256", enc.encode(s)));
var random = () => hex(crypto.getRandomValues(new Uint8Array(24)));
var emailOf = (s) => String(s || "").trim().toLowerCase();
var validEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && s.length <= 254;
var fault = (code, status = 403) => {
  const e = new Error(code);
  e.status = status;
  throw e;
};
var equal = (a, b) => {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let n = 0;
  for (let i2 = 0; i2 < a.length; i2++) n |= a.charCodeAt(i2) ^ b.charCodeAt(i2);
  return n === 0;
};
async function key(env) {
  if (!env.TICKET_SECRET) fault("wallet_not_configured", 503);
  return crypto.subtle.importKey("raw", enc.encode("wallet-v1:" + env.TICKET_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}
async function seal(env, payload, prefix) {
  const body = hex(enc.encode(JSON.stringify(payload)));
  return prefix + "." + body + "." + hex(await crypto.subtle.sign("HMAC", await key(env), enc.encode(prefix + "." + body)));
}
async function unseal(env, token, prefix) {
  const p = String(token || "").split(".");
  if (p.length !== 3 || p[0] !== prefix || p[1].length > 6e3 || p[2].length !== 64) fault("invalid_token");
  let ok = false, data;
  try {
    ok = await crypto.subtle.verify("HMAC", await key(env), unhex(p[2]), enc.encode(prefix + "." + p[1]));
    data = JSON.parse(new TextDecoder().decode(unhex(p[1])));
  } catch {
    fault("invalid_token");
  }
  if (!ok || !data || !Number.isFinite(data.exp) || data.exp <= Date.now()) fault("expired_token", 401);
  return data;
}
function pubOnly(jwk) {
  if (!jwk || jwk.kty !== "EC" || jwk.crv !== "P-256" || !/^[A-Za-z0-9_-]{43}$/.test(jwk.x || "") || !/^[A-Za-z0-9_-]{43}$/.test(jwk.y || "") || jwk.d) fault("invalid_device");
  return { kty: "EC", crv: "P-256", x: jwk.x, y: jwk.y, ext: true };
}
var deviceId = (jwk) => digest(JSON.stringify(pubOnly(jwk)));
async function verifyProof(env, body, purpose, publicKey) {
  const c = await unseal(env, body.challenge, "C1");
  if (c.purpose !== purpose || c.exp - Date.now() > 12e4) fault("invalid_challenge");
  try {
    const pk = await crypto.subtle.importKey("jwk", pubOnly(publicKey), { name: "ECDSA", namedCurve: "P-256" }, false, ["verify"]);
    if (!await crypto.subtle.verify({ name: "ECDSA", hash: "SHA-256" }, pk, unhex(body.proof), enc.encode(body.challenge + "\n" + JSON.stringify(body.payload)))) fault("invalid_proof");
  } catch {
    fault("invalid_proof");
  }
  return c;
}
var stub = (env) => env.WALLET_OWNERSHIP.get(env.WALLET_OWNERSHIP.idFromName("wallet-v1"));
async function call(env, action, body) {
  if (!env.WALLET_OWNERSHIP) fault("wallet_not_configured", 503);
  const r = await stub(env).fetch("https://wallet.internal/" + action, { method: "POST", body: JSON.stringify(body) });
  const d = await r.json();
  if (!r.ok) fault(d.error || "wallet_error", r.status);
  return d;
}
async function walletLegacyAllowed(env, code) {
  if (!env.WALLET_OWNERSHIP) return true;
  return (await call(env, "legacy", { hash: await digest(String(code).trim().toUpperCase()) })).allowed;
}
async function walletAuthenticate(env, email, code) {
  try {
    const s = await unseal(env, code, "W1");
    if (s.kind !== "session" || emailOf(email) !== s.owner) return null;
    const d = await call(env, "authorize", { session: s });
    return d.entitlement;
  } catch {
    return null;
  }
}
var cors = (req, env) => {
  const allowed = (env.WALLET_ORIGINS || "https://chance1228.com").split(",").map((x2) => x2.trim());
  const origin = req.headers.get("Origin");
  return { "Access-Control-Allow-Origin": allowed.includes(origin) ? origin : allowed[0], "Access-Control-Allow-Methods": "GET,POST,OPTIONS", "Access-Control-Allow-Headers": "Content-Type", Vary: "Origin", "Cache-Control": "no-store", "Content-Type": "application/json;charset=utf-8" };
};
var response = (req, env, data, status = 200) => new Response(JSON.stringify(data), { status, headers: cors(req, env) });
async function walletRouter(req, url, env, helpers = {}) {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors(req, env) });
  const origin = req.headers.get("Origin");
  const allowed = (env.WALLET_ORIGINS || "https://chance1228.com").split(",").map((x2) => x2.trim());
  if (origin && !allowed.includes(origin)) return response(req, env, { ok: false, error: "origin_not_allowed" }, 403);
  const path = url.pathname.slice("/wallet/".length);
  try {
    if (path === "health" && req.method === "GET") return response(req, env, { ok: true, version: "wallet-v1", sessionSeconds: 300, atomicOwnership: !!env.WALLET_OWNERSHIP });
    if (req.method !== "POST") fault("method_not_allowed", 405);
    const length = Number(req.headers.get("Content-Length") || 0);
    if (length > 24e3) fault("body_too_large", 413);
    const text = await req.text();
    if (text.length > 24e3) fault("body_too_large", 413);
    let body;
    try {
      body = JSON.parse(text);
    } catch {
      fault("bad_request", 400);
    }
    const ipHash = await digest(req.headers.get("CF-Connecting-IP") || "local");
    if (path === "challenge") {
      if (!["claim", "open", "transfer/start", "transfer/cancel", "transfer/accept", "recover", "pass/retry"].includes(body.purpose)) fault("invalid_purpose", 400);
      await call(env, "rate", { key: "challenge:" + ipHash, limit: 40 });
      return response(req, env, { ok: true, challenge: await seal(env, { purpose: body.purpose, nonce: random(), exp: Date.now() + 12e4 }, "C1") });
    }
    if (path === "resolve") {
      const d2 = await call(env, "resolve", { mHash: await digest(String(body.m || "")) });
      if (d2.state === "first_claim") {
        const map = JSON.parse(env.WALLET_EXISTING_PASSES || "{}");
        const pass = map[String(body.m || "")];
        if (!pass) fault("invalid_wallet_link", 404);
        d2.edition = pass.edition || null;
      }
      return response(req, env, d2);
    }
    if (path === "transfer/peek") {
      const t = await unseal(env, body.invite, "T1");
      return response(req, env, await call(env, "peek", { invite: t }));
    }
    let extra = {};
    if (path === "claim") {
      await call(env, "rate", { key: "claim:" + ipHash, limit: 8 });
      const p = body.payload || {}, em = emailOf(p.email), cd = String(p.code || "").trim().toUpperCase();
      if (!validEmail(em) || !/^SKY1-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(cd)) fault("invalid_claim", 400);
      const rec = await env.CODES.get(cd, "json");
      if (!rec || emailOf(rec.email) !== em || rec.status && rec.status !== "active") fault("invalid_claim");
      const pid = rec.productId || (rec.product === "299" || rec.product === "599" ? "the-sky-album" : rec.product);
      if (!["the-sky-album", "full-unlock"].includes(pid) || rec.unlockType && rec.unlockType !== "digital") fault("album_code_required");
      const mappings = JSON.parse(env.WALLET_EXISTING_PASSES || "{}");
      const pass = p.m ? mappings[p.m] : null;
      if (p.m && (!pass || !pass.ownerEmails.includes(em))) fault("pass_owner_mismatch");
      extra = { codeHash: await digest(cd), entitlement: { product: rec.product, productId: pid, unlockType: "digital" }, email: em, sourcePass: pass || null, mHash: p.m ? await digest(p.m) : null };
    }
    if (path === "transfer/accept") {
      await call(env, "rate", { key: "accept:" + ipHash, limit: 12 });
      const p = body.payload || {};
      extra.invite = await unseal(env, p.invite, "T1");
      extra.recipientProof = await digest(String(p.claimCode || "").trim().toUpperCase());
    }
    if (path === "recover") {
      await call(env, "rate", { key: "recover:" + ipHash, limit: 8 });
      const p = body.payload || {}, parts = String(p.recovery || "").trim().toUpperCase().split(".");
      if (parts.length !== 3 || parts[0] !== "OWR" || !/^[A-F0-9]{32}$/.test(parts[1]) || !/^[A-F0-9]{48}$/.test(parts[2])) fault("invalid_recovery");
      extra = { ownershipId: parts[1], recoveryHash: await digest(parts[2]), email: emailOf(p.email) };
    }
    const d = await call(env, path, { body, ...extra });
    if (path === "transfer/start") {
      const p = body.payload;
      const inviteUrl = "https://chance1228.com/test.html?wallet_transfer=" + encodeURIComponent(d.invite);
      const mail = '<p>\u6709\u4EBA\u5C07\u300ATHE SKY\u300B\u6578\u4F4D\u5C08\u8F2F\u8F49\u8B93\u7D66\u4F60\u3002</p><p><a href="' + inviteUrl + '">\u63A5\u53D7\u5C08\u8F2F</a></p><p>\u4E00\u6B21\u6027\u9818\u53D6\u78BC\uFF1A<b>' + d.claimCode + "</b></p><p>10 \u5206\u9418\u5167\u6709\u6548\u3002\u63A5\u53D7\u5F8C\u624D\u6703\u5B8C\u6210\u904E\u6236\u3002</p>";
      const sent = helpers.mail ? await helpers.mail(env, emailOf(p.toEmail), "THE SKY \u6578\u4F4D\u5C08\u8F2F\u8F49\u8B93\u9080\u8ACB", mail) : false;
      if (!sent) {
        await call(env, "delivery-failed", { ownershipId: d.ownershipId, transferId: d.transferId });
        fault("email_delivery_failed", 502);
      }
      delete d.claimCode;
      d.url = inviteUrl;
    }
    if (["claim", "recover", "transfer/accept", "pass/retry"].includes(path)) {
      const result = await syncPasses(env, d.ownership.ownership_id, d.ownership.version);
      if (result.ownership) {
        d.ownership = result.ownership;
        delete result.ownership;
      }
      d.pass = result;
    }
    return response(req, env, d);
  } catch (e) {
    return response(req, env, { ok: false, error: e.message || "wallet_error" }, e.status || 500);
  }
}
async function syncPasses(env, ownershipId, version) {
  if (!env.PASSCREATOR_API_KEY) return call(env, "pass-existing", { ownershipId, version });
  const data = await call(env, "pass-job", { ownershipId });
  if (data.busy) return { status: "pending_retry", message: "\u5361\u7247\u6B63\u5728\u66F4\u65B0\uFF0C\u8ACB\u7A0D\u5F8C\u91CD\u8A66" };
  let current = data.currentPass;
  try {
    const api = async (path, method, body) => {
      const r = await fetch("https://app.passcreator.com/api/v3/pass" + path, { method, headers: { Authorization: env.PASSCREATOR_API_KEY, "Content-Type": "application/json" }, ...body ? { body: JSON.stringify({ data: body }) } : {}, signal: AbortSignal.timeout(15e3) });
      const d = await r.json();
      if (!r.ok || d.success === false) throw new Error("passcreator_" + r.status);
      return d;
    };
    const fields = { walletOwner: data.ownerName, walletStatus: "OWNED", walletEdition: data.edition, openAlbumUrl: data.url, barcodeValue: data.url };
    for (const old of data.oldPasses) if (old.identifier && !old.synced) {
      await api("/" + encodeURIComponent(old.identifier) + "?async=false", "PATCH", { walletStatus: "TRANSFERRED", openAlbumUrl: data.oldUrl, barcodeValue: data.oldUrl });
      await call(env, "pass-old-complete", { ownershipId, identifier: old.identifier });
    }
    if (!current || !current.identifier) {
      const uniqueId = "wallet-" + ownershipId + "-v" + data.version;
      const query = btoa(JSON.stringify({ templateId: data.templateId, groups: [[{ field: "userProvidedId", operator: "equals", value: uniqueId }]] })).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
      const found = await api("?pageSize=2&query=" + query, "GET");
      let item = found.data?.find((x2) => x2.userProvidedId === uniqueId);
      if (item) {
        const updated = await api("/" + encodeURIComponent(item.identifier) + "?async=false", "PATCH", fields);
        item = { ...item, ...updated.data };
      } else {
        const created = await api("?async=false", "POST", { templateId: data.templateId, userProvidedId: uniqueId, enforceUniqueUserProvidedId: true, ...fields });
        item = created.data;
      }
      const listed = await api("?pageSize=2&query=" + query, "GET");
      const meta = listed.data?.find((x2) => x2.identifier === item?.identifier) || {};
      current = { identifier: item?.identifier, autoGeneratedId: meta.autoGeneratedId || item?.autoGeneratedId || null, serial: item?.serialNumber || null, downloadUrl: item?.downloadPage || item?.linkToPassPage || null, iPhoneUri: item?.iPhoneUri || null };
      if (!current.identifier) throw new Error("passcreator_response");
    } else {
      const updated = await api("/" + encodeURIComponent(current.identifier) + "?async=false", "PATCH", fields);
      current = { ...current, downloadUrl: updated.data?.downloadPage || current.downloadUrl, iPhoneUri: updated.data?.iPhoneUri || current.iPhoneUri };
    }
    if (!current.serial && current.iPhoneUri) {
      const u = new URL(current.iPhoneUri);
      if (u.protocol !== "https:" || !["app.passcreator.com", "www.passcreator.com"].includes(u.hostname)) throw new Error("passcreator_download_host");
      const pass = await fetch(u, { signal: AbortSignal.timeout(15e3) });
      if (!pass.ok) throw new Error("pass_download_failed");
      const zipped = new Uint8Array(await pass.arrayBuffer());
      if (zipped.length > 8 * 1024 * 1024) throw new Error("pass_too_large");
      const entries = unzipSync(zipped, { filter: (entry) => entry.name === "pass.json" && entry.originalSize < 256e3 });
      const json2 = JSON.parse(new TextDecoder().decode(entries["pass.json"]));
      current.serial = json2.serialNumber;
      current.passTypeIdentifier = json2.passTypeIdentifier;
    }
    if (!current.downloadUrl || !current.serial) throw new Error("passcreator_incomplete_pass");
    return await call(env, "pass-complete", { ownershipId, version: data.version, jobId: data.jobId, current });
  } catch (e) {
    await call(env, "pass-failed", { ownershipId, version: data.version, jobId: data.jobId, current });
    return { status: "pending_retry", message: "\u6240\u6709\u6B0A\u5DF2\u5B8C\u6210\uFF0CWallet \u5361\u7247\u66F4\u65B0\u5F85\u91CD\u8A66", error: e.message };
  }
}
function ownershipView(r) {
  return { ownership_id: r.id, album_id: r.album, edition: r.edition || null, current_owner: r.owner, status: r.status, version: r.version, wallet_serial: r.currentPass?.serial || null, wallet_identifier: r.currentPass?.identifier || null, history: r.history, transfer_pending: !!r.transfer && r.transfer.exp > Date.now() };
}
var WalletOwnership = class {
  constructor(ctx, env) {
    this.ctx = ctx;
    this.env = env;
    ctx.blockConcurrencyWhile(async () => {
      ctx.storage.sql.exec("CREATE TABLE IF NOT EXISTS wallet_state (key TEXT PRIMARY KEY, value TEXT NOT NULL)");
    });
  }
  get(k) {
    const row = this.ctx.storage.sql.exec("SELECT value FROM wallet_state WHERE key=?", k).toArray()[0];
    return row ? JSON.parse(row.value) : null;
  }
  put(k, v) {
    this.ctx.storage.sql.exec("INSERT INTO wallet_state(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value", k, JSON.stringify(v));
  }
  async fetch(req) {
    try {
      const input = await req.json(), action = new URL(req.url).pathname.slice(1);
      const d = await this.ctx.blockConcurrencyWhile(() => this.process(action, input));
      return Response.json(d);
    } catch (e) {
      return Response.json({ ok: false, error: e.message }, { status: e.status || 500 });
    }
  }
  rate(key2, limit) {
    const now = Date.now(), old = this.get("rate:" + key2), r = !old || old.until <= now ? { n: 0, until: now + 6e4 } : old;
    if (r.n >= limit) fault("rate_limited", 429);
    r.n++;
    this.put("rate:" + key2, r);
    this.ctx.storage.sql.exec("DELETE FROM wallet_state WHERE key LIKE 'rate:%' AND json_extract(value, '$.until') < ?", now);
  }
  async alarm() {
    const rows = this.ctx.storage.sql.exec("SELECT value FROM wallet_state WHERE key LIKE 'record:%'").toArray();
    let retry = false;
    for (const row of rows) {
      const r = JSON.parse(row.value);
      if (r.passStatus === "ready" && !r.oldPasses.some((p) => !p.synced)) continue;
      if ((r.syncAttempts || 0) >= 10) continue;
      r.syncAttempts = (r.syncAttempts || 0) + 1;
      this.put("record:" + r.id, r);
      const result = await syncPasses(this.env, r.id);
      if (result.status !== "ready") retry = true;
    }
    if (retry) await this.ctx.storage.setAlarm(Date.now() + 5 * 6e4);
  }
  schedulePass() {
    if (this.env.PASSCREATOR_API_KEY) this.ctx.storage.setAlarm(Date.now() + 1e4);
  }
  async process(action, i2) {
    const now = Date.now(), env = this.env;
    if (action === "rate") {
      this.rate(i2.key, i2.limit);
      return { ok: true };
    }
    if (action === "legacy") return { allowed: !this.get("legacy:" + i2.hash) };
    if (action === "resolve") {
      const id = this.get("wallet:" + i2.mHash), r2 = id && this.get("record:" + id);
      if (!r2) return { ok: true, state: "first_claim", album_id: ALBUM };
      const old = r2.oldWalletHashes.includes(i2.mHash);
      return { ok: true, state: old ? "transferred" : r2.status, ownership_id: r2.id, album_id: r2.album };
    }
    if (action === "authorize") {
      const s = i2.session, r2 = this.get("record:" + s.id);
      if (!r2 || r2.owner !== s.owner || r2.version !== s.v || r2.status !== "active" || !r2.devices[s.device]) fault("ownership_revoked", 401);
      return { ok: true, entitlement: { ...r2.entitlement, email: r2.owner, ownershipId: r2.id } };
    }
    if (action === "peek") {
      const t = i2.invite, r2 = this.get("record:" + t.id);
      if (!r2?.transfer || r2.transfer.id !== t.transfer || r2.version !== t.v || r2.transfer.exp <= now || t.exp <= now) fault("transfer_expired", 410);
      return { ok: true, album_id: r2.album, recipient_hint: r2.transfer.to.replace(/^(.).+(@.*)$/, "$1\u2022\u2022\u2022$2"), expires_at: r2.transfer.exp };
    }
    if (action === "delivery-failed") {
      const r2 = this.get("record:" + i2.ownershipId);
      if (r2?.transfer?.id === i2.transferId) {
        r2.transfer = null;
        this.put("record:" + r2.id, r2);
      }
      return { ok: true };
    }
    if (action === "pass-existing") {
      const r2 = this.get("record:" + i2.ownershipId);
      if (!r2 || r2.status !== "active") fault("not_found", 404);
      const passes = Object.entries(JSON.parse(env.WALLET_EXISTING_PASSES || "{}"));
      if (i2.version !== void 0 && i2.version !== r2.version) return { status: "stale_job", message: "\u6240\u6709\u6B0A\u5DF2\u8B8A\u66F4\uFF0C\u8ACB\u91CD\u65B0\u958B\u555F App\u3002" };
      for (const [m, pass] of passes) {
        if (!pass.identifier || !pass.serial || !pass.ownerEmails?.includes(r2.owner)) continue;
        if (r2.currentPass?.identifier && r2.currentPass.identifier !== pass.identifier) continue;
        if (r2.oldPasses.some((old) => old.identifier === pass.identifier)) continue;
        let download;
        try {
          download = new URL(pass.downloadUrl);
        } catch {
          continue;
        }
        if (download.protocol !== "https:" || download.hostname !== "app.passcreator.com") continue;
        const mHash = await digest(m), linked = this.get("wallet:" + mHash);
        if (linked && linked !== r2.id || r2.oldWalletHashes.includes(mHash)) continue;
        const other = this.ctx.storage.sql.exec("SELECT key FROM wallet_state WHERE key LIKE 'record:%' AND json_extract(value, '$.currentPass.identifier')=? AND key<>?", pass.identifier, "record:" + r2.id).toArray();
        if (other.length) continue;
        r2.currentPass = { identifier: pass.identifier, serial: pass.serial, downloadUrl: download.href, autoGeneratedId: m };
        r2.passStatus = "ready_existing";
        r2.templateId = pass.templateId || r2.templateId;
        r2.edition = pass.edition || r2.edition;
        r2.passWalletHashes = [.../* @__PURE__ */ new Set([...r2.passWalletHashes || [], mHash])];
        this.ctx.storage.transactionSync(() => {
          this.put("record:" + r2.id, r2);
          this.put("wallet:" + mHash, r2.id);
        });
        return { status: "ready_existing", downloadUrl: download.href, ownership: ownershipView(r2), message: "\u4F7F\u7528\u5DF2\u767C\u884C\u7684\u6E2C\u8A66\u5361\uFF1B\u6240\u6709\u6B0A\u7531\u4F3A\u670D\u5668\u9A57\u8B49\u3002" };
      }
      return { status: "pending_manual_card", message: "\u5C08\u8F2F\u6B0A\u9650\u5DF2\u5EFA\u7ACB\u3002\u6E2C\u8A66\u5361\u5C1A\u672A\u5C0D\u61C9\u5230\u76EE\u524D\u6301\u6709\u4EBA\uFF0C\u8ACB\u5148\u8A2D\u5B9A\u9019\u4F4D\u6301\u6709\u4EBA\u7684\u5DF2\u767C\u884C\u5361\u3002" };
    }
    if (action === "pass-job") {
      const r2 = this.get("record:" + i2.ownershipId);
      if (!r2) fault("not_found", 404);
      if (r2.passJob && r2.passJob.until > now) return { busy: true };
      r2.passJob = { id: random(), until: now + 12e4 };
      this.put("record:" + r2.id, r2);
      return { jobId: r2.passJob.id, version: r2.version, currentPass: r2.currentPass, oldPasses: r2.oldPasses, templateId: r2.templateId || env.WALLET_TEMPLATE_ID, ownerName: r2.owner.split("@")[0], edition: r2.edition || r2.id.slice(0, 6), url: r2.walletUrl, oldUrl: "https://chance1228.com/test.html?wallet_status=transferred" };
    }
    if (action === "pass-old-complete") {
      const r2 = this.get("record:" + i2.ownershipId);
      const old = r2?.oldPasses.find((x2) => x2.identifier === i2.identifier);
      if (old) {
        old.synced = true;
        this.put("record:" + r2.id, r2);
      }
      return { ok: true };
    }
    if (action === "pass-complete" || action === "pass-failed") {
      const r2 = this.get("record:" + i2.ownershipId);
      if (!r2 || r2.passJob?.id !== i2.jobId) return { status: "stale_job" };
      r2.passJob = null;
      if (r2.version !== i2.version) {
        if (i2.current?.identifier) {
          const old = r2.oldPasses.find((x2) => x2.identifier === i2.current.identifier);
          if (old) old.synced = false;
          else r2.oldPasses.push(i2.current);
        }
        this.put("record:" + r2.id, r2);
        return { status: "pending_retry", message: "\u6240\u6709\u6B0A\u5DF2\u66F4\u65B0\uFF0C\u5361\u7247\u9700\u91CD\u65B0\u540C\u6B65" };
      }
      if (i2.current?.identifier) r2.currentPass = i2.current;
      r2.passStatus = action === "pass-complete" ? "ready" : "pending_retry";
      this.put("record:" + r2.id, r2);
      if (i2.current?.autoGeneratedId) {
        const mHash = await digest(i2.current.autoGeneratedId);
        this.put("wallet:" + mHash, r2.id);
        r2.passWalletHashes = [.../* @__PURE__ */ new Set([...r2.passWalletHashes || [], mHash])];
        this.put("record:" + r2.id, r2);
      }
      return { status: r2.passStatus, downloadUrl: action === "pass-complete" ? i2.current.downloadUrl : null };
    }
    const body = i2.body || {}, p = body.payload || {};
    let r, jwk, challenge, recovery;
    if (action === "claim") {
      jwk = pubOnly(p.publicKey);
      challenge = await verifyProof(env, body, action, jwk);
      const did = await deviceId(jwk), existing = this.get("legacy:" + i2.codeHash);
      r = existing && this.get("record:" + existing);
      if (r && (r.owner !== i2.email || !r.devices[did])) fault("code_already_claimed");
      if (i2.mHash) {
        const linked = this.get("wallet:" + i2.mHash);
        if (linked && (!r || linked !== r.id)) fault("pass_already_linked");
      }
      if (!r) {
        const id = random().slice(0, 32);
        r = { id, album: ALBUM, owner: i2.email, status: "active", version: 1, entitlement: i2.entitlement, devices: {}, oldPasses: [], oldWalletHashes: [], history: [{ type: "claim", at: now, to: i2.email }], transfer: null, templateId: i2.sourcePass?.templateId || env.WALLET_TEMPLATE_ID, edition: i2.sourcePass?.edition || null, currentPass: i2.sourcePass ? { identifier: i2.sourcePass.identifier, serial: i2.sourcePass.serial, downloadUrl: i2.sourcePass.downloadUrl || null } : null };
        r.devices[did] = jwk;
        recovery = random();
        r.recoveryHash = await digest(recovery);
        r.walletToken = await seal(env, { id, v: 1, kind: "wallet", exp: now + 10 * 365 * 864e5 }, "L1");
        r.walletHash = await digest(r.walletToken);
        r.walletUrl = "https://chance1228.com/test.html?m=" + encodeURIComponent(r.walletToken);
        r.originalWalletHash = i2.mHash;
      }
      this.consume(challenge);
      this.ctx.storage.transactionSync(() => {
        this.put("record:" + r.id, r);
        this.put("legacy:" + i2.codeHash, r.id);
        this.put("wallet:" + r.walletHash, r.id);
        if (i2.mHash) this.put("wallet:" + i2.mHash, r.id);
      });
      this.schedulePass();
      return this.result(r, did, recovery);
    }
    if (action === "recover" || action === "transfer/accept") {
      jwk = pubOnly(p.publicKey);
      challenge = await verifyProof(env, body, action, jwk);
      const id = action === "recover" ? i2.ownershipId : i2.invite.id;
      r = this.get("record:" + id);
      if (!r || r.status !== "active") fault("not_found", 404);
      if (action === "recover") {
        if (r.owner !== i2.email || !equal(r.recoveryHash, i2.recoveryHash)) fault("invalid_recovery");
        r.version++;
        r.devices = {};
        r.history.push({ type: "recovery", at: now, to: r.owner });
        r.transfer = null;
      } else {
        const t = r.transfer;
        if (!t || t.id !== i2.invite.transfer || i2.invite.v !== r.version || t.exp <= now || i2.invite.exp <= now) fault("transfer_expired", 410);
        if (emailOf(p.email) !== t.to || !equal(t.claimHash, i2.recipientProof)) fault("invalid_recipient");
        const from = r.owner;
        r.owner = t.to;
        r.version++;
        r.devices = {};
        r.transfer = null;
        if (r.currentPass) r.oldPasses.push(r.currentPass);
        r.currentPass = null;
        r.oldWalletHashes.push(r.walletHash, ...r.passWalletHashes || []);
        r.passWalletHashes = [];
        if (r.originalWalletHash) r.oldWalletHashes.push(r.originalWalletHash);
        r.history.push({ type: "transfer", at: now, from, to: r.owner, transfer_id: t.id });
        r.walletToken = await seal(env, { id: r.id, v: r.version, kind: "wallet", exp: now + 10 * 365 * 864e5 }, "L1");
        r.walletHash = await digest(r.walletToken);
        r.walletUrl = "https://chance1228.com/test.html?m=" + encodeURIComponent(r.walletToken);
      }
      const did = await deviceId(jwk);
      r.devices[did] = jwk;
      recovery = random();
      r.recoveryHash = await digest(recovery);
      this.consume(challenge);
      this.ctx.storage.transactionSync(() => {
        this.put("record:" + r.id, r);
        this.put("wallet:" + r.walletHash, r.id);
      });
      r.passStatus = "pending";
      r.syncAttempts = 0;
      this.put("record:" + r.id, r);
      this.schedulePass();
      return this.result(r, did, recovery);
    }
    const credential = await unseal(env, p.credential, "D1");
    r = this.get("record:" + credential.id);
    if (!r || r.owner !== credential.owner || r.version !== credential.v || r.status !== "active") fault("ownership_revoked", 401);
    jwk = r.devices[credential.device];
    if (!jwk) fault("device_revoked", 401);
    challenge = await verifyProof(env, body, action, jwk);
    if (action === "open") {
      if (p.m) {
        const mHash = await digest(p.m);
        if (this.get("wallet:" + mHash) !== r.id || r.oldWalletHashes.includes(mHash)) fault("pass_transferred", 410);
      }
      this.consume(challenge);
      return this.result(r, credential.device);
    }
    if (action === "transfer/start") {
      const to = emailOf(p.toEmail);
      if (!validEmail(to) || to === r.owner) fault("invalid_recipient", 400);
      const claimCode = random().slice(0, 16), tid = random(), exp = now + TRANSFER_MS;
      r.transfer = { id: tid, to, exp, claimHash: await digest(claimCode) };
      const invite = await seal(env, { id: r.id, v: r.version, transfer: tid, exp }, "T1");
      this.consume(challenge);
      this.put("record:" + r.id, r);
      return { ok: true, invite, claimCode, expires_at: exp, ownershipId: r.id, transferId: tid };
    }
    if (action === "transfer/cancel") {
      this.consume(challenge);
      r.transfer = null;
      this.put("record:" + r.id, r);
      return { ok: true, ownership: ownershipView(r) };
    }
    if (action === "pass/retry") {
      this.consume(challenge);
      return this.result(r, credential.device);
    }
    fault("not_found", 404);
  }
  consume(c) {
    if (this.get("nonce:" + c.nonce)) fault("challenge_replayed", 409);
    this.put("nonce:" + c.nonce, c.exp);
    this.ctx.storage.sql.exec("DELETE FROM wallet_state WHERE key LIKE 'nonce:%' AND CAST(value AS INTEGER) < ?", Date.now());
  }
  async result(r, did, recovery) {
    const now = Date.now();
    return {
      ok: true,
      ownership: ownershipView(r),
      email: r.owner,
      product: r.entitlement.product,
      productId: r.entitlement.productId,
      session: await seal(this.env, { id: r.id, owner: r.owner, v: r.version, device: did, kind: "session", exp: now + SESSION_MS }, "W1"),
      expires_at: now + SESSION_MS,
      credential: await seal(this.env, { id: r.id, owner: r.owner, v: r.version, device: did, kind: "device", exp: now + 90 * 864e5 }, "D1"),
      wallet_url: r.walletUrl,
      recovery_code: recovery ? "OWR." + r.id + "." + recovery : void 0,
      pass: { status: r.passStatus || "pending", downloadUrl: r.currentPass?.downloadUrl || null }
    };
  }
};

// outputs/wallet-v1/worker.js
var DEMO_CODES = {};
var PROTECTED_FILES = /* @__PURE__ */ new Set([
  "sky/01.mp3",
  "sky/02.mp3",
  "sky/03.mp3",
  // I'm Sorry
  "feed/04.mp4"
  // B25：SIGNAL 影片 01（I'M SORRY 幕後）
]);
var FILE_PRODUCT = {
  "feed/04.mp4": "video-01"
};
var PROTECTED_WAV_FILES = /* @__PURE__ */ new Set([
  // "sky/wav/04.wav", "sky/wav/05.wav", ...
]);
var PRODUCTS = {
  "the-sky-album": { productId: "the-sky-album", name: "THE SKY \u6578\u4F4D\u5C08\u8F2F", price: 299, unlockType: "digital", itemName: "THE SKY \u6578\u4F4D\u5C08\u8F2F#299" },
  "full-unlock": { productId: "full-unlock", name: "THE SKY \u5168\u89E3\u9396\uFF08\u5C08\u8F2F+SIGNAL\u983B\u9053+\u7368\u5BB6\u5F71\u7247\uFF09", price: 799, unlockType: "digital", itemName: "THE SKY \u5168\u89E3\u9396#799" },
  "upgrade-799": { productId: "upgrade-799", name: "\u5168\u89E3\u9396\u5347\u7D1A\uFF08\u5DF2\u6709\u5C08\u8F2F\u88DC\u5DEE\u984D\uFF09", price: 500, unlockType: "digital", itemName: "THE SKY \u5168\u89E3\u9396\u5347\u7D1A#500" },
  "feed-pass": { productId: "feed-pass", name: "SIGNAL \u79C1\u8A0A\u983B\u9053\uFF08\u9810\u8CFC\uFF09", price: 499, unlockType: "digital", itemName: "SIGNAL \u79C1\u8A0A\u983B\u9053 \u9810\u8CFC#499" },
  "video-01": { productId: "video-01", name: "SIGNAL \u7368\u5BB6\u5F71\u7247 I'M SORRY \u5E55\u5F8C", price: 99, unlockType: "digital", itemName: "SIGNAL \u5F71\u724701#99" },
  "ticket-normal": { productId: "ticket-normal", name: "THE SKY \u807D\u7247\u6703 \u4E00\u822C\u7968(\u9810\u8CFC)", price: 1350, unlockType: "ticket", itemName: "THE SKY \u807D\u7247\u6703\u4E00\u822C\u7968 \u9810\u8CFC#1350" },
  "ticket-vip": { productId: "ticket-vip", name: "THE SKY \u807D\u7247\u6703 VIP\u7968(\u9810\u8CFC)", price: 2250, unlockType: "ticket", itemName: "THE SKY \u807D\u7247\u6703VIP\u7968 \u9810\u8CFC#2250" },
  "bracelet": { productId: "bracelet", name: "CHANCE \u7D2B\u706B\u9650\u91CF\u624B\u93C8", price: 6280, unlockType: "physical", itemName: "CHANCE \u7D2B\u706B\u9650\u91CF\u624B\u93C8#6280" },
  "photobook": { productId: "photobook", name: "THE SKY \u88FD\u4F5C\u5BEB\u771F", price: 680, unlockType: "physical", itemName: "THE SKY \u88FD\u4F5C\u5BEB\u771F#680" }
};
function corsHeaders(request, env) {
  const allowed = (env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
  const origin = request.headers.get("Origin") || "";
  const allow = allowed.includes(origin) ? origin : allowed[0] || "*";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Range",
    "Access-Control-Expose-Headers": "Content-Range,Accept-Ranges,Content-Length",
    "Vary": "Origin"
  };
}
function json(data, status, request, env) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders(request, env) }
  });
}
function genCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  let s = "";
  for (let i2 = 0; i2 < 8; i2++) s += chars[bytes[i2] % chars.length];
  return `SKY1-${s.slice(0, 4)}-${s.slice(4, 8)}`;
}
async function verifyStripeSignature(body, sigHeader, secret) {
  if (!sigHeader) return false;
  const parts = {};
  for (const kv of sigHeader.split(",")) {
    const idx = kv.indexOf("=");
    if (idx === -1) continue;
    parts[kv.slice(0, idx)] = kv.slice(idx + 1);
  }
  if (!parts.t || !parts.v1) return false;
  const signedPayload = `${parts.t}.${body}`;
  const key2 = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sigBuf = await crypto.subtle.sign("HMAC", key2, new TextEncoder().encode(signedPayload));
  const expectedHex = [...new Uint8Array(sigBuf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  if (expectedHex.length !== parts.v1.length) return false;
  let diff = 0;
  for (let i2 = 0; i2 < expectedHex.length; i2++) diff |= expectedHex.charCodeAt(i2) ^ parts.v1.charCodeAt(i2);
  return diff === 0;
}
async function sendRedeemEmail(env, email, code, product) {
  const productName = product === "599" ? "THE SKY \u5178\u85CF\u7248\uFF08+WAV\uFF09" : "THE SKY \u6578\u4F4D\u5C08\u8F2F";
  const html = `
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;padding:32px;color:#0d1420;background:#f4f8ff">
      <h2 style="color:#0d1420">\u611F\u8B1D\u8CFC\u8CB7\u300ATHE SKY\u300B</h2>
      <p>\u60A8\u8CFC\u8CB7\u7684\u65B9\u6848\uFF1A<b>${productName}</b></p>
      <p>\u8ACB\u56DE\u5230 app \u7684\u300C\u89E3\u9396\u300D\u9801\uFF0C\u8F38\u5165\u4EE5\u4E0B\u8CC7\u8A0A\uFF1A</p>
      <p style="margin:4px 0">Email\uFF1A${email}</p>
      <p style="font-size:22px;font-weight:bold;letter-spacing:2px;color:#7fa6c9;margin:8px 0">\u514C\u63DB\u78BC\uFF1A${code}</p>
      <p style="font-size:13px;color:#6b7a90">\u8ACB\u4FDD\u7559\u9019\u5C01\u4FE1\uFF0C\u4E4B\u5F8C\u5728\u5176\u4ED6\u88DD\u7F6E\u4E0A\u4E5F\u80FD\u7528\u9019\u7D44 Email + \u514C\u63DB\u78BC\u89E3\u9396\u3002</p>
    </div>`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.RESEND_FROM || "THE SKY <noreply@ceon0693.uk>",
      to: email,
      subject: "\u300ATHE SKY\u300BOST \u514C\u63DB\u78BC",
      html
    })
  });
  if (!res.ok) console.log("Resend send failed", res.status, await res.text());
}
async function handleStripeWebhook(request, env) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");
  const ok = await verifyStripeSignature(body, sig, env.STRIPE_WEBHOOK_SECRET);
  if (!ok) return new Response("invalid signature", { status: 400 });
  let event;
  try {
    event = JSON.parse(body);
  } catch {
    return new Response("bad json", { status: 400 });
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const email = session.customer_details?.email || session.customer_email;
    if (email) {
      const amount = session.amount_total || 0;
      const product = amount >= 45e3 ? "599" : "299";
      const code = genCode();
      await env.CODES.put(code, JSON.stringify({ email, product, ts: Date.now() }));
      await sendRedeemEmail(env, email, code, product);
    }
  }
  return new Response("ok", { status: 200 });
}
async function handleVerify(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, message: "bad request" }, 400, request, env);
  }
  const email = (body.email || "").trim().toLowerCase();
  const code = (body.code || "").trim().toUpperCase();
  if (!email || !code) return json({ ok: false, message: "\u8ACB\u8F38\u5165 email \u548C\u514C\u63DB\u78BC" }, 400, request, env);
  if (DEMO_CODES[code]) {
    const demo = DEMO_CODES[code];
    if (demo.email !== email) return json({ ok: false, message: "\u514C\u63DB\u78BC\u6216 email \u4E0D\u6B63\u78BA" }, 403, request, env);
    return json({ ok: true, product: demo.product, productId: demo.productId || null }, 200, request, env);
  }
  const rec = await env.CODES.get(code);
  if (!rec) return json({ ok: false, message: "\u514C\u63DB\u78BC\u6216 email \u4E0D\u6B63\u78BA" }, 404, request, env);
  const data = JSON.parse(rec);
  if ((data.email || "").trim().toLowerCase() !== email) {
    return json({ ok: false, message: "\u514C\u63DB\u78BC\u6216 email \u4E0D\u6B63\u78BA" }, 403, request, env);
  }
  if (data.status && data.status !== "active") return json({ ok: false, message: "\u9019\u7D44\u514C\u63DB\u78BC\u5DF2\u5931\u6548" }, 403, request, env);
  if (canUnlockAlbum(data) && !await walletLegacyAllowed(env, code)) return json({ ok: false, message: "\u9019\u7D44\u78BC\u5DF2\u9818\u53D6\uFF0C\u8ACB\u5F9E Wallet \u958B\u555F\u6216\u4F7F\u7528\u6700\u65B0\u6062\u5FA9\u78BC" }, 403, request, env);
  if (!canUnlockAlbum(data)) {
    return json({ ok: false, message: "\u9019\u7D44\u662F\u5546\u54C1\u8A02\u55AE\u7DE8\u865F\uFF0C\u4E0D\u662F\u5C08\u8F2F\u514C\u63DB\u78BC" }, 403, request, env);
  }
  return json({ ok: true, product: data.product, productId: data.productId || null }, 200, request, env);
}
function canUnlockAlbum(data) {
  if (!data) return false;
  if (data.unlockType) return data.unlockType === "digital";
  return data.product === "299" || data.product === "599";
}
async function authenticate(env, email, code) {
  if (!email || !code) return null;
  if (String(code).startsWith("W1.")) return walletAuthenticate(env, email, code);
  if (DEMO_CODES[code]) {
    const demo = DEMO_CODES[code];
    return demo.email === email ? demo : null;
  }
  const rec = await env.CODES.get(code);
  if (!rec) return null;
  const data = JSON.parse(rec);
  if ((data.email || "").trim().toLowerCase() !== email) return null;
  if (data.status && data.status !== "active") return null;
  if (canUnlockAlbum(data) && !await walletLegacyAllowed(env, code)) return null;
  return data;
}
async function handleTrack(request, env, url) {
  const file = url.searchParams.get("file") || "";
  const email = (url.searchParams.get("email") || "").trim().toLowerCase();
  const code = (url.searchParams.get("code") || "").trim().toUpperCase();
  if (!PROTECTED_FILES.has(file)) {
    return new Response("not found", { status: 404, headers: corsHeaders(request, env) });
  }
  const data = await authenticate(env, email, code);
  if (!data) return new Response("unauthorized", { status: 401, headers: corsHeaders(request, env) });
  if (!canUnlockAlbum(data)) return new Response("forbidden", { status: 403, headers: corsHeaders(request, env) });
  const needPid = FILE_PRODUCT[file] || null;
  const pid = data.productId || (String(data.product) === "299" || String(data.product) === "599" ? "the-sky-album" : "");
  const allowed = needPid ? pid === needPid || pid === "full-unlock" || pid === "upgrade-799" : pid === "the-sky-album" || pid === "full-unlock";
  if (!allowed) {
    return new Response("forbidden", { status: 403, headers: corsHeaders(request, env) });
  }
  const headers = new Headers(corsHeaders(request, env));
  headers.set("accept-ranges", "bytes");
  headers.set("cache-control", "private, max-age=0, must-revalidate");
  const rangeHeader = request.headers.get("range");
  if (rangeHeader) {
    const head = await env.AUDIO.head(file);
    if (!head) return new Response("file not found", { status: 404, headers: corsHeaders(request, env) });
    const size = head.size;
    const m = /bytes=(\d*)-(\d*)/.exec(rangeHeader);
    let start = m && m[1] ? parseInt(m[1], 10) : 0;
    let end = m && m[2] ? parseInt(m[2], 10) : size - 1;
    if (isNaN(start) || start < 0) start = 0;
    if (isNaN(end) || end >= size) end = size - 1;
    const obj2 = await env.AUDIO.get(file, { range: { offset: start, length: end - start + 1 } });
    obj2.writeHttpMetadata(headers);
    headers.set("etag", obj2.httpEtag);
    if (!headers.get("content-type")) headers.set("content-type", file.endsWith(".wav") ? "audio/wav" : file.endsWith(".mp4") ? "video/mp4" : "audio/mpeg");
    headers.set("content-range", `bytes ${start}-${end}/${size}`);
    headers.set("content-length", String(end - start + 1));
    return new Response(obj2.body, { status: 206, headers });
  }
  const obj = await env.AUDIO.get(file);
  if (!obj) return new Response("file not found", { status: 404, headers: corsHeaders(request, env) });
  obj.writeHttpMetadata(headers);
  headers.set("etag", obj.httpEtag);
  if (!headers.get("content-type")) headers.set("content-type", file.endsWith(".wav") ? "audio/wav" : file.endsWith(".mp4") ? "video/mp4" : "audio/mpeg");
  return new Response(obj.body, { headers });
}
async function handleDownload(request, env, url) {
  const file = url.searchParams.get("file") || "";
  const email = (url.searchParams.get("email") || "").trim().toLowerCase();
  const code = (url.searchParams.get("code") || "").trim().toUpperCase();
  if (!PROTECTED_WAV_FILES.has(file)) {
    return new Response("not found", { status: 404, headers: corsHeaders(request, env) });
  }
  const data = await authenticate(env, email, code);
  if (!data) return new Response("unauthorized", { status: 401, headers: corsHeaders(request, env) });
  if (data.product !== "599") {
    return new Response("upgrade required", { status: 403, headers: corsHeaders(request, env) });
  }
  const obj = await env.AUDIO.get(file);
  if (!obj) return new Response("file not found", { status: 404, headers: corsHeaders(request, env) });
  const headers = new Headers(corsHeaders(request, env));
  obj.writeHttpMetadata(headers);
  headers.set("etag", obj.httpEtag);
  if (!headers.get("content-type")) headers.set("content-type", "audio/wav");
  headers.set("content-disposition", `attachment; filename="${file.split("/").pop()}"`);
  headers.set("cache-control", "private, max-age=0, must-revalidate");
  return new Response(obj.body, { headers });
}
async function handleInterest(request, env) {
  let body;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return json({ ok: false, message: "bad request" }, 400, request, env);
  }
  const email = String(body.email || "").trim().toLowerCase();
  const event = String(body.event || "listen-0220").trim().slice(0, 40) || "listen-0220";
  if (!isValidEmail(email)) return json({ ok: false, message: "\u8ACB\u8F38\u5165\u6B63\u78BA\u7684 email" }, 400, request, env);
  const key2 = "interest:" + event + ":" + email;
  const existed = await env.CODES.get(key2);
  if (!existed) {
    await env.CODES.put(key2, JSON.stringify({ email, event, ts: Date.now() }));
  }
  return json({ ok: true, already: !!existed }, 200, request, env);
}
async function handleInterestCount(request, env, url) {
  const adminKey = env.ADMIN_KEY || "";
  if (!adminKey || (url.searchParams.get("key") || "") !== adminKey) {
    return json({ ok: false, message: "not found" }, 404, request, env);
  }
  const event = String(url.searchParams.get("event") || "listen-0220").slice(0, 40);
  let count = 0, cursor = void 0, emails = [];
  do {
    const page = await env.CODES.list({ prefix: "interest:" + event + ":", cursor });
    count += page.keys.length;
    for (const k of page.keys) emails.push(k.name.split(":").pop());
    cursor = page.list_complete ? void 0 : page.cursor;
  } while (cursor);
  return json({ ok: true, event, count, emails }, 200, request, env);
}
var ECPAY_PLAYER_URL = "https://chance1228.com/";
function ecpayConfig(env) {
  const prod = (env.ECPAY_ENV || "stage").toLowerCase() === "prod";
  return {
    action: (prod ? "https://payment.ecpay.com.tw" : "https://payment-stage.ecpay.com.tw") + "/Cashier/AioCheckOut/V5",
    merchantId: env.ECPAY_MERCHANT_ID || "",
    hashKey: env.ECPAY_HASH_KEY || "",
    hashIV: env.ECPAY_HASH_IV || ""
  };
}
function ecpayUrlEncode(s) {
  return encodeURIComponent(s).replace(/%20/g, "+").replace(/~/g, "%7E").replace(/'/g, "%27").toLowerCase();
}
async function ecpayCheckMac(params, hashKey, hashIV) {
  const keys = Object.keys(params).filter((k) => k !== "CheckMacValue").sort((a, b) => a.toLowerCase() < b.toLowerCase() ? -1 : 1);
  const raw = "HashKey=" + hashKey + "&" + keys.map((k) => k + "=" + params[k]).join("&") + "&HashIV=" + hashIV;
  const digest2 = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ecpayUrlEncode(raw)));
  return [...new Uint8Array(digest2)].map((b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
}
function escapeHtmlAttr(s) {
  return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function isValidEmail(email) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(email || "").trim());
}
var orderKey = (tno) => "order:" + tno;
async function sendProductEmail(env, email, code, P, amount) {
  const isDigital = P.unlockType === "digital";
  const isTicket = P.unlockType === "ticket";
  const codeBlock = isDigital ? `
      <p>\u8ACB\u56DE\u5230 App \u7684\u300C\u64C1\u6709\u300D\u9801\uFF0C\u8F38\u5165\u4EE5\u4E0B\u8CC7\u8A0A\u89E3\u9396\uFF1A</p>
      <p style="margin:4px 0">Email\uFF1A${email}</p>
      <p style="font-size:22px;font-weight:bold;letter-spacing:2px;color:#7fa6c9;margin:8px 0">\u514C\u63DB\u78BC\uFF1A${code}</p>
      <p style="font-size:13px;color:#6b7a90">\u8ACB\u4FDD\u7559\u9019\u5C01\u4FE1\uFF0C\u63DB\u88DD\u7F6E\u4E5F\u80FD\u7528\u9019\u7D44 Email + \u514C\u63DB\u78BC\u89E3\u9396\u3002</p>` : isTicket ? `
      <p style="margin:4px 0">\u8A02\u55AE\u7DE8\u865F\uFF1A<b>${code}</b></p>
      <p>\u9019\u662F <b>2027.02.20 \u807D\u7247\u6703</b>\u7684\u9810\u8CFC\u6191\u8B49\uFF0C\u5165\u5834\u65B9\u5F0F\u6703\u5728\u6D3B\u52D5\u524D\u4E00\u9031\u4EE5 email \u901A\u77E5\u3002</p>
      <p style="font-size:13px;color:#6b7a90">\u8ACB\u4FDD\u7559\u9019\u5C01\u4FE1\uFF0C\u5165\u5834\u6642\u9700\u8981\u51FA\u793A\u8A02\u55AE\u7DE8\u865F\u3002</p>` : `
      <p style="margin:4px 0">\u8A02\u55AE\u7DE8\u865F\uFF1A<b>${code}</b></p>
      <p>\u6211\u5011\u6703\u5728 7 \u500B\u5DE5\u4F5C\u5929\u5167\u5B89\u6392\u51FA\u8CA8\uFF0C\u51FA\u8CA8\u5F8C\u6703\u518D\u5BC4\u4E00\u5C01\u901A\u77E5\u4FE1\u3002</p>
      <p style="font-size:13px;color:#6b7a90">\u5982\u9700\u4FEE\u6539\u6536\u4EF6\u8CC7\u8A0A\uFF0C\u8ACB\u76F4\u63A5\u56DE\u8986\u9019\u5C01\u4FE1\u3002</p>`;
  const html = `
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;padding:32px;color:#0d1420;background:#f4f8ff">
      <h2 style="color:#0d1420">\u611F\u8B1D\u8CFC\u8CB7\u300ATHE SKY\u300B</h2>
      <p>\u60A8\u8CFC\u8CB7\u7684\u5546\u54C1\uFF1A<b>${P.name}</b>\u3000NT$${amount}</p>
      ${codeBlock}
    </div>`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.RESEND_FROM || "THE SKY <noreply@ceon0693.uk>",
      to: email,
      subject: isDigital ? "\u300ATHE SKY\u300B\u514C\u63DB\u78BC" : `\u300ATHE SKY\u300B\u8A02\u55AE\u78BA\u8A8D \xB7 ${P.name}`,
      html
    })
  });
  if (!res.ok) {
    console.log("Resend send failed", res.status, await res.text());
    return false;
  }
  return true;
}
async function handleEcpayCreate(request, env, url) {
  let productKey = "", email = "", buyerName = "", backPath = "";
  if (request.method === "GET") {
    productKey = url.searchParams.get("productKey") || "";
    email = url.searchParams.get("email") || "";
    buyerName = url.searchParams.get("name") || "";
    backPath = url.searchParams.get("back") || "";
  } else {
    try {
      const b = JSON.parse(await request.text());
      productKey = b.productKey || "";
      email = b.email || "";
      buyerName = b.name || "";
      backPath = b.back || "";
    } catch {
      return json({ ok: false, message: "bad request" }, 400, request, env);
    }
  }
  buyerName = String(buyerName).trim().slice(0, 40);
  email = String(email).trim().toLowerCase();
  if (!isValidEmail(email)) return json({ ok: false, message: "\u8ACB\u8F38\u5165\u6B63\u78BA\u7684 email" }, 400, request, env);
  let P = PRODUCTS[productKey], tkExtra = null;
  if (!P) {
    const tp = await tkProduct(env, productKey, email);
    if (tp && !tp.ok) return json({ ok: false, message: tp.message }, tp.status || 409, request, env);
    if (tp && tp.ok) {
      P = tp.product;
      tkExtra = tp.extra;
    }
  }
  if (!P) return json({ ok: false, message: "unknown product" }, 400, request, env);
  if (productKey === "feed-pass" || productKey === "video-01") {
    return json({ ok: false, message: "\u6B64\u5546\u54C1\u5DF2\u505C\u552E\uFF0C\u8ACB\u8CFC\u8CB7\u5168\u89E3\u9396\uFF08NT$799\uFF09\u6216\u5347\u7D1A\uFF08NT$500\uFF09" }, 410, request, env);
  }
  if (P.unlockType === "ticket") {
    const tier = P.productId === "ticket-vip" ? "vip" : "ga";
    try {
      const av = await (await env.TIX.fetch("https://tix/api/availability")).json();
      if (!av || !av[tier] || av[tier].left <= 0) {
        return json({ ok: false, message: (tier === "vip" ? "VIP\u7968" : "\u4E00\u822C\u7968") + "\u5DF2\u5B8C\u552E" }, 409, request, env);
      }
    } catch (e) {
      console.log("availability check failed", String(e));
      return json({ ok: false, message: "\u7968\u52D9\u7CFB\u7D71\u66AB\u6642\u7121\u6CD5\u9023\u7DDA\uFF0C\u8ACB\u7A0D\u5F8C\u518D\u8A66" }, 503, request, env);
    }
  }
  const cfg = ecpayConfig(env);
  if (!cfg.merchantId || !cfg.hashKey || !cfg.hashIV) {
    return json({ ok: false, message: "ECPay \u5C1A\u672A\u8A2D\u5B9A\uFF08\u74B0\u5883\u8B8A\u6578\uFF09" }, 500, request, env);
  }
  const now = new Date(Date.now() + 8 * 3600 * 1e3);
  const p2 = (n) => String(n).padStart(2, "0");
  const tradeDate = now.getUTCFullYear() + "/" + p2(now.getUTCMonth() + 1) + "/" + p2(now.getUTCDate()) + " " + p2(now.getUTCHours()) + ":" + p2(now.getUTCMinutes()) + ":" + p2(now.getUTCSeconds());
  const rand = crypto.getRandomValues(new Uint8Array(3));
  const tradeNo = ("SKY" + Date.now().toString(36) + Array.from(rand).map((b) => (b % 36).toString(36)).join("")).toUpperCase().slice(0, 20);
  await env.CODES.put(orderKey(tradeNo), JSON.stringify({
    merchantTradeNo: tradeNo,
    productKey,
    productId: P.productId,
    productName: P.name,
    unlockType: P.unlockType,
    amount: P.price,
    email,
    buyerName,
    ...tkExtra || {},
    status: "pending",
    paymentStatus: "pending",
    ecpayTradeNo: null,
    redeemCode: null,
    emailSent: false,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    paidAt: null
  }));
  const params = {
    MerchantID: cfg.merchantId,
    MerchantTradeNo: tradeNo,
    MerchantTradeDate: tradeDate,
    PaymentType: "aio",
    TotalAmount: String(P.price),
    // 金額由後端 PRODUCTS 決定，不信前端
    TradeDesc: "THE SKY",
    ItemName: P.itemName,
    ReturnURL: url.origin + "/ecpay-notify",
    ChoosePayment: "Credit",
    EncryptType: "1",
    CustomField1: P.productId,
    CustomField2: P.unlockType,
    CustomField3: tradeNo,
    ClientBackURL: tkExtra ? ECPAY_PLAYER_URL + (/^[A-Za-z0-9._-]{0,40}$/.test(backPath) ? backPath : "") + "?" + (P.unlockType === "pp" ? "tkphoto" : "tkbought") + "=" + tkExtra.eventId : ECPAY_PLAYER_URL
  };
  params.CheckMacValue = await ecpayCheckMac(params, cfg.hashKey, cfg.hashIV);
  const inputs = Object.entries(params).map(([k, v]) => '<input type="hidden" name="' + k + '" value="' + escapeHtmlAttr(v) + '">').join("");
  const html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>\u524D\u5F80\u7DA0\u754C\u4ED8\u6B3E</title></head><body style="background:#07111F;color:#DDEBFF;font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh"><form method="post" action="' + cfg.action + '">' + inputs + "</form><p>\u6B63\u5728\u524D\u5F80\u7DA0\u754C\u5B89\u5168\u4ED8\u6B3E\u9801\u2026</p><script>document.forms[0].submit()</script></body></html>";
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", ...corsHeaders(request, env) } });
}
async function handleEcpayNotify(request, env) {
  const bodyText = await request.text();
  const params = {};
  for (const [k, v] of new URLSearchParams(bodyText)) params[k] = v;
  const cfg = ecpayConfig(env);
  const received = (params.CheckMacValue || "").toUpperCase();
  const expected = await ecpayCheckMac(params, cfg.hashKey, cfg.hashIV);
  if (!received || received !== expected) {
    return new Response("0|CheckMacValue Error", { status: 400, headers: { "content-type": "text/plain" } });
  }
  if (String(params.RtnCode) === "1") {
    const tradeNo = params.MerchantTradeNo || "";
    const amt = parseInt(params.TradeAmt || params.TotalAmount || "0", 10) || 0;
    const oRaw = tradeNo ? await env.CODES.get(orderKey(tradeNo)) : null;
    if (oRaw) {
      const o = JSON.parse(oRaw);
      if (o.status === "paid") return new Response("1|OK", { headers: { "content-type": "text/plain" } });
      if (amt !== o.amount) {
        console.log("ecpay-notify amount mismatch", tradeNo, amt, o.amount);
        return new Response("1|OK", { headers: { "content-type": "text/plain" } });
      }
      if (o.unlockType === "meet" || o.unlockType === "pp") {
        await tkOnPaid(env, o, tradeNo, params);
        await env.CODES.put(orderKey(tradeNo), JSON.stringify(o));
        return new Response("1|OK", { headers: { "content-type": "text/plain" } });
      }
      const code = genCode();
      await env.CODES.put(code, JSON.stringify({
        email: o.email,
        product: o.unlockType === "digital" ? o.productId === "the-sky-album" ? "299" : o.productId : o.productKey,
        // digital 才給解鎖權；專輯維持 "299" 不動（舊碼相容）
        productId: o.productId,
        unlockType: o.unlockType,
        merchantTradeNo: tradeNo,
        status: "active",
        ts: Date.now(),
        via: "ecpay"
      }));
      o.status = "paid";
      o.paymentStatus = "paid";
      o.ecpayTradeNo = params.TradeNo || null;
      o.redeemCode = code;
      o.paidAt = (/* @__PURE__ */ new Date()).toISOString();
      if (o.unlockType === "ticket") {
        const tier = o.productId === "ticket-vip" ? "vip" : "ga";
        let tj = null;
        try {
          const tr = await env.TIX.fetch("https://tix/api/issue", {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Issue-Key": env.TICKET_ISSUE_KEY },
            body: JSON.stringify({ tier, email: o.email, name: o.buyerName || "", price: o.amount, orderRef: tradeNo })
          });
          tj = await tr.json();
        } catch (e) {
          tj = { ok: false, error: "network:" + String(e) };
        }
        o.ticket = tj && tj.ok ? { ok: true, token: tj.token, seat: tj.seat, url: tj.url, emailed: !!tj.emailed } : { ok: false, error: tj && tj.error || "issue_failed" };
        if (o.ticket.ok) {
          o.emailSent = true;
        } else {
          await env.CODES.put("ticket:failed:" + tradeNo, JSON.stringify({
            email: o.email,
            tier,
            amount: o.amount,
            reason: o.ticket.error,
            ts: Date.now()
          }));
          o.emailSent = await sendProductEmail(env, o.email, code, { name: o.productName, unlockType: o.unlockType }, o.amount);
        }
      } else {
        o.emailSent = await sendProductEmail(env, o.email, code, { name: o.productName, unlockType: o.unlockType }, o.amount);
      }
      await env.CODES.put(orderKey(tradeNo), JSON.stringify(o));
      await env.CODES.put("ecpay:tno:" + tradeNo, code);
    }
  }
  return new Response("1|OK", { headers: { "content-type": "text/plain" } });
}
async function handleCardsSave(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return json({ ok: false, message: "bad request" }, 400, request, env);
  }
  const email = (body.email || "").trim().toLowerCase();
  const code = (body.code || "").trim().toUpperCase();
  const data = await authenticate(env, email, code);
  if (!data) return json({ ok: false, message: "unauthorized" }, 401, request, env);
  const owned = body.owned && typeof body.owned === "object" ? body.owned : {};
  let prev = {};
  try {
    const pr = await env.CODES.get("sync:" + email);
    if (pr) prev = JSON.parse(pr) || {};
  } catch (e) {
    prev = {};
  }
  const mergedOwned = Object.assign({}, prev && prev.owned || {});
  for (const k in owned) {
    if (!mergedOwned[k]) mergedOwned[k] = owned[k];
  }
  const rec = { owned: mergedOwned, ts: Date.now() };
  const clampT = function(v) {
    return Math.max(0, Math.min(9, Math.floor(v)));
  };
  const inGday = Number.isFinite(body.gday) ? Math.floor(body.gday) : null;
  const pvGday = Number.isFinite(prev.gday) ? prev.gday : null;
  if (inGday != null && Number.isFinite(body.tk) && (pvGday == null || inGday >= pvGday)) {
    rec.gday = inGday;
    rec.tk = clampT(body.tk);
    rec.eSong = clampT(Number.isFinite(body.eSong) ? body.eSong : 0);
    rec.eFeed = clampT(Number.isFinite(body.eFeed) ? body.eFeed : 0);
  } else if (pvGday != null) {
    rec.gday = pvGday;
    if (Number.isFinite(prev.tk)) rec.tk = prev.tk;
    if (Number.isFinite(prev.eSong)) rec.eSong = prev.eSong;
    if (Number.isFinite(prev.eFeed)) rec.eFeed = prev.eFeed;
  } else if (inGday != null) {
    rec.gday = inGday;
  }
  const payload = JSON.stringify(rec);
  if (payload.length > 2e4) return json({ ok: false, message: "too large" }, 413, request, env);
  await env.CODES.put("sync:" + email, payload);
  return json({ ok: true }, 200, request, env);
}
async function handleCardsLoad(request, env, url) {
  const email = (url.searchParams.get("e") || "").trim().toLowerCase();
  const code = (url.searchParams.get("c") || "").trim().toUpperCase();
  const data = await authenticate(env, email, code);
  if (!data) return json({ ok: false, message: "unauthorized" }, 401, request, env);
  const rec = await env.CODES.get("sync:" + email);
  return json({ ok: true, data: rec ? JSON.parse(rec) : null }, 200, request, env);
}
async function handleNow(request, env) {
  const d = new Date(Date.now() + 8 * 3600 * 1e3);
  const day = d.getUTCFullYear() * 372 + d.getUTCMonth() * 31 + d.getUTCDate();
  return json({ ok: true, day, ts: Date.now() }, 200, request, env);
}
var worker_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/wallet/")) return walletRouter(request, url, env, { mail: tkMail });
    if (url.pathname.startsWith("/feed/")) return feedRouter(request, url, env);
    if (url.pathname.startsWith("/ticket/merch") || url.pathname.startsWith("/ticket/admin/merch")) return tkMerchRouter(request, url, env);
    if (url.pathname.startsWith("/comments")) return cmRouter(request, url, env);
    if (url.pathname.startsWith("/ticket/")) return ticketRouter(request, url, env);
    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders(request, env) });
    if (url.pathname === "/ecpay/create" && (request.method === "GET" || request.method === "POST")) return handleEcpayCreate(request, env, url);
    if (url.pathname === "/ecpay-notify" && request.method === "POST") return handleEcpayNotify(request, env);
    if (url.pathname === "/stripe-webhook" && request.method === "POST") return handleStripeWebhook(request, env);
    if (url.pathname === "/verify" && request.method === "POST") return handleVerify(request, env);
    if (url.pathname === "/track" && request.method === "GET") return handleTrack(request, env, url);
    if (url.pathname === "/download" && request.method === "GET") return handleDownload(request, env, url);
    if (url.pathname === "/interest" && request.method === "POST") return handleInterest(request, env);
    if (url.pathname === "/interest/count" && request.method === "GET") return handleInterestCount(request, env, url);
    if (url.pathname === "/cards/save" && request.method === "POST") return handleCardsSave(request, env);
    if (url.pathname === "/cards/load" && request.method === "GET") return handleCardsLoad(request, env, url);
    if (url.pathname === "/now" && request.method === "GET") return handleNow(request, env);
    return json({ ok: false, message: "not found" }, 404, request, env);
  }
};
function FEED_KV(env) {
  return env.CODES;
}
function FEED_R2(env) {
  return env.AUDIO;
}
async function feedHasSignal(email, code, env) {
  try {
    const data = await authenticate(env, email, code);
    if (!data) return false;
    const p = String(data.product || data.productId || "");
    return p === "full-unlock" || p === "upgrade-799" || p === "feed-pass";
  } catch (e) {
    return false;
  }
}
var FEED_CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,X-Feed-Key",
  "Access-Control-Max-Age": "86400"
};
var fj = (obj, status) => new Response(JSON.stringify(obj), {
  status: status || 200,
  headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...FEED_CORS }
});
function feedRole(request, env) {
  const key2 = request.headers.get("X-Feed-Key") || "";
  if (!key2) return null;
  if (env.ADMIN_KEY && key2 === env.ADMIN_KEY) return "owner";
  if (env.STAFF_KEY && key2 === env.STAFF_KEY) return "artist";
  return null;
}
var FEED_IDX = "feed:index";
var feedKey = (id) => "feed:post:" + id;
async function feedIndex(env) {
  return await FEED_KV(env).get(FEED_IDX, "json") || [];
}
async function feedSaveIndex(env, ids) {
  await FEED_KV(env).put(FEED_IDX, JSON.stringify(ids));
}
async function feedSettings(env) {
  return Object.assign({ requireReview: false }, await FEED_KV(env).get("feed:settings", "json") || {});
}
async function feedLog(env, entry) {
  const log = await FEED_KV(env).get("feed:log", "json") || [];
  log.unshift(Object.assign({ at: Date.now() }, entry));
  await FEED_KV(env).put("feed:log", JSON.stringify(log.slice(0, 200)));
}
async function feedGetAll(env) {
  const ids = await feedIndex(env);
  const out = [];
  for (const id of ids) {
    const p = await FEED_KV(env).get(feedKey(id), "json");
    if (p) out.push(p);
  }
  return out;
}
var _fgaCache = null;
var _fgaAt = 0;
async function feedGetAllCached(env) {
  const now = Date.now();
  if (_fgaCache && now - _fgaAt < 8e3) return _fgaCache;
  const v = await feedGetAll(env);
  _fgaCache = v;
  _fgaAt = now;
  return v;
}
async function feedRouter(request, url, env) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: FEED_CORS });
  const path = url.pathname.replace(/^\/feed/, "");
  if (path === "/since") {
    const em = (url.searchParams.get("e") || "").trim().toLowerCase();
    const cd = (url.searchParams.get("c") || "").trim().toUpperCase();
    if (!em || !cd) return fj({ ok: false, error: "bad params" }, 400);
    const data = await authenticate(env, em, cd);
    if (!data) return fj({ ok: false, error: "invalid" }, 403);
    let since = data.ts || data.createdAt || data.created_at || null;
    return fj({ ok: true, since });
  }
  if (path === "/reactions") {
    let all = {};
    try {
      all = JSON.parse(await FEED_KV(env).get("feed:reactions") || "{}") || {};
    } catch (e) {
    }
    return fj({ ok: true, reactions: all });
  }
  if (path === "/react" && request.method === "POST") {
    let b = {};
    try {
      b = await request.json();
    } catch (e) {
    }
    const okFan = await feedHasSignal(b.email || "", b.code || "", env);
    if (!okFan) return fj({ ok: false, error: "locked" }, 403);
    if (["heart", "tear", "cry", "fire", "love", "hands", "eyes", "ghost"].indexOf(b.emoji) < 0) return fj({ ok: false, error: "bad emoji" }, 400);
    if (!b.id) return fj({ ok: false, error: "no id" }, 400);
    const dir = b.dir === -1 ? -1 : 1;
    let all = {};
    try {
      all = JSON.parse(await FEED_KV(env).get("feed:reactions") || "{}") || {};
    } catch (e) {
    }
    const cur = all[b.id] || {};
    cur[b.emoji] = Math.max(0, (Number(cur[b.emoji]) || 0) + dir);
    all[b.id] = cur;
    await FEED_KV(env).put("feed:reactions", JSON.stringify(all));
    return fj({ ok: true, reactions: cur });
  }
  if (path === "/reply-voice" && request.method === "POST") {
    let st = {};
    try {
      st = JSON.parse(await FEED_KV(env).get("feed:settings") || "{}") || {};
    } catch (e) {
    }
    if (st.replyOpen !== true) return fj({ ok: false, error: "closed" }, 403);
    const em = url.searchParams.get("e") || "", cd = url.searchParams.get("c") || "";
    if (!await feedHasSignal(em, cd, env)) return fj({ ok: false, error: "locked" }, 403);
    let ext = (url.searchParams.get("ext") || "m4a").toLowerCase();
    if (["m4a", "mp3", "wav", "webm", "ogg"].indexOf(ext) < 0) ext = "m4a";
    const buf = await request.arrayBuffer();
    if (!buf.byteLength) return fj({ ok: false, error: "empty" }, 400);
    if (buf.byteLength > 2 * 1024 * 1024) return fj({ ok: false, error: "too large" }, 413);
    let list = [];
    try {
      list = JSON.parse(await FEED_KV(env).get("feed:replies") || "[]") || [];
    } catch (e) {
    }
    const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    if (list.filter(function(r) {
      return r.email === em && String(r.ts || "").slice(0, 10) === today;
    }).length >= 3)
      return fj({ ok: false, error: "daily limit" }, 429);
    const key2 = "feed/reply/" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8) + "." + ext;
    await FEED_R2(env).put(key2, buf, { httpMetadata: { contentType: ext === "mp3" ? "audio/mpeg" : ext === "wav" ? "audio/wav" : ext === "webm" ? "audio/webm" : "audio/mp4" } });
    list.unshift({ ts: (/* @__PURE__ */ new Date()).toISOString(), email: em, kind: "voice", media: key2, dur: Number(url.searchParams.get("dur") || 0) || 0 });
    if (list.length > 500) list = list.slice(0, 500);
    await FEED_KV(env).put("feed:replies", JSON.stringify(list));
    return fj({ ok: true });
  }
  if (path === "/reply-media") {
    if (!feedRole(request, env)) return fj({ ok: false, error: "unauthorized" }, 401);
    const k = url.searchParams.get("key") || "";
    if (k.indexOf("feed/reply/") !== 0) return fj({ ok: false, error: "bad key" }, 400);
    const obj = await FEED_R2(env).get(k);
    if (!obj) return fj({ ok: false, error: "not found" }, 404);
    const h = new Headers(FEED_CORS);
    h.set("Content-Type", obj.httpMetadata && obj.httpMetadata.contentType || "audio/mp4");
    h.set("Cache-Control", "private, max-age=600");
    return new Response(obj.body, { status: 200, headers: h });
  }
  if (path === "/reply" && request.method === "POST") {
    let b = {};
    try {
      b = await request.json();
    } catch (e) {
    }
    let st = {};
    try {
      st = JSON.parse(await FEED_KV(env).get("feed:settings") || "{}") || {};
    } catch (e) {
    }
    if (st.replyOpen !== true) return fj({ ok: false, error: "closed" }, 403);
    const okFan = await feedHasSignal(b.email || "", b.code || "", env);
    if (!okFan) return fj({ ok: false, error: "locked" }, 403);
    const txt = String(b.text || "").slice(0, 500).trim();
    if (!txt) return fj({ ok: false, error: "empty" }, 400);
    let list = [];
    try {
      list = JSON.parse(await FEED_KV(env).get("feed:replies") || "[]") || [];
    } catch (e) {
    }
    const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    if (list.filter(function(r) {
      return r.email === b.email && String(r.ts || "").slice(0, 10) === today;
    }).length >= 3)
      return fj({ ok: false, error: "daily limit" }, 429);
    list.unshift({ ts: (/* @__PURE__ */ new Date()).toISOString(), email: b.email || "", text: txt });
    if (list.length > 500) list = list.slice(0, 500);
    await FEED_KV(env).put("feed:replies", JSON.stringify(list));
    return fj({ ok: true });
  }
  if (path === "/replies") {
    if (!feedRole(request, env)) return fj({ ok: false, error: "unauthorized" }, 401);
    let list = [];
    try {
      list = JSON.parse(await FEED_KV(env).get("feed:replies") || "[]") || [];
    } catch (e) {
    }
    return fj({ ok: true, replies: list.slice(0, 200) });
  }
  if (path === "/live") {
    const email = url.searchParams.get("e") || "";
    const code = url.searchParams.get("c") || "";
    const signal = email && code ? await feedHasSignal(email, code, env) : false;
    const posts = (await feedGetAll(env)).filter((p) => p.status === "live").map((p) => {
      if (p.tier === "signal" && !signal) {
        return { id: p.id, ts: p.ts, type: p.type, tier: "signal", locked: true };
      }
      return {
        id: p.id,
        ts: p.ts,
        type: p.type,
        tier: p.tier,
        text: p.text || "",
        media: p.media || "",
        dur: p.dur || "",
        editedAt: p.editedAt || null
      };
    });
    return fj({ ok: true, posts });
  }
  if (path === "/media") {
    const k = url.searchParams.get("key") || "";
    if (!/^feed\/live\/[A-Za-z0-9_.-]+$/.test(k)) return fj({ ok: false, error: "bad key" }, 400);
    const owner = (await feedGetAllCached(env)).find((p) => p.media === k);
    if (!owner || owner.status !== "live") {
      if (!feedRole(request, env)) return fj({ ok: false, error: "not found" }, 404);
    }
    if (owner && owner.tier === "signal" && !feedRole(request, env)) {
      const okSig = await feedHasSignal(url.searchParams.get("e"), url.searchParams.get("c"), env);
      if (!okSig) return fj({ ok: false, error: "locked" }, 403);
    }
    let rangeHeader = request.headers.get("Range");
    let obj = null, respStatus = 200;
    if (rangeHeader) {
      let rm = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader.trim());
      if (rm) {
        let ropt = {};
        if (rm[1] !== "" && rm[2] !== "") ropt.range = { offset: +rm[1], length: +rm[2] - +rm[1] + 1 };
        else if (rm[1] !== "") ropt.range = { offset: +rm[1] };
        else if (rm[2] !== "") ropt.range = { suffix: +rm[2] };
        obj = await FEED_R2(env).get(k, ropt);
      }
    }
    if (!obj) obj = await FEED_R2(env).get(k);
    if (!obj) return fj({ ok: false, error: "not found" }, 404);
    const h = new Headers(FEED_CORS);
    h.set("Content-Type", obj.httpMetadata && obj.httpMetadata.contentType || "application/octet-stream");
    h.set("Cache-Control", "private, max-age=3600");
    h.set("Accept-Ranges", "bytes");
    let total = obj.size;
    if (obj.range) {
      let off = obj.range.offset || 0;
      let len = obj.range.length != null ? obj.range.length : total - off;
      respStatus = 206;
      h.set("Content-Range", "bytes " + off + "-" + (off + len - 1) + "/" + total);
      h.set("Content-Length", "" + len);
    } else {
      h.set("Content-Length", "" + total);
    }
    return new Response(obj.body, { status: respStatus, headers: h });
  }
  const role = feedRole(request, env);
  if (!role) return fj({ ok: false, error: "unauthorized" }, 401);
  if (path === "/auth") {
    return fj({ ok: true, role, settings: await feedSettings(env) });
  }
  if (path === "/list") {
    const posts = await feedGetAll(env);
    return fj({
      ok: true,
      role,
      settings: await feedSettings(env),
      posts: role === "owner" ? posts : posts.filter((p) => p.status !== "deleted")
    });
  }
  if (path === "/upload" && (request.method === "PUT" || request.method === "POST")) {
    const ext = (url.searchParams.get("ext") || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    if (["jpg", "jpeg", "png", "m4a", "mp3", "mp4", "webm", "wav", "mov", "m4v"].indexOf(ext) < 0)
      return fj({ ok: false, error: "bad ext" }, 400);
    const buf = await request.arrayBuffer();
    if (buf.byteLength > 30 * 1024 * 1024) return fj({ ok: false, error: "too large" }, 413);
    const k = "feed/live/" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8) + "." + ext;
    await FEED_R2(env).put(k, buf, {
      httpMetadata: { contentType: request.headers.get("Content-Type") || "application/octet-stream" }
    });
    return fj({ ok: true, key: k });
  }
  if (path === "/post" && request.method === "POST") {
    const b = await request.json();
    const st = await feedSettings(env);
    const now = Date.now();
    const id = "p_" + now.toString(36) + Math.random().toString(36).slice(2, 6);
    const post = {
      id,
      ts: now,
      createdAt: now,
      type: ["text", "photo", "voice", "video"].indexOf(b.type) >= 0 ? b.type : "text",
      text: String(b.text || "").slice(0, 2e3),
      media: /^feed\/live\/[A-Za-z0-9_.-]+$/.test(b.media || "") ? b.media : "",
      dur: String(b.dur || "").slice(0, 8),
      tier: b.tier === "signal" ? "signal" : "public",
      status: role === "artist" && st.requireReview ? "pending" : "live",
      author: role,
      editedAt: null,
      editedBy: null,
      deletedAt: null
    };
    await FEED_KV(env).put(feedKey(id), JSON.stringify(post));
    const ids = await feedIndex(env);
    ids.unshift(id);
    await feedSaveIndex(env, ids);
    await feedLog(env, { who: role, act: "create", id, tier: post.tier, status: post.status });
    return fj({ ok: true, post });
  }
  if (path === "/edit" && request.method === "POST") {
    const b = await request.json();
    const p = await FEED_KV(env).get(feedKey(b.id), "json");
    if (!p) return fj({ ok: false, error: "not found" }, 404);
    if (role === "artist" && p.author === "owner")
      return fj({ ok: false, error: "\u9019\u5247\u7531\u7AD9\u4E3B\u767C\u5E03\uFF0C\u7121\u6CD5\u7DE8\u8F2F" }, 403);
    if (typeof b.text === "string") p.text = b.text.slice(0, 2e3);
    if (b.tier === "public" || b.tier === "signal") p.tier = b.tier;
    if (b.status === "live" || b.status === "hidden") p.status = b.status;
    if (role === "owner" && b.status === "pending") p.status = "pending";
    p.editedAt = Date.now();
    p.editedBy = role;
    await FEED_KV(env).put(feedKey(p.id), JSON.stringify(p));
    await feedLog(env, { who: role, act: "edit", id: p.id, status: p.status });
    return fj({ ok: true, post: p });
  }
  if (path === "/delete" && request.method === "POST") {
    const b = await request.json();
    const p = await FEED_KV(env).get(feedKey(b.id), "json");
    if (!p) return fj({ ok: false, error: "not found" }, 404);
    if (b.purge && role === "owner") {
      if (p.media) {
        try {
          await FEED_R2(env).delete(p.media);
        } catch (e) {
        }
      }
      await FEED_KV(env).delete(feedKey(p.id));
      const ids = await feedIndex(env);
      await feedSaveIndex(env, ids.filter((x2) => x2 !== p.id));
      await feedLog(env, { who: role, act: "purge", id: p.id });
      return fj({ ok: true, purged: true });
    }
    if (role === "artist" && p.author === "owner")
      return fj({ ok: false, error: "\u9019\u5247\u7531\u7AD9\u4E3B\u767C\u5E03\uFF0C\u7121\u6CD5\u522A\u9664" }, 403);
    p.status = "deleted";
    p.deletedAt = Date.now();
    p.editedBy = role;
    await FEED_KV(env).put(feedKey(p.id), JSON.stringify(p));
    await feedLog(env, { who: role, act: "delete", id: p.id });
    return fj({ ok: true, post: p });
  }
  if (path === "/restore" && request.method === "POST" && role === "owner") {
    const b = await request.json();
    const p = await FEED_KV(env).get(feedKey(b.id), "json");
    if (!p) return fj({ ok: false, error: "not found" }, 404);
    p.status = "live";
    p.deletedAt = null;
    p.editedAt = Date.now();
    p.editedBy = role;
    await FEED_KV(env).put(feedKey(p.id), JSON.stringify(p));
    await feedLog(env, { who: role, act: "restore", id: p.id });
    return fj({ ok: true, post: p });
  }
  if (path === "/settings" && request.method === "POST" && role === "owner") {
    const b = await request.json();
    const st = { requireReview: !!b.requireReview };
    await FEED_KV(env).put("feed:settings", JSON.stringify(st));
    await feedLog(env, { who: role, act: "settings", requireReview: st.requireReview });
    return fj({ ok: true, settings: st });
  }
  if (path === "/log" && role === "owner") {
    return fj({ ok: true, log: await FEED_KV(env).get("feed:log", "json") || [] });
  }
  return fj({ ok: false, error: "not found" }, 404);
}
var TK = {
  OTP_TTL: 300,
  // 驗證碼 5 分鐘
  OTP_RATE: 60,
  // 每 email 一分鐘一次
  OTP_TRIES: 5,
  SESS_TTL: 60 * 60 * 24 * 30,
  // 登入 30 天
  TR_TTL: 600,
  // 轉讓 QR／代碼 10 分鐘
  TRC_TRIES: 5,
  // 代碼輸錯 5 次 → 鎖 10 分鐘
  TRC_LOCK: 600,
  WIN_BEFORE_H: 3,
  // 開演前 3 小時可入場
  WIN_AFTER_H: 2,
  // 開演後 2 小時票失效（入場、轉讓皆停）
  MAX_ISSUE: 10,
  APP_URL: "https://chance1228.com/",
  ALPHA: "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
};
function tkCors(request, env) {
  const allowed = (env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
  const origin = request.headers.get("Origin") || "";
  const allow = allowed.includes(origin) ? origin : allowed[0] || "*";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "no-store",
    "Vary": "Origin"
  };
}
function tkJson(data, status, request, env) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { "Content-Type": "application/json; charset=utf-8", ...tkCors(request, env) }
  });
}
function tkRand(n) {
  const b = new Uint8Array(n);
  crypto.getRandomValues(b);
  let s = "";
  for (let i2 = 0; i2 < n; i2++) s += TK.ALPHA[b[i2] % TK.ALPHA.length];
  return s;
}
function tkEmail(e) {
  return String(e || "").trim().toLowerCase();
}
function tkValidEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}
function tkMask(e) {
  const [u, d] = String(e || "").split("@");
  if (!d) return "\u2014";
  return (u.length <= 2 ? u[0] + "*" : u.slice(0, 2) + "***") + "@" + d;
}
function tkNow() {
  return Date.now();
}
async function tkBody(request) {
  try {
    return JSON.parse(await request.text() || "{}");
  } catch (e) {
    return {};
  }
}
function tkSecret(env) {
  return env.TICKET_SECRET || env.ADMIN_KEY || "dev-secret";
}
async function tkSign(env, id, ver) {
  const key2 = await crypto.subtle.importKey("raw", new TextEncoder().encode(tkSecret(env)), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key2, new TextEncoder().encode(id + "." + ver));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 20);
}
async function tkQr(env, t) {
  return "CT1." + t.id + "." + t.ver + "." + await tkSign(env, t.id, t.ver);
}
function tkParseQr(s) {
  const m = /^CT1\.([A-Z0-9-]+)\.(\d+)\.([0-9a-f]{20})$/.exec(String(s || "").trim());
  return m ? { id: m[1], ver: Number(m[2]), sig: m[3] } : null;
}
var tkK = {
  ev: (id) => "tk:ev:" + id,
  t: (id) => "tk:t:" + id,
  own: (email, id) => "tk:o:" + email + ":" + id,
  tr: (tok) => "tk:tr:" + tok,
  trc: (code) => "tk:trc:" + code,
  // 6 碼 → 轉讓 token
  trx: (email) => "tk:trx:" + email,
  // 代碼輸錯次數
  pp: (eventId, email) => "tk:pp:" + email + ":" + eventId,
  // PhotoPass 已購（依 email 列）
  lim: (email, eventId, tier) => "tk:lim:" + email + ":" + eventId + ":" + (tier || "_"),
  // 每人每票種限購
  otp: (email) => "tk:otp:" + email,
  otpr: (email) => "tk:otpr:" + email,
  sess: (tok) => "tk:s:" + tok
};
async function tkGetEvent(env, id) {
  return id ? await env.CODES.get(tkK.ev(id), "json") : null;
}
async function tkGetTicket(env, id) {
  return id ? await env.CODES.get(tkK.t(id), "json") : null;
}
async function tkPutTicket(env, t) {
  await env.CODES.put(tkK.t(t.id), JSON.stringify(t), { metadata: { e: t.eventId, s: t.status, v: t.ver, o: t.owner, tr: t.tier || null, sn: t.seatNo || null } });
}
async function tkListEvents(env) {
  const out = [];
  let cursor;
  do {
    const r = await env.CODES.list({ prefix: "tk:ev:", cursor });
    for (const k of r.keys) {
      const ev = await env.CODES.get(k.name, "json");
      if (ev) out.push(ev);
    }
    cursor = r.list_complete ? null : r.cursor;
  } while (cursor);
  return out.sort((a, b) => String(a.startAt || "").localeCompare(String(b.startAt || "")));
}
async function tkListTicketMeta(env, eventId) {
  const out = [];
  let cursor;
  do {
    const r = await env.CODES.list({ prefix: "tk:t:", cursor });
    for (const k of r.keys) {
      const m = k.metadata || {};
      if (!eventId || m.e === eventId) out.push({ id: k.name.slice(5), e: m.e, s: m.s, v: m.v, o: m.o, tr: m.tr || null, sn: m.sn || null });
    }
    cursor = r.list_complete ? null : r.cursor;
  } while (cursor);
  return out;
}
async function tkSession(env, tok) {
  return tok ? await env.CODES.get(tkK.sess(tok), "json") : null;
}
async function tkNewSession(env, email) {
  const tok = tkRand(24);
  await env.CODES.put(tkK.sess(tok), JSON.stringify({ email, at: tkNow() }), { expirationTtl: TK.SESS_TTL });
  return tok;
}
function tkEventWindow(ev) {
  const start = ev && ev.startAt ? Date.parse(ev.startAt) : NaN;
  if (isNaN(start)) return { start: null, open: null, close: null };
  return { start, open: start - TK.WIN_BEFORE_H * 36e5, close: start + TK.WIN_AFTER_H * 36e5 };
}
function tkTiers(e) {
  return Array.isArray(e.tiers) && e.tiers.length ? e.tiers : null;
}
function tkTierOf(e, key2) {
  var ts = tkTiers(e);
  return ts ? ts.filter(function(t) {
    return t.key === key2;
  })[0] || null : null;
}
function tkTierPublic(e, t) {
  var sold = Number(t.sold || 0), cap = Number(t.cap || 0);
  return {
    key: t.key,
    name: t.name,
    price: Number(t.price || 0),
    cap,
    sold,
    left: cap ? Math.max(0, cap - sold) : null,
    numFrom: t.numFrom || null,
    numTo: t.numTo || null,
    perks: Array.isArray(t.perks) ? t.perks : [],
    productKey: e.id + "-" + t.key,
    onSale: e.onSale !== false && t.onSale !== false && Number(t.price || 0) > 0 && (!cap || sold < cap)
  };
}
function tkPublicEvent(e) {
  var ts = tkTiers(e), tp = ts ? ts.map(function(t) {
    return tkTierPublic(e, t);
  }) : null;
  var cap = tp ? tp.reduce(function(a, x2) {
    return a + (x2.cap || 0);
  }, 0) : Number(e.capacity || 0);
  var sold = tp ? tp.reduce(function(a, x2) {
    return a + (x2.sold || 0);
  }, 0) : Number(e.sold || 0);
  var prices = tp ? tp.map(function(x2) {
    return x2.price;
  }).filter(function(n) {
    return n > 0;
  }) : [];
  var minPrice = prices.length ? Math.min.apply(null, prices) : Number(e.price || 0);
  var onSale = tp ? e.onSale !== false && tp.some(function(x2) {
    return x2.onSale && x2.left !== 0;
  }) : e.onSale !== false && Number(e.price || 0) > 0;
  return {
    id: e.id,
    code: e.code,
    name: e.name,
    startAt: e.startAt,
    venue: e.venue,
    price: minPrice,
    capacity: cap,
    sold,
    left: cap ? Math.max(0, cap - sold) : null,
    tiers: tp,
    productKey: "meet-" + e.id.replace(/^meet-/, ""),
    onSale,
    photoPrice: Number(e.photoPrice || 0),
    photoOnSale: e.photoOnSale !== false && Number(e.photoPrice || 0) > 0,
    ppKey: "pp-" + e.id
  };
}
function tkSeat(n) {
  return n == null ? null : ("00" + n).slice(-3);
}
function tkPublicTicket(ev, t, qr) {
  var tier = ev && t.tier ? tkTierOf(ev, t.tier) : null;
  return {
    id: t.id,
    eventId: t.eventId,
    status: t.status,
    ver: t.ver,
    issuedAt: t.issuedAt,
    usedAt: t.usedAt || null,
    owner: t.owner,
    transferPending: !!t.transfer,
    tier: t.tier || null,
    tierName: tier ? tier.name : null,
    seatNo: t.seatNo || null,
    seat: tkSeat(t.seatNo),
    perks: tier && Array.isArray(tier.perks) ? tier.perks : [],
    event: ev ? { id: ev.id, name: ev.name, startAt: ev.startAt, venue: ev.venue, code: ev.code } : null,
    qr: qr || null
  };
}
async function tkMail(env, to, subject, html) {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: env.RESEND_FROM || "CHANCE <noreply@ceon0693.uk>", to, subject, html })
    });
    if (!res.ok) console.log("tk mail failed", res.status, await res.text());
    return res.ok;
  } catch (e) {
    console.log("tk mail error", String(e));
    return false;
  }
}
function tkMailWrap(title, body) {
  return `<div style="font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;padding:28px;color:#f6f1e7;background:#0b0b0b;border-radius:16px">
    <div style="font:22px Georgia,serif;letter-spacing:.18em;color:#d8bc80;margin-bottom:14px">CHANCE</div>
    <h2 style="margin:0 0 12px;font-size:20px;color:#f6f1e7">${title}</h2>
    <div style="font-size:14px;line-height:1.7;color:#cfc7b8">${body}</div>
  </div>`;
}
function tkFmtDate(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return iso || "";
  const t = new Date(d.getTime() + 8 * 36e5);
  const w = "\u65E5\u4E00\u4E8C\u4E09\u56DB\u4E94\u516D"[t.getUTCDay()];
  return `${t.getUTCFullYear()}/${t.getUTCMonth() + 1}/${t.getUTCDate()}\uFF08${w}\uFF09${String(t.getUTCHours()).padStart(2, "0")}:${String(t.getUTCMinutes()).padStart(2, "0")}`;
}
async function tkIssue(env, { eventId, email, qty, orderRef, note, force, tier }) {
  const ev = await tkGetEvent(env, eventId);
  if (!ev) return { ok: false, error: "no_event" };
  qty = Math.max(1, Math.min(TK.MAX_ISSUE, Number(qty) || 1));
  email = tkEmail(email);
  if (!tkValidEmail(email)) return { ok: false, error: "bad_email" };
  const tiers = tkTiers(ev);
  let T = null;
  if (tiers) {
    if (!tier) return { ok: false, error: "need_tier" };
    T = tkTierOf(ev, tier);
    if (!T) return { ok: false, error: "bad_tier" };
    if (await env.CODES.get(tkK.lim(email, ev.id, tier))) return { ok: false, error: "limit", message: "\u9019\u500B\u7968\u7A2E\u6BCF\u4EBA\u9650 1 \u5F35" };
    const tsold = Number(T.sold || 0), tcap = Number(T.cap || 0);
    if (!force && tcap && tsold + qty > tcap) return { ok: false, error: "sold_out", left: Math.max(0, tcap - tsold) };
  } else {
    const sold = Number(ev.sold || 0), cap = Number(ev.capacity || 0);
    if (!force && cap && sold + qty > cap) return { ok: false, error: "sold_out", left: Math.max(0, cap - sold) };
  }
  const tickets = [];
  for (let i2 = 0; i2 < qty; i2++) {
    let seatNo = null;
    if (T) {
      T.seq = Number(T.seq != null ? T.seq : T.sold || 0);
      T.freed = Array.isArray(T.freed) ? T.freed : [];
      if (T.freed.length) {
        T.freed.sort(function(a, b) {
          return a - b;
        });
        seatNo = T.freed.shift();
      } else {
        seatNo = Number(T.numFrom || 0) + T.seq;
        T.seq++;
      }
      T.sold = Number(T.sold || 0) + 1;
    }
    const t = {
      id: (ev.code || "TK") + "-" + tkRand(8),
      eventId,
      owner: email,
      ver: 1,
      status: "valid",
      tier: tier || null,
      seatNo,
      issuedAt: (/* @__PURE__ */ new Date()).toISOString(),
      orderRef: orderRef || null,
      note: note || null,
      transfer: null,
      usedAt: null,
      history: [{ at: (/* @__PURE__ */ new Date()).toISOString(), type: "issue", to: email }]
    };
    await tkPutTicket(env, t);
    await env.CODES.put(tkK.own(email, t.id), "1");
    if (T) await env.CODES.put(tkK.lim(email, ev.id, tier), t.id);
    t.qr = await tkQr(env, t);
    tickets.push(t);
  }
  ev.sold = Number(ev.sold || 0) + qty;
  await env.CODES.put(tkK.ev(ev.id), JSON.stringify(ev));
  const appUrl = ev.appUrl || TK.APP_URL;
  const seatLine = tickets.some(function(t) {
    return t.seatNo;
  }) ? `<p>\u7D42\u8EAB\u7DE8\u865F\uFF1A<b>${tickets.map(function(t) {
    return T ? T.name + " No." + tkSeat(t.seatNo) : t.id;
  }).join("\u3001")}</b></p>` : "";
  const emailed = await tkMail(env, email, `\u4F60\u7684\u300A${ev.name}\u300B\u9580\u7968 \xD7${qty}`, tkMailWrap(
    "\u9580\u7968\u5DF2\u653E\u9032\u4F60\u7684 CHANCE app",
    `<p><b>${ev.name}</b>${T ? "\u3000" + T.name : ""}<br>${tkFmtDate(ev.startAt)}<br>${ev.venue || ""}</p>
     ${seatLine}
     <p>\u6253\u958B <a href="${appUrl}" style="color:#d8bc80">${appUrl}</a> \u2192 SHOP \u2192 \u7968\u593E\uFF0C\u7528\u9019\u500B email\uFF08${email}\uFF09\u767B\u5165\u5C31\u770B\u5F97\u5230\u5165\u5834 QR\u3002<br>
     <span style="color:#9c9589">\u8ACB\u628A app \u66F4\u65B0\u5230\u6700\u65B0\u7248\u624D\u770B\u5F97\u5230\u7968\uFF1B\u7968\u53EF\u4EE5\u5728 app \u88E1\u8F49\u8B93\u7D66\u670B\u53CB\u3002</span></p>`
  ));
  return { ok: true, tickets, emailed, left: T ? T.cap ? T.cap - T.sold : null : ev.capacity ? ev.capacity - ev.sold : null };
}
async function tkProduct(env, productKey, email) {
  {
    const _m225 = await tkMerchProduct(env, productKey, email);
    if (_m225) return _m225;
  }
  let kind = null, eventId = null, tier = null, m;
  if (m = /^(meet-[a-z0-9-]+)-ga-pp$/.exec(productKey)) {
    const base = await tkProduct(env, m[1] + "-ga", email);
    if (!base || !base.ok) return base || { ok: false, status: 400, message: "unknown product" };
    const pev = await tkGetEvent(env, m[1]);
    if (!pev || pev.photoOnSale === false || !(Number(pev.photoPrice) > 0)) return { ok: false, status: 409, message: "\u751F\u65E5\u7246\u5408\u7167\u5C1A\u672A\u958B\u8CE3" };
    if (email && await env.CODES.get(tkK.pp(pev.id, tkEmail(email)))) return { ok: false, status: 409, message: "\u4F60\u5DF2\u7D93\u52A0\u8CFC\u904E\u751F\u65E5\u7246\u5408\u7167\u4E86" };
    const total = Number(base.product.price) + Number(pev.photoPrice);
    return { ok: true, product: { productId: productKey, name: base.product.name + "\uFF0B\u751F\u65E5\u7246\u5408\u7167", price: total, unlockType: "meet", itemName: pev.name + " \u4E00\u822C\uFF0B\u751F\u65E5\u7246\u5408\u7167#" + total }, extra: Object.assign({}, base.extra, { withPP: true, ppPrice: Number(pev.photoPrice) }) };
  }
  if (m = /^(meet-[a-z0-9-]+)-(vvip|vip|ga)$/.exec(productKey)) {
    kind = "meet";
    eventId = m[1];
    tier = m[2];
  } else if (/^meet-[a-z0-9-]+$/.test(productKey)) {
    kind = "meet";
    eventId = productKey;
  } else if (/^pp-[a-z0-9-]+$/.test(productKey)) {
    kind = "pp";
    eventId = productKey.slice(3);
  }
  if (!kind) return null;
  const ev = await tkGetEvent(env, eventId);
  if (!ev) return { ok: false, status: 400, message: "unknown product" };
  const w = tkEventWindow(ev);
  if (kind === "meet") {
    if (w.close && tkNow() > w.close) return { ok: false, status: 409, message: "\u9019\u5834\u6D3B\u52D5\u5DF2\u7D93\u7D50\u675F" };
    const tiers = tkTiers(ev);
    if (tiers) {
      if (!tier) return { ok: false, status: 400, message: "\u8ACB\u9078\u64C7\u7968\u7A2E" };
      const T = tkTierOf(ev, tier);
      if (!T) return { ok: false, status: 400, message: "unknown product" };
      if (ev.onSale === false || T.onSale === false || !(Number(T.price) > 0)) return { ok: false, status: 409, message: "\u5C1A\u672A\u958B\u8CE3" };
      const tleft = T.cap ? Number(T.cap) - Number(T.sold || 0) : 1;
      if (tleft <= 0) return { ok: false, status: 409, message: T.name + " \u5DF2\u5B8C\u552E" };
      if (email && await env.CODES.get(tkK.lim(tkEmail(email), ev.id, tier))) return { ok: false, status: 409, message: "\u9019\u500B\u7968\u7A2E\u4F60\u5DF2\u7D93\u8CB7\u904E\u4E86\uFF08\u6BCF\u4EBA\u9650 1 \u5F35\uFF09" };
      return { ok: true, product: { productId: productKey, name: "\u300A" + ev.name + "\u300B" + T.name, price: Number(T.price), unlockType: "meet", itemName: ev.name + " " + T.name + "#" + Number(T.price) }, extra: { eventId: ev.id, tier } };
    }
    if (ev.onSale === false || !(Number(ev.price) > 0)) return { ok: false, status: 409, message: "\u5C1A\u672A\u958B\u8CE3" };
    const left = ev.capacity ? Number(ev.capacity) - Number(ev.sold || 0) : 1;
    if (left <= 0) return { ok: false, status: 409, message: "\u5DF2\u5B8C\u552E" };
    return { ok: true, product: { productId: productKey, name: "\u300A" + ev.name + "\u300B\u9580\u7968", price: Number(ev.price), unlockType: "meet", itemName: ev.name + " \u9580\u7968#" + Number(ev.price) }, extra: { eventId: ev.id } };
  }
  if (ev.photoOnSale === false || !(Number(ev.photoPrice) > 0)) return { ok: false, status: 409, message: "PhotoPass \u5C1A\u672A\u958B\u8CE3" };
  if (email && await env.CODES.get(tkK.pp(ev.id, tkEmail(email)))) return { ok: false, status: 409, message: "\u4F60\u5DF2\u7D93\u8CB7\u904E\u9019\u5834\u7684 PhotoPass \u4E86" };
  return { ok: true, product: { productId: productKey, name: "\u300A" + ev.name + "\u300BPhotoPass \u5408\u7167\u5305", price: Number(ev.photoPrice), unlockType: "pp", itemName: ev.name + " PhotoPass#" + Number(ev.photoPrice) }, extra: { eventId: ev.id } };
}
async function tkOnPaid(env, o, tradeNo, params) {
  if (o && (o.addon || o.merchOnly)) return await tkMerchOnPaid(env, o, tradeNo, params);
  o.status = "paid";
  o.paymentStatus = "paid";
  o.ecpayTradeNo = params && params.TradeNo || null;
  o.paidAt = (/* @__PURE__ */ new Date()).toISOString();
  if (o.unlockType === "meet" && o.withPP) {
    const r = await tkIssue(env, { eventId: o.eventId, email: o.email, qty: 1, orderRef: tradeNo, note: "ecpay", force: true, tier: o.tier || null });
    o.ticket = r.ok ? { ok: true, ids: r.tickets.map((t) => t.id), emailed: r.emailed } : { ok: false, error: r.error };
    o.emailSent = !!(r.ok && r.emailed);
    if (!r.ok) await env.CODES.put("ticket:failed:" + tradeNo, JSON.stringify({ email: o.email, eventId: o.eventId, amount: o.amount, reason: r.error, ts: tkNow() }));
    await env.CODES.put(tkK.pp(o.eventId, o.email), JSON.stringify({ tradeNo, amount: o.ppPrice || null, at: o.paidAt, combo: true }));
    o.ppActivated = true;
    return o;
  }
  if (o.unlockType === "meet") {
    const r = await tkIssue(env, { eventId: o.eventId, email: o.email, qty: 1, orderRef: tradeNo, note: "ecpay", force: true, tier: o.tier || null });
    o.ticket = r.ok ? { ok: true, ids: r.tickets.map((t) => t.id), emailed: r.emailed } : { ok: false, error: r.error };
    o.emailSent = !!(r.ok && r.emailed);
    if (!r.ok) await env.CODES.put("ticket:failed:" + tradeNo, JSON.stringify({ email: o.email, eventId: o.eventId, amount: o.amount, reason: r.error, ts: tkNow() }));
    return o;
  }
  if (o.unlockType === "pp") {
    const ev = await tkGetEvent(env, o.eventId);
    await env.CODES.put(tkK.pp(o.eventId, o.email), JSON.stringify({ tradeNo, amount: o.amount, at: o.paidAt }));
    o.emailSent = await tkMail(env, o.email, "\u4F60\u7684 PhotoPass \u5DF2\u958B\u901A", tkMailWrap(
      "PhotoPass \u5DF2\u958B\u901A",
      "<p><b>" + (ev && ev.name || o.eventId) + "</b><br>\u6D3B\u52D5\u5F8C\u7167\u7247\u6574\u7406\u597D\uFF0C\u6703\u51FA\u73FE\u5728 CHANCE app \u2192 SHOP \u2192 \u7968\u593E \u2192 \u904E\u5F80 \u2192 \u9019\u5834\u7684\u7968\u6839\u88E1\uFF0C\u7528\u9019\u500B email\uFF08" + o.email + '\uFF09\u767B\u5165\u5C31\u770B\u5F97\u5230\u3001\u53EF\u4E0B\u8F09\u539F\u5716\u3002</p><p style="color:#9c9589">\u73FE\u5834\u62CD\u7167\u524D\uFF0C\u628A\u7968\u6839\u4E0A\u7684\u62CD\u7167 QR \u62FF\u7D66\u651D\u5F71\u5E2B\u62CD\u4E00\u5F35\uFF0C\u7167\u7247\u624D\u6703\u5C0D\u5230\u4F60\u3002</p>'
    ));
    return o;
  }
  return o;
}
async function ticketRouter(request, url, env) {
  if (request.method === "OPTIONS") return new Response(null, { headers: tkCors(request, env) });
  const p = url.pathname, q = url.searchParams;
  const body = request.method === "POST" ? await tkBody(request) : {};
  const J = (d, s) => tkJson(d, s, request, env);
  const isAdmin = (body.adminKey || q.get("adminKey")) && (body.adminKey || q.get("adminKey")) === env.ADMIN_KEY;
  const sk = body.staffKey || q.get("staffKey");
  const isStaff = isAdmin || !!sk && sk === (env.SCAN_KEY || env.STAFF_KEY);
  if (p === "/ticket/events" && request.method === "GET") {
    const evs = await tkListEvents(env);
    return J({ ok: true, events: evs.map(tkPublicEvent) });
  }
  if (p === "/ticket/ping") return J({ ok: true, ts: tkNow(), v: "tk2", scanKey: !!env.SCAN_KEY });
  if (p === "/ticket/otp" && request.method === "POST") {
    const email = tkEmail(body.email);
    if (!tkValidEmail(email)) return J({ ok: false, error: "bad_email" }, 400);
    if (await env.CODES.get(tkK.otpr(email))) return J({ ok: false, error: "rate", message: "\u4E00\u5206\u9418\u5167\u53EA\u80FD\u5BC4\u4E00\u6B21" }, 429);
    const code = String(Math.floor(1e5 + Math.random() * 9e5));
    await env.CODES.put(tkK.otp(email), JSON.stringify({ code, tries: 0 }), { expirationTtl: TK.OTP_TTL });
    await env.CODES.put(tkK.otpr(email), "1", { expirationTtl: TK.OTP_RATE });
    const sent = await tkMail(env, email, `CHANCE \u7968\u52D9\u9A57\u8B49\u78BC ${code}`, tkMailWrap(
      "\u4F60\u7684\u9A57\u8B49\u78BC",
      `<p style="font-size:30px;letter-spacing:.3em;color:#d8bc80;margin:4px 0"><b>${code}</b></p><p>5 \u5206\u9418\u5167\u6709\u6548\u3002\u5982\u679C\u4E0D\u662F\u4F60\u64CD\u4F5C\u7684\uFF0C\u5FFD\u7565\u9019\u5C01\u4FE1\u5373\u53EF\u3002</p>`
    ));
    return J({ ok: true, sent });
  }
  if (p === "/ticket/login" && request.method === "POST") {
    const email = tkEmail(body.email);
    if (!tkValidEmail(email)) return J({ ok: false, error: "bad_email" }, 400);
    if (body.otp) {
      const rec = await env.CODES.get(tkK.otp(email), "json");
      if (!rec) return J({ ok: false, error: "otp_expired" }, 401);
      if (String(body.otp).trim() !== rec.code) {
        rec.tries = (rec.tries || 0) + 1;
        if (rec.tries >= TK.OTP_TRIES) await env.CODES.delete(tkK.otp(email));
        else await env.CODES.put(tkK.otp(email), JSON.stringify(rec), { expirationTtl: TK.OTP_TTL });
        return J({ ok: false, error: "otp_wrong" }, 401);
      }
      await env.CODES.delete(tkK.otp(email));
      return J({ ok: true, session: await tkNewSession(env, email), email });
    }
    if (body.code && typeof authenticate === "function") {
      const data = await authenticate(env, email, String(body.code).trim().toUpperCase());
      if (!data) return J({ ok: false, error: "bad_code" }, 401);
      return J({ ok: true, session: await tkNewSession(env, email), email });
    }
    return J({ ok: false, error: "need_otp_or_code" }, 400);
  }
  const needSess = ["/ticket/mine", "/ticket/transfer/start", "/ticket/transfer/cancel", "/ticket/transfer/accept"];
  if (needSess.includes(p)) {
    const sess = await tkSession(env, body.session || q.get("session"));
    if (!sess) return J({ ok: false, error: "no_session" }, 401);
    const me = sess.email;
    if (p === "/ticket/mine") {
      const evCache = {};
      const out = [];
      let cursor;
      do {
        const r = await env.CODES.list({ prefix: "tk:o:" + me + ":", cursor });
        for (const k of r.keys) {
          const id = k.name.slice(("tk:o:" + me + ":").length);
          const t = await tkGetTicket(env, id);
          if (!t || t.owner !== me) {
            await env.CODES.delete(k.name);
            continue;
          }
          if (!evCache[t.eventId]) evCache[t.eventId] = await tkGetEvent(env, t.eventId);
          const ev = evCache[t.eventId], w = tkEventWindow(ev);
          const expired = w.close && tkNow() > w.close;
          const canTransfer = t.status === "valid" && !expired;
          const qr = t.status === "valid" ? await tkQr(env, t) : null;
          out.push({ ...tkPublicTicket(ev, t, qr), canTransfer, expired });
        }
        cursor = r.list_complete ? null : r.cursor;
      } while (cursor);
      out.sort((a, b) => String(a.event && a.event.startAt || "").localeCompare(String(b.event && b.event.startAt || "")) || a.id.localeCompare(b.id));
      const pp = [];
      let c2;
      do {
        const r = await env.CODES.list({ prefix: "tk:pp:" + me + ":", cursor: c2 });
        for (const k of r.keys) pp.push(k.name.slice(("tk:pp:" + me + ":").length));
        c2 = r.list_complete ? null : r.cursor;
      } while (c2);
      return J({ ok: true, email: me, tickets: out, photopass: pp });
    }
    if (p === "/ticket/transfer/start") {
      const t = await tkGetTicket(env, body.ticketId);
      if (!t || t.owner !== me) return J({ ok: false, error: "not_owner" }, 403);
      if (t.status !== "valid") return J({ ok: false, error: "not_valid" }, 409);
      const ev = await tkGetEvent(env, t.eventId), w = tkEventWindow(ev);
      if (w.close && tkNow() > w.close) return J({ ok: false, error: "expired", message: "\u958B\u6F14\u5F8C 2 \u5C0F\u6642\u5DF2\u7121\u6CD5\u8F49\u8B93" }, 409);
      if (t.transfer && t.transfer.token) {
        await env.CODES.delete(tkK.tr(t.transfer.token));
        if (t.transfer.code) await env.CODES.delete(tkK.trc(t.transfer.code));
      }
      const token = tkRand(28), exp = tkNow() + TK.TR_TTL * 1e3;
      let code = tkRand(6);
      for (let i2 = 0; i2 < 5 && await env.CODES.get(tkK.trc(code)); i2++) code = tkRand(6);
      await env.CODES.put(tkK.tr(token), JSON.stringify({ ticketId: t.id, from: me, exp }), { expirationTtl: TK.TR_TTL });
      await env.CODES.put(tkK.trc(code), token, { expirationTtl: TK.TR_TTL });
      t.transfer = { token, code, exp };
      await tkPutTicket(env, t);
      const appUrl = ev && ev.appUrl || TK.APP_URL;
      return J({ ok: true, token, code, exp, url: appUrl + "?transfer=" + token, ttl: TK.TR_TTL });
    }
    if (p === "/ticket/transfer/cancel") {
      const t = await tkGetTicket(env, body.ticketId);
      if (!t || t.owner !== me) return J({ ok: false, error: "not_owner" }, 403);
      if (t.transfer && t.transfer.token) await env.CODES.delete(tkK.tr(t.transfer.token));
      if (t.transfer && t.transfer.code) await env.CODES.delete(tkK.trc(t.transfer.code));
      t.transfer = null;
      await tkPutTicket(env, t);
      return J({ ok: true });
    }
    if (p === "/ticket/transfer/accept") {
      let token = String(body.token || "").trim();
      if (!token && body.code) {
        const tries = Number(await env.CODES.get(tkK.trx(me)) || 0);
        if (tries >= TK.TRC_TRIES) return J({ ok: false, error: "locked", message: "\u8F38\u932F\u592A\u591A\u6B21\uFF0C10 \u5206\u9418\u5F8C\u518D\u8A66" }, 429);
        token = await env.CODES.get(tkK.trc(String(body.code).trim().toUpperCase().replace(/[^A-Z0-9]/g, ""))) || "";
        if (!token) {
          await env.CODES.put(tkK.trx(me), String(tries + 1), { expirationTtl: TK.TRC_LOCK });
          return J({ ok: false, error: "code_wrong", message: "\u4EE3\u78BC\u4E0D\u5C0D\u6216\u5DF2\u904E\u671F" }, 404);
        }
      }
      const tr = await env.CODES.get(tkK.tr(token), "json");
      if (!tr || tr.exp < tkNow()) return J({ ok: false, error: "transfer_expired", message: "\u8F49\u8B93\u9023\u7D50\u5DF2\u5931\u6548\uFF0C\u8ACB\u5C0D\u65B9\u91CD\u65B0\u7522\u751F" }, 410);
      const t = await tkGetTicket(env, tr.ticketId);
      if (!t || t.status !== "valid" || !t.transfer || t.transfer.token !== token) return J({ ok: false, error: "transfer_invalid" }, 409);
      if (t.owner === me) return J({ ok: false, error: "self", message: "\u9019\u5F35\u7968\u5DF2\u7D93\u662F\u4F60\u7684" }, 409);
      const ev = await tkGetEvent(env, t.eventId), w = tkEventWindow(ev);
      if (w.close && tkNow() > w.close) return J({ ok: false, error: "expired" }, 409);
      const from = t.owner;
      await env.CODES.delete(tkK.tr(token));
      if (t.transfer.code) await env.CODES.delete(tkK.trc(t.transfer.code));
      await env.CODES.delete(tkK.own(from, t.id));
      t.owner = me;
      t.ver = (t.ver || 1) + 1;
      t.transfer = null;
      (t.history = t.history || []).push({ at: (/* @__PURE__ */ new Date()).toISOString(), type: "transfer", from, to: me });
      await tkPutTicket(env, t);
      await env.CODES.put(tkK.own(me, t.id), "1");
      const evName = ev ? ev.name : "CHANCE";
      tkMail(env, from, `\u4F60\u7684\u300A${evName}\u300B\u9580\u7968\u5DF2\u8F49\u51FA`, tkMailWrap("\u9580\u7968\u5DF2\u8F49\u51FA", `<p>\u7968\u865F ${t.id} \u5DF2\u8F49\u7D66 ${tkMask(me)}\u3002\u4F60\u539F\u672C\u7684\u5165\u5834 QR \u5DF2\u5931\u6548\u3002</p>`));
      tkMail(env, me, `\u4F60\u6536\u5230\u4E00\u5F35\u300A${evName}\u300B\u9580\u7968`, tkMailWrap("\u4F60\u6536\u5230\u4E00\u5F35\u9580\u7968", `<p>${tkMask(from)} \u628A\u7968\u865F ${t.id} \u8F49\u7D66\u4F60\u4E86\u3002<br>${ev ? tkFmtDate(ev.startAt) + "<br>" + (ev.venue || "") : ""}</p><p>\u6253\u958B <a href="${ev && ev.appUrl || TK.APP_URL}" style="color:#d8bc80">CHANCE app</a> \u2192 \u5468\u908A \u2192 \u4F60\u7684\u7968\uFF0C\u7528 ${me} \u767B\u5165\u5C31\u770B\u5F97\u5230\u3002</p>`));
      return J({ ok: true, ticket: tkPublicTicket(ev, t, await tkQr(env, t)) });
    }
  }
  if (p === "/ticket/transfer/peek" && request.method === "GET") {
    let token = q.get("token") || "";
    if (!token && q.get("code")) token = await env.CODES.get(tkK.trc(String(q.get("code")).trim().toUpperCase().replace(/[^A-Z0-9]/g, ""))) || "";
    const tr = await env.CODES.get(tkK.tr(token), "json");
    if (!tr || tr.exp < tkNow()) return J({ ok: false, error: "transfer_expired" }, 410);
    const t = await tkGetTicket(env, tr.ticketId);
    if (!t || !t.transfer || t.transfer.token !== token) return J({ ok: false, error: "transfer_invalid" }, 409);
    const ev = await tkGetEvent(env, t.eventId);
    return J({ ok: true, token, from: tkMask(tr.from), exp: tr.exp, ticketId: t.id, event: ev ? { id: ev.id, name: ev.name, startAt: ev.startAt, venue: ev.venue } : null });
  }
  if (p === "/ticket/checkin" || p === "/ticket/checkin/batch" || p === "/ticket/manifest") {
    if (!isStaff) return J({ ok: false, error: "forbidden" }, 403);
  }
  if (p === "/ticket/manifest" && request.method === "GET") {
    const eventId = q.get("eventId");
    const ev = await tkGetEvent(env, eventId);
    if (!ev) return J({ ok: false, error: "no_event" }, 404);
    const meta = await tkListTicketMeta(env, eventId);
    const w = tkEventWindow(ev);
    return J({
      ok: true,
      at: tkNow(),
      event: { id: ev.id, name: ev.name, startAt: ev.startAt, venue: ev.venue, capacity: ev.capacity, sold: ev.sold || 0, open: w.open, close: w.close },
      tickets: meta.map((m) => ({ id: m.id, v: m.v, s: m.s, o: tkMask(m.o) }))
    });
  }
  const doCheckin = async (qrStr, at) => {
    const pq = tkParseQr(qrStr);
    if (!pq) return { ok: false, reason: "bad_format" };
    const t = await tkGetTicket(env, pq.id);
    if (!t) return { ok: false, reason: "not_found", id: pq.id };
    const ev = await tkGetEvent(env, t.eventId);
    const info = { id: t.id, owner: tkMask(t.owner), event: ev ? ev.name : t.eventId, usedAt: t.usedAt || null };
    if (t.status === "void") return { ok: false, reason: "void", ...info };
    if (t.status === "refunded") return { ok: false, reason: "refunded", ...info };
    if (pq.ver !== t.ver || pq.sig !== await tkSign(env, t.id, t.ver)) return { ok: false, reason: "invalid_sig", ...info };
    if (t.status === "used") return { ok: false, reason: "already_used", ...info };
    const w = tkEventWindow(ev), now = at || tkNow();
    if (w.open && now < w.open) return { ok: false, reason: "too_early", opensAt: w.open, ...info };
    if (w.close && now > w.close) return { ok: false, reason: "expired", ...info };
    t.status = "used";
    t.usedAt = new Date(now).toISOString();
    t.transfer = null;
    (t.history = t.history || []).push({ at: t.usedAt, type: "checkin" });
    await tkPutTicket(env, t);
    return { ok: true, ...info, usedAt: t.usedAt };
  };
  if (p === "/ticket/checkin" && request.method === "POST") {
    if (!body.qr && body.ticketId) {
      const t = await tkGetTicket(env, String(body.ticketId).trim().toUpperCase());
      if (!t) return J({ ok: false, reason: "not_found", id: body.ticketId });
      return J(await doCheckin(await tkQr(env, t)));
    }
    return J(await doCheckin(body.qr));
  }
  if (p === "/ticket/checkin/batch" && request.method === "POST") {
    const items = Array.isArray(body.items) ? body.items.slice(0, 500) : [];
    const results = [];
    for (const it of items) results.push({ qr: it.qr, ...await doCheckin(it.qr, Number(it.at) || void 0) });
    return J({ ok: true, results });
  }
  if (p.startsWith("/ticket/admin/") || p === "/ticket/issue" || p === "/ticket/stats") {
    if (!isAdmin) return J({ ok: false, error: "forbidden" }, 403);
  }
  if (p === "/ticket/admin/event" && request.method === "POST") {
    const e = body.event || {};
    if (!e.id || !/^[a-z0-9-]+$/.test(e.id)) return J({ ok: false, error: "bad_id" }, 400);
    const old = await tkGetEvent(env, e.id) || {};
    const ev = {
      ...old,
      id: e.id,
      code: e.code || old.code || e.id.replace(/\D/g, "").slice(-4) || "TK",
      name: e.name || old.name || e.id,
      startAt: e.startAt || old.startAt || null,
      venue: e.venue || old.venue || "",
      capacity: Number(e.capacity ?? old.capacity ?? 0),
      price: Number(e.price ?? old.price ?? 0),
      productKey: e.productKey || old.productKey || null,
      appUrl: e.appUrl || old.appUrl || null,
      onSale: e.onSale ?? old.onSale ?? true,
      sold: Number(old.sold || 0),
      photoPrice: Number(e.photoPrice ?? old.photoPrice ?? 0),
      photoOnSale: e.photoOnSale ?? old.photoOnSale ?? true
    };
    if (Array.isArray(e.tiers)) {
      const oldT = {};
      (old.tiers || []).forEach(function(t) {
        oldT[t.key] = t;
      });
      ev.tiers = e.tiers.filter(function(t) {
        return t && t.key;
      }).map(function(t) {
        const o2 = oldT[t.key] || {};
        return {
          key: t.key,
          name: t.name || o2.name || t.key,
          price: Number(t.price ?? o2.price ?? 0),
          cap: Number(t.cap ?? o2.cap ?? 0),
          numFrom: Number(t.numFrom ?? o2.numFrom ?? 0),
          numTo: Number(t.numTo ?? o2.numTo ?? 0),
          perks: Array.isArray(t.perks) ? t.perks : o2.perks || [],
          onSale: t.onSale ?? o2.onSale ?? true,
          sold: Number(o2.sold || 0),
          seq: Number(o2.seq != null ? o2.seq : o2.sold || 0),
          freed: Array.isArray(o2.freed) ? o2.freed : []
        };
      });
    } else if (old.tiers) {
      ev.tiers = old.tiers;
    }
    await env.CODES.put(tkK.ev(ev.id), JSON.stringify(ev));
    return J({ ok: true, event: ev });
  }
  if (p === "/ticket/admin/events" && request.method === "GET") return J({ ok: true, events: await tkListEvents(env) });
  if (p === "/ticket/issue" && request.method === "POST") {
    const r = await tkIssue(env, { eventId: body.eventId, email: body.email, qty: body.qty, orderRef: body.orderRef || "manual", note: body.note, force: !!body.force });
    return J(r, r.ok ? 200 : 409);
  }
  if (p === "/ticket/stats" && request.method === "GET") {
    const eventId = q.get("eventId");
    const ev = await tkGetEvent(env, eventId);
    if (!ev) return J({ ok: false, error: "no_event" }, 404);
    const meta = await tkListTicketMeta(env, eventId);
    const c = { valid: 0, used: 0, void: 0 };
    const tierC = {};
    for (const m of meta) {
      c[m.s] = (c[m.s] || 0) + 1;
      if (m.tr) tierC[m.tr] = (tierC[m.tr] || 0) + 1;
    }
    let ppCount = 0, c3;
    do {
      const r = await env.CODES.list({ prefix: "tk:pp:", cursor: c3 });
      for (const k of r.keys) if (k.name.endsWith(":" + eventId)) ppCount++;
      c3 = r.list_complete ? null : r.cursor;
    } while (c3);
    return J({ ok: true, event: ev, counts: { ...c, total: meta.length, photopass: ppCount, tiers: tierC }, tickets: meta.map((m) => ({ id: m.id, status: m.s, ver: m.v, owner: m.o, tier: m.tr || null, seat: tkSeat(m.sn) })) });
  }
  if (p === "/ticket/admin/ticket" && request.method === "GET") {
    const t = await tkGetTicket(env, q.get("ticketId"));
    if (!t) return J({ ok: false, error: "not_found" }, 404);
    const ev = await tkGetEvent(env, t.eventId);
    return J({ ok: true, ticket: { ...tkPublicTicket(ev, t, t.status === "valid" ? await tkQr(env, t) : null), history: t.history || [], orderRef: t.orderRef, note: t.note } });
  }
  if (p === "/ticket/admin/refund" && request.method === "POST") {
    const t = await tkGetTicket(env, body.ticketId);
    if (!t) return J({ ok: false, error: "not_found" }, 404);
    if (t.status === "refunded") return J({ ok: true, already: true });
    const ev = await tkGetEvent(env, t.eventId);
    const wasActive = t.status === "valid" || t.status === "used";
    if (t.transfer && t.transfer.token) {
      await env.CODES.delete(tkK.tr(t.transfer.token));
      if (t.transfer.code) await env.CODES.delete(tkK.trc(t.transfer.code));
    }
    t.status = "refunded";
    t.transfer = null;
    t.refundedAt = (/* @__PURE__ */ new Date()).toISOString();
    (t.history = t.history || []).push({ at: t.refundedAt, type: "refund", note: body.note || null });
    await tkPutTicket(env, t);
    if (ev) {
      const T = t.tier ? tkTierOf(ev, t.tier) : null;
      if (T) {
        if (wasActive) T.sold = Math.max(0, Number(T.sold || 0) - 1);
        if (t.seatNo) {
          T.freed = Array.isArray(T.freed) ? T.freed : [];
          if (T.freed.indexOf(t.seatNo) < 0) T.freed.push(t.seatNo);
        }
      } else if (wasActive) {
        ev.sold = Math.max(0, Number(ev.sold || 0) - 1);
      }
      await env.CODES.put(tkK.ev(ev.id), JSON.stringify(ev));
    }
    if (t.owner && t.tier) await env.CODES.delete(tkK.lim(t.owner, t.eventId, t.tier));
    await env.CODES.put("tk:refund:" + t.id, JSON.stringify({ email: t.owner, tier: t.tier || null, seat: tkSeat(t.seatNo), orderRef: t.orderRef || null, at: t.refundedAt }));
    if (t.owner) tkMail(env, t.owner, `\u4F60\u7684\u300A${ev ? ev.name : "CHANCE"}\u300B\u9580\u7968\u5DF2\u9000\u7968`, tkMailWrap("\u9580\u7968\u5DF2\u9000\u7968", `<p>\u7968\u865F ${t.id}${t.tier ? "\uFF08" + (tkTierOf(ev, t.tier) || {}).name + " No." + tkSeat(t.seatNo) + "\uFF09" : ""} \u5DF2\u9000\u7968\uFF0C\u5165\u5834 QR \u5DF2\u5931\u6548\u3002<br>\u9000\u6B3E\u6703\u4F9D\u539F\u4ED8\u6B3E\u65B9\u5F0F\u8655\u7406\uFF0C\u8ACB\u7559\u610F\u5E33\u55AE\u3002</p>`));
    return J({ ok: true, note: "\u7968\u5DF2\u9000\uFF08\u5E2D\u4F4D\u8207\u7D42\u8EAB\u7DE8\u865F\u5DF2\u91CB\u653E\uFF09\u3002\u8ACB\u8A18\u5F97\u5230\u7DA0\u754C\u5F8C\u53F0\u628A\u9019\u7B46\u6B3E\u9000\u5237\u7D66\u7C89\u7D72\u3002", refund: { ticketId: t.id, email: t.owner, orderRef: t.orderRef || null } });
  }
  if (p === "/ticket/admin/void" && request.method === "POST") {
    const t = await tkGetTicket(env, body.ticketId);
    if (!t) return J({ ok: false, error: "not_found" }, 404);
    if (t.transfer && t.transfer.token) await env.CODES.delete(tkK.tr(t.transfer.token));
    t.status = "void";
    t.transfer = null;
    (t.history = t.history || []).push({ at: (/* @__PURE__ */ new Date()).toISOString(), type: "void", note: body.note || null });
    await tkPutTicket(env, t);
    return J({ ok: true });
  }
  if (p === "/ticket/admin/reset" && request.method === "POST") {
    const t = await tkGetTicket(env, body.ticketId);
    if (!t) return J({ ok: false, error: "not_found" }, 404);
    t.status = "valid";
    t.usedAt = null;
    (t.history = t.history || []).push({ at: (/* @__PURE__ */ new Date()).toISOString(), type: "reset" });
    await tkPutTicket(env, t);
    return J({ ok: true });
  }
  const ppsKeyOf = (eventId, at, cid) => "tk:pps:" + eventId + ":" + String(Math.max(0, Math.floor(at))).padStart(13, "0") + ":" + cid;
  if (p === "/ticket/pp/scan" && request.method === "POST") {
    if (!isStaff) return J({ ok: false, error: "forbidden" }, 403);
    const items = Array.isArray(body.items) ? body.items.slice(0, 50) : [];
    const results = [];
    for (const it of items) {
      const cid = String(it.cid || "").replace(/[^A-Za-z0-9]/g, "").slice(0, 24);
      const m = /^CP1\.([A-Z0-9-]+)$/.exec(String(it.qr || "").trim().toUpperCase());
      if (!cid || !m) {
        results.push({ cid, ok: false, reason: "bad_format" });
        continue;
      }
      const t = await tkGetTicket(env, m[1]);
      if (!t) {
        results.push({ cid, ok: false, reason: "not_found", id: m[1] });
        continue;
      }
      if (t.status === "void" || t.status === "refunded") {
        results.push({ cid, ok: false, reason: t.status, id: t.id });
        continue;
      }
      const at = Number(it.at) || tkNow();
      await env.CODES.put(ppsKeyOf(t.eventId, at, cid), "1", { metadata: { id: t.id, tier: t.tier || null, seat: t.seatNo || null, at, srv: tkNow(), dev: String(it.dev || "").slice(0, 16), u: 0 } });
      results.push({ cid, ok: true, id: t.id, tier: t.tier || null, seat: tkSeat(t.seatNo), owner: tkMask(t.owner), eventId: t.eventId });
    }
    return J({ ok: true, results });
  }
  if (p === "/ticket/pp/undo" && request.method === "POST") {
    if (!isStaff) return J({ ok: false, error: "forbidden" }, 403);
    const eventId = String(body.eventId || ""), cid = String(body.cid || "").replace(/[^A-Za-z0-9]/g, "").slice(0, 24);
    if (!/^[a-z0-9-]+$/.test(eventId) || !cid) return J({ ok: false, error: "bad_request" }, 400);
    const k = ppsKeyOf(eventId, Number(body.at) || 0, cid);
    const r = await env.CODES.getWithMetadata(k);
    if (!r || r.value == null) return J({ ok: true, found: false });
    await env.CODES.put(k, "1", { metadata: Object.assign({}, r.metadata || {}, { u: 1, ut: tkNow() }) });
    return J({ ok: true, found: true });
  }
  if (p === "/ticket/pp/scans" && request.method === "POST") {
    if (!isStaff) return J({ ok: false, error: "forbidden" }, 403);
    const eventId = String(body.eventId || "");
    if (!/^[a-z0-9_-]+$/.test(eventId)) return J({ ok: false, error: "bad_request" }, 400);
    const scans = [];
    let cursor;
    do {
      const r = await env.CODES.list({ prefix: "tk:pps:" + eventId + ":", cursor });
      for (const k of r.keys) scans.push(Object.assign({ key: k.name.split(":").pop() }, k.metadata || {}));
      cursor = r.list_complete ? null : r.cursor;
    } while (cursor);
    return J({ ok: true, eventId, count: scans.filter((x2) => !x2.u).length, scans });
  }
  return J({ ok: false, error: "not_found" }, 404);
}
var TKM = {
  VER: "m1",
  CODES: ["b", "h", "s", "bh"],
  DRAFT_TTL: 86400,
  // 運費（NT$）：中華郵政國際 e 小包／兩岸郵政 e 小包官方價目＋約 50 元包材
  ZONES: {
    asia: { label: "\u4E9E\u6D32", b: 200, h: 350, s: 450, bh: 450 },
    cn: { label: "\u4E2D\u570B\u5927\u9678", b: 220, h: 250, s: 310, bh: 310 },
    eu: { label: "\u6B50\u6D32", b: 280, h: 450, s: 600, bh: 600 },
    oc: { label: "\u5927\u6D0B\u6D32", b: 300, h: 480, s: 620, bh: 620 },
    am: { label: "\u52A0\u62FF\u5927\u30FB\u4E2D\u5357\u7F8E\u30FB\u975E\u6D32", b: 320, h: 550, s: 700, bh: 700 },
    us: { label: "\u7F8E\u570B", b: 350, h: 650, s: 850, bh: 850 }
  },
  COUNTRIES: [
    ["JP", "\u65E5\u672C", "asia"],
    ["KR", "\u97D3\u570B", "asia"],
    ["HK", "\u9999\u6E2F", "asia"],
    ["MO", "\u6FB3\u9580", "asia"],
    ["CN", "\u4E2D\u570B\u5927\u9678", "cn"],
    ["SG", "\u65B0\u52A0\u5761", "asia"],
    ["MY", "\u99AC\u4F86\u897F\u4E9E", "asia"],
    ["TH", "\u6CF0\u570B", "asia"],
    ["PH", "\u83F2\u5F8B\u8CD3", "asia"],
    ["VN", "\u8D8A\u5357", "asia"],
    ["ID", "\u5370\u5C3C", "asia"],
    ["US", "\u7F8E\u570B", "us"],
    ["CA", "\u52A0\u62FF\u5927", "am"],
    ["MX", "\u58A8\u897F\u54E5", "am"],
    ["BR", "\u5DF4\u897F", "am"],
    ["AR", "\u963F\u6839\u5EF7", "am"],
    ["CL", "\u667A\u5229", "am"],
    ["ZA", "\u5357\u975E", "am"],
    ["GB", "\u82F1\u570B", "eu"],
    ["FR", "\u6CD5\u570B", "eu"],
    ["DE", "\u5FB7\u570B", "eu"],
    ["IT", "\u7FA9\u5927\u5229", "eu"],
    ["ES", "\u897F\u73ED\u7259", "eu"],
    ["NL", "\u8377\u862D", "eu"],
    ["BE", "\u6BD4\u5229\u6642", "eu"],
    ["CH", "\u745E\u58EB", "eu"],
    ["AT", "\u5967\u5730\u5229", "eu"],
    ["SE", "\u745E\u5178", "eu"],
    ["NO", "\u632A\u5A01", "eu"],
    ["DK", "\u4E39\u9EA5", "eu"],
    ["FI", "\u82AC\u862D", "eu"],
    ["IE", "\u611B\u723E\u862D", "eu"],
    ["PT", "\u8461\u8404\u7259", "eu"],
    ["PL", "\u6CE2\u862D", "eu"],
    ["CZ", "\u6377\u514B", "eu"],
    ["AU", "\u6FB3\u6D32", "oc"],
    ["NZ", "\u7D10\u897F\u862D", "oc"]
  ]
};
var tkmK = {
  order: (email, eventId, tno) => "tk:mo:" + email + ":" + eventId + ":" + tno,
  lim: (email, eventId, item) => "tk:ml:" + email + ":" + eventId + ":" + item,
  draft: (id) => "tk:mxd:" + id
};
function tkmCfg(ev) {
  return ev && ev.merch && ev.merch.items ? ev.merch : null;
}
function tkmOpen(m) {
  if (!m || m.onSale !== true) return false;
  const c = m.cutoff ? Date.parse(m.cutoff) : NaN;
  return isNaN(c) || tkNow() <= c;
}
function tkmLeft(it) {
  const cap = Number(it && it.cap || 0), sold = Number(it && it.sold || 0);
  return cap ? Math.max(0, cap - sold) : 9999;
}
function tkmCountry(code) {
  const c = String(code || "").toUpperCase();
  return TKM.COUNTRIES.filter(function(x2) {
    return x2[0] === c;
  })[0] || null;
}
function tkmResolve(m, code) {
  if (TKM.CODES.indexOf(code) < 0 || !m || !m.items) return null;
  const I = m.items;
  if (code === "bh" && I.s && Number(I.s.price) > 0 && tkmLeft(I.s) > 0) code = "s";
  const items = {};
  if (code === "bh") {
    items.b = 1;
    items.h = 1;
  } else items[code] = 1;
  let price = 0;
  const names = [];
  for (const k in items) {
    const it = I[k];
    if (!it || !(Number(it.price) > 0)) return null;
    price += Number(it.price);
    names.push(it.short || it.name || k);
  }
  return { code, items, price, label: code === "s" ? I.s && I.s.short || "\u96D9\u4EF6\u7D44" : names.join("\uFF0B") };
}
async function tkmCheck(env, ev, code, email) {
  const m = tkmCfg(ev);
  if (!m) return { ok: false, status: 409, message: "\u9019\u5834\u6D3B\u52D5\u6C92\u6709\u5468\u908A" };
  if (!tkmOpen(m)) return { ok: false, status: 409, message: m.onSale === true ? "\u5468\u908A\u9810\u8CFC\u5DF2\u622A\u6B62" : "\u5468\u908A\u5C1A\u672A\u958B\u8CE3" };
  const r = tkmResolve(m, code);
  if (!r) return { ok: false, status: 400, message: "unknown product" };
  for (const k in r.items) {
    const it = m.items[k];
    if (tkmLeft(it) < r.items[k]) return { ok: false, status: 409, message: (it.short || it.name) + " \u5DF2\u552E\u5B8C" };
    if (Number(m.perPerson || 0) > 0 && email && await env.CODES.get(tkmK.lim(tkEmail(email), ev.id, k)))
      return { ok: false, status: 409, message: (it.short || it.name) + " \u6BCF\u4EBA\u9650\u8CFC 1 \u4EFD\uFF0C\u4F60\u5DF2\u7D93\u8CB7\u904E\u4E86" };
  }
  return { ok: true, m, r };
}
async function tkmHasTicket(env, email, eventId) {
  let cursor;
  do {
    const r = await env.CODES.list({ prefix: "tk:o:" + email + ":", cursor });
    for (const k of r.keys) {
      const t = await tkGetTicket(env, k.name.slice(("tk:o:" + email + ":").length));
      if (t && t.owner === email && t.eventId === eventId && (t.status === "valid" || t.status === "used")) return true;
    }
    cursor = r.list_complete ? null : r.cursor;
  } while (cursor);
  return false;
}
function tkmShipClean(s) {
  const f = function(v, n) {
    return String(v == null ? "" : v).replace(/[\u0000-\u001f<>]/g, " ").trim().slice(0, n);
  };
  s = s || {};
  return {
    country: f(s.country, 2).toUpperCase(),
    name: f(s.name, 60),
    phone: f(s.phone, 30),
    postal: f(s.postal, 16),
    addr: f(s.addr, 160),
    city: f(s.city, 60),
    state: f(s.state, 60)
  };
}
function tkmPublic(ev) {
  const m = tkmCfg(ev);
  if (!m) return null;
  const items = {};
  for (const k of ["b", "h", "s"]) {
    const it = m.items[k];
    if (!it) continue;
    items[k] = {
      name: it.name || k,
      short: it.short || it.name || k,
      price: Number(it.price || 0),
      cap: Number(it.cap || 0),
      left: tkmLeft(it),
      perk: it.perk || "",
      img: it.img || ""
    };
  }
  const b = items.b, h = items.h, s = items.s;
  return {
    open: tkmOpen(m),
    onSale: m.onSale === true,
    cutoff: m.cutoff || null,
    perPerson: Number(m.perPerson || 0),
    items,
    setSave: b && h && s ? b.price + h.price - s.price : 0,
    shipOn: m.shipOn !== false
  };
}
async function tkMerchProduct(env, productKey, email) {
  let mm;
  if (mm = /^(meet-[a-z0-9-]+?)-(vvip|vip|ga)-x-(b|h|s|bh)$/.exec(productKey)) {
    const base = await tkProduct(env, mm[1] + "-" + mm[2], email);
    if (!base || !base.ok) return base || { ok: false, status: 400, message: "unknown product" };
    const ev = await tkGetEvent(env, mm[1]);
    const c = await tkmCheck(env, ev, mm[3], email);
    if (!c.ok) return c;
    const total = Number(base.product.price) + c.r.price;
    return {
      ok: true,
      product: { productId: productKey, name: base.product.name + "\uFF0B" + c.r.label, price: total, unlockType: "meet", itemName: ev.name + " \u9580\u7968\uFF0B" + c.r.label + "#" + total },
      extra: Object.assign({}, base.extra, { addon: c.r.code, mitems: c.r.items, mprice: c.r.price, fee: 0, mode: "pickup" })
    };
  }
  if (mm = /^mx-([A-Z0-9]{12})$/.exec(productKey)) {
    const d = await env.CODES.get(tkmK.draft(mm[1]), "json");
    if (!d) return { ok: false, status: 410, message: "\u8A02\u55AE\u8CC7\u6599\u904E\u671F\u4E86\uFF0C\u8ACB\u91CD\u65B0\u586B\u5BEB" };
    if (email && tkEmail(email) !== d.email) return { ok: false, status: 409, message: "email \u8DDF\u586B\u5BEB\u6642\u4E0D\u4E00\u6A23\uFF0C\u8ACB\u91CD\u65B0\u586B\u5BEB" };
    const ev = await tkGetEvent(env, d.eventId);
    if (!ev) return { ok: false, status: 400, message: "unknown product" };
    if (d.mode === "pickup" && !await tkmHasTicket(env, d.email, ev.id)) return { ok: false, status: 409, message: "\u73FE\u5834\u9818\u53D6\u9700\u8981\u6301\u6709\u9019\u5834\u7684\u9580\u7968" };
    const c = await tkmCheck(env, ev, d.code, d.email);
    if (!c.ok) return c;
    let fee = 0;
    if (d.mode === "ship") {
      const z = TKM.ZONES[d.zone];
      if (!z) return { ok: false, status: 400, message: "\u9019\u500B\u570B\u5BB6\uFF0F\u5730\u5340\u76EE\u524D\u7121\u6CD5\u5BC4\u9001" };
      fee = Number(z[c.r.code] || 0);
    }
    const total = c.r.price + fee;
    return {
      ok: true,
      product: { productId: "mx-" + ev.id + "-" + c.r.code, name: "\u300A" + ev.name + "\u300B" + c.r.label + (d.mode === "ship" ? "\uFF08\u6D77\u5916\u5BC4\u9001\uFF09" : "\uFF08\u73FE\u5834\u9818\u53D6\uFF09"), price: total, unlockType: "meet", itemName: ev.name + " " + c.r.label + (fee ? "\uFF0B\u904B\u8CBB" : "") + "#" + total },
      extra: { eventId: ev.id, merchOnly: true, draftId: mm[1], addon: c.r.code, mitems: c.r.items, mprice: c.r.price, fee, mode: d.mode, ship: d.mode === "ship" ? d.ship : null }
    };
  }
  return null;
}
async function tkMerchOnPaid(env, o, tradeNo, params) {
  o.status = "paid";
  o.paymentStatus = "paid";
  o.ecpayTradeNo = params && params.TradeNo || null;
  o.paidAt = (/* @__PURE__ */ new Date()).toISOString();
  let ticketIds = [];
  if (!o.merchOnly) {
    const r = await tkIssue(env, { eventId: o.eventId, email: o.email, qty: 1, orderRef: tradeNo, note: "ecpay", force: true, tier: o.tier || null });
    o.ticket = r.ok ? { ok: true, ids: r.tickets.map((t) => t.id), emailed: r.emailed } : { ok: false, error: r.error };
    if (!r.ok) await env.CODES.put("ticket:failed:" + tradeNo, JSON.stringify({ email: o.email, eventId: o.eventId, amount: o.amount, reason: r.error, ts: tkNow() }));
    else ticketIds = o.ticket.ids;
  }
  const ev = await tkGetEvent(env, o.eventId);
  const mi = o.mitems || {};
  if (ev && ev.merch && ev.merch.items) {
    for (const k in mi) {
      const it = ev.merch.items[k];
      if (it) it.sold = Number(it.sold || 0) + Number(mi[k] || 0);
    }
    await env.CODES.put(tkK.ev(ev.id), JSON.stringify(ev));
  }
  for (const k in mi) await env.CODES.put(tkmK.lim(o.email, o.eventId, k), tradeNo);
  const rec = {
    tradeNo,
    eventId: o.eventId,
    email: o.email,
    name: o.buyerName || "",
    code: o.addon,
    items: mi,
    mprice: Number(o.mprice || 0),
    fee: Number(o.fee || 0),
    amount: o.amount,
    mode: o.mode || "pickup",
    ship: o.ship || null,
    ticketIds,
    paidAt: o.paidAt,
    status: "paid",
    shipped: null
  };
  await env.CODES.put(tkmK.order(o.email, o.eventId, tradeNo), JSON.stringify(rec), { metadata: { e: o.eventId, c: o.addon, m: rec.mode, at: o.paidAt } });
  if (o.draftId) {
    try {
      await env.CODES.delete(tkmK.draft(o.draftId));
    } catch (e) {
    }
  }
  o.merch = { ok: true, code: o.addon };
  const mailed = await tkMail(env, o.email, "\u4F60\u7684\u300A" + (ev && ev.name || "CHANCE") + "\u300B\u751F\u65E5\u9650\u5B9A\u5468\u908A\u8A02\u55AE", tkMailWrap("\u5468\u908A\u8A02\u55AE\u6210\u7ACB", tkmMailBody(ev, rec)));
  o.emailSent = o.merchOnly ? mailed : !!(o.ticket && o.ticket.ok && o.ticket.emailed);
  return o;
}
function tkmLines(ev, rec) {
  const I = ev && ev.merch && ev.merch.items || {};
  if (rec.code === "s") return [(I.s && I.s.name || "\u96D9\u4EF6\u7D44") + " \xD71"];
  return Object.keys(rec.items || {}).map(function(k) {
    return (I[k] && I[k].name || k) + " \xD71";
  });
}
function tkmMailBody(ev, rec) {
  const esc = function(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function(c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  };
  let h = "<p><b>" + esc(ev && ev.name || "") + "</b>\u3000\u751F\u65E5\u9650\u5B9A\u5468\u908A\uFF08\u9810\u8CFC\uFF09</p><p>" + tkmLines(ev, rec).map(esc).join("<br>") + "</p>";
  h += "<p>\u5546\u54C1 NT$" + rec.mprice + (rec.fee ? "\u3000\u904B\u8CBB NT$" + rec.fee : "") + "\u3000\u5408\u8A08 NT$" + rec.amount + "</p>";
  if (rec.mode === "ship") {
    const s = rec.ship || {}, c = tkmCountry(s.country);
    h += "<p>\u5BC4\u9001\u5230\uFF1A" + esc(s.name) + "\u3000" + esc(s.phone) + "<br>" + esc([s.addr, s.city, s.state, s.postal].filter(Boolean).join(", ")) + "<br>" + esc(c ? c[1] : s.country) + "</p>";
    h += "<p>\u6D3B\u52D5\u7D50\u675F\u5F8C\u9678\u7E8C\u5BC4\u51FA\uFF08\u9644 CHANCE \u624B\u5BEB\u540D\u5B57\u5361\uFF09\uFF0C\u5BC4\u51FA\u6642\u6703\u518D\u5BC4\u4E00\u5C01\u9644\u8FFD\u8E64\u865F\u78BC\u7684\u4FE1\u3002</p>";
    h += '<p style="color:#9c9589">\u63A1\u4E2D\u83EF\u90F5\u653F e \u5C0F\u5305\u5BC4\u9001\u3002\u5BC4\u51FA\u5F8C\u8D85\u904E 45 \u5929\u4ECD\u672A\u9001\u9054\u6216\u7269\u6D41\u986F\u793A\u907A\u5931\uFF0C\u6211\u5011\u514D\u8CBB\u91CD\u5BC4\u4E00\u6B21\uFF1B\u5730\u5740\u586B\u5BEB\u932F\u8AA4\u6216\u62D2\u6536\u9000\u56DE\u9700\u81EA\u4ED8\u91CD\u5BC4\u904B\u8CBB\uFF1B\u7269\u6D41\u986F\u793A\u5DF2\u6295\u905E\u6055\u4E0D\u88DC\u5BC4\uFF1B\u95DC\u7A05\u8207\u9032\u53E3\u7A05\u7531\u6536\u4EF6\u4EBA\u8CA0\u64D4\u3002</p>';
  } else {
    h += "<p>12/27 \u6D3B\u52D5\u7576\u5929\u6191\u7968\u73FE\u5834\u9818\u53D6\u3002" + (rec.code === "s" ? "\u96D9\u4EF6\u7D44\u542B\u4E00\u5C0D\u4E00 60 \u79D2\uFF0CCHANCE \u6703\u89AA\u624B\u5E6B\u4F60\u6234\u4E0A\u624B\u934A\u3001\u5728\u5E3DT \u4E0A\u7C3D\u540D\u3002" : (rec.items && rec.items.b ? "CHANCE \u6703\u89AA\u624B\u5E6B\u4F60\u6234\u4E0A\u624B\u934A\u3002" : "") + (rec.items && rec.items.h ? "CHANCE \u6703\u7576\u5834\u5728\u5E3DT \u4E0A\u7C3D\u540D\u3002" : "")) + "</p>";
  }
  h += '<p>\u6253\u958B <a href="' + TK.APP_URL + '" style="color:#d8bc80">CHANCE app</a> \u2192 SHOP \u2192 \u7968\u593E\uFF0C\u7528\u9019\u500B email\uFF08' + esc(rec.email) + "\uFF09\u767B\u5165\u5C31\u770B\u5F97\u5230\u8A02\u55AE\u3002</p>";
  return h;
}
async function tkMerchRouter(request, url, env) {
  if (request.method === "OPTIONS") return new Response(null, { headers: tkCors(request, env) });
  const p = url.pathname, q = url.searchParams;
  const body = request.method === "POST" ? await tkBody(request) : {};
  const J = (d, s) => tkJson(d, s, request, env);
  const ak = body.adminKey || q.get("adminKey");
  const isAdmin = !!ak && !!env.ADMIN_KEY && ak === env.ADMIN_KEY;
  if (p === "/ticket/merch" && request.method === "GET") {
    const ev = await tkGetEvent(env, q.get("eventId"));
    if (!ev) return J({ ok: false, error: "no_event" }, 404);
    return J({ ok: true, v: TKM.VER, eventId: ev.id, merch: tkmPublic(ev), ship: { zones: TKM.ZONES, countries: TKM.COUNTRIES } });
  }
  if (p === "/ticket/merch/draft" && request.method === "POST") {
    const ev = await tkGetEvent(env, body.eventId);
    if (!ev) return J({ ok: false, message: "\u627E\u4E0D\u5230\u9019\u5834\u6D3B\u52D5" }, 404);
    const email = tkEmail(body.email);
    if (!tkValidEmail(email)) return J({ ok: false, message: "\u8ACB\u8F38\u5165\u6B63\u78BA\u7684 email" }, 400);
    const mode = body.mode === "ship" ? "ship" : "pickup";
    let ship = null, zone = null;
    if (mode === "pickup") {
      const sess = await tkSession(env, body.session);
      if (!sess || sess.email !== email) return J({ ok: false, message: "\u8ACB\u5148\u767B\u5165\u7968\u593E" }, 401);
      if (!await tkmHasTicket(env, email, ev.id)) return J({ ok: false, message: "\u73FE\u5834\u9818\u53D6\u9700\u8981\u6301\u6709\u9019\u5834\u7684\u9580\u7968\uFF1B\u6C92\u6709\u9580\u7968\u53EF\u4EE5\u9078\u6D77\u5916\u5BC4\u9001" }, 409);
    } else {
      const m0 = tkmCfg(ev);
      if (m0 && m0.shipOn === false) return J({ ok: false, message: "\u76EE\u524D\u4E0D\u63D0\u4F9B\u5BC4\u9001" }, 409);
      ship = tkmShipClean(body.ship);
      const c = tkmCountry(ship.country);
      if (!c) return J({ ok: false, message: "\u9019\u500B\u570B\u5BB6\uFF0F\u5730\u5340\u76EE\u524D\u7121\u6CD5\u5BC4\u9001" }, 400);
      if (!ship.name || ship.phone.length < 5 || ship.addr.length < 5) return J({ ok: false, message: "\u8ACB\u586B\u5B8C\u6574\u6536\u4EF6\u4EBA\u3001\u96FB\u8A71\u3001\u5730\u5740" }, 400);
      if (!ship.postal && ["HK", "MO"].indexOf(ship.country) < 0) return J({ ok: false, message: "\u8ACB\u586B\u90F5\u905E\u5340\u865F" }, 400);
      zone = c[2];
    }
    const chk = await tkmCheck(env, ev, String(body.code || ""), email);
    if (!chk.ok) return J({ ok: false, message: chk.message }, chk.status || 409);
    const fee = mode === "ship" ? Number(TKM.ZONES[zone][chk.r.code] || 0) : 0;
    let id = tkRand(12);
    for (let i2 = 0; i2 < 3 && await env.CODES.get(tkmK.draft(id)); i2++) id = tkRand(12);
    await env.CODES.put(tkmK.draft(id), JSON.stringify({ eventId: ev.id, email, code: chk.r.code, mode, zone, ship, at: tkNow() }), { expirationTtl: TKM.DRAFT_TTL });
    return J({ ok: true, draftId: id, productKey: "mx-" + id, code: chk.r.code, label: chk.r.label, price: chk.r.price, fee, total: chk.r.price + fee });
  }
  if (p === "/ticket/merch/mine" && request.method === "POST") {
    const sess = await tkSession(env, body.session);
    if (!sess) return J({ ok: false, error: "no_session" }, 401);
    const out = [];
    let cursor;
    do {
      const r = await env.CODES.list({ prefix: "tk:mo:" + sess.email + ":", cursor });
      for (const k of r.keys) {
        const v = await env.CODES.get(k.name, "json");
        if (v) out.push(v);
      }
      cursor = r.list_complete ? null : r.cursor;
    } while (cursor);
    out.sort(function(a, b) {
      return String(a.paidAt || "").localeCompare(String(b.paidAt || ""));
    });
    return J({ ok: true, orders: out });
  }
  if (!isAdmin) return J({ ok: false, error: "forbidden" }, 403);
  if (p === "/ticket/admin/merch" && request.method === "POST") {
    const ev = await tkGetEvent(env, body.eventId);
    if (!ev) return J({ ok: false, error: "no_event" }, 404);
    const inM = body.merch || {}, old = ev.merch || { items: {} };
    const nm = Object.assign({}, old, { items: Object.assign({}, old.items || {}) });
    if (inM.onSale !== void 0) nm.onSale = inM.onSale === true;
    if (inM.shipOn !== void 0) nm.shipOn = inM.shipOn !== false;
    if (inM.cutoff !== void 0) nm.cutoff = inM.cutoff || null;
    if (inM.perPerson !== void 0) nm.perPerson = Math.max(0, Math.min(1, Number(inM.perPerson) || 0));
    for (const k of ["b", "h", "s"]) {
      const it = inM.items && inM.items[k];
      if (!it) continue;
      const o2 = nm.items[k] || {};
      nm.items[k] = {
        name: it.name ?? o2.name ?? k,
        short: it.short ?? o2.short ?? "",
        price: Number(it.price ?? o2.price ?? 0),
        cap: Number(it.cap ?? o2.cap ?? 0),
        perk: it.perk ?? o2.perk ?? "",
        img: it.img ?? o2.img ?? "",
        sold: Number(o2.sold || 0)
      };
    }
    ev.merch = nm;
    await env.CODES.put(tkK.ev(ev.id), JSON.stringify(ev));
    return J({ ok: true, merch: nm, public: tkmPublic(ev) });
  }
  if (p === "/ticket/admin/merch/orders" && request.method === "GET") {
    const eventId = q.get("eventId");
    const out = [];
    let cursor;
    do {
      const r = await env.CODES.list({ prefix: "tk:mo:", cursor });
      for (const k of r.keys) {
        if (k.metadata && k.metadata.e !== eventId) continue;
        const v = await env.CODES.get(k.name, "json");
        if (v && v.eventId === eventId) out.push(v);
      }
      cursor = r.list_complete ? null : r.cursor;
    } while (cursor);
    out.sort(function(a, b) {
      return String(a.paidAt || "").localeCompare(String(b.paidAt || ""));
    });
    const ev = await tkGetEvent(env, eventId);
    return J({ ok: true, merch: ev ? ev.merch || null : null, orders: out });
  }
  if (p === "/ticket/admin/merch/ship" && request.method === "POST") {
    const email = tkEmail(body.email), k = tkmK.order(email, String(body.eventId || ""), String(body.tradeNo || ""));
    const rec = await env.CODES.get(k, "json");
    if (!rec) return J({ ok: false, error: "not_found" }, 404);
    const tracking = String(body.tracking || "").replace(/[^A-Za-z0-9-]/g, "").slice(0, 40);
    if (!tracking) return J({ ok: false, error: "no_tracking" }, 400);
    rec.shipped = { at: (/* @__PURE__ */ new Date()).toISOString(), tracking };
    await env.CODES.put(k, JSON.stringify(rec), { metadata: { e: rec.eventId, c: rec.code, m: rec.mode, at: rec.paidAt, sh: 1 } });
    const ev = await tkGetEvent(env, rec.eventId);
    const sent = await tkMail(env, email, "\u4F60\u7684 CHANCE \u751F\u65E5\u9650\u5B9A\u5468\u908A\u5DF2\u5BC4\u51FA", tkMailWrap(
      "\u5468\u908A\u5DF2\u5BC4\u51FA",
      "<p>" + tkmLines(ev, rec).join("<br>") + "</p><p>\u4E2D\u83EF\u90F5\u653F\u8FFD\u8E64\u865F\u78BC\uFF1A<b>" + tracking + '</b><br>\u53EF\u5230\u4E2D\u83EF\u90F5\u653F\u7DB2\u7AD9\u6216\u7576\u5730\u90F5\u653F\u7DB2\u7AD9\u67E5\u8A62\u3002</p><p style="color:#9c9589">\u5BC4\u51FA\u5F8C\u8D85\u904E 45 \u5929\u4ECD\u672A\u9001\u9054\u6216\u7269\u6D41\u986F\u793A\u907A\u5931\uFF0C\u8ACB\u56DE\u4FE1\u544A\u8A34\u6211\u5011\uFF0C\u6703\u514D\u8CBB\u91CD\u5BC4\u4E00\u6B21\u3002</p>'
    ));
    return J({ ok: true, emailed: sent });
  }
  return J({ ok: false, error: "not_found" }, 404);
}
var CM = { VER: "cm1", MAX_BODY: 300, MAX_NAME: 12, MAX_ITEMS: 800, RATE_PER_HOUR: 5, ARTIST_NAME: "\u6210\u665E Chance", ARTIST_AVATAR: "assets/images/avatar.jpg" };
var cmK = {
  doc: (album, track) => "cm:" + album + ":" + track,
  rl: (uid, album, track) => "cm:rl:" + uid + ":" + album + ":" + track,
  ban: () => "cm:ban"
};
function cmSafeId(s, n) {
  return String(s || "").replace(/[^A-Za-z0-9_-]/g, "").slice(0, n || 40);
}
async function cmHash(email) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("cm|" + String(email || "").trim().toLowerCase()));
  return Array.from(new Uint8Array(buf)).slice(0, 8).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function cmNewId() {
  const b = new Uint8Array(6);
  crypto.getRandomValues(b);
  return Date.now().toString(36) + Array.from(b).map((x2) => x2.toString(16).padStart(2, "0")).join("");
}
function cmClean(s, max2) {
  return String(s || "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").replace(/\s+\n/g, "\n").trim().slice(0, max2);
}
async function cmLoad(env, album, track) {
  try {
    const raw = await env.CODES.get(cmK.doc(album, track));
    if (raw) {
      const d = JSON.parse(raw);
      if (d && Array.isArray(d.items)) return d;
    }
  } catch (e) {
  }
  return { items: [] };
}
async function cmSave(env, album, track, doc) {
  if (doc.items.length > CM.MAX_ITEMS) {
    const pinned = doc.items.filter((x2) => x2.isPinned || x2.isArtist), rest = doc.items.filter((x2) => !(x2.isPinned || x2.isArtist));
    doc.items = pinned.concat(rest.slice(rest.length - (CM.MAX_ITEMS - pinned.length)));
  }
  await env.CODES.put(cmK.doc(album, track), JSON.stringify(doc));
}
function cmPublic(it, uid) {
  return {
    id: it.id,
    trackId: it.trackId,
    userName: it.userName,
    avatar: it.avatar || "",
    body: it.body,
    timestampSeconds: it.timestampSeconds,
    createdAt: it.createdAt,
    likes: (it.likedBy || []).length,
    liked: !!(uid && (it.likedBy || []).indexOf(uid) >= 0),
    replyCount: it.replyCount || 0,
    isArtist: !!it.isArtist,
    isPinned: !!it.isPinned,
    mine: !!(uid && it.userId === uid)
  };
}
function cmSort(items) {
  return items.slice().sort((a, b) => Number(b.isPinned) - Number(a.isPinned) || Number(b.isArtist) - Number(a.isArtist) || (a.timestampSeconds == null) - (b.timestampSeconds == null) || (a.timestampSeconds || 0) - (b.timestampSeconds || 0) || a.createdAt - b.createdAt);
}
async function cmRouter(request, url, env) {
  if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders(request, env) });
  const q = url.searchParams;
  let body = {};
  if (request.method === "POST") {
    try {
      body = await request.json();
    } catch (e) {
      return json({ ok: false, message: "bad request" }, 400, request, env);
    }
  }
  const album = cmSafeId(body.album || q.get("album"), 40), track = cmSafeId(body.track || q.get("track"), 12);
  if (!album || !track) return json({ ok: false, message: "album/track required" }, 400, request, env);
  if (url.pathname === "/comments/list" && request.method === "GET") {
    const doc = await cmLoad(env, album, track);
    const uid = q.get("email") ? await cmHash(q.get("email")) : "";
    return json({ ok: true, v: CM.VER, count: doc.items.length, items: cmSort(doc.items).map((it) => cmPublic(it, uid)) }, 200, request, env);
  }
  if (url.pathname === "/comments/post" && request.method === "POST") {
    const email = String(body.email || "").trim().toLowerCase(), code = String(body.code || "").trim().toUpperCase();
    const auth = await authenticate(env, email, code);
    if (!auth) return json({ ok: false, message: "unauthorized" }, 401, request, env);
    const uid = await cmHash(email);
    let ban = {};
    try {
      ban = JSON.parse(await env.CODES.get(cmK.ban()) || "{}") || {};
    } catch (e) {
    }
    if (ban[uid]) return json({ ok: false, message: "blocked" }, 403, request, env);
    const text = cmClean(body.body, CM.MAX_BODY), name = cmClean(body.userName, CM.MAX_NAME) || "\u7C89\u7D72";
    if (!text) return json({ ok: false, message: "empty" }, 400, request, env);
    const rlKey = cmK.rl(uid, album, track);
    const used = Number(await env.CODES.get(rlKey) || 0);
    if (used >= CM.RATE_PER_HOUR) return json({ ok: false, message: "rate" }, 429, request, env);
    await env.CODES.put(rlKey, String(used + 1), { expirationTtl: 3600 });
    let ts = null;
    if (body.timestampSeconds != null && Number.isFinite(Number(body.timestampSeconds))) ts = Math.max(0, Math.floor(Number(body.timestampSeconds)));
    const it = {
      id: cmNewId(),
      trackId: album + ":" + track,
      userId: uid,
      userName: name,
      avatar: "",
      body: text,
      timestampSeconds: ts,
      createdAt: Date.now(),
      likedBy: [],
      replyCount: 0,
      isArtist: false,
      isPinned: false
    };
    const doc = await cmLoad(env, album, track);
    doc.items.push(it);
    await cmSave(env, album, track, doc);
    return json({ ok: true, v: CM.VER, item: cmPublic(it, uid), count: doc.items.length }, 200, request, env);
  }
  if (url.pathname === "/comments/like" && request.method === "POST") {
    const email = String(body.email || "").trim().toLowerCase(), code = String(body.code || "").trim().toUpperCase();
    const auth = await authenticate(env, email, code);
    if (!auth) return json({ ok: false, message: "unauthorized" }, 401, request, env);
    const uid = await cmHash(email), id = cmSafeId(body.id, 40);
    const doc = await cmLoad(env, album, track);
    const it = doc.items.find((x2) => x2.id === id);
    if (!it) return json({ ok: false, message: "not found" }, 404, request, env);
    it.likedBy = it.likedBy || [];
    const i2 = it.likedBy.indexOf(uid);
    if (i2 >= 0) it.likedBy.splice(i2, 1);
    else it.likedBy.push(uid);
    await cmSave(env, album, track, doc);
    return json({ ok: true, item: cmPublic(it, uid) }, 200, request, env);
  }
  const key2 = body.key || q.get("key");
  if (!env.ADMIN_KEY || key2 !== env.ADMIN_KEY) return json({ ok: false, message: "not found" }, 404, request, env);
  if (url.pathname === "/comments/admin/list" && request.method === "GET") {
    const doc = await cmLoad(env, album, track);
    let ban = {};
    try {
      ban = JSON.parse(await env.CODES.get(cmK.ban()) || "{}") || {};
    } catch (e) {
    }
    return json({ ok: true, v: CM.VER, items: cmSort(doc.items).map((it) => Object.assign(cmPublic(it, ""), { userId: it.userId, banned: !!ban[it.userId] })) }, 200, request, env);
  }
  if (url.pathname === "/comments/admin" && request.method === "POST") {
    const action = String(body.action || ""), id = cmSafeId(body.id, 40);
    const doc = await cmLoad(env, album, track);
    if (action === "post") {
      const text = cmClean(body.body, CM.MAX_BODY);
      if (!text) return json({ ok: false, message: "empty" }, 400, request, env);
      let ts = null;
      if (body.timestampSeconds != null && Number.isFinite(Number(body.timestampSeconds))) ts = Math.max(0, Math.floor(Number(body.timestampSeconds)));
      const it2 = {
        id: cmNewId(),
        trackId: album + ":" + track,
        userId: "artist",
        userName: cmClean(body.userName, 20) || CM.ARTIST_NAME,
        avatar: CM.ARTIST_AVATAR,
        body: text,
        timestampSeconds: ts,
        createdAt: Date.now(),
        likedBy: [],
        replyCount: 0,
        isArtist: true,
        isPinned: body.isPinned !== false
      };
      doc.items.push(it2);
      await cmSave(env, album, track, doc);
      return json({ ok: true, item: cmPublic(it2, "") }, 200, request, env);
    }
    const it = doc.items.find((x2) => x2.id === id);
    if (action === "del") {
      if (!it) return json({ ok: false, message: "not found" }, 404, request, env);
      doc.items = doc.items.filter((x2) => x2.id !== id);
      await cmSave(env, album, track, doc);
      return json({ ok: true, count: doc.items.length }, 200, request, env);
    }
    if (action === "pin" || action === "unpin") {
      if (!it) return json({ ok: false, message: "not found" }, 404, request, env);
      it.isPinned = action === "pin";
      await cmSave(env, album, track, doc);
      return json({ ok: true, item: cmPublic(it, "") }, 200, request, env);
    }
    if (action === "ban" || action === "unban") {
      const uid = cmSafeId(body.userId || it && it.userId, 20);
      if (!uid || uid === "artist") return json({ ok: false, message: "userId required" }, 400, request, env);
      let ban = {};
      try {
        ban = JSON.parse(await env.CODES.get(cmK.ban()) || "{}") || {};
      } catch (e) {
      }
      if (action === "ban") ban[uid] = true;
      else delete ban[uid];
      await env.CODES.put(cmK.ban(), JSON.stringify(ban));
      if (action === "ban" && body.purge) {
        doc.items = doc.items.filter((x2) => x2.userId !== uid);
        await cmSave(env, album, track, doc);
      }
      return json({ ok: true, banned: action === "ban" }, 200, request, env);
    }
    return json({ ok: false, message: "unknown action" }, 400, request, env);
  }
  return json({ ok: false, message: "not found" }, 404, request, env);
}
export {
  WalletOwnership,
  worker_default as default
};
