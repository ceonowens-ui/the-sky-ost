/* ticket-ui.js v7 — THE SKY COLLECTION：三票種＋退票＋確認卡＋付款回票夾＋加入票券＋PhotoPass */
/*! QRious v4.0.2 | (C) 2017 Alasdair Mercer | GPL v3 License
Based on jsqrencode | (C) 2010 tz@execpc.com | GPL v3 License
*/

/* ════════════════════════════════════════════════════════
   ✏️ SHOP 首頁文字設定（直接改這裡，不用動下面程式）
   活動名稱／日期／票價／席次 從 Worker 場次資料即時讀，不在這改
   ════════════════════════════════════════════════════════ */
var SHOP_TEXT = {
  brand:     "THE SKY — PRIVATE ARCHIVE",
  title:     "你的收藏",
  subtitle:  "票券與周邊，各自收好。",
  sideEn:    ["MUSIC","LIVES","BEYOND","THE","MOMENT"],
  sideZh:    "收藏不只是擁有｜而是與你的時間並肩。",
  higher:    ["A","HIGHER","VERSION","OF","US"],
  secTickets:"01 / TICKETS",
  secMerch:  "02 / MERCH ARCHIVE",
  merchTitle:"周邊收藏",
  goTickets: "立即購票",
  goRemind:  "即將開賣 · 設定提醒",
  goSoldOut: "已售完",
  goMine:    "查看我的票",
  goMerch:   "瀏覽收藏",
  assets: {
    portrait:  "shop-assets/portrait.jpg",
    signature: "shop-assets/signature.png",
    logo:      "shop-assets/ts-logo.png",
    merch:     "shop-assets/merch-cards.jpg"
  }
};

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t.QRious=e()}(this,function(){"use strict";function t(t,e){var n;return"function"==typeof Object.create?n=Object.create(t):(s.prototype=t,n=new s,s.prototype=null),e&&i(!0,n,e),n}function e(e,n,s,r){var o=this;return"string"!=typeof e&&(r=s,s=n,n=e,e=null),"function"!=typeof n&&(r=s,s=n,n=function(){return o.apply(this,arguments)}),i(!1,n,o,r),n.prototype=t(o.prototype,s),n.prototype.constructor=n,n.class_=e||o.class_,n.super_=o,n}function i(t,e,i){for(var n,s,a=0,h=(i=o.call(arguments,2)).length;a<h;a++){s=i[a];for(n in s)t&&!r.call(s,n)||(e[n]=s[n])}}function n(){}var s=function(){},r=Object.prototype.hasOwnProperty,o=Array.prototype.slice,a=e;n.class_="Nevis",n.super_=Object,n.extend=a;var h=n,f=h.extend(function(t,e,i){this.qrious=t,this.element=e,this.element.qrious=t,this.enabled=Boolean(i)},{draw:function(t){},getElement:function(){return this.enabled||(this.enabled=!0,this.render()),this.element},getModuleSize:function(t){var e=this.qrious,i=e.padding||0,n=Math.floor((e.size-2*i)/t.width);return Math.max(1,n)},getOffset:function(t){var e=this.qrious,i=e.padding;if(null!=i)return i;var n=this.getModuleSize(t),s=Math.floor((e.size-n*t.width)/2);return Math.max(0,s)},render:function(t){this.enabled&&(this.resize(),this.reset(),this.draw(t))},reset:function(){},resize:function(){}}),c=f.extend({draw:function(t){var e,i,n=this.qrious,s=this.getModuleSize(t),r=this.getOffset(t),o=this.element.getContext("2d");for(o.fillStyle=n.foreground,o.globalAlpha=n.foregroundAlpha,e=0;e<t.width;e++)for(i=0;i<t.width;i++)t.buffer[i*t.width+e]&&o.fillRect(s*e+r,s*i+r,s,s)},reset:function(){var t=this.qrious,e=this.element.getContext("2d"),i=t.size;e.lineWidth=1,e.clearRect(0,0,i,i),e.fillStyle=t.background,e.globalAlpha=t.backgroundAlpha,e.fillRect(0,0,i,i)},resize:function(){var t=this.element;t.width=t.height=this.qrious.size}}),u=h.extend(null,{BLOCK:[0,11,15,19,23,27,31,16,18,20,22,24,26,28,20,22,24,24,26,28,28,22,24,24,26,26,28,28,24,24,26,26,26,28,28,24,26,26,26,28,28]}),l=h.extend(null,{BLOCKS:[1,0,19,7,1,0,16,10,1,0,13,13,1,0,9,17,1,0,34,10,1,0,28,16,1,0,22,22,1,0,16,28,1,0,55,15,1,0,44,26,2,0,17,18,2,0,13,22,1,0,80,20,2,0,32,18,2,0,24,26,4,0,9,16,1,0,108,26,2,0,43,24,2,2,15,18,2,2,11,22,2,0,68,18,4,0,27,16,4,0,19,24,4,0,15,28,2,0,78,20,4,0,31,18,2,4,14,18,4,1,13,26,2,0,97,24,2,2,38,22,4,2,18,22,4,2,14,26,2,0,116,30,3,2,36,22,4,4,16,20,4,4,12,24,2,2,68,18,4,1,43,26,6,2,19,24,6,2,15,28,4,0,81,20,1,4,50,30,4,4,22,28,3,8,12,24,2,2,92,24,6,2,36,22,4,6,20,26,7,4,14,28,4,0,107,26,8,1,37,22,8,4,20,24,12,4,11,22,3,1,115,30,4,5,40,24,11,5,16,20,11,5,12,24,5,1,87,22,5,5,41,24,5,7,24,30,11,7,12,24,5,1,98,24,7,3,45,28,15,2,19,24,3,13,15,30,1,5,107,28,10,1,46,28,1,15,22,28,2,17,14,28,5,1,120,30,9,4,43,26,17,1,22,28,2,19,14,28,3,4,113,28,3,11,44,26,17,4,21,26,9,16,13,26,3,5,107,28,3,13,41,26,15,5,24,30,15,10,15,28,4,4,116,28,17,0,42,26,17,6,22,28,19,6,16,30,2,7,111,28,17,0,46,28,7,16,24,30,34,0,13,24,4,5,121,30,4,14,47,28,11,14,24,30,16,14,15,30,6,4,117,30,6,14,45,28,11,16,24,30,30,2,16,30,8,4,106,26,8,13,47,28,7,22,24,30,22,13,15,30,10,2,114,28,19,4,46,28,28,6,22,28,33,4,16,30,8,4,122,30,22,3,45,28,8,26,23,30,12,28,15,30,3,10,117,30,3,23,45,28,4,31,24,30,11,31,15,30,7,7,116,30,21,7,45,28,1,37,23,30,19,26,15,30,5,10,115,30,19,10,47,28,15,25,24,30,23,25,15,30,13,3,115,30,2,29,46,28,42,1,24,30,23,28,15,30,17,0,115,30,10,23,46,28,10,35,24,30,19,35,15,30,17,1,115,30,14,21,46,28,29,19,24,30,11,46,15,30,13,6,115,30,14,23,46,28,44,7,24,30,59,1,16,30,12,7,121,30,12,26,47,28,39,14,24,30,22,41,15,30,6,14,121,30,6,34,47,28,46,10,24,30,2,64,15,30,17,4,122,30,29,14,46,28,49,10,24,30,24,46,15,30,4,18,122,30,13,32,46,28,48,14,24,30,42,32,15,30,20,4,117,30,40,7,47,28,43,22,24,30,10,67,15,30,19,6,118,30,18,31,47,28,34,34,24,30,20,61,15,30],FINAL_FORMAT:[30660,29427,32170,30877,26159,25368,27713,26998,21522,20773,24188,23371,17913,16590,20375,19104,13663,12392,16177,14854,9396,8579,11994,11245,5769,5054,7399,6608,1890,597,3340,2107],LEVELS:{L:1,M:2,Q:3,H:4}}),_=h.extend(null,{EXPONENT:[1,2,4,8,16,32,64,128,29,58,116,232,205,135,19,38,76,152,45,90,180,117,234,201,143,3,6,12,24,48,96,192,157,39,78,156,37,74,148,53,106,212,181,119,238,193,159,35,70,140,5,10,20,40,80,160,93,186,105,210,185,111,222,161,95,190,97,194,153,47,94,188,101,202,137,15,30,60,120,240,253,231,211,187,107,214,177,127,254,225,223,163,91,182,113,226,217,175,67,134,17,34,68,136,13,26,52,104,208,189,103,206,129,31,62,124,248,237,199,147,59,118,236,197,151,51,102,204,133,23,46,92,184,109,218,169,79,158,33,66,132,21,42,84,168,77,154,41,82,164,85,170,73,146,57,114,228,213,183,115,230,209,191,99,198,145,63,126,252,229,215,179,123,246,241,255,227,219,171,75,150,49,98,196,149,55,110,220,165,87,174,65,130,25,50,100,200,141,7,14,28,56,112,224,221,167,83,166,81,162,89,178,121,242,249,239,195,155,43,86,172,69,138,9,18,36,72,144,61,122,244,245,247,243,251,235,203,139,11,22,44,88,176,125,250,233,207,131,27,54,108,216,173,71,142,0],LOG:[255,0,1,25,2,50,26,198,3,223,51,238,27,104,199,75,4,100,224,14,52,141,239,129,28,193,105,248,200,8,76,113,5,138,101,47,225,36,15,33,53,147,142,218,240,18,130,69,29,181,194,125,106,39,249,185,201,154,9,120,77,228,114,166,6,191,139,98,102,221,48,253,226,152,37,179,16,145,34,136,54,208,148,206,143,150,219,189,241,210,19,92,131,56,70,64,30,66,182,163,195,72,126,110,107,58,40,84,250,133,186,61,202,94,155,159,10,21,121,43,78,212,229,172,115,243,167,87,7,112,192,247,140,128,99,13,103,74,222,237,49,197,254,24,227,165,153,119,38,184,180,124,17,68,146,217,35,32,137,46,55,63,209,91,149,188,207,205,144,135,151,178,220,252,190,97,242,86,211,171,20,42,93,158,132,60,57,83,71,109,65,162,31,45,67,216,183,123,164,118,196,23,73,236,127,12,111,246,108,161,59,82,41,157,85,170,251,96,134,177,187,204,62,90,203,89,95,176,156,169,160,81,11,245,22,235,122,117,44,215,79,174,213,233,230,231,173,232,116,214,244,234,168,80,88,175]}),d=h.extend(null,{BLOCK:[3220,1468,2713,1235,3062,1890,2119,1549,2344,2936,1117,2583,1330,2470,1667,2249,2028,3780,481,4011,142,3098,831,3445,592,2517,1776,2234,1951,2827,1070,2660,1345,3177]}),v=h.extend(function(t){var e,i,n,s,r,o=t.value.length;for(this._badness=[],this._level=l.LEVELS[t.level],this._polynomial=[],this._value=t.value,this._version=0,this._stringBuffer=[];this._version<40&&(this._version++,n=4*(this._level-1)+16*(this._version-1),s=l.BLOCKS[n++],r=l.BLOCKS[n++],e=l.BLOCKS[n++],i=l.BLOCKS[n],n=e*(s+r)+r-3+(this._version<=9),!(o<=n)););this._dataBlock=e,this._eccBlock=i,this._neccBlock1=s,this._neccBlock2=r;var a=this.width=17+4*this._version;this.buffer=v._createArray(a*a),this._ecc=v._createArray(e+(e+i)*(s+r)+r),this._mask=v._createArray((a*(a+1)+1)/2),this._insertFinders(),this._insertAlignments(),this.buffer[8+a*(a-8)]=1,this._insertTimingGap(),this._reverseMask(),this._insertTimingRowAndColumn(),this._insertVersion(),this._syncMask(),this._convertBitStream(o),this._calculatePolynomial(),this._appendEccToData(),this._interleaveBlocks(),this._pack(),this._finish()},{_addAlignment:function(t,e){var i,n=this.buffer,s=this.width;for(n[t+s*e]=1,i=-2;i<2;i++)n[t+i+s*(e-2)]=1,n[t-2+s*(e+i+1)]=1,n[t+2+s*(e+i)]=1,n[t+i+1+s*(e+2)]=1;for(i=0;i<2;i++)this._setMask(t-1,e+i),this._setMask(t+1,e-i),this._setMask(t-i,e-1),this._setMask(t+i,e+1)},_appendData:function(t,e,i,n){var s,r,o,a=this._polynomial,h=this._stringBuffer;for(r=0;r<n;r++)h[i+r]=0;for(r=0;r<e;r++){if(255!==(s=_.LOG[h[t+r]^h[i]]))for(o=1;o<n;o++)h[i+o-1]=h[i+o]^_.EXPONENT[v._modN(s+a[n-o])];else for(o=i;o<i+n;o++)h[o]=h[o+1];h[i+n-1]=255===s?0:_.EXPONENT[v._modN(s+a[0])]}},_appendEccToData:function(){var t,e=0,i=this._dataBlock,n=this._calculateMaxLength(),s=this._eccBlock;for(t=0;t<this._neccBlock1;t++)this._appendData(e,i,n,s),e+=i,n+=s;for(t=0;t<this._neccBlock2;t++)this._appendData(e,i+1,n,s),e+=i+1,n+=s},_applyMask:function(t){var e,i,n,s,r=this.buffer,o=this.width;switch(t){case 0:for(s=0;s<o;s++)for(n=0;n<o;n++)n+s&1||this._isMasked(n,s)||(r[n+s*o]^=1);break;case 1:for(s=0;s<o;s++)for(n=0;n<o;n++)1&s||this._isMasked(n,s)||(r[n+s*o]^=1);break;case 2:for(s=0;s<o;s++)for(e=0,n=0;n<o;n++,e++)3===e&&(e=0),e||this._isMasked(n,s)||(r[n+s*o]^=1);break;case 3:for(i=0,s=0;s<o;s++,i++)for(3===i&&(i=0),e=i,n=0;n<o;n++,e++)3===e&&(e=0),e||this._isMasked(n,s)||(r[n+s*o]^=1);break;case 4:for(s=0;s<o;s++)for(e=0,i=s>>1&1,n=0;n<o;n++,e++)3===e&&(e=0,i=!i),i||this._isMasked(n,s)||(r[n+s*o]^=1);break;case 5:for(i=0,s=0;s<o;s++,i++)for(3===i&&(i=0),e=0,n=0;n<o;n++,e++)3===e&&(e=0),(n&s&1)+!(!e|!i)||this._isMasked(n,s)||(r[n+s*o]^=1);break;case 6:for(i=0,s=0;s<o;s++,i++)for(3===i&&(i=0),e=0,n=0;n<o;n++,e++)3===e&&(e=0),(n&s&1)+(e&&e===i)&1||this._isMasked(n,s)||(r[n+s*o]^=1);break;case 7:for(i=0,s=0;s<o;s++,i++)for(3===i&&(i=0),e=0,n=0;n<o;n++,e++)3===e&&(e=0),(e&&e===i)+(n+s&1)&1||this._isMasked(n,s)||(r[n+s*o]^=1)}},_calculateMaxLength:function(){return this._dataBlock*(this._neccBlock1+this._neccBlock2)+this._neccBlock2},_calculatePolynomial:function(){var t,e,i=this._eccBlock,n=this._polynomial;for(n[0]=1,t=0;t<i;t++){for(n[t+1]=1,e=t;e>0;e--)n[e]=n[e]?n[e-1]^_.EXPONENT[v._modN(_.LOG[n[e]]+t)]:n[e-1];n[0]=_.EXPONENT[v._modN(_.LOG[n[0]]+t)]}for(t=0;t<=i;t++)n[t]=_.LOG[n[t]]},_checkBadness:function(){var t,e,i,n,s,r=0,o=this._badness,a=this.buffer,h=this.width;for(s=0;s<h-1;s++)for(n=0;n<h-1;n++)(a[n+h*s]&&a[n+1+h*s]&&a[n+h*(s+1)]&&a[n+1+h*(s+1)]||!(a[n+h*s]||a[n+1+h*s]||a[n+h*(s+1)]||a[n+1+h*(s+1)]))&&(r+=v.N2);var f=0;for(s=0;s<h;s++){for(i=0,o[0]=0,t=0,n=0;n<h;n++)t===(e=a[n+h*s])?o[i]++:o[++i]=1,f+=(t=e)?1:-1;r+=this._getBadness(i)}f<0&&(f=-f);var c=0,u=f;for(u+=u<<2,u<<=1;u>h*h;)u-=h*h,c++;for(r+=c*v.N4,n=0;n<h;n++){for(i=0,o[0]=0,t=0,s=0;s<h;s++)t===(e=a[n+h*s])?o[i]++:o[++i]=1,t=e;r+=this._getBadness(i)}return r},_convertBitStream:function(t){var e,i,n=this._ecc,s=this._version;for(i=0;i<t;i++)n[i]=this._value.charCodeAt(i);var r=this._stringBuffer=n.slice(),o=this._calculateMaxLength();t>=o-2&&(t=o-2,s>9&&t--);var a=t;if(s>9){for(r[a+2]=0,r[a+3]=0;a--;)e=r[a],r[a+3]|=255&e<<4,r[a+2]=e>>4;r[2]|=255&t<<4,r[1]=t>>4,r[0]=64|t>>12}else{for(r[a+1]=0,r[a+2]=0;a--;)e=r[a],r[a+2]|=255&e<<4,r[a+1]=e>>4;r[1]|=255&t<<4,r[0]=64|t>>4}for(a=t+3-(s<10);a<o;)r[a++]=236,r[a++]=17},_getBadness:function(t){var e,i=0,n=this._badness;for(e=0;e<=t;e++)n[e]>=5&&(i+=v.N1+n[e]-5);for(e=3;e<t-1;e+=2)n[e-2]===n[e+2]&&n[e+2]===n[e-1]&&n[e-1]===n[e+1]&&3*n[e-1]===n[e]&&(0===n[e-3]||e+3>t||3*n[e-3]>=4*n[e]||3*n[e+3]>=4*n[e])&&(i+=v.N3);return i},_finish:function(){this._stringBuffer=this.buffer.slice();var t,e,i=0,n=3e4;for(e=0;e<8&&(this._applyMask(e),(t=this._checkBadness())<n&&(n=t,i=e),7!==i);e++)this.buffer=this._stringBuffer.slice();i!==e&&this._applyMask(i),n=l.FINAL_FORMAT[i+(this._level-1<<3)];var s=this.buffer,r=this.width;for(e=0;e<8;e++,n>>=1)1&n&&(s[r-1-e+8*r]=1,e<6?s[8+r*e]=1:s[8+r*(e+1)]=1);for(e=0;e<7;e++,n>>=1)1&n&&(s[8+r*(r-7+e)]=1,e?s[6-e+8*r]=1:s[7+8*r]=1)},_interleaveBlocks:function(){var t,e,i=this._dataBlock,n=this._ecc,s=this._eccBlock,r=0,o=this._calculateMaxLength(),a=this._neccBlock1,h=this._neccBlock2,f=this._stringBuffer;for(t=0;t<i;t++){for(e=0;e<a;e++)n[r++]=f[t+e*i];for(e=0;e<h;e++)n[r++]=f[a*i+t+e*(i+1)]}for(e=0;e<h;e++)n[r++]=f[a*i+t+e*(i+1)];for(t=0;t<s;t++)for(e=0;e<a+h;e++)n[r++]=f[o+t+e*s];this._stringBuffer=n},_insertAlignments:function(){var t,e,i,n=this._version,s=this.width;if(n>1)for(t=u.BLOCK[n],i=s-7;;){for(e=s-7;e>t-3&&(this._addAlignment(e,i),!(e<t));)e-=t;if(i<=t+9)break;i-=t,this._addAlignment(6,i),this._addAlignment(i,6)}},_insertFinders:function(){var t,e,i,n,s=this.buffer,r=this.width;for(t=0;t<3;t++){for(e=0,n=0,1===t&&(e=r-7),2===t&&(n=r-7),s[n+3+r*(e+3)]=1,i=0;i<6;i++)s[n+i+r*e]=1,s[n+r*(e+i+1)]=1,s[n+6+r*(e+i)]=1,s[n+i+1+r*(e+6)]=1;for(i=1;i<5;i++)this._setMask(n+i,e+1),this._setMask(n+1,e+i+1),this._setMask(n+5,e+i),this._setMask(n+i+1,e+5);for(i=2;i<4;i++)s[n+i+r*(e+2)]=1,s[n+2+r*(e+i+1)]=1,s[n+4+r*(e+i)]=1,s[n+i+1+r*(e+4)]=1}},_insertTimingGap:function(){var t,e,i=this.width;for(e=0;e<7;e++)this._setMask(7,e),this._setMask(i-8,e),this._setMask(7,e+i-7);for(t=0;t<8;t++)this._setMask(t,7),this._setMask(t+i-8,7),this._setMask(t,i-8)},_insertTimingRowAndColumn:function(){var t,e=this.buffer,i=this.width;for(t=0;t<i-14;t++)1&t?(this._setMask(8+t,6),this._setMask(6,8+t)):(e[8+t+6*i]=1,e[6+i*(8+t)]=1)},_insertVersion:function(){var t,e,i,n,s=this.buffer,r=this._version,o=this.width;if(r>6)for(t=d.BLOCK[r-7],e=17,i=0;i<6;i++)for(n=0;n<3;n++,e--)1&(e>11?r>>e-12:t>>e)?(s[5-i+o*(2-n+o-11)]=1,s[2-n+o-11+o*(5-i)]=1):(this._setMask(5-i,2-n+o-11),this._setMask(2-n+o-11,5-i))},_isMasked:function(t,e){var i=v._getMaskBit(t,e);return 1===this._mask[i]},_pack:function(){var t,e,i,n=1,s=1,r=this.width,o=r-1,a=r-1,h=(this._dataBlock+this._eccBlock)*(this._neccBlock1+this._neccBlock2)+this._neccBlock2;for(e=0;e<h;e++)for(t=this._stringBuffer[e],i=0;i<8;i++,t<<=1){128&t&&(this.buffer[o+r*a]=1);do{s?o--:(o++,n?0!==a?a--:(n=!n,6===(o-=2)&&(o--,a=9)):a!==r-1?a++:(n=!n,6===(o-=2)&&(o--,a-=8))),s=!s}while(this._isMasked(o,a))}},_reverseMask:function(){var t,e,i=this.width;for(t=0;t<9;t++)this._setMask(t,8);for(t=0;t<8;t++)this._setMask(t+i-8,8),this._setMask(8,t);for(e=0;e<7;e++)this._setMask(8,e+i-7)},_setMask:function(t,e){var i=v._getMaskBit(t,e);this._mask[i]=1},_syncMask:function(){var t,e,i=this.width;for(e=0;e<i;e++)for(t=0;t<=e;t++)this.buffer[t+i*e]&&this._setMask(t,e)}},{_createArray:function(t){var e,i=[];for(e=0;e<t;e++)i[e]=0;return i},_getMaskBit:function(t,e){var i;return t>e&&(i=t,t=e,e=i),i=e,i+=e*e,i>>=1,i+=t},_modN:function(t){for(;t>=255;)t=((t-=255)>>8)+(255&t);return t},N1:3,N2:3,N3:40,N4:10}),p=v,m=f.extend({draw:function(){this.element.src=this.qrious.toDataURL()},reset:function(){this.element.src=""},resize:function(){var t=this.element;t.width=t.height=this.qrious.size}}),g=h.extend(function(t,e,i,n){this.name=t,this.modifiable=Boolean(e),this.defaultValue=i,this._valueTransformer=n},{transform:function(t){var e=this._valueTransformer;return"function"==typeof e?e(t,this):t}}),k=h.extend(null,{abs:function(t){return null!=t?Math.abs(t):null},hasOwn:function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},noop:function(){},toUpperCase:function(t){return null!=t?t.toUpperCase():null}}),w=h.extend(function(t){this.options={},t.forEach(function(t){this.options[t.name]=t},this)},{exists:function(t){return null!=this.options[t]},get:function(t,e){return w._get(this.options[t],e)},getAll:function(t){var e,i=this.options,n={};for(e in i)k.hasOwn(i,e)&&(n[e]=w._get(i[e],t));return n},init:function(t,e,i){"function"!=typeof i&&(i=k.noop);var n,s;for(n in this.options)k.hasOwn(this.options,n)&&(s=this.options[n],w._set(s,s.defaultValue,e),w._createAccessor(s,e,i));this._setAll(t,e,!0)},set:function(t,e,i){return this._set(t,e,i)},setAll:function(t,e){return this._setAll(t,e)},_set:function(t,e,i,n){var s=this.options[t];if(!s)throw new Error("Invalid option: "+t);if(!s.modifiable&&!n)throw new Error("Option cannot be modified: "+t);return w._set(s,e,i)},_setAll:function(t,e,i){if(!t)return!1;var n,s=!1;for(n in t)k.hasOwn(t,n)&&this._set(n,t[n],e,i)&&(s=!0);return s}},{_createAccessor:function(t,e,i){var n={get:function(){return w._get(t,e)}};t.modifiable&&(n.set=function(n){w._set(t,n,e)&&i(n,t)}),Object.defineProperty(e,t.name,n)},_get:function(t,e){return e["_"+t.name]},_set:function(t,e,i){var n="_"+t.name,s=i[n],r=t.transform(null!=e?e:t.defaultValue);return i[n]=r,r!==s}}),M=w,b=h.extend(function(){this._services={}},{getService:function(t){var e=this._services[t];if(!e)throw new Error("Service is not being managed with name: "+t);return e},setService:function(t,e){if(this._services[t])throw new Error("Service is already managed with name: "+t);e&&(this._services[t]=e)}}),B=new M([new g("background",!0,"white"),new g("backgroundAlpha",!0,1,k.abs),new g("element"),new g("foreground",!0,"black"),new g("foregroundAlpha",!0,1,k.abs),new g("level",!0,"L",k.toUpperCase),new g("mime",!0,"image/png"),new g("padding",!0,null,k.abs),new g("size",!0,100,k.abs),new g("value",!0,"")]),y=new b,O=h.extend(function(t){B.init(t,this,this.update.bind(this));var e=B.get("element",this),i=y.getService("element"),n=e&&i.isCanvas(e)?e:i.createCanvas(),s=e&&i.isImage(e)?e:i.createImage();this._canvasRenderer=new c(this,n,!0),this._imageRenderer=new m(this,s,s===e),this.update()},{get:function(){return B.getAll(this)},set:function(t){B.setAll(t,this)&&this.update()},toDataURL:function(t){return this.canvas.toDataURL(t||this.mime)},update:function(){var t=new p({level:this.level,value:this.value});this._canvasRenderer.render(t),this._imageRenderer.render(t)}},{use:function(t){y.setService(t.getName(),t)}});Object.defineProperties(O.prototype,{canvas:{get:function(){return this._canvasRenderer.getElement()}},image:{get:function(){return this._imageRenderer.getElement()}}});var A=O,L=h.extend({getName:function(){}}).extend({createCanvas:function(){},createImage:function(){},getName:function(){return"element"},isCanvas:function(t){},isImage:function(t){}}).extend({createCanvas:function(){return document.createElement("canvas")},createImage:function(){return document.createElement("img")},isCanvas:function(t){return t instanceof HTMLCanvasElement},isImage:function(t){return t instanceof HTMLImageElement}});return A.use(new L),A});

//# sourceMappingURL=qrious.min.js.map
/* =====================================================================
 * THE SKY COLLECTION — 收藏分頁模組  ticket-ui.js  v3 (B188T)
 * ---------------------------------------------------------------------
 * 只加不改：test.html / index.html 只要在 </body> 前加一行
 *   <script src="ticket-ui.js?v=3" defer></script>
 * 它把 SHOP 分頁改成三層：收藏首頁（兩張卡）→ 票夾（一場活動一張卡）／周邊收藏櫃 → 入場票／收藏詳情。
 * 原本的商店列表（#merch-list）隱藏；票收進票夾、商品收進周邊。購買沿用 app 原本的按鈕。
 *
 * 流程：買（綠界）→ 票在 app（綁 email）→ 轉讓（QR/連結）→ 掃碼進場 → 票根留著
 * 身分：已解鎖粉絲用 localStorage 的 email+解鎖碼自動登入；其他人 email+驗證碼。
 * ?tkdemo=1 → 不打伺服器，用假資料看畫面。
 * ===================================================================== */
(function () {
  "use strict";
  var C = {
    api: "https://the-sky-ost-api.anthonywen0693.workers.dev",
    unlockKeys: ["album-the-sky:unlock", "album-the-sky:feedpass"],
    merchKey: "album-the-sky:merch",
    mount: "#screen-merch", before: "#merch-list",
    merchNavSel: '.navbtn[data-screen="merch"]',
    navSel: { player: '.navbtn[data-screen="player"]', mood: '.navbtn[data-screen="mood"]', merch: '.navbtn[data-screen="merch"]', purchase: '.navbtn[data-screen="purchase"]' },
    demo: /[?&]tkdemo=1/.test(location.search),
    pollMs: 5000,
    base: (function () { try { var sc = document.currentScript && document.currentScript.src; return sc ? sc.replace(/[^\/]*$/, "") : ""; } catch (e) { return ""; } })(),   // tk-scan.js 跟 ticket-ui.js 放一起
    scanFile: "tk-scan.js?v=2",
    terms: "演出日前 20 日前可申請退票，酌收票價 10% 手續費；之後恕不退票，可用票夾「轉讓給朋友」換人。活動取消、改期或主要演出內容變更，全額退款。",   // TODO 退換票條款待 CÉON 定案
  };
  var K = { sess: "tk:session", email: "tk:email" };
  var S = { session: null, email: "", tickets: [], events: [], photopass: [], loading: false, lastFetch: 0, pollTimer: null, cdTimer: null, transfer: null,
            layers: [], sel: null, tab: "up", detail: null, addTab: "cam" };

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} }
  function fmt(iso) { var d = new Date(iso); if (isNaN(d)) return ""; var t = new Date(d.getTime() + 8 * 3600e3); var w = "日一二三四五六"[t.getUTCDay()]; return (t.getUTCMonth() + 1) + "/" + t.getUTCDate() + "（" + w + "）" + ("0" + t.getUTCHours()).slice(-2) + ":" + ("0" + t.getUTCMinutes()).slice(-2); }
  function fmtT(iso) { var d = new Date(iso); if (isNaN(d)) return ""; var t = new Date(d.getTime() + 8 * 3600e3); return (t.getUTCMonth() + 1) + "/" + t.getUTCDate() + " " + ("0" + t.getUTCHours()).slice(-2) + ":" + ("0" + t.getUTCMinutes()).slice(-2); }
  function hap(p) { try { navigator.vibrate && navigator.vibrate(p); } catch (e) {} }
  /* ---------- CSS ---------- */
  var CSS = "\
:root{--tkg:#d8bc80;--tkg2:#f1ddb0;--tki:#f3efe6;--tkm:#a89f92;--tkt:#f6f1e7}\
#screen-merch .page-titles,#merch-list{display:none!important}\
.tk,.tk-layer{color:var(--tkt);font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Helvetica Neue',Arial,sans-serif;-webkit-tap-highlight-color:transparent}\
.tk *,.tk-layer *{box-sizing:border-box}\
.tk{padding:calc(14px + env(safe-area-inset-top)) 16px 0}\
.tk-serif{font-family:var(--font-display,'Playfair Display'),Georgia,serif;font-weight:500}\
.tk-eyebrow{font-family:var(--font-label,'Bodoni Moda'),Georgia,serif;font-size:11px;letter-spacing:.3em;color:var(--tkg);text-transform:uppercase}\
.tk-h1{font-size:34px;line-height:1.15;letter-spacing:.06em;margin:10px 0 6px;color:#fff}\
.tk-sub{font-size:14px;color:rgba(255,255,255,.62);letter-spacing:.02em}\
.tk-top{display:flex;justify-content:space-between;align-items:flex-start;text-align:center}\
.tk-top>div{flex:1}.tk-top .tk-sp{flex:0 0 40px}\
.tk-prof{flex:0 0 40px;width:40px;height:40px;border-radius:50%;border:1px solid rgba(216,188,128,.45);background:rgba(216,188,128,.08);color:var(--tkg);display:grid;place-items:center;font:600 14px/1 var(--font-label,serif);cursor:pointer;margin-top:-2px}\
.tk-ent{position:relative;display:block;width:100%;text-align:left;border:1px solid rgba(216,188,128,.22);border-radius:26px;padding:22px 20px;margin-top:16px;overflow:hidden;cursor:pointer;color:var(--tkt);font:inherit;transition:transform .18s ease}\
.tk-ent:active{transform:scale(.985)}\
.tk-ent.tix{min-height:250px;background:radial-gradient(circle at 78% 22%,rgba(216,188,128,.34),transparent 32%),linear-gradient(150deg,#3a2718 0%,#160f0d 55%,#0b0809 100%);min-height:220px}\
.tk-ent.mer{background:radial-gradient(circle at 80% 25%,rgba(150,110,220,.32),transparent 34%),linear-gradient(150deg,#2b1a44 0%,#150c22 60%,#0b0710 100%);min-height:200px}\
.tk-ent .lab{font-family:var(--font-label,serif);font-size:11px;letter-spacing:.3em;color:var(--tkg)}\
.tk-ent .ttl{font-size:27px;letter-spacing:.06em;margin:8px 0 6px;color:#fff}\
.tk-ent .st{font-size:14px;color:rgba(255,255,255,.72)}\
.tk-ent.tix .st,.tk-ent.tix .nx{max-width:calc(100% - 132px)}.tk-ent .nx{display:flex;gap:8px;align-items:center;margin-top:16px;font-size:12px;color:rgba(255,255,255,.62)}.tk-ent .nx b{display:block;color:#fff;font-size:15px;letter-spacing:.06em;margin-top:2px;font-weight:600}\
.tk-ent .nx i{width:18px;height:18px;border:1px solid rgba(216,188,128,.6);border-radius:4px;display:inline-block;position:relative;flex:0 0 18px}.tk-ent .nx i:after{content:'';position:absolute;left:3px;right:3px;top:5px;height:1px;background:rgba(216,188,128,.7)}\
.tk-gold{display:inline-flex;align-items:center;gap:8px;margin-top:16px;padding:12px 18px;border-radius:14px;background:linear-gradient(#f1ddb0,#d8bc80);color:#181209;font-size:14px;font-weight:700;border:0;font:inherit;cursor:pointer;min-height:44px}\
.tk-ent .more{position:absolute;right:20px;bottom:20px;font-size:12px;color:rgba(255,255,255,.55)}\
.tk-ent .circ{position:absolute;left:20px;bottom:20px;width:44px;height:44px;border-radius:50%;border:1px solid rgba(255,255,255,.35);display:grid;place-items:center;color:#fff;font-size:18px}\
.tk-stub{position:absolute;right:16px;top:22px;width:118px;height:150px;border-radius:12px;background:linear-gradient(160deg,#1b1410,#0a0808);border:1px solid rgba(216,188,128,.35);box-shadow:0 18px 40px rgba(0,0,0,.55);transform:rotate(6deg);overflow:hidden}\
.tk-stub:before{content:'';position:absolute;right:-30px;top:44px;width:96px;height:96px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#3a2b2a,#0d0a0b 70%);box-shadow:inset -12px -8px 26px rgba(0,0,0,.7),0 0 26px rgba(216,188,128,.18)}\
.tk-stub:after{content:'THE SKY';position:absolute;left:12px;top:14px;font:600 11px/1 var(--font-label,serif);letter-spacing:.22em;color:#f4e4c1}\
.tk-stub s{position:absolute;left:12px;bottom:14px;text-decoration:none;font-size:6px;letter-spacing:.18em;color:rgba(244,228,193,.7);line-height:1.6;text-transform:uppercase}\
.tk-stub em{position:absolute;left:-6px;top:50%;width:12px;height:12px;border-radius:50%;background:#1c1029;margin-top:-6px}\
.tk-stack{position:absolute;right:14px;top:18px;width:150px;height:170px}\
.tk-stack img,.tk-stack span{position:absolute;width:92px;height:122px;border-radius:12px;object-fit:cover;border:1px solid rgba(216,188,128,.3);box-shadow:0 16px 34px rgba(0,0,0,.55);background:linear-gradient(160deg,#2a1a3a,#0c0812)}\
.tk-stack :nth-child(1){right:0;top:0;transform:rotate(9deg)}.tk-stack :nth-child(2){right:34px;top:14px;transform:rotate(-4deg)}.tk-stack :nth-child(3){right:64px;top:30px;transform:rotate(-14deg)}\
.tk-stack span{display:grid;place-items:center;font:600 10px/1 var(--font-label,serif);letter-spacing:.2em;color:#f4e4c1}\
.tk-ctx{margin:14px 4px 6px;font-size:12px;color:rgba(255,255,255,.5);text-align:center}\
.tk-div{display:flex;align-items:center;gap:12px;margin:26px 0 4px;font-family:var(--font-label,serif);font-size:11px;letter-spacing:.3em;color:rgba(216,188,128,.75)}.tk-div:before,.tk-div:after{content:'';flex:1;height:1px;background:rgba(216,188,128,.2)}\
#nav-wrap{transition:transform .22s ease,opacity .22s ease}body.tk-open #nav-wrap{transform:translateY(130%);opacity:0;pointer-events:none}\
.tk-layer{position:fixed;inset:0;z-index:99990;background:radial-gradient(circle at 50% -10%,var(--bg-top,#2a0e13),transparent 45%),var(--bg,#0b0709);overflow-y:auto;-webkit-overflow-scrolling:touch;padding:0 16px calc(40px + env(safe-area-inset-bottom));transform:translateX(28px);opacity:0;pointer-events:none;transition:transform .22s cubic-bezier(.2,.7,.2,1),opacity .2s ease}\
.tk-layer.in{transform:none;opacity:1;pointer-events:auto}.tk-layer.out{transform:translateX(-18px);opacity:0}\
@media (prefers-reduced-motion:reduce){.tk-layer,#nav-wrap,.tk-ent{transition:none}}\
.tk-bar{position:sticky;top:0;z-index:2;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:calc(10px + env(safe-area-inset-top)) 0 10px;margin:0 -16px 6px;padding-left:12px;padding-right:12px;background:linear-gradient(var(--bg,#0b0709) 70%,transparent)}\
.tk-bar button{background:none;border:0;color:#fff;font:inherit;font-size:15px;min-height:44px;min-width:44px;display:flex;align-items:center;gap:6px;cursor:pointer;padding:0 4px}\
.tk-bar .r{justify-content:flex-end}.tk-bar .c{font-family:var(--font-label,serif);font-size:12px;letter-spacing:.3em;color:var(--tkg);text-align:center}\
.tk-bar .chev{font-size:22px;line-height:1;color:var(--tkg)}\
.tk-hd{padding:6px 2px 14px}.tk-hd .tk-h1{font-size:34px}\
.tk-row{display:flex;justify-content:space-between;align-items:center;gap:12px;width:100%;text-align:left;background:rgba(20,12,18,.7);border:1px solid rgba(216,188,128,.16);border-radius:18px;padding:16px 16px;margin-top:10px;color:var(--tkt);font:inherit;cursor:pointer;min-height:64px;transition:transform .16s}\
.tk-row:active{transform:scale(.985)}.tk-row.on{border-color:rgba(216,188,128,.55);background:rgba(28,18,22,.9)}\
.tk-row b{display:block;font-size:17px;letter-spacing:.06em;font-weight:600}.tk-row span{display:block;font-size:12px;color:rgba(255,255,255,.62);margin-top:5px;letter-spacing:.04em}\
.tk-pill{font-size:10px;font-weight:800;letter-spacing:.16em;padding:6px 10px;border-radius:999px;background:rgba(74,130,90,.25);color:#8fd4a0;border:1px solid rgba(143,212,160,.35);white-space:nowrap}\
.tk-pill.warn{background:rgba(160,120,40,.22);color:#efd9a9;border-color:rgba(239,217,169,.35)}.tk-pill.bad{background:rgba(140,60,60,.22);color:#e7a3a3;border-color:rgba(231,163,163,.35)}\
.tk-row .chv{color:var(--tkg);font-size:20px;flex:0 0 auto}\
.tk-past{margin-top:22px}.tk-past .tk-eyebrow{opacity:.7}.tk-past .tk-row{opacity:.6}\
.tk-pass{border-radius:22px;overflow:hidden;background:var(--tki);color:#111;box-shadow:0 26px 60px rgba(0,0,0,.55);margin-top:16px}\
.tk-pass.used,.tk-pass.dead{filter:saturate(.3);opacity:.8}\
.tk-art{height:118px;position:relative;background:radial-gradient(circle at 78% 20%,rgba(232,198,136,.55),transparent 22%),linear-gradient(140deg,#3a2a20,#0f0d0d 62%)}\
.tk-art b{position:absolute;left:20px;bottom:16px;font:400 34px/1 var(--font-display,'Playfair Display'),Georgia,serif;letter-spacing:.14em;color:#fff3df}\
.tk-art i{position:absolute;right:18px;top:16px;font-style:normal;font:500 10px/1 var(--font-label,serif);letter-spacing:.26em;color:#f4dfb8}\
.tk-body{padding:18px 20px 20px}\
.tk-title{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.tk-title b{font-size:22px;font-weight:600;letter-spacing:.04em;line-height:1.2;font-family:var(--font-display,serif),serif}\
.tk-st{font-size:11px;font-weight:800;letter-spacing:.16em;color:#3f7a4c;white-space:nowrap;padding-top:6px}.tk-st.bad{color:#8e4949}.tk-st.warn{color:#8a6a1f}\
.tk-info{display:grid;grid-template-columns:1.15fr 1fr;gap:14px 12px;padding-top:16px}\
.tk-lab{font-size:9px;color:#8a8275;letter-spacing:.18em;text-transform:uppercase;margin-bottom:5px}.tk-val{font-size:15px;line-height:1.3;font-weight:650;word-break:break-all}\
.tk-tear{height:0;border-top:1px dashed rgba(0,0,0,.22);margin:18px -20px 16px;position:relative}.tk-tear:before,.tk-tear:after{content:'';position:absolute;width:22px;height:22px;border-radius:50%;background:var(--bg,#0b0709);top:50%;transform:translateY(-50%)}.tk-tear:before{left:-31px}.tk-tear:after{right:-31px}\
.tk-qrwrap2{display:flex;flex-direction:column;align-items:center;padding:6px 0 2px}\
.tk-qrwrap2 canvas{width:min(240px,62vw)!important;height:min(240px,62vw)!important;display:block;max-width:none;background:#fff}\
.tk-qrid{font:11px ui-monospace,Menlo,monospace;color:#555;letter-spacing:.14em;margin-top:10px}\
.tk-reveal{width:100%;min-height:52px;border-radius:14px;border:1px dashed rgba(0,0,0,.3);background:#fff;color:#111;font:inherit;font-size:15px;font-weight:700;cursor:pointer;padding:14px}.tk-reveal small{display:block;font-size:11px;font-weight:500;color:#777;margin-top:4px}\
.tk-stubbox{background:#e6e0d3;border-radius:14px;padding:22px 12px;text-align:center;color:#4a4237}.tk-stubbox b{display:block;font-size:22px;letter-spacing:.1em}.tk-stubbox span{font-size:11px;letter-spacing:.06em}\
.tk-acts{display:grid;grid-template-columns:1fr 1.3fr;gap:10px;margin-top:14px}\
.tk-btn{width:100%;border:1px solid rgba(255,255,255,.14);border-radius:14px;padding:14px;background:#151015;color:var(--tkt);font:inherit;font-size:14px;font-weight:700;margin-top:10px;cursor:pointer;min-height:48px}\
.tk-btn.p{border-color:transparent;background:linear-gradient(#f1ddb0,#d8bc80);color:#181209}.tk-btn.g{background:transparent}.tk-btn:disabled{opacity:.4}\
.tk-acts .tk-btn{margin-top:0}\
.tk-card{background:rgba(20,12,18,.7);border:1px solid rgba(216,188,128,.16);border-radius:22px;padding:16px;margin-top:12px}\
.tk-card p{margin:0 0 8px;font-size:14px;line-height:1.6;color:rgba(255,255,255,.78)}\
.tk-in{width:100%;border:1px solid rgba(255,255,255,.14);background:#0b0709;color:var(--tkt);padding:14px;border-radius:14px;font:inherit;font-size:16px;margin-top:8px;-webkit-appearance:none}\
.tk-msg{font-size:12px;color:#e6a3a3;min-height:14px;margin-top:6px}.tk-msg.ok{color:#9bd1a6}\
.tk-chips{display:flex;gap:8px;margin:4px 0 14px;overflow-x:auto;scrollbar-width:none}.tk-chips::-webkit-scrollbar{display:none}\
.tk-chip{flex:0 0 auto;padding:9px 14px;border-radius:12px;border:1px solid rgba(216,188,128,.3);background:rgba(20,12,18,.6);color:rgba(255,255,255,.8);font:inherit;font-size:13px;cursor:pointer;min-height:38px}.tk-chip.on{background:linear-gradient(#f1ddb0,#d8bc80);color:#181209;border-color:transparent;font-weight:700}\
.tk-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}\
.tk-item{background:rgba(20,12,18,.7);border:1px solid rgba(216,188,128,.16);border-radius:20px;overflow:hidden;text-align:left;padding:0;color:var(--tkt);font:inherit;cursor:pointer;transition:transform .16s}.tk-item:active{transform:scale(.98)}\
.tk-item .im{aspect-ratio:1/1.05;background:linear-gradient(160deg,#241634,#0c0812);position:relative;display:grid;place-items:center;overflow:hidden}.tk-item .im img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}\
.tk-item .im .ph{font:600 12px/1 var(--font-label,serif);letter-spacing:.24em;color:#f4e4c1}\
.tk-tag{position:absolute;left:10px;bottom:10px;font-size:10px;letter-spacing:.08em;padding:5px 9px;border-radius:8px;background:rgba(10,6,10,.75);border:1px solid rgba(216,188,128,.35);color:#f4e4c1}\
.tk-item .nm{padding:12px 12px 4px;font-size:15px;font-weight:600}.tk-item .ds{padding:0 12px 14px;font-size:12px;color:rgba(255,255,255,.6)}\
.tk-empty{padding:34px 18px;text-align:center;color:rgba(255,255,255,.6);font-size:14px;line-height:1.6;border:1px dashed rgba(216,188,128,.25);border-radius:20px;margin-top:6px}\
.tk-hero{border-radius:24px;overflow:hidden;background:linear-gradient(160deg,#241634,#0c0812);aspect-ratio:1/1;display:grid;place-items:center;margin-top:8px;border:1px solid rgba(216,188,128,.2);position:relative}.tk-hero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.tk-hero .ph{font:600 16px/1 var(--font-label,serif);letter-spacing:.3em;color:#f4e4c1}\
.tk-dl{margin-top:16px}.tk-dl .k{font-size:10px;letter-spacing:.18em;color:var(--tkg);text-transform:uppercase;margin-top:14px}.tk-dl .v{font-size:16px;margin-top:4px;color:#fff}.tk-dl .v.big{font-size:26px;font-family:var(--font-display,serif),serif;letter-spacing:.04em}\
.tk-ben{margin:6px 0 0;padding:0;list-style:none}.tk-ben li{padding:10px 0;border-top:1px solid rgba(255,255,255,.08);font-size:14px;display:flex;gap:10px;align-items:center}.tk-ben li:before{content:'✦';color:var(--tkg);font-size:11px}\
.tk-sheet{position:fixed;inset:0;background:rgba(0,0,0,.74);z-index:100000;display:none;align-items:flex-end;justify-content:center}.tk-sheet.show{display:flex}\
.tk-box{width:min(100%,470px);max-height:92vh;overflow:auto;background:#130c12;border:1px solid rgba(216,188,128,.18);border-radius:28px 28px 0 0;padding:22px 18px calc(28px + env(safe-area-inset-bottom));color:var(--tkt);font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif}\
.tk-box h3{font-size:22px;margin:4px 0 6px;font-family:var(--font-display,serif),serif;font-weight:500;letter-spacing:.04em}.tk-box .tk-hint{font-size:13px;line-height:1.6;color:rgba(255,255,255,.62)}\
.tk-qrwrap{display:flex;justify-content:center;margin:18px 0 10px}.tk-qrbox{padding:14px;background:#f3f0e8;border-radius:22px;line-height:0}.tk-qrbox canvas{width:220px!important;height:220px!important;display:block;max-width:none}\
.tk-count{text-align:center;font-size:13px;color:#efd9a9;font-variant-numeric:tabular-nums;margin:6px 0}\
.tk-tiny{font-size:10px;color:var(--tkm);word-break:break-all;line-height:1.5;text-align:center}\
.tk-big{text-align:center;padding:26px 0 8px}.tk-big .ic{width:72px;height:72px;border-radius:50%;display:grid;place-items:center;margin:0 auto 14px;font-size:30px;border:1px solid rgba(216,188,128,.42);color:#efd9a9}.tk-big .ic.ok{border-color:rgba(155,209,166,.4);color:#9bd1a6;background:rgba(155,209,166,.07)}\
.tk-menu{display:flex;flex-direction:column;gap:2px}.tk-menu button{text-align:left;background:none;border:0;border-top:1px solid rgba(255,255,255,.08);color:var(--tkt);font:inherit;font-size:16px;padding:16px 4px;min-height:52px;cursor:pointer}.tk-menu button.danger{color:#e7a3a3}.tk-menu button:first-child{border-top:0}\
.tk-toast{position:fixed;left:50%;bottom:calc(110px + env(safe-area-inset-bottom));transform:translateX(-50%);background:#1b1418;border:1px solid rgba(216,188,128,.3);color:var(--tkt);padding:10px 16px;border-radius:999px;font-size:12px;z-index:100001;opacity:0;transition:.25s;pointer-events:none;white-space:nowrap}.tk-toast.in{opacity:1}\
.tk-cd{display:flex;gap:6px;margin-top:14px}.tk-cd div{background:rgba(0,0,0,.35);border:1px solid rgba(216,188,128,.28);border-radius:10px;padding:6px 8px;text-align:center;min-width:48px}.tk-cd b{display:block;font-size:18px;font-weight:600;font-variant-numeric:tabular-nums}.tk-cd span{font-size:9px;color:#b9ad97;letter-spacing:.1em}\
.tk-ent .st2{font-size:13px;color:rgba(255,255,255,.55);margin-top:4px}\
.tk-seg{display:flex;background:rgba(255,255,255,.06);border-radius:12px;padding:4px;margin:6px 0 4px}.tk-seg button{flex:1;border:0;background:none;color:rgba(255,255,255,.55);font:inherit;font-size:14px;padding:10px 0;border-radius:9px;cursor:pointer;min-height:40px}.tk-seg button.on{background:rgba(216,188,128,.18);color:#f4e4c1;font-weight:600}\
.tk-day{display:flex;align-items:baseline;gap:8px;margin:18px 0 8px 2px;font-size:14px}.tk-day b{font-size:16px}.tk-day span{color:#8f8676;font-size:13px}.tk-day i{width:8px;height:8px;border-radius:50%;background:#d8bc80;display:inline-block;margin-right:2px;transform:translateY(-1px)}.tk-day i.pu{background:#8b6fc0}\
.tk-ev{display:block;width:100%;text-align:left;border-radius:20px;overflow:hidden;border:1px solid rgba(216,188,128,.22);position:relative;color:var(--tkt);font:inherit;padding:0;cursor:pointer;transition:transform .16s}.tk-ev:active{transform:scale(.985)}\
.tk-ev.gold{background:radial-gradient(circle at 85% 20%,rgba(216,188,128,.28),transparent 40%),linear-gradient(150deg,#3a2718,#130d0c)}.tk-ev.pu{background:radial-gradient(circle at 85% 20%,rgba(150,110,220,.3),transparent 40%),linear-gradient(150deg,#2b1a44,#110a1a)}\
.tk-ev .top{display:flex;gap:14px;padding:16px;align-items:center}\
.tk-poster{width:78px;height:98px;border-radius:12px;flex:0 0 78px;border:1px solid rgba(216,188,128,.3);position:relative;overflow:hidden;background:radial-gradient(circle at 60% 30%,#6b4a2c,#140e0c 70%)}.tk-ev.pu .tk-poster{background:radial-gradient(circle at 60% 30%,#4b3272,#0e0916 70%)}\
.tk-poster b{position:absolute;left:8px;bottom:8px;font:600 9px/1 var(--font-label,serif);letter-spacing:.2em;color:#f4e4c1}\
.tk-ev .n{font:500 19px/1.3 var(--font-display,serif),serif;letter-spacing:.04em}.tk-ev .m{font-size:12px;color:rgba(255,255,255,.66);margin-top:6px;line-height:1.5}\
.tk-ev .foot{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:12px 16px;background:rgba(0,0,0,.35);border-top:1px solid rgba(216,188,128,.14);font-size:13px;min-height:52px}\
.tk-ev .foot .l{color:#e9dfcf}.tk-ev .foot .l.dim{color:rgba(255,255,255,.66)}\
.tk-chip{padding:8px 12px;border-radius:999px;font-size:12px;font-weight:700;border:0;font-family:inherit;white-space:nowrap;cursor:pointer;min-height:34px}.tk-chip.g{background:rgba(74,130,90,.25);color:#8fd4a0;border:1px solid rgba(143,212,160,.35)}.tk-chip.o{background:linear-gradient(#f1ddb0,#d8bc80);color:#181209}.tk-chip.d{background:rgba(216,188,128,.16);color:#f4e4c1;border:1px solid rgba(216,188,128,.4)}.tk-chip.x{background:rgba(255,255,255,.08);color:rgba(255,255,255,.5)}\
.tk-hint2{font-size:12px;color:rgba(255,255,255,.4);text-align:center;margin-top:18px;line-height:1.6}\
.tk-lock{text-align:center;padding:4px 0 2px}.tk-lock .ic{width:54px;height:54px;border-radius:50%;margin:0 auto 10px;border:1.5px solid #c9b37f;display:grid;place-items:center;font-size:22px;color:#8a6a1f}.tk-lock b{font-size:15px}.tk-lock p{font-size:12px;color:#6d6558;margin-top:6px;line-height:1.6}\
.tk-lcd{display:flex;justify-content:center;gap:8px;margin-top:12px}.tk-lcd div{background:#e7e1d4;border-radius:10px;padding:7px 10px;min-width:56px;text-align:center}.tk-lcd b{display:block;font-size:20px;font-variant-numeric:tabular-nums}.tk-lcd span{font-size:10px;color:#7a7266}\
.tk-list{margin-top:14px;border-radius:18px;background:rgba(20,12,18,.8);border:1px solid rgba(216,188,128,.14);overflow:hidden}\
.tk-list button{display:flex;width:100%;justify-content:space-between;align-items:center;padding:14px 16px;font:inherit;font-size:15px;color:var(--tkt);background:none;border:0;border-top:1px solid rgba(255,255,255,.07);cursor:pointer;min-height:50px;text-align:left}.tk-list button:first-child{border-top:0}.tk-list button span{color:var(--tkg);font-size:16px}.tk-list button.dim{color:rgba(255,255,255,.7)}\
.tk-banner{margin-top:12px;padding:10px 14px;border-radius:14px;background:rgba(216,188,128,.12);border:1px solid rgba(216,188,128,.35);color:#f4e4c1;font-size:13px;display:flex;justify-content:space-between;align-items:center;gap:10px}\
.tk-prog{margin:12px 0 4px}.tk-prog .tt{display:flex;justify-content:space-between;align-items:baseline;font-size:13px;color:rgba(255,255,255,.7)}.tk-prog .tt b{font:500 22px var(--font-display,serif),serif;color:#f0dcaa}\
.tk-pbar{height:6px;border-radius:9px;background:rgba(255,255,255,.08);margin-top:8px;overflow:hidden}.tk-pbar i{display:block;height:100%;background:linear-gradient(90deg,#b58df0,#d8bc80)}\
.tk-item.lk .im:after{content:'🔒';position:absolute;inset:0;display:grid;place-items:center;font-size:24px;background:rgba(8,5,10,.42)}.tk-item.lk .im img{filter:saturate(.55)}.tk-item.lk .nm{color:rgba(255,255,255,.7)}\
.tk-item .ibtn{display:block;margin:0 12px 12px;padding:9px 0;border-radius:10px;border:1px solid rgba(216,188,128,.4);text-align:center;font-size:12px;color:#f4e4c1;background:none;font-family:inherit;width:calc(100% - 24px);cursor:pointer;min-height:36px}.tk-item .ibtn.done{background:rgba(216,188,128,.16)}.tk-item .ibtn.buy{background:linear-gradient(#f1ddb0,#d8bc80);color:#181209;border-color:transparent;font-weight:700}\
.tk-pastrow{display:flex;gap:12px;align-items:center;width:100%;text-align:left;background:rgba(20,12,18,.6);border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:12px 14px;margin-top:10px;color:var(--tkt);font:inherit;cursor:pointer;min-height:60px}.tk-pastrow .pp{width:34px;height:44px;border-radius:8px;background:linear-gradient(160deg,#3a2a20,#0f0d0d);flex:0 0 34px;border:1px solid rgba(216,188,128,.25)}.tk-pastrow b{display:block;font-size:15px}.tk-pastrow span{display:block;font-size:12px;color:rgba(255,255,255,.55);margin-top:3px}.tk-pastrow .chv{margin-left:auto;color:var(--tkg)}\
.tk-tierlist{margin:6px 0 12px;display:flex;flex-direction:column;gap:10px}\
.tk-tier{display:block;width:100%;text-align:left;background:rgba(255,255,255,.05);border:1px solid rgba(216,188,128,.28);border-radius:14px;padding:13px 15px;color:var(--tkt);font:inherit;cursor:pointer;min-height:64px}\
.tk-tier .tt{display:flex;justify-content:space-between;align-items:baseline;gap:10px}.tk-tier .tt b{font-size:16px;color:#f4e4c1}.tk-tier .pr{font:600 17px var(--font-display,serif),serif;color:#f0dcaa}\
.tk-tier .mt{font-size:12px;color:rgba(255,255,255,.6);margin-top:4px}.tk-tier .mt .so{color:#e7a3a3}\
.tk-tier .pk{font-size:12px;color:rgba(255,255,255,.5);margin-top:6px;line-height:1.5}\
.tk-tier.off{opacity:.45;border-style:dashed;cursor:default}\
.tk-perks,.tk-perkbox{background:rgba(216,188,128,.07);border:1px solid rgba(216,188,128,.2);border-radius:12px;padding:11px 14px;margin:0 0 12px}\
.tk-perkbox{margin:12px 16px 0}\
.tk-perks .pt,.tk-perkbox .pt{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#c9a86a;margin-bottom:6px}\
.tk-perks ul,.tk-perkbox ul{margin:0;padding-left:16px}.tk-perks li,.tk-perkbox li{font-size:13px;line-height:1.7;color:rgba(255,255,255,.82)}\
.tk-seatnote{font-size:12px;line-height:1.6;color:rgba(255,255,255,.62);margin:0 0 12px}.tk-seatnote b{color:#f0dcaa}\
.tk-tierbadge{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:2px 0 10px}.tk-tierbadge .bd{font-size:12px;font-weight:700;color:#181209;background:linear-gradient(#f1ddb0,#d8bc80);border-radius:20px;padding:4px 11px}.tk-tierbadge .sn{font-size:12px;color:#c9a86a;letter-spacing:.05em}\
.tk-steps{display:flex;align-items:center;justify-content:center;gap:8px;margin:2px 0 14px;font-size:12px;color:rgba(255,255,255,.4)}.tk-steps .on{color:#f0dcaa;font-weight:600}.tk-steps i{color:rgba(255,255,255,.25)}\
.tk-order{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:12px 14px;margin:4px 0 12px}.tk-order .r{display:flex;justify-content:space-between;align-items:baseline;gap:10px;padding:5px 0;font-size:14px;color:rgba(255,255,255,.82)}.tk-order .r b{color:#f4e4c1}.tk-order .r.tot{border-top:1px solid rgba(255,255,255,.1);margin-top:4px;padding-top:9px;font-size:15px}.tk-order .r.tot b{font:600 19px var(--font-display,serif),serif;color:#f0dcaa}\
.tk-to{font-size:13px;color:rgba(255,255,255,.8);margin:2px 0 10px}.tk-to b{color:#f4e4c1}.tk-to.dim{color:rgba(255,255,255,.6)}\
.tk-terms{font-size:11px;line-height:1.6;color:rgba(255,255,255,.42);margin:2px 0 12px}\
.tk-a2hs{font-size:12px;line-height:1.6;color:rgba(255,255,255,.62);background:rgba(216,188,128,.08);border:1px solid rgba(216,188,128,.22);border-radius:12px;padding:10px 12px;margin:2px 0 12px}.tk-a2hs b{color:#f4e4c1}\
.tk-spin{width:34px;height:34px;margin:0 auto 12px;border:3px solid rgba(216,188,128,.25);border-top-color:#e8c987;border-radius:50%;animation:tksp .8s linear infinite}@keyframes tksp{to{transform:rotate(360deg)}}@media (prefers-reduced-motion:reduce){.tk-spin{animation-duration:2s}}\
.tk-codebox{margin:10px auto 0;text-align:center}.tk-codebox span{display:block;font-size:11px;letter-spacing:.2em;color:var(--tkm);text-transform:uppercase}.tk-codebox b{display:block;font:700 30px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em;color:#f4e4c1;margin-top:4px}\
.tk-tabs{display:flex;background:rgba(255,255,255,.07);border-radius:12px;padding:3px;margin:14px 0 12px}.tk-tabs button{flex:1;min-height:40px;border:0;border-radius:10px;background:none;color:rgba(255,255,255,.6);font:inherit;font-size:14px;cursor:pointer}.tk-tabs button.on{background:rgba(216,188,128,.22);color:#f4e4c1;font-weight:600}\
.tk-cam{position:relative;width:100%;aspect-ratio:1/1;max-height:60vh;background:#000;border-radius:16px;overflow:hidden}.tk-cam video{width:100%;height:100%;object-fit:cover;display:block}.tk-cam .fr{position:absolute;inset:14%;border:2px solid rgba(255,255,255,.75);border-radius:14px;box-shadow:0 0 0 999px rgba(0,0,0,.35);pointer-events:none}.tk-camtxt{position:absolute;left:0;right:0;bottom:12px;text-align:center;color:#fff;font-size:13px;text-shadow:0 1px 3px #000;min-height:18px}\
.tk-codein{font:700 26px/1.3 ui-monospace,SFMono-Regular,Menlo,monospace!important;letter-spacing:.18em;text-align:center;text-transform:uppercase}\
.tk-addbtn{display:flex;align-items:center;gap:10px;width:100%;min-height:52px;margin:0 0 12px;padding:10px 14px;border-radius:14px;border:1px dashed rgba(216,188,128,.5);background:rgba(216,188,128,.06);color:#f4e4c1;font:inherit;font-size:15px;font-weight:600;text-align:left;cursor:pointer}.tk-addbtn span{font-weight:400;font-size:12px;color:rgba(255,255,255,.5);margin-left:auto;text-align:right}\
.tk-ev .foot.pp{border-top:1px dashed rgba(255,255,255,.1)}.tk-ev .foot.pp .l small{display:block;font-size:11px;color:rgba(255,255,255,.45);font-weight:400}\
.tk-photos{margin:12px 16px 0;padding:14px 16px;border-radius:14px;background:rgba(20,12,18,.6);border:1px solid rgba(255,255,255,.07)}.tk-photos b{display:block;font-size:14px;color:var(--tkt)}.tk-photos span{display:block;font-size:12px;color:rgba(255,255,255,.55);margin-top:4px;line-height:1.6}\
@media (max-width:360px){.tk-h1{font-size:28px}.tk-ent .ttl{font-size:22px}.tk-stub{width:92px;height:118px;right:12px}.tk-ent.tix .st,.tk-ent.tix .nx{max-width:calc(100% - 100px)}.tk-ent .nx b{font-size:13px}.tk-stack{width:120px}.tk-stack img,.tk-stack span{width:72px;height:96px}.tk-grid{grid-template-columns:1fr}}\
";

  /* ---------- API（text/plain 免 preflight） ---------- */
  function api(path, body, method) {
    if (C.demo) return DEMO.call(path, body || {});
    var opt = { method: method || (body ? "POST" : "GET") };
    if (body) { opt.headers = { "Content-Type": "text/plain;charset=UTF-8" }; opt.body = JSON.stringify(body); }
    return fetch(C.api + path, opt).then(function (r) { return r.json(); });
  }

  /* ---------- 假資料（?tkdemo=1） ---------- */
  var DEMO = (function () {
    var now = Date.now();
    var ev = [{ id: "meet-20261227", code: "1227", name: "CHANCE 生日會", startAt: (/[?&]tkopen=1/.test(location.search) ? new Date(now + 3600e3).toISOString() : "2026-12-27T13:00:00+08:00"), venue: "微風影城 A 廳", capacity: 181, sold: 81, left: 100, tiers: [
                { key: "vvip", name: "VVIP 守護席", price: 2800, cap: 35, sold: 6, left: 29, numFrom: 1, numTo: 35, perks: ["一對一 60 秒（含合照，官方攝影師拍攝）", "親簽海報＋署名（寫上你的稱呼）", "照片免費（自己的合格合照成片全數下載）", "最先入場"], productKey: "meet-20261227-vvip", onSale: true },
                { key: "vip", name: "VIP", price: 1800, cap: 65, sold: 20, left: 45, numFrom: 36, numTo: 100, perks: ["1:1 官方合照", "親簽海報", "照片免費（自己的合格合照成片全數下載）", "第二批入場"], productKey: "meet-20261227-vip", onSale: true },
                { key: "ga", name: "一般", price: 980, cap: 81, sold: 55, left: 26, numFrom: 101, numTo: 181, perks: ["完整生日活動入場", "可加購生日牆合照（與 CHANCE 合照，NT$390）"], productKey: "meet-20261227-ga", onSale: true } ], productKey: "meet-20261227", onSale: true, photoPrice: 690, photoOnSale: true, ppKey: "pp-meet-20261227" },
              { id: "meet-20270213", code: "0213", name: "THE SKY 專輯聽片會", startAt: "2027-02-13T13:00:00+08:00", venue: "微風影城 A 廳", capacity: 181, sold: 81, left: 100, tiers: [
                { key: "vvip", name: "VVIP 守護席", price: 2800, cap: 35, sold: 6, left: 29, numFrom: 1, numTo: 35, perks: ["一對一 60 秒（含合照，官方攝影師拍攝）", "親簽海報＋署名（寫上你的稱呼）", "照片免費（自己的合格合照成片全數下載）", "最先入場"], productKey: "meet-20270213-vvip", onSale: true },
                { key: "vip", name: "VIP", price: 1800, cap: 65, sold: 20, left: 45, numFrom: 36, numTo: 100, perks: ["1:1 官方合照", "親簽海報", "照片免費（自己的合格合照成片全數下載）", "第二批入場"], productKey: "meet-20270213-vip", onSale: true },
                { key: "ga", name: "一般", price: 980, cap: 81, sold: 55, left: 26, numFrom: 101, numTo: 181, perks: ["完整生日活動入場", "可加購生日牆合照（與 CHANCE 合照，NT$390）"], productKey: "meet-20270213-ga", onSale: true } ], productKey: "meet-20270213", onSale: true, photoPrice: 0, photoOnSale: false, ppKey: "pp-meet-20270213" }];
    var T = [{ id: "1227-DEMO2345", eventId: "meet-20261227", status: "valid", ver: 1, issuedAt: new Date(now - 86400e3).toISOString(), usedAt: null, owner: "you@demo", transferPending: false, tier: "vvip", tierName: "VVIP 守護席", seatNo: 7, seat: "007", perks: ["一對一 60 秒（含合照，官方攝影師拍攝）", "親簽海報＋署名（寫上你的稱呼）", "照片免費（自己的合格合照成片全數下載）", "最先入場"], event: ev[0], qr: "CT1.1227-DEMO2345.1.0123456789abcdef0123", canTransfer: true, expired: false },
             { id: "0901-DEMO6789", eventId: "meet-past", status: "used", ver: 2, issuedAt: new Date(now - 30 * 86400e3).toISOString(), usedAt: "2026-09-01T13:12:00+08:00", owner: "you@demo", transferPending: false, event: { id: "meet-past", code: "0901", name: "THE SKY 上線派對", startAt: "2026-09-01T13:00:00+08:00", venue: "微風 MEGA STUDIO" }, qr: null, canTransfer: false, expired: true }];
    var pending = null, sessions = {}, PP = {};
    return { call: function (p, b) { return new Promise(function (res) { setTimeout(function () { res(route(p, b)); }, 350); }); },
      buyPP: function (email, evId) { (PP[email] = PP[email] || []).push(evId); },
      buyTicket: function (email, evId, tier) { var e = ev.filter(function (x) { return x.id === evId; })[0]; var T2 = (e && e.tiers) ? e.tiers.filter(function (x) { return x.key === tier; })[0] : null; var seatNo = T2 ? (T2.numFrom + T2.sold) : null; var t = { id: (e && e.code || "TK") + "-" + Math.random().toString(36).slice(2, 10).toUpperCase(), eventId: evId, status: "valid", ver: 1, issuedAt: new Date().toISOString(), usedAt: null, owner: email, transferPending: false, tier: tier || null, tierName: T2 ? T2.name : null, seatNo: seatNo, seat: seatNo ? ("00" + seatNo).slice(-3) : null, perks: T2 ? T2.perks : [], event: e, canTransfer: true, expired: false }; t.qr = "CT1." + t.id + ".1.0123456789abcdef0123"; T.push(t); if (T2) { T2.sold++; T2.left = Math.max(0, (T2.left || T2.cap) - 1); } if (e) { e.sold++; } return t; } };
    function route(p, b) {
      if (p === "/ticket/events") return { ok: true, events: ev };
      if (p === "/interest") return { ok: true };
      if (p === "/ticket/otp") return { ok: true, sent: true };
      if (p === "/ticket/login") { if (b.otp && b.otp !== "123456") return { ok: false, error: "otp_wrong" }; var s = "demo-" + b.email; sessions[s] = b.email; if (b.code) T.forEach(function (t) { if (t.owner === "you@demo") t.owner = b.email; }); return { ok: true, session: s, email: b.email }; }
      var me = sessions[b.session] || "you@demo";
      if (p === "/ticket/mine") return { ok: true, email: me, photopass: PP[me] || [], tickets: T.filter(function (t) { return t.owner === me; }).map(function (t) { return Object.assign({}, t, { transferPending: !!(pending && pending.ticketId === t.id) }); }) };
      if (p === "/ticket/transfer/start") { pending = { token: "DEMOTOKEN", code: "DM7K2X", ticketId: b.ticketId, from: me, exp: Date.now() + 600e3 }; return { ok: true, token: pending.token, code: pending.code, exp: pending.exp, url: location.origin + location.pathname + "?tkdemo=1&transfer=DEMOTOKEN", ttl: 600 }; }
      if (p === "/ticket/transfer/cancel") { pending = null; return { ok: true }; }
      if (p.indexOf("/ticket/transfer/peek") === 0) { if (!pending) pending = { token: "DEMOTOKEN", code: "DM7K2X", ticketId: "1227-DEMO2345", from: "you@demo", exp: Date.now() + 600e3 }; if (/code=/.test(p) && !/code=DM7K2X/i.test(p)) return { ok: false, error: "code_wrong" }; return { ok: true, token: pending.token, from: "yo***@demo", exp: pending.exp, ticketId: pending.ticketId, event: ev[0] }; }
      if (p === "/ticket/transfer/accept") { if (!pending) return { ok: false, error: "transfer_expired" }; if (b.code && String(b.code).toUpperCase() !== pending.code) return { ok: false, error: "code_wrong", message: "代碼不對或已過期" }; var t = T.filter(function (x) { return x.id === pending.ticketId; })[0]; if (t.owner === me) return { ok: false, error: "self" }; t.owner = me; t.ver++; pending = null; return { ok: true, ticket: t }; }
      return { ok: false, error: "not_found" };
    }
  })();

  /* ---------- 身分 ---------- */
  function unlockCreds() {
    for (var i = 0; i < C.unlockKeys.length; i++) {
      try { var o = JSON.parse(lsGet(C.unlockKeys[i]) || "null"); if (o && o.email && o.code) return { email: String(o.email).trim().toLowerCase(), code: String(o.code).trim() }; } catch (e) {}
    }
    return null;
  }
  function ensureSession() {
    if (!(C.demo && S.session)) { S.session = lsGet(K.sess); S.email = lsGet(K.email) || ""; }   // demo 自動登入的 session 不要被覆蓋掉
    if (S.session) return Promise.resolve(true);
    var u = unlockCreds();
    if (!u) return Promise.resolve(false);
    return api("/ticket/login", { email: u.email, code: u.code }).then(function (j) {
      if (!j.ok) return false;
      setSession(j.session, j.email); return true;
    }).catch(function () { return false; });
  }
  function setSession(s, email) { S.session = s; S.email = email; lsSet(K.sess, s); lsSet(K.email, email); }
  function clearSession() { S.session = null; S.tickets = []; lsSet(K.sess, null); }

  /* ---------- 資料 ---------- */
  function loadEvents() { return api("/ticket/events").then(function (j) { S.events = (j && j.events) || []; }).catch(function () {}); }
  function loadMine(force) {
    if (!S.session) return Promise.resolve();
    if (!force && Date.now() - S.lastFetch < 2500) return Promise.resolve();
    return api("/ticket/mine", { session: S.session }).then(function (j) {
      if (j && j.error === "no_session") { clearSession(); return; }
      if (j && j.ok) { S.tickets = j.tickets || []; S.photopass = j.photopass || []; S.email = j.email || S.email; S.lastFetch = Date.now(); }
    }).catch(function () {});
  }
  function drawQR(canvas, value, size) { if (!canvas || !window.QRious) return; new QRious({ element: canvas, value: value, size: size * 2, level: "M", background: "#fff", foreground: "#111" }); }
  function msg(sel, t, ok) { var m = $(sel); if (m) { m.textContent = t || ""; m.className = "tk-msg" + (ok ? " ok" : ""); } }
  function sendOtp() {
    var em = ($("#tk-em").value || "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) return msg("#tk-lmsg", "email 格式不對");
    lsSet(K.email, em); $("#tk-send").disabled = true; msg("#tk-lmsg", "寄送中…", true);
    api("/ticket/otp", { email: em }).then(function (j) {
      $("#tk-send").disabled = false;
      if (!j.ok) return msg("#tk-lmsg", j.error === "rate" ? "一分鐘內只能寄一次，等一下再按" : "寄不出去，再試一次");
      msg("#tk-lmsg", "驗證碼已寄到 " + em + "（5 分鐘內有效）", true);
      $("#tk-otpwrap").style.display = "block"; $("#tk-send").style.display = "none"; $("#tk-login-btn").style.display = "block"; $("#tk-otp").focus();
    }).catch(function () { $("#tk-send").disabled = false; msg("#tk-lmsg", "連不上伺服器"); });
  }
  function doLogin() {
    var em = ($("#tk-em").value || "").trim().toLowerCase(), otp = ($("#tk-otp").value || "").trim();
    if (otp.length !== 6) return msg("#tk-lmsg", "驗證碼是 6 位數");
    api("/ticket/login", { email: em, otp: otp }).then(function (j) {
      if (!j.ok) return msg("#tk-lmsg", j.error === "otp_expired" ? "驗證碼過期了，再寄一次" : "驗證碼不對");
      setSession(j.session, j.email); hap(20); toast("登入成功");
      refresh(true);
      if (S.pendingTransfer) acceptIncoming(S.pendingTransfer);
    }).catch(function () { msg("#tk-lmsg", "連不上伺服器"); });
  }
  /* ---------- 買票／加購：確認卡 → 付款 → 回票夾 ---------- */
  function buyEvent(evId) { return eventById(evId) || (ticketsFor(evId)[0] || {}).event || null; }
  function loggedIn() { return !!(S.session || unlockCreds()); }
  function myEmail() { return S.email || (unlockCreds() || {}).email || lsGet(K.email) || ""; }
  function tierSheet(evId) {
    var ev = buyEvent(evId); if (!ev || !ev.tiers) return;
    S.tierEv = evId;
    var rows = ev.tiers.map(function (t) {
      var sold = t.left === 0 || t.onSale === false;
      var perks = (t.perks || []).slice(0, 3).join("・");
      return '<button class="tk-tier' + (sold ? " off" : "") + '"' + (sold ? " disabled" : ' data-sact="tier:' + esc(t.key) + '"') + '>' +
        '<div class="tt"><b>' + esc(t.name) + '</b><span class="pr">NT$' + esc(t.price) + '</span></div>' +
        '<div class="mt">' + (sold ? '<span class="so">已售完</span>' : '剩 ' + (t.left == null ? "—" : t.left) + ' 席') + ' · 終身編號 ' + ("00" + t.numFrom).slice(-3) + '–' + ("00" + t.numTo).slice(-3) + '</div>' +
        (perks ? '<div class="pk">' + esc(perks) + (t.perks.length > 3 ? " …" : "") + '</div>' : '') + '</button>';
    }).join("");
    sheet('<div class="tk-eyebrow">Choose your ticket</div><h3>選擇票種</h3><div class="tk-hint">' + esc(ev.name || "") + '　每個票種每人限 1 張。越早買，終身編號越前面。</div>' +
      '<div class="tk-tierlist">' + rows + '</div><button class="tk-btn g" data-sact="close">關閉</button>');
  }
  function buyConfirm(evId, kind, tier) {
    kind = kind || "meet";
    var ev = buyEvent(evId); if (!ev) return;
    if (kind === "pp" ? !ev.ppKey : !ev.productKey) return;
    if (kind === "meet" && ev.tiers && ev.tiers.length && !tier) return tierSheet(evId);   // 三票種一定要先選票種
    S.buy = { evId: evId, kind: kind, tier: tier || null, otpSent: false };
    confirmSheet();
  }
  function confirmSheet() {
    var b = S.buy; if (!b) return;
    var ev = buyEvent(b.evId), pp = b.kind === "pp";
    var TR = (!pp && b.tier && ev.tiers) ? ev.tiers.filter(function (t) { return t.key === b.tier; })[0] : null;
    var price = pp ? ev.photoPrice : (TR ? TR.price : ev.price);
    var title = pp ? "生日牆合照（PhotoPass）" : (esc(ev.name || "CHANCE") + (TR ? " · " + esc(TR.name) : ""));
    var line = pp ? "《" + esc(ev.name || "") + "》在生日牆與 CHANCE 合照一次" : (md(ev.startAt) + "（" + wk(ev.startAt).slice(-1) + "）" + hm(ev.startAt) + " · " + esc(ev.venue || ""));
    var itemLabel = pp ? "生日牆合照 × 1" : (TR ? esc(TR.name) + " × 1" : "一般入場 × 1");
    var h = '<div class="tk-eyebrow">確認訂單</div><h3>' + title + '</h3>' +
      '<div class="tk-steps"><span class="on">確認</span><i>›</i><span>付款</span><i>›</i><span>' + (pp ? "開通" : "票進票夾") + '</span></div>' +
      '<div class="tk-order"><div class="r"><span>' + esc(line) + '</span></div><div class="r"><span>' + itemLabel + '</span><b>NT$' + esc(price) + '</b></div><div class="r tot"><span>合計</span><b>NT$' + esc(price) + '</b></div></div>';
    if (TR) {
      if (TR.perks && TR.perks.length) h += '<div class="tk-perks"><div class="pt">這個票種享有</div><ul>' + TR.perks.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join("") + '</ul></div>';
      if (TR.numFrom) h += '<div class="tk-seatnote">付款後依付款完成順序配發 <b>終身編號</b>（' + TR.name + ' No.' + ("00" + TR.numFrom).slice(-3) + '–' + ("00" + TR.numTo).slice(-3) + '）；有人退票時，釋出的號碼由下一位遞補。編號隨票轉讓。</div>';
    }
    if (loggedIn()) {
      h += '<div class="tk-to">' + (pp ? "開通後綁定" : "票會寄到") + ' <b>' + esc(maskEmail(myEmail())) + '</b></div>' +
        (pp ? '' : '<div class="tk-to dim">你的稱呼（' + esc(nickHint(TR)) + '）</div>' + nickInput("")) + '<div class="tk-msg" id="tk-bmsg"></div>' +
        '<div class="tk-terms">' + esc(C.terms) + '</div>' +
        '<button class="tk-btn p" data-sact="pay">前往付款 · NT$' + esc(price) + '</button><button class="tk-btn g" data-sact="close">再想想</button>';
    } else {
      h += '<div class="tk-to dim">' + (pp ? "照片會綁在這個 email" : "票會寄到這個 email，也會存進票夾") + '</div>' +
        '<input class="tk-in" id="tk-bem" type="email" inputmode="email" autocomplete="email" autocapitalize="off" spellcheck="false" placeholder="你的 email" value="' + esc(lsGet(K.email) || "") + '">' +
        (pp ? '' : '<div class="tk-to dim">你的稱呼（' + esc(nickHint(TR)) + '）</div>' + nickInput("")) + '<div class="tk-msg" id="tk-bmsg"></div><div class="tk-terms">' + esc(C.terms) + '</div>' +
        '<button class="tk-btn p" data-sact="pay-email">前往付款 · NT$' + esc(price) + '</button><button class="tk-btn g" data-sact="close">取消</button>';
    }
    sheet(h);
    var f = $("#tk-bem");
    if (f) { if (!f.value) setTimeout(function () { f.focus(); }, 60);
      f.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); buyPayEmail(); } }); }
  }

  /* B201：email 常見錯字（gmai.com / yahoo.com.t…）→ 付款前提示一次，不擋 */
  var EM_DOMAINS = ["gmail.com","yahoo.com.tw","yahoo.com","hotmail.com","outlook.com","icloud.com","me.com","msn.com","live.com","pchome.com.tw","kimo.com"];
  function emDist(a, b) {
    var m = a.length, n = b.length, d = [], i, j;
    for (i = 0; i <= m; i++) { d[i] = [i]; }
    for (j = 1; j <= n; j++) d[0][j] = j;
    for (i = 1; i <= m; i++) for (j = 1; j <= n; j++)
      d[i][j] = Math.min(d[i-1][j] + 1, d[i][j-1] + 1, d[i-1][j-1] + (a[i-1] === b[j-1] ? 0 : 1));
    return d[m][n];
  }
  function emSuggest(em) {
    var at = em.lastIndexOf("@"); if (at < 1) return "";
    var dom = em.slice(at + 1); if (EM_DOMAINS.indexOf(dom) >= 0) return "";
    var best = "", bd = 3;
    EM_DOMAINS.forEach(function (x) { var dd = emDist(dom, x); if (dd < bd) { bd = dd; best = x; } });
    return best && bd <= 2 ? em.slice(0, at + 1) + best : "";
  }
  function nickHint(T) { return T && T.key === "vvip" ? "CHANCE 在海報上署名會用這個名字，請確認寫法" : "僅用於本活動（報到與現場使用）"; }
  function nickInput(cls) { var v = (S.buy && S.buy.nick) || lsGet("tk:nick") || ""; return '<input class="tk-in' + (cls ? " " + cls : "") + '" id="tk-bnick" type="text" maxlength="20" autocomplete="nickname" enterkeyhint="done" placeholder="例如：小晞、Amy" value="' + esc(v) + '">'; }
  function fieldErr(el, text) {
    if (!el) { msg("#tk-bmsg", text); return false; }
    var old = el.nextElementSibling; if (old && old.classList && old.classList.contains("tk-ferr")) old.remove();
    var fe = document.createElement("div"); fe.className = "tk-ferr"; fe.textContent = text; el.insertAdjacentElement("afterend", fe);
    el.classList.add("err"); el.setAttribute("aria-invalid", "true");
    try { el.scrollIntoView({ block: "center", behavior: "smooth" }); } catch (e) {} setTimeout(function () { el.focus(); }, 250);
    el.addEventListener("input", function h() { el.classList.remove("err"); el.removeAttribute("aria-invalid"); if (fe.parentNode) fe.remove(); el.removeEventListener("input", h); });
    return false;
  }
  function nickOk() {
    var b = S.buy; if (!b || b.kind === "pp") return true;
    var el = $("#tk-bnick"); if (!el) return true;
    var v = (el.value || "").replace(/[<>]/g, "").replace(/\s+/g, " ").trim();
    if (!v) return fieldErr(el, "請填寫你的稱呼");
    if (v.length > 20) return fieldErr(el, "稱呼最多 20 個字");
    b.nick = v; lsSet("tk:nick", v); return true;
  }
  function buyPayEmail(force) {
    var el = $("#tk-bem");
    var em = ((el || {}).value || "").trim().toLowerCase().replace(/\s+/g, "");
    if (!em) return fieldErr(el, "請填寫收票 email");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) return fieldErr(el, "email 格式不對，再看一下");
    if (!nickOk()) return;
    var sug = force ? "" : emSuggest(em);
    if (sug) {
      S.buy.sug = sug;
      var box = $("#tk-bmsg");
      if (box) { box.className = "tk-msg on"; box.innerHTML = '是不是 <b>' + esc(sug) + '</b>？<span class="tk-emfix"><button class="tk-btn s" data-sact="em-fix" data-em="' + esc(sug) + '">改成這個</button><button class="tk-btn g s" data-sact="em-keep">沒錯，用我打的</button></span>';
        box.querySelectorAll("[data-sact]").forEach(function (x) { x.addEventListener("click", function () { sheetAct2(x.getAttribute("data-sact")); }); }); }
      return;
    }
    S.buy.email = em; lsSet(K.email, em);
    try { localStorage.setItem("tk:pending", JSON.stringify({ email: em, evId: S.buy.evId, kind: S.buy.kind, t: Date.now() })); } catch (e) {}
    var btn = document.querySelector('[data-sact="pay-email"]'); if (btn) { btn.disabled = true; btn.textContent = "前往綠界付款…"; }
    payNow();
  }
  /* 付款回來但這支手機還沒登入 → 驗證一次，把票收進票夾（錢已經付了，不擋付款） */
  function claimSheet(evId, kind) {
    var p = {}; try { p = JSON.parse(localStorage.getItem("tk:pending") || "{}"); } catch (e) {}
    var em = p.email || lsGet(K.email) || "";
    S.claim = { evId: evId, kind: kind, email: em };
    openLayer("wallet");
    sheet('<div class="tk-big"><div class="ic ok">✓</div><div class="tk-eyebrow">Almost there</div><h3>最後一步：收進票夾</h3>' +
      '<div class="tk-hint">付款成功後，' + (kind === "pp" ? "開通通知" : "電子票") + '會寄到 <b>' + esc(maskEmail(em) || "你的信箱") + '</b></div></div>' +
      '<div class="tk-to dim">我們剛寄了 6 位數驗證碼到同一個信箱，輸入後票就收進這支手機。</div>' +
      '<input class="tk-in" id="tk-cotp" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]*" maxlength="6" placeholder="6 位數驗證碼">' +
      '<div class="tk-msg" id="tk-cmsg"></div>' +
      '<button class="tk-btn p" data-sact="claim-verify">收進票夾</button>' +
      '<button class="tk-btn g" data-sact="claim-resend">沒收到？重寄</button>' +
      '<button class="tk-btn g" data-sact="close">稍後再說（票在信箱裡，不會不見）</button>');
    var o = $("#tk-cotp");
    if (o) { setTimeout(function () { o.focus(); }, 80);
      o.addEventListener("input", function () { if (o.value.replace(/\D/g, "").length === 6) claimVerify(); }); }
    if (em) claimSend(true);
  }
  function claimSend(silent) {
    var c = S.claim || {}; if (!c.email) return msg("#tk-cmsg", "找不到你的 email，請到票夾登入");
    if (!silent) msg("#tk-cmsg", "寄送中…", true);
    api("/ticket/otp", { email: c.email }).then(function (j) {
      if (!j.ok) return msg("#tk-cmsg", j.error === "rate" ? "一分鐘內只能寄一次，稍等再按" : "寄不出去，再試一次");
      msg("#tk-cmsg", "驗證碼已寄到 " + maskEmail(c.email), true);
    }).catch(function () { msg("#tk-cmsg", "連不上伺服器"); });
  }
  function claimVerify() {
    var c = S.claim || {}; if (c.busy) return;
    var otp = (($("#tk-cotp") || {}).value || "").replace(/\D/g, "");
    if (otp.length !== 6) return msg("#tk-cmsg", "驗證碼是 6 位數");
    c.busy = true; msg("#tk-cmsg", "驗證中…", true);
    api("/ticket/login", { email: c.email, otp: otp }).then(function (j) {
      c.busy = false;
      if (!j.ok) return msg("#tk-cmsg", j.error === "otp_expired" ? "驗證碼過期了，按重寄" : "驗證碼不對");
      setSession(j.session, j.email); hap(20);
      try { localStorage.removeItem("tk:pending"); } catch (e) {}
      closeSheet(); awaitPurchase(c.evId, c.kind);
    }).catch(function () { c.busy = false; msg("#tk-cmsg", "連不上伺服器"); });
  }
  function buyOtpSend() {
    var em = (($("#tk-bem") || {}).value || "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) return msg("#tk-bmsg", "email 格式不對");
    S.buy.email = em; lsSet(K.email, em); msg("#tk-bmsg", "寄送中…", true);
    api("/ticket/otp", { email: em }).then(function (j) {
      if (!j.ok) return msg("#tk-bmsg", j.error === "rate" ? "一分鐘內只能寄一次，等一下再按" : "寄不出去，再試一次");
      S.buy.otpSent = true; confirmSheet(); msg("#tk-bmsg", "驗證碼已寄到 " + em, true);
    }).catch(function () { msg("#tk-bmsg", "連不上伺服器"); });
  }
  function buyVerifyPay() {
    var em = S.buy.email || (($("#tk-bem") || {}).value || "").trim().toLowerCase();
    var otp = (($("#tk-botp") || {}).value || "").trim();
    if (otp.length !== 6) return msg("#tk-bmsg", "驗證碼是 6 位數");
    msg("#tk-bmsg", "驗證中…", true);
    api("/ticket/login", { email: em, otp: otp }).then(function (j) {
      if (!j.ok) return msg("#tk-bmsg", j.error === "otp_expired" ? "驗證碼過期了，按重寄" : "驗證碼不對");
      setSession(j.session, j.email); hap(20); payNow();
    }).catch(function () { msg("#tk-bmsg", "連不上伺服器"); });
  }
  function payNow() {
    var b = S.buy; if (!b) return;
    var ev = buyEvent(b.evId), pp = b.kind === "pp", key = pp ? ev.ppKey : (b.tier ? (ev.id + "-" + b.tier + (b.tier === "ga" && b.pp && coPPAvail(ev, { key: "ga" }) ? "-pp" : "")) : ev.productKey);
    var email = (!S.session && b.email) ? b.email : myEmail(); if (!email) return msg("#tk-bmsg", "請先確認 email");
    if (C.demo) {   // demo：不跳綠界，模擬付款成功後走跟真實一樣的「輪詢→成功」流程
      closeSheet();
      if (pp) DEMO.buyPP(email, b.evId); else { DEMO.buyTicket(email, b.evId, b.tier); if (b.pp && b.tier === "ga") DEMO.buyPP(email, b.evId); }
      var be = b.evId, bk = b.kind;
      setTimeout(function () { awaitPurchase(be, bk); }, 400);
      return;
    }
    var back = (location.pathname || "/").replace(/^\//, "").slice(0, 40);   // 回到目前這頁（不帶個資）
    fetch(C.api + "/ecpay/create", { method: "POST", headers: { "Content-Type": "text/plain;charset=UTF-8" }, body: JSON.stringify({ productKey: key, email: email, back: back, name: (!pp && b.nick) ? b.nick : "" }) })
      .then(function (r) { return r.text(); })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, "text/html"), form = doc.querySelector("form");
        if (!form) { try { var j = JSON.parse(html); if (j && j.message) { msg("#tk-bmsg", j.message); return; } } catch (e) {} throw 0; }
        var f = document.importNode(form, true); f.style.display = "none"; document.body.appendChild(f); f.submit();
      }).catch(function () { msg("#tk-bmsg", "付款頁開不起來，請稍後再試"); });
  }
  /* 付款回來（?tkbought / ?tkphoto）或 demo 付完：輪詢票夾直到票進來，再跳成功畫面 */
  function awaitPurchase(evId, kind) {
    if (!loggedIn()) return claimSheet(evId, kind);
    openLayer("wallet");
    var before = kind === "pp" ? -1 : ticketsFor(evId).length;
    var tries = 0;
    sheet('<div class="tk-big"><div class="tk-spin"></div><div class="tk-eyebrow">Payment received</div><h3>付款成功，' + (kind === "pp" ? "PhotoPass 開通中…" : "票整理中…") + '</h3><div class="tk-hint">通常幾秒內就好，別關掉這個畫面。</div></div>');
    (function poll() {
      loadMine(true).then(function () {
        var got = kind === "pp" ? (S.photopass.indexOf(evId) >= 0) : (ticketsFor(evId).length > before);
        if (got) { S.layers.forEach(renderLayer); return purchaseDone(evId, kind); }
        if (++tries >= 8) return purchaseSlow(evId, kind);
        setTimeout(poll, 1800);
      }).catch(function () { if (++tries >= 8) purchaseSlow(evId, kind); else setTimeout(poll, 1800); });
    })();
  }
  function purchaseDone(evId, kind) {
    hap([20, 40, 20]); loadMine(true).then(function () { S.layers.forEach(renderLayer); render(); });
    var ev = buyEvent(evId) || {};
    if (kind === "pp") { sheet('<div class="tk-big"><div class="ic ok">✓</div><div class="tk-eyebrow">PhotoPass</div><h3>PhotoPass 已開通</h3><div class="tk-hint">' + esc(ev.name || "") + '<br>活動後照片整理好會出現在票夾 → 過往 → 這場票根裡。</div></div>' + a2hsHint() + '<button class="tk-btn p" data-sact="close">好</button>'); return; }
    var mineEv = ticketsFor(evId), want = S.buy && S.buy.evId === evId ? S.buy.tier : null;
    var nt0 = (want && mineEv.filter(function (x) { return x.tier === want; }).slice(-1)[0]) || mineEv.slice(-1)[0];
    if (nt0 || want) { closeSheet(); S.done = { evId: evId, ticketId: nt0 ? nt0.id : null }; openLayer("done"); return; }
    var t = ticketsFor(evId)[0];
    sheet('<div class="tk-big"><div class="ic ok">✓</div><div class="tk-eyebrow">In your wallet</div><h3>你的票在票夾了</h3><div class="tk-hint">' + esc(ev.name || "CHANCE") + (t && t.tierName ? '　' + esc(t.tierName) : "") + (t && t.seat ? '<br><b style="color:#f0dcaa;font-size:16px">終身編號 No.' + esc(t.seat) + '</b>' : "") + '<br>入場 QR 會在開場前 ' + QR_LOCK_H + ' 小時出現。</div></div>' +
      (t ? '<button class="tk-btn p" data-sact="see-ticket">看我的票</button><button class="tk-btn g" data-sact="give">轉給朋友</button>' : '') + a2hsHint() + '<button class="tk-btn g" data-sact="close">完成</button>');
  }
  function purchaseSlow(evId, kind) {
    sheet('<div class="tk-big"><div class="ic">⏳</div><h3>' + (kind === "pp" ? "PhotoPass 開通處理中" : "票還在路上") + '</h3><div class="tk-hint">付款已收到，' + (kind === "pp" ? "開通" : "票") + '通常一兩分鐘內就進來，也會寄到你的 email。可以按「更新」再看一次。</div></div><button class="tk-btn p" data-sact="repoll" data-ev="' + esc(evId) + '" data-kind="' + esc(kind) + '">更新</button><button class="tk-btn g" data-sact="close">關閉</button>');
  }
  function a2hsHint() {
    var ios = /iPhone|iPad/.test(navigator.userAgent);
    return '<div class="tk-a2hs">📲 <b>加到主畫面</b>，活動當天一點就開票' + (ios ? '：點下方 <b>分享</b> → <b>加入主畫面</b>' : '') + '</div>';
  }

  /* ---------- 轉讓（我給別人） ---------- */
  var sheetEl;
  function sheet(html) {
    if (!sheetEl) { sheetEl = document.createElement("div"); sheetEl.className = "tk-sheet"; sheetEl.addEventListener("click", function (e) { if (e.target === sheetEl) closeSheet(); }); document.body.appendChild(sheetEl); }
    sheetEl.innerHTML = '<div class="tk-box">' + html + '</div>'; sheetEl.classList.add("show");
    sheetEl.querySelectorAll("[data-sact]").forEach(function (b) { b.addEventListener("click", function () { sheetAct2(b.getAttribute("data-sact"), b); }); });
  }
  function closeSheet() { if (sheetEl) sheetEl.classList.remove("show"); stopPoll(); stopScan(); }
  function startTransfer(id) {
    api("/ticket/transfer/start", { session: S.session, ticketId: id }).then(function (j) {
      if (!j.ok) return toast(j.message || (j.error === "expired" ? "開演後 2 小時不能轉讓了" : "現在不能轉讓"));
      S.transfer = { ticketId: id, token: j.token, code: j.code || "", exp: j.exp, url: j.url }; hap(15);
      openTransferSheet(); loadMine(true).then(render);
    }).catch(function () { toast("連不上伺服器"); });
  }
  function openTransferSheet() {
    var tr = S.transfer; if (!tr) return;
    sheet('<div class="tk-eyebrow">Pass this ticket</div><h3>讓朋友掃這個</h3><div class="tk-hint">朋友打開 CHANCE app → 票夾 → <b>＋ 加入票券</b>，用相機掃這個，或輸入下面的代碼。10 分鐘內有效，收下後票就是他的、你的 QR 立刻失效。</div>' +
      '<div class="tk-qrwrap"><div class="tk-qrbox"><canvas id="tk-trqr" width="220" height="220"></canvas></div></div>' +
      (tr.code ? '<div class="tk-codebox"><span>轉讓代碼</span><b>' + esc(tr.code.slice(0, 3)) + ' ' + esc(tr.code.slice(3)) + '</b></div>' : '') +
      '<div class="tk-count" id="tk-cd">10:00</div>' +
      '<button class="tk-btn p" data-sact="copy">複製轉讓連結</button><button class="tk-btn g" data-sact="cancel">取消轉讓</button><button class="tk-btn g" data-sact="close">先關閉（轉讓仍有效）</button>');
    drawQR($("#tk-trqr"), tr.url, 220); countdown(); startPoll();
  }
  function countdown() {
    clearInterval(S.cdTimer);
    S.cdTimer = setInterval(function () {
      var el = $("#tk-cd"); if (!el || !S.transfer) return clearInterval(S.cdTimer);
      var r = Math.max(0, Math.ceil((S.transfer.exp - Date.now()) / 1000));
      el.textContent = r ? ("0" + Math.floor(r / 60)).slice(-2) + ":" + ("0" + r % 60).slice(-2) : "已過期，請重新產生";
      if (!r) clearInterval(S.cdTimer);
    }, 500);
  }
  function startPoll() {
    stopPoll();
    S.pollTimer = setInterval(function () {
      if (!S.transfer) return stopPoll();
      loadMine(true).then(function () {
        var still = S.tickets.some(function (t) { return t.id === S.transfer.ticketId; });
        if (!still) { var id = S.transfer.ticketId; S.transfer = null; stopPoll(); hap([20, 40, 20]); sheet('<div class="tk-big"><div class="ic ok">✓</div><div class="tk-eyebrow">Transfer complete</div><h3>票已經是朋友的了</h3><div class="tk-hint">' + esc(id) + ' 已轉出，你這邊的 QR 已失效。</div></div><button class="tk-btn p" data-sact="close">好</button>'); render(); }
      });
    }, C.pollMs);
  }
  function stopPoll() { clearInterval(S.pollTimer); S.pollTimer = null; }
  function cancelTransfer(id) {
    api("/ticket/transfer/cancel", { session: S.session, ticketId: id }).then(function () { S.transfer = null; closeSheet(); toast("已取消轉讓"); refresh(true); });
  }
  function sheetAct(a) {
    if (a === "close") return closeSheet();
    if (a === "cancel") return S.transfer && cancelTransfer(S.transfer.ticketId);
    if (a === "copy") { var u = S.transfer && S.transfer.url; if (!u) return; (navigator.clipboard ? navigator.clipboard.writeText(u) : Promise.reject()).then(function () { toast("已複製連結"); }).catch(function () { toast("長按上面的連結可以複製"); }); }
    if (a === "accept") return acceptIncoming(S.pendingTransfer);
    if (a === "add") return addSheet();
    if (a === "add-cam") return addSheet("cam");
    if (a === "add-code") return addSheet("code");
    if (a === "add-go") return addGo();
    if (a === "buy-pp") { var evp = S.sel && ticketById(S.sel); closeSheet(); if (evp) buy(evp.eventId, "pp"); return; }
    if (a === "tomerch") { closeSheet(); var nb = $(C.merchNavSel); if (nb) nb.click(); refresh(true); }
  }

  /* ---------- 轉讓（別人給我）?transfer=TOKEN ---------- */
  function loginPartHTML(label) {
    return '<div class="tk-hint" style="margin-top:14px">先用 email 登入（沒買過專輯也可以）：</div><input class="tk-in" id="tk-em2" type="email" inputmode="email" autocomplete="email" placeholder="你的 email" value="' + esc(lsGet(K.email) || "") + '"><div id="tk-otp2wrap" style="display:none"><input class="tk-in" id="tk-otp2" inputmode="numeric" maxlength="6" placeholder="6 位數驗證碼"></div><div class="tk-msg" id="tk-lmsg2"></div><button class="tk-btn p" id="tk-send2" data-sact="otp2">寄驗證碼給我</button><button class="tk-btn p" id="tk-login2" data-sact="login2" style="display:none">' + esc(label || "登入") + '</button>';
  }
  // token（掃連結）或 code（6 碼）都走這裡
  function handleIncoming(token, code) {
    stopScan();
    S.pendingTransfer = token ? { token: token } : { code: code };
    try { if (token) history.replaceState(null, "", location.pathname + (C.demo ? "?tkdemo=1" : "")); } catch (e) {}
    api("/ticket/transfer/peek?" + (token ? "token=" + encodeURIComponent(token) : "code=" + encodeURIComponent(code))).then(function (j) {
      if (!j.ok) { S.pendingTransfer = null; return sheet('<div class="tk-big"><div class="ic">✕</div><h3>' + (token ? "這個轉讓連結已失效" : "代碼不對或已過期") + '</h3><div class="tk-hint">請對方重新產生一次（每次只有 10 分鐘）。</div></div><button class="tk-btn p" data-sact="' + (token ? "close" : "add") + '">' + (token ? "好" : "再試一次") + '</button>'); }
      if (j.token) S.pendingTransfer = { token: j.token };
      var ev = j.event || {};
      ensureSession().then(function (ok) {
        var loginPart = ok ? '<button class="tk-btn p" data-sact="accept">接受這張票</button>' : loginPartHTML("登入並接受");
        sheet('<div class="tk-big"><div class="ic">↘</div><div class="tk-eyebrow">Incoming pass</div><h3>有人要把票給你</h3><div class="tk-hint">' + esc(j.from) + ' 要把「' + esc(ev.name || "CHANCE") + '」的票轉給你。<br>' + esc(fmt(ev.startAt)) + ' · ' + esc(ev.venue || "") + '</div></div>' + loginPart + '<button class="tk-btn g" data-sact="close">先不要</button>');
        if (!ok) bindLogin2(function () { acceptIncoming(S.pendingTransfer); });
      });
    }).catch(function () { toast("連不上伺服器"); });
  }
  function bindLogin2(onDone) {
    $("#tk-send2").addEventListener("click", function () {
      var em = ($("#tk-em2").value || "").trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) return msg("#tk-lmsg2", "email 格式不對");
      lsSet(K.email, em); msg("#tk-lmsg2", "寄送中…", true);
      api("/ticket/otp", { email: em }).then(function (j) {
        if (!j.ok) return msg("#tk-lmsg2", j.error === "rate" ? "一分鐘內只能寄一次" : "寄不出去");
        msg("#tk-lmsg2", "驗證碼已寄出", true); $("#tk-otp2wrap").style.display = "block"; $("#tk-send2").style.display = "none"; $("#tk-login2").style.display = "block"; $("#tk-otp2").focus();
      });
    });
    $("#tk-login2").addEventListener("click", function () {
      var em = ($("#tk-em2").value || "").trim().toLowerCase(), otp = ($("#tk-otp2").value || "").trim();
      api("/ticket/login", { email: em, otp: otp }).then(function (j) {
        if (!j.ok) return msg("#tk-lmsg2", "驗證碼不對或過期");
        setSession(j.session, j.email); hap(20); if (onDone) onDone();
      });
    });
  }
  function acceptIncoming(pt) {
    if (!pt || !S.session) return;
    var payload = { session: S.session }; if (pt.token) payload.token = pt.token; else payload.code = pt.code;
    api("/ticket/transfer/accept", payload).then(function (j) {
      S.pendingTransfer = null;
      if (!j.ok) { var m = { self: "這張票本來就是你的", transfer_expired: "轉讓已失效，請對方重新產生", transfer_invalid: "轉讓已被取消或已完成", expired: "這場已經結束了", code_wrong: "代碼不對或已過期", locked: "輸錯太多次，10 分鐘後再試" }[j.error] || j.message || "接受失敗"; return sheet('<div class="tk-big"><div class="ic">✕</div><h3>' + esc(m) + '</h3></div><button class="tk-btn p" data-sact="close">好</button>'); }
      hap([20, 40, 20]);
      sheet('<div class="tk-big"><div class="ic ok">✓</div><div class="tk-eyebrow">Transfer complete</div><h3>這張票是你的了</h3><div class="tk-hint">' + esc((j.ticket && j.ticket.id) || "") + '<br>入場時到 SHOP → 票夾 出示 QR。</div></div><button class="tk-btn p" data-sact="tomerch">看我的票</button>');
      refresh(true);
    }).catch(function () { toast("連不上伺服器"); });
  }

  /* ---------- ＋ 加入票券：相機掃朋友的轉讓 QR，或輸入 6 碼 ---------- */
  var scanOn = false, scanLoading = null;
  function loadScan() {
    if (window.TKScan) return Promise.resolve();
    if (scanLoading) return scanLoading;
    scanLoading = new Promise(function (res, rej) { var sc = document.createElement("script"); sc.src = C.base + C.scanFile; sc.onload = function () { window.TKScan ? res() : rej(); }; sc.onerror = rej; document.head.appendChild(sc); });
    return scanLoading;
  }
  function addSheet(tab) {
    stopScan();
    S.addTab = tab || S.addTab || "cam";
    var cam = S.addTab === "cam";
    var h = '<div class="tk-eyebrow">Link a ticket</div><h3>加入票券</h3><div class="tk-hint">朋友要把票轉給你？掃他螢幕上的轉讓 QR，或輸入他給你的 6 位代碼。</div>' +
      '<div class="tk-tabs"><button class="' + (cam ? "on" : "") + '" data-sact="add-cam">📷 相機</button><button class="' + (!cam ? "on" : "") + '" data-sact="add-code">⌨️ 輸入代碼</button></div>';
    if (!S.session) h += loginPartHTML("登入") + '<button class="tk-btn g" data-sact="close">關閉</button>';
    else if (cam) h += '<div class="tk-cam"><video id="tk-cam" playsinline muted autoplay></video><div class="fr"></div><div class="tk-camtxt" id="tk-camtxt">正在開啟相機…</div></div><div class="tk-tiny" style="text-align:center;margin-top:8px">對準朋友螢幕上的 QR</div><button class="tk-btn g" data-sact="close">關閉</button>';
    else h += '<form onsubmit="return false"><input class="tk-in tk-codein" id="tk-code" inputmode="latin" autocapitalize="characters" autocorrect="off" spellcheck="false" maxlength="7" placeholder="例如 K7X 2M9"><div class="tk-msg" id="tk-cmsg"></div><button class="tk-btn p" data-sact="add-go">收下這張票</button></form><button class="tk-btn g" data-sact="close">關閉</button>';
    sheet(h);
    if (!S.session) { bindLogin2(function () { addSheet(S.addTab); }); return; }
    if (cam) startScan(); else { var inp = $("#tk-code"); if (inp) { inp.focus(); inp.addEventListener("input", function () { var v = inp.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6); inp.value = v.length > 3 ? v.slice(0, 3) + " " + v.slice(3) : v; }); } }
  }
  function startScan() {
    var txt = $("#tk-camtxt"), v = $("#tk-cam"); if (!v) return;
    // iOS：getUserMedia 一定要在點擊當下同步呼叫，不能等 script 載完再叫（否則被判定不是使用者手勢而擋掉）→ 進票夾就先預載
    var go = function () {
      scanOn = true;
      window.TKScan.start(v, function (text) { if (!scanOn) return; onScanned(text); })
        .then(function () { if (txt) txt.textContent = ""; })
        .catch(function (e) { scanOn = false; if (txt) txt.textContent = (e && (e.name === "NotAllowedError" || e.name === "SecurityError")) ? "相機權限被拒 → 改用「輸入代碼」，或到 iPhone 設定→Safari→相機 開權限" : "這台手機開不了相機，改用「輸入代碼」"; });
    };
    if (window.TKScan) return go();
    if (txt) txt.textContent = "載入相機…";
    loadScan().then(go).catch(function () { if (txt) txt.textContent = "相機元件載入失敗，改用「輸入代碼」"; });
  }
  function stopScan() { scanOn = false; try { window.TKScan && window.TKScan.stop(); } catch (e) {} }
  function onScanned(text) {
    var m = /[?&]transfer=([A-Za-z0-9]+)/.exec(text);
    if (m) { hap(20); return handleIncoming(m[1]); }
    if (/^CT1\./.test(text)) { hap(40); var t = $("#tk-camtxt"); if (t) t.textContent = "這是入場 QR，不是轉讓 QR"; return; }
    var c = String(text).trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (/^[A-Z2-9]{6}$/.test(c)) { hap(20); return handleIncoming(null, c); }
    var t2 = $("#tk-camtxt"); if (t2) t2.textContent = "看不懂這個 QR";
  }
  function addGo() {
    var c = (($("#tk-code") || {}).value || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (c.length !== 6) return msg("#tk-cmsg", "代碼是 6 位（沒有 0 和 O、1 和 I）");
    handleIncoming(null, c);
  }
  function ppOwned(evId) { return S.photopass.indexOf(evId) >= 0; }
  function ppIncluded(evId) { return ticketsFor(evId).some(function (t) { return t.tier === "vvip" || t.tier === "vip"; }); }
  function photoQrSheet() {
    var t = ticketById(S.sel); if (!t) return;
    var ev = Object.assign({}, eventById(t.eventId) || {}, t.event || {});
    sheet('<div class="tk-eyebrow">PhotoPass</div><h3>拍照前，給攝影師拍這個</h3><div class="tk-hint">輪到你拍照時（合照或生日牆），先把這個畫面舉起來讓攝影師拍一張，照片才會對到你。' + (ppIncluded(t.eventId) ? '<br>你的合照成片活動後可在 App 免費下載。' : '') + '</div>' +
      '<div class="tk-qrwrap"><div class="tk-qrbox"><canvas id="tk-ppqr" width="220" height="220"></canvas></div></div><div class="tk-codebox"><span>票號</span><b style="font-size:22px">' + esc(t.id) + '</b></div>' +
      '<button class="tk-btn p" data-sact="close">好了</button>');
    drawQR($("#tk-ppqr"), "CP1." + t.id, 220);
  }

  /* ---------- toast ---------- */
  var toastEl, toastT;
  function toast(t) { if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "tk-toast"; document.body.appendChild(toastEl); } toastEl.textContent = t; toastEl.classList.add("in"); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("in"); }, 2200); }

  /* ---------- 共用小工具 ---------- */
  var QR_LOCK_H = 3;   // 開場前幾小時才出現 QR（0 = 永遠顯示）
  function cssId(s) { return String(s).replace(/[^A-Za-z0-9]/g, "_"); }
  function maskEmail(e) { var p = String(e || "").split("@"); if (p.length < 2) return "—"; return p[0].slice(0, 3) + "••••@" + p[1]; }
  function tw(iso) { var d = new Date(typeof iso === "string" ? twParse(iso) : iso); if (isNaN(d)) return null; return new Date(d.getTime() + 8 * 3600e3); }
  function md(iso) { var t = tw(iso); return t ? (t.getUTCMonth() + 1) + "/" + t.getUTCDate() : ""; }
  function wk(iso) { var t = tw(iso); return t ? "星期" + "日一二三四五六"[t.getUTCDay()] : ""; }
  function hm(iso) { var t = tw(iso); return t ? ("0" + t.getUTCHours()).slice(-2) + ":" + ("0" + t.getUTCMinutes()).slice(-2) : ""; }
  function twParse(v) { if (!v) return NaN; var x = String(v); if (/T\d\d:\d\d(:\d\d)?$/.test(x)) x += "+08:00"; return Date.parse(x); }   // 沒寫時區的一律當台北時間
  function jget(k) { try { return JSON.parse(lsGet(k) || "null") || {}; } catch (e) { return {}; } }
  function startMs(ev) { var v = ev && ev.startAt ? Date.parse(ev.startAt) : NaN; return isNaN(v) ? null : v; }
  function closeMs(ev) { var s = startMs(ev); return s == null ? null : s + 2 * 3600e3; }
  function openMs(ev) { var s = startMs(ev); return s == null ? null : s - QR_LOCK_H * 3600e3; }
  var TK_TEST = /test\.html/.test(location.pathname) && /[?&]tktest=1/.test(location.search);   /* 只在 test.html 有效：購買後立刻看得到入場 QR 與拍照用 QR（測試用） */
  function qrUnlocked(ev) { if (!QR_LOCK_H || TK_TEST) return true; var o = openMs(ev); return o == null || Date.now() >= o; }
  function isEventDay(ev) { var s = startMs(ev); if (s == null) return false; var n = Date.now(); return n >= s - 24 * 3600e3 && n <= s + 2 * 3600e3; }
  function parts(ms) { ms = Math.max(0, ms); return { d: Math.floor(ms / 864e5), h: Math.floor(ms % 864e5 / 36e5), m: Math.floor(ms % 36e5 / 6e4) }; }
  function cdHTML(to, cls) { var p = parts(to - Date.now()); return '<div class="' + cls + '" data-cd="' + to + '"><div><b>' + p.d + '</b><span>天</span></div><div><b>' + p.h + '</b><span>時</span></div><div><b>' + p.m + '</b><span>分</span></div></div>'; }
  function evKind(ev) { var n = String(ev && ev.name || ""); if (/生日/.test(n)) return { cls: "gold", lab: "BIRTHDAY", dot: "" }; if (/聽片|THE SKY/i.test(n)) return { cls: "pu", lab: "THE SKY", dot: "pu" }; return { cls: "gold", lab: "MEET", dot: "" }; }
  function refresh(force) {
    if (S.loading) return; S.loading = true; render();
    ensureSession().then(function () { return Promise.all([loadEvents(), loadMine(force)]); })
      .then(function () { S.loading = false; render(); });
  }
  function isLive(t) { return t.status === "valid" && !t.expired; }
  function validTickets() { return S.tickets.filter(isLive); }
  function pastTickets() { return S.tickets.filter(function (t) { return !isLive(t); }); }
  function ticketById(id) { return S.tickets.filter(function (t) { return t.id === id; })[0] || null; }
  function ticketsFor(evId) { return validTickets().filter(function (t) { return t.eventId === evId; }); }
  function eventById(id) { return S.events.filter(function (e) { return e.id === id; })[0] || null; }
  /* 即將到來的活動 = 還沒結束的場次 ＋ 我手上有效票的場次 */
  function upcoming() {
    var map = {};
    S.events.forEach(function (e) { var c = closeMs(e); if (c == null || c > Date.now()) map[e.id] = e; });
    validTickets().forEach(function (t) { if (!map[t.eventId]) map[t.eventId] = Object.assign({ id: t.eventId }, t.event || {}); });
    return Object.keys(map).map(function (k) { return map[k]; }).sort(function (a, b) { return String(a.startAt || "").localeCompare(String(b.startAt || "")); });
  }
  function nextMine() { var v = validTickets().slice().sort(function (a, b) { return String(a.event && a.event.startAt || "").localeCompare(String(b.event && b.event.startAt || "")); }); return v[0] || null; }

  /* ---------- 提醒（本機記住＋送到後台登記，粉絲不用重按） ---------- */
  function remindKey(k) { return "tk:rm:" + k; }
  function reminded(k, ev) {
    if (lsGet(remindKey(k))) return true;
    if (ev && /聽片/.test(ev.name || "") && lsGet("album-the-sky:interest")) return true;   // 舊「我想去」＝2/13 聽片會提醒
    return false;
  }
  function setRemind(k) {
    lsSet(remindKey(k), "1"); hap(15); toast("開賣時會通知你 ✓");
    var em = S.email || (unlockCreds() || {}).email || lsGet(K.email) || "";
    if (em) api("/interest", { email: em, event: String(k).slice(0, 40) }).catch(function () {});
  }

  /* ---------- 周邊資料（讀 app 既有設定與購買紀錄，不寫死） ---------- */
  function merchItems() {
    // Design fixtures are opt-in, ticket-demo-only, and never saved as ownership.
    if (C.demo && /[?&]shopdemo=design(?:&|$)/.test(location.search) && window.THE_SKY_SHOP) return window.THE_SKY_SHOP.demoItems.map(function(i){return Object.assign({},i);});
    var CFG = window.ALBUM_CONFIG || {}, M = CFG.merch || {}, owned = jget(C.merchKey), un = jget(C.unlockKeys[0]), fp = jget(C.unlockKeys[1]);
    var list = [
      { key: "album", idx: -1, name: CFG.albumTitle || "THE SKY", type: "digital", label: "數位特典", desc: "數位專輯", img: CFG.coverPoster || CFG.coverImage || "", owned: !!un.unlocked, since: un.ts || null, benefits: ["完整專輯線上收聽", "每日抽卡・小卡收藏"], go: "player" },
      { key: "signal", idx: -1, name: "SIGNAL", type: "digital", label: "數位特典", desc: "Chance 私訊頻道", img: "assets/images/avatar.jpg", owned: !!(fp.unlocked || fp.full), since: fp.ts || null, benefits: ["Chance 的私訊頻道", "獨家影片・語音"], go: "mood" },
    ];
    (M.items || []).forEach(function (it, idx) {
      if (!it.productKey || String(it.productKey).indexOf("ticket") === 0) return;   // 票不算周邊
      var rec = owned[it.productKey];
      if (it.hidden && !rec) return;
      var drop = it.dropAt ? twParse(it.dropAt) : NaN;
      var soon = !rec && ((M.comingSoon && !it.onSale) || it.comingSoon || (!isNaN(drop) && drop > Date.now()));
      var sold = !rec && it.limited && it.left === 0;
      list.push({ key: it.productKey, idx: idx, name: it.name || it.productKey, type: "physical", label: it.serial ? "限量周邊" : "實體收藏", desc: it.desc || "", img: it.image || "", owned: !!rec,
        since: rec && (rec.ts || rec.at) || null, serial: rec && rec.serial || null, order: rec && (rec.orderRef || rec.code || rec.merchantTradeNo) || null, benefits: [], go: null,
        dropAt: isNaN(drop) ? null : it.dropAt, soon: soon, sold: sold, price: it.price, limited: it.limited, serialAll: !!it.serial });
    });
    return list;
  }
  function cabinet() { var l = merchItems(); return { all: l, owned: l.filter(function (i) { return i.owned; }) }; }
  function dropLabel(i) { if (i.type === "digital") return i.label; if (i.sold) return "SOLD OUT"; if (i.dropAt) { var t = tw(i.dropAt); return (t.getUTCMonth() + 1) + "/" + t.getUTCDate() + " " + hm(i.dropAt); } return i.limited ? "ONLY " + i.limited : "即將上架"; }
  function itemBtn(i) {
    if (i.owned) return "";
    if (i.type === "digital") return '<button class="ibtn buy" data-act="goto" data-go="purchase">去解鎖</button>';
    if (i.sold) return '<button class="ibtn" disabled>SOLD OUT</button>';
    if (!i.soon && i.price) return '<button class="ibtn buy" data-act="mbuy" data-key="' + esc(i.key) + '">NT$' + esc(i.price) + ' 購買</button>';
    return reminded("merch-" + i.key) ? '<button class="ibtn done" data-act="noop">✓ 已設定提醒</button>' : '<button class="ibtn" data-act="mremind" data-key="' + esc(i.key) + '">開賣時通知我</button>';
  }

  /* ---------- 收藏首頁 ---------- */
  var root, body;
  function mount() {
    if (document.getElementById("tk-root")) return;
    var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
    var design = document.createElement("link"); design.rel = "stylesheet"; design.href = C.base + "shop-design.css?v=B202T"; document.head.appendChild(design);
    var edition = document.createElement('link'); edition.rel='stylesheet';edition.href=C.base+'shop-edition.css?v=B202T';document.head.appendChild(edition);
    root = document.createElement("div"); root.id = "tk-root"; root.className = "tk";
    var host = $(C.mount), before = host && $(C.before, host);
    if (host && before) host.insertBefore(root, before); else (host || document.body).appendChild(root);
    body = root;
    root.addEventListener("click", onClick);
    var lay = document.createElement("div"); lay.id = "tk-layers"; document.body.appendChild(lay);
    lay.addEventListener("click", onClick);
    lay.addEventListener("submit", function (e) { e.preventDefault(); });
    document.addEventListener("keydown", shopKeys);
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" || !e.target || !e.target.closest || !e.target.closest(".tk-layer[data-layer=checkout]")) return;
      if (e.target.id === "tk-bem") { e.preventDefault(); var n = $("#tk-bnick"); if (n) n.focus(); }
      else if (e.target.id === "tk-bnick") { e.preventDefault(); startPayment(); }
    });
  }
  
function dataNotice() {
    return (C.demo ? '<p class="tk-demo" role="status">DEMO 設計示範 · 收藏與票券皆非真實權限，不能入場</p>' : '') +
      (S.eventsError || S.mineError ? '<div class="tk-error" role="status">' + esc(S.eventsError || S.mineError) + '<button data-act="retry-data">重新載入</button></div>' : '');
  }


function shopKeys(e) {
    var topSheet = sheetEl && sheetEl.classList.contains('show') ? sheetEl : null;
    var activeLayer = S.layers.length ? layerEl(S.layers[S.layers.length-1]) : null;
    var scope = topSheet || activeLayer;
    if(e.key==='Escape' && scope){e.preventDefault();if(topSheet)closeSheet();else back();return;}
    if((e.key==='Enter'||e.key===' ') && e.target.matches('[role="button"][data-act]')){e.preventDefault();e.target.click();return;}
    if(e.key==='Tab' && scope){var items=Array.from(scope.querySelectorAll('button:not(:disabled),input,summary,a[href],[tabindex="0"]')).filter(function(x){return x.getClientRects().length&&!x.closest('[inert]');});if(!items.length)return;var first=items[0],last=items[items.length-1];if(e.shiftKey&&(document.activeElement===first||!scope.contains(document.activeElement))){e.preventDefault();last.focus();}else if(!e.shiftKey&&(document.activeElement===last||!scope.contains(document.activeElement))){e.preventDefault();first.focus();}}
  }

function render() {
    if (!body) return;
    var vt = validTickets(), mine = nextMine(), ups = upcoming(), cab = cabinet();
    var nextEv = mine ? Object.assign({}, eventById(mine.eventId) || {}, mine.event || {}) : ups[0];
    var drops = cab.all.filter(function (i) { return !i.owned && i.soon && i.dropAt; }).sort(function (a, b) { return twParse(a.dropAt) - twParse(b.dropAt); });
    var dropLine = drops.length ? drops[0].name.replace(/^THE SKY\s*/, "") + " " + md(drops[0].dropAt) + " 開賣" : "實體與數位特典";
    body.innerHTML = referenceCoverHTML(vt, mine, nextEv, cab, dropLine);
    S.coverClock = coverClockKey();
    S.layers.forEach(function (l) { renderLayer(l); });
  }
  /* B200T：SHOP 首頁 v3 樣式，隨 JS 注入 */
  (function(){ if(document.getElementById('sv3-style')) return; var st=document.createElement('style'); st.id='sv3-style'; st.textContent="/* B200T · SHOP 首頁 v3（文字可改；校準 853×1844×0.504→430） */\n#tk-root:has(> .sv3){padding:0}\n.sv3{--sv3-bg:#0B090D;--sv3-ink:#F3EEEA;--sv3-soft:#CFC7D4;--sv3-dim:#9A93A8;--sv3-gold:#E8BF7A;--sv3-gl:rgba(232,191,122,.55);--sv3-gf:rgba(232,191,122,.22);--sv3-pad:5.35%;\n  position:relative;width:100%;margin:0;min-height:100%;background:var(--sv3-bg);color:var(--sv3-ink);\n  font-family:'Noto Sans TC',-apple-system,'PingFang TC',sans-serif;font-size:14px;line-height:1.7;-webkit-font-smoothing:antialiased;\n  padding-bottom:calc(126px + env(safe-area-inset-bottom))}\n.sv3 *{box-sizing:border-box}\n.sv3 button{font-family:inherit;cursor:pointer;border:0;background:none;color:inherit;text-align:left;padding:0;margin:0;-webkit-tap-highlight-color:transparent}\n.sv3 img{display:block;max-width:100%}\n.sv3 .bd{font-family:'Bodoni Moda','Noto Serif TC',serif;font-weight:400;font-optical-sizing:none;font-variation-settings:\"opsz\" 11}\n.sv3-bg{position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden}\n.sv3-bg-img{position:absolute;top:-2%;left:-4%;width:112%;height:auto;filter:contrast(1.05) saturate(.9)}\n.sv3-bg-left{position:absolute;inset:0;background:linear-gradient(98deg,rgba(11,9,13,.86) 0%,rgba(11,9,13,.56) 22%,rgba(11,9,13,.1) 46%,transparent 62%)}\n.sv3-bg-fade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,9,13,.30) 0%,rgba(11,9,13,.08) 14%,rgba(11,9,13,.18) 40%,rgba(11,9,13,.46) 52%,rgba(11,9,13,.78) 63%,rgba(11,9,13,.95) 74%,#0B090D 82%)}\n.sv3-wrap{position:relative;z-index:2;padding:0 var(--sv3-pad)}\n.sv3-cover{position:relative}\n.sv3-cover::before{content:'';float:left;padding-top:123.7%}\n.sv3-cover::after{content:'';display:table;clear:both}\n.sv3-top{padding-top:21px}\n.sv3-brand{font-size:10.5px;letter-spacing:.28em;line-height:1.4;color:var(--sv3-gold);text-transform:uppercase;margin:0 0 9px;white-space:nowrap}\n.sv3-h1{font-family:'Noto Serif TC',serif;font-weight:500;font-size:51px;line-height:1.08;letter-spacing:.08em;color:var(--sv3-gold);white-space:nowrap;margin:0;text-shadow:0 2px 22px rgba(0,0,0,.55)}\n.sv3-sub{font-family:'Noto Serif TC',serif;font-weight:400;font-size:12.5px;letter-spacing:.14em;line-height:1.7;color:var(--sv3-ink);margin:6px 0 0;text-shadow:0 1px 10px rgba(0,0,0,.6)}\n.sv3-side-l{margin-top:6px}\n.sv3-rule{width:1px;height:37px;background:var(--sv3-gl);margin-bottom:9px}\n.sv3-side-en{font-size:8.5px;letter-spacing:.2em;line-height:1.6;color:var(--sv3-gold);text-transform:uppercase}\n.sv3-side-en .dash{display:block;width:10px;height:1px;background:var(--sv3-gl);margin-top:9px}\n.sv3-ts{position:absolute;top:22px;right:0;width:56px;height:56px;z-index:3}\n.sv3-ts img{width:56px;height:56px}\n.sv3-side-zh{position:absolute;top:108px;right:0;width:12px;z-index:3;display:flex;flex-direction:column;align-items:center;font-family:'Noto Serif TC',serif;font-weight:400;font-size:9px;line-height:12px;color:var(--sv3-ink);text-shadow:0 1px 10px rgba(0,0,0,.9)}\n.sv3-side-zh span{display:block;height:12px}\n.sv3-side-zh .vd{width:1px;height:10px;background:var(--sv3-gl);margin:3px 0 5px;display:block}\n.sv3-side-zh .pd{height:12px;position:relative}\n.sv3-side-zh .pd::after{content:'';position:absolute;left:5px;top:6px;width:2px;height:2px;border-radius:50%;background:var(--sv3-ink)}\n.sv3-sig{position:absolute;right:-2px;top:75.8%;width:84px;z-index:3;opacity:.96}\n.sv3-higher{position:absolute;right:3px;top:89.7%;width:40px;z-index:3;font-size:7.5px;letter-spacing:.18em;line-height:1.7;color:var(--sv3-ink);text-align:left;text-transform:uppercase;text-shadow:0 1px 8px rgba(0,0,0,.85)}\n.sv3-higher::after{content:'';display:block;width:24px;height:1px;background:var(--sv3-gl);margin-top:8px}\n.sv3-sec{position:relative}\n.sv3-sec-hd{display:flex;align-items:center;gap:14px;margin-bottom:13px}\n.sv3-sec-num{font-size:10.5px;letter-spacing:.24em;color:var(--sv3-gold);text-transform:uppercase;white-space:nowrap}\n.sv3-sec-line{flex:1;height:1px;background:linear-gradient(90deg,var(--sv3-gl),rgba(232,191,122,.15))}\n.sv3-block{display:block;width:100%;position:relative}\n.sv3-block:active{opacity:.85}\n.sv3-block[disabled]{cursor:default}\n.sv3-grid{display:grid;grid-template-columns:minmax(160px,1fr) min(190px,44%);gap:12px;align-items:start}\n.sv3-block-h{font-family:'Noto Serif TC',serif;font-weight:500;font-size:26px;line-height:1.28;letter-spacing:.03em;color:var(--sv3-ink);margin:0 0 9px;text-shadow:0 2px 14px rgba(0,0,0,.5)}\n.sv3-block-m{font-family:'Noto Sans TC',sans-serif;font-weight:400;font-size:13.5px;line-height:1.7;letter-spacing:0;color:var(--sv3-soft);margin:0}\n.sv3-block-m .num{font-family:'Bodoni Moda',serif;font-weight:400;font-optical-sizing:none;font-variation-settings:\"opsz\" 11;font-size:15px;color:var(--sv3-gold)}\n.sv3-go{display:inline-flex;align-items:center;gap:8px;margin-top:14px;font-family:'Noto Sans TC',sans-serif;font-size:14px;letter-spacing:.04em;color:var(--sv3-gold);padding-bottom:6px;border-bottom:1px solid var(--sv3-gl)}\n.sv3-go i{font-style:normal;font-size:15px}\n.sv3-go.on{animation:sv3glow 2.8s ease-in-out infinite}\n@keyframes sv3glow{0%,100%{text-shadow:none}50%{text-shadow:0 0 14px rgba(232,191,122,.55)}}\n.sv3-ticket{width:100%;transform:rotate(-7deg);transform-origin:60% 40%;filter:drop-shadow(0 12px 22px rgba(0,0,0,.55));margin-top:4px}\n.sv3-ticket svg{width:100%;height:auto;display:block}\n.sv3-merch-grid{grid-template-columns:minmax(160px,1fr) min(190px,44%)}\n#sv3-merch .sv3-sec-hd{margin-bottom:8px}\n#sv3-merch .sv3-block-h{margin-bottom:6px}\n#sv3-merch .sv3-go{margin-top:10px}\n#sv3-merch{padding-bottom:24px}\n.sv3-merch-wrap{position:absolute;right:-6px;top:-72px;width:min(216px,50%);aspect-ratio:567/640;transform:rotate(1.5deg);filter:drop-shadow(0 14px 24px rgba(0,0,0,.55));z-index:1;pointer-events:none}\n.sv3-merch-wrap img{width:100%;height:100%;object-fit:cover;border-radius:3px}\n.sv3-divide{height:1px;background:linear-gradient(90deg,var(--sv3-gf),transparent);margin:10px 0 10px}\n@media (min-width:431px){.sv3-h1{font-size:56px}.sv3-block-h{font-size:29px}.sv3-sub{font-size:13.5px}.sv3-block-m{font-size:14.5px}}\n@media (max-width:399px){.sv3-h1{font-size:46px}.sv3-block-h{font-size:24px}.sv3-sig{width:76px}}\n@media (max-width:359px){.sv3{--sv3-pad:5.6%}.sv3-brand{font-size:9.5px;letter-spacing:.24em}.sv3-h1{font-size:38px}.sv3-sub{font-size:11.5px}.sv3-block-h{font-size:21px}.sv3-block-m{font-size:12.5px}.sv3-grid,.sv3-merch-grid{grid-template-columns:minmax(128px,1fr) min(160px,44%);gap:10px}.sv3-sig{width:64px}.sv3-side-zh{top:100px}}\n@media (prefers-reduced-motion:reduce){.sv3-go.on{animation:none}}\n"; document.head.appendChild(st); })();

function referenceCoverHTML(vt, mine, ev, cab, dropLine) {
    var proof = /[?&]shopcover=reference(?:&|$)/.test(location.search);
    var stat = S.loading && !S.tickets.length && !S.events.length ? '載入中…' : vt.length ? vt.length + ' 張有效票券' : '還沒有票';
    var eventLine = ev ? md(ev.startAt) + ' · ' + (ev.name || 'CHANCE') : S.loading ? '活動載入中…' : '新活動即將公布';
    var days = ev && startMs(ev) ? String(Math.max(0, Math.ceil((startMs(ev) - Date.now()) / 864e5))) : '—';
    var count = cab.owned.length + ' / ' + cab.all.length + ' 已收藏';
    var action = mine && isEventDay(ev) ? 'open-now' : 'open-wallet';
    var _tiers = (ev && ev.tiers) || null;
    var _minP = _tiers && _tiers.length ? Math.min.apply(null, _tiers.map(function(t){return +t.price||0;}).filter(function(n){return n>0;})) : (ev && ev.price || 0);
    var _onSale = _tiers && _tiers.length ? _tiers.some(function(t){return t.onSale;}) : (ev && ev.onSale);
    var _soldOut = _tiers && _tiers.length ? _tiers.every(function(t){return t.left===0;}) : false;
    var _ctaLabel = mine ? ('查看我的票' + (mine.seatNo ? ' · No.' + ('00'+mine.seatNo).slice(-3) : ''))
                    : _soldOut ? '已售完'
                    : _onSale ? ('立即購票 · NT$' + (_minP? _minP.toLocaleString('en-US') : '') + ' 起')
                    : '即將開賣 · 設定提醒';
    var _ctaAct = mine ? 'open-now' : 'open-buy';
    var T = SHOP_TEXT, A = T.assets;
    var goLabel = mine ? (T.goMine + (mine.seatNo ? ' · No.' + ('00'+mine.seatNo).slice(-3) : ''))
                : _soldOut ? T.goSoldOut : _onSale ? T.goTickets : T.goRemind;
    var evName  = ev ? (ev.name || 'CHANCE') : (S.loading ? '載入中…' : '尚未公布活動');
    var evDate  = ev ? (md(ev.startAt) + '（' + wk(ev.startAt) + '）' + hm(ev.startAt)) : '';
    var evVenue = ev ? ((ev.venue || '') + (ev.capacity ? ' · ' + ev.capacity + ' 席' : '')) : '';
    var evPrice = _minP ? '<span class="num">NT$' + _minP.toLocaleString('en-US') + '</span> 起' : '';
    var zhParts = String(T.sideZh).split('｜');
    var zhHTML  = zhParts.map(function(part, idx){
      var chars = part.split('').map(function(c){ return c === '。' ? '<span class="pd"></span>' : '<span>' + esc(c) + '</span>'; }).join('');
      return chars + (idx < zhParts.length-1 ? '<i class="vd"></i>' : '');
    }).join('');
    var merchSub = esc(count) + (dropLine ? '<br>' + esc(dropLine) : '');
    return '<div class="sv3">' +
      '<div class="sv3-bg"><img class="sv3-bg-img" src="' + esc(A.portrait) + '" alt=""><div class="sv3-bg-left"></div><div class="sv3-bg-fade"></div></div>' +
      '<div class="sv3-wrap">' +
        '<section class="sv3-cover">' +
          '<header class="sv3-top"><div class="sv3-brand bd">' + esc(T.brand) + '</div><h1 class="sv3-h1">' + esc(T.title) + '</h1><p class="sv3-sub">' + esc(T.subtitle) + '</p></header>' +
          '<div class="sv3-side-l"><div class="sv3-rule"></div><div class="sv3-side-en bd">' + T.sideEn.map(esc).join('<br>') + '<span class="dash"></span></div></div>' +
          '<button class="sv3-ts" data-act="profile" aria-label="帳號"><img src="' + esc(A.logo) + '" alt="T｜S"></button>' +
          '<div class="sv3-side-zh" aria-label="' + esc(T.sideZh.replace('｜','，')) + '">' + zhHTML + '</div>' +
          '<img class="sv3-sig" src="' + esc(A.signature) + '" alt="The Sky">' +
          '<div class="sv3-higher bd">' + T.higher.map(esc).join('<br>') + '</div>' +
        '</section>' +
        '<section class="sv3-sec" id="sv3-tickets">' +
          '<div class="sv3-sec-hd"><span class="sv3-sec-num bd">' + esc(T.secTickets) + '</span><i class="sv3-sec-line"></i></div>' +
          '<button class="sv3-block" data-act="' + _ctaAct + '" data-ev="' + esc(ev ? ev.id : '') + '"' + (_soldOut && !mine ? ' disabled' : '') + '>' +
            '<div class="sv3-grid"><div><h2 class="sv3-block-h">' + esc(evName) + '</h2><p class="sv3-block-m">' + esc(evDate) + '<br>' + esc(evVenue) + (evPrice ? '<br>' + evPrice : '') + '</p></div>' +
            '<div class="sv3-ticket">' + sv3TicketSVG(ev) + '</div></div>' +
            '<span class="sv3-go' + (_onSale && !mine ? ' on' : '') + '">' + esc(goLabel) + ' <i>→</i></span>' +
          '</button>' +
        '</section>' +
        '<div class="sv3-divide"></div>' +
        '<section class="sv3-sec" id="sv3-merch">' +
          '<div class="sv3-sec-hd"><span class="sv3-sec-num bd">' + esc(T.secMerch) + '</span><i class="sv3-sec-line"></i></div>' +
          '<button class="sv3-block" data-act="open-merch">' +
            '<div class="sv3-grid sv3-merch-grid"><div><h2 class="sv3-block-h">' + esc(T.merchTitle) + '</h2><p class="sv3-block-m">' + merchSub + '</p></div><div aria-hidden="true"></div></div>' +
            '<span class="sv3-go">' + esc(T.goMerch) + ' <i>→</i></span>' +
            '<div class="sv3-merch-wrap"><img src="' + esc(A.merch) + '" alt="周邊收藏卡"></div>' +
          '</button>' +
        '</section>' +
      '</div>' +
    '</div>';
  }
  function sv3TicketSVG(ev){
    var d = ev && ev.startAt ? new Date(ev.startAt) : null;
    var mmdd = d ? (d.getMonth()+1) + '.' + d.getDate() : '';
    return '<svg viewBox="0 0 230 136" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="票券">' +
      '<defs><linearGradient id="sv3pg" x1="0" y1="0" x2=".8" y2="1"><stop offset="0" stop-color="#221d27"/><stop offset=".55" stop-color="#14111a"/><stop offset="1" stop-color="#0c0a10"/></linearGradient>' +
      '<radialGradient id="sv3mn" cx=".37" cy=".31"><stop offset="0" stop-color="#f0d9a2"/><stop offset=".42" stop-color="#9c7c42"/><stop offset="1" stop-color="#241b10"/></radialGradient>' +
      '<filter id="sv3paper"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" result="n"/><feColorMatrix in="n" type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".055"/></feComponentTransfer></filter>' +
      '<mask id="sv3notch"><rect width="230" height="136" fill="#fff"/><circle cx="158" cy="0" r="5" fill="#000"/><circle cx="158" cy="136" r="5" fill="#000"/></mask></defs>' +
      '<g mask="url(#sv3notch)"><rect x="1" y="1" width="228" height="134" rx="8" fill="url(#sv3pg)" stroke="#C9A05A" stroke-width="1.1"/><rect x="1" y="1" width="228" height="134" rx="8" filter="url(#sv3paper)" opacity=".85"/></g>' +
      '<line x1="158" y1="10" x2="158" y2="126" stroke="#C9A05A" stroke-width=".9" stroke-dasharray="4 5" opacity=".8"/>' +
      '<circle cx="122" cy="66" r="30" fill="url(#sv3mn)" opacity=".9"/>' +
      '<text x="16" y="38" fill="#EFE7D6" font-family="Bodoni Moda,serif" font-size="15" letter-spacing="2">THE SKY</text>' +
      '<text x="16" y="98" fill="#A99E8C" font-family="Bodoni Moda,serif" font-size="6.4" letter-spacing="1.2">MUSIC</text>' +
      '<text x="16" y="108" fill="#A99E8C" font-family="Bodoni Moda,serif" font-size="6.4" letter-spacing="1.2">LIVES BEYOND</text>' +
      '<text x="16" y="118" fill="#A99E8C" font-family="Bodoni Moda,serif" font-size="6.4" letter-spacing="1.2">THE MOMENT</text>' +
      '<line x1="16" y1="126" x2="30" y2="126" stroke="#C9A05A" stroke-width=".9"/>' +
      '<text x="172" y="38" fill="#E8BF7A" font-family="Bodoni Moda,serif" font-size="17" letter-spacing=".5">' + esc(mmdd) + '</text>' +
      '<text x="172" y="58" fill="#CFC6B6" font-family="Bodoni Moda,serif" font-size="7.4" letter-spacing=".9">CHANCE</text>' +
      '<text x="172" y="70" fill="#CFC6B6" font-family="Bodoni Moda,serif" font-size="7.4" letter-spacing=".9">BIRTHDAY</text>' +
      '<text x="172" y="82" fill="#CFC6B6" font-family="Bodoni Moda,serif" font-size="7.4" letter-spacing=".9">LIVE</text>' +
      '<line x1="172" y1="94" x2="188" y2="94" stroke="#C9A05A" stroke-width=".9"/></svg>';
  }

function coverValue(key,value,reference) {
    return '<span class="' + (value===reference?'tk-cover-a11y':'tk-cover-live tk-cover-live-'+key) + '"' + (key==='status'?' role="status"':'') + '><span>' + esc(value) + '</span></span>';
  }

function coverClockKey() {
    var mine=nextMine(),ev=mine?Object.assign({},eventById(mine.eventId)||{},mine.event||{}):upcoming()[0];
    return [validTickets().length,ev&&ev.id,ev&&startMs(ev)?Math.max(0,Math.ceil((startMs(ev)-Date.now())/864e5)):'',!!(mine&&isEventDay(ev))].join('|');
  }


  /* ---------- 分層導覽 ---------- */
  function layerEl(name) { return document.querySelector('.tk-layer[data-layer="' + name + '"]'); }
  function openLayer(name, opts) {
    opts = opts || {};
    if (name === "pass") S.sel = opts.sel || S.sel;
    if (name === "detail") S.detail = opts.key;
    if (S.layers.indexOf(name) >= 0) { renderLayer(name); return; }
    S.layers.push(name);
    try { history.pushState({ tk: S.layers.length }, ""); } catch (e) {}
    var el = document.createElement("div"); el.className = "tk-layer"; el.setAttribute("data-layer", name);
    document.getElementById("tk-layers").appendChild(el);
    renderLayer(name);
    document.body.classList.add("tk-open");
    requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add("in"); }); });
    if (name === "wallet") { try { loadScan(); } catch (e) {} }   // 進票夾先把相機元件載好，按「相機」時才來得及在手勢內開相機
    if (name === "wallet" || name === "pass" || name === "buy") loadMine(true).then(function () { renderLayer(name); });
    if (name === "pass") { var t = ticketById(S.sel); if (t && t.event && qrUnlocked(t.event) && isLive(t)) setTimeout(function () { toast("☀︎ 把螢幕亮度調到最亮，掃得更快"); }, 400); }
  }
  function popLayer() {
    var name = S.layers.pop(); if (!name) return;
    if (name === "ppstaff") ppsStop();
    var el = layerEl(name); if (el) { el.classList.remove("in"); el.classList.add("out"); setTimeout(function () { el.remove(); }, 240); }
    if (!S.layers.length) { document.body.classList.remove("tk-open"); render(); }
  }
  function back() { if (S.layers.length) history.back(); }
  function closeAll() { while (S.layers.length) popLayer(); }
  window.addEventListener("popstate", function (e) {
    var want = (e.state && e.state.tk) || 0;
    while (S.layers.length > want) popLayer();
  });
  function bar(backLabel, center, right) {
    return '<div class="tk-bar"><button data-act="back"><span class="chev">‹</span>' + esc(backLabel) + '</button><div class="c">' + esc(center) + '</div><button class="r" ' + (right ? 'data-act="' + right.act + '" aria-label="' + esc(right.label) + '"' : 'disabled style="opacity:0"') + '>' + (right ? right.icon : "") + '</button></div>';
  }
  function renderLayer(name) {
    var el = layerEl(name); if (!el) return;
    if (name === "wallet") el.innerHTML = walletHTML();
    if (name === "pass") el.innerHTML = passHTML();
    if (name === "merch") el.innerHTML = merchHTML();
    if (name === "detail") el.innerHTML = detailHTML();
    if (name === "buy") el.innerHTML = buyHTML();
    if (name === "checkout") el.innerHTML = checkoutHTML();
    if (name === "done") el.innerHTML = doneHTML();
    if (name === "ppstaff") { if (PPS.cam && el.querySelector("#pps-cam")) ppsPaint(); else { el.innerHTML = staffHTML(); ppsCamStart(); } }
    if (name === "pass") { var t = ticketById(S.sel); if (t && t.qr && isLive(t) && qrUnlocked(t.event)) drawQR($("#tkqr-" + cssId(t.id), el), t.qr, 240); }
  }

  /* ---------- 票夾：一場活動一張卡 ---------- */
  function loginCard() { return '<details class="tk-login-fold" id="tk-login"><summary class="tk-login-sum"><span>已買過票？<b>用 email 找回你的票</b></span><i>›</i></summary><div class="tk-login-body"><p class="tk-login-hint">買過專輯會自動登入；沒有的話輸入 email，我們寄一組驗證碼給你（收朋友轉讓的票也用這個）。</p><form><input class="tk-in" id="tk-em" type="email" inputmode="email" autocomplete="email" placeholder="你的 email" value="' + esc(lsGet(K.email) || "") + '"><div id="tk-otpwrap" style="display:none"><input class="tk-in" id="tk-otp" inputmode="numeric" pattern="[0-9]*" maxlength="6" placeholder="6 位數驗證碼"></div><div class="tk-msg" id="tk-lmsg"></div><button class="tk-btn p" id="tk-send" data-act="otp">寄驗證碼給我</button><button class="tk-btn p" id="tk-login-btn" data-act="login" style="display:none">登入</button></form></div></details>'; }
  function footFor(ev) {
    var mine = ticketsFor(ev.id);
    if (mine.length) {
      var pend = mine.some(function (t) { return t.transferPending; });
      var right = pend ? '<span class="tk-chip d">轉讓中</span>' : (qrUnlocked(ev) ? '<span class="tk-chip o">出示入場 QR</span>' : '<span class="tk-chip g">開場前 ' + QR_LOCK_H + ' 小時出現 QR</span>');
      return '<div class="l">🎫 你有 ' + mine.length + ' 張票</div>' + right;
    }
    if (ev.tiers && ev.tiers.length) {
      var anyOn = ev.tiers.some(function (t) { return t.onSale && t.left !== 0; });
      if (!anyOn && ev.left === 0) return '<div class="l dim">全場售完</div><span class="tk-chip x">SOLD OUT</span>';
      if (anyOn) { var mp = Math.min.apply(null, ev.tiers.filter(function (t) { return t.onSale && t.left !== 0; }).map(function (t) { return +t.price || 0; }));
        return '<div class="l">三種票 · NT$' + mp.toLocaleString("en-US") + ' 起</div><button class="tk-chip o" data-act="open-buy" data-ev="' + esc(ev.id) + '">選擇票種 ›</button>'; }
    }
    if (ev.onSale && ev.productKey && ev.left === 0) return '<div class="l dim">全場售完</div><span class="tk-chip x">SOLD OUT</span>';
    if (ev.onSale && ev.productKey) return '<div class="l dim">' + (ev.left != null && ev.left <= 20 ? "剩 " + ev.left + " 張" : "販售中") + '</div><button class="tk-chip o" data-act="buy" data-ev="' + esc(ev.id) + '">NT$' + esc(ev.price || "") + ' 購買</button>';
    return '<div class="l dim">尚未開賣</div>' + (reminded(ev.id, ev) ? '<span class="tk-chip d">✓ 已設定提醒</span>' : '<button class="tk-chip o" data-act="eremind" data-ev="' + esc(ev.id) + '">🔔 開賣提醒</button>');
  }
  function evCard(ev) {
    var k = evKind(ev), mine = ticketsFor(ev.id);
    var meta = hm(ev.startAt) + (ev.venue ? ' · ' + esc(ev.venue) : '') + '<br>自由入座' + (ev.capacity ? ' · ' + ev.capacity + ' 席' : '');
    return '<div class="tk-day"><i class="' + k.dot + '"></i><b>' + md(ev.startAt) + '</b><span>' + wk(ev.startAt) + '</span></div>' +
      '<div class="tk-ev ' + k.cls + '" role="button" tabindex="0" ' + (mine.length ? 'data-act="open-pass" data-id="' + esc(mine[0].id) + '"' : '') + '>' +
      '<div class="top"><div class="tk-poster"><b>' + k.lab + '</b></div><div><div class="n">' + esc(ev.name || "CHANCE") + '</div><div class="m">' + meta + '</div></div></div>' +
      '<div class="foot">' + footFor(ev) + '</div>' + ppFoot(ev, mine) + '</div>';
  }
  function ppFoot(ev, mine) {
    if (!mine.length || !(ev.photoPrice > 0) || ev.photoOnSale === false) return "";
    if (ppOwned(ev.id) || ppIncluded(ev.id)) return '<div class="foot pp"><div class="l">📸 生日牆合照</div><span class="tk-chip d">✓ ' + (ppOwned(ev.id) ? '已加購' : '票券已含') + '</span></div>';
    return '<div class="foot pp"><div class="l">📸 生日牆合照<small>在生日牆與 CHANCE 合照一次，成片全數下載</small></div><button class="tk-chip o" data-act="buy-pp" data-ev="' + esc(ev.id) + '">加購 NT$' + esc(ev.photoPrice) + '</button></div>';
  }
  function walletHTML() {
    var h = bar("收藏", "TICKETS", { act: "menu", label: "更多", icon: "···" });
    h += '<div class="tk-hd"><div class="tk-eyebrow">My Wallet</div><div class="tk-h1 tk-serif">我的票夾</div></div>';
    h += '<div class="tk-seg"><button class="' + (S.tab !== "past" ? "on" : "") + '" data-act="tab" data-tab="up">即將到來</button><button class="' + (S.tab === "past" ? "on" : "") + '" data-act="tab" data-tab="past">過往</button></div>';
    if (!S.session && !unlockCreds()) h += loginCard();
    if (S.tab !== "past") h += '<button class="tk-addbtn" data-act="add">＋ 加入票券<span>朋友轉給你的票，掃 QR 或輸代碼</span></button>';
    if (S.tab === "past") {
      var pt = pastTickets();
      if (!pt.length) h += '<div class="tk-empty">還沒有過往的票。<br>入場過的票會變成票根留在這裡。</div>';
      h += pt.map(function (t) { var ev = t.event || {}; return '<button class="tk-pastrow" data-act="open-pass" data-id="' + esc(t.id) + '"><div class="pp"></div><div><b>' + esc(ev.name || t.id) + '</b><span>' + md(ev.startAt) + ' · ' + (t.status === "used" ? "已入場 " + hm(t.usedAt) : (t.status === "refunded" ? "已退票" : (t.status === "void" ? "已作廢" : "已結束"))) + '</span></div><span class="chv">›</span></button>'; }).join("");
      return h;
    }
    var ups = upcoming();
    if (S.loading && !ups.length) h += '<div class="tk-empty">載入中…</div>';
    else if (!ups.length) h += '<div class="tk-empty">目前沒有活動。<br>新活動公布時會出現在這裡。</div>';
    h += ups.map(evCard).join("");
    if (ups.length) h += '<div class="tk-hint2">一場活動一張卡，底部就是你的下一步。</div>';
    return h;
  }

  /* ---------- 入場票 ---------- */
  function passHTML() {
    var t = ticketById(S.sel);
    var h = bar("票夾", "ENTRY PASS", { act: "share-ev", label: "分享", icon: "⇪" });
    if (!t) return h + '<div class="tk-empty">找不到這張票，可能已轉讓給朋友。</div>';
    var ev = Object.assign({}, eventById(t.eventId) || {}, t.event || {}), k = evKind(ev), live = isLive(t), open = live && qrUnlocked(ev);
    var st = t.status === "used" ? '<span class="tk-st warn">已入場</span>' : (t.status === "refunded" ? '<span class="tk-st bad">已退票</span>' : (t.status === "void" ? '<span class="tk-st bad">已作廢</span>' : (t.expired ? '<span class="tk-st bad">已結束</span>' : '<span class="tk-st">VALID</span>')));
    var mid;
    if (open && t.qr) mid = '<div class="tk-qrwrap2"><canvas id="tkqr-' + cssId(t.id) + '" width="480" height="480"></canvas><div class="tk-qrid">' + esc(t.id) + '</div></div>';
    else if (live) mid = '<div class="tk-lock"><div class="ic">🔒</div><b>入場 QR 還沒出現</b><p>為了防止截圖轉賣，開場前 ' + QR_LOCK_H + ' 小時<br>（' + md(ev.startAt) + ' ' + hm(new Date(openMs(ev)).toISOString()) + '）會自動出現在這裡</p>' + cdHTML(openMs(ev), "tk-lcd") + '</div>';
    else if (t.status === "used") mid = '<div class="tk-stubbox"><b>✓ 已入場</b><span>' + md(t.usedAt) + ' ' + hm(t.usedAt) + ' · ' + esc(t.id) + '</span></div>' + (isEventDay(ev) ? '<button class="tk-btn p" style="margin:0 16px 16px;width:calc(100% - 32px)" data-act="photo-qr">📸 拍照用 QR（給攝影師拍）</button>' : '');
    else mid = '<div class="tk-stubbox"><b>—</b><span>' + esc(t.id) + '</span></div>';
    h += '<article class="tk-pass ' + (t.status === "used" ? "used" : (!live ? "dead" : "")) + '"><div class="tk-art" style="' + (open ? 'height:70px' : '') + '"><i>' + k.lab + (ev.code ? ' · ' + esc(ev.code) : '') + '</i><b' + (open ? ' style="font-size:24px"' : '') + '>CHANCE</b></div><div class="tk-body">' +
      '<div class="tk-title"><b>' + esc(ev.name || "CHANCE") + '</b>' + st + '</div>' +
      (t.tierName ? '<div class="tk-tierbadge"><span class="bd">' + esc(t.tierName) + '</span>' + (t.seat ? '<span class="sn">終身編號 No.' + esc(t.seat) + '</span>' : '') + '</div>' : '') +
      '<div class="tk-info">' + (open ? '' : '<div><div class="tk-lab">Date</div><div class="tk-val">' + md(ev.startAt) + '（' + wk(ev.startAt).slice(-1) + '）' + hm(ev.startAt) + '</div></div><div><div class="tk-lab">Venue</div><div class="tk-val">' + esc(ev.venue || "—") + '</div></div>') +
      '<div><div class="tk-lab">Holder</div><div class="tk-val" style="font-size:13px">' + esc(maskEmail(S.email)) + '</div></div><div><div class="tk-lab">' + (t.tierName ? "票種" : "Ticket") + '</div><div class="tk-val">' + esc(t.tierName || "自由入座") + '</div></div></div>' +
      '<div class="tk-tear"></div>' + mid + '</div></article>';
    if (t.perks && t.perks.length) h += '<div class="tk-perkbox"><div class="pt">你的票種享有</div><ul>' + t.perks.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join("") + '</ul></div>';
    if (t.transferPending) h += '<div class="tk-banner"><span>這張票正在轉讓中（10 分鐘內有效）</span><button class="tk-chip d" data-act="show-transfer">看轉讓 QR</button></div>';
    if (live) {
      h += '<div class="tk-list">' + (open ? '' : '<button data-act="ics">加到行事曆<span>›</span></button>') +
        '<button data-act="map">導航到' + esc((ev.venue || "會場").replace(/\s*[A-Z]\s*廳$/, "")) + '<span>›</span></button>' +
        '<button data-act="rules">入場須知<span>›</span></button>' +
        (TK_TEST ? '<button data-act="photo-qr">📸 拍照用 QR（測試）<span>›</span></button>' : '') +
        (open ? '<button data-act="refresh-ticket">更新票券<span>›</span></button>' : '') +
        ppRow(ev, t) +
        (ev.onSale && ev.productKey && (ev.left == null || ev.left > 0) ? '<button data-act="rebuy" data-ev="' + esc(ev.id) + '">再買一張給朋友<span>›</span></button>' : '') +
        (t.transferPending ? '<button class="dim" data-act="cancel-transfer">取消轉讓<span>›</span></button>' : '<button class="dim" data-act="transfer">轉讓給朋友<span>›</span></button>') + '</div>';
    } else if (t.status === "used") {
      var pr = ppRow(ev, t);
      h += '<div class="tk-list">' + (pr || '') + '<button data-act="photo-qr">拍照用 QR<span>›</span></button></div>' +
        '<div class="tk-photos"><b>📸 你的照片</b><span>' + (ppOwned(t.eventId) || ppIncluded(t.eventId) ? "活動後你的合照成片、全場大合照與精選活動照會出現在這裡，免費下載。" : "活動後全場大合照與精選活動照會出現在這裡，免費下載。") + '</span></div>';
    }
    return h;
  }
  function ppRow(ev, t) {
    if (!(ev.photoPrice > 0) || ev.photoOnSale === false) return "";
    if (ppOwned(t.eventId) || ppIncluded(t.eventId)) return '<button data-act="noop"><span style="color:#8fd39a;font-size:13px">✓ ' + (ppOwned(t.eventId) ? '已加購' : '票券已含') + '</span>📸 生日牆合照</button>';
    return '<button data-act="buy-pp" data-ev="' + esc(t.eventId) + '">📸 生日牆合照 <small style="color:rgba(255,255,255,.5)">生日牆合照 NT$' + esc(ev.photoPrice) + '</small><span>加購 ›</span></button>';
  }

  /* ---------- 周邊收藏櫃 ---------- */
  function merchHTML() {
    var cab = cabinet(), n = cab.all.length, o = cab.owned.length;
    var h = bar("收藏", "MERCH");
    h += '<div class="tk-hd"><div class="tk-eyebrow">Owned by You</div><div class="tk-h1 tk-serif">周邊收藏</div></div>';
    h += '<div class="tk-prog"><div class="tt"><span>收藏進度</span><span><b>' + o + '</b> / ' + n + '</span></div><div class="tk-pbar"><i style="width:' + (n ? Math.round(o / n * 100) : 0) + '%"></i></div></div>';
    var list = cab.all.slice().sort(function (a, b) { return (b.owned ? 1 : 0) - (a.owned ? 1 : 0); });
    h += '<div class="tk-grid" style="margin-top:14px">' + list.map(function (i) {
      return '<div class="tk-item' + (i.owned ? '' : ' lk') + '"><button style="all:unset;display:block;cursor:pointer;width:100%" data-act="open-detail" data-key="' + esc(i.key) + '"><div class="im"><div class="ph">THE SKY</div>' + (i.img ? '<img src="' + esc(i.img) + '" alt="" loading="lazy" onerror="this.remove()">' : '') +
        '<span class="tk-tag">' + esc(i.owned ? i.label : dropLabel(i)) + '</span></div><div class="nm">' + esc(i.name) + '</div>' + (i.owned ? '<div class="ds">' + esc(i.desc) + ' · 已收藏</div>' : '') + '</button>' + itemBtn(i) + '</div>';
    }).join("") + '</div>';
    if (!n) h += '<div class="tk-empty">還沒有收藏品。</div>';
    return h;
  }
  function detailHTML() {
    var i = merchItems().filter(function (x) { return x.key === S.detail; })[0];
    if (!i) return bar("周邊", "COLLECTIBLE") + '<div class="tk-empty">找不到這件收藏</div>';
    var h = bar("周邊", "COLLECTIBLE", { act: "share", label: "分享", icon: "⇪" });
    h += '<div class="tk-hero"><div class="ph">THE SKY</div>' + (i.img ? '<img src="' + esc(i.img) + '" alt="" onerror="this.remove()"' + (i.owned ? '' : ' style="filter:saturate(.6) brightness(.8)"') + '>' : '') + '</div>';
    h += '<div class="tk-dl"><span class="tk-tag" style="position:static;display:inline-block">' + esc(i.label) + '</span><div class="v big">' + esc(i.name) + '</div>' + (i.desc ? '<div class="tk-sub" style="margin-top:6px;line-height:1.6">' + esc(i.desc) + '</div>' : '');
    if (i.owned) {
      h += '<div class="k">收藏編號</div><div class="v">' + esc(i.serial ? "No." + ("0" + i.serial).slice(-2) : (i.order || "—")) + '</div>' +
        '<div class="k">收藏狀態</div><div class="v">已收藏' + (i.since ? " · " + md(new Date(i.since).toISOString()) : "") + '</div>';
      if (i.benefits.length) h += '<div class="k">包含的數位特典</div><ul class="tk-ben">' + i.benefits.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join("") + '</ul>';
      h += '</div>' + (i.go ? '<button class="tk-btn p" data-act="goto" data-go="' + esc(i.go) + '">查看數位特典</button>' : '') + '<button class="tk-btn g" data-act="order" data-key="' + esc(i.key) + '">配送與訂單資訊</button>';
    } else {
      if (i.type === "digital") return h + '<div class="k">狀態</div><div class="v">尚未解鎖</div></div><button class="tk-btn p" data-act="goto" data-go="purchase">去解鎖</button>';
      h += '<div class="k">狀態</div><div class="v">' + (i.sold ? "已售完" : (i.soon ? (i.dropAt ? dropLabel(i) + " 開賣" : "即將上架") : "販售中")) + '</div>' + (i.price ? '<div class="k">價格</div><div class="v">NT$' + esc(i.price) + '</div>' : '') + (i.limited ? '<div class="k">限量</div><div class="v">全球 ' + i.limited + ' 件</div>' : '') + '</div>';
      h += i.sold ? '<button class="tk-btn" disabled>SOLD OUT</button>' : (!i.soon && i.price ? '<button class="tk-btn p" data-act="mbuy" data-key="' + esc(i.key) + '">NT$' + esc(i.price) + ' 購買</button>' : (reminded("merch-" + i.key) ? '<button class="tk-btn" disabled>✓ 已設定提醒</button>' : '<button class="tk-btn p" data-act="mremind" data-key="' + esc(i.key) + '">開賣時通知我</button>'));
    }
    return h;
  }

  /* ---------- 選單／說明／小動作 ---------- */
  function profileSheet() {
    sheet('<div class="tk-eyebrow">Account</div><h3>' + (S.email ? esc(maskEmail(S.email)) : "尚未登入票務") + '</h3><div class="tk-hint">票綁在這個 email 上，換手機用同一個 email 登入就看得到。</div>' +
      '<div class="tk-menu" style="margin-top:14px">' + (S.email ? '<button data-sact="showmail">顯示完整 email</button><button class="danger" data-sact="logout">登出票務</button>' : '<button data-sact="openwallet">登入看票</button>') + '<button data-sact="close">關閉</button></div>');
  }
  /* ========== B210T 工作人員：PhotoPass 拍照掃碼紀錄 ==========
   * 掃粉絲票根的「拍照用 QR」→ 記下時間 → 活動後照片依拍攝時間自動配對。沒網路也能掃（存手機，恢復連線自動上傳）。 */
  var PPS = { q: null, busy: false, off: 0, last: {}, timer: 0, cam: false, msg: null };
  var PPS_TIER = { vvip: "VVIP", vip: "VIP", ga: "一般" };
  var PPS_ERR = { bad_format: "不是拍照 QR", not_found: "查無此票", "void": "票已作廢", refunded: "票已退票" };
  function ppsKey() { return lsGet("tk:staffKey") || ""; }
  function ppsOn() { return !!ppsKey() || /[?&]staff=1/.test(location.search); }
  function ppsDev() { var d = lsGet("tk:dev"); if (!d) { d = "d" + Math.random().toString(36).slice(2, 10); lsSet("tk:dev", d); } return d; }
  function ppsQ() { if (!PPS.q) { try { PPS.q = JSON.parse(lsGet("tk:ppq") || "[]") || []; } catch (e) { PPS.q = []; } } return PPS.q; }
  function ppsSave() { lsSet("tk:ppq", JSON.stringify(ppsQ().slice(-600))); }
  function ppsNow() { return Date.now() + PPS.off; }
  function ppsHM(ts) { var d = new Date(ts + 8 * 3600e3); return ("0" + d.getUTCHours()).slice(-2) + ":" + ("0" + d.getUTCMinutes()).slice(-2) + ":" + ("0" + d.getUTCSeconds()).slice(-2); }
  function ppsPost(path, body) { return fetch(C.api + path, { method: "POST", headers: { "Content-Type": "text/plain;charset=UTF-8" }, body: JSON.stringify(body) }); }
  function ppsSyncClock() { var t0 = Date.now(); return fetch(C.api + "/now", { cache: "no-store" }).then(function (r) { return r.json(); }).then(function (j) { var t1 = Date.now(); if (j && j.ts) { PPS.off = Math.round(j.ts - (t0 + t1) / 2); var st = $("#pps-stat"); if (st) st.innerHTML = ppsStatHTML(); } }).catch(function () {}); }
  function openStaff() { closeSheet(); if (!ppsKey()) return ppsKeySheet(); ppsSyncClock(); openLayer("ppstaff"); }
  function ppsKeySheet() {
    sheet('<div class="tk-eyebrow">Staff</div><h3>工作人員登入</h3><div class="tk-hint">輸入工作人員金鑰。只存在這支手機，不會給粉絲看到。</div><input class="tk-in" id="tk-ppkey" type="password" autocomplete="off" placeholder="工作人員金鑰"><div class="tk-msg" id="tk-ppkmsg"></div><button class="tk-btn p" data-sact="ppkey-save">登入</button><button class="tk-btn g" data-sact="close">取消</button>');
  }
  function ppsKeySave() {
    var v = (($("#tk-ppkey") || {}).value || "").trim(); if (!v) return msg("#tk-ppkmsg", "請輸入金鑰");
    msg("#tk-ppkmsg", "確認中…", true);
    ppsPost("/ticket/pp/scans", { staffKey: v, eventId: "_check" }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { s: r.status, j: j }; }); })
      .then(function (x) {
        if (x.s === 200 && x.j && x.j.ok) { lsSet("tk:staffKey", v); closeSheet(); ppsSyncClock(); openLayer("ppstaff"); return; }
        if (x.s === 403) return msg("#tk-ppkmsg", "金鑰不對");
        msg("#tk-ppkmsg", "後端還沒更新（需要部署 Worker B210W）");
      }).catch(function () { msg("#tk-ppkmsg", "連不上伺服器，稍後再試"); });
  }
  function staffHTML() {
    var h = bar("票夾", "PHOTO STAFF", { act: "pps-clock", label: "對時", icon: "⏱" });
    h += '<div class="pps">';
    h += '<div class="pps-cam"><video id="pps-cam" playsinline muted autoplay></video><div class="fr"></div><div class="pps-camtxt" id="pps-camtxt">正在開啟相機…</div></div>';
    h += '<div class="pps-res" id="pps-res" aria-live="polite">' + ppsResHTML() + '</div>';
    h += '<div class="pps-btns"><button class="tk-btn g" data-act="pps-undo">撤銷上一位</button><button class="tk-btn g" data-act="pps-manual">手動輸入票號</button></div>';
    h += '<div class="pps-stat" id="pps-stat">' + ppsStatHTML() + '</div>';
    h += '<div class="pps-list" id="pps-list">' + ppsListHTML() + '</div>';
    h += '<p class="pps-help">流程：粉絲打開票根的「拍照用 QR」→ 掃到震動＋綠色 → 攝影師開拍。沒網路也能掃，恢復連線會自動上傳。<br>活動開始前、結束後各按一次右上 ⏱，請攝影師用相機拍下對時畫面。</p>';
    h += '<button class="tk-btn g" data-act="pps-logout">登出工作人員</button></div>';
    return h;
  }
  function ppsResHTML() { var m = PPS.msg; if (!m) return '<div class="idle">等待掃描…</div>'; return '<div class="card ' + (m.ok ? "ok" : "bad") + '"><b>' + esc(m.title) + '</b><span>' + esc(m.sub || "") + '</span></div>'; }
  function ppsStatHTML() {
    var q = ppsQ().filter(function (x) { return !x.undone && !x.err; }), pend = q.filter(function (x) { return !x.sync; }).length;
    return '已掃 <b>' + q.length + '</b> 位 · ' + (pend ? '<em>待上傳 ' + pend + '</em>' : '全部已上傳 ✓') + ' · ' + (navigator.onLine === false ? '<em>離線中</em>' : '連線中') + ' · 手機時間誤差 ' + (PPS.off / 1000).toFixed(1) + ' 秒';
  }
  function ppsLabel(x) { return x.seat ? "No." + x.seat : x.id; }
  function ppsListHTML() {
    var a = ppsQ().slice(-15).reverse();
    if (!a.length) return '<div class="empty">還沒有紀錄</div>';
    return a.map(function (x) { return '<div class="r' + (x.undone ? " un" : "") + (x.err ? " er" : "") + '"><i>' + esc(ppsHM(x.at)) + '</i><b>' + esc(ppsLabel(x)) + '</b><span>' + esc(x.err || PPS_TIER[x.tier] || "") + '</span><em>' + (x.undone ? "撤銷" : x.err ? "✕" : x.sync ? "✓" : "⏳") + '</em></div>'; }).join("");
  }
  function ppsPaint() { var a = $("#pps-res"), b = $("#pps-stat"), c = $("#pps-list"); if (a) a.innerHTML = ppsResHTML(); if (b) b.innerHTML = ppsStatHTML(); if (c) c.innerHTML = ppsListHTML(); }
  function ppsOnScan(text) {
    var m = /^CP1\.([A-Z0-9-]+)$/i.exec(String(text || "").trim());
    if (!m) { hap([60, 60, 60]); PPS.msg = { ok: false, title: "不是拍照 QR", sub: "請粉絲打開票根 →「拍照用 QR」" }; return ppsPaint(); }
    var id = m[1].toUpperCase(), now = ppsNow();
    if (PPS.last[id] && now - PPS.last[id] < 8000) return;
    PPS.last[id] = now; ppsAdd(id, now);
  }
  function ppsAdd(id, at) {
    var e = { cid: "c" + at.toString(36) + Math.random().toString(36).slice(2, 6), qr: "CP1." + id, id: id, at: at, dev: ppsDev(), sync: false };
    ppsQ().push(e); ppsSave(); hap(40);
    PPS.msg = { ok: true, cid: e.cid, title: "✓ 已記錄 " + ppsHM(at), sub: "票號 " + id + "，請攝影師開拍" };
    ppsPaint(); ppsSync();
  }
  function ppsManual() {
    var v = window.prompt("輸入粉絲票根上的票號（例如 1227-ABCD1234）"); if (!v) return;
    v = v.toUpperCase().replace(/\s+/g, "").replace(/^CP1\./, "");
    if (!/^[A-Z0-9-]{6,}$/.test(v)) return toast("票號格式不對");
    ppsAdd(v, ppsNow());
  }
  function ppsUndoSend(e) {
    return ppsPost("/ticket/pp/undo", { staffKey: ppsKey(), eventId: e.ev, at: e.at, cid: e.cid })
      .then(function (r) { if (r.ok) { e.undoPend = false; ppsSave(); } }).catch(function () {});
  }
  function ppsUndo() {
    var q = ppsQ(), e = null; for (var i = q.length - 1; i >= 0; i--) if (!q[i].undone && !q[i].err) { e = q[i]; break; }
    if (!e) return toast("沒有可撤銷的紀錄");
    if (!window.confirm("撤銷 " + ppsLabel(e) + "（" + ppsHM(e.at) + "）這一筆？")) return;
    e.undone = true; if (e.sync && e.ev) e.undoPend = true; ppsSave();
    PPS.msg = { ok: false, title: "已撤銷 " + ppsLabel(e), sub: "這筆不會拿去配對照片" }; ppsPaint();
    if (e.undoPend) ppsUndoSend(e);
  }
  function ppsSync() {
    ppsQ().filter(function (x) { return x.undoPend && x.ev; }).forEach(ppsUndoSend);
    if (PPS.busy || !ppsKey()) return;
    var pend = ppsQ().filter(function (x) { return !x.sync && !x.err && !x.undone; }); if (!pend.length) return;
    PPS.busy = true;
    ppsPost("/ticket/pp/scan", { staffKey: ppsKey(), items: pend.slice(0, 50).map(function (x) { return { cid: x.cid, qr: x.qr, at: x.at, dev: x.dev }; }) })
      .then(function (r) { if (r.status === 403) throw "key"; return r.json(); })
      .then(function (j) {
        (j.results || []).forEach(function (r) {
          var e = ppsQ().filter(function (x) { return x.cid === r.cid; })[0]; if (!e) return;
          e.sync = true;
          if (r.ok) { e.seat = r.seat; e.tier = r.tier; e.ev = r.eventId; if (e.undone) { e.undoPend = true; ppsUndoSend(e); } }
          else e.err = PPS_ERR[r.reason] || "無法記錄";
          if (PPS.msg && PPS.msg.cid === e.cid) PPS.msg = r.ok ? { ok: true, cid: e.cid, title: "✓ " + ppsLabel(e) + (PPS_TIER[e.tier] ? " · " + PPS_TIER[e.tier] : ""), sub: (r.owner || "") + " · " + ppsHM(e.at) + "，請攝影師開拍" } : { ok: false, cid: e.cid, title: e.err, sub: "票號 " + e.id + "，請粉絲確認票券" };
          if (!r.ok) hap([60, 60, 60]);
        });
        ppsSave();
      })
      .catch(function (x) { if (x === "key") PPS.msg = { ok: false, title: "工作人員金鑰失效", sub: "請按最下方登出後重新登入" }; })
      .then(function () { PPS.busy = false; ppsPaint(); });
  }
  function ppsCamStart() {
    var txt = $("#pps-camtxt"), v = $("#pps-cam"); if (!v) return;
    if (!PPS.timer) PPS.timer = setInterval(function () { ppsSync(); var st = $("#pps-stat"); if (st) st.innerHTML = ppsStatHTML(); }, 4000);
    var go = function () {
      PPS.cam = true;
      window.TKScan.start(v, function (t) { if (PPS.cam) ppsOnScan(t); })
        .then(function () { if (txt) txt.innerHTML = ""; })
        .catch(function (e) { PPS.cam = false; if (txt) txt.innerHTML = ((e && (e.name === "NotAllowedError" || e.name === "SecurityError")) ? "相機權限被拒，請到設定開啟" : "相機沒開起來") + ' <button data-act="pps-cam">再試一次</button>'; });
    };
    if (window.TKScan) return go();
    if (txt) txt.textContent = "載入相機…";
    loadScan().then(go).catch(function () { if (txt) txt.innerHTML = '相機元件載入失敗 <button data-act="pps-cam">再試一次</button>'; });
  }
  function ppsStop() { PPS.cam = false; try { window.TKScan && window.TKScan.stop(); } catch (e) {} clearInterval(PPS.timer); PPS.timer = 0; }
  function ppsClock() {
    sheet('<div class="tk-eyebrow">Sync</div><h3>對時畫面</h3><div class="tk-hint">請攝影師用<b>相機</b>拍下這個畫面（活動開始前、結束後各一次），照片才能精準對到粉絲。</div><div class="pps-clock" id="pps-clock">--:--:--</div><div class="pps-clock2" id="pps-clock2"></div><button class="tk-btn p" data-sact="close">完成</button>');
    var tick = function () { var el = $("#pps-clock"); if (!el) return; var n = ppsNow(); el.textContent = ppsHM(n) + "." + Math.floor((n % 1000) / 100); var e2 = $("#pps-clock2"); if (e2) e2.textContent = new Date(n + 8 * 3600e3).toISOString().slice(0, 10) + " 台北時間"; setTimeout(tick, 50); };
    tick();
  }
  window.addEventListener("online", function () { if (PPS.timer) ppsSync(); });
  function walletMenu() {
    sheet('<div class="tk-eyebrow">Wallet</div><h3>票夾</h3><div class="tk-menu" style="margin-top:8px"><button data-sact="refresh">更新票券</button><button data-sact="rules">入場須知</button>' + (ppsOn() ? '<button data-sact="ppstaff">📸 工作人員：拍照掃碼</button>' : '') + '<button data-sact="close">關閉</button></div>');
    if (ppsOn()) loadScan().catch(function () {});
  }
  function sharedItems(ev) { var x = bt(ev); return (x && x.shared) || []; }
  function sharedHTML(ev) { var a = sharedItems(ev); return a.length ? '<div class="tkb-share"><b>全票種共享</b><span>' + a.map(esc).join("・") + '</span></div>' : ""; }
  function sharedList(ev) { var a = sharedItems(ev); return a.length ? '<div class="pt">全票種共享</div><ul>' + a.map(function (p) { return '<li><i>' + ic(perkIcon(p), "bi") + '</i>' + esc(p) + '</li>'; }).join("") + '</ul>' : ""; }
  function refundBy(ev) { var d = ev && ev.startAt ? new Date(Date.parse(ev.startAt) - 20 * 864e5 + 8 * 3600e3) : null; return d && !isNaN(d) ? (d.getUTCMonth() + 1) + "/" + d.getUTCDate() : ""; }
  function termsFor(ev) { var d = refundBy(ev); return d ? C.terms.replace("演出日前 20 日前", "演出日前 20 日（" + d + "）前") : C.terms; }
  function buyTermsSheet() {
    var ev = buyEvent((S.buy || {}).evId) || buyEv(); if (!ev) return;
    var d = refundBy(ev), tiers = ev.tiers || [];
    var li = function (a) { return '<li>' + a + '</li>'; };
    var h = '<div class="tkb-terms"><div class="tk-eyebrow">Terms</div><h3>購票須知</h3>' +
      '<div class="pt">活動</div><ul>' + li(esc(ev.name || "") + '｜' + esc(md(ev.startAt)) + '（' + esc(wk(ev.startAt)) + '）' + esc(hm(ev.startAt)) + ' 開始') + li(esc(ev.venue || "") + (ev.capacity ? '，共 ' + esc(ev.capacity) + ' 席' : '')) + '</ul>' +
      '<div class="pt">票種福利</div><ul>' + (sharedItems(ev).length ? li('全票種共享：' + sharedItems(ev).map(esc).join("、")) : '') +
        tiers.map(function (t) { return li('<b>' + esc(t.name) + '</b>（' + nt(t.price) + '，編號 ' + num3(t.numFrom) + '–' + num3(t.numTo) + '）：' + (t.perks || []).map(esc).join("、")); }).join("") + '</ul>' +
      '<div class="pt">終身編號</div><ul>' + li('依付款完成順序配發；有人退票時，釋出的號碼由下一位購買者遞補。') + li('終身編號不是座位號碼；編號與福利隨票轉讓，歸新持有人。') + '</ul>' +
      '<div class="pt">限購與入場</div><ul>' + li(esc(BUY_TEXT.limitNote) + '。') + li('購票時需填寫稱呼，僅用於本活動（報到與 VVIP 海報署名）。') + li('入場順序：VVIP → VIP → 一般，各批次依現場引導入場，場內自由入座。') + li('入場憑 App 票夾的入場 QR，開場前 ' + QR_LOCK_H + ' 小時出現，給工作人員掃描即完成入場。') + '</ul>' +
      '<div class="pt">合照與照片</div><ul>' + li('VIP／VVIP：與 CHANCE 的合照由官方攝影師拍攝，自己的合格合照成片全數免費下載，無須另行加購；VVIP 的 60 秒一對一已含合照。') + li('合格成片＝經攝影團隊篩選、基本校色的高解析 JPEG，不含 RAW、失焦、閉眼、測試照或重複廢片；不代表延長互動時間或不限拍攝。') + li('全票種：全場大合照與主辦精選活動照免費下載。個人合照只提供給該票券持有人，不會放進共用相簿。') + li('生日牆合照（一般票加購 PhotoPass NT$390）：在現場為 CHANCE 布置的生日牆前與 CHANCE 合照一次，由官方攝影師拍攝，自己的合格成片全數下載；不加購不影響其他福利。') + li('照片上架時會寄 Email 通知。CHANCE App 是網頁 App，不用下載：任何手機瀏覽器打開 chance1228.com，用購票 Email 登入即可查看。') + '</ul>' +
      '<div class="pt">海報署名（VVIP）</div><ul>' + li('購票時填寫的稱呼，就是 CHANCE 在海報上署名使用的名字，請確認寫法。') + li('票券轉讓後，新持有人請於活動前來信 heartbeats0693@gmail.com 更新稱呼。') + '</ul>' +
      '<div class="pt">退換票</div><ul>' + li('演出日前 20 日' + (d ? '（' + d + '）' : '') + '前可申請退票，手續費為票價 10%；逾期恕不退票，可用票夾「轉讓給朋友」換人。') + li('因主辦單位因素取消、改期或主要演出內容變更，全額退款、不收手續費。') + li('非供自用、購票轉售圖利者，主辦單位得不予退換票。') + li('退票申請：來信 heartbeats0693@gmail.com，註明購票 Email 與票號。') + '</ul>' +
      '<div class="pt">主辦單位</div><ul>' + li('名稱：夏米爾企業社') + li('負責人：張紫瑩') + li('客服信箱：heartbeats0693@gmail.com') + li('地址：臺北市中正區懷寧街76號') + '</ul>' +
      '<div class="nt">' + esc(BUY_TEXT.note) + '</div></div><button class="tk-btn p" data-sact="close">知道了</button>';
    sheet(h);
    var bx = sheetEl && sheetEl.querySelector(".tk-box"); if (bx) bx.classList.add("tkb-shbox");
  }
  function rulesSheet() {
    sheet('<div class="tk-eyebrow">Entry</div><h3>入場須知</h3><div class="tk-hint" style="color:rgba(255,255,255,.8);line-height:1.8">' +
      '・入場 QR 在開場前 ' + QR_LOCK_H + ' 小時自動出現，之前看不到是正常的（防止截圖轉賣）<br>・開場後 2 小時票就失效<br>・給工作人員掃 QR 就完成入場，掃過後會變成票根留在「過往」<br>・轉讓：產生一次性連結（10 分鐘有效），朋友接受後票就是他的，你的 QR 立即失效<br>・沒買過專輯的朋友也能用 email 收票；收票在票夾按「＋ 加入票券」掃 QR 或輸代碼<br>・現場有官方攝影：合照前把票根上的「拍照用 QR」舉給攝影師拍一張，照片才會對到你；VIP／VVIP 自己的合格合照成片全數免費下載；全場大合照與精選活動照全票種免費下載；一般票可加購 PhotoPass NT$390，在生日牆與 CHANCE 合照；個人照片只提供給該票券持有人<br>・會場訊號不好的話，進場前先打開這張票</div>' +
      '<button class="tk-btn p" data-sact="close">知道了</button>');
  }
  function transferConfirm() {
    var t = ticketById(S.sel); if (!t) return;
    sheet('<div class="tk-big"><div class="ic">↗</div><div class="tk-eyebrow">Transfer</div><h3>要把這張票轉讓給朋友？</h3><div class="tk-hint">' + esc(t.event ? t.event.name : t.id) + '<br><br>轉讓連結 10 分鐘內有效。朋友接受的那一刻，<b style="color:#e7a3a3">你原本的票會立即失效</b>，並從你的票夾消失。</div></div>' +
      '<button class="tk-btn p" data-sact="transfer-go">確定，產生轉讓連結</button><button class="tk-btn g" data-sact="close">取消</button>');
  }
  function orderSheet(key) {
    var i = merchItems().filter(function (x) { return x.key === key; })[0]; if (!i) return;
    var bd = i.type === "digital" ? "這是數位商品，沒有配送。用同一個 email 在任何裝置登入都能使用。" : (i.order ? "訂單編號：" + esc(i.order) + "<br>" : "") + "出貨進度會以 email 通知，訂單編號在購買確認信裡。需要修改收件資訊請直接回覆那封信。";
    sheet('<div class="tk-eyebrow">Order</div><h3>配送與訂單資訊</h3><div class="tk-hint" style="line-height:1.8">' + bd + '</div><button class="tk-btn p" data-sact="close">關閉</button>');
  }
  function navTo(screen) { closeAll(); var nb = $(C.navSel[screen]); if (nb) nb.click(); }
  function curEv() { var t = ticketById(S.sel); return t ? Object.assign({}, eventById(t.eventId) || {}, t.event || {}) : null; }
  function downloadICS() {
    var ev = curEv(); if (!ev || !startMs(ev)) return;
    var f = function (ms) { return new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); };
    var ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//CHANCE//THE SKY//ZH", "BEGIN:VEVENT", "UID:" + ev.id + "@chance1228.com", "DTSTAMP:" + f(Date.now()), "DTSTART:" + f(startMs(ev)), "DTEND:" + f(startMs(ev) + 4 * 3600e3),
      "SUMMARY:" + (ev.name || "CHANCE"), "LOCATION:" + (ev.venue || ""), "DESCRIPTION:入場 QR 會在開場前 " + QR_LOCK_H + " 小時出現在 CHANCE app → SHOP → 票夾", "BEGIN:VALARM", "TRIGGER:-PT3H", "ACTION:DISPLAY", "DESCRIPTION:入場 QR 已經出現", "END:VALARM", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    var url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" })), a = document.createElement("a");
    a.href = url; a.download = (ev.name || "CHANCE") + ".ics"; document.body.appendChild(a); a.click(); setTimeout(function () { a.remove(); URL.revokeObjectURL(url); }, 1000);
  }
  function openMap() {
    var ev = curEv(); var q = "台北 " + String((ev && ev.venue) || "微風影城").replace(/\s*[A-Z]\s*廳$/, "");
    var ios = /iPhone|iPad|Macintosh/.test(navigator.userAgent);
    window.open(ios ? "https://maps.apple.com/?q=" + encodeURIComponent(q) : "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q), "_blank");
  }
  function merchBuy(key) {
    var i = merchItems().filter(function (x) { return x.key === key; })[0]; if (!i) return;
    var b = document.querySelector('#merch-list [data-merch="' + i.idx + '"]');   // 沿用 app 原本的購買流程
    if (b) { closeAll(); b.click(); } else toast("這件商品目前還不能購買");
  }

  /* ---------- 事件 ---------- */
var C128=["11011001100", "11001101100", "11001100110", "10010011000", "10010001100", "10001001100", "10011001000", "10011000100", "10001100100", "11001001000", "11001000100", "11000100100", "10110011100", "10011011100", "10011001110", "10111001100", "10011101100", "10011100110", "11001110010", "11001011100", "11001001110", "11011100100", "11001110100", "11101101110", "11101001100", "11100101100", "11100100110", "11101100100", "11100110100", "11100110010", "11011011000", "11011000110", "11000110110", "10100011000", "10001011000", "10001000110", "10110001000", "10001101000", "10001100010", "11010001000", "11000101000", "11000100010", "10110111000", "10110001110", "10001101110", "10111011000", "10111000110", "10001110110", "11101110110", "11010001110", "11000101110", "11011101000", "11011100010", "11011101110", "11101011000", "11101000110", "11100010110", "11101101000", "11101100010", "11100011010", "11101111010", "11001000010", "11110001010", "10100110000", "10100001100", "10010110000", "10010000110", "10000101100", "10000100110", "10110010000", "10110000100", "10011010000", "10011000010", "10000110100", "10000110010", "11000010010", "11001010000", "11110111010", "11000010100", "10001111010", "10100111100", "10010111100", "10010011110", "10111100100", "10011110100", "10011110010", "11110100100", "11110010100", "11110010010", "11011011110", "11011110110", "11110110110", "10101111000", "10100011110", "10001011110", "10111101000", "10111100010", "11110101000", "11110100010", "10111011110", "10111101110", "11101011110", "11110101110", "11010000100", "11010010000", "11010011100"];
  /* ════════════════════════════════════════════════════════════════
     B202T · 購買頁（選票種 → 票種詳情 → 購買確認 → 購買成功）
     ✏️ 活動主視覺文字改 BUY_TEXT；價格/席次/福利從 Worker 場次資料讀
     ════════════════════════════════════════════════════════════════ */
  var BUY_TEXT = {
    "meet-20261227": { kicker: "CHANCE", title: ["BIRTHDAY", "PARTY"], city: "TAIPEI", tag: "MUSIC · FRIENDS · SPECIAL NIGHT", short: "BIRTHDAY PARTY", shared: ["第一支 MV 現場搶先首映與創作分享", "生日環節・現場抽獎", "全場大合照（成品可下載）", "主辦精選活動照下載", "散場擊掌一次", "數位紀念票（App 票根）"], ppNote: "" },
    _default:        { kicker: "CHANCE", title: ["LIVE"], city: "TAIPEI", tag: "MUSIC · FRIENDS · SPECIAL NIGHT", short: "LIVE" },
    assets: { hero: "shop-assets/buy-hero.jpg", thumb: "shop-assets/buy-thumb.jpg", ticket: "shop-assets/buy-ticket.jpg" },
    note: "※ 現場流程時間以當日公告為準",
    limitNote: "每人每票種限購 1 張（以收票 Email 認定）"
  };
  function bt(ev) { return (ev && BUY_TEXT[ev.id]) || BUY_TEXT._default; }
  function asset(p) { return (C.base || "") + p; }

  var ICON = {
    crown: '<path d="M3.5 8.5l4.2 3.6L12 5l4.3 7.1 4.2-3.6-1.8 10H5.3z"/><path d="M5.6 20.5h12.8"/>',
    bow: '<path d="M12 12L4 7.2v9.6z"/><path d="M12 12l8-4.8v9.6z"/><circle cx="12" cy="12" r="1.9"/>',
    people: '<circle cx="9" cy="8.2" r="3.1"/><path d="M3.2 19.5c.4-3.4 2.8-5.4 5.8-5.4s5.4 2 5.8 5.4"/><circle cx="17" cy="9.4" r="2.4"/><path d="M15.6 14.4c2.8 0 4.8 1.6 5.2 4.6"/>',
    cal: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.2"/><path d="M3.5 9.8h17M8 3v4M16 3v4"/>',
    pin: '<path d="M12 21s-6.6-5.9-6.6-11.1a6.6 6.6 0 0113.2 0C18.6 15.1 12 21 12 21z"/><circle cx="12" cy="9.9" r="2.3"/>',
    star: '<path d="M12 3.8l2.5 5.1 5.6.8-4.1 4 1 5.6-5-2.7-5 2.7 1-5.6-4.1-4 5.6-.8z"/>',
    camera: '<rect x="3" y="7" width="18" height="13" rx="2.2"/><path d="M8.5 7l1.6-2.6h3.8L15.5 7"/><circle cx="12" cy="13.4" r="3.4"/>',
    pen: '<path d="M4.5 19.5l3.6-.8 10.6-10.6-2.8-2.8L5.3 15.9z"/><path d="M14.2 7l2.8 2.8"/>',
    diamond: '<path d="M6.5 4.5h11l3.3 4.8L12 20 3.2 9.3z"/><path d="M3.2 9.3h17.6M9 4.5l3 15.5 3-15.5"/>',
    gift: '<rect x="3.5" y="8.5" width="17" height="4" rx="1"/><path d="M5 12.5v8h14v-8M12 8.5v12"/><path d="M12 8.5S10.6 4 8 4.6c-2.2.5-1 3.9 4 3.9zM12 8.5s1.4-4.5 4-3.9c2.2.5 1 3.9-4 3.9z"/>',
    play: '<rect x="3.5" y="4.5" width="17" height="15" rx="2.2"/><path d="M10 9l5 3-5 3z"/>',
    mic: '<rect x="9" y="3.5" width="6" height="10.5" rx="3"/><path d="M5.8 11.5a6.2 6.2 0 0012.4 0M12 17.8v2.7"/>',
    cup: '<path d="M6 7.5h12l-1.4 12.5H7.4z"/><path d="M5 7.5h14M9.5 7.5L11 3.5"/>',
    hand: '<path d="M8 12.5V6.2a1.4 1.4 0 012.8 0v5M10.8 11V4.9a1.4 1.4 0 012.8 0V11M13.6 11V5.9a1.4 1.4 0 012.8 0v7.4M8 12.5l-1.7-1.8a1.5 1.5 0 00-2.2 2l3.6 4.5c1.2 1.6 3 2.4 5 2.4h.6c2.8 0 4.9-2.3 4.9-5.1v-2.2a1.4 1.4 0 00-2.8 0"/>',
    check: '<path d="M6 12.5l4 4 8-9"/>',
    chev: '<path d="M9.5 6l6 6-6 6"/>', close: '<path d="M6 6l12 12M18 6L6 18"/>', lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 018 0v2.5"/>'
  };
  function ic(n, cls) { return '<svg class="' + (cls || "bi") + '" viewBox="0 0 24 24" aria-hidden="true">' + (ICON[n] || ICON.star) + '</svg>'; }
  function tierIcon(t) { var k = (t && t.key) || ""; return k === "vvip" ? "crown" : k === "vip" ? "bow" : "people"; }
  function perkIcon(p) {
    p = String(p);
    if (/餐|飲料|爆米花/.test(p)) return "cup"; if (/一對一/.test(p)) return "star"; if (/合照|拍照/.test(p)) return "camera"; if (/簽名|海報/.test(p)) return "pen";
    if (/優先|Priority|入場/.test(p)) return "diamond"; if (/語音/.test(p)) return "mic"; if (/MV|首播/.test(p)) return "play";
    if (/餐|飲料|爆米花/.test(p)) return "cup"; if (/擊掌/.test(p)) return "hand"; if (/拍立得|限定|抽獎|周邊/.test(p)) return "gift";
    return "star";
  }
  function perkShort(p) {
    p = String(p);
    var par = /[（(]([^）)]+)[）)]/.exec(p);
    if (/^含餐/.test(p) && par) return par[1].replace(/＋/g, "+");
    if (/MV/.test(p)) return "MV 首播";
    return p.replace(/[（(][^）)]*[）)]/g, "").trim();
  }
  function num3(n) { return ("00" + n).slice(-3); }
  function nt(n) { return "NT$" + Number(n || 0).toLocaleString("en-US"); }
  function tierLeft(t) { return t.left != null ? t.left : Math.max(0, (t.cap || 0) - (t.sold || 0)); }
  function tierOwned(ev, t) { return ticketsFor(ev.id).filter(function (x) { return x.tier === t.key; })[0] || null; }
  function tierBuyable(ev, t) { return !!(ev.onSale !== false && t.onSale && tierLeft(t) > 0 && !tierOwned(ev, t)); }
  function buyEv() { return eventById(S.buyEv) || buyEvent(S.buyEv) || upcoming().filter(function (e) { return e.tiers && e.tiers.length; })[0] || null; }
  function selTier(ev) { if (!ev || !S.buySel) return null; return (ev.tiers || []).filter(function (t) { return t.key === S.buySel; })[0] || null; }

  function buyBar(backLabel, center, right) {
    return '<div class="tk-bar tkb-bar"><button data-act="back"><span class="chev">‹</span>' + esc(backLabel) + '</button><div class="c">' + esc(center) + '</div>' +
      (right || '<button class="r" disabled style="opacity:0"></button>') + '</div>';
  }
  function heroHTML(ev) {
    var T = bt(ev), d = tw(ev.startAt), mmdd = d ? (d.getUTCMonth() + 1) + "." + ("0" + d.getUTCDate()).slice(-2) : "";
    return '<div class="tkb-hero"><img src="' + esc(asset(BUY_TEXT.assets.hero)) + '" alt="" decoding="async"><div class="tkb-hero-fade"></div>' +
      '<div class="tkb-hero-tx"><div class="k">' + esc(T.kicker) + '</div><div class="t">' + T.title.map(esc).join("<br>") + '</div>' +
      '<div class="d"><b>' + esc(mmdd) + '</b><span>' + esc(T.city) + '</span></div><div class="g">' + esc(T.tag) + '</div></div></div>';
  }
  function summaryHTML(ev) {
    var cap = ev.capacity || (ev.tiers || []).reduce(function (a, t) { return a + (t.cap || 0); }, 0);
    return '<div class="tkb-sum">' +
      '<div>' + ic("cal") + '<p><b>' + esc(md(ev.startAt)) + ' ' + esc(hm(ev.startAt)) + '</b><span>（' + esc(wk(ev.startAt)) + '）</span></p></div>' +
      '<div>' + ic("pin") + '<p><b>' + esc(ev.venue || "—") + '</b><span>' + esc(bt(ev).city === "TAIPEI" ? "台北" : bt(ev).city) + '</span></p></div>' +
      '<div>' + ic("people") + '<p><b>' + esc(cap) + ' 席</b><span>限定</span></p></div></div>';
  }
  function chipsHTML(t, n) { return '<div class="tkb-chips">' + (t.perks || []).slice(0, n || 3).map(function (p) { return '<span>' + esc(perkShort(p)) + '</span>'; }).join("") + '</div>'; }
  function tierRow(ev, t) {
    var own = tierOwned(ev, t), left = tierLeft(t), ok = tierBuyable(ev, t), sel = S.buySel === t.key && ok;
    var state = own ? '<em class="own">已擁有 No.' + esc(own.seat || num3(own.seatNo || "")) + '</em>' : left === 0 ? '<em>已售完</em>' : (!t.onSale || ev.onSale === false) ? '<em>尚未開賣</em>' : '';
    return '<div class="tkb-row' + (sel ? " sel" : "") + (ok ? "" : " off") + (t.key === "vvip" ? " vv" : "") + '" data-act="' + (ok ? "tier-sel" : "tier-info") + '" data-tier="' + esc(t.key) + '" role="radio" aria-checked="' + (sel ? "true" : "false") + '" tabindex="0">' +
      '<div class="ib">' + ic(tierIcon(t)) + '</div>' +
      '<div class="mid"><div class="nm">' + esc(t.name) + (t.key === "vvip" ? '<i class="lim">LIMITED</i>' : '') + '</div>' +
      '<div class="meta">剩 ' + esc(left) + ' 席 · 編號 ' + num3(t.numFrom) + '–' + num3(t.numTo) + '</div>' + state + '</div>' +
      '<div class="rt"><div class="pr">' + nt(t.price) + '</div><span class="rd"></span></div>' + chipsHTML(t, 3) +
      '<button class="more" data-act="tier-info" data-tier="' + esc(t.key) + '" aria-label="查看 ' + esc(t.name) + ' 完整內容">詳情 ' + ic("chev", "bi s") + '</button></div>';
  }
  function buyHTML() {
    var ev = buyEv(), n = validTickets().length;
    var right = '<button class="r tkb-mine" data-act="open-wallet">我的票' + (n ? ' <b>' + n + '</b>' : '') + '</button>';
    var h = buyBar("周邊", "TICKETS", right);
    if (!ev) return h + '<div class="tk-empty">' + (S.loading ? "載入中…" : "目前沒有開放購票的活動。") + '</div>';
    var tiers = ev.tiers || [];
    h += heroHTML(ev) + summaryHTML(ev);
    h += '<div class="tkb-list" role="radiogroup" aria-label="選擇票種">' + tiers.map(function (t) { return tierRow(ev, t); }).join("") + '</div>';
    h += '<p class="tkb-fine">' + esc(BUY_TEXT.limitNote) + '　·　' + esc(termsFor(ev)) + '　<button class="tkb-lk" data-act="buy-terms">完整購票須知 ›</button></p>';
    var T = selTier(ev), anyBuy = tiers.some(function (t) { return tierBuyable(ev, t); }), notOpen = !tiers.some(function (t) { return t.onSale; }) || ev.onSale === false;
    var foot;
    if (T) foot = '<img src="' + esc(asset(BUY_TEXT.assets.thumb)) + '" alt=""><div class="fx"><span>已選擇 ' + esc(T.name) + '</span><b>' + nt(T.price) + '</b></div><button class="tkb-cta" data-act="buy-go">立即購買 <i>→</i></button>';
    else if (notOpen) foot = '<div class="fx"><span>' + esc(ev.name || "") + '</span><b class="dim">尚未開賣</b></div><button class="tkb-cta ghost" data-act="buy-remind">' + (reminded(ev.id) ? "已設定提醒 ✓" : "🔔 開賣提醒") + '</button>';
    else if (!anyBuy) foot = '<div class="fx"><span>' + esc(ev.name || "") + '</span><b class="dim">目前無可購買票種</b></div><button class="tkb-cta ghost" data-act="open-wallet">我的票</button>';
    else foot = '<div class="fx"><span>還沒選擇票種</span><b class="dim">點上方票種開始</b></div><button class="tkb-cta" disabled>選擇票種</button>';
    h += '<div class="tkb-foot">' + foot + '</div>';
    return '<div class="tkb">' + h + '</div>';
  }
  function tierDetailSheet(key) {
    var ev = buyEv(); if (!ev) return;
    var t = (ev.tiers || []).filter(function (x) { return x.key === key; })[0]; if (!t) return;
    S.detailTier = key;
    var ok = tierBuyable(ev, t), own = tierOwned(ev, t);
    var btn = ok ? '<button class="tk-btn p tkb-pick" data-sact="tier-pick">選擇 ' + esc(t.key === "ga" ? "一般" : t.key.toUpperCase()) + '</button>'
      : '<button class="tk-btn g" data-sact="close">' + (own ? "你已擁有這個票種" : tierLeft(t) === 0 ? "已售完" : "尚未開賣") + '</button>';
    sheet('<div class="tkb-sh"><button class="x" data-sact="close" aria-label="關閉">' + ic("close", "bi") + '</button>' +
      '<div class="hd"><div class="ib">' + ic(tierIcon(t)) + '</div><div><b>' + esc(t.name) + '</b><span>剩 ' + esc(tierLeft(t)) + ' 席 · 編號 ' + num3(t.numFrom) + '–' + num3(t.numTo) + '</span></div><em>' + nt(t.price) + '</em></div>' +
      '<div class="pt">票種福利</div><ul>' + (t.perks || []).map(function (p) { return '<li><i>' + ic(perkIcon(p), "bi") + '</i>' + esc(p) + '</li>'; }).join("") + '</ul>' +
      sharedList(ev) +
      '<div class="nt">終身編號：依付款完成順序配發 No.' + num3(t.numFrom) + '–' + num3(t.numTo) + '；有人退票時，釋出的號碼由下一位遞補。編號隨票轉讓。</div>' +
      ((t.perks || []).some(function (p) { return /合照/.test(p); }) ? '<div class="nt">' + (t.key === "ga" ? '生日牆合照需另外加購 PhotoPass NT$390（買票後在票夾加購）；由官方攝影師拍攝，自己的合格成片全數下載。' : (t.key === "vvip" ? '60 秒一對一已含合照（沒有另一段合照時段）；' : '') + '合照由官方攝影師拍攝，<b>自己的合格合照成片全數免費下載</b>，無須加購（經篩選、基本校色的高解析 JPEG，不含 RAW、失焦、閉眼與測試照）。') + '</div>' : '') +
      '<div class="nt">' + esc(BUY_TEXT.note) + '　<button class="tkb-lk" data-sact="buy-terms">完整購票須知 ›</button></div>' + btn + '</div>');
    var bx = sheetEl && sheetEl.querySelector(".tk-box"); if (bx) bx.classList.add("tkb-shbox");
  }

  /* ---------- 購買確認頁 ---------- */
  function createOrder(evId, tier) { S.buy = { evId: evId, kind: "meet", tier: tier, otpSent: false }; return S.buy; }   // hook：之後改成向伺服器建單也只換這裡
  function startPayment() {                                                                                              // hook：付款一律走伺服器 /ecpay/create
    if (loggedIn()) { if (!nickOk()) return; var b = $('[data-act="co-pay"]'); if (b) { b.disabled = true; b.textContent = "前往綠界付款…"; } payNow(); }
    else buyPayEmail(false);
  }
  /* paymentWebhook / issueTicket：伺服器端（Worker 收綠界通知 → 發票寄信），前端不寫死付款結果，只用 awaitPurchase 輪詢票夾 */
  try { window.CHANCE_TICKETS = { createOrder: createOrder, startPayment: startPayment, awaitIssue: function (e) { awaitPurchase(e, "meet"); } }; } catch (e) {}

  /* B217T：一般票可在確認頁勾選「加購生日牆合照」，一次付款（productKey：meet-<場次>-ga-pp，價格由伺服器讀後台） */
  function coPPAvail(ev, T) { return !!(T && T.key === "ga" && ev && ev.photoPrice > 0 && ev.photoOnSale !== false && !ppOwned(ev.id)); }
  function coTotal(ev, T, b) { return Number(T.price) + (b && b.pp && coPPAvail(ev, T) ? Number(ev.photoPrice) : 0); }
  function ppAddonHTML(ev, T, b) {
    if (!coPPAvail(ev, T)) return "";
    var on = !!(b && b.pp);
    return '<div class="tkb-sec">加購</div><button type="button" class="tkb-addon' + (on ? " on" : "") + '" data-act="co-pp" aria-pressed="' + on + '"><i class="bx">' + (on ? "✓" : "") + '</i><span class="tx"><b>生日牆合照</b><small>在生日牆與 CHANCE 合照一次，成片全數下載</small></span><em>＋' + nt(ev.photoPrice) + '</em></button>';
  }
  function coPPToggle() {
    var b = S.buy; if (!b) return;
    var ev = buyEvent(b.evId) || buyEv(), T = ev && (ev.tiers || []).filter(function (t) { return t.key === b.tier; })[0];
    if (!coPPAvail(ev, T)) return;
    b.pp = !b.pp; hap(8);
    var L = layerEl("checkout"); if (!L) return;
    var btn = L.querySelector(".tkb-addon"); if (btn) { btn.classList.toggle("on", b.pp); btn.setAttribute("aria-pressed", String(b.pp)); btn.querySelector(".bx").textContent = b.pp ? "✓" : ""; }
    var tb = L.querySelector(".tkb-total b"); if (tb) tb.textContent = nt(coTotal(ev, T, b));
    var cp = L.querySelector('[data-act="co-pay"]'); if (cp && !cp.disabled) cp.innerHTML = "前往付款 " + nt(coTotal(ev, T, b)) + " <i>→</i>";
  }
  function checkoutHTML() {
    var b = S.buy || {}, ev = buyEvent(b.evId) || buyEv(), T = ev && (ev.tiers || []).filter(function (t) { return t.key === b.tier; })[0];
    var h = buyBar("", "購買票券");
    if (!ev || !T) return '<div class="tkb">' + h + '<div class="tk-empty">請先選擇票種。</div></div>';
    var X = bt(ev), d = tw(ev.startAt), mmdd = d ? (d.getUTCMonth() + 1) + "." + ("0" + d.getUTCDate()).slice(-2) : "";
    h += '<div class="tkb-ev"><div class="po"><img src="' + esc(asset(BUY_TEXT.assets.thumb)) + '" alt=""><div class="pt"><span>' + esc(X.kicker) + '</span><b>' + esc(X.short) + '</b><i>' + esc(mmdd) + '</i></div></div>' +
      '<div class="in"><h3>' + esc(ev.name || "CHANCE") + '</h3><p>' + ic("cal", "bi s") + esc(md(ev.startAt)) + '（' + esc(wk(ev.startAt)) + '）' + esc(hm(ev.startAt)) + '</p><p>' + ic("pin", "bi s") + esc(ev.venue || "") + '</p><p>' + ic("people", "bi s") + esc(ev.capacity || "") + ' 席</p></div></div>';
    h += '<div class="tkb-sec">已選擇票種</div><div class="tkb-row sel static"><div class="ib">' + ic(tierIcon(T)) + '</div><div class="mid"><div class="nm">' + esc(T.name) + '</div><div class="meta">剩 ' + esc(tierLeft(T)) + ' 席 · 編號 ' + num3(T.numFrom) + '–' + num3(T.numTo) + '</div></div><div class="rt"><div class="pr">' + nt(T.price) + '</div></div>' + chipsHTML(T, 3) + '</div>';
    h += '<div class="tkb-qty"><div class="tkb-sec">數量</div><div class="row"><b class="one">1 張</b><span>' + esc(BUY_TEXT.limitNote) + '</span></div></div>';
    h += ppAddonHTML(ev, T, b);
    h += '<div class="tkb-seat">' + ic("star", "bi s") + '<span>付款後依付款完成順序配發 <b>終身編號</b>（No.' + num3(T.numFrom) + '–' + num3(T.numTo) + '）；有人退票時，釋出的號碼由下一位遞補。編號隨票轉讓。</span></div>';
    if (loggedIn()) h += '<div class="tkb-mail">' + ic("check", "bi s") + '<span>票會寄到 <b>' + esc(maskEmail(myEmail())) + '</b>，也會存進票夾</span></div>';
    else h += '<div class="tkb-sec">收票 Email</div><input class="tk-in tkb-in" id="tk-bem" type="email" inputmode="email" autocomplete="email" autocapitalize="off" spellcheck="false" enterkeyhint="next" placeholder="你的 email（票會寄到這裡）" value="' + esc(lsGet(K.email) || "") + '">';
    h += '<div class="tkb-sec">你的稱呼</div>' + nickInput("tkb-in") + '<div class="tkb-hint">' + esc(nickHint(T)) + '</div>';
    h += '<div class="tk-msg" id="tk-bmsg"></div>';
    h += '<div class="tkb-total"><span>應付金額</span><b>' + nt(coTotal(ev, T, b)) + '</b></div><p class="tkb-fine">' + esc(termsFor(ev)) + '<br>前往付款即表示同意 <button class="tkb-lk" data-act="buy-terms">《購票須知》</button></p>';
    h += '<div class="tkb-foot solo"><button class="tkb-cta wide" data-act="co-pay">前往付款 ' + nt(coTotal(ev, T, b)) + ' <i>→</i></button><div class="tkb-sec2">綠界 ECPay 安全付款 · 付款後票直接進票夾</div></div>';
    return '<div class="tkb">' + h + '</div>';
  }

  /* ---------- 購買成功頁 ---------- */
  function c128svg(txt) {
    var vals = [104], i, sum = 104;
    for (i = 0; i < txt.length; i++) { var v = txt.charCodeAt(i) - 32; if (v < 0 || v > 94) v = 0; vals.push(v); sum += v * (i + 1); }
    vals.push(sum % 103);
    var bits = vals.map(function (v) { return C128[v]; }).join("") + "1100011101011";
    var x = 0, r = "";
    for (i = 0; i < bits.length; i++) { if (bits[i] === "1") r += '<rect x="' + x + '" y="0" width="1" height="40"/>'; x++; }
    return '<svg class="tkb-bc" viewBox="-10 0 ' + (bits.length + 20) + ' 40" preserveAspectRatio="none" role="img" aria-label="票號條碼 ' + esc(txt) + '">' + r + '</svg>';
  }
  function doneHTML() {
    var dn = S.done || {}, ev = buyEvent(dn.evId) || eventById(dn.evId) || {}, t = ticketById(dn.ticketId) || ticketsFor(dn.evId)[0] || null;
    var X = bt(ev), d = tw(ev.startAt), mmdd = d ? (d.getUTCMonth() + 1) + "." + ("0" + d.getUTCDate()).slice(-2) : "";
    var tierLbl = t ? (t.tier === "ga" ? "GENERAL" : String(t.tier || "").toUpperCase()) : "";
    var h = '<div class="tk-bar tkb-bar"><button disabled style="opacity:0"></button><div class="c">購買成功</div><button class="r tkb-mine" data-act="done-close">完成</button></div>';
    h += '<div class="tkb-ok"><div class="ck">' + ic("check", "bi") + '</div><h2>購買成功</h2><p>' + (t && t.tierName ? esc(t.tierName) + (t.seat ? ' · 終身編號 No.' + esc(t.seat) : '') + '，已加入我的票夾' : '你的票券已加入我的票夾') + '</p></div>';
    h += '<div class="tkb-tkt"><div class="im"><img src="' + esc(asset(BUY_TEXT.assets.ticket)) + '" alt=""><div class="fd"></div>' +
      (tierLbl ? '<em class="bd">' + esc(tierLbl) + '</em>' : '') +
      '<div class="tx"><span>' + esc(X.kicker) + '</span><b>' + esc(X.short) + '</b><i>' + esc(mmdd) + ' <small>' + esc(X.city) + '</small></i></div>' +
      (t && t.seat ? '<div class="no">No.<b>' + esc(t.seat) + '</b></div>' : '') + '</div>' +
      '<div class="stub">' + (t ? c128svg(t.id) + '<div class="id">' + esc(t.id) + '</div>' : '<div class="id">票整理中…</div>') + '</div></div>';
    h += '<div class="tkb-okinfo">' + ic("lock", "bi s") + '<span>上方是票號，<b>不是入場 QR</b>。入場 QR 會在開場前 ' + QR_LOCK_H + ' 小時自動出現在票夾（防截圖轉賣）。</span></div>';
    if (t && t.tier === "ga" && ev.photoPrice > 0 && ev.photoOnSale !== false && !ppOwned(ev.id)) h += '<div class="tkb-pp"><div class="tx"><b>📸 加購生日牆合照</b><span>在生日牆與 CHANCE 合照一次，成片全數下載</span></div><button class="tkb-cta" data-act="buy-pp" data-ev="' + esc(ev.id) + '">' + nt(ev.photoPrice) + ' 加購</button></div>';
    h += '<button class="tkb-cta wide" data-act="done-wallet">查看我的票夾 <i>→</i></button><button class="tkb-cta ghost wide" data-act="done-close">繼續逛周邊</button>';
    h += a2hsHint();
    return '<div class="tkb">' + h + '</div>';
  }

  (function(){ if(document.getElementById('tkb-style')) return; var st=document.createElement('style'); st.id='tkb-style'; st.textContent="/* B202T 購買頁 · 沿用 --tkg 金色 token */\n.tk-layer[data-layer=buy],.tk-layer[data-layer=checkout],.tk-layer[data-layer=done]{padding-bottom:0;background:#080808}\n.tkb{--tkp:22px;--g:var(--tkg,#e5be7d);--g2:var(--tkg2,#f0d4a5);--ink:#f3eee6;--mut:#a39a91;--line:rgba(229,190,125,.14);--card:#121011;\n  min-height:100%;display:flex;flex-direction:column;color:var(--ink);font-family:-apple-system,\"SF Pro Text\",\"PingFang TC\",\"Noto Sans TC\",sans-serif;-webkit-font-smoothing:antialiased}\n.tkb .bi{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;flex:none}\n.tkb .bi.s{width:15px;height:15px}\n.tkb-bar{position:sticky;top:0;background:linear-gradient(#080808e6,#08080800)!important;border-bottom:0!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}\n.tkb-bar .c{font:500 12px/1.2 var(--shop-serif,Georgia,serif)!important;letter-spacing:.3em!important}\n.tkb-mine{font:500 13px/1 -apple-system,sans-serif!important;color:var(--g)!important;letter-spacing:.02em;white-space:nowrap}\n.tkb-mine b{display:inline-grid;place-items:center;min-width:18px;height:18px;margin-left:3px;border-radius:9px;background:var(--g);color:#140f08;font-size:11px}\n/* Hero */\n.tkb-hero{position:relative;margin:calc(-52px - env(safe-area-inset-top)) calc(-1 * var(--tkp)) 0;aspect-ratio:1/.76;overflow:hidden;background:#0b0806}\n.tkb-hero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 16%}\n.tkb-hero-fade{position:absolute;inset:0;background:linear-gradient(180deg,#080808b0 0%,#08080800 22%,#08080800 45%,#080808c8 78%,#080808 100%),linear-gradient(90deg,#080808a8 0%,#08080800 62%)}\n.tkb-hero-tx{position:absolute;left:24px;right:24px;bottom:12px}\n.tkb-hero-tx .k{font:500 16px/1 var(--shop-serif,Georgia,serif);letter-spacing:.2em;color:#efe4d2;margin-bottom:6px}\n.tkb-hero-tx .t{font:500 clamp(38px,11.4vw,50px)/.9 var(--shop-serif,Georgia,serif);letter-spacing:.01em;color:var(--g2);text-transform:uppercase;text-shadow:0 2px 24px #000a}\n.tkb-hero-tx .d{display:flex;align-items:baseline;gap:12px;margin-top:10px}\n.tkb-hero-tx .d b{font:400 clamp(30px,8.8vw,38px)/1 var(--shop-serif,Georgia,serif);color:#f3eee6;letter-spacing:.01em}\n.tkb-hero-tx .d span{font:500 11px/1 var(--shop-serif,Georgia,serif);letter-spacing:.24em;color:#d8cbb8}\n.tkb-hero-tx .g{margin-top:9px;font:500 10px/1.2 var(--shop-serif,Georgia,serif);letter-spacing:.22em;color:#bfb1a0}\n/* 活動摘要 */\n.tkb-sum{display:grid;grid-template-columns:1fr 1.25fr .9fr;gap:6px;margin:10px 0 12px;padding:12px 10px;border:1px solid var(--line);border-radius:14px;background:#0f0d0e}\n.tkb-sum>div{display:flex;align-items:center;gap:8px;min-width:0;color:var(--g)}\n.tkb-sum>div+div{border-left:1px solid #ffffff0d;padding-left:8px}\n.tkb-sum p{margin:0;min-width:0}\n.tkb-sum b{display:block;font-size:13px;font-weight:600;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.tkb-sum span{display:block;font-size:11px;color:var(--mut);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.tkb-sec{font-size:13px;font-weight:600;color:#d9d1c7;letter-spacing:.04em;margin:0 2px 10px}\n.tkb-sec2{font-size:11px;color:var(--mut);text-align:center;margin-top:8px}\n/* 票種列 */\n.tkb-list{display:flex;flex-direction:column;gap:9px}\n.tkb-row{position:relative;display:grid;grid-template-columns:46px 1fr auto;column-gap:12px;row-gap:0;align-items:start;padding:12px 12px 11px 13px;border:1px solid #ffffff12;border-radius:16px;background:var(--card);cursor:pointer;transition:border-color .18s,background .18s,transform .12s;-webkit-tap-highlight-color:transparent}\n.tkb-row:active{transform:scale(.99)}\n.tkb-row.vv{border-color:rgba(229,190,125,.28)}\n.tkb-row.sel{border-color:var(--g);background:linear-gradient(135deg,rgba(229,190,125,.16),rgba(229,190,125,.04) 60%),var(--card);box-shadow:0 0 0 1px rgba(229,190,125,.25) inset}\n.tkb-row.off{opacity:.55;cursor:default}\n.tkb-row.static{cursor:default}\n.tkb-row .ib{grid-row:1/3;width:46px;height:46px;border-radius:12px;display:grid;place-items:center;color:var(--g);background:linear-gradient(145deg,#2a2016,#171210);border:1px solid rgba(229,190,125,.22)}\n.tkb-row .ib .bi{width:24px;height:24px}\n.tkb-row .mid{min-width:0}\n.tkb-row .nm{font-size:16px;font-weight:600;color:var(--ink);display:flex;align-items:center;gap:7px}\n.tkb-row .lim{font-style:normal;font:600 9px/1 -apple-system,sans-serif;letter-spacing:.16em;color:var(--g);border:1px solid rgba(229,190,125,.45);border-radius:4px;padding:3px 5px}\n.tkb-row .meta{font-size:12px;color:var(--mut);margin-top:3px}\n.tkb-row em{display:inline-block;font-style:normal;font-size:11.5px;color:#d8a9a0;margin-top:6px}\n.tkb-row em.own{color:#9fd8b0}\n.tkb-chips{grid-column:2/4;display:flex;flex-wrap:wrap;gap:5px;margin-top:8px;min-width:0;padding-right:24px}\n.tkb-chips span{font-size:11px;line-height:1;color:#d9cfc2;background:#1e1a1a;border:1px solid #ffffff10;border-radius:6px;padding:5px 7px;white-space:nowrap}\n.tkb-row .rt{display:flex;flex-direction:column;align-items:flex-end;gap:9px}\n.tkb-row .pr{font:500 17px/1 var(--shop-serif,Georgia,serif);color:var(--g2);letter-spacing:.02em;white-space:nowrap}\n.tkb-row .rd{width:20px;height:20px;border-radius:50%;border:1.5px solid #6d6258;display:grid;place-items:center}\n.tkb-row.sel .rd{border-color:var(--g)}\n.tkb-row.sel .rd::after{content:\"\";width:10px;height:10px;border-radius:50%;background:var(--g)}\n.tkb-row .more{position:absolute;right:4px;bottom:5px;width:32px;height:30px;margin:0;padding:0;display:grid;place-items:center;color:#9c9187;background:none;border:0;border-radius:8px;-webkit-appearance:none;appearance:none}\n.tkb-row .more:active{background:#ffffff0d}\n.tkb-row.static .more,.tkb-row.static .rd{display:none}\n.tkb-fine{font-size:11px;line-height:1.6;color:#8a8178;margin:12px 2px 0}\n/* 底部固定購買列 */\n.tkb-foot{position:sticky;bottom:0;margin:auto calc(-1 * var(--tkp)) 0;padding:12px 16px calc(12px + env(safe-area-inset-bottom));display:flex;align-items:center;gap:12px;background:linear-gradient(#0d0b0cf2,#0a0909);border-top:1px solid var(--line);box-shadow:0 -12px 30px #000c;z-index:4}\n.tkb-list+.tkb-fine+.tkb-foot{margin-top:18px}\n.tkb-foot img{width:44px;height:44px;border-radius:10px;object-fit:cover;border:1px solid rgba(229,190,125,.3)}\n.tkb-foot .fx{flex:1;min-width:0}\n.tkb-foot .fx span{display:block;font-size:12px;color:var(--mut);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.tkb-foot .fx b{display:block;font:500 20px/1.2 var(--shop-serif,Georgia,serif);color:var(--g2)}\n.tkb-foot .fx b.dim{font:600 14px/1.4 -apple-system,sans-serif;color:#d9d1c7}\n.tkb-foot.solo{flex-direction:column;align-items:stretch;gap:0}\n.tkb-cta{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:50px;padding:0 22px;border-radius:25px;border:0;font:700 15px/1 -apple-system,\"PingFang TC\",sans-serif;letter-spacing:.04em;color:#1a1208;background:linear-gradient(180deg,#f4dcae,#dcb173);box-shadow:0 6px 18px rgba(229,190,125,.22);cursor:pointer;white-space:nowrap}\n.tkb-cta i{font-style:normal;font-size:17px}\n.tkb-cta:active{transform:scale(.98)}\n.tkb-cta[disabled]{background:#2a2522;color:#8f857b;box-shadow:none;cursor:default}\n.tkb-cta.ghost{background:transparent;color:var(--ink);border:1px solid #ffffff2a;box-shadow:none}\n.tkb-cta.wide{width:100%;height:54px;border-radius:14px;margin-top:10px}\n.tkb-foot .tkb-cta.wide{margin-top:0}\n/* 票種詳情 Bottom Sheet */\n.tkb-shbox{padding-top:26px!important;position:relative}\n.tkb-shbox::before{content:\"\";position:absolute;top:9px;left:50%;width:40px;height:4px;border-radius:2px;background:#ffffff2e;transform:translateX(-50%)}\n.tkb-sh{position:relative;color:#f3eee6;font-family:-apple-system,\"PingFang TC\",sans-serif}\n.tkb-sh .bi{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}\n.tkb-sh .x{position:absolute;right:-6px;top:-14px;width:36px;height:36px;display:grid;place-items:center;color:#cfc5b9;background:none;border:0}\n.tkb-sh .hd{display:grid;grid-template-columns:52px 1fr auto;gap:12px;align-items:center;padding:4px 0 16px;border-bottom:1px solid #ffffff12}\n.tkb-sh .hd .ib{width:52px;height:52px;border-radius:12px;display:grid;place-items:center;color:var(--tkg,#e5be7d);background:linear-gradient(145deg,#2a2016,#171210);border:1px solid rgba(229,190,125,.25)}\n.tkb-sh .hd .ib .bi{width:26px;height:26px}\n.tkb-sh .hd b{display:block;font-size:18px;font-weight:600}\n.tkb-sh .hd span{display:block;font-size:12px;color:#a39a91;margin-top:2px}\n.tkb-sh .hd em{font:500 19px/1 'Cormorant Garamond',Georgia,serif;font-style:normal;color:#f0d4a5}\n.tkb-sh .pt{font-size:13px;font-weight:600;color:#d9d1c7;margin:16px 0 8px}\n.tkb-sh ul{list-style:none;margin:0;padding:0}\n.tkb-sh li{display:flex;align-items:center;gap:12px;font-size:15px;padding:8px 0;color:#ece6dd}\n.tkb-sh li i{width:34px;height:34px;flex:none;display:grid;place-items:center;border-radius:9px;background:#1d1917;border:1px solid #ffffff12;color:var(--tkg,#e5be7d)}\n.tkb-sh .nt{font-size:11.5px;color:#8f867c;margin-top:10px;line-height:1.6}\n.tkb-sh .tkb-pick{margin-top:16px;height:52px;font-size:15px}\n/* 購買確認頁 */\n.tkb-ev{display:grid;grid-template-columns:104px 1fr;gap:16px;margin:10px 0 22px;padding-bottom:20px;border-bottom:1px solid #ffffff10}\n.tkb-ev .po{position:relative;width:104px;height:132px;border-radius:10px;overflow:hidden;border:1px solid rgba(229,190,125,.3)}\n.tkb-ev .po img{width:100%;height:100%;object-fit:cover}\n.tkb-ev .pt{position:absolute;left:0;right:0;bottom:0;padding:18px 8px 7px;background:linear-gradient(#08080800,#080808e0)}\n.tkb-ev .pt span{display:block;font:500 7px/1 var(--shop-serif,Georgia,serif);letter-spacing:.2em;color:#e9dfcf}\n.tkb-ev .pt b{display:block;font:500 11px/1.05 var(--shop-serif,Georgia,serif);color:var(--g2);letter-spacing:.02em;margin-top:2px}\n.tkb-ev .pt i{display:block;font:400 15px/1 var(--shop-serif,Georgia,serif);font-style:normal;color:#f3eee6;margin-top:3px}\n.tkb-ev h3{margin:2px 0 10px;font:500 21px/1.2 var(--shop-cn,'Noto Serif TC',serif);color:var(--ink)}\n.tkb-ev p{margin:0 0 7px;display:flex;align-items:center;gap:8px;font-size:13.5px;color:#d7cec3}\n.tkb-ev p .bi{color:var(--g)}\n.tkb-qty{margin:22px 0 16px}\n.tkb-qty .row{display:flex;align-items:center;gap:14px}\n.tkb-qty .stp{display:grid;grid-template-columns:44px 52px 44px;height:44px;border:1px solid #ffffff1c;border-radius:12px;overflow:hidden;background:#121011}\n.tkb-qty .stp button{border:0;background:#1a1717;color:#6d655e;font-size:20px}\n.tkb-qty .stp b{display:grid;place-items:center;font-size:17px;border-left:1px solid #ffffff12;border-right:1px solid #ffffff12}\n.tkb-qty .row span{font-size:12px;color:var(--mut)}\n.tkb-seat,.tkb-mail,.tkb-addon{display:flex;align-items:center;gap:12px;width:100%;text-align:left;background:#121011;border:1.5px solid #ffffff1a;border-radius:16px;padding:14px;margin:0 0 14px;color:inherit;font:inherit;cursor:pointer}\n.tkb-addon.on{border-color:var(--g);background:linear-gradient(135deg,#221a10,#15110c)}\n.tkb-addon .bx{flex:0 0 24px;height:24px;border-radius:7px;border:1.5px solid #ffffff4d;display:flex;align-items:center;justify-content:center;font-style:normal;font-size:15px;font-weight:700;color:#1a1409}\n.tkb-addon.on .bx{background:var(--g);border-color:var(--g)}\n.tkb-addon .tx{flex:1;min-width:0}.tkb-addon b{display:block;font-size:16px;color:#f3eee6}.tkb-addon small{display:block;margin-top:3px;font-size:13px;line-height:1.5;color:#b9aea1}\n.tkb-addon em{font-style:normal;font-size:16px;font-weight:600;color:var(--g2,#f1ddb0);white-space:nowrap}\n.tkb-pp{display:flex;align-items:center;gap:12px;background:linear-gradient(135deg,#221a10,#15110c);border:1px solid rgba(216,188,128,.35);border-radius:16px;padding:14px;margin-bottom:12px}\n.tkb-pp .tx{flex:1;min-width:0}.tkb-pp b{display:block;font-size:16px;color:#f3eee6}.tkb-pp span{display:block;margin-top:3px;font-size:13px;line-height:1.5;color:#b9aea1}\n.tkb-pp .tkb-cta{flex:0 0 auto;padding:0 16px;height:44px;font-size:15px}\n.tkb-okinfo{display:flex;align-items:flex-start;gap:8px;font-size:12.5px;line-height:1.6;color:#cfc5b9;background:#12100f;border:1px solid #ffffff0f;border-radius:12px;padding:10px 12px;margin-bottom:10px}\n.tkb-seat .bi,.tkb-mail .bi,.tkb-okinfo .bi{color:var(--g);margin-top:3px}\n.tkb-seat b,.tkb-mail b,.tkb-okinfo b{color:var(--g2);font-weight:600}\n.tkb-in{margin:0 0 6px!important}\n.tkb-total{display:flex;align-items:baseline;justify-content:space-between;margin:14px 2px 0;padding-top:16px;border-top:1px solid #ffffff10}\n.tkb-total span{font-size:14px;font-weight:600;color:#d9d1c7}\n.tkb-total b{font:500 34px/1 var(--shop-serif,Georgia,serif);color:var(--g2);letter-spacing:.01em}\n.tkb .tk-msg{min-height:0}\n/* 購買成功頁 */\n.tkb-ok{text-align:center;margin:18px 0 20px}\n.tkb-ok .ck{width:66px;height:66px;margin:0 auto 14px;border-radius:50%;border:2px solid var(--g);display:grid;place-items:center;color:var(--g);box-shadow:0 0 30px rgba(229,190,125,.2)}\n.tkb-ok .ck .bi{width:32px;height:32px;stroke-width:2}\n.tkb-ok h2{margin:0;font:600 24px/1.3 var(--shop-cn,'Noto Serif TC',serif);color:var(--ink);letter-spacing:.06em}\n.tkb-ok p{margin:6px 0 0;font-size:13.5px;color:var(--mut)}\n.tkb-tkt{position:relative;margin:0 6px 14px;border-radius:14px;overflow:hidden;background:#fff;box-shadow:0 20px 50px #000c,0 0 0 1px rgba(229,190,125,.35)}\n.tkb-tkt .im{position:relative;aspect-ratio:1/.78;background:#0b0806}\n.tkb-tkt .im img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}\n.tkb-tkt .fd{position:absolute;inset:0;background:linear-gradient(180deg,#08080800 35%,#080808d8 100%)}\n.tkb-tkt .bd{position:absolute;top:14px;right:16px;font:500 18px/1 var(--shop-serif,Georgia,serif);font-style:normal;letter-spacing:.12em;color:var(--g2)}\n.tkb-tkt .tx{position:absolute;left:18px;bottom:16px}\n.tkb-tkt .tx span{display:block;font:500 10px/1 var(--shop-serif,Georgia,serif);letter-spacing:.22em;color:#e9dfcf}\n.tkb-tkt .tx b{display:block;font:500 20px/1.05 var(--shop-serif,Georgia,serif);color:var(--g2);margin-top:4px}\n.tkb-tkt .tx i{display:block;font:400 26px/1 var(--shop-serif,Georgia,serif);font-style:normal;color:#f3eee6;margin-top:6px}\n.tkb-tkt .tx small{font-size:10px;letter-spacing:.2em;color:#d8cbb8;margin-left:6px}\n.tkb-tkt .no{position:absolute;right:16px;bottom:16px;font:500 11px/1 var(--shop-serif,Georgia,serif);letter-spacing:.14em;color:#d8cbb8;text-align:right}\n.tkb-tkt .no b{display:block;font:500 26px/1 var(--shop-serif,Georgia,serif);color:var(--g2);letter-spacing:.04em;margin-top:3px}\n.tkb-tkt .stub{position:relative;padding:14px 16px 12px;background:#faf8f3;border-top:2px dashed #d9d2c4}\n.tkb-tkt .stub::before,.tkb-tkt .stub::after{content:\"\";position:absolute;top:-11px;width:20px;height:20px;border-radius:50%;background:#080808}\n.tkb-tkt .stub::before{left:-10px}.tkb-tkt .stub::after{right:-10px}\n.tkb-bc{display:block;width:100%;height:52px;fill:#111}\n.tkb-tkt .id{margin-top:6px;text-align:center;font:600 12px/1 ui-monospace,\"SF Mono\",monospace;letter-spacing:.12em;color:#2a2622}\n.tkb .tk-a2hs{margin-top:12px}\n.tkb-okinfo{margin:0 6px 4px}\n.tkb-hint{font-size:13px;color:#a39a91;margin:0 2px 8px;line-height:1.5}\n/* B210T 工作人員拍照掃碼 */\n.pps{padding:0 16px 40px}\n.pps-cam{position:relative;aspect-ratio:1/1;border-radius:20px;overflow:hidden;background:#000;margin:6px 0 12px}\n.pps-cam video{width:100%;height:100%;object-fit:cover;display:block}\n.pps-cam .fr{position:absolute;inset:16%;border:2px solid rgba(216,188,128,.9);border-radius:18px;box-shadow:0 0 0 999px rgba(0,0,0,.35)}\n.pps-camtxt{position:absolute;left:12px;right:12px;bottom:12px;text-align:center;font-size:14px;color:#f3eee6}\n.pps-camtxt button{margin-left:6px;border:1px solid #d8bc80;background:none;color:#d8bc80;border-radius:10px;padding:6px 10px;font:inherit}\n.pps-res .idle{padding:18px;border-radius:16px;background:#121011;color:#8f867c;text-align:center;font-size:15px}\n.pps-res .card{padding:16px 18px;border-radius:16px}\n.pps-res .card.ok{background:#11301b;border:1px solid #2f8a4f}\n.pps-res .card.bad{background:#3a1515;border:1px solid #b44}\n.pps-res .card b{display:block;font-size:22px;line-height:1.3;color:#fff}\n.pps-res .card span{display:block;margin-top:4px;font-size:14px;color:#d9d1c7}\n.pps-btns{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 0}\n.pps-btns .tk-btn{margin:0}\n.pps-stat{font-size:13px;line-height:1.5;color:#a39a91;margin:4px 2px 10px}.pps-stat b{color:#f3eee6}.pps-stat em{color:#e0b36b;font-style:normal}\n.pps-list .r{display:grid;grid-template-columns:70px 1fr auto 40px;gap:8px;align-items:center;padding:10px 4px;border-bottom:1px solid #ffffff10;font-size:15px}\n.pps-list .r i{font-style:normal;color:#a39a91;font-variant-numeric:tabular-nums}\n.pps-list .r b{color:#f3eee6;font-weight:600}\n.pps-list .r span{color:#a39a91;font-size:13px}\n.pps-list .r em{font-style:normal;text-align:right;color:#8fd39a}\n.pps-list .r.un{opacity:.45}.pps-list .r.un b{text-decoration:line-through}\n.pps-list .r.er b,.pps-list .r.er em{color:#e6a3a3}\n.pps-list .empty{color:#8f867c;font-size:14px;padding:12px 4px}\n.pps-help{font-size:13px;line-height:1.6;color:#8f867c;margin:16px 2px}\n.pps-clock{font:600 54px/1.1 ui-monospace,Menlo,monospace;text-align:center;color:#fff;margin:18px 0 4px;font-variant-numeric:tabular-nums}\n.pps-clock2{text-align:center;color:#a39a91;font-size:14px;margin-bottom:16px}\n/* B207T 粉絲視角優化 */\n.tkb-list+.tkb-share{margin-top:14px}\n.tkb-row .tkb-chips{padding-right:64px}\n.tkb-bar{background:rgba(8,8,8,.94)!important;-webkit-backdrop-filter:saturate(1.4) blur(16px)!important;backdrop-filter:saturate(1.4) blur(16px)!important}\n.tkb-row .more{width:auto;padding:0 6px 0 8px;font:500 13px/1 -apple-system,sans-serif;color:#b8ad9f;display:flex;align-items:center;gap:2px;white-space:nowrap}\n.tk-ferr{font-size:13px;color:#e6a3a3;margin:6px 2px 0}.tkb-in+.tk-ferr{margin:-2px 2px 8px}\n.tkb-qty .one{display:inline-grid;place-items:center;min-width:64px;height:40px;padding:0 14px;border:1px solid #ffffff1c;border-radius:12px;background:#121011;font-size:16px;color:#f3eee6}\n.tk-in.err{border-color:#e08a8a!important;box-shadow:0 0 0 1px rgba(224,138,138,.35)}\n/* B204T 全票種共享・購票須知 */\n.tkb-share{margin:0 0 12px;padding:11px 13px;border:1px dashed rgba(229,190,125,.3);border-radius:14px;background:#0f0d0e}\n.tkb-share b{display:block;font-size:12px;font-weight:600;letter-spacing:.12em;color:var(--g);margin-bottom:5px}\n.tkb-share span{display:block;font-size:14px;line-height:1.6;color:#d9cfc2}\n.tkb-lk{display:inline;border:0;background:none;padding:0;margin:0;font:inherit;color:var(--g);text-decoration:underline;text-underline-offset:3px;cursor:pointer}\n.tkb-terms h3{margin:4px 0 6px;font-size:20px;color:#f3eee6}\n.tkb-terms .pt{font-size:15px;font-weight:600;color:#d9d1c7;margin:16px 0 6px}\n.tkb-terms ul{margin:0;padding-left:18px}\n.tkb-terms li{font-size:14px;line-height:1.65;color:#cfc5b9;margin:3px 0}\n.tkb-terms li b{color:#f3eee6}\n.tkb-terms .nt{font-size:13px;color:#8f867c;margin-top:14px}\n/* B203T 字級：對齊 iOS 標準（內文17／次要15／說明13／最小12），只加覆寫不改原規則 */\n.tkb-bar .c{font-size:13px!important}\n.tkb-mine{font-size:15px!important}\n.tkb-mine b{font-size:12px;min-width:20px;height:20px;border-radius:10px}\n.tkb-sum{padding:12px;gap:4px}\n.tkb-sum>div{flex-direction:column;align-items:flex-start;gap:5px}\n.tkb-sum .bi{width:18px;height:18px}\n.tkb-sum b{font-size:14.5px}\n.tkb-sum span{font-size:12px}\n.tkb-sec{font-size:15px}\n.tkb-sec2{font-size:12px}\n.tkb-row .nm{font-size:17px}\n.tkb-row .lim{font-size:10px}\n.tkb-row .meta{font-size:13px}\n.tkb-row em{font-size:13px}\n.tkb-chips span{font-size:12px;padding:5px 8px}\n.tkb-row .pr{font-size:20px}\n.tkb-fine{font-size:13px;color:#a39a91}\n.tkb-foot .fx span{font-size:13px}\n.tkb-foot .fx b{font-size:22px}\n.tkb-foot .fx b.dim{font-size:16px}\n.tkb-cta{font-size:17px}\n.tkb-cta i{font-size:19px}\n.tkb-ev p{font-size:15px}\n.tkb-qty .row span{font-size:14px}\n.tkb-seat,.tkb-mail,.tkb-okinfo{font-size:14px}\n.tkb-total span{font-size:16px}\n.tkb-sh li{font-size:16px}\n.tkb-sh .nt{font-size:13px}\n.tkb-sh .pt{font-size:15px}\n.tkb-sh .hd span{font-size:13px}\n.tkb-hero-tx .g{font-size:11px}\n.tkb-ok p{font-size:15px}\n/* 價格用等高數字：Cormorant 預設舊式數字會讓 NT$30 看起來像 NT$3o */\n.tkb-row .pr,.tkb-foot .fx b,.tkb-total b,.tkb-sh .hd em,.tkb-tkt .no b{font-variant-numeric:lining-nums;font-feature-settings:'lnum' 1}\n@media (max-width:359px){.tkb{--tkp:16px}.tkb-sum .bi,.tkb-row .lim{display:none}.tkb-sum{padding:10px 8px}.tkb-sum b{font-size:12px}.tkb-sum{grid-template-columns:1fr 1fr 1fr}.tkb-row{grid-template-columns:42px 1fr auto;gap:10px;padding:12px 12px 10px}.tkb-row .ib{width:42px;height:42px}.tkb-row .nm{font-size:15px}.tkb-ev{grid-template-columns:88px 1fr}.tkb-ev .po{width:88px;height:112px}.tkb-cta{padding:0 16px}}\n@media (max-width:359px){.tkb-sum b{font-size:13px}.tkb-sum span{font-size:11px}.tkb-row .nm{font-size:16px}.tkb-row .pr{font-size:18px}.tkb-chips span{font-size:11px;padding:5px 7px}.tkb-cta{font-size:16px}.tkb-qty .row span{font-size:12.5px}.tkb-foot .fx b{font-size:20px}}\n"; document.head.appendChild(st); })();
  document.addEventListener("keydown", function (e) { if ((e.key === "Enter" || e.key === " ") && e.target && e.target.getAttribute && e.target.getAttribute("role") === "radio" && e.target.hasAttribute("data-act")) { e.preventDefault(); e.target.click(); } });
  function onClick(e) {
    var b = e.target.closest("[data-act]"); if (!b) return;
    var act = b.getAttribute("data-act"), id = b.getAttribute("data-id");
    if (act === "noop") return;
    if (act === "back") return back();
    if (act === "profile") return profileSheet();
    if (act === "open-wallet") { S.tab = "up"; return openLayer("wallet"); }
    if (act === "open-now") { e.stopPropagation(); var nm = nextMine(); openLayer("wallet"); if (nm) setTimeout(function () { openLayer("pass", { sel: nm.id }); }, 60); return; }
    if (act === "open-buy") { e.stopPropagation(); S.buyEv = b.getAttribute("data-ev") || S.buyEv || null; S.buySel = null; return openLayer("buy"); }
    if (act === "tier-sel") { var tk = b.getAttribute("data-tier"); S.buySel = S.buySel === tk ? null : tk; hap(8); renderLayer("buy"); return; }
    if (act === "tier-info") { e.stopPropagation(); return tierDetailSheet(b.getAttribute("data-tier")); }
    if (act === "buy-go") { var bev = buyEv(); if (!bev || !S.buySel) return; createOrder(bev.id, S.buySel); return openLayer("checkout"); }
    if (act === "buy-remind") { var rev = buyEv(); if (rev) { setRemind(rev.id); renderLayer("buy"); } return; }
    if (act === "co-pay") { return startPayment(); }
    if (act === "co-pp") return coPPToggle();
    if (act === "done-wallet") { closeAll(); S.tab = "up"; setTimeout(function () { openLayer("wallet"); }, 260); return; }
    if (act === "done-close") { closeAll(); return; }
    if (act === "open-merch") return openLayer("merch");
    if (act === "open-detail") return openLayer("detail", { key: b.getAttribute("data-key") });
    if (act === "open-pass") return openLayer("pass", { sel: id });
    if (act === "tab") { S.tab = b.getAttribute("data-tab"); renderLayer("wallet"); return; }
    if (act === "eremind") { e.stopPropagation(); var ev = eventById(b.getAttribute("data-ev")); setRemind(ev ? ev.id : b.getAttribute("data-ev")); renderLayer("wallet"); return; }
    if (act === "mremind") { e.stopPropagation(); setRemind("merch-" + b.getAttribute("data-key")); renderLayer("merch"); renderLayer("detail"); return; }
    if (act === "mbuy") { e.stopPropagation(); return merchBuy(b.getAttribute("data-key")); }
    if (act === "pick-tier") { e.stopPropagation(); return tierSheet(b.getAttribute("data-ev")); } if(act==="buytier"){ e.stopPropagation(); var _ev=b.getAttribute("data-ev"), _tier=b.getAttribute("data-tier"); S.tierEv=_ev; buyConfirm(_ev,"meet",_tier); return; }
    if (act === "buy") { e.stopPropagation(); return buyConfirm(b.getAttribute("data-ev")); }
    if (act === "buy-pp") { e.stopPropagation(); return buyConfirm(b.getAttribute("data-ev"), "pp"); }
    if (act === "rebuy") { return buyConfirm(b.getAttribute("data-ev")); }
    if (act === "add") { e.stopPropagation(); return addSheet(); }
    if (act === "photo-qr") return photoQrSheet();
    if (act === "refresh-ticket") { loadMine(true).then(function () { renderLayer("pass"); toast("票券已更新"); }); return; }
    if (act === "rules") return rulesSheet();
    if (act === "buy-terms") return buyTermsSheet();
    if (act === "menu") return walletMenu();
    if (act === "pps-undo") return ppsUndo();
    if (act === "pps-manual") return ppsManual();
    if (act === "pps-clock") return ppsClock();
    if (act === "pps-cam") return ppsCamStart();
    if (act === "pps-logout") { if (!window.confirm("登出工作人員？（未上傳的紀錄會保留在這支手機）")) return; lsSet("tk:staffKey", null); ppsStop(); back(); toast("已登出工作人員"); return; }
    if (act === "transfer") return transferConfirm();
    if (act === "show-transfer") { if (S.transfer && S.transfer.ticketId === S.sel) openTransferSheet(); else startTransfer(S.sel); return; }
    if (act === "cancel-transfer") return cancelTransfer(S.sel);
    if (act === "ics") return downloadICS();
    if (act === "map") return openMap();
    if (act === "share-ev") { var ce = curEv(); if (navigator.share && ce) navigator.share({ title: ce.name, text: (ce.name || "") + " · " + md(ce.startAt) + " " + hm(ce.startAt) + " · " + (ce.venue || ""), url: location.origin + "/" }).catch(function () {}); else toast("這個瀏覽器不支援分享"); return; }
    if (act === "share") { var it = merchItems().filter(function (x) { return x.key === S.detail; })[0]; if (navigator.share) navigator.share({ title: "THE SKY COLLECTION", text: "我的收藏：" + (it ? it.name : ""), url: location.origin + "/" }).catch(function () {}); else toast("這個瀏覽器不支援分享"); return; }
    if (act === "goto") return navTo(b.getAttribute("data-go"));
    if (act === "order") return orderSheet(b.getAttribute("data-key"));
    if (act === "otp") return sendOtp();
    if (act === "login") return doLogin();
  }
  function sheetAct2(a) {
    if (a === "tier-pick") { S.buySel = S.detailTier; closeSheet(); hap(8); renderLayer("buy"); return; }
    if (a === "showmail") { toast(S.email); return; }
    if (a === "logout") { clearSession(); closeSheet(); closeAll(); render(); toast("已登出票務"); return; }
    if (a === "openwallet") { closeSheet(); openLayer("wallet"); return; }
    if (a === "refresh") { closeSheet(); loadMine(true).then(function () { S.layers.forEach(renderLayer); render(); toast("票券已更新"); }); return; }
    if (a === "rules") { rulesSheet(); return; }
    if (a === "buy-terms") { buyTermsSheet(); return; }
    if (a === "ppstaff") { openStaff(); return; }
    if (a === "ppkey-save") { ppsKeySave(); return; }
    if (a === "transfer-go") { closeSheet(); startTransfer(S.sel); return; }
    if (a.indexOf("tier:") === 0) { closeSheet(); buyConfirm(S.tierEv, "meet", a.slice(5)); return; }
    if (a === "otp-send") { buyOtpSend(); return; }
    if (a === "otp-resend") { buyOtpSend(); return; }
    if (a === "pay") { if (nickOk()) payNow(); return; }
    if (a === "pay-email") { buyPayEmail(false); return; }
    if (a === "em-keep") { buyPayEmail(true); return; }
    if (a === "em-fix") { var fe = $("#tk-bem"); if (fe && S.buy && S.buy.sug) fe.value = S.buy.sug; buyPayEmail(true); return; }
    if (a === "claim-verify") { claimVerify(); return; }
    if (a === "claim-resend") { claimSend(false); return; }
    if (a === "pay-verify") { buyVerifyPay(); return; }
    if (a === "see-ticket") { closeSheet(); var tt = S.buy && ticketsFor(S.buy.evId)[0]; if (tt) openLayer("pass", { sel: tt.id }); return; }
    if (a === "give") { closeSheet(); var tg = S.buy && ticketsFor(S.buy.evId)[0]; if (tg) { openLayer("pass", { sel: tg.id }); setTimeout(function () { S.sel = tg.id; transferConfirm(); }, 200); } return; }
    if (a === "repoll") { var el = sheetEl && sheetEl.querySelector('[data-sact="repoll"]'); var ev = el && el.getAttribute("data-ev"), kd = el && el.getAttribute("data-kind"); if (ev) { closeSheet(); awaitPurchase(ev, kd); } return; }
    if (a === "tomerch") { closeSheet(); closeAll(); var nb = $(C.merchNavSel); if (nb) nb.click(); refresh(true); setTimeout(function () { openLayer("wallet"); }, 120); return; }
    return sheetAct(a);
  }

  /* ---------- 倒數：每 20 秒更新數字，時間到自動解鎖 QR ---------- */
  function tick() {
    if(body && S.coverClock !== coverClockKey()) render();
    document.querySelectorAll("[data-cd]").forEach(function (el) {
      var to = Number(el.getAttribute("data-cd")), p = parts(to - Date.now()), bs = el.querySelectorAll("b");
      if (bs.length === 3) { bs[0].textContent = p.d; bs[1].textContent = p.h; bs[2].textContent = p.m; }
      if (to <= Date.now() && el.classList.contains("tk-lcd")) { loadMine(true).then(function(){renderLayer("pass");}); }
    });
  }

  /* ---------- 啟動 ---------- */
  function boot() {
    mount(); render();
    var host = $(C.mount);
    if (host) {
      var mo = new MutationObserver(function () { if (host.classList.contains("active")) refresh(false); });
      mo.observe(host, { attributes: true, attributeFilter: ["class"] });
      if (host.classList.contains("active")) refresh(false);
    } else refresh(false);
    document.addEventListener("visibilitychange", function () { if (document.visibilityState === "visible" && S.session) loadMine(true).then(function () { render(); }); });
    setInterval(tick, 20000);
    var m = /[?&]transfer=([A-Za-z0-9]+)/.exec(location.search);
    if (m) { var nb = $(C.merchNavSel); if (nb) setTimeout(function () { nb.click(); }, 300); handleIncoming(m[1]); }
    document.addEventListener("visibilitychange", function () { if (document.visibilityState !== "visible") stopScan(); });
    var mbuy = /[?&]tkbought=([a-z0-9-]+)/.exec(location.search), mpho = /[?&]tkphoto=([a-z0-9-]+)/.exec(location.search);
    if (mbuy || mpho) {
      try { history.replaceState(null, "", location.pathname + (C.demo ? "?tkdemo=1" : "")); } catch (e) {}
      var nb2 = $(C.merchNavSel); if (nb2) setTimeout(function () { nb2.click(); }, 300);
      var pe = (mbuy ? mbuy[1] : mpho[1]), pk = mbuy ? "meet" : "pp";
      ensureSession().then(function () { render(); setTimeout(function () { awaitPurchase(pe, pk); }, 500); });
      return;
    }
    // demo 測試：直接當成「已登入・已有一張票」，PhotoPass／轉讓／相機一次點得到（?tkdemo=1&anon=1 可看未登入樣子）
    if (C.demo && !/[?&]anon=1/.test(location.search)) { S.session = "demo-auto"; S.email = "you@demo"; refresh(true); return; }
    if (unlockCreds() || lsGet(K.sess)) refresh(false);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
