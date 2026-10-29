/* B283T: automatic shopping language. Display only; never translate input values or request payloads. */
(function(){
 'use strict';
 const forced=(function(){try{return (new URLSearchParams(location.search).get('lang')||'').toLowerCase();}catch(e){return '';}})();   /* B293T：測試用 ?lang=en／?lang=zh 可強制語言（正式判斷仍是瀏覽器語言） */
 const preferred=forced||(navigator.languages&&navigator.languages[0])||navigator.language||'zh-TW';
 const en=window.SKY_LANG?window.SKY_LANG==='en':!/^zh(?:-|$)/i.test(preferred);   /* B294T：跟全 App 同一個判斷 */
 const D={
 /* B335T：票夾（我的票）、票券登入、票種、轉讓、合照——英文介面原本整頁中文（UI/UX 審查 P1-4） */
 '我的票夾':'My tickets','收藏':'Collection','更多':'More','去購票':'Get tickets','即將到來':'Upcoming','過往':'Past','還沒有過往的票。':'No past tickets yet.',
 '買票後，票會自動放進這裡。':'Tickets you buy will appear here.','入場過的票會變成票根留在這裡。':'Used tickets stay here as stubs.','沒有即將到來的票。':'No upcoming tickets.',
 '已買過票？':'Already have a ticket?','用 email 找回你的票':'Find it with your email','登入':'Sign in','你的 email':'Your email','寄驗證碼給我':'Email me a code','位數驗證碼':'-digit code',
 '買過專輯會自動登入；沒有的話輸入 email，我們寄一組驗證碼給你（收朋友轉讓的票也用這個）。':"If you've bought the album you're already signed in. Otherwise enter your email and we'll send you a code (also used to receive a ticket from a friend).",
 '已入場':'Admitted','已退票':'Refunded','已作廢':'Void','已結束':'Ended','轉讓中':'Transferring','轉讓給朋友':'Transfer to a friend','取消轉讓':'Cancel transfer','看轉讓 QR':'Show transfer QR',
 '這張票正在轉讓中（10 分鐘內有效）':'This ticket is being transferred (valid for 10 minutes)','找不到這張票，可能已轉讓給朋友。':"This ticket wasn't found. It may have been transferred.",
 '更新票券':'Refresh tickets','出示入場 QR':'Show entry QR','入場 QR 還沒出現':'Entry QR not available yet','為了防止截圖轉賣，開場前':'To prevent screenshot resale, the QR appears','小時出現 QR':'hours before doors',
 '會自動出現在這裡':'will appear here automatically','開場前':'Before doors','小時':'hours','小時，入場 QR 會出現在票上。':'hours before doors, the entry QR will appear on your ticket.',
 '票種':'Ticket type','選擇票種':'Choose a ticket type','你的票種享有':'Your ticket includes','自由入座':'General admission','席':'seats','張':'','張票':'tickets','剩':'left','你有':'You have','起':'from','購買':'Buy',
 '全場售完':'Sold out','再買一張給朋友':'Buy one for a friend','加到行事曆':'Add to calendar','導航到':'Directions to','會場':'Venue','分享':'Share','終身編號 No.':'Member No.','已排隊 No.':'On the waitlist · No.',
 '商品圖片為示意圖，實際商品以實物為準。':'Product images are illustrations; the actual items may differ.','透過綠界 ECPay 安全付款':'Secure payment through ECPay',
 '生日牆合照':'Birthday wall photo','加購':'Add-on','已加購':'Added','票券已含':'Included','在生日牆與 CHANCE 合照一次，成片全數下載':'One photo with CHANCE at the birthday wall; download all shots',
 '你的照片':'Your photos','拍照用 QR':'Photo QR','拍照用 QR（給攝影師拍）':'Photo QR (show the photographer)','拍照用 QR（測試）':'Photo QR (test)',
 '活動後你的合照成片、全場大合照與精選活動照會出現在這裡，免費下載。':'After the event, your photo, the group photo and selected event photos will appear here for free download.',
 '活動後全場大合照與精選活動照會出現在這裡，免費下載。':'After the event, the group photo and selected event photos will appear here for free download.',
 '周邊收藏':'Merch collection','收藏進度':'Collection progress',
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
 '台灣免運・海外':'Free Taiwan shipping · International','／包':'/ pack','/ 包':'/ pack','品名：':'Product:','售價：':'Price:',
 /* B337T：生日會資訊（CÉON 10/29 13:21 原文 → 英文逐行對照；中文原文一字不改） */
 '生日會資訊':'Birthday Party Info',
 '地點：微風影城8樓A廳':'Venue: Breeze Cinemas, Hall A, 8F',
 '票價：1,880元(含離場HI FIVE、6號小卡、隨機A3海報一張)':'Ticket: NT$1,880 (includes a HI FIVE on the way out, a No. 6 photo card, and one random A3 poster)',
 '座位名額：120名':'Seats: 120',
 '時間：14:00開始入場、14:30活動開始、16:00活動結束':'Time: Doors open 14:00, event starts 14:30, event ends 16:00',
 '11/1開始預購 (商品請於當日提前13:20至現場領取)':'Pre-orders open 11/1 (please come early at 13:20 on the day to collect your items on site)',
 '會依購買姓名+電話方式核對劃消':'We will verify and check you off by the buyer’s name + phone number',
 '另販售周邊海報A3一組4張 520元 限量50組*':'Also on sale: A3 poster set (4 posters per set), NT$520, limited to 50 sets*',
 '及開放海外無法到場粉絲購買A3海報組及6號小卡組合 980元 限量30組':'Overseas fans who can’t attend can buy the A3 poster set + No. 6 photo card bundle, NT$980, limited to 30 sets',
 '亞洲寄送+250':'Shipping within Asia +NT$250',
 '其他地區+500':'Other regions +NT$500',
 '亦可以備註留下全名跟電話在12/27現場領取時請人代領':'You can also leave your full name and phone number in the order note and have someone pick up for you on site on 12/27',
 '*當日可送禮物給成晞請避免贈送過於昂貴之商品,不接受現場簽名':'*Gifts for Chance are welcome on the day, but please avoid overly expensive items. No on-site autographs.',
 '最後會拍大合照/現場會有有獎問答及抽人形看板(當日入場會提供抽獎號碼/照購買票數提供同等抽獎獎號)':'We’ll take a group photo at the end / there will be a prize quiz and a draw for a life-size standee (raffle numbers are handed out at entry on the day / you get the same number of raffle numbers as tickets you bought)',
 /* B342T：買票＋生日周邊加購（A3 海報組／A3 海報組＋6號小卡）、單買周邊・海外寄送 */
 '加購生日限定周邊':'Birthday merch add-ons','生日限定周邊':'Birthday merch','生日限定周邊（預購）':'Birthday merch (pre-order)','選填・活動當天現場領取':'Optional · pick up at the event','活動當天現場領取':'Pick up at the event','預購中':'Pre-order open','預購已截止':'Pre-orders closed',
 'A3 海報組（一組 4 張）':'A3 poster set (4 posters)','A3 海報組':'A3 poster set','A3 海報組＋6號小卡組合':'A3 poster set + No. 6 photo card bundle','A3 海報組＋6號小卡':'A3 poster set + No. 6 photo card','A3 海報組＋A3 海報組＋6號小卡':'A3 poster set + A3 poster set & No. 6 photo card',
 '海外無法到場也可寄送':'Can be shipped if you can’t attend','人在海外，或已經有票想加買？':'Overseas, or already have a ticket?','單買周邊・海外寄送 ›':'Buy merch only · ship overseas ›','單買周邊・海外寄送':'Buy merch only · ship overseas',
 '需持有這場門票':'Requires a ticket to this event','海外寄送':'Ship overseas','運費依地區計算':'Shipping fee by region','Email（訂單確認信寄到這裡）':'Email (your order confirmation goes here)',
 '亞洲':'Asia','中國大陸':'Mainland China','歐洲':'Europe','大洋洲':'Oceania','加拿大・中南美・非洲':'Canada · Latin America · Africa','美國':'USA',
 '清單以外的國家（含中東地區郵局暫停收寄的國家）目前無法寄送，可來信 heartbeats0693@gmail.com 詢問。台灣粉絲請選現場領取。':'We can’t ship to countries not on this list (including Middle East destinations where postal service is suspended). Email heartbeats0693@gmail.com with questions. Fans in Taiwan, please choose event pickup.',
 '周邊為預購商品，活動後陸續寄出。依消費者保護法，收到商品前可隨時來信取消並全額退款；收到商品後 7 日內（現場領取以活動當天起算）可申請退貨退款。採中華郵政 e 小包並提供追蹤號碼；寄出後超過 45 天仍未送達或物流顯示遺失，免費重寄一次；地址填寫錯誤或拒收退回需自付重寄運費；物流顯示已投遞恕不補寄；關稅與進口稅由收件人負擔。':'Merch is pre-order and ships after the event. Under Taiwan consumer protection law you can cancel for a full refund any time before you receive it, and request a return and refund within 7 days of receiving it (for event pickup, counted from the event day). Ships via Chunghwa Post ePacket with tracking. If it hasn’t arrived 45 days after dispatch or tracking shows it lost, we reship once for free; reshipping after a wrong address or a refused delivery is at your cost; no reshipment once tracking shows delivered. Duties and import taxes are paid by the recipient.',
 '周邊為預購商品，活動當天憑票現場領取。依消費者保護法，收到商品前可隨時來信取消並全額退款；收到商品後 7 日內（現場領取以活動當天起算）可申請退貨退款。':'Merch is pre-order and picked up at the event with your ticket. Under Taiwan consumer protection law you can cancel for a full refund any time before you receive it, and request a return and refund within 7 days of receiving it (for event pickup, counted from the event day).',
 '現場領取：活動當天憑票領取（出示 App「我的票」）。':'Event pickup: collect on the event day with your ticket (show “My tickets” in the app).','每人各限購 1 份。':'Limit 1 of each per person.',
 '周邊於活動當天憑票現場領取':'Merch is picked up at the event with your ticket',
 /* B343T：數量、免票現場領取（姓名＋電話） */
 '每筆最多 5 組':'Up to 5 per order','寄送':'Ship','台灣・亞洲 NT$250／其他 NT$500':'Taiwan & Asia NT$250 / elsewhere NT$500','領取人資料（現場核對用）':'Pickup details (checked at the event)','領取人姓名':'Name for pickup','手機號碼':'Mobile number','請填領取人姓名和手機（現場核對用）':'Please enter the pickup name and mobile number (checked at the event).','減少':'Decrease','增加':'Increase',
 '周邊為預購商品，活動當天現場領取（報訂購姓名＋電話）。依消費者保護法，收到商品前可隨時來信取消並全額退款；收到商品後 7 日內（現場領取以活動當天起算）可申請退貨退款。':'Merch is pre-order and picked up at the event (give the name + phone on your order). Under Taiwan consumer protection law you can cancel for a full refund any time before you receive it, and request a return and refund within 7 days of receiving it (for event pickup, counted from the event day).',
 '電話（含國碼）':'Phone (with country code)','地址（街道、門牌、樓層）':'Address (street, number, floor)','城市':'City','州／省（沒有可空白）':'State / province (optional)','郵遞區號（香港、澳門免填）':'Postal code (not needed for Hong Kong / Macau)','例如：小晞、Amy':'e.g. Amy','6 位數驗證碼':'6-digit code','例如 K7X 2M9':'e.g. K7X 2M9',
 /* B341T：票種福利（後台與 test.html 一致） */
 '離場HI FIVE':'HI FIVE on the way out','6號小卡':'No. 6 photo card','隨機A3海報一張':'One random A3 poster',
 /* 場地若在後台改成 8 樓 A 廳：英文跟著換 */
 '微風影城8樓A廳':'Breeze Cinemas · Hall A, 8F','微風影城 8 樓 A 廳':'Breeze Cinemas · Hall A, 8F','微風影城8樓A廳 · 台北':'Breeze Cinemas · Hall A, 8F, Taipei','微風影城 8 樓 A 廳 · 台北':'Breeze Cinemas · Hall A, 8F, Taipei',
 };
 Object.assign(D,{
 /* B319T：購票頁、購票須知（海外粉絲付款前看得懂；英文僅供參考，以中文為準） */
 '購買票券':'Buy tickets','訂單明細':'Order summary','收票 Email':'Email for your ticket','你的 email（票會寄到這裡）':'Your email (your ticket is sent here)',
 '你的稱呼':'Your name','僅用於本活動（報到與現場使用）':'Used only for this event (check-in on the day).',
 'CHANCE 在海報上署名會用這個名字，請確認寫法':'CHANCE will sign the poster with this name. Please check the spelling.',
 '購買前請注意':'Before you buy','每人限購 1 張（以收票 Email 認定）':'1 ticket per person (per email).',
 '每人每票種限購 1 張（以收票 Email 認定）':'1 ticket per person per ticket type (per email)','每人每票種限購 1 張（以收票 Email 認定）。':'1 ticket per person per ticket type (per email).',
 '周邊於活動當天憑票現場領取':'Merch is collected at the event with your ticket.',
 '完整購票須知 ›':'Full ticket terms ›','應付金額':'Total due','前往付款即表示同意':'By continuing to payment, you agree to the','《購票須知》':'ticket terms',
 '綠界 ECPay 安全付款 · 付款後票直接進票夾':'Secure payment by ECPay · Your ticket goes straight to your ticket wallet',
 '票會寄到':'Your ticket will be sent to','，也會存進票夾':' and saved in your ticket wallet.',
 '販售中':'On sale','下一步':'Next','合計':'Total','知道了':'Got it',
 '活動':'Event','票種福利':'What’s included','終身編號':'Lifetime number','限購與入場':'Limits & entry','退換票':'Refunds & transfers','主辦單位':'Organizer',
 '依付款完成順序配發；有人退票時，釋出的號碼由下一位購買者遞補。':'Assigned in order of payment. If someone gets a refund, their number goes to the next buyer.',
 '終身編號不是座位號碼；編號與福利隨票轉讓，歸新持有人。':'It is not a seat number. The number and perks move with the ticket if you transfer it.',
 '購票時需填寫稱呼，僅用於本活動（報到使用）。':'You’ll enter a name when buying; it’s used only for check-in at this event.',
 '購票時需填寫稱呼，僅用於本活動（報到與 VVIP 海報署名）。':'You’ll enter a name when buying; it’s used only for check-in and the VVIP signed poster.',
 '依現場引導入場，場內自由入座。':'Enter as directed by staff. Open seating inside.',
 '因主辦單位因素取消、改期或主要演出內容變更，全額退款、不收手續費。':'If the organizer cancels, reschedules or substantially changes the event, you get a full refund with no fee.',
 '非供自用、購票轉售圖利者，主辦單位得不予退換票。':'Tickets bought for resale at a profit may be refused refunds or exchanges.',
 '退票申請：來信 heartbeats0693@gmail.com，註明購票 Email 與票號。':'To request a refund, email heartbeats0693@gmail.com with your purchase email and ticket number.',
 '名稱：夏米爾企業社':'Name: 夏米爾企業社 (Shamir Enterprise)','負責人：張紫瑩':'Representative: 張紫瑩','客服信箱：heartbeats0693@gmail.com':'Support: heartbeats0693@gmail.com',
 '地址：臺北市中正區懷寧街76號':'Address: No. 76, Huaining St., Zhongzheng Dist., Taipei City, Taiwan',
 '※ 現場流程時間以當日公告為準':'※ On-site times follow the announcements on the day. This English text is for reference only; the Chinese version prevails.',
 '入場 QR 在「我的票」':'Your entry QR is in “My tickets”','出示票券入場':'Show your ticket at the entrance','查看票券詳情':'Ticket details',
 '完整生日活動入場・發餐':'Full birthday party entry · Meal included','第一支 MV 首播・嘉賓演出':'First MV premiere · Guest performance',
 '生日牆全體合照・全場大合照':'Group photo at the birthday wall · Full-room group photo','散場擊掌送客':'High-five send-off','現場抽獎資格（5 位：手鍊／帽T）':'Lucky draw entry (5 winners: bracelet / hoodie)',
 '第一支 MV 現場搶先首映與創作分享':'First MV premiere and the story behind it','生日環節・現場抽獎':'Birthday moment · Lucky draw','全場大合照（成品可下載）':'Full-room group photo (downloadable)',
 '主辦精選活動照下載':'Selected event photos to download','散場擊掌一次':'One high-five at the send-off','數位紀念票（App 票根）':'Digital keepsake ticket (App stub)',
 '合照與照片':'Photos','生日牆全體合照、全場大合照由官方攝影師拍攝，主辦精選活動照免費下載。':'The group photo at the birthday wall and the full-room group photo are taken by the official photographer. Selected event photos are free to download.',
 '照片上架時會寄 Email 通知。CHANCE App 是網頁 App，不用下載：任何手機瀏覽器打開 chance1228.com，用購票 Email 登入即可查看。':'We’ll email you when photos are up. The CHANCE App is a web app, so there’s nothing to install: open chance1228.com in any phone browser and sign in with your ticket email.',
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
 '購買須知（中文）':'Purchase terms (Chinese)','隱私權政策（中文）':'Privacy policy (Chinese)',
 /* B313T：信的周邊（SHOP 首頁＋周邊列表） */
 '寫給 Chance 的信':'A letter to Chance','寫一封信':'Write a letter','看全部周邊（卡包、信）':'All merch (card pack, letters)',
 '每月只收二十封，月底前他會親自讀完。':'Only 20 letters a month. He reads every one himself by month’s end.',
 '每月只收二十封，月底前親自讀完。':'Only 20 letters a month, read by Chance himself by month’s end.',
 'NT$99 · 每人每月一封':'NT$99 · One letter per person each month','CHANCE 官方周邊，數量有限。':'Official CHANCE merch. Limited quantities.',
 '每月限量 · 數位':'Monthly limit · Digital','／封':'/ letter','模擬付款 · 不會收費':'Demo checkout · No charge'
 });
 const MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], WK={'日':'Sun','一':'Mon','二':'Tue','三':'Wed','四':'Thu','五':'Fri','六':'Sat'};
 const enDay=(m,d,w)=>(WK[w]||w)+', '+MON[(+m-1)%12]+' '+d;
 const enTime=t=>{const [h,mi]=t.split(':').map(Number);return ((h%12)||12)+':'+String(mi).padStart(2,'0')+(h<12?' AM':' PM');};
 const enList=s=>s.split('、').map(x=>D[x.trim()]||x.trim()).join(', ');
 const rules=[
 /* B335T：票夾數量句 */
 [/^你有 (\d+) 張票$/,(_,n)=>'You have '+n+(n==='1'?' ticket':' tickets')],
 [/^剩 (\d+) 張$/,(_,n)=>n+' left'],
 [/^(\d+) 張票$/,(_,n)=>n+(n==='1'?' ticket':' tickets')],
 [/^(\d+) 席$/,(_,n)=>n+' seats'],
 [/^已入場 (\d+:\d+)$/,(_,t)=>'Admitted '+t],
 [/^(\d+) 位數驗證碼$/,(_,n)=>n+'-digit code'],
 [/^開場前 (\d+) 小時出現 QR$/,(_,n)=>'QR appears '+n+' hours before doors'],
 [/^開場前 (\d+) 小時，入場 QR 會出現在票上。$/,(_,n)=>'The entry QR will appear on your ticket '+n+' hours before doors.'],
 /* B319T：購票頁的日期、退票、編號、福利 */
 [/^(\d+)\/(\d+)（(?:星期)?([日一二三四五六]|Sun|Mon|Tue|Wed|Thu|Fri|Sat)）(\d+:\d+)・(.+)$/,(_,m,d,w,t,v)=>enDay(m,d,w)+' · '+enTime(t)+' Taipei time · '+(D[v]||v)],
 [/^(.+)｜(\d+)\/(\d+)（(?:星期)?([日一二三四五六]|Sun|Mon|Tue|Wed|Thu|Fri|Sat)）(\d+:\d+) 開始$/,(_,n,m,d,w,t)=>(D[n]||n)+' | '+enDay(m,d,w)+', starts '+enTime(t)+' (Taipei time)'],
 [/^(.+)，共 (\d+) 席$/,(_,v,n)=>(D[v]||v)+' · '+n+' seats'],
 [/^演出日前 20 日（(.+)）前可申請退票，酌收票價 10% 手續費$/,(_,d)=>'Refunds available until 20 days before the show ('+d+'), with a 10% fee.'],
 [/^演出日前 20 日前可申請退票，酌收票價 10% 手續費$/,()=>'Refunds available until 20 days before the show, with a 10% fee.'],
 [/^演出日前 20 日(?:（(.+)）)?前可申請退票，手續費為票價 10%；逾期恕不退票，可用票夾「轉讓給朋友」換人。$/,(_,d)=>'Refunds are available until 20 days before the show'+(d?' ('+d+')':'')+', with a 10% fee. After that, no refunds, but you can transfer the ticket to a friend from your ticket wallet.'],
 [/^終身編號依付款完成順序配發（No\.(\d+)–(\d+)）$/,(_,a,b)=>'Lifetime numbers are assigned in order of payment (No.'+a+'–'+b+').'],
 [/^（(NT\$[\d,]+)，編號 (\d+)–(\d+)）：(.*)$/,(_,p,a,b,l)=>' ('+p+', No.'+a+'–'+b+'): '+enList(l)],
 [/^(所有入場者共享|全票種共享)：(.*)$/,(_,k,l)=>(k==='全票種共享'?'Included with every ticket type: ':'Included for everyone: ')+enList(l)],
 [/^入場憑 App 票夾的入場 QR，開場前 (\d+) 小時出現，給工作人員掃描即完成入場。$/,(_,h)=>'Enter with the QR code in your App ticket wallet. It appears '+h+' hours before doors open; staff scan it at the entrance.'],
 [/^前往付款 (NT\$[\d,]+)$/,(_,p)=>'Continue to payment '+p],
 [/^下一步 (NT\$[\d,]+)$/,(_,p)=>'Next '+p],
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
 [/^（(\d+) 個國家／地區）。以中華郵政國際 e 小包寄出，寄出會再寄信給你追蹤號碼。$/,(_,n)=>' ('+n+' destinations). Ships via Chunghwa Post international ePacket. Tracking details will be emailed after dispatch.'],
 /* B342T：剩 N 件、運費（地區） */
 [/^(.+)・剩 (\d+) (件|組)$/,(_,a,n)=>(D[a]||a)+' · '+n+' left'],
 [/^運費（(.+)）$/,(_,z)=>'Shipping ('+(D[z]||z)+')'],
 [/^(\d+)\/(\d+) 報姓名＋電話領取$/,(_,m,d)=>'Pick up '+m+'/'+d+' with name + phone'],
 [/^(\d+)\/(\d+) 現場報訂購姓名＋電話領取$/,(_,m,d)=>'Pick up at the event on '+m+'/'+d+' with the name + phone on your order'],
 [/^(.+) ×(\d+)$/,(_,a,n)=>(D[a]||a)+' ×'+n],
 [/^(.*)（(Sun|Mon|Tue|Wed|Thu|Fri|Sat|星期[日一二三四五六])）(.*)$/,(_,a,w,b)=>a+'('+({'星期日':'Sun','星期一':'Mon','星期二':'Tue','星期三':'Wed','星期四':'Thu','星期五':'Fri','星期六':'Sat'}[w]||w)+')'+b.replace('台北時間','Taipei time')],   /* B335T（P2-17）：英文用半形括號 */
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
