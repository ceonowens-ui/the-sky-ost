// PR 檢查（給 .github/workflows/pr-check.yml 用）
// 用法：node .github/scripts/pr-check.mjs <prod|secrets|pages> <base>
//   prod    → PR 動到正式站檔案（.github/prod-files.txt）就紅燈
//   secrets → PR 新加的程式裡有像金鑰／密碼的字串就紅燈（只印檔名和行號，不印內容）
//   pages   → 測試頁或改到的頁面程式寫壞（語法錯、引用的檔案不見）就紅燈
// 只讀檔案，不改任何東西，不影響網站。

import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, writeFileSync, appendFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [mode, base = "origin/main"] = process.argv.slice(2);

const git = (...args) => execFileSync("git", args, { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 });
const summary = (text) => {
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, text + "\n");
  console.log(text);
};
const annotate = (file, line, msg) => {
  // GitHub 會把這行顯示在 PR 的檔案上
  console.log(`::error file=${file}${line ? `,line=${line}` : ""}::${msg}`);
};

function changedFiles() {
  return git("diff", "--name-only", "--no-renames", `${base}...HEAD`).split("\n").filter(Boolean);
}

// ---------- 1 正式站檔案 ----------
function checkProd() {
  const list = readFileSync(".github/prod-files.txt", "utf8")
    .split("\n").map((s) => s.trim()).filter((s) => s && !s.startsWith("#"));
  const hits = changedFiles().filter((f) => list.includes(f));
  if (!hits.length) {
    summary("### ✅ 1 正式站檔案：沒有動到正式站\n這張 PR 只動測試站或其他檔案。");
    return 0;
  }
  summary("### 🔴 1 正式站檔案：這張 PR 會動到正式站\n");
  summary("轉正時亮紅燈是正常的提醒；如果這張不是轉正，就不應該合併。\n");
  for (const f of hits) { summary(`- \`${f}\``); annotate(f, 0, "這個檔案是正式站在用的"); }
  return 1;
}

// ---------- 2 金鑰密碼 ----------
const SECRET_PATTERNS = [
  ["私鑰", /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ["AWS 金鑰", /\bAKIA[0-9A-Z]{16}\b/],
  ["GitHub 金鑰", /\b(gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{40,})\b/],
  ["Stripe 金鑰", /\b[sr]k_(live|test)_[0-9A-Za-z]{20,}\b/],
  ["Resend 金鑰", /\bre_[A-Za-z0-9]{8,}_[A-Za-z0-9]{16,}\b/],
  ["Google 金鑰", /\bAIza[0-9A-Za-z_-]{35}\b/],
  ["Slack 金鑰", /\bxox[abprs]-[0-9A-Za-z-]{10,}\b/],
  ["登入憑證（JWT）", /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/],
  ["密碼或金鑰寫在程式裡",
    /\b(api[_-]?key|secret|password|passwd|pwd|access[_-]?token|auth[_-]?token|admin[_-]?key|hash[_-]?key|hash[_-]?iv|merchant[_-]?key|private[_-]?key)["']?\s*[:=]\s*["'`][^"'`\s]{8,}["'`]/i],
];
const SECRET_FILES = /(^|\/)(\.env(\..*)?|\.dev\.vars|[^/]+\.(pem|p12|pfx|key|keystore|mobileprovision))$/i;

function checkSecrets() {
  const hits = [];
  for (const f of changedFiles()) {
    if (SECRET_FILES.test(f) && existsSync(f)) hits.push([f, 0, "這種檔案通常裝的是金鑰或憑證，不該放上 GitHub"]);
  }
  const diff = git("diff", "-U0", "--no-color", "--no-renames", `${base}...HEAD`);
  let file = null, line = 0;
  for (const raw of diff.split("\n")) {
    if (raw.startsWith("+++ ")) { file = raw.startsWith("+++ b/") ? raw.slice(6) : null; continue; }
    const h = raw.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
    if (h) { line = Number(h[1]); continue; }
    if (!file || raw.startsWith("---")) continue;
    if (raw.startsWith("+")) {
      const text = raw.slice(1);
      for (const [label, re] of SECRET_PATTERNS) {
        if (re.test(text)) { hits.push([file, line, label]); break; }
      }
      line++;
    }
  }
  if (!hits.length) {
    summary("### ✅ 2 金鑰密碼：沒有找到像金鑰、密碼的字串");
    return 0;
  }
  summary("### 🔴 2 金鑰密碼：有像金鑰或密碼的字串\n");
  summary("為了安全，這裡只列位置，不印內容。真的是金鑰的話，要拿掉並到原服務換一把新的。\n");
  for (const [f, l, label] of hits) { summary(`- \`${f}\`${l ? ` 第 ${l} 行` : ""}：${label}`); annotate(f, l, label); }
  return 1;
}

// ---------- 3 測試頁能打開 ----------
const ALWAYS_CHECK = ["test-v2.html", "ticket-ui-v2.js", "shop-language-v2.js", "ticket-admin-v2.html"];
const NON_JS_TYPES = /json|template|text\/(?!javascript)|x-/i;
const tmp = mkdtempSync(join(tmpdir(), "pr-check-"));
let tmpCount = 0;

function nodeCheck(code, isModule, padLines) {
  const p = join(tmp, `s${tmpCount++}.${isModule ? "mjs" : "cjs"}`);
  // 前面補空行，讓錯誤的行號對得上原本的檔案
  writeFileSync(p, "\n".repeat(padLines) + code);
  try { execFileSync(process.execPath, ["--check", p], { encoding: "utf8", stdio: "pipe" }); return null; }
  catch (e) {
    const err = String(e.stderr || e.message);
    const m = err.match(/:(\d+)\r?\n/);
    const msg = (err.split("\n").find((s) => /Error/.test(s)) || "語法錯誤").trim();
    return { line: m ? Number(m[1]) : 0, msg };
  }
}

const looksModule = (code) => /^\s*(import\s[^(]|import\{|export\s)/m.test(code);

function checkPages() {
  const targets = [...new Set([...ALWAYS_CHECK, ...changedFiles()])]
    .filter((f) => /\.(html|js|mjs)$/i.test(f) && existsSync(f));
  const problems = [];
  for (const f of targets) {
    const text = readFileSync(f, "utf8");
    if (/\.m?js$/i.test(f)) {
      const r = nodeCheck(text, f.endsWith(".mjs") || looksModule(text), 0);
      if (r) problems.push([f, r.line, `程式寫壞了：${r.msg}`]);
      continue;
    }
    // HTML：檢查每一段 <script> 程式
    const re = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi;
    let m;
    while ((m = re.exec(text))) {
      const attrs = m[1], code = m[2];
      if (/\bsrc\s*=/i.test(attrs) || !code.trim()) continue;
      const type = (attrs.match(/\btype\s*=\s*["']?([^"'\s>]+)/i) || [])[1] || "";
      if (type && NON_JS_TYPES.test(type) && !/module/i.test(type)) continue;
      const start = m.index + m[0].indexOf(">") + 1;
      const pad = text.slice(0, start).split("\n").length - 1;
      const r = nodeCheck(code, /module/i.test(type) || looksModule(code), pad);
      if (r) problems.push([f, r.line, `頁面裡的程式寫壞了：${r.msg}`]);
    }
    // HTML：引用的本地 .js / .css 檔要存在
    const ref = /\b(?:src|href)\s*=\s*["']([^"'#?]+\.(?:js|mjs|css))(?:\?[^"']*)?["']/gi;
    while ((m = ref.exec(text))) {
      const p = m[1];
      if (/^(https?:)?\/\//i.test(p) || /^(data|blob):/i.test(p)) continue;
      const local = p.replace(/^\.?\//, "");
      if (!existsSync(local)) {
        const l = text.slice(0, m.index).split("\n").length;
        problems.push([f, l, `引用的檔案不存在：${p}`]);
      }
    }
  }
  if (!problems.length) {
    summary(`### ✅ 3 測試頁能打開：檢查了 ${targets.length} 個檔案，程式都沒有寫壞`);
    return 0;
  }
  summary("### 🔴 3 測試頁能打開：有頁面可能打不開\n");
  for (const [f, l, msg] of problems) { summary(`- \`${f}\`${l ? ` 第 ${l} 行` : ""}：${msg}`); annotate(f, l, msg); }
  return 1;
}

const run = { prod: checkProd, secrets: checkSecrets, pages: checkPages }[mode];
if (!run) { console.error("用法：node .github/scripts/pr-check.mjs <prod|secrets|pages> <base>"); process.exit(2); }
process.exit(run());
