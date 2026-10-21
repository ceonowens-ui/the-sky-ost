/* B283T: automatic shopping language. Display only; never translate input values or request payloads. */
(function(){
 'use strict';
 const forced=(function(){try{return (new URLSearchParams(location.search).get('lang')||'').toLowerCase();}catch(e){return '';}})();   /* B293T：測試用 ?lang=en／?lang=zh 可強制語言（正式判斷仍是瀏覽器語言） */
 const preferred=forced||(navigator.languages&&navigator.languages[0])||navigator.language||'zh-TW';
 const en=!/^zh(?:-|$)/i.test(preferred);
 const D={
 '你的收藏':'Your collection','票券與周邊，各自收好。':'Tickets and merch, all in one place.',
 '收藏不只是擁有，而是與你的時間並肩。':'More than ownership. A moment shared with you.',
 '購買周邊':'Shop merch','立即購買':'Shop now','立即購票':'Get tickets','查看我的票':'My tickets','我的票':'My tickets','周邊':'Shop','返回':'Back','帳號':'Account',
 'CHANCE 生日會':'CHANCE Birthday Party','微風影城 A 廳':'Breeze Cinemas · Hall A, Taipei','台北':'Taipei','台北時間':'Taipei time',
 '入場票':'Admission ticket','生日會入場券':'Birthday party ticket','入場券':'Admission ticket','尚未開賣':'Not on sale yet','即將開賣':'Coming soon','敬請期待':'Coming soon','已售完':'Sold out',
 '尚未開賣 · 提前排隊':'Not on sale · Join the waitlist','即將開賣 · 提前排隊':'Coming soon · Join the waitlist','提前排隊':'Join the waitlist','已排隊':'On the waitlist','查看票券詳情':'Ticket details',
 '示意票券・不可入場':'Sample ticket · Not valid for entry','示意 QR 圖，不是有效票券':'Sample QR, not a valid ticket','購買後，出示票券入場':'Show your ticket at the entrance','由工作人員掃碼':'Staff will scan your QR code',
 '購買後，出示 QR Code 入場':'After purchase, show your QR code for entry','票券示意・不能用於入場':'Sample only · Not valid for entry',
 '載入中…':'Loading…','尚未公布活動':'Event details coming soon','時間待公布':'Time to be announced','地點待公布':'Venue to be announced',
 '商品詳情':'Product details','商品內容與規格':'Details & specifications','配送與領取':'Delivery & pickup','購買須知':'Purchase terms','完整《購買須知》':'Full purchase terms','《隱私權政策》':'Privacy policy','隱私權政策':'Privacy policy',
 'CHANCE 官方卡包 Vol.1':'CHANCE Official Card Pack Vol.1','CHANCE 官方卡包 Vol.1 無限可能 C.X.':'CHANCE Official Card Pack Vol.1 — Infinite Possibilities C.X.','無限可能 C.X.':'Infinite Possibilities C.X.',
 '台灣免運':'Free shipping in Taiwan','台灣':'Taiwan','海外':'International','生日會現場領取':'Birthday party pickup','現場領取':'Event pickup','12/27 CHANCE 生日會現場領取':'Dec 27 · CHANCE Birthday Party pickup','12/27 生日會・免運':'Dec 27 event · No shipping fee',
 '選擇數量與取貨':'Choose quantity & delivery','確認訂單':'Review order','數量':'Quantity','取貨方式':'Delivery method','寄送':'Shipping','寄送資料':'Shipping details','領取人資料':'Pickup details',
 '寄送地區':'Destination','姓名':'Name','收件人姓名':'Recipient name','手機':'Phone number','郵遞區號':'Postal code','地址':'Address','選填':'Optional','必填':'Required',
 '請輸入收件人姓名':'Enter recipient name','請輸入手機號碼':'Enter phone number','請輸入詳細地址':'Enter full address','現場核對用':'For verification at pickup','訂單確認信會寄到這裡':'Your order confirmation will be sent here',
 '商品小計':'Subtotal','小計':'Subtotal','運費':'Shipping','合計':'Total','免運':'Free','處理中…':'Processing…','前往付款':'Continue to payment','重新開啟付款頁':'Try opening payment again',
 '減少一包':'Remove one pack','增加一包':'Add one pack','減少':'Decrease','增加':'Increase','關閉':'Close','取消':'Cancel','完成':'Done','重新整理':'Refresh',
 '請填姓名（現場核對用）':'Enter your name for event pickup.','請填收件人姓名':'Enter the recipient name.','請填手機':'Enter a phone number.','手機號碼看起來不完整':'Please check your phone number.','請填地址':'Enter the shipping address.',
 '海外寄送請填郵遞區號':'Enter a postal code for international delivery.','請輸入正確的 Email':'Enter a valid email address.','請選擇寄送地區':'Choose a delivery destination.',
 '暫時無法前往付款':'Unable to open payment','請稍後再試。':'Please try again later.','即將開賣，敬請期待':'Coming soon. Please check back.',
 '商品圖為示意圖，實際商品以實物為準。':'Images are illustrative. The actual product may vary.',
 '收件資料要修改或退換貨，請來信 heartbeats0693@gmail.com。':'For delivery changes, returns or exchanges, email heartbeats0693@gmail.com.',
 '台灣：付款後 7 個工作天內寄出，寄出會再寄信給你追蹤號碼。':'Taiwan: dispatched within 7 business days after payment. Tracking details will be emailed after dispatch.',
 '海外：以中華郵政國際 e 小包寄出，寄出會再寄信給你追蹤號碼。':'International orders ship via Chunghwa Post international ePacket. Tracking details will be emailed after dispatch.',
 '：免運。付款後 7 個工作天內寄出，寄出會再寄信給你追蹤號碼。':': Free shipping. Dispatched within 7 business days after payment. Tracking details will be emailed after dispatch.',
 '12/27 CHANCE 生日會當天，到周邊服務台報上訂單編號與姓名領取（需本人到場）。':'Collect in person at the merch desk during the CHANCE Birthday Party on Dec 27. Provide your order number and name.',
 '本機預覽不會建立訂單或付款':'Local preview: no orders or payments are created.',
 '日本':'Japan','韓國':'South Korea','香港':'Hong Kong','澳門':'Macao','中國大陸':'Mainland China','新加坡':'Singapore','馬來西亞':'Malaysia','美國':'United States','加拿大':'Canada','英國':'United Kingdom','法國':'France','澳洲':'Australia',
 '我的票券':'My tickets','票夾':'Ticket wallet','尚無票券':'No tickets yet','還沒有票':'No tickets yet','入場須知':'Entry information','購票須知':'Ticket purchase terms','繼續':'Continue','送出':'Submit',
 '取得驗證碼':'Get verification code','發送驗證碼':'Send code','寄送驗證碼':'Send code','輸入驗證碼':'Enter verification code','驗證碼':'Verification code','驗證':'Verify','驗證中…':'Verifying…','登入':'Sign in','登出':'Sign out',
 'Email 驗證':'Verify email','輸入 Email':'Enter email','你的 Email':'Your email','驗證 Email':'Verify email','輸入你的 Email':'Enter your email','請輸入 Email':'Enter your email',
 '查詢我的票':'Find my tickets','重新寄送':'Resend','重新寄送驗證碼':'Resend code','沒有收到？':'Didn’t receive it?','購買紀錄':'Purchase history','我的訂單':'My orders','入場':'Entry','限量':'Limited',
 '台灣免運・海外':'Free Taiwan shipping · International','／包':'/ pack','/ 包':'/ pack','品名：':'Product:','售價：':'Price:'
 };
 Object.assign(D,{
 '微風影城 A 廳':'Breeze Cinemas · Hall A','微風影城 A 廳 · 台北':'Breeze Cinemas · Hall A, Taipei',
 '加入排隊':'Join the waitlist','排隊中…':'Joining…','好':'OK',
 '排隊，提早 24 小時買票':'Get access 24 hours early',
 '公開開賣前 24 小時，排隊的人會先收到購買通知，可以先買。':'Join the waitlist to receive a purchase invitation 24 hours before public sales.',
 'Email（開賣通知寄到這裡）':'Email for your invitation',
 '排隊暫時無法使用，請稍後再試':'The waitlist is unavailable. Please try again later.',
 '完整《購買須知》':'Full purchase terms (Chinese)','《隱私權政策》':'Privacy policy (Chinese)',
 '購買須知':'Purchase terms (Chinese)','隱私權政策':'Privacy policy (Chinese)',
 '票券':'Ticket','· 台灣免運':'· Free shipping in Taiwan','客服信箱 heartbeats0693@gmail.com':'Support: heartbeats0693@gmail.com',
 '夏米爾企業社　統一編號 38472654':'夏米爾企業社 · Business ID 38472654',
 '請輸入正確的 email':'Enter a valid email address.','姓名（現場核對）':'Name for event pickup',
 '請填寫你的稱呼':'Enter your name.','請填寫收票 email':'Enter the email for your tickets.',
 '連不上伺服器，請稍後再試':'Unable to connect. Please try again later.',
 '連線較慢，請稍後再試':'The connection is slow. Please try again.',
 '購買須知（中文）':'Purchase terms (Chinese)','隱私權政策（中文）':'Privacy policy (Chinese)'
 });
 const rules=[
 [/^(.+) 還沒開賣。留下 email 拿到排隊號碼，$/,(_,n)=>(D[n]||n)+' is not on sale yet. Leave your email to receive a waitlist number. '],
 [/^同一個 email 只會有一個號碼；(\d+) 席數量有限，收到通知請盡快購買。$/,(_,n)=>'One waitlist number per email. '+n+' seats are available; purchase promptly after receiving your invitation.'],
 [/^你是第 (\d+) 位$/,(_,n)=>'Your waitlist number: '+n],
 [/^NT\$(.+) \/ 包$/,(_,n)=>'NT$'+n+' / pack'],
 [/^台灣免運・海外 (.+)$/,(_,n)=>'Free in Taiwan · International '+n],
 [/^：海外運費 (NT\$[\d,–]+)（(\d+) 個國家／地區）。以中華郵政國際 e 小包寄出，寄出會再寄信給你追蹤號碼。$/,(_,fee,n)=>': '+fee+' shipping to '+n+' destinations via Chunghwa Post international ePacket. Tracking details will be emailed after dispatch.'],
 [/^：(.+)・免運。12\/27 CHANCE 生日會當天，到周邊服務台報上訂單編號與姓名領取（需本人到場）。$/,(_,label)=>': '+(D[label]||label)+'. Free pickup in person at the merch desk on Dec 27. Provide your order number and name.'],
 [/^活動名額 (\d+) 席$/,(_,n)=>'Capacity: '+n+' seats'],
 [/^(\d+) 席$/,(_,n)=>n+' seats'],
 [/^一次最多 (\d+) 包$/,(_,n)=>'Up to '+n+' packs per order'],
 [/^每筆訂單最多 (\d+) 包。$/,(_,n)=>'Maximum '+n+' packs per order.'],
 [/^海外運費 (.+)$/,(_,n)=>'International shipping '+n],
 [/^海外 (NT\$.+)$/,(_,n)=>'International '+n],
 [/^運費 (NT\$.+)$/,(_,n)=>'Shipping '+n],
 [/^前往付款 · (.+)$/,(_,n)=>'Pay · '+n],
 [/^品名：(.+)$/,(_,n)=>'Product: '+(D[n]||n)],
 [/^售價：(.+)／包$/,(_,n)=>'Price: '+n+' / pack'],
 [/^(.+)・免運$/,(_,n)=>(D[n]||n)+' · Free'],
 [/^已排隊 · 第 (\d+) 位$/,(_,n)=>'Waitlist · No. '+n],
 [/^（(\d+) 個國家／地區）。以中華郵政國際 e 小包寄出，寄出會再寄信給你追蹤號碼。$/,(_,n)=>' ('+n+' destinations). Ships via Chunghwa Post international ePacket. Tracking details will be emailed after dispatch.']
 ];
 const countries=typeof Intl.DisplayNames==='function'?new Intl.DisplayNames(['en'],{type:'region'}):null;
 function translate(text){
  const t=text.trim();if(!t)return text;
  let out=D[t];
  if(!out)for(const [re,fn]of rules)if(re.test(t)){out=t.replace(re,fn);break;}
  if(!out&&/星期[日一二三四五六]/.test(t))out=t.replace(/星期([日一二三四五六])/g,(_,d)=>['Sun','Mon','Tue','Wed','Thu','Fri','Sat']['日一二三四五六'.indexOf(d)]).replace('台北時間','Taipei time');
  if(!out)return text;
  return text.replace(t,out);
 }
 const ROOTS='#screen-merch,.tk-layer,.tk-sheet,#cx-shop';
 function userText(t){return Array.from(document.querySelectorAll('[data-cf],.tk-layer input,.tk-layer textarea')).some(e=>e.value&&e.value.trim()===t.trim());}
 function walk(node){
  if(node.nodeType===3){if(userText(node.nodeValue))return;const s=translate(node.nodeValue);if(s!==node.nodeValue)node.nodeValue=s;return;}
  if(node.nodeType!==1||node.matches('script,style,input[type=hidden],[data-no-translate]'))return;
  for(const a of ['placeholder','title','aria-label','alt'])if(node.hasAttribute(a)){const old=node.getAttribute(a),s=translate(old);if(s!==old)node.setAttribute(a,s);}
  if(node.matches('textarea,svg'))return;
  if(node.matches('select[data-cf=country]')&&countries){for(const o of node.options){const fee=o.textContent.split(/・| · /)[1]||'';o.textContent=countries.of(o.value)+(fee?' · '+translate(fee):'');}return;}
  for(const child of Array.from(node.childNodes))walk(child);
 }
 let queued=false;
 function apply(){
  queued=false;
  if(!en)return;
  observer.disconnect();
  for(const root of document.querySelectorAll(ROOTS)){
   root.lang='en';walk(root);
   // Currency disclosure is visual only; no conversion and no payment changes.
   if(root.querySelector('.cx9-price,.cx9-total')&&!root.querySelector('.sky-currency')){
    const hint=document.createElement('p');hint.className='sky-currency';hint.style.cssText='font:14px/1.5 system-ui;color:#cfc5b5;margin:8px 20px';hint.textContent='All prices in New Taiwan dollars (TWD).';
    const anchor=root.querySelector('.cx9-price,.cx9-total');anchor.insertAdjacentElement('afterend',hint);
   }
  }
  observer.observe(document.body,{childList:true,subtree:true,characterData:true});
 }
 const observer=new MutationObserver(function(ms){if(queued)return; if(ms.some(m=>(m.target.nodeType===1?m.target:m.target.parentElement)?.closest?.(ROOTS)||Array.from(m.addedNodes).some(n=>n.nodeType===1&&(n.matches(ROOTS)||n.querySelector(ROOTS))))){queued=true;queueMicrotask(apply);}});
 window.SkyShopLanguage={en,translate,apply};
 document.addEventListener('DOMContentLoaded',apply);
})();
