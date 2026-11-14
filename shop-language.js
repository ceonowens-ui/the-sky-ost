/* B283T: automatic shopping language. Display only; never translate input values or request payloads. */
(function(){
 'use strict';
 const forced=(function(){try{return (new URLSearchParams(location.search).get('lang')||'').toLowerCase();}catch(e){return '';}})();   /* B293T：測試用 ?lang=en／?lang=zh 可強制語言（正式判斷仍是瀏覽器語言） */
 const preferred=forced||(navigator.languages&&navigator.languages[0])||navigator.language||'zh-TW';
 const en=window.SKY_LANG?window.SKY_LANG==='en':!/^zh(?:-|$)/i.test(preferred);   /* B294T：跟全 App 同一個判斷 */
 const D={
 /* B518T：付款回來的提示（座位有變動、卡包還沒查到付款、上一筆其實已付款） */
 '這筆還沒付款，不會扣款，填的資料都還在，但座位有變動，請重新選位再付款。如果剛剛其實已經付款，幾秒內會自動跳到購買成功，請不要再付一次。':'You haven’t paid, so you won’t be charged. Your details are still here, but your seats have changed — please choose seats again before paying. If you actually just paid, this will switch to your tickets in a few seconds. Please don’t pay twice.',
 '還沒查到這筆的付款紀錄。如果你已經付款，這裡會自己跳到購買成功，請不要再付一次；如果還沒付款，再按一次前往付款就可以。':'We haven’t found a payment for this order yet. If you already paid, this page will switch to your order by itself — please don’t pay again. If you haven’t paid, just tap Pay again.',
 '你剛剛那筆已經付款成功，不用再付一次。':'Your last payment already went through — no need to pay again.',
 /* B494T：英文版補字 */
 '你已購買':'Purchased',
 /* B452T：沒登入不能選位 */
 '登入後才能選位':'Sign in to choose seats','先用 email 登入（沒買過專輯也可以）：':'Sign in with your email first:','登入並選位':'Sign in and choose seats','6 位數驗證碼':'6-digit code','驗證碼不對或過期':'That code is wrong or has expired.','一分鐘內只能寄一次':'You can send one code per minute.','寄不出去':'We could not send the code.','email 格式不對':'Please check your email address.','寄送中…':'Sending…','驗證中…':'Checking…','請輸入 6 位數驗證碼':'Enter the 6-digit code.','連不上伺服器，再試一次':'Could not reach the server. Please try again.',
 /* B383T：UX 迴圈第 3 回 */
 '・購買須知':'· Terms',
 /* B382T：UX 迴圈第 2 回 */
 '售完為止':'While stocks last','推薦・獨家 6 號小卡':'Top pick · No. 6 card','推薦・只在這裡拿得到的 6 號小卡':'Top pick · No. 6 card only here','含國碼，如 +852…':'With country code, e.g. +852…','付款後 7 個工作天內寄出・台灣免運':'Ships within 7 business days of payment · free shipping in Taiwan','海外 e 小包寄出・附追蹤號碼':'Ships by international ePacket · tracking included','12/27 生日會當天・周邊服務台領取・免運':'Pick up at the merch desk on 12/27 · free','購買、退換貨與個資處理，依《購買須知》與《隱私權政策》。':'Purchases, refunds and personal data follow the Purchase Terms and Privacy Policy.',
 /* B381T：UX 迴圈第 1 回 */
 '按「前往付款」後名額保留 3 分鐘，逾時讓給下一位':'After you tap Pay, your spot is held for 3 minutes — then it goes to the next person','門票':'Ticket',
 /* B387T：別頁填過的資料帶入 */
 '已帶入你之前填過的資料，可以改':'Filled in from what you entered before — you can change it',
 '已帶入你之前填過的資料，Email 以外都可以改':'Filled in from what you entered before — you can change everything except the email',
 '登入後才能寄出':'Sign in to send your letter',
 /* B499T：登入帳號的 Email 不能改 */
 '這是你登入的帳號，不能改。要換 Email，請先登出，再用另一個 Email 登入。':'This is the account you’re signed in with, so it can’t be changed. To use a different email, sign out and sign in with that email.',
 /* B416T：卡包未確認訂單 */
 '上一筆卡包訂單還沒查到付款':'Your last card-pack order isn’t confirmed yet','重新確認付款 ›':'Check payment again ›',
 /* B414T */
 '這張票已經不在你的票夾（可能已轉讓給朋友）。':'This ticket is no longer in your wallet (it may have been transferred).',
 /* B422T：周邊領取碼 */
 '周邊為預購商品，活動當天現場領取（出示領取碼＋姓名）。依消費者保護法，收到商品前可隨時來信取消並全額退款；收到商品後 7 日內（現場領取以活動當天起算）可申請退貨退款。':'Merch is pre-order and picked up at the event with your pickup code and name. Under Taiwan consumer law you can cancel for a full refund by email before receiving it, and request a return within 7 days after receiving it (for event pickup, counted from the event day).','現場領取：活動當天到周邊服務台，出示「我的票 → 周邊訂單」裡的領取碼和姓名。':'Event pickup: at the merch desk on the event day, show the pickup code in My tickets → Merch orders and your name.','周邊於活動當天出示領取碼現場領取':'Merch is picked up at the event with your pickup code',
 /* B421T：一筆最多 5 張 */
 '每個帳號這場最多 5 張（含付款中的訂單；轉讓出去的票也算）；票都寄到同一個 Email，可在 App 轉讓給朋友':'Up to 5 tickets per account for this event (unpaid orders and tickets you transfer out count). All tickets go to one email and can be transferred in the app.','每個帳號這場最多 5 張；票都寄到同一個 Email，可以在 App 裡轉讓給朋友':'Up to 5 tickets per account for this event. All tickets go to the same email and can be transferred to friends in the app.','每筆訂單最多 5 張，不限每人張數；同一筆的票都寄到同一個 Email，可在 App 轉讓給朋友':'Up to 5 tickets per order, no limit per person. All tickets in an order go to one email and can be transferred in the app','每筆訂單最多 5 張，不限每人張數；同一筆的票都寄到同一個 Email，可在 App 轉讓給朋友。':'Up to 5 tickets per order, no limit per person. All tickets in an order go to one email and can be transferred in the app.',
 /* B418T：購買成功摘要 */
 '付款成功，票券準備中':'Paid — your tickets are being prepared','付款成功，票券準備中…':'Paid — your tickets are being prepared…',
 /* B410T：已轉讓的票 */
 '這張票已轉讓，不能入場':'This ticket was transferred and can’t be used for entry','回到我的票':'Back to my tickets','已轉讓':'Transferred','轉讓中':'Transferring',
 /* B407T：票券頁切換多張 */
 '上一張':'Previous ticket','下一張':'Next ticket',
 /* B406T：一次買多張 */
 '張數':'Tickets','每筆最多 5 張':'Up to 5 per order','一次最多買 5 張；票都寄到同一個 Email，可以在 App 裡轉讓給朋友':'Up to 5 tickets per order. All tickets go to the same email and can be transferred to friends in the app',
 /* B405T：取票鑰匙／垃圾信件提示 */
 '沒收到？看一下垃圾信件（Yahoo、Hotmail 常會放在那裡），或按「重寄」。':'Didn’t get it? Check your spam folder (Yahoo and Hotmail often put it there), or tap “Resend”.',
 /* B403T：已付款、票在排隊 */
 '付款已經成功。人多的時候票會排隊出，最多一兩分鐘，別關掉這個畫面，也不需要重新購買。':'Payment received. When many people buy at once, tickets are issued in turn — up to a minute or two. Keep this screen open; no need to buy again.',
 /* B401T：回來先等後台確認付款 */
 '綠界已經付款的話，通常幾秒內就會確認，別關掉這個畫面。':'If you already paid on ECPay, this usually takes a few seconds. Please keep this screen open.',
 '等了 20 秒，後台還沒收到這筆付款。如果綠界已經顯示付款成功，請不要按「不買了」、也不要再付一次：幾分鐘內會收到確認信，到「我的票」就看得到。確定沒付的話，按「重新付款」回到結帳頁，資料都還在。':'After 20 seconds we still have not received this payment. If ECPay already showed “payment successful”, do not tap “Never mind” and do not pay again: a confirmation email arrives within a few minutes and the ticket will appear in My Tickets. If you are sure you did not pay, tap “Pay again” to go back to checkout — your details are still there.',
 /* B379T：沒付款回來 */
 '還沒收到付款':'Payment not received yet','這筆還沒付款，也不會扣款。要繼續買，按「重新付款」回到結帳頁，資料都還在。':'This order has not been paid and nothing was charged. To continue, tap “Pay again” to go back to checkout — your details are still there.','重新付款':'Pay again','不買了，回上一頁':'Never mind, go back','商品':'Item',
 /* B378T：UX 第二批 */
 '已帶入購票時的資料，可以改':'Filled from your ticket purchase — you can change it','放大圖片':'Zoom image','點一下關閉':'Tap to close','訂單已收進「我的票」，確認信稍後寄到':'Saved to My tickets — a confirmation email is on its way','・活動後寄出，寄出會寄追蹤號碼給你':' · Ships after the event; we will email the tracking number','到周邊服務台報姓名和手機領取':'pick up at the merch desk with your name and phone','保留時間已過。還沒付款的話，請重新購買一次。':'The hold has expired. If you have not paid, please buy again.',
 /* B377T：UX 檢查第一批 */
 '推薦':'Recommended','限寄送到台灣以外的地區':'Ships outside Taiwan only','6 號小卡只隨組合':'No. 6 card only in the set','A3 海報組 ＋ 6 號小卡（小卡只隨組合）':'A3 poster set + No. 6 card (card only in the set)','現場領取・免運':'Event pickup · free','綠界 ECPay 安全付款・信用卡':'Secure payment by ECPay · credit card',
 /* B375T：生日周邊購買頁（卡包結帳頁版型） */
 '泰國':'Thailand','菲律賓':'Philippines','越南':'Vietnam','印尼':'Indonesia','墨西哥':'Mexico','巴西':'Brazil','阿根廷':'Argentina','智利':'Chile','南非':'South Africa','德國':'Germany','義大利':'Italy','西班牙':'Spain','荷蘭':'Netherlands','比利時':'Belgium','瑞士':'Switzerland','奧地利':'Austria','瑞典':'Sweden','挪威':'Norway','丹麥':'Denmark','芬蘭':'Finland','愛爾蘭':'Ireland','葡萄牙':'Portugal','波蘭':'Poland','捷克':'Czechia','紐西蘭':'New Zealand',
 '選擇商品':'Choose items','請選擇':'Select','選地區後顯示':'Shown after you pick a region','請選寄送地區':'Please choose a shipping region','請先選商品':'Please choose an item first','找不到登入的 email，請重新登入':'We could not find your sign-in email — please sign in again',
 '活動後以中華郵政 e 小包寄出，寄出會再寄信給你追蹤號碼。':'Shipped after the event by Chunghwa Post e-Packet; we will email you the tracking number.',
 /* B363T：搶票只保留 3 分鐘、付款晚到 */
 '按「前往付款」後請在 3 分鐘內完成付款；超過時間，名額會先讓給下一位。':'After tapping “Go to payment”, please pay within 3 minutes — after that your spot goes to the next person.',
 '付款超過 3 分鐘，名額已讓給下一位':'Paid after 3 minutes — the spot went to the next person','付款超過 3 分鐘，商品已讓給下一位':'Paid after 3 minutes — the item went to the next person',
 '這筆付款會全額退款，請不要重複購買。主辦會盡快用 email 聯絡你。':'This payment will be fully refunded. Please do not buy again — the organiser will email you soon.',
 /* B362T：庫存帳本（防超賣）訊息、SHOP 周邊兩排、卡包接正式商店 */
 '這個商品剛好被買完了（或有人正在結帳保留中）。還沒建立付款，不會扣款。':'This item just sold out (or someone is checking out the last one). No payment was created — you were not charged.',
 '每人限購 1 張（以 Email 認定），這個 Email 已經買過或正在結帳。':'Limit 1 per person (by email). This email has already bought one or is checking out.',
 '現在無法確認庫存，請稍後再試。還沒建立付款，不會扣款。':'We could not confirm stock right now. Please try again shortly — no payment was created.',
 '這筆訂單正在等主辦確認，請不要重複購買。':'This order is waiting for the organiser to confirm. Please do not buy again.',
 '常駐商品':'Always available','沒有付款':'Not paid','已取消，沒有付款。':'Cancelled — no payment was made.',
 '商品圖片為示意圖。海外寄送、現場領取都在下一步選；買票時也可以直接加購。':'Images are for illustration. Choose overseas shipping or event pickup in the next step; you can also add these when buying a ticket.',
 /* B361T：結帳欄位檢查、SHOP 周邊兩個選項 */
 '請填寫你的稱呼':'Please enter your name','稱呼最多 20 個字':'Name can be up to 20 characters','稱呼至少要有一個字（不能只有符號）':'Your name needs at least one letter (not only symbols)',
 '請填寫手機號碼':'Please enter your mobile number','手機號碼只能填數字':'Mobile number can only contain digits',
 '海外號碼請填「+國碼＋號碼」，例如 +852 91234567':'For non-Taiwan numbers, add the country code, e.g. +852 91234567',
 '台灣手機是 09 開頭 10 碼；海外號碼請在前面加「+國碼」':'Taiwan mobiles are 10 digits starting with 09; for other countries add +country code',
 '請填寫收票 email':'Please enter the email for your ticket','email 格式不對，再看一下':'That email doesn’t look right — please check it',
 '測試版請用「信箱名＋數字」，例如 name+1@gmail.com，不然收不到信':'Test build: use name+number, e.g. name+1@gmail.com, or the email won’t arrive',
 '選這個':'Choose','商品圖片為示意圖。海外寄送、現場領取都在下一步選。':'Images are for illustration. Choose overseas shipping or event pickup in the next step.',
 /* B360T：SHOP 第三區「我的票」、付款完直接到票 */
 '全部':'All','這個帳號還沒有票或周邊訂單。':'No tickets or merch orders on this account yet.','已經買過？用購買時的 Email 找回你的票和周邊訂單。':'Already bought? Use your purchase email to find your tickets and merch orders.',
 '用 Email 找回':'Find with email','打開我的票':'Open my tickets','點一下放大 QR':'Tap to enlarge the QR','入場 QR':'Entry QR','準備中':'Preparing',
 '入場 QR 就在下面，也收進「我的票」了':'Your entry QR is below and saved in My tickets.','通常幾秒內就會出現。':'It usually appears within a few seconds.','活動當天現場領取':'Pick up at the event',
 /* B359T：流程簡化（SHOP 直接進結帳、成功頁確認中、我的票分頁、測試重設） */
 '測試版・不連正式票務':'Test build · not live ticketing','重新測試':'Reset test',
 '活動資訊與入場規則':'Event info & entry rules','回到 SHOP':'Back to SHOP','查看我的票 →':'View my tickets →',
 '周邊訂單':'Merch orders','確認付款':'Confirming payment','✓ 已付款':'✓ Paid','活動後寄出':'Ships after the event','Payment confirmed':'Payment confirmed',
 '使用購買時的 Email':'Use your purchase email',
 '輸入購買時的 Email，收取驗證碼後查看訂單。':'Enter your purchase email. Use the verification code to view your orders.',

 '我的訂單':'My orders',
 '使用購買時的 Email 查看周邊訂單':'Use your purchase email to view your merch orders',
 '這個帳號尚未找到周邊訂單。若已付款，請稍後更新，或確認登入的 Email。':'No merch orders found for this account yet. If you have paid, refresh later or check your sign-in email.',

 '付款已確認，訂單需協助':'Payment confirmed — order needs assistance',
 '請勿再次付款。請聯絡客服核對這筆訂單。':'Please do not pay again. Contact support to check this order.',
 '聯絡客服':'Contact support',
 '卡包付款尚未接入隔離測試，這個候選版暫不開放付款。':'Card-pack checkout is not connected to isolated testing and is unavailable in this preview.',
 '購票：隔離測試版（不會連到正式票務）':'Tickets: isolated test version',

 '正在確認付款…':'Confirming payment…',
 '付款已確認，訂單處理中':'Payment confirmed — preparing your order',
 '付款狀態確認中':'Checking payment status',
 '若已完成付款，請勿重複購買。可稍後重新確認或查看訂單。':'If you have paid, please do not buy again. Check again later or view your orders.',
 '訂單已成立':'Order confirmed',
 '查看我的訂單':'View my orders',
 '查看周邊訂單':'View merch orders',
 '使用購買時的 Email 查看訂單；若已付款，請勿重複購買。':'Use your purchase email to view your order. If you have paid, please do not buy again.',

 /* B357T：後台確認付款（M3.3 /ticket/order）後的字句 */
 '付款已確認，票券準備中…':'Payment confirmed — preparing your ticket…','付款已確認，PhotoPass 開通中…':'Payment confirmed — activating PhotoPass…',
 '付款已確認，票券準備中':'Payment confirmed — preparing your ticket','付款已確認，PhotoPass 開通中':'Payment confirmed — activating PhotoPass','付款已確認，票券還在處理':'Payment confirmed — ticket still processing',
 '我們會盡快補發，不需要重新購買。':"We'll issue it as soon as possible. No need to buy again.",
 '票券一進來就會出現在票夾。請按「重新確認」，不需要重新購買。':'Your ticket will appear in your wallet as soon as it is ready. Tap “Check again” — no need to buy again.',
 '這筆付款已經確認，但出票延遲，主辦會盡快補發到你的票夾和信箱。請不要重新購買。':'Your payment is confirmed but the ticket is delayed. The organizer will issue it to your wallet and email as soon as possible. Please do not buy again.',
 '✓ 付款已確認':'✓ Payment confirmed','還在確認付款；綠界付款成功後，幾秒內會更新。':'Still confirming payment; this updates within seconds after ECPay confirms.','門票信已寄出':'Ticket email sent','門票信已寄出，沒看到請查垃圾信件':'Ticket email sent. Can’t find it? Check spam.','門票信會寄到你的信箱，沒看到請查垃圾信件':'Your ticket email is on its way. Can’t find it? Check spam.',
 /* B356T：成功頁（真正的入場 QR）、確認付款中、還在確認中 */
 '購買成功':'Purchase complete','已收進我的票夾':'Saved to your ticket wallet','入場 QR':'Entry QR','入場 QR 準備中…':'Entry QR is being prepared…',
 '查看我的票夾':'Open my ticket wallet','繼續逛周邊':'Keep browsing merch','入場 QR 在票夾裡。':'Your entry QR is in your ticket wallet.',
 '正在確認付款和票券…':'Confirming your payment and ticket…','正在確認付款和 PhotoPass…':'Confirming your payment and PhotoPass…','通常幾秒內就好，別關掉這個畫面。':'This usually takes a few seconds. Please keep this screen open.',
 '還在確認中':'Still confirming','票夾裡還沒看到這筆購買的票。':"This purchase's ticket isn't in your wallet yet.",'還沒確認到這筆 PhotoPass。':"This PhotoPass hasn't been confirmed yet.",
 '如果綠界已經顯示付款成功，通常一兩分鐘內就會出現。請按「重新確認」，不需要重新購買。':'If ECPay showed “Payment successful”, it usually appears within a minute or two. Tap “Check again” — no need to buy again.',
 '重新確認':'Check again',
 /* B354T：從綠界回到 App 的付款確認、測試後台寄信提示 */
 '剛剛的付款完成了嗎？':'Did your payment go through?','綠界如果已經顯示「付款成功」，按下面查看你的票（還沒登入的話會請你輸入信箱收到的驗證碼）。':'If ECPay showed “Payment successful”, tap below to see your ticket (if you are not signed in yet, we will ask for the code sent to your email).',
 '已付款，查看我的票':'I paid, show my ticket','還沒付／取消':'Not yet / cancel',
 '最後一步：收進票夾':'Last step: add it to your wallet','付款成功後，電子票會寄到':'Your e-ticket will be emailed to','付款成功後，開通通知會寄到':'Your activation notice will be emailed to',
 '我們會寄 6 位數驗證碼到同一個信箱，輸入後票就收進這支手機。':'We will email a 6-digit code to the same address. Enter it to add the ticket to this phone.',
 '收進票夾':'Add to wallet','沒收到？重寄':"Didn't get it? Resend",'稍後再說（票在信箱裡，不會不見）':'Later (your ticket is safe in your email)',
 '測試後台只寄信到「信箱名＋數字」的地址（例如 name+1@gmail.com），其他信箱收不到門票信和驗證碼。':'Test backend: emails go only to “name+number” addresses (e.g. name+1@gmail.com); other addresses get no ticket email or code.',
 /* B335T：票夾（我的票）、票券登入、票種、轉讓、合照——英文介面原本整頁中文（UI/UX 審查 P1-4） */
 '我的票夾':'My tickets','收藏':'Collection','更多':'More','去購票':'Get tickets','即將到來':'Upcoming','過往':'Past','還沒有過往的票。':'No past tickets yet.',
 '買票後，票會自動放進這裡。':'Tickets you buy will appear here.','入場過的票會變成票根留在這裡。':'Used tickets stay here as stubs.','沒有即將到來的票。':'No upcoming tickets.',
 '已買過票？':'Already have a ticket?','用 email 找回你的票':'Find it with your email','登入':'Sign in','你的 email':'Your email','寄驗證碼給我':'Email me a code','位數驗證碼':'-digit code',
 '買過專輯會自動登入；沒有的話輸入 email，我們寄一組驗證碼給你（收朋友轉讓的票也用這個）。':"If you've bought the album you're already signed in. Otherwise enter your email and we'll send you a code (also used to receive a ticket from a friend).",
 '已入場':'Admitted','已退票':'Refunded','已作廢':'Void','已結束':'Ended','轉讓中':'Transferring','轉讓給朋友':'Transfer to a friend','取消轉讓':'Cancel transfer','看轉讓 QR':'Show transfer QR',
 '開演前 3 小時起停止轉讓':'Transfers close 3 hours before the show','這張票正在轉讓中（10 分鐘內有效）':'This ticket is being transferred (valid for 10 minutes)','找不到這張票，可能已轉讓給朋友。':"This ticket wasn't found. It may have been transferred.",
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
 '票價：1,880元(含離場HI FIVE、6號小卡)':'Ticket: NT$1,880 (includes a hi-five on the way out and a No. 6 photo card)',
 '座位名額：120名':'Seats: 120',
 '時間：14:00開始入場、14:30活動開始、16:00活動結束':'Time: Doors open 14:00, event starts 14:30, event ends 16:00',
 '11/15 12:00（台北時間）開放購票 (商品請於當日提前13:20至現場領取)':'Tickets go on sale 11/15 at 12:00 (Taipei time) (please come early at 13:20 on the day to collect your items on site)',
 '入場 QR 已在票夾，也寄到你的信箱。':'Your entry QR is in your ticket wallet and was also emailed to you.','。入場 QR 已在票夾，也寄到你的信箱。':'. Your entry QR is in your ticket wallet and was also emailed to you.','入場 QR 也會同時寄到你的信箱。':'Your entry QR will also be emailed to you.','入場憑 App 票夾或門票信裡的入場 QR，給工作人員掃描即完成入場。':'Enter with the QR code in your App ticket wallet or ticket email; staff scan it at the entrance.','・購票成功後，入場 QR 會立即出現在票夾，也會附在門票信裡':'・Right after purchase, your entry QR appears in your ticket wallet and is attached to your ticket email','活動取消，或有其他不可歸責於消費者的情形，全額退款、不收手續費（具體適用條文以正式公告為準）。':'If the event is cancelled, or in other situations not attributable to the buyer, you get a full refund with no fee (the exact terms will follow the official notice).','票券可在票夾「轉讓給朋友」換人。':'You can transfer the ticket to a friend from your ticket wallet.',
 '入場出示 App 票夾或門票信裡的 QR；手機無法顯示時，可報購買姓名＋手機後 4 碼核對':'Show the QR in your App ticket wallet or ticket email at the door. If your phone can’t show it, give the buyer’s name and the last 4 digits of the phone number.',
 '另販售周邊海報A3一組4張 880元 限量100組':'Also on sale: A3 poster set (4 posters per set), NT$880, limited to 100 sets',
 '海外專屬組合：1,280元，含6號卡及海報組4張，限量30組（不含入場）':'Overseas-only bundle: NT$1,280, includes a No. 6 photo card and an A3 poster set (4 posters), limited to 30 sets (no event entry)',
 '運費另計：亞洲區250元／海外區500元':'Shipping extra: Asia NT$250 / other regions NT$500',
 '亦可以備註留下全名跟電話在12/27現場領取時請人代領':'You can also leave your full name and phone number in the order note and have someone pick up for you on site on 12/27',
 '離場HI FIVE：可送禮物給成晞，但不接受特別配合拍照／錄影／簽名':'Hi-five on the way out: gifts for Chance are welcome, but no special requests for photos, videos or autographs',
 '最後會拍大合照/現場會有有獎問答及抽人形看板(當日入場會提供抽獎號碼/照購買票數提供同等抽獎獎號)':'We’ll take a group photo at the end / there will be a prize quiz and a draw for a life-size standee (raffle numbers are handed out at entry on the day / you get the same number of raffle numbers as tickets you bought)',
 /* B342T：買票＋生日周邊加購（A3 海報組／A3 海報組＋6號小卡）、單買周邊・海外寄送 */
 '加購生日限定周邊':'Birthday merch add-ons','商品圖為示意圖，實際商品以實物為準。買票時可在結帳頁加購 A3 海報組；A3 海報組＋6 號小卡是給不能來生日會的海外粉絲，只寄送台灣以外的地址。':'Product images are illustrations; the actual items may differ. You can add the A3 poster set at ticket checkout; the A3 poster set + No. 6 card is for overseas fans who can’t come to the birthday party, and ships only to addresses outside Taiwan.','商品圖為示意圖，實際商品以實物為準。買票時可在結帳頁加購 A3 海報組；A3 海報組＋6 號小卡組合限寄送到台灣以外的地區。':'Product images are illustrations; the actual items may differ. You can add the A3 poster set at ticket checkout; the A3 poster set + No. 6 card ships only to destinations outside Taiwan.','人在海外想買 A3 海報組＋6 號小卡組合，或已經有票想加買？':'Want the A3 poster set + No. 6 card (overseas only), or already have a ticket?','A3 海報組 ＋ 6 號小卡・限寄送到台灣以外的地區':'A3 poster set + No. 6 card · ships outside Taiwan only','這個組合限寄送台灣以外':'This set ships outside Taiwan only','A3 海報組＋6 號小卡是給海外粉絲的，只寄送台灣以外的地址':'The A3 poster set + No. 6 card is for overseas fans and ships only to addresses outside Taiwan','A3 海報組＋6 號小卡組合限寄送到台灣以外的地區':'The A3 poster set + No. 6 card ships only to destinations outside Taiwan.','購票加購只提供 A3 海報組':'Only the A3 poster set can be added to a ticket.','生日限定周邊':'Birthday merch','生日限定周邊（預購）':'Birthday merch (pre-order)','選填・活動當天現場領取':'Optional · pick up at the event','活動當天現場領取':'Pick up at the event','預購中':'Pre-order open','預購已截止':'Pre-orders closed',
 'A3 海報組（一組 4 張）':'A3 poster set (4 posters)','A3 海報組':'A3 poster set','A3 海報組＋6號小卡組合':'A3 poster set + No. 6 photo card bundle','A3 海報組＋6號小卡':'A3 poster set + No. 6 photo card','A3 海報組＋A3 海報組＋6號小卡':'A3 poster set · Poster + No. 6 card bundle',
 '海外無法到場也可寄送':'Can be shipped if you can’t attend','人在海外，或已經有票想加買？':'Overseas, or already have a ticket?','單買周邊・海外寄送 ›':'Buy merch only · ship overseas ›','單買周邊・海外寄送':'Buy merch only · ship overseas',
 '需持有這場門票':'Requires a ticket to this event','海外寄送':'Ship overseas','運費依地區計算':'Shipping fee by region','Email（訂單確認信寄到這裡）':'Email (your order confirmation goes here)',
 '亞洲':'Asia','中國大陸':'Mainland China','歐洲':'Europe','大洋洲':'Oceania','加拿大・中南美・非洲':'Canada · Latin America · Africa','美國':'USA',
 '清單以外的國家（含中東地區郵局暫停收寄的國家）目前無法寄送，可來信 heartbeats0693@gmail.com 詢問。台灣粉絲請選現場領取。':'We can’t ship to countries not on this list (including Middle East destinations where postal service is suspended). Email heartbeats0693@gmail.com with questions. Fans in Taiwan, please choose event pickup.',
 '周邊為預購商品，活動後陸續寄出。依消費者保護法，收到商品前可隨時來信取消並全額退款；收到商品後 7 日內（現場領取以活動當天起算）可申請退貨退款。採中華郵政 e 小包並提供追蹤號碼；寄出後超過 45 天仍未送達或物流顯示遺失，免費重寄一次；地址填寫錯誤或拒收退回需自付重寄運費；物流顯示已投遞恕不補寄；關稅與進口稅由收件人負擔。':'Merch is pre-order and ships after the event. Under Taiwan consumer protection law you can cancel for a full refund any time before you receive it, and request a return and refund within 7 days of receiving it (for event pickup, counted from the event day). Ships via Chunghwa Post ePacket with tracking. If it hasn’t arrived 45 days after dispatch or tracking shows it lost, we reship once for free; reshipping after a wrong address or a refused delivery is at your cost; no reshipment once tracking shows delivered. Duties and import taxes are paid by the recipient.',
 '周邊為預購商品，活動當天憑票現場領取。依消費者保護法，收到商品前可隨時來信取消並全額退款；收到商品後 7 日內（現場領取以活動當天起算）可申請退貨退款。':'Merch is pre-order and picked up at the event with your ticket. Under Taiwan consumer protection law you can cancel for a full refund any time before you receive it, and request a return and refund within 7 days of receiving it (for event pickup, counted from the event day).',
 '現場領取：活動當天憑票領取（出示 App「我的票」）。':'Event pickup: collect on the event day with your ticket (show “My tickets” in the app).','每人各限購 1 份。':'Limit 1 of each per person.',
 '周邊於活動當天憑票現場領取':'Merch is picked up at the event with your ticket',
 /* 選位（CÉON 11/05） */
 '每張票可加購 1 組。':'You can add 1 set per ticket.','每張票可加購 1 組':'1 set per ticket',
 '對號入座，購票時選位':'Reserved seating · choose your seat when you buy',
 '票面會顯示你的座位，到場依座位入座。':'Your seat is shown on your ticket. Please sit in your assigned seat.',
 '入場與座位':'Entry & seats',
 '座位在購票時選定，票面和門票信都會顯示。':'You choose your seat when you buy. It appears on your ticket and in your ticket email.',
 '活動當天憑入場 QR 入場，依票面座位入座。':'Enter with your QR code on the day and sit in the seat on your ticket.',
 '轉讓時座位跟著票走；退票後座位會重新開放。':'Your seat moves with the ticket if you transfer it. Refunded seats go back on sale.',
 '輪椅席不開放線上選位，請聯繫主辦。':'Wheelchair seats are not sold online. Please contact the organizer.',
 '本活動為對號入座，座位於購票時選定，並顯示於票面與門票信。':'This event has reserved seating. You choose your seat when you buy, and it appears on your ticket and in your ticket email.',
 '按「前往付款」後座位保留 5 分鐘；逾時未完成付款，座位會開放給其他人。':'Your seat is held for 5 minutes after you tap Continue to payment. If you do not pay in time, it goes back on sale.',
 '逾時才完成付款且原座位已被購買時，系統自動改派最近的空位，並於票面與門票信註明；若已無空位，該筆不出票並全額退款。':'If you pay after the hold ends and your seat has been sold, you are moved to the nearest open seat, noted on your ticket and in your email. If no seat is left, no ticket is issued and you get a full refund.',
 '轉讓時座位隨票轉移；退票後座位重新開放。':'Your seat moves with the ticket if you transfer it. Refunded seats go back on sale.',
 '從第一次點選座位起，請在 10 分鐘內按「前往付款」。按之前都能更換座位，更換不會重新計時；時間到座位自動放掉，不會扣款，可以重新選位。':'You have 10 minutes from your first seat tap to tap Continue to payment. Until then you can change seats, but changing does not restart the clock. If time runs out, your seats are released, you are not charged, and you can choose again.',
 '付款後不能更換座位。':'Seats can’t be changed after payment.',
 '付款後不能更換座位':'Seats can’t be changed after payment',
 '選位時間到了，座位已放掉，請重新選位。還沒建立付款，不會扣款。':'Your 10 minutes ran out and the seats were released. Choose again. You have not been charged.',
 '按「前往付款」後座位保留 5 分鐘，請留在付款頁完成付款、不要關閉；超過時間，座位會開放給其他人。':'Your seat is held for 5 minutes after you tap Continue to payment. Stay on the payment page until it is done. After that it goes back on sale.',
 '最後的票正在別人的付款保留中，沒付款的話 5 分鐘內會釋出，可以稍後再試。還沒建立付款，不會扣款。':'The last tickets are being held for other buyers. Any unpaid ones are released within 5 minutes, so please try again soon. No payment was created.',
 '付款沒有成功':'Payment failed',
 '綠界回覆這筆付款沒有成功，所以不會出票。可以換一張卡再試一次，資料都還在。之前買好的票不受影響。':'ECPay reported that this payment failed, so no ticket was issued. You can try again with another card — your details are saved. Tickets you already bought are not affected.',
 '付款超過保留時間，已沒有空位可以改派':'Your payment arrived after the hold ended, and no seat is left to move you to',
 '已先為你鎖住 2 分鐘；按「前往付款」後保留 5 分鐘。':'Locked for you for 2 minutes; held for 5 minutes after you tap Continue to payment.',
 '選擇座位':'Choose seats','選位後計算':'After you choose seats',
 /* B465T：當天須知 */
 '當天須知':'On the day','離場 HI FIVE 時可以送禮物給成晞，但不接受特別配合拍照、錄影或簽名。':'At the hi-five on the way out you are welcome to give Chance a gift, but there are no special requests for photos, videos or autographs.','最後會拍大合照，現場有有獎問答和抽人形看板；入場時依購買張數發抽獎號碼。':'We will take a group photo at the end. There is a quiz with prizes and a draw for a life-size standee; you get one draw number per ticket at entry.','有買周邊的人，當天 13:20 起可以到現場領取；也可以留下全名和電話，請朋友代領。':'If you bought merch, pick it up on site from 13:20 that day, or leave your full name and phone number so a friend can collect it for you.',
 /* B459T：開賣前先登入 */
 '尚未開賣 · 先登入':'Not on sale yet · Sign in first','即將開賣 · 先登入':'Coming soon · Sign in first','先登入，開賣直接選位':'Sign in now, pick seats at launch','已登入 · 開賣直接選位':'Signed in · pick seats at launch','已登入 · 開賣直接選位 ✓':'Signed in · pick seats at launch ✓','先登入':'Sign in','✓ 已登入':'✓ Signed in','開賣前先登入':'Sign in before sales open','已登入':'Signed in','開賣時打開 App 就能直接選位，不用再收驗證碼。':'When sales open, just open the app and pick your seats. No code needed.',
 /* B441T：C 封面、付款 B */
 '輸入電子信箱':'Enter your email','稱呼':'Name','座位保留中，超過時間要重新選位':'Your seats are held. If time runs out, choose your seats again.','按「前往付款」後座位會保留一段時間；逾時未完成付款，座位會開放給其他人。':'Your seat is held for a limited time after you tap Continue to payment. If you do not pay in time, it goes back on sale.','按「前往付款」後，請留在付款頁完成付款、不要關閉；超過時間要重新選位。':'After you tap Continue to payment, stay on the payment page until it is done. If time runs out, choose your seats again.','座位保留中，還沒完成購買。超過時間要重新選位。':'Held for you. This is not a completed purchase. If time runs out, choose your seats again.',
 /* B438T：購票封面、結帳頁定稿 */
 '讓我們再見面吧':"Let's meet again",'生日會':'Birthday','活動與入場規則  ↗':'Event & entry rules  ↗',
 /* B437T：購票頁重點、付款前購票須知 */
 '這張票包含':'This ticket includes','當天還有':'Also on the day','大合照、有獎問答、抽人形看板':'Group photo, prize quiz, and a standee draw','時間':'Time','地點':'Venue','座位':'Seat','名額':'Capacity','開賣':'On sale','14:00 入場・14:30 開始・16:00 結束':'Doors 14:00, starts 14:30, ends 16:00','120 名':'120 people','11/15 12:00（台北時間）開放購票':'On sale 11/15 12:00 (Taipei time)','周邊、退票與完整規則，付款前會請你看過一次。':'You’ll review merch, refunds, and the full rules before you pay.',
 '依現場引導入場，依票面座位入座。':'Follow on-site guidance to enter, then sit in the seat on your ticket.','你的座位':'Your seat','收票資料':'Ticket details','修改':'Edit','付款前必須點開看過':'Open and review before you pay','看完後到下方勾選同意':'When you’re done, tick the box below','完整購票須知':'Full ticket terms','我已看過並同意購票須知':'I have read and agree to the ticket purchase terms','請先看過購票須知，再勾選同意才能付款。':'Please review the ticket terms, then tick the box to pay.','請勾選同意購票須知，才能付款。':'Please tick the box to agree to the ticket terms before you pay.',
 /* B436T：購票流程文案 */
 '這一次，我們見面吧。':'This time, let’s meet.','期待在這一天，和你一起度過。':'We can’t wait to spend this day with you.','這張票，會帶你來到我們見面的地方。':'This ticket brings you to our meeting place.','購票後出示入場碼，由工作人員掃碼':'After purchase, show your entry code for staff to scan',
 '把這天的回憶，也一起帶回家。':'Take a memory of this day home with you.','票會寄到這裡，記得填一個收得到信的信箱。':'Your ticket goes here. Use an inbox you can check.','當天，我們該怎麼稱呼你？':'What should we call you on the day?','再一步，我們就約好了。':'One more step and we’re all set.',
 '正在確認付款，請稍等一下。':'Confirming your payment. One moment.','我們正在為你準備這次的相遇。':'We’re getting ready to meet you.','我們正在為你準備這次的相遇。別關掉這個畫面。':'We’re getting ready to meet you. Please keep this screen open.',
 '沒關係，我們再試一次。':'It’s okay. Let’s try again.','付款尚未完成，請確認後重新付款。這筆不會出票，資料都還在，之前買好的票不受影響。':'Your payment isn’t complete. Please check and pay again. No ticket will be issued for this attempt, your details are saved, and tickets you already bought are not affected.',
 '我們還在確認這筆付款。':'We’re still confirming this payment.','如果你已經付款，請先不要重複購買，可稍後再查詢。':'If you already paid, please don’t buy again. You can check back later.','也可以按「重新確認」查看最新狀態。':'You can also tap Check again for the latest status.',
 '如果你已經付款，請先不要重複購買，可稍後到「我的票」查詢，也請不要按「不買了」。確定還沒付款，再按「重新付款」回到結帳頁，資料都還在。':'If you already paid, please don’t buy again, and do not tap “Never mind”. You can check My tickets later. If you’re sure you didn’t pay, tap Pay again to return to checkout. Your details are saved.',
 '這個位置剛被選走了，再挑一個喜歡的位置吧。還沒建立付款，不會扣款。':'This seat was just taken. Pick another seat you like. No payment was created.',
 /* B345T：分批入場、自由選位（CÉON 10/29 17:39） */
 '依購票順序分批入場，自由選位':'Entry in batches by purchase order · Free seating',
 '每批 10 人，進場後自行選擇現場空位。':'10 people per batch. Once inside, pick any open seat.',
 '入場與選位':'Entry & seating',
 '依付款完成順序，每 10 人一批，依序入場選位。':'Entry is in batches of 10, in the order payments were completed. Each batch goes in and picks seats in turn.',
 '如錯過自己的入場批次，報到後將跟隨當時的隊伍入場，選擇剩餘空位。':'If you miss your batch, check in and enter with the batch going in at that time, then pick from the seats left.',
 '請勿替尚未入場的朋友佔位。想坐一起的朋友，可一起等較後的批次入場。':'Please don’t save seats for friends who haven’t come in yet. Friends who want to sit together can wait and enter with a later batch.',
 '報到時間與叫號方式將另行公告。':'Check-in time and how batches will be called will be announced later.',
 '入場與座位安排':'Entry and seating',
 '本活動依付款完成順序安排入場，每 10 人為一批，並依序進場。入場後可自行選擇現場尚未被選擇的開放座位。':'Entry follows the order in which payments were completed, in batches of 10, one batch at a time. Once inside, you can choose any open seat that hasn’t been taken.',
 '請依公告時間完成報到並留意叫號。如錯過自己的入場批次，仍可憑有效票券入場；完成報到後，請依工作人員指示，跟隨當時的隊伍入場，選擇剩餘空位。錯過批次者不另保留原本的優先選位順序。':'Please check in at the announced time and listen for your batch to be called. If you miss your batch, you can still enter with a valid ticket: after checking in, follow the staff’s directions, enter with the batch going in at that time, and choose from the seats left. If you miss your batch, your original place in the seating order is not held.',
 '請勿以物品替尚未入場的人佔位。希望坐在一起的朋友，可選擇一起等候較後的入場批次，再從當時剩餘的座位中選擇。':'Please don’t use your belongings to save seats for people who haven’t come in yet. Friends who want to sit together can wait and enter with a later batch, then choose from the seats still open.',
 '部分座位可能因無障礙需求、攝影、工作人員或場地安排而保留，請依現場標示與工作人員引導入座。':'Some seats may be reserved for accessibility needs, filming, staff or venue arrangements. Please follow the signs and the staff’s directions when taking a seat.',
 /* B346T：門票手機（現場核對） */
 '現場核對用（姓名＋手機後 4 碼），不會公開':'Used only for check-in at the event (name + last 4 digits). Never shown publicly.',
 '例如：0912345678':'09… or +country code', '請填寫手機號碼':'Please enter your mobile number.','手機號碼格式不對，再看一下':'That mobile number doesn’t look right. Please check it.',
 '購票時需填寫手機號碼，僅用於本活動現場核對（姓名＋手機後 4 碼）。':'A mobile number is required when buying. It is used only for check-in at this event (name + last 4 digits).',
 /* B343T：數量、免票現場領取（姓名＋電話） */
 '每筆最多 5 組':'Up to 5 per order','寄送':'Ship','台灣・亞洲 NT$250／其他 NT$500':'Taiwan & Asia NT$250 / elsewhere NT$500','領取人資料（現場核對用）':'Pickup details (checked at the event)','領取人姓名':'Name for pickup','手機號碼':'Mobile number','請填領取人姓名和手機（現場核對用）':'Please enter the pickup name and mobile number (checked at the event).','減少':'Decrease','增加':'Increase',
 '周邊為預購商品，活動當天現場領取（報訂購姓名＋電話）。依消費者保護法，收到商品前可隨時來信取消並全額退款；收到商品後 7 日內（現場領取以活動當天起算）可申請退貨退款。':'Merch is pre-order and picked up at the event (give the name + phone on your order). Under Taiwan consumer protection law you can cancel for a full refund any time before you receive it, and request a return and refund within 7 days of receiving it (for event pickup, counted from the event day).',
 '請填真實姓名，現場會核對':'Please use your real name; it’s checked on site','例如：王小明':'e.g. Amy Chen','請填寫你的真實姓名':'Please enter your real name','姓名最多 20 個字':'Name can be up to 20 characters','姓名至少要有一個字（不能只有符號）':'Your name needs at least one letter (not only symbols)','真實姓名':'Real name','你的真實姓名':'Your real name','購票時需填寫真實姓名，僅用於本活動（報到使用）。':'You’ll enter your real name when buying; it’s used only for check-in at this event.',
 '這筆還沒付款，不會扣款，座位和資料都還在。要買就再按一次前往付款；如果剛剛其實已經付款，幾秒內會自動跳到購買成功，請不要再付一次。':'You haven’t paid, so you won’t be charged. Your seats and details are still here; tap Continue to payment again to buy. If you actually just paid, this will switch to your tickets in a few seconds. Please don’t pay twice.','這筆還沒付款，不會扣款，資料都還在。要買就再按一次前往付款；如果剛剛其實已經付款，幾秒內會自動跳到購買成功，請不要再付一次。':'You haven’t paid, so you won’t be charged. Your details are still here; tap Continue to payment again to buy. If you actually just paid, this will switch to your order in a few seconds. Please don’t pay twice.',
 '每個帳號這場最多 5 張（含付款中的訂單；轉讓出去的票也算）；票都寄到同一個 Email，可在 App 轉讓給朋友。':'Up to 5 tickets per account for this event (unpaid orders and tickets you transfer out count). All tickets go to one email and can be transferred in the app.',
 '電話（含國碼）':'Phone (with country code)','地址（街道、門牌、樓層）':'Address (street, number, floor)','城市':'City','州／省（沒有可空白）':'State / province (optional)','郵遞區號（香港、澳門免填）':'Postal code (not needed for Hong Kong / Macau)','例如：小晞、Amy':'e.g. Amy','6 位數驗證碼':'6-digit code','例如 K7X 2M9':'e.g. K7X 2M9',
 /* B341T：票種福利（後台與 test.html 一致） */
 '離場HI FIVE':'Hi-five on the way out','6號小卡':'No. 6 photo card','隨機A3海報一張':'One random A3 poster',
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
 '活動':'Event','票種福利':'What’s included','終身編號':'Lifetime number','限購與入場':'Limits & entry','退換票':'Refunds & transfers','主辦單位':'Organizer','售票代辦':'Ticketing agent',
 '依付款完成順序配發；有人退票時，釋出的號碼由下一位購買者遞補。':'Assigned in order of payment. If someone gets a refund, their number goes to the next buyer.',
 '終身編號不是座位號碼；編號與福利隨票轉讓，歸新持有人。':'It is not a seat number. The number and perks move with the ticket if you transfer it.',
 '購票時需填寫稱呼，僅用於本活動（報到使用）。':'You’ll enter a name when buying; it’s used only for check-in at this event.',
 '購票時需填寫稱呼，僅用於本活動（報到與 VVIP 海報署名）。':'You’ll enter a name when buying; it’s used only for check-in and the VVIP signed poster.',
 '依現場引導入場，場內自由入座。':'Enter as directed by staff. Open seating inside.',
 '因主辦單位因素取消、改期或主要演出內容變更，全額退款、不收手續費。':'If the organizer cancels, reschedules or substantially changes the event, you get a full refund with no fee.',
 '非供自用、購票轉售圖利者，主辦單位得不予退換票。':'Tickets bought for resale at a profit may be refused refunds or exchanges.',
 '退票申請：來信 heartbeats0693@gmail.com，註明購票 Email 與票號。':'To request a refund, email heartbeats0693@gmail.com with your purchase email and ticket number.',
 '名稱：微風廣場實業股份有限公司':'Name: 微風廣場實業股份有限公司 (Breeze)','統一編號：89477962':'Business ID: 89477962','代表人：黃瑞姸':'Representative: 黃瑞姸','地址：臺北市松山區復興南路1段39號':'Address: No. 39, Sec. 1, Fuxing S. Rd., Songshan Dist., Taipei City, Taiwan',
 '名稱：夏米爾企業社':'Name: 夏米爾企業社 (Xiamier Enterprise)','負責人：張紫瑩':'Representative: 張紫瑩','客服信箱：heartbeats0693@gmail.com':'Support: heartbeats0693@gmail.com',
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
 'NT$99 · 每人每月一封':'NT$99 · One letter per person each month', '最後幾包有人正在結帳，請幾分鐘後再試':'The last few packs are being checked out by someone else. Please try again in a few minutes.', 'NT$30 · 每人每月一封':'NT$30 · One letter per person each month','CHANCE 官方周邊，數量有限。':'Official CHANCE merch. Limited quantities.',
 '每月限量 · 數位':'Monthly limit · Digital','／封':'/ letter','模擬付款 · 不會收費':'Demo checkout · No charge'
 });
 Object.assign(D,{
 /* B563T（CÉON 11/14）：領周邊只要出示票券 QR（到處同一句話） */
 '生日會當天，到周邊服務台出示票券 QR 領取。':'On the day, show your ticket QR at the merch desk to pick up.',
 '現場領取：生日會當天，到周邊服務台出示票券 QR 領取。':'Event pickup: on the day, show your ticket QR at the merch desk to pick up.',
 '周邊：生日會當天，到周邊服務台出示票券 QR 領取。':'Merch: on the day, show your ticket QR at the merch desk to pick up.',
 '有買周邊的人，生日會當天 13:20 起，到周邊服務台出示票券 QR 領取。':'If you bought merch: on the day from 13:20, show your ticket QR at the merch desk to pick up.',
 '周邊為預購商品，生日會當天到周邊服務台出示票券 QR 領取。依消費者保護法，收到商品前可隨時來信取消並全額退款；收到商品後 7 日內（現場領取以活動當天起算）可申請退貨退款。':'Merch is pre-order. On the day, show your ticket QR at the merch desk to pick up. Under Taiwan consumer law you can cancel for a full refund by email before receiving it, and request a return within 7 days after receiving it (for event pickup, counted from the event day).',
 /* B563T：A3 海報組可以現場領或寄送；入口只寫「單買周邊」 */
 '商品圖片為示意圖。A3 海報組可以現場領取或寄送，買票時也可以直接加購。':'Images are for illustration. The A3 poster set can be picked up at the event or shipped; you can also add it when buying a ticket.',
 '單買周邊 ›':'Buy merch only ›','單買周邊':'Buy merch only',
 /* B563T：商品名有空格、沒空格都翻 */
 'A3 海報組＋6 號小卡組合':'A3 poster set + No. 6 photo card bundle','A3 海報組＋6 號小卡':'A3 poster set + No. 6 photo card','A3 海報組 ＋ 6 號小卡':'A3 poster set + No. 6 photo card','A3 海報組 ＋ 6號小卡':'A3 poster set + No. 6 photo card','A3 海報組 ＋ 6 號小卡組合':'A3 poster set + No. 6 photo card bundle','A3 海報組 ＋ 6號小卡組合':'A3 poster set + No. 6 photo card bundle','6 號小卡':'No. 6 photo card',
 /* B563T：畫面叫「我的票」（不再寫票夾）；按鈕叫「出示 QR」 */
 '收進我的票':'Saved to My tickets','票會寄到這個 email，也會存進「我的票」':'Your ticket is emailed to this address and saved in My tickets',
 '最後一步：收進「我的票」':'Last step: add it to My tickets','收進「我的票」':'Add to My tickets','找不到你的 email，請到「我的票」登入':'We couldn’t find your email. Please sign in from My tickets.',
 '活動後照片整理好會出現在我的票 → 過往 → 這場票根裡。':'After the event, your photos will appear in My tickets → Past → this ticket stub.',
 '你的票已收進「我的票」':'Your ticket is in My tickets','入場 QR 在「我的票」裡。':'Your entry QR is in My tickets.',
 '這筆付款已經確認，但出票延遲，主辦會盡快補發到「我的票」和你的信箱。請不要重新購買。':'Your payment is confirmed but the ticket is delayed. The organizer will issue it to My tickets and your email as soon as possible. Please do not buy again.',
 '票券一進來就會出現在「我的票」。請按「重新確認」，不需要重新購買。':'Your ticket will appear in My tickets as soon as it is ready. Tap “Check again” — no need to buy again.',
 '這張票已經不在「我的票」裡（可能已轉讓給朋友）。':'This ticket is no longer in My tickets (it may have been transferred).',
 '入場憑 App「我的票」或門票信裡的入場 QR，給工作人員掃描即完成入場。':'Enter with the QR code in My tickets in the app or in your ticket email; staff scan it at the entrance.',
 '票券可在「我的票」用「轉讓給朋友」換人。':'You can pass the ticket to someone else with “Transfer to a friend” in My tickets.',
 '入場出示 App「我的票」或門票信裡的 QR；手機無法顯示時，可報購買姓名＋手機後 4 碼核對':'Show the QR in My tickets in the app or in your ticket email at the door. If your phone can’t show it, give the buyer’s name and the last 4 digits of the phone number.',
 '生日牆合照需另外加購 PhotoPass NT$390（買票後在「我的票」加購）；由官方攝影師拍攝，自己的合格成片全數下載。':'The birthday-wall photo needs the PhotoPass add-on, NT$390 (add it in My tickets after you buy a ticket). The official photographer takes it, and you can download all of your approved shots.',
 '，也會存進「我的票」':' and saved in My tickets.','已收進「我的票」':'Saved to My tickets','購票後出示 QR，由工作人員掃碼':'After purchase, show your QR for staff to scan',
 '・購票成功後，入場 QR 會立即出現在「我的票」，也會附在門票信裡':'・Right after purchase, your entry QR appears in My tickets and is attached to your ticket email',
 /* B563T：轉讓（給朋友、收朋友的票、錯誤訊息）整段補英文 */
 '開演後 2 小時不能轉讓了':'Transfers are closed: it is more than 2 hours after the start.','開演後 2 小時已無法轉讓':'Transfers are closed: it is more than 2 hours after the start.','現在不能轉讓':'This ticket can’t be transferred right now.',
 '讓朋友掃這個':'Let your friend scan this','朋友打開 CHANCE app → 我的票 →':'Your friend opens the CHANCE app → My tickets →','＋ 加入票券':'+ Add ticket',
 '，用相機掃這個，或輸入下面的代碼。10 分鐘內有效，收下後票就是他的、你的 QR 立刻失效。':', then scans this with the camera or enters the code below. Valid for 10 minutes. Once they accept, the ticket is theirs and your QR stops working right away.',
 '轉讓代碼':'Transfer code','複製轉讓連結':'Copy transfer link','先關閉（轉讓仍有效）':'Close for now (the transfer stays active)','已過期，請重新產生':'Expired. Please create a new one.',
 '票已經是朋友的了':'The ticket now belongs to your friend',
 '這個轉讓連結已失效':'This transfer link is no longer valid','代碼不對或已過期':'That code is wrong or has expired','請對方重新產生一次（每次只有 10 分鐘）。':'Ask your friend to create a new one (each one lasts only 10 minutes).','再試一次':'Try again',
 '接受這張票':'Accept this ticket','登入並接受':'Sign in and accept','有人要把票給你':'Someone is giving you a ticket','先不要':'Not now',
 '這張票本來就是你的':'This ticket is already yours','這張票已經是你的':'This ticket is already yours','轉讓已失效，請對方重新產生':'This transfer has expired. Ask your friend to create a new one.','轉讓連結已失效，請對方重新產生':'This transfer link is no longer valid. Ask your friend to create a new one.',
 '轉讓已被取消或已完成':'This transfer was cancelled or has already been completed.','這場已經結束了':'This event has already ended.','輸錯太多次，10 分鐘後再試':'Too many wrong tries. Please try again in 10 minutes.','接受失敗':'We couldn’t accept the ticket. Please try again.',
 '這張票是你的了':'This ticket is now yours','入場時到 SHOP → 我的票 出示 QR。':'At the door, open SHOP → My tickets and show the QR.','看我的票':'View my tickets','轉給朋友':'Transfer to a friend',
 '加入票券':'Add a ticket','朋友要把票轉給你？掃他螢幕上的轉讓 QR，或輸入他給你的 6 位代碼。':'Is a friend giving you a ticket? Scan the transfer QR on their screen, or enter the 6-character code they gave you.',
 '📷 相機':'📷 Camera','⌨️ 輸入代碼':'⌨️ Enter code','正在開啟相機…':'Opening the camera…','對準朋友螢幕上的 QR':'Point at the QR on your friend’s screen','收下這張票':'Accept this ticket',
 '相機權限被拒 → 改用「輸入代碼」，或到 iPhone 設定→Safari→相機 開權限':'Camera access was denied. Use “Enter code” instead, or allow it in iPhone Settings → Safari → Camera.',
 '這台手機開不了相機，改用「輸入代碼」':'This phone can’t open the camera. Use “Enter code” instead.','載入相機…':'Loading the camera…','相機元件載入失敗，改用「輸入代碼」':'The camera couldn’t load. Use “Enter code” instead.',
 '這是入場 QR，不是轉讓 QR':'This is an entry QR, not a transfer QR','看不懂這個 QR':'We can’t read this QR','代碼是 6 位（沒有 0 和 O、1 和 I）':'The code has 6 characters (no 0, O, 1 or I).',
 '＋ 加入票券（朋友轉給你的票）':'+ Add ticket (one a friend is giving you)',
 /* B563T（後台 m73）：寄驗證碼／登入 */
 '這個網路寄太多次驗證碼了，請過 10 分鐘再試。':'Too many codes were requested from this network. Please try again in 10 minutes.','這個網路試太多次了，請過 10 分鐘再試。':'Too many sign-in attempts from this network. Please try again in 10 minutes.','系統忙線中，請稍後再試。':'The system is busy. Please try again in a moment.',
 '一分鐘內只能寄一次，等一下再按':'You can send one code per minute. Please wait a moment.','一分鐘內只能寄一次，稍等再按':'You can send one code per minute. Please wait a moment.','寄不出去，再試一次':'We could not send the code. Please try again.',
 '驗證碼是 6 位數':'The code has 6 digits.','驗證碼過期了，再寄一次':'That code has expired. Please send a new one.','驗證碼過期了，按重寄':'That code has expired. Tap Resend.','驗證碼不對':'That code is not right.','連不上伺服器':'Can’t reach the server. Please try again.',
 /* B563T（後台 m73）：後台原文直接顯示的錯誤訊息 */
 '請先用買票的 email 登入，再買 A3 海報組。還沒建立付款，不會扣款。':'Please sign in with the email you bought your ticket with, then buy the A3 poster set. No payment was created — you were not charged.',
 '周邊每張票可加購 1 組，請調整數量。還沒建立付款，不會扣款。':'You can add 1 merch set per ticket. Please adjust the quantity. No payment was created — you were not charged.',
 'A3 海報組要有生日會門票才能買（每張票 1 組）。還沒建立付款，不會扣款。':'You need a birthday party ticket to buy the A3 poster set (1 set per ticket). No payment was created — you were not charged.',
 'A3 海報組要有生日會門票才能買（每張票 1 組）。這個 Email 目前沒有門票。還沒建立付款，不會扣款。':'You need a birthday party ticket to buy the A3 poster set (1 set per ticket). This email has no ticket right now. No payment was created — you were not charged.',
 '你選的座位剛被別人選走了，請重新選位。還沒建立付款，不會扣款。':'The seat you chose was just taken. Please choose again. No payment was created — you were not charged.',
 '請先登入再選位。還沒建立付款，不會扣款。':'Please sign in before choosing seats. No payment was created — you were not charged.',
 '手機條碼格式不對：/ 開頭，共 8 碼。還沒建立付款，不會扣款。':'That mobile barcode is not valid: it starts with / and has 8 characters. No payment was created — you were not charged.',
 '統一編號要 8 碼數字。還沒建立付款，不會扣款。':'The company tax ID must be 8 digits. No payment was created — you were not charged.',
 '捐贈碼是 3 到 7 碼數字。還沒建立付款，不會扣款。':'The donation code is 3 to 7 digits. No payment was created — you were not charged.',
 '請輸入正確的手機號碼':'Please enter a valid mobile number.','票務系統暫時無法連線，請稍後再試':'The ticket system is temporarily unavailable. Please try again later.',
 '這場活動已經結束':'This event has already ended.','請選擇票種':'Please choose a ticket type.','生日牆合照尚未開賣':'The birthday-wall photo is not on sale yet.','你已經加購過生日牆合照了':'You have already added the birthday-wall photo.','PhotoPass 尚未開賣':'PhotoPass is not on sale yet.','你已經買過這場的 PhotoPass 了':'You already have the PhotoPass for this event.',
 '這場活動沒有周邊':'This event has no merch.','周邊預購已截止':'Merch pre-orders have closed.','周邊尚未開賣':'Merch is not on sale yet.',
 '訂單資料過期了，請重新填寫':'Your order details have expired. Please fill them in again.','email 跟填寫時不一樣，請重新填寫':'The email is different from the one you entered. Please fill in the form again.','這個國家／地區目前無法寄送':'We can’t ship to this country / region right now.',
 '找不到這場活動':'We couldn’t find this event.','請填姓名和手機（訂單聯絡用）':'Please enter your name and mobile number (so we can contact you about the order).','請填姓名和手機（現場領取核對用）':'Please enter your name and mobile number.','目前不提供寄送':'Shipping is not available right now.',
 '請填完整收件人、電話、地址':'Please enter the recipient, phone number and full address.','請填郵遞區號':'Please enter the postal code.','已完售':'Sold out',
 '無法建立訂單，請稍後再試':'We couldn’t create the order. Please try again later.','付款頁開不起來，請稍後再試':'The payment page couldn’t open. Please try again later.','請先選擇票種。':'Please choose a ticket type first.','前往綠界付款…':'Going to ECPay…',
 '訂單聯絡用':'So we can contact you about your order','請填姓名（訂單聯絡用）':'Please enter your name (so we can contact you about the order).'
 });
 const MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], WK={'日':'Sun','一':'Mon','二':'Tue','三':'Wed','四':'Thu','五':'Fri','六':'Sat'};
 const enDay=(m,d,w)=>(WK[w]||w)+', '+MON[(+m-1)%12]+' '+d;
 const enTime=t=>{const [h,mi]=t.split(':').map(Number);return ((h%12)||12)+':'+String(mi).padStart(2,'0')+(h<12?' AM':' PM');};
 const enList=s=>s.split('、').map(x=>D[x.trim()]||x.trim()).join(', ');
 const rules=[
 /* B563T（CÉON 11/14）：英文補齊——信的封數、名額、預購日期、周邊領取、轉讓、後台帶數字的訊息 */
 [/^每月只收 ?(\d+) ?封，月底前他會親自讀完。$/,(_,n)=>'Only '+n+' letters a month. He reads every one himself by month’s end.'],
 [/^每月只收 ?(\d+) ?封，月底前親自讀完。$/,(_,n)=>'Only '+n+' letters a month, read by Chance himself by month’s end.'],
 [/^(\d+) 名$/,(_,n)=>n+' people'],
 [/^預購至 (\d+)\/(\d+)$/,(_,m,d)=>'Pre-order until '+m+'/'+d],
 [/^，(\d+)\/(\d+) 生日會當天，到周邊服務台出示票券 QR 領取(（含一對一 60 秒）)?。$/,(_,m,d,x)=>', '+m+'/'+d+': on the day, show your ticket QR at the merch desk to pick up'+(x?' (includes the 60-second one-to-one)':'')+'.'],
 [/^(\S+) 已轉出，你這邊的 QR 已失效。$/,(_,a)=>a+' has been transferred. Your QR no longer works.'],
 [/^(.+) 要把「(.+)」的票轉給你。$/,(_,a,n)=>a+' wants to give you a ticket to '+(D[n]||n)+'.'],
 [/^(\d+)\/(\d+)（([日一二三四五六])）(\d+:\d+) · (.+)$/,(_,m,d,w,t,v)=>enDay(m,d,w)+' · '+enTime(t)+' Taipei time · '+(D[v]||v)],
 [/^轉給 (.+?)(?:・(.+))?$/,(_,a,b)=>'Transferred to '+(a==='朋友'?'a friend':a)+(b?' · '+b:'')],
 [/^驗證碼已寄到 (\S+)，沒看到請找垃圾信件$/,(_,e)=>'Code sent to '+e+'. Check your spam folder if you do not see it.'],
 [/^剩下的票不夠 (\d+) 張（還剩 (\d+) 張）。還沒建立付款，不會扣款。$/,(_,n,m)=>'There are not '+n+' tickets left (only '+m+' left). No payment was created — you were not charged.'],
 [/^請先選好 (\d+) 個座位。還沒建立付款，不會扣款。$/,(_,n)=>'Please choose '+n+(n==='1'?' seat':' seats')+' first. No payment was created — you were not charged.'],
 [/^每個帳號這場最多 (\d+) 張，你已經有 (\d+) 張（含付款中的訂單）(?:，這次最多再買 (\d+) 張)?。還沒建立付款，不會扣款。$/,(_,m,h,k)=>'Up to '+m+' tickets per account for this event. You already have '+h+' (unpaid orders count)'+(k?', so you can buy up to '+k+' more this time':'')+'. No payment was created — you were not charged.'],
 [/^每個帳號這場最多 (\d+) 張（含付款中的訂單）。還沒建立付款，不會扣款。$/,(_,m)=>'Up to '+m+' tickets per account for this event (unpaid orders count). No payment was created — you were not charged.'],
 [/^每張門票可買 1 組 A3 海報組，你還可以買 (\d+) 組。還沒建立付款，不會扣款。$/,(_,n)=>'One A3 poster set per ticket. You can buy '+n+' more. No payment was created — you were not charged.'],
 [/^每張門票可買 1 組 A3 海報組，你的 (\d+) 張票都已經買過了。還沒建立付款，不會扣款。$/,(_,n)=>'One A3 poster set per ticket. '+(n==='1'?'Your ticket already has one.':'All '+n+' of your tickets already have one.')+' No payment was created — you were not charged.'],
 [/^數量要在 1–(\d+) 之間$/,(_,n)=>'The quantity must be between 1 and '+n+'.'],
 [/^(.+) 每人限購 1 份，你已經買過了$/,(_,a)=>(D[a]||a)+': limit 1 per person, and you have already bought it.'],
 [/^(.+) 已售完$/,(_,a)=>(D[a]||a)+' is sold out.'],
 [/^(.+) 已完售$/,(_,a)=>(D[a]||a)+' is sold out.'],
 /* B335T：票夾數量句 */
 [/^NT\$(\d+) · 每人每月 (\d+) 封$/,(_,a,n)=>'NT$'+a+' · '+n+' letters per person each month'],
 [/^NT\$(\d+) · 每人每月一封$/,(_,a)=>'NT$'+a+' · One letter per person each month'],
 [/^點一下看全部 (\d+) 張的 QR$/,(_,n)=>'Tap to see all '+n+' QR codes'],
 [/^(.+)・共 (\d+) 張$/,(_,a,n)=>a+' · '+n+' tickets'],
 [/^共 (\d+) 張$/,(_,n)=>n+' tickets'],
 [/^已轉讓 (\d+) 張$/,(_,n)=>n+' transferred'],
 [/^已入場 (\d+) 張$/,(_,n)=>n+' used'],
 [/^(.+)・(\d+) 筆訂單$/,(_,a,n)=>translate(a)+' · '+n+' orders'],
 [/^(\d+) 張轉讓中$/,(_,n)=>n+' transferring'],
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
 [/^合照加購限 1 張票，已留下 (\S+)$/,(_,a)=>'The photo add-on is for one ticket, so only '+a+' was kept.'],
 [/^(.+) 剛被選走了，請重新選位。還沒建立付款，不會扣款。$/,(_,a)=>a+' was just taken. Please choose again. No payment was created.'],
 [/^演出日前 20 日（(.+)）前可申請退票，酌收票面金額 10% 手續費$/,(_,d)=>'Refunds available until 20 days before the show ('+d+'), with a fee of 10% of the ticket price.'],
 [/^演出日前 20 日前可申請退票，酌收票面金額 10% 手續費$/,()=>'Refunds available until 20 days before the show, with a fee of 10% of the ticket price.'],
 [/^演出日前 20 日(?:（(.+)）)?前可申請退票，酌收票面金額 10% 手續費；活動取消或其他不可歸責於消費者的情形，全額退款、不收手續費。$/,(_,d)=>'Refunds available until 20 days before the show'+(d?' ('+d+')':'')+', with a fee of 10% of the ticket price. If the event is cancelled or in other situations not attributable to the buyer, you get a full refund with no fee.'],
 [/^演出日前 20 日(?:（(.+)）)?前可申請退票，手續費為票面金額 10%。$/,(_,d)=>'Refunds are available until 20 days before the show'+(d?' ('+d+')':'')+', with a fee of 10% of the ticket price.'],
 [/^演出日前 20 日(?:（(.+)）)?前可申請退票，手續費為票價 10%；逾期恕不退票，可用票夾「轉讓給朋友」換人。$/,(_,d)=>'Refunds are available until 20 days before the show'+(d?' ('+d+')':'')+', with a 10% fee. After that, no refunds, but you can transfer the ticket to a friend from your ticket wallet.'],
 [/^終身編號依付款完成順序配發（No\.(\d+)–(\d+)）$/,(_,a,b)=>'Lifetime numbers are assigned in order of payment (No.'+a+'–'+b+').'],
 [/^（(NT\$[\d,]+)，編號 (\d+)–(\d+)）：(.*)$/,(_,p,a,b,l)=>' ('+p+', No.'+a+'–'+b+'): '+enList(l)],
 [/^(所有入場者共享|全票種共享)：(.*)$/,(_,k,l)=>(k==='全票種共享'?'Included with every ticket type: ':'Included for everyone: ')+enList(l)],
 [/^入場憑 App 票夾的入場 QR，開場前 (\d+) 小時出現，給工作人員掃描即完成入場。$/,(_,h)=>'Enter with the QR code in your App ticket wallet. It appears '+h+' hours before doors open; staff scan it at the entrance.'],
 [/^前往付款 (NT\$[\d,]+)$/,(_,p)=>'Continue to payment '+p],
 [/^驗證碼已寄到 (\S+)（5 分鐘內有效），沒看到請找垃圾信件$/,(_,e)=>'Code sent to '+e+'. It is valid for 5 minutes. Check your spam folder if you do not see it.'],
 [/^(NT\$[\d,]+)／張$/,(_,p)=>p+' each'],
 [/^(\d\d:\d\d) 開始$/,(_,a)=>'Starts '+a],
 [/^從第一次點座位起 10 分鐘內要按「前往付款」（看下方倒數）；按下後請在 (\d+) 分鐘內完成付款，請留在付款頁、不要關閉。超過時間要重新選位。$/,(_,n)=>'Tap Continue to payment within 10 minutes of your first seat tap (see the countdown below). Then finish paying within '+n+' minutes and stay on the payment page. If time runs out, choose your seats again.'],
 [/^按「前往付款」後，請在 (\d+) 分鐘內完成付款；逾時未完成付款，座位會開放給其他人。$/,(_,n)=>'After you tap Continue to payment, finish paying within '+n+' minutes. If you do not pay in time, your seat goes back on sale.'],
 [/^座位保留中，還沒完成購買。按「前往付款」後保留 (\d+) 分鐘；超過時間要重新選位。$/,(_,n)=>'Held for you. This is not a completed purchase. After you tap Continue to payment, it is held for '+n+' minutes; if time runs out, choose your seats again.'],
 [/^手機末 4 碼 (\d+)$/,(_,a)=>'Phone ending '+a],
 [/^(.+) 這個位置剛被選走了，再挑一個喜歡的位置吧。還沒建立付款，不會扣款。$/,(_,a)=>a+' was just taken. Pick another seat you like. No payment was created.'],
 [/^(.+) 這些位置剛被選走了，再挑一個喜歡的位置吧。還沒建立付款，不會扣款。$/,(_,a)=>a+' were just taken. Pick another seat you like. No payment was created.'],
 [/^下一步 (NT\$[\d,]+)$/,(_,p)=>'Next '+p],
 [/^(.+) 還沒開賣。留下 email 拿到排隊號碼，$/,(_,n)=>(D[n]||n)+' is not on sale yet. Leave your email to receive a waitlist number. '],
 [/^同一個 email 只會有一個號碼；(\d+) 席數量有限，收到通知請盡快購買。$/,(_,n)=>'One waitlist number per email. '+n+' seats are available; purchase promptly after receiving your invitation.'],
 [/^你是第 (\d+) 位$/,(_,n)=>'Your waitlist number: '+n],
 [/^NT\$(.+) \/ 包$/,(_,n)=>'NT$'+n+' / pack'],
 [/^台灣免運・海外 (.+)$/,(_,n)=>'Free in Taiwan · International '+n],
  /* B490T：卡包台灣運費 80（後台給的金額） */
  [/^台灣運費 (NT\$[\d,]+)$/,(_,n)=>'Taiwan shipping '+n],
  [/^· 台灣運費 (NT\$[\d,]+)$/,(_,n)=>'· Taiwan shipping '+n],
  [/^台灣運費 (NT\$[\d,]+)・海外 (.+)$/,(_,a,b)=>'Taiwan shipping '+a+' · International '+b],
  [/^付款後 7 個工作天內寄出・台灣運費 (NT\$[\d,]+)$/,(_,n)=>'Ships within 7 business days of payment · Taiwan shipping '+n],
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
