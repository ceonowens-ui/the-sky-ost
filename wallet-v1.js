(function () {
  'use strict';
  var API = window.WALLET_API || 'https://the-sky-ost-api.anthonywen0693.workers.dev';
  var STORAGE = 'open-wallet-v1:device', latest = null, busy = false, refreshTimer, expiryTimer, refreshing = false, keyPair, panel;
  var q = new URLSearchParams(location.search), launch = q.get('m'), invite = q.get('wallet_transfer');
  var albumPage = document.body.dataset.walletPage === 'album', phase = 'locked', message = '', receipt = readCache(), lastCheck = 0, launchEdition = null;
  var LANDING = window.WALLET_ALBUM_URL || '/album/the-sky.html', APP = window.WALLET_APP_URL || '/test.html?album=the-sky';
  function readCache() { try { return JSON.parse(localStorage.getItem('open-wallet-v1:collection') || 'null'); } catch (_) { return null; } }
  function emit() { window.dispatchEvent(new CustomEvent('wallet:ownership')); }
  function collection() { var valid = latest && latest.expires_at > Date.now(); return { verified: !!valid, ownership: valid ? latest.ownership : receipt && receipt.ownership, status: valid ? 'active' : phase === 'transferred' && receipt && receipt.status === 'transferred' ? 'transferred' : saved() ? 'unverified' : receipt && receipt.status === 'transferred' ? 'transferred' : 'locked' }; }
  function visit(action) { var u = new URL(LANDING, location.origin); if (action) u.searchParams.set('action', action); location.assign(u.href); }
  var enc = new TextEncoder();
  var labels = { ownership_revoked: '此裝置的所有權憑證已失效。若仍為持有人，請使用恢復碼。', pass_transferred: '這張錢包卡已轉出。請使用新持有人的卡片。', code_already_claimed: '這組碼已完成首次領取。換手機請使用恢復碼。', invalid_claim: 'Email 或兌換碼不正確。', invalid_recipient: '收件信箱或一次性領取碼不正確。', transfer_expired: '邀請已過期或已接受。', expired_token: '登入已到期，請重新開啟。', invalid_recovery: 'Email 或恢復碼不正確。', email_delivery_failed: '轉讓邀請寄送失敗，請稍後重試。', rate_limited: '操作太頻繁，請一分鐘後再試。', device_revoked: '此裝置已失效，請使用恢復碼。', invalid_proof: '此瀏覽器的裝置資料已變更，請使用恢復碼。', invalid_wallet_link: '這個錢包連結無效。請從有效卡片重新開啟，或使用購買資料領取。', pass_owner_mismatch: '這張卡與購買信箱尚未對應，請聯絡客服。' };
  function esc(s) { return String(s || '').replace(/[&<>"']/g, function (x) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[x]; }); }
  function hex(b) { return Array.from(new Uint8Array(b)).map(function (x) { return x.toString(16).padStart(2, '0'); }).join('').toUpperCase(); }
  function saved() { try { return JSON.parse(localStorage.getItem(STORAGE) || 'null'); } catch (_) { return null; } }
  function note(s, error) { message = s; var n = document.getElementById('wv-note'); if (n) { n.textContent = s; n.setAttribute('role', error ? 'alert' : 'status'); } }
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
  function invalidate(next, text, remove) {
    clearTimeout(refreshTimer); clearTimeout(expiryTimer); latest = null; phase = next;
    if (remove) localStorage.removeItem(STORAGE);
    if (window.__walletBridge) window.__walletBridge.clear();
    if (receipt && next === 'transferred' && (remove || (launch && receipt.wallet_url && new URL(receipt.wallet_url).searchParams.get('m') === launch))) { receipt.status = 'transferred'; localStorage.setItem('open-wallet-v1:collection', JSON.stringify(receipt)); }
    message = text; render(); emit();
  }
  function lock(text) { invalidate('recover', text || '此裝置需要恢復。', true); }
  function apply(d, navigate) {
    latest = d; phase = 'active'; message = '已確認目前所有權，專輯已解鎖。'; lastCheck = Date.now();
    localStorage.setItem(STORAGE, JSON.stringify({ credential:d.credential, ownership_id:d.ownership.ownership_id, email:d.email, wallet_url:d.wallet_url }));
    receipt = {ownership:d.ownership, status:'active', wallet_url:d.wallet_url};
    localStorage.setItem('open-wallet-v1:collection', JSON.stringify(receipt));
    if (window.__walletBridge) window.__walletBridge.apply(d, navigate && !albumPage);
    clearTimeout(refreshTimer); refreshTimer = setTimeout(function () { refresh(false); }, Math.max(1000, d.expires_at-Date.now()-60000));
    clearTimeout(expiryTimer); expiryTimer = setTimeout(function () { invalidate('offline','登入已到期，請連線後重新確認所有權。',false); }, Math.max(1000,d.expires_at-Date.now()));
    render(); emit(); if (d.recovery_code) showRecovery(d.recovery_code);
  }
  async function refresh(navigate) {
    var s = saved(); if (!s || busy || refreshing) return false; refreshing = true;
    if (!latest) { phase = 'verifying'; message = '正在向伺服器確認目前所有權…'; render(); }
    try {
      var d = await signed('open', {credential:s.credential, m:launch || undefined}); apply(d, navigate); launch = null; strip(); return true;
    } catch (e) {
      if (e.code === 'pass_transferred') { invalidate('transferred',e.message,false); }
      else if (['ownership_revoked','device_revoked','invalid_proof','expired_token'].includes(e.code)) {
        var m = receipt && receipt.wallet_url && new URL(receipt.wallet_url).searchParams.get('m'), transferred = false;
        if (m && e.code === 'ownership_revoked') { try { transferred = (await post('resolve',{m:m})).state === 'transferred'; } catch (_) {} }
        invalidate(transferred ? 'transferred' : 'recover', transferred ? '專輯已轉出。你的旧裝置、卡片與播放權限已失效。' : e.message, true);
      } else if (latest && latest.expires_at > Date.now()) { note('連線暫時中斷；目前登入有效至 ' + new Date(latest.expires_at).toLocaleTimeString() + '。',true); }
      else { invalidate('offline','暫時無法確認權限，請連線後重試。',false); }
      return false;
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
    var c = collection(), own = latest && latest.ownership, meta = own || c.ownership;
    var status = {active:'OWNED · 已解鎖',verifying:'VERIFYING · 確認中',recover:'RECOVER · 裝置需恢復',transferred:'TRANSFERRED · 已轉出',offline:'OFFLINE · 尚未確認',invalid:'INVALID LINK · 無效連結',locked:'CLAIM · 尚未領取'};
    if (!albumPage) { panel.innerHTML = '<a class="wv-entry" href="'+esc(LANDING)+'">THE SKY · 專輯領取與恢復 <span>›</span></a>'; return; }
    panel.innerHTML = '<div class="wv-status" role="status">'+esc(status[phase]||status.locked)+'</div><p class="wv-edition">EDITION '+esc(meta && meta.edition || launchEdition || '—')+'</p>' +
      (own ? '<a class="wv-primary" href="'+esc(APP)+'" data-wv="enter">進入 App · 播放專輯</a><div class="wv-actions"><button type="button" data-wv="wallet">加入 Apple Wallet</button><button type="button" data-wv="transfer">轉讓專輯</button>'+ (own.transfer_pending ? '<button type="button" data-wv="cancel">取消待接受轉讓</button>' : '')+'</div><details><summary>所有權資訊與紀錄</summary><p>'+esc(own.current_owner)+'</p><p class="wv-meta">'+esc(own.ownership_id)+' · v'+own.version+'</p><p class="wv-meta">Wallet serial · '+esc(own.wallet_serial||'卡片待準備')+'</p>'+own.history.map(function(h){return '<p class="wv-meta">'+esc(new Date(h.at).toLocaleString())+' · '+esc({claim:'首次領取',transfer:'數位轉讓',recover:'裝置恢復'}[h.type]||h.type)+'</p>';}).join('')+'</details>' :
      phase === 'invalid' ? '<p>請從有效卡片重新開啟，或返回專輯入口領取／恢復。</p><a class="wv-primary" href="'+esc(LANDING)+'">返回專輯入口</a>' : phase === 'verifying' ? '<div class="wv-loading" aria-label="驗證中"></div>' : phase === 'transferred' ? '<p>這張卡已完成轉讓。新持有人請使用自己的卡片或轉讓邀請。</p><a class="wv-primary" href="'+esc(APP)+'">返回 App</a>' :
      '<p>首次領取使用購買 Email＋兌換碼。日常開啟會驗證此瀏覽器的裝置憑證。</p>'+ (saved() ? '<button type="button" class="wv-primary" data-wv="open">重新確認權限</button>' : '<button type="button" class="wv-primary" data-wv="claim">首次領取專輯</button>')+'<button type="button" data-wv="recover">換手機／恢復權限</button>')+
      '<p id="wv-note" role="'+(phase==='offline'||phase==='invalid'||phase==='recover'?'alert':'status')+'">'+esc(message)+'</p><p class="wv-meta">Safari 與主畫面 App 可能使用不同裝置資料；需要時使用最新恢復碼。分享卡片不會移轉所有權。</p>';
  }
  function claimForm() {
    var legacy = window.__walletBridge && window.__walletBridge.legacy();
    try { var pending = JSON.parse(sessionStorage.getItem('open-wallet-v1:pending') || 'null'); sessionStorage.removeItem('open-wallet-v1:pending'); if (pending && Date.now()-pending.at < 120000) legacy = pending; } catch (_) {}
    modal('首次領取專輯', '<p>領取後，日常從錢包卡開啟，不必重輸信箱與兌換碼。</p><form id="wv-claim"><label>Email<input type="email" name="email" required autocomplete="email" value="' + esc(legacy && legacy.email) + '"></label><label>購買兌換碼<input name="code" required autocomplete="off" value="' + esc(legacy && !/^W1\./.test(legacy.code || '') ? legacy.code : '') + '"></label><button type="submit">領取並解鎖</button></form>');
  }
  document.addEventListener('click', async function (ev) {
    var b = ev.target.closest('[data-wv]'); if (!b) return; var action = b.getAttribute('data-wv');
    try {
      if (action === 'close') { close(); return; }
      if (action === 'claim') { claimForm(); return; }
      if (action === 'recover') { modal('恢復專輯', '<form id="wv-recover"><label>目前持有人的 Email<input type="email" name="email" required autocomplete="email"></label><label>最新恢復碼<input name="recovery" required autocomplete="off" placeholder="OWR.…"></label><button type="submit">恢復這支裝置</button></form>'); return; }
      if (action === 'transfer') { modal('轉讓你的專輯', '<p>收件人接受後，你的播放權、舊錢包卡與恢復碼會失效。邀請 10 分鐘有效。</p><form id="wv-transfer"><label>收件人 Email<input type="email" name="email" required autocomplete="email"></label><label class="wv-check"><input type="checkbox" required>我確認將專輯轉讓給這個信箱</label><button type="submit">產生轉讓邀請</button></form>'); return; }
      if (action === 'enter') { ev.preventDefault(); if (await refresh(false)) location.assign(APP); return; }
      if (action === 'open') { await refresh(false); return; }
      if (action === 'cancel') { var c = await signed('transfer/cancel', { credential: saved().credential }); latest.ownership = c.ownership; receipt.ownership=c.ownership; render(); emit(); note('轉讓已取消。'); return; }
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
        d = await signed('transfer/start', { credential: saved().credential, toEmail: data.get('email') }); latest.ownership.transfer_pending = true; render(); emit();
        modal('轉讓邀請已寄出', '<p>一次性領取碼已寄到收件人信箱。你可以透過 AirDrop／分享送出這個邀請連結。</p><textarea id="wv-invite-url" readonly aria-label="轉讓邀請連結">' + esc(d.url) + '</textarea><button type="button" data-wv="share">分享轉讓邀請</button><p>收件人接受前，你仍是持有人。</p>');
      } else {
        close(); apply(d, false); launch = null; invite = null; strip(); note('已確認所有權，專輯已解鎖。');
      }
    } catch (e) { var n = document.getElementById('wv-modal-note'); if (n) { n.textContent = e.message; n.setAttribute('role', 'alert'); } else note(e.message, true); }
    finally { busy = false; if (button) button.disabled = false; }
  });
  function resume() { if (saved() && Date.now()-lastCheck > 30000) refresh(false); }
  document.addEventListener('visibilitychange', function () { if (!document.hidden) resume(); });
  window.addEventListener('focus', resume);
  window.addEventListener('storage', function (e) { if (e.key === STORAGE) { if (!e.newValue) invalidate('recover','此裝置登入已變更，請重新確認。',false); else refresh(false); } });
  async function mount() {
    if (albumPage) panel = document.getElementById('album-access');
    else { var own=document.getElementById('screen-purchase'); if (!own) return; panel=document.createElement('section'); panel.className='wv-panel wv-app-entry'; own.insertBefore(panel,own.firstChild); if (window.__walletBridge) window.__walletBridge.clear(); }
    render(); emit();
    if (invite) { try { var d=await post('transfer/peek',{invite:invite}); modal('接受 THE SKY 數位專輯','<p>邀請給 '+esc(d.recipient_hint)+'</p><form id="wv-accept"><label>收件 Email<input type="email" name="email" required autocomplete="email"></label><label>信箱收到的一次性領取碼<input name="claimCode" required autocomplete="one-time-code"></label><button type="submit">接受並取得所有權</button></form>'); } catch(e) { invalidate('invalid',e.message,false); } return; }
    if (launch) {
      phase='verifying';render();
      try { var r=await post('resolve',{m:launch}); launchEdition=r.edition; if(r.state==='transferred') { invalidate('transferred','這張錢包卡已轉出，無法解鎖專輯。',false); return; } }
      catch(e) { invalidate(e.code==='invalid_wallet_link'?'invalid':'offline',e.code ? e.message : '網路連線失敗，請重新整理後再試。',false); return; }
    }
    if (saved()) await refresh(!albumPage && q.get('album')==='the-sky');
    else { phase=receipt && receipt.status==='transferred'?'transferred':'locked'; render(); emit(); }
    if (albumPage && phase!=='active' && (q.get('action')==='claim' || sessionStorage.getItem('open-wallet-v1:pending'))) claimForm();
    else if (albumPage && phase!=='active' && q.get('action')==='recover') document.querySelector('[data-wv="recover"]').click();
  }
  window.WalletV1 = { refresh:refresh, lock:lock, collection:collection, visit:visit, claim:async function(email,code) { sessionStorage.setItem('open-wallet-v1:pending',JSON.stringify({email:email,code:code,at:Date.now()})); visit('claim'); } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
