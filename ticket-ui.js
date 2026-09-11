/* ticket-ui.js v3 — THE SKY COLLECTION（含 QRious 4.0.2）*/
/*! QRious v4.0.2 | (C) 2017 Alasdair Mercer | GPL v3 License
Based on jsqrencode | (C) 2010 tz@execpc.com | GPL v3 License
*/
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
  };
  var K = { sess: "tk:session", email: "tk:email" };
  var S = { session: null, email: "", tickets: [], events: [], loading: false, lastFetch: 0, pollTimer: null, cdTimer: null, transfer: null,
            layers: [], sel: null, tab: "up", detail: null };

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
    var ev = [{ id: "meet-20261227", code: "1227", name: "CHANCE 生日會", startAt: (/[?&]tkopen=1/.test(location.search) ? new Date(now + 3600e3).toISOString() : "2026-12-27T13:00:00+08:00"), venue: "微風影城 A 廳", price: 0, capacity: 181, sold: 96, left: 85, productKey: null, onSale: false },
              { id: "meet-20270213", code: "0213", name: "THE SKY 專輯聽片會", startAt: "2027-02-13T13:00:00+08:00", venue: "微風影城 A 廳", price: 0, capacity: 181, sold: 0, left: 181, productKey: null, onSale: false }];
    var T = [{ id: "1227-DEMO2345", eventId: "meet-20261227", status: "valid", ver: 1, issuedAt: new Date(now - 86400e3).toISOString(), usedAt: null, owner: "you@demo", transferPending: false, event: ev[0], qr: "CT1.1227-DEMO2345.1.0123456789abcdef0123", canTransfer: true, expired: false },
             { id: "0901-DEMO6789", eventId: "meet-past", status: "used", ver: 2, issuedAt: new Date(now - 30 * 86400e3).toISOString(), usedAt: "2026-09-01T13:12:00+08:00", owner: "you@demo", transferPending: false, event: { id: "meet-past", code: "0901", name: "THE SKY 上線派對", startAt: "2026-09-01T13:00:00+08:00", venue: "微風 MEGA STUDIO" }, qr: null, canTransfer: false, expired: true }];
    var pending = null, sessions = {};
    return { call: function (p, b) { return new Promise(function (res) { setTimeout(function () { res(route(p, b)); }, 350); }); } };
    function route(p, b) {
      if (p === "/ticket/events") return { ok: true, events: ev };
      if (p === "/interest") return { ok: true };
      if (p === "/ticket/otp") return { ok: true, sent: true };
      if (p === "/ticket/login") { if (b.otp && b.otp !== "123456") return { ok: false, error: "otp_wrong" }; var s = "demo-" + b.email; sessions[s] = b.email; if (b.code) T.forEach(function (t) { if (t.owner === "you@demo") t.owner = b.email; }); return { ok: true, session: s, email: b.email }; }
      var me = sessions[b.session] || "you@demo";
      if (p === "/ticket/mine") return { ok: true, email: me, tickets: T.filter(function (t) { return t.owner === me; }).map(function (t) { return Object.assign({}, t, { transferPending: !!(pending && pending.ticketId === t.id) }); }) };
      if (p === "/ticket/transfer/start") { pending = { token: "DEMOTOKEN", ticketId: b.ticketId, from: me, exp: Date.now() + 600e3 }; return { ok: true, token: pending.token, exp: pending.exp, url: location.origin + location.pathname + "?tkdemo=1&transfer=DEMOTOKEN", ttl: 600 }; }
      if (p === "/ticket/transfer/cancel") { pending = null; return { ok: true }; }
      if (p.indexOf("/ticket/transfer/peek") === 0) { if (!pending) pending = { token: "DEMOTOKEN", ticketId: "1227-DEMO2345", from: "you@demo", exp: Date.now() + 600e3 }; return { ok: true, from: "yo***@demo", exp: pending.exp, ticketId: pending.ticketId, event: ev[0] }; }
      if (p === "/ticket/transfer/accept") { if (!pending) return { ok: false, error: "transfer_expired" }; var t = T.filter(function (x) { return x.id === pending.ticketId; })[0]; if (t.owner === me) return { ok: false, error: "self" }; t.owner = me; t.ver++; pending = null; return { ok: true, ticket: t }; }
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
    S.session = lsGet(K.sess); S.email = lsGet(K.email) || "";
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
      if (j && j.ok) { S.tickets = j.tickets || []; S.email = j.email || S.email; S.lastFetch = Date.now(); }
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
  function buy(evId) {
    var ev = S.events.filter(function (e) { return e.id === evId; })[0]; if (!ev || !ev.productKey) return;
    var email = S.email || (unlockCreds() || {}).email || lsGet(K.email) || "";
    if (!email) { toast("先在上面輸入 email 登入"); return; }
    if (C.demo) { toast("DEMO：這裡會跳去綠界付款"); return; }
    var endpoint = C.api + "/ecpay/create";
    fetch(endpoint, { method: "POST", headers: { "Content-Type": "text/plain;charset=UTF-8" }, body: JSON.stringify({ productKey: ev.productKey, email: email }) })
      .then(function (r) { if (!r.ok) throw 0; return r.text(); })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, "text/html"), form = doc.querySelector("form");
        if (!form) { try { var j = JSON.parse(html); if (j && j.message) { toast(j.message); return; } } catch (e) {} throw 0; }
        var f = document.importNode(form, true); f.style.display = "none"; document.body.appendChild(f); f.submit();
      }).catch(function () { toast("付款頁開不起來，請稍後再試"); });
  }

  /* ---------- 轉讓（我給別人） ---------- */
  var sheetEl;
  function sheet(html) {
    if (!sheetEl) { sheetEl = document.createElement("div"); sheetEl.className = "tk-sheet"; sheetEl.addEventListener("click", function (e) { if (e.target === sheetEl) closeSheet(); }); document.body.appendChild(sheetEl); }
    sheetEl.innerHTML = '<div class="tk-box">' + html + '</div>'; sheetEl.classList.add("show");
    sheetEl.querySelectorAll("[data-sact]").forEach(function (b) { b.addEventListener("click", function () { sheetAct2(b.getAttribute("data-sact"), b); }); });
  }
  function closeSheet() { if (sheetEl) sheetEl.classList.remove("show"); stopPoll(); }
  function startTransfer(id) {
    api("/ticket/transfer/start", { session: S.session, ticketId: id }).then(function (j) {
      if (!j.ok) return toast(j.message || (j.error === "expired" ? "開演後 2 小時不能轉讓了" : "現在不能轉讓"));
      S.transfer = { ticketId: id, token: j.token, exp: j.exp, url: j.url }; hap(15);
      openTransferSheet(); loadMine(true).then(render);
    }).catch(function () { toast("連不上伺服器"); });
  }
  function openTransferSheet() {
    var tr = S.transfer; if (!tr) return;
    sheet('<div class="tk-eyebrow">Pass this ticket</div><h3>讓朋友掃這個</h3><div class="tk-hint">朋友用手機相機掃，或把連結傳給他。10 分鐘內有效，掃了票就是他的、你的 QR 立刻失效。</div>' +
      '<div class="tk-qrwrap"><div class="tk-qrbox"><canvas id="tk-trqr" width="220" height="220"></canvas></div></div><div class="tk-count" id="tk-cd">10:00</div><div class="tk-tiny">' + esc(tr.url) + '</div>' +
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
    if (a === "tomerch") { closeSheet(); var nb = $(C.merchNavSel); if (nb) nb.click(); refresh(true); }
  }

  /* ---------- 轉讓（別人給我）?transfer=TOKEN ---------- */
  function handleIncoming(token) {
    S.pendingTransfer = token;
    try { history.replaceState(null, "", location.pathname + (C.demo ? "?tkdemo=1" : "")); } catch (e) {}
    api("/ticket/transfer/peek?token=" + encodeURIComponent(token)).then(function (j) {
      if (!j.ok) { S.pendingTransfer = null; return sheet('<div class="tk-big"><div class="ic">✕</div><h3>這個轉讓連結已失效</h3><div class="tk-hint">請對方重新產生一次（每個連結只有 10 分鐘）。</div></div><button class="tk-btn p" data-sact="close">好</button>'); }
      var ev = j.event || {};
      ensureSession().then(function (ok) {
        var loginPart = ok ? '<button class="tk-btn p" data-sact="accept">接受這張票</button>' :
          '<div class="tk-hint" style="margin-top:14px">先用 email 登入（沒買過專輯也可以）：</div><input class="tk-in" id="tk-em2" type="email" inputmode="email" placeholder="你的 email" value="' + esc(lsGet(K.email) || "") + '"><div id="tk-otp2wrap" style="display:none"><input class="tk-in" id="tk-otp2" inputmode="numeric" maxlength="6" placeholder="6 位數驗證碼"></div><div class="tk-msg" id="tk-lmsg2"></div><button class="tk-btn p" id="tk-send2" data-sact="otp2">寄驗證碼給我</button><button class="tk-btn p" id="tk-login2" data-sact="login2" style="display:none">登入並接受</button>';
        sheet('<div class="tk-big"><div class="ic">↘</div><div class="tk-eyebrow">Incoming pass</div><h3>有人要把票給你</h3><div class="tk-hint">' + esc(j.from) + ' 要把「' + esc(ev.name || "CHANCE") + '」的票轉給你。<br>' + esc(fmt(ev.startAt)) + ' · ' + esc(ev.venue || "") + '</div></div>' + loginPart + '<button class="tk-btn g" data-sact="close">先不要</button>');
        if (!ok) bindLogin2();
      });
    }).catch(function () { toast("連不上伺服器"); });
  }
  function bindLogin2() {
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
        setSession(j.session, j.email); acceptIncoming(S.pendingTransfer);
      });
    });
  }
  function acceptIncoming(token) {
    if (!token || !S.session) return;
    api("/ticket/transfer/accept", { session: S.session, token: token }).then(function (j) {
      S.pendingTransfer = null;
      if (!j.ok) { var m = { self: "這張票本來就是你的", transfer_expired: "轉讓連結已失效，請對方重新產生", transfer_invalid: "轉讓已被取消或已完成", expired: "這場已經結束了" }[j.error] || "接受失敗"; return sheet('<div class="tk-big"><div class="ic">✕</div><h3>' + esc(m) + '</h3></div><button class="tk-btn p" data-sact="close">好</button>'); }
      hap([20, 40, 20]);
      sheet('<div class="tk-big"><div class="ic ok">✓</div><div class="tk-eyebrow">Transfer complete</div><h3>這張票是你的了</h3><div class="tk-hint">' + esc((j.ticket && j.ticket.id) || "") + '<br>入場時到「周邊 → 你的票」出示 QR。</div></div><button class="tk-btn p" data-sact="tomerch">看我的票</button>');
      refresh(true);
    }).catch(function () { toast("連不上伺服器"); });
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
  function qrUnlocked(ev) { if (!QR_LOCK_H) return true; var o = openMs(ev); return o == null || Date.now() >= o; }
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
    root = document.createElement("div"); root.id = "tk-root"; root.className = "tk";
    var host = $(C.mount), before = host && $(C.before, host);
    if (host && before) host.insertBefore(root, before); else (host || document.body).appendChild(root);
    body = root;
    root.addEventListener("click", onClick);
    var lay = document.createElement("div"); lay.id = "tk-layers"; document.body.appendChild(lay);
    lay.addEventListener("click", onClick);
    lay.addEventListener("submit", function (e) { e.preventDefault(); });
  }
  function render() {
    if (!body) return;
    var vt = validTickets(), mine = nextMine(), ups = upcoming(), cab = cabinet();
    var nextEv = mine ? Object.assign({}, eventById(mine.eventId) || {}, mine.event || {}) : ups[0];
    var stat = S.loading && !S.tickets.length && !S.events.length ? "載入中…" : (vt.length ? vt.length + " 張有效" : (ups.length ? "還沒有票" : "目前沒有活動"));
    var line2 = nextEv ? "下一場 · " + md(nextEv.startAt) + " " + esc(nextEv.name || "") : "";
    var cd = nextEv && startMs(nextEv) && startMs(nextEv) > Date.now() ? cdHTML(startMs(nextEv), "tk-cd") : "";
    var cta = mine && isEventDay(nextEv) ? '<button class="tk-gold" data-act="open-now">立即開票 <span>→</span></button>' : '<button class="tk-gold" data-act="open-wallet">打開票夾 <span>→</span></button>';
    var drops = cab.all.filter(function (i) { return !i.owned && i.soon && i.dropAt; }).sort(function (a, b) { return twParse(a.dropAt) - twParse(b.dropAt); });
    var dropLine = drops.length ? esc(drops[0].name.replace(/^THE SKY\s*/, "")) + " " + md(drops[0].dropAt) + " 開賣" : "實體與數位特典";
    var imgs = cab.all.filter(function (i) { return i.img; }).sort(function (a, b) { return (b.owned ? 1 : 0) - (a.owned ? 1 : 0); }).slice(0, 3);
    var stack = [0, 1, 2].map(function (k) { var i = imgs[k]; return '<span' + (i ? ' style="background-image:url(\'' + esc(i.img) + '\');background-size:cover;background-position:center;color:transparent' + (i.owned ? '' : ';filter:brightness(.55) saturate(.6)') + '"' : '') + '>THE SKY</span>'; }).join("");
    body.innerHTML =
      '<div class="tk-top"><div class="tk-sp"></div><div><div class="tk-eyebrow">The Sky Collection</div><div class="tk-h1 tk-serif">你的收藏</div><div class="tk-sub">票券與周邊，各自收好。</div></div>' +
      '<button class="tk-prof" data-act="profile" aria-label="帳號">' + (S.email ? esc(S.email[0].toUpperCase()) : "○") + '</button></div>' +
      '<div class="tk-ent tix" data-act="open-wallet" role="button" tabindex="0"><div class="lab">TICKETS</div><div class="ttl tk-serif">你的票夾</div><div class="st">' + esc(stat) + '</div>' +
        (line2 ? '<div class="st2">' + line2 + '</div>' : '') + cd + cta + '<div class="tk-stub"><s>Music<br>lives beyond<br>the moment</s><em></em></div></div>' +
      '<div class="tk-ent mer" data-act="open-merch" role="button" tabindex="0"><div class="lab">MERCH</div><div class="ttl tk-serif">周邊收藏</div><div class="st">' + cab.owned.length + ' / ' + cab.all.length + ' 已收藏</div><div class="st2">' + dropLine + '</div>' +
        '<div class="more">瀏覽收藏 ›</div><div class="tk-stack">' + stack + '</div></div>' +
      '<div class="tk-ctx">活動當天，這張卡會變成「立即開票」。</div>';
    S.layers.forEach(function (l) { renderLayer(l); });
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
    if (name === "wallet" || name === "pass") loadMine(true).then(function () { renderLayer(name); });
    if (name === "pass") { var t = ticketById(S.sel); if (t && t.event && qrUnlocked(t.event) && isLive(t)) setTimeout(function () { toast("☀︎ 把螢幕亮度調到最亮，掃得更快"); }, 400); }
  }
  function popLayer() {
    var name = S.layers.pop(); if (!name) return;
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
    if (name === "pass") { var t = ticketById(S.sel); if (t && t.qr && isLive(t) && qrUnlocked(t.event)) drawQR($("#tkqr-" + cssId(t.id), el), t.qr, 240); }
  }

  /* ---------- 票夾：一場活動一張卡 ---------- */
  function loginCard() {
    return '<div class="tk-card" id="tk-login"><p><b>用 email 看你的票</b><br>買過專輯會自動登入；沒有的話輸入 email，我們寄一組驗證碼給你（收朋友轉讓的票也用這個）。</p>' +
      '<form><input class="tk-in" id="tk-em" type="email" inputmode="email" autocomplete="email" placeholder="你的 email" value="' + esc(lsGet(K.email) || "") + '">' +
      '<div id="tk-otpwrap" style="display:none"><input class="tk-in" id="tk-otp" inputmode="numeric" pattern="[0-9]*" maxlength="6" placeholder="6 位數驗證碼"></div>' +
      '<div class="tk-msg" id="tk-lmsg"></div>' +
      '<button class="tk-btn p" id="tk-send" data-act="otp">寄驗證碼給我</button>' +
      '<button class="tk-btn p" id="tk-login-btn" data-act="login" style="display:none">登入</button></form></div>';
  }
  function footFor(ev) {
    var mine = ticketsFor(ev.id);
    if (mine.length) {
      var pend = mine.some(function (t) { return t.transferPending; });
      var right = pend ? '<span class="tk-chip d">轉讓中</span>' : (qrUnlocked(ev) ? '<span class="tk-chip o">出示入場 QR</span>' : '<span class="tk-chip g">開場前 ' + QR_LOCK_H + ' 小時出現 QR</span>');
      return '<div class="l">🎫 你有 ' + mine.length + ' 張票</div>' + right;
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
      '<div class="foot">' + footFor(ev) + '</div></div>';
  }
  function walletHTML() {
    var h = bar("收藏", "TICKETS", { act: "menu", label: "更多", icon: "···" });
    h += '<div class="tk-hd"><div class="tk-eyebrow">My Wallet</div><div class="tk-h1 tk-serif">我的票夾</div></div>';
    h += '<div class="tk-seg"><button class="' + (S.tab !== "past" ? "on" : "") + '" data-act="tab" data-tab="up">即將到來</button><button class="' + (S.tab === "past" ? "on" : "") + '" data-act="tab" data-tab="past">過往</button></div>';
    if (!S.session && !unlockCreds()) h += loginCard();
    if (S.tab === "past") {
      var pt = pastTickets();
      if (!pt.length) h += '<div class="tk-empty">還沒有過往的票。<br>入場過的票會變成票根留在這裡。</div>';
      h += pt.map(function (t) { var ev = t.event || {}; return '<button class="tk-pastrow" data-act="open-pass" data-id="' + esc(t.id) + '"><div class="pp"></div><div><b>' + esc(ev.name || t.id) + '</b><span>' + md(ev.startAt) + ' · ' + (t.status === "used" ? "已入場 " + hm(t.usedAt) : (t.status === "void" ? "已作廢" : "已結束")) + '</span></div><span class="chv">›</span></button>'; }).join("");
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
    var st = t.status === "used" ? '<span class="tk-st warn">已入場</span>' : (t.status === "void" ? '<span class="tk-st bad">已作廢</span>' : (t.expired ? '<span class="tk-st bad">已結束</span>' : '<span class="tk-st">VALID</span>'));
    var mid;
    if (open && t.qr) mid = '<div class="tk-qrwrap2"><canvas id="tkqr-' + cssId(t.id) + '" width="480" height="480"></canvas><div class="tk-qrid">' + esc(t.id) + '</div></div>';
    else if (live) mid = '<div class="tk-lock"><div class="ic">🔒</div><b>入場 QR 還沒出現</b><p>為了防止截圖轉賣，開場前 ' + QR_LOCK_H + ' 小時<br>（' + md(ev.startAt) + ' ' + hm(new Date(openMs(ev)).toISOString()) + '）會自動出現在這裡</p>' + cdHTML(openMs(ev), "tk-lcd") + '</div>';
    else if (t.status === "used") mid = '<div class="tk-stubbox"><b>✓ 已入場</b><span>' + md(t.usedAt) + ' ' + hm(t.usedAt) + ' · ' + esc(t.id) + '</span></div>';
    else mid = '<div class="tk-stubbox"><b>—</b><span>' + esc(t.id) + '</span></div>';
    h += '<article class="tk-pass ' + (t.status === "used" ? "used" : (!live ? "dead" : "")) + '"><div class="tk-art" style="' + (open ? 'height:70px' : '') + '"><i>' + k.lab + (ev.code ? ' · ' + esc(ev.code) : '') + '</i><b' + (open ? ' style="font-size:24px"' : '') + '>CHANCE</b></div><div class="tk-body">' +
      '<div class="tk-title"><b>' + esc(ev.name || "CHANCE") + '</b>' + st + '</div>' +
      '<div class="tk-info">' + (open ? '' : '<div><div class="tk-lab">Date</div><div class="tk-val">' + md(ev.startAt) + '（' + wk(ev.startAt).slice(-1) + '）' + hm(ev.startAt) + '</div></div><div><div class="tk-lab">Venue</div><div class="tk-val">' + esc(ev.venue || "—") + '</div></div>') +
      '<div><div class="tk-lab">Holder</div><div class="tk-val" style="font-size:13px">' + esc(maskEmail(S.email)) + '</div></div><div><div class="tk-lab">Ticket</div><div class="tk-val">自由入座</div></div></div>' +
      '<div class="tk-tear"></div>' + mid + '</div></article>';
    if (t.transferPending) h += '<div class="tk-banner"><span>這張票正在轉讓中（10 分鐘內有效）</span><button class="tk-chip d" data-act="show-transfer">看轉讓 QR</button></div>';
    if (live) {
      h += '<div class="tk-list">' + (open ? '' : '<button data-act="ics">加到行事曆<span>›</span></button>') +
        '<button data-act="map">導航到' + esc((ev.venue || "會場").replace(/\s*[A-Z]\s*廳$/, "")) + '<span>›</span></button>' +
        '<button data-act="rules">入場須知<span>›</span></button>' +
        (open ? '<button data-act="refresh-ticket">更新票券<span>›</span></button>' : '') +
        (t.transferPending ? '<button class="dim" data-act="cancel-transfer">取消轉讓<span>›</span></button>' : '<button class="dim" data-act="transfer">轉讓給朋友<span>›</span></button>') + '</div>';
    }
    return h;
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
  function walletMenu() {
    sheet('<div class="tk-eyebrow">Wallet</div><h3>票夾</h3><div class="tk-menu" style="margin-top:8px"><button data-sact="refresh">更新票券</button><button data-sact="rules">入場須知</button><button data-sact="close">關閉</button></div>');
  }
  function rulesSheet() {
    sheet('<div class="tk-eyebrow">Entry</div><h3>入場須知</h3><div class="tk-hint" style="color:rgba(255,255,255,.8);line-height:1.8">' +
      '・入場 QR 在開場前 ' + QR_LOCK_H + ' 小時自動出現，之前看不到是正常的（防止截圖轉賣）<br>・開場後 2 小時票就失效<br>・給工作人員掃 QR 就完成入場，掃過後會變成票根留在「過往」<br>・轉讓：產生一次性連結（10 分鐘有效），朋友接受後票就是他的，你的 QR 立即失效<br>・沒買過專輯的朋友也能用 email 收票<br>・會場訊號不好的話，進場前先打開這張票</div>' +
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
  function onClick(e) {
    var b = e.target.closest("[data-act]"); if (!b) return;
    var act = b.getAttribute("data-act"), id = b.getAttribute("data-id");
    if (act === "noop") return;
    if (act === "back") return back();
    if (act === "profile") return profileSheet();
    if (act === "open-wallet") { S.tab = "up"; return openLayer("wallet"); }
    if (act === "open-now") { e.stopPropagation(); var nm = nextMine(); openLayer("wallet"); if (nm) setTimeout(function () { openLayer("pass", { sel: nm.id }); }, 60); return; }
    if (act === "open-merch") return openLayer("merch");
    if (act === "open-detail") return openLayer("detail", { key: b.getAttribute("data-key") });
    if (act === "open-pass") return openLayer("pass", { sel: id });
    if (act === "tab") { S.tab = b.getAttribute("data-tab"); renderLayer("wallet"); return; }
    if (act === "eremind") { e.stopPropagation(); var ev = eventById(b.getAttribute("data-ev")); setRemind(ev ? ev.id : b.getAttribute("data-ev")); renderLayer("wallet"); return; }
    if (act === "mremind") { e.stopPropagation(); setRemind("merch-" + b.getAttribute("data-key")); renderLayer("merch"); renderLayer("detail"); return; }
    if (act === "mbuy") { e.stopPropagation(); return merchBuy(b.getAttribute("data-key")); }
    if (act === "buy") { e.stopPropagation(); return buy(b.getAttribute("data-ev")); }
    if (act === "refresh-ticket") { loadMine(true).then(function () { renderLayer("pass"); toast("票券已更新"); }); return; }
    if (act === "rules") return rulesSheet();
    if (act === "menu") return walletMenu();
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
    if (a === "showmail") { toast(S.email); return; }
    if (a === "logout") { clearSession(); closeSheet(); closeAll(); render(); toast("已登出票務"); return; }
    if (a === "openwallet") { closeSheet(); openLayer("wallet"); return; }
    if (a === "refresh") { closeSheet(); loadMine(true).then(function () { S.layers.forEach(renderLayer); render(); toast("票券已更新"); }); return; }
    if (a === "rules") { rulesSheet(); return; }
    if (a === "transfer-go") { closeSheet(); startTransfer(S.sel); return; }
    if (a === "tomerch") { closeSheet(); closeAll(); var nb = $(C.merchNavSel); if (nb) nb.click(); refresh(true); setTimeout(function () { openLayer("wallet"); }, 120); return; }
    return sheetAct(a);
  }

  /* ---------- 倒數：每 20 秒更新數字，時間到自動解鎖 QR ---------- */
  function tick() {
    document.querySelectorAll("[data-cd]").forEach(function (el) {
      var to = Number(el.getAttribute("data-cd")), p = parts(to - Date.now()), bs = el.querySelectorAll("b");
      if (bs.length === 3) { bs[0].textContent = p.d; bs[1].textContent = p.h; bs[2].textContent = p.m; }
      if (to <= Date.now() && el.classList.contains("tk-lcd")) { renderLayer("pass"); toast("☀︎ 入場 QR 出現了，把螢幕亮度調到最亮"); }
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
    if (unlockCreds() || lsGet(K.sess)) refresh(false);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
