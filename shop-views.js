/* Presentation only: no authentication, payment, QR, ownership or API mutation. */
(function () {
  'use strict';
  var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});};
  function cfg(){return window.THE_SKY_SHOP||{};}
  function artWindow(file,box,label){
    return '<svg class="sv-art-window" viewBox="'+box+'" preserveAspectRatio="xMidYMid slice" role="img" aria-label="'+esc(label)+'"><image href="'+esc(file)+'" width="853" height="1844"/></svg>';
  }
  function art(i,detail){
    var generated=cfg().artEdition==='generated'||/[?&]shopart=generated(?:&|$)/.test(location.search);
    if(i.concept&&i.art==='photo'&&generated) return '<img class="sv-generated-photo" src="'+esc(cfg().assets.photo)+'" alt="THE SKY 寫真組合概念美術">';
    if(i.concept&&i.art==='photo'&&detail) return artWindow('references/collectible-detail.png','0 105 853 740','THE SKY 寫真組合概念美術');
    var boxes={tee:'24 754 402 847',card:'446 730 380 348',photo:'446 1233 380 366'};
    if(i.concept&&boxes[i.art]) return artWindow('references/merch-archive.png',boxes[i.art],i.name+' 概念美術');
    return i.img?'<img src="'+esc(i.img)+'" alt="'+esc(i.name)+'" loading="lazy">':'<span class="sv-art-fallback">THE SKY<br><small>圖片尚未提供</small></span>';
  }
  function motif(){return '<div class="sv-poem" aria-hidden="true">MUSIC<br>LIVES<br>BEYOND<br>THE<br>MOMENT</div><div class="sv-sign" aria-hidden="true"><i>The<br>Sky</i><small>A<br>HIGHER<br>VERSION<br>OF<br>US</small></div>';}
  function svgIcon(kind){var paths={photos:'<path d="M5 7 22 5l2 24-17 2zM16 3l15 4-4 21"/>',video:'<path d="M6 6h27v25H6zM6 9H1v18h5"/><path d="m18 13 7 5-7 5z"/>',certificate:'<path d="M5 3h25v23M5 3v29h15M10 10h14M10 16h14M10 22h8M23 32v-8a4 4 0 0 1 8 0v8l-4-3z"/>',check:'<circle cx="18" cy="18" r="15"/><path d="m9 18 6 6 12-13"/>'};return '<svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">'+(paths[kind]||paths.certificate)+'</svg>';}
  function filterButton(key,label,items,current){var n=items.filter(function(i){return key==='all'||(key==='owned'?i.owned:i.type===key);}).length;return '<button data-act="filter" data-filter="'+key+'" aria-pressed="'+(current===key)+'">'+label+' <span>'+n+'</span></button>';}
  function merch(p){
    var filters=[['all','全部'],['physical','實體收藏'],['digital','數位特典']];
    // Keep the existing useful owned-only filter for the actual catalogue.
    if(!p.items.every(function(i){return i.concept;}))filters.push(['owned','已收藏']);
    var list=p.items.filter(function(i){return p.filter==='all'||(p.filter==='owned'?i.owned:i.type===p.filter);});
    var h='<div class="sv-page sv-merch">'+p.bar+'<header class="sv-merch-hero"><p class="sv-eyebrow">OWNED BY YOU</p><h1>'+esc(cfg().title||'周邊收藏')+'</h1><p class="sv-subtitle">'+esc(cfg().subtitle)+'</p>'+motif()+'</header>';
    h+='<div class="sv-filters" role="group" aria-label="收藏分類">'+filters.map(function(f){return filterButton(f[0],f[1],p.items,p.filter);}).join('')+'</div>';
    h+='<div class="sv-gallery'+(list.length===3&&p.filter==='all'?' sv-masonry':'')+'">'+list.map(function(i){var index=p.items.indexOf(i)+1;return '<article class="sv-product sv-product-'+esc(i.art||i.type)+'"><button class="sv-product-link" data-act="open-detail" data-key="'+esc(i.key)+'" aria-label="查看 '+esc(i.name)+'"><div class="sv-product-number"><b>'+String(index).padStart(2,'0')+'</b><span></span><small>'+esc(i.code||'THE SKY')+'</small></div><div class="sv-product-art">'+art(i,false)+'</div><div class="sv-product-caption"><h2>'+esc(i.name)+'</h2><p>'+esc(i.label)+'</p><small>THE SKY<span></span></small></div></button>'+p.itemBtn(i)+'</article>';}).join('')+'</div>';
    if(!list.length)h+='<div class="tk-empty">這個分類還沒有收藏品。<br>到「全部」探索你的下一件收藏。</div>';
    h+='<footer class="sv-archive-footer"><span></span>'+String(p.items.filter(function(i){return i.owned;}).length).padStart(2,'0')+' PIECES IN YOUR ARCHIVE<span></span></footer>'+p.notice+'</div>';
    return h;
  }
  function detail(p){
    var i=p.item,photo=i.concept&&i.art==='photo',title=photo?cfg().photoTitle:i.name;
    var contents=i.benefits&&i.benefits.length?i.benefits:[i.type==='physical'?'實體收藏':'數位收藏'];
    var h='<div class="sv-page sv-detail">'+p.bar+'<div class="sv-detail-art '+(photo?'sv-detail-photo':'')+'">'+art(i,true)+'</div><div class="sv-detail-copy"><p class="sv-eyebrow">'+esc(i.concept?'LIMITED EDITION · '+i.code:'THE SKY · PRIVATE ARCHIVE')+'</p><h1>'+esc(title)+'</h1><p class="sv-detail-subtitle">'+esc(photo?cfg().photoSubtitle:i.label)+'</p>';
    h+='<section class="sv-ownership">'+svgIcon('check')+'<div><h2>'+esc(i.owned?'已收藏':i.sold?'已售完':i.soon?'即將開賣':'尚未收藏')+'</h2><p>'+(i.owned?'收藏編號 '+esc(i.serial?(i.concept?i.serial:'No.'+('0'+i.serial).slice(-2)):i.order||'—'):(i.price?'NT$'+esc(i.price):'登入後確認你的收藏'))+'</p><p class="sv-muted">'+esc(i.concept?'THE SKY PRIVATE ARCHIVE 設計示範':i.owned?'THE SKY PRIVATE ARCHIVE':p.dropLabel(i))+'</p></div><aside>THE SKY<br>PRIVATE<br>ARCHIVE<span></span></aside></section>';
    h+='<h2 class="sv-section-title">收藏內容<span></span></h2><div class="sv-contents">'+contents.map(function(b,n){return '<div>'+svgIcon(n===0?'photos':n===1?'video':'certificate')+'<p>'+esc(b)+'</p></div>';}).join('')+'</div>';
    if(i.owned){h+='<h2 class="sv-section-title">'+(i.type==='digital'||i.benefits.length?'解鎖內容':'收藏資訊')+'<span></span></h2><p class="sv-unlock-copy">'+esc(i.desc||(i.type==='physical'?'配送進度與訂單資訊請查看下方說明。':'使用同一帳號即可開啟已解鎖內容。'))+'</p>';
      if(i.concept)h+='<button class="sv-primary" data-act="preview-benefit">查看數位特典<span aria-hidden="true">›</span></button>';
      else if(i.go)h+='<button class="sv-primary" data-act="goto" data-go="'+esc(i.go)+'">查看數位特典<span aria-hidden="true">›</span></button>';
      h+='<button class="sv-text-button" data-act="order" data-key="'+esc(i.key)+'">配送與訂單資訊 <span aria-hidden="true">›</span></button>';
    }else{h+='<div class="sv-purchase">'+p.itemBtn(i)+'</div>';if(i.limited)h+='<p class="sv-unlock-copy">全球 '+esc(i.limited)+' 件</p>';}
    return h+'</div>'+p.notice+'</div>';
  }
  window.TheSkyShopViews={merch:merch,detail:detail,art:art,escape:esc};
})();
