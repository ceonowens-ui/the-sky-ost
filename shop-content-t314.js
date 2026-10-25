/* B314T · SHOP 首頁顯示內容（只給 test.html；正式站不讀這個檔）
   這裡只放「顯示用」的文字、圖片、開關、順序。
   價格、庫存、販售狀態、活動日期／地點／名額 一律以後台為準（/ticket/events、/shop/items），
   改這個檔不會改到任何金額或能不能買。
   換圖：改 img 路徑。換字：改 zh／en。藏起一張卡：show 改 false。換順序：改 order。 */
window.SHOP_T314 = {
  order: ["event", "letters", "pack"],
  title: { zh: "SHOP", en: "SHOP" },
  cards: {
    event: {
      show: true,
      img: "shop-assets/portrait.jpg",
      imgPos: "50% 18%"
    },
    letters: {
      show: true,                       /* 也要 LETTERS_CFG.on 才會出現 */
      img: "shop-assets/feature-letters.svg",
      name: { zh: "寫給 Chance 的信", en: "A letter to Chance" },
      line: { zh: "每月只收二十封，月底前他會親自讀完。", en: "Only 20 letters a month. He reads every one himself." },
      cta:  { zh: "寫一封信", en: "Write a letter" }
    },
    pack: {
      show: true,
      img: "",                          /* 留空＝用後台 /shop/items 的商品圖 */
      name: { zh: "", en: "" },         /* 留空＝用後台商品名 */
      line: { zh: "", en: "" },         /* 留空＝自動寫運費（台灣免運・海外 NT$…） */
      cta:  { zh: "購買", en: "Buy" }
    }
  },
  info: {
    title: { zh: "配送與購買須知", en: "Delivery & purchase terms" }
  }
};
