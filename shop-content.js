/* Edit presentation here. Real prices, ownership and ticket data remain in ALBUM_CONFIG / API.
   demoItems are used ONLY with BOTH ?tkdemo=1&shopdemo=design. Never write them to storage. */
window.THE_SKY_SHOP = {
  title: '周邊收藏',
  subtitle: '收藏你與 THE SKY 的每一個瞬間。',
  photoTitle: 'THE SKY PHOTO SET',
  photoSubtitle: '限量寫真收藏',
  // 'reference': original art windows; 'generated': separately generated replacement assets.
  artEdition: 'reference',
  assets: {
    portrait: 'shop-assets/portrait.jpg',
    birthday: 'shop-assets/generated/birthday-portrait.jpg',
    ticket: 'shop-assets/generated/ticket-paper.jpg',
    photo: 'shop-assets/generated/photo-set.jpg'
  },
  demoItems: [
    {key:'concept-tee',name:'THE SKY Tee',type:'physical',label:'實體收藏',art:'tee',code:'TS-001',owned:true,serial:'001 / 500',order:'DEMO-001',benefits:[],desc:'THE SKY 限量服飾收藏。',go:null,concept:true},
    {key:'concept-card',name:'Chance Card',type:'digital',label:'數位特典',art:'card',code:'TS-002',owned:true,serial:'002 / 500',order:'DEMO-002',benefits:['專屬數位特典'],desc:'收藏屬於你的 THE SKY 時刻。',go:null,concept:true},
    {key:'concept-photo',name:'Photo Set',type:'physical',label:'限量周邊',art:'photo',code:'TS-003',owned:true,serial:'TS-003 / 500',order:'DEMO-003',benefits:['3 張實體寫真','1 份專屬數位特典','收藏證明'],desc:'收藏後即可開啟專屬影像與幕後內容。',go:null,concept:true}
  ]
};
