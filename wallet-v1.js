(function () {
  'use strict';
  var API = window.WALLET_API || 'https://the-sky-ost-api.anthonywen0693.workers.dev';
  var STORAGE = 'open-wallet-v1:device', latest = null, busy = false, refreshTimer, expiryTimer, refreshing = false, keyPair, panel;
  var q = new URLSearchParams(location.search), launch = q.get('m'), invite = q.get('wallet_transfer');
  var transferred = q.get('wallet_status') === 'transferred';
  var enc = new TextEncoder();
  var labels = { ownership_revoked: '這張專輯已轉出，舊權限已失效。', pass_transferred: '這張錢包卡已轉出。請使用新持有人的卡片。', code_already_claimed: '這組碼已完成首次領取。換手機請使用恢復碼。', invalid_claim: 'Email 或兌換碼不正確。', invalid_recipient: '收件信箱或一次性領取碼不正確。', transfer_expired: '邀請已過期或已接受。', expired_token: '登入已到期，請重新開啟。', invalid_recovery: 'Email 或恢復碼不正確。', email_delivery_failed: '轉讓邀請寄送失敗，請稍後重試。', rate_limited: '操作太頻繁，請一分鐘後再試。', device_revoked: '此裝置已失效，請使用恢復碼。', invalid_proof: '此瀏覽器的裝置資料已變更，請使用恢復碼。', pass_owner_mismatch: '這張卡與購買信箱尚未對應，請聯絡客服。' };
  function esc(s) { return String(s || '').replace(/[&<>"']/g, function (x) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[x]; }); }
  function hex(b) { return Array.from(new Uint8Array(b)).map(function (x) { return x.toString(16).padStart(2, '0'); }).join('').toUpperCase(); }
  function saved() { try { return JSON.parse(localStorage.getItem(STORAGE) || 'null'); } catch (_) { return null; } }
  function note(s, error) { var n = document.getElementById('wv-note'); if (n) { n.textContent = s; n.setAttribute('role', error ? 'alert' : 'status'); } }
  async function post(path, data) {
    var r = await fetch(API + '/wallet/' + path, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=UTF-8' }, body: JSON.stringify(data), cache: 'no-store' });
    var d = await r.json(); if (!r.ok || !d.ok) { var e = new Error(labels[d.error] || d.error || '連線失敗'); e.code = d.error; throw e; } return d;
  }
  async function device() {
    if (keyPair) return keyPair;
    if (!(window.crypto && crypto.subtle && window.indexedDB)) throw new Error('此瀏覽器不支援安全裝置登入，請使用最新版 Safari。');
    var db = await new Promise(function (resolve, reject) { var req = indexedDB.open('open-wallet-v1', 1); req.onupgradeneeded = function () { req.result.createObjectStore('keys'); }; req.onsuccess = function () { resolve(req.result); }; req.onerror = function () { reject(req.error); }; });
    var existing = await new Promise(function (resolve, reject) { var tx = db.transaction('keys'), req = tx.objectStore('keys').get('device'); req.onsuccess = function () { resolve(req.result); }; req.onerror = function () { reject(req.error); }; });
    if (existing) { keyPair = existing; db.close(); return keyPair; }
    var pair = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign', 'verify']);
    await new Promise(function (resolve, reject) { var tx = db.transaction('keys', 'readwrite'); tx.objectStore('keys').put(pair, 'device'); tx.oncomplete = resolve; tx.onerror = function () { reject(tx.error); }; });
    db.close(); keyPair = pair; return pair;
  }
  async function signed(path, payload) {
    var pair = await device(), c = await post('challenge', { purpose: path });
    var proof = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, pair.privateKey, enc.encode(c.challenge + '\n' + JSON.stringify(payload)));
    return post(path, { challenge: c.challenge, proof: hex(proof), payload: payload });
  }
  function strip() { var u = new URL(location.href); ['m', 'wallet_transfer', 'wallet_status'].forEach(function (k) { u.searchParams.delete(k); }); history.replaceState(null, '', u.href); }
  function lock(message) {
    clearTimeout(refreshTimer); clearTimeout(expiryTimer); latest = null; localStorage.removeItem(STORAGE);
    if (window.__walletBridge) window.__walletBridge.clear();
    render(); note(message || '專輯已鎖定。', true);
  }
  function apply(d, navigate) {
    latest = d; localStorage.setItem(STORAGE, JSON.stringify({ credential: d.credential, ownership_id: d.ownership.ownership_id, email: d.email, wallet_url: d.wallet_url }));
    if (window.__walletBridge) window.__walletBridge.apply(d, navigate);
    clearTimeout(refreshTimer); refreshTimer = setTimeout(function () { refresh(false); }, Math.max(1000, d.expires_at - Date.now() - 60000));
    clearTimeout(expiryTimer); expiryTimer = setTimeout(function () { if (latest && latest.expires_at <= Date.now()) { if (window.__walletBridge) window.__walletBridge.clear(); latest = null; render(); note('請連線後重新確認所有權。', true); } }, Math.max(1000, d.expires_at - Date.now()));
    render(); if (d.recovery_code) showRecovery(d.recovery_code);
  }
  async function refresh(navigate) {
    var s = saved(); if (!s || busy || refreshing) return; refreshing = true;
    try { var d = await signed('open', { credential: s.credential, m: launch || undefined }); apply(d, navigate); launch = null; strip(); }
    catch (e) {
      if (e.code === 'pass_transferred') { launch = null; strip(); note(e.message, true); }
      else if (['ownership_revoked', 'device_revoked', 'invalid_proof', 'expired_token'].includes(e.code)) lock(e.message);
      else note('暫時無法確認權限，請連線後重試。', true);
    } finally { refreshing = false; }
  }
  function showRecovery(code) {
    modal('保存你的恢復碼', '<p>首次領取／換手機時使用。每次恢復或轉讓後會更新，請保存最新一組。</p><textarea id="wv-recovery-save" readonly aria-label="恢復碼">' + esc(code) + '</textarea><button type="button" data-wv="copy-recovery">複製恢復碼</button><button type="button" data-wv="close">我已保存</button>');
  }
  function modal(title, html) {
    close(); var wrap = document.createElement('div'); wrap.id = 'wv-modal'; wrap.className = 'wv-overlay';
    wrap.innerHTML = '<section class="wv-dialog" role="dialog" aria-modal="true" aria-labelledby="wv-dialog-title"><button type="button" class="wv-close" data-wv="close" aria-label="關閉">×</button><h2 id="wv-dialog-title">' + esc(title) + '</h2>' + html + '<p id="wv-modal-note" role="status"></p></section>';
    wrap.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); if (e.key === 'Tab') { var items = wrap.querySelectorAll('button,input,textarea'); var first = items[0], last = items[items.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } } });
    document.body.appendChild(wrap); var input = wrap.querySelector('input,textarea,button'); if (input) input.focus();
  }
  function close() { var old = document.getElementById('wv-modal'); if (old) old.remove(); }
  function render() {
    if (!panel) return;
    var s = saved(), own = latest && latest.ownership;
    panel.innerHTML = '<div class="wv-kicker">OPEN · DIGITAL OWNERSHIP</div><h2>你的錢包專輯</h2>' +
      (own ? '<div class="wv-status">OWNED · 已解鎖</div><p>' + esc(own.current_owner) + '</p><p class="wv-meta">THE SKY · ' + esc(own.ownership_id.slice(0, 8)) + ' · v' + own.version + '</p><button type="button" data-wv="open">OPEN ALBUM</button><button type="button" data-wv="wallet">' + (latest.pass && latest.pass.status === 'ready_existing' ? '加入現有 Apple Wallet 卡' : '加入／更新 Apple Wallet') + '</button><button type="button" data-wv="transfer">轉讓專輯</button>' + (own.transfer_pending ? '<button type="button" data-wv="cancel">取消待接受轉讓</button>' : '') + '<details><summary>所有權紀錄</summary>' + own.history.map(function (h) { return '<p class="wv-meta">' + esc(new Date(h.at).toLocaleString()) + ' · ' + esc(h.type) + '</p>'; }).join('') + '</details>' : '<div class="wv-status">LOCKED · 尚未連結</div><p>首次領取使用購買信箱與兌換碼。之後從 Wallet 開啟，自動解鎖。</p><button type="button" data-wv="claim">首次領取</button><button type="button" data-wv="recover">換手機／恢復</button>' + (s ? '<button type="button" data-wv="open">重新確認權限</button>' : '')) +
      '<p id="wv-note" role="status"></p><p class="wv-meta">分享卡片不會轉移所有權。轉讓需由收件人接受。</p><button type="button" class="wv-demo-link" data-wv="demo">試跑 A → B 轉讓</button>';
  }
  function claimForm() {
    var legacy = window.__walletBridge && window.__walletBridge.legacy();
    modal('首次領取專輯', '<p>領取後，日常從錢包卡開啟，不必重輸信箱與兌換碼。</p><form id="wv-claim"><label>Email<input type="email" name="email" required autocomplete="email" value="' + esc(legacy && legacy.email) + '"></label><label>購買兌換碼<input name="code" required autocomplete="off" value="' + esc(legacy && !/^W1\./.test(legacy.code || '') ? legacy.code : '') + '"></label><button type="submit">領取並解鎖</button></form>');
  }
  document.addEventListener('click', async function (ev) {
    var b = ev.target.closest('[data-wv]'); if (!b) return; var action = b.getAttribute('data-wv');
    try {
      if (action === 'close') { close(); return; }
      if (action === 'claim') { claimForm(); return; }
      if (action === 'recover') { modal('恢復專輯', '<form id="wv-recover"><label>目前持有人的 Email<input type="email" name="email" required autocomplete="email"></label><label>最新恢復碼<input name="recovery" required autocomplete="off" placeholder="OWR.…"></label><button type="submit">恢復這支裝置</button></form>'); return; }
      if (action === 'transfer') { modal('轉讓你的專輯', '<p>收件人接受後，你的播放權、舊錢包卡與恢復碼會失效。邀請 10 分鐘有效。</p><form id="wv-transfer"><label>收件人 Email<input type="email" name="email" required autocomplete="email"></label><label class="wv-check"><input type="checkbox" required>我確認將專輯轉讓給這個信箱</label><button type="submit">產生轉讓邀請</button></form>'); return; }
      if (action === 'open') { await refresh(true); return; }
      if (action === 'cancel') { var c = await signed('transfer/cancel', { credential: saved().credential }); latest.ownership = c.ownership; render(); note('轉讓已取消。'); return; }
      if (action === 'copy-recovery') { await navigator.clipboard.writeText(document.getElementById('wv-recovery-save').value); document.getElementById('wv-modal-note').textContent = '已複製，請保存在安全的地方。'; return; }
      if (action === 'share') { var url = document.getElementById('wv-invite-url').value; if (navigator.share) await navigator.share({ title: 'THE SKY 專輯轉讓邀請', url: url }); else { await navigator.clipboard.writeText(url); document.getElementById('wv-modal-note').textContent = '邀請連結已複製。'; } return; }
      if (action === 'wallet') {
        var d = await signed('pass/retry', { credential: saved().credential }); apply(d, false);
        if (d.pass && ['ready', 'ready_existing'].includes(d.pass.status) && d.pass.downloadUrl) location.href = d.pass.downloadUrl;
        else note((d.pass && d.pass.message) || '卡片正在準備，請稍後再試。', true);
        return;
      }
      if (action === 'demo') { window.open('https://the-sky-wallet-v1-test.anthonywen0693.workers.dev/demo', '_blank', 'noopener'); return; }
    } catch (e) { note(e.message, true); }
  });
  document.addEventListener('submit', async function (ev) {
    if (!/^wv-/.test(ev.target.id)) return; ev.preventDefault(); if (busy) return; busy = true;
    var f = ev.target, button = f.querySelector('[type=submit]'); if (button) button.disabled = true;
    try {
      var data = new FormData(f), pair = await device(), jwk = await crypto.subtle.exportKey('jwk', pair.publicKey), d;
      if (f.id === 'wv-claim') d = await signed('claim', { email: data.get('email'), code: data.get('code'), publicKey: jwk, m: launch || undefined });
      if (f.id === 'wv-recover') d = await signed('recover', { email: data.get('email'), recovery: data.get('recovery'), publicKey: jwk });
      if (f.id === 'wv-accept') d = await signed('transfer/accept', { email: data.get('email'), claimCode: data.get('claimCode'), invite: invite, publicKey: jwk });
      if (f.id === 'wv-transfer') {
        d = await signed('transfer/start', { credential: saved().credential, toEmail: data.get('email') }); latest.ownership.transfer_pending = true; render();
        modal('轉讓邀請已寄出', '<p>一次性領取碼已寄到收件人信箱。你可以透過 AirDrop／分享送出這個邀請連結。</p><textarea id="wv-invite-url" readonly aria-label="轉讓邀請連結">' + esc(d.url) + '</textarea><button type="button" data-wv="share">分享轉讓邀請</button><p>收件人接受前，你仍是持有人。</p>');
      } else {
        close(); apply(d, true); launch = null; invite = null; strip(); note('已確認所有權，專輯已解鎖。');
      }
    } catch (e) { var n = document.getElementById('wv-modal-note'); if (n) { n.textContent = e.message; n.setAttribute('role', 'alert'); } else note(e.message, true); }
    finally { busy = false; if (button) button.disabled = false; }
  });
  document.addEventListener('visibilitychange', function () { if (!document.hidden && saved()) refresh(false); });
  window.addEventListener('focus', function () { if (saved()) refresh(false); });
  window.addEventListener('storage', function (e) { if (e.key === STORAGE) { if (!e.newValue) lock('此裝置登入已變更。'); else refresh(false); } });
  function mount() {
    var own = document.getElementById('screen-purchase'); if (!own) return;
    panel = document.createElement('section'); panel.id = 'wallet-v1-panel'; panel.className = 'wv-panel'; own.insertBefore(panel, own.firstChild); render();
    if (launch || invite || transferred) { var tab = document.querySelector('#nav-purchase, [data-nav="purchase"]'); if (tab) tab.click(); else if (window.__walletBridge) window.__walletBridge.own(); }
    if (transferred) { lock('這張錢包卡已轉出，無法再開啟專輯。'); strip(); return; }
    if (invite) post('transfer/peek', { invite: invite }).then(function (d) { modal('接受數位專輯', '<p>THE SKY · 邀請給 ' + esc(d.recipient_hint) + '</p><form id="wv-accept"><label>收件 Email<input type="email" name="email" required autocomplete="email"></label><label>信箱收到的一次性領取碼<input name="claimCode" required autocomplete="one-time-code"></label><button type="submit">接受並取得所有權</button></form>'); }).catch(function (e) { note(e.message, true); });
    else if (saved()) refresh(!!launch);
    else if (launch) post('resolve', { m: launch }).then(function (d) { if (d.state === 'transferred') lock('這張錢包卡已轉出。'); else claimForm(); }).catch(function (e) { note(e.message, true); });
  }
  window.WalletV1 = { refresh: refresh, lock: lock, claim: async function (email, code) { var pair = await device(), jwk = await crypto.subtle.exportKey('jwk', pair.publicKey), d = await signed('claim', {email:email,code:code,publicKey:jwk,m:launch || undefined}); apply(d,true); launch = null; strip(); return d; } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
