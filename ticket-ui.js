/* ticket-ui.js v1 — CHANCE 你的票（含 QRious 4.0.2）*/
/*! QRious v4.0.2 | (C) 2017 Alasdair Mercer | GPL v3 License
Based on jsqrencode | (C) 2010 tz@execpc.com | GPL v3 License
*/
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t.QRious=e()}(this,function(){"use strict";function t(t,e){var n;return"function"==typeof Object.create?n=Object.create(t):(s.prototype=t,n=new s,s.prototype=null),e&&i(!0,n,e),n}function e(e,n,s,r){var o=this;return"string"!=typeof e&&(r=s,s=n,n=e,e=null),"function"!=typeof n&&(r=s,s=n,n=function(){return o.apply(this,arguments)}),i(!1,n,o,r),n.prototype=t(o.prototype,s),n.prototype.constructor=n,n.class_=e||o.class_,n.super_=o,n}function i(t,e,i){for(var n,s,a=0,h=(i=o.call(arguments,2)).length;a<h;a++){s=i[a];for(n in s)t&&!r.call(s,n)||(e[n]=s[n])}}function n(){}var s=function(){},r=Object.prototype.hasOwnProperty,o=Array.prototype.slice,a=e;n.class_="Nevis",n.super_=Object,n.extend=a;var h=n,f=h.extend(function(t,e,i){this.qrious=t,this.element=e,this.element.qrious=t,this.enabled=Boolean(i)},{draw:function(t){},getElement:function(){return this.enabled||(this.enabled=!0,this.render()),this.element},getModuleSize:function(t){var e=this.qrious,i=e.padding||0,n=Math.floor((e.size-2*i)/t.width);return Math.max(1,n)},getOffset:function(t){var e=this.qrious,i=e.padding;if(null!=i)return i;var n=this.getModuleSize(t),s=Math.floor((e.size-n*t.width)/2);return Math.max(0,s)},render:function(t){this.enabled&&(this.resize(),this.reset(),this.draw(t))},reset:function(){},resize:function(){}}),c=f.extend({draw:function(t){var e,i,n=this.qrious,s=this.getModuleSize(t),r=this.getOffset(t),o=this.element.getContext("2d");for(o.fillStyle=n.foreground,o.globalAlpha=n.foregroundAlpha,e=0;e<t.width;e++)for(i=0;i<t.width;i++)t.buffer[i*t.width+e]&&o.fillRect(s*e+r,s*i+r,s,s)},reset:function(){var t=this.qrious,e=this.element.getContext("2d"),i=t.size;e.lineWidth=1,e.clearRect(0,0,i,i),e.fillStyle=t.background,e.globalAlpha=t.backgroundAlpha,e.fillRect(0,0,i,i)},resize:function(){var t=this.element;t.width=t.height=this.qrious.size}}),u=h.extend(null,{BLOCK:[0,11,15,19,23,27,31,16,18,20,22,24,26,28,20,22,24,24,26,28,28,22,24,24,26,26,28,28,24,24,26,26,26,28,28,24,26,26,26,28,28]}),l=h.extend(null,{BLOCKS:[1,0,19,7,1,0,16,10,1,0,13,13,1,0,9,17,1,0,34,10,1,0,28,16,1,0,22,22,1,0,16,28,1,0,55,15,1,0,44,26,2,0,17,18,2,0,13,22,1,0,80,20,2,0,32,18,2,0,24,26,4,0,9,16,1,0,108,26,2,0,43,24,2,2,15,18,2,2,11,22,2,0,68,18,4,0,27,16,4,0,19,24,4,0,15,28,2,0,78,20,4,0,31,18,2,4,14,18,4,1,13,26,2,0,97,24,2,2,38,22,4,2,18,22,4,2,14,26,2,0,116,30,3,2,36,22,4,4,16,20,4,4,12,24,2,2,68,18,4,1,43,26,6,2,19,24,6,2,15,28,4,0,81,20,1,4,50,30,4,4,22,28,3,8,12,24,2,2,92,24,6,2,36,22,4,6,20,26,7,4,14,28,4,0,107,26,8,1,37,22,8,4,20,24,12,4,11,22,3,1,115,30,4,5,40,24,11,5,16,20,11,5,12,24,5,1,87,22,5,5,41,24,5,7,24,30,11,7,12,24,5,1,98,24,7,3,45,28,15,2,19,24,3,13,15,30,1,5,107,28,10,1,46,28,1,15,22,28,2,17,14,28,5,1,120,30,9,4,43,26,17,1,22,28,2,19,14,28,3,4,113,28,3,11,44,26,17,4,21,26,9,16,13,26,3,5,107,28,3,13,41,26,15,5,24,30,15,10,15,28,4,4,116,28,17,0,42,26,17,6,22,28,19,6,16,30,2,7,111,28,17,0,46,28,7,16,24,30,34,0,13,24,4,5,121,30,4,14,47,28,11,14,24,30,16,14,15,30,6,4,117,30,6,14,45,28,11,16,24,30,30,2,16,30,8,4,106,26,8,13,47,28,7,22,24,30,22,13,15,30,10,2,114,28,19,4,46,28,28,6,22,28,33,4,16,30,8,4,122,30,22,3,45,28,8,26,23,30,12,28,15,30,3,10,117,30,3,23,45,28,4,31,24,30,11,31,15,30,7,7,116,30,21,7,45,28,1,37,23,30,19,26,15,30,5,10,115,30,19,10,47,28,15,25,24,30,23,25,15,30,13,3,115,30,2,29,46,28,42,1,24,30,23,28,15,30,17,0,115,30,10,23,46,28,10,35,24,30,19,35,15,30,17,1,115,30,14,21,46,28,29,19,24,30,11,46,15,30,13,6,115,30,14,23,46,28,44,7,24,30,59,1,16,30,12,7,121,30,12,26,47,28,39,14,24,30,22,41,15,30,6,14,121,30,6,34,47,28,46,10,24,30,2,64,15,30,17,4,122,30,29,14,46,28,49,10,24,30,24,46,15,30,4,18,122,30,13,32,46,28,48,14,24,30,42,32,15,30,20,4,117,30,40,7,47,28,43,22,24,30,10,67,15,30,19,6,118,30,18,31,47,28,34,34,24,30,20,61,15,30],FINAL_FORMAT:[30660,29427,32170,30877,26159,25368,27713,26998,21522,20773,24188,23371,17913,16590,20375,19104,13663,12392,16177,14854,9396,8579,11994,11245,5769,5054,7399,6608,1890,597,3340,2107],LEVELS:{L:1,M:2,Q:3,H:4}}),_=h.extend(null,{EXPONENT:[1,2,4,8,16,32,64,128,29,58,116,232,205,135,19,38,76,152,45,90,180,117,234,201,143,3,6,12,24,48,96,192,157,39,78,156,37,74,148,53,106,212,181,119,238,193,159,35,70,140,5,10,20,40,80,160,93,186,105,210,185,111,222,161,95,190,97,194,153,47,94,188,101,202,137,15,30,60,120,240,253,231,211,187,107,214,177,127,254,225,223,163,91,182,113,226,217,175,67,134,17,34,68,136,13,26,52,104,208,189,103,206,129,31,62,124,248,237,199,147,59,118,236,197,151,51,102,204,133,23,46,92,184,109,218,169,79,158,33,66,132,21,42,84,168,77,154,41,82,164,85,170,73,146,57,114,228,213,183,115,230,209,191,99,198,145,63,126,252,229,215,179,123,246,241,255,227,219,171,75,150,49,98,196,149,55,110,220,165,87,174,65,130,25,50,100,200,141,7,14,28,56,112,224,221,167,83,166,81,162,89,178,121,242,249,239,195,155,43,86,172,69,138,9,18,36,72,144,61,122,244,245,247,243,251,235,203,139,11,22,44,88,176,125,250,233,207,131,27,54,108,216,173,71,142,0],LOG:[255,0,1,25,2,50,26,198,3,223,51,238,27,104,199,75,4,100,224,14,52,141,239,129,28,193,105,248,200,8,76,113,5,138,101,47,225,36,15,33,53,147,142,218,240,18,130,69,29,181,194,125,106,39,249,185,201,154,9,120,77,228,114,166,6,191,139,98,102,221,48,253,226,152,37,179,16,145,34,136,54,208,148,206,143,150,219,189,241,210,19,92,131,56,70,64,30,66,182,163,195,72,126,110,107,58,40,84,250,133,186,61,202,94,155,159,10,21,121,43,78,212,229,172,115,243,167,87,7,112,192,247,140,128,99,13,103,74,222,237,49,197,254,24,227,165,153,119,38,184,180,124,17,68,146,217,35,32,137,46,55,63,209,91,149,188,207,205,144,135,151,178,220,252,190,97,242,86,211,171,20,42,93,158,132,60,57,83,71,109,65,162,31,45,67,216,183,123,164,118,196,23,73,236,127,12,111,246,108,161,59,82,41,157,85,170,251,96,134,177,187,204,62,90,203,89,95,176,156,169,160,81,11,245,22,235,122,117,44,215,79,174,213,233,230,231,173,232,116,214,244,234,168,80,88,175]}),d=h.extend(null,{BLOCK:[3220,1468,2713,1235,3062,1890,2119,1549,2344,2936,1117,2583,1330,2470,1667,2249,2028,3780,481,4011,142,3098,831,3445,592,2517,1776,2234,1951,2827,1070,2660,1345,3177]}),v=h.extend(function(t){var e,i,n,s,r,o=t.value.length;for(this._badness=[],this._level=l.LEVELS[t.level],this._polynomial=[],this._value=t.value,this._version=0,this._stringBuffer=[];this._version<40&&(this._version++,n=4*(this._level-1)+16*(this._version-1),s=l.BLOCKS[n++],r=l.BLOCKS[n++],e=l.BLOCKS[n++],i=l.BLOCKS[n],n=e*(s+r)+r-3+(this._version<=9),!(o<=n)););this._dataBlock=e,this._eccBlock=i,this._neccBlock1=s,this._neccBlock2=r;var a=this.width=17+4*this._version;this.buffer=v._createArray(a*a),this._ecc=v._createArray(e+(e+i)*(s+r)+r),this._mask=v._createArray((a*(a+1)+1)/2),this._insertFinders(),this._insertAlignments(),this.buffer[8+a*(a-8)]=1,this._insertTimingGap(),this._reverseMask(),this._insertTimingRowAndColumn(),this._insertVersion(),this._syncMask(),this._convertBitStream(o),this._calculatePolynomial(),this._appendEccToData(),this._interleaveBlocks(),this._pack(),this._finish()},{_addAlignment:function(t,e){var i,n=this.buffer,s=this.width;for(n[t+s*e]=1,i=-2;i<2;i++)n[t+i+s*(e-2)]=1,n[t-2+s*(e+i+1)]=1,n[t+2+s*(e+i)]=1,n[t+i+1+s*(e+2)]=1;for(i=0;i<2;i++)this._setMask(t-1,e+i),this._setMask(t+1,e-i),this._setMask(t-i,e-1),this._setMask(t+i,e+1)},_appendData:function(t,e,i,n){var s,r,o,a=this._polynomial,h=this._stringBuffer;for(r=0;r<n;r++)h[i+r]=0;for(r=0;r<e;r++){if(255!==(s=_.LOG[h[t+r]^h[i]]))for(o=1;o<n;o++)h[i+o-1]=h[i+o]^_.EXPONENT[v._modN(s+a[n-o])];else for(o=i;o<i+n;o++)h[o]=h[o+1];h[i+n-1]=255===s?0:_.EXPONENT[v._modN(s+a[0])]}},_appendEccToData:function(){var t,e=0,i=this._dataBlock,n=this._calculateMaxLength(),s=this._eccBlock;for(t=0;t<this._neccBlock1;t++)this._appendData(e,i,n,s),e+=i,n+=s;for(t=0;t<this._neccBlock2;t++)this._appendData(e,i+1,n,s),e+=i+1,n+=s},_applyMask:function(t){var e,i,n,s,r=this.buffer,o=this.width;switch(t){case 0:for(s=0;s<o;s++)for(n=0;n<o;n++)n+s&1||this._isMasked(n,s)||(r[n+s*o]^=1);break;case 1:for(s=0;s<o;s++)for(n=0;n<o;n++)1&s||this._isMasked(n,s)||(r[n+s*o]^=1);break;case 2:for(s=0;s<o;s++)for(e=0,n=0;n<o;n++,e++)3===e&&(e=0),e||this._isMasked(n,s)||(r[n+s*o]^=1);break;case 3:for(i=0,s=0;s<o;s++,i++)for(3===i&&(i=0),e=i,n=0;n<o;n++,e++)3===e&&(e=0),e||this._isMasked(n,s)||(r[n+s*o]^=1);break;case 4:for(s=0;s<o;s++)for(e=0,i=s>>1&1,n=0;n<o;n++,e++)3===e&&(e=0,i=!i),i||this._isMasked(n,s)||(r[n+s*o]^=1);break;case 5:for(i=0,s=0;s<o;s++,i++)for(3===i&&(i=0),e=0,n=0;n<o;n++,e++)3===e&&(e=0),(n&s&1)+!(!e|!i)||this._isMasked(n,s)||(r[n+s*o]^=1);break;case 6:for(i=0,s=0;s<o;s++,i++)for(3===i&&(i=0),e=0,n=0;n<o;n++,e++)3===e&&(e=0),(n&s&1)+(e&&e===i)&1||this._isMasked(n,s)||(r[n+s*o]^=1);break;case 7:for(i=0,s=0;s<o;s++,i++)for(3===i&&(i=0),e=0,n=0;n<o;n++,e++)3===e&&(e=0),(e&&e===i)+(n+s&1)&1||this._isMasked(n,s)||(r[n+s*o]^=1)}},_calculateMaxLength:function(){return this._dataBlock*(this._neccBlock1+this._neccBlock2)+this._neccBlock2},_calculatePolynomial:function(){var t,e,i=this._eccBlock,n=this._polynomial;for(n[0]=1,t=0;t<i;t++){for(n[t+1]=1,e=t;e>0;e--)n[e]=n[e]?n[e-1]^_.EXPONENT[v._modN(_.LOG[n[e]]+t)]:n[e-1];n[0]=_.EXPONENT[v._modN(_.LOG[n[0]]+t)]}for(t=0;t<=i;t++)n[t]=_.LOG[n[t]]},_checkBadness:function(){var t,e,i,n,s,r=0,o=this._badness,a=this.buffer,h=this.width;for(s=0;s<h-1;s++)for(n=0;n<h-1;n++)(a[n+h*s]&&a[n+1+h*s]&&a[n+h*(s+1)]&&a[n+1+h*(s+1)]||!(a[n+h*s]||a[n+1+h*s]||a[n+h*(s+1)]||a[n+1+h*(s+1)]))&&(r+=v.N2);var f=0;for(s=0;s<h;s++){for(i=0,o[0]=0,t=0,n=0;n<h;n++)t===(e=a[n+h*s])?o[i]++:o[++i]=1,f+=(t=e)?1:-1;r+=this._getBadness(i)}f<0&&(f=-f);var c=0,u=f;for(u+=u<<2,u<<=1;u>h*h;)u-=h*h,c++;for(r+=c*v.N4,n=0;n<h;n++){for(i=0,o[0]=0,t=0,s=0;s<h;s++)t===(e=a[n+h*s])?o[i]++:o[++i]=1,t=e;r+=this._getBadness(i)}return r},_convertBitStream:function(t){var e,i,n=this._ecc,s=this._version;for(i=0;i<t;i++)n[i]=this._value.charCodeAt(i);var r=this._stringBuffer=n.slice(),o=this._calculateMaxLength();t>=o-2&&(t=o-2,s>9&&t--);var a=t;if(s>9){for(r[a+2]=0,r[a+3]=0;a--;)e=r[a],r[a+3]|=255&e<<4,r[a+2]=e>>4;r[2]|=255&t<<4,r[1]=t>>4,r[0]=64|t>>12}else{for(r[a+1]=0,r[a+2]=0;a--;)e=r[a],r[a+2]|=255&e<<4,r[a+1]=e>>4;r[1]|=255&t<<4,r[0]=64|t>>4}for(a=t+3-(s<10);a<o;)r[a++]=236,r[a++]=17},_getBadness:function(t){var e,i=0,n=this._badness;for(e=0;e<=t;e++)n[e]>=5&&(i+=v.N1+n[e]-5);for(e=3;e<t-1;e+=2)n[e-2]===n[e+2]&&n[e+2]===n[e-1]&&n[e-1]===n[e+1]&&3*n[e-1]===n[e]&&(0===n[e-3]||e+3>t||3*n[e-3]>=4*n[e]||3*n[e+3]>=4*n[e])&&(i+=v.N3);return i},_finish:function(){this._stringBuffer=this.buffer.slice();var t,e,i=0,n=3e4;for(e=0;e<8&&(this._applyMask(e),(t=this._checkBadness())<n&&(n=t,i=e),7!==i);e++)this.buffer=this._stringBuffer.slice();i!==e&&this._applyMask(i),n=l.FINAL_FORMAT[i+(this._level-1<<3)];var s=this.buffer,r=this.width;for(e=0;e<8;e++,n>>=1)1&n&&(s[r-1-e+8*r]=1,e<6?s[8+r*e]=1:s[8+r*(e+1)]=1);for(e=0;e<7;e++,n>>=1)1&n&&(s[8+r*(r-7+e)]=1,e?s[6-e+8*r]=1:s[7+8*r]=1)},_interleaveBlocks:function(){var t,e,i=this._dataBlock,n=this._ecc,s=this._eccBlock,r=0,o=this._calculateMaxLength(),a=this._neccBlock1,h=this._neccBlock2,f=this._stringBuffer;for(t=0;t<i;t++){for(e=0;e<a;e++)n[r++]=f[t+e*i];for(e=0;e<h;e++)n[r++]=f[a*i+t+e*(i+1)]}for(e=0;e<h;e++)n[r++]=f[a*i+t+e*(i+1)];for(t=0;t<s;t++)for(e=0;e<a+h;e++)n[r++]=f[o+t+e*s];this._stringBuffer=n},_insertAlignments:function(){var t,e,i,n=this._version,s=this.width;if(n>1)for(t=u.BLOCK[n],i=s-7;;){for(e=s-7;e>t-3&&(this._addAlignment(e,i),!(e<t));)e-=t;if(i<=t+9)break;i-=t,this._addAlignment(6,i),this._addAlignment(i,6)}},_insertFinders:function(){var t,e,i,n,s=this.buffer,r=this.width;for(t=0;t<3;t++){for(e=0,n=0,1===t&&(e=r-7),2===t&&(n=r-7),s[n+3+r*(e+3)]=1,i=0;i<6;i++)s[n+i+r*e]=1,s[n+r*(e+i+1)]=1,s[n+6+r*(e+i)]=1,s[n+i+1+r*(e+6)]=1;for(i=1;i<5;i++)this._setMask(n+i,e+1),this._setMask(n+1,e+i+1),this._setMask(n+5,e+i),this._setMask(n+i+1,e+5);for(i=2;i<4;i++)s[n+i+r*(e+2)]=1,s[n+2+r*(e+i+1)]=1,s[n+4+r*(e+i)]=1,s[n+i+1+r*(e+4)]=1}},_insertTimingGap:function(){var t,e,i=this.width;for(e=0;e<7;e++)this._setMask(7,e),this._setMask(i-8,e),this._setMask(7,e+i-7);for(t=0;t<8;t++)this._setMask(t,7),this._setMask(t+i-8,7),this._setMask(t,i-8)},_insertTimingRowAndColumn:function(){var t,e=this.buffer,i=this.width;for(t=0;t<i-14;t++)1&t?(this._setMask(8+t,6),this._setMask(6,8+t)):(e[8+t+6*i]=1,e[6+i*(8+t)]=1)},_insertVersion:function(){var t,e,i,n,s=this.buffer,r=this._version,o=this.width;if(r>6)for(t=d.BLOCK[r-7],e=17,i=0;i<6;i++)for(n=0;n<3;n++,e--)1&(e>11?r>>e-12:t>>e)?(s[5-i+o*(2-n+o-11)]=1,s[2-n+o-11+o*(5-i)]=1):(this._setMask(5-i,2-n+o-11),this._setMask(2-n+o-11,5-i))},_isMasked:function(t,e){var i=v._getMaskBit(t,e);return 1===this._mask[i]},_pack:function(){var t,e,i,n=1,s=1,r=this.width,o=r-1,a=r-1,h=(this._dataBlock+this._eccBlock)*(this._neccBlock1+this._neccBlock2)+this._neccBlock2;for(e=0;e<h;e++)for(t=this._stringBuffer[e],i=0;i<8;i++,t<<=1){128&t&&(this.buffer[o+r*a]=1);do{s?o--:(o++,n?0!==a?a--:(n=!n,6===(o-=2)&&(o--,a=9)):a!==r-1?a++:(n=!n,6===(o-=2)&&(o--,a-=8))),s=!s}while(this._isMasked(o,a))}},_reverseMask:function(){var t,e,i=this.width;for(t=0;t<9;t++)this._setMask(t,8);for(t=0;t<8;t++)this._setMask(t+i-8,8),this._setMask(8,t);for(e=0;e<7;e++)this._setMask(8,e+i-7)},_setMask:function(t,e){var i=v._getMaskBit(t,e);this._mask[i]=1},_syncMask:function(){var t,e,i=this.width;for(e=0;e<i;e++)for(t=0;t<=e;t++)this.buffer[t+i*e]&&this._setMask(t,e)}},{_createArray:function(t){var e,i=[];for(e=0;e<t;e++)i[e]=0;return i},_getMaskBit:function(t,e){var i;return t>e&&(i=t,t=e,e=i),i=e,i+=e*e,i>>=1,i+=t},_modN:function(t){for(;t>=255;)t=((t-=255)>>8)+(255&t);return t},N1:3,N2:3,N3:40,N4:10}),p=v,m=f.extend({draw:function(){this.element.src=this.qrious.toDataURL()},reset:function(){this.element.src=""},resize:function(){var t=this.element;t.width=t.height=this.qrious.size}}),g=h.extend(function(t,e,i,n){this.name=t,this.modifiable=Boolean(e),this.defaultValue=i,this._valueTransformer=n},{transform:function(t){var e=this._valueTransformer;return"function"==typeof e?e(t,this):t}}),k=h.extend(null,{abs:function(t){return null!=t?Math.abs(t):null},hasOwn:function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},noop:function(){},toUpperCase:function(t){return null!=t?t.toUpperCase():null}}),w=h.extend(function(t){this.options={},t.forEach(function(t){this.options[t.name]=t},this)},{exists:function(t){return null!=this.options[t]},get:function(t,e){return w._get(this.options[t],e)},getAll:function(t){var e,i=this.options,n={};for(e in i)k.hasOwn(i,e)&&(n[e]=w._get(i[e],t));return n},init:function(t,e,i){"function"!=typeof i&&(i=k.noop);var n,s;for(n in this.options)k.hasOwn(this.options,n)&&(s=this.options[n],w._set(s,s.defaultValue,e),w._createAccessor(s,e,i));this._setAll(t,e,!0)},set:function(t,e,i){return this._set(t,e,i)},setAll:function(t,e){return this._setAll(t,e)},_set:function(t,e,i,n){var s=this.options[t];if(!s)throw new Error("Invalid option: "+t);if(!s.modifiable&&!n)throw new Error("Option cannot be modified: "+t);return w._set(s,e,i)},_setAll:function(t,e,i){if(!t)return!1;var n,s=!1;for(n in t)k.hasOwn(t,n)&&this._set(n,t[n],e,i)&&(s=!0);return s}},{_createAccessor:function(t,e,i){var n={get:function(){return w._get(t,e)}};t.modifiable&&(n.set=function(n){w._set(t,n,e)&&i(n,t)}),Object.defineProperty(e,t.name,n)},_get:function(t,e){return e["_"+t.name]},_set:function(t,e,i){var n="_"+t.name,s=i[n],r=t.transform(null!=e?e:t.defaultValue);return i[n]=r,r!==s}}),M=w,b=h.extend(function(){this._services={}},{getService:function(t){var e=this._services[t];if(!e)throw new Error("Service is not being managed with name: "+t);return e},setService:function(t,e){if(this._services[t])throw new Error("Service is already managed with name: "+t);e&&(this._services[t]=e)}}),B=new M([new g("background",!0,"white"),new g("backgroundAlpha",!0,1,k.abs),new g("element"),new g("foreground",!0,"black"),new g("foregroundAlpha",!0,1,k.abs),new g("level",!0,"L",k.toUpperCase),new g("mime",!0,"image/png"),new g("padding",!0,null,k.abs),new g("size",!0,100,k.abs),new g("value",!0,"")]),y=new b,O=h.extend(function(t){B.init(t,this,this.update.bind(this));var e=B.get("element",this),i=y.getService("element"),n=e&&i.isCanvas(e)?e:i.createCanvas(),s=e&&i.isImage(e)?e:i.createImage();this._canvasRenderer=new c(this,n,!0),this._imageRenderer=new m(this,s,s===e),this.update()},{get:function(){return B.getAll(this)},set:function(t){B.setAll(t,this)&&this.update()},toDataURL:function(t){return this.canvas.toDataURL(t||this.mime)},update:function(){var t=new p({level:this.level,value:this.value});this._canvasRenderer.render(t),this._imageRenderer.render(t)}},{use:function(t){y.setService(t.getName(),t)}});Object.defineProperties(O.prototype,{canvas:{get:function(){return this._canvasRenderer.getElement()}},image:{get:function(){return this._imageRenderer.getElement()}}});var A=O,L=h.extend({getName:function(){}}).extend({createCanvas:function(){},createImage:function(){},getName:function(){return"element"},isCanvas:function(t){},isImage:function(t){}}).extend({createCanvas:function(){return document.createElement("canvas")},createImage:function(){return document.createElement("img")},isCanvas:function(t){return t instanceof HTMLCanvasElement},isImage:function(t){return t instanceof HTMLImageElement}});return A.use(new L),A});

//# sourceMappingURL=qrious.min.js.map
/* =====================================================================
 * CHANCE 「你的票」 周邊分頁模組  ticket-ui.js  v1 (B186T)
 * ---------------------------------------------------------------------
 * 只加不改：test.html / index.html 只要在 </body> 前加一行
 *   <script src="ticket-ui.js?v=1" defer></script>
 * 它會自己把「你的票」區塊插進 #screen-merch（周邊分頁）標題下面。
 *
 * 流程：買（綠界）→ 票在 app（綁 email）→ 轉讓（QR/連結）→ 掃碼進場 → 票根留著
 * 身分：已解鎖粉絲用 localStorage 的 email+解鎖碼自動登入；其他人 email+驗證碼。
 * ?tkdemo=1 → 不打伺服器，用假資料看畫面。
 * ===================================================================== */
(function () {
  "use strict";
  var C = {
    api: "https://the-sky-ost-api.anthonywen0693.workers.dev",
    unlockKeys: ["album-the-sky:unlock", "album-the-sky:feedpass"],   // 從這些 key 撿 email+code 自動登入
    mount: "#screen-merch", before: "#merch-list",
    merchNavSel: '.navbtn[data-screen="merch"]',
    demo: /[?&]tkdemo=1/.test(location.search),
    pollMs: 5000,
  };
  var K = { sess: "tk:session", email: "tk:email" };
  var S = { session: null, email: "", tickets: [], events: [], loading: false, lastFetch: 0, pollTimer: null, cdTimer: null, transfer: null };
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} }
  function fmt(iso) { var d = new Date(iso); if (isNaN(d)) return ""; var t = new Date(d.getTime() + 8 * 3600e3); var w = "日一二三四五六"[t.getUTCDay()]; return (t.getUTCMonth() + 1) + "/" + t.getUTCDate() + "（" + w + "）" + ("0" + t.getUTCHours()).slice(-2) + ":" + ("0" + t.getUTCMinutes()).slice(-2); }
  function fmtT(iso) { var d = new Date(iso); if (isNaN(d)) return ""; var t = new Date(d.getTime() + 8 * 3600e3); return (t.getUTCMonth() + 1) + "/" + t.getUTCDate() + " " + ("0" + t.getUTCHours()).slice(-2) + ":" + ("0" + t.getUTCMinutes()).slice(-2); }
  function hap(p) { try { navigator.vibrate && navigator.vibrate(p); } catch (e) {} }

  /* ---------- CSS ---------- */
  var CSS = "\
.tk{margin:14px 16px 6px;color:#f6f1e7;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Helvetica Neue',Arial,sans-serif}\
.tk *{box-sizing:border-box}\
.tk-head{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:10px}\
.tk-eyebrow{font-size:10px;letter-spacing:.22em;color:#d8bc80;text-transform:uppercase}\
.tk-h{font-size:22px;font-weight:650;letter-spacing:-.02em;margin:4px 0 0}\
.tk-sub{font-size:11px;color:#9c9589}\
.tk-card{background:#121212;border:1px solid rgba(255,255,255,.1);border-radius:22px;padding:16px;margin-top:10px}\
.tk-card p{margin:0 0 8px;font-size:13px;line-height:1.55;color:#cfc7b8}\
.tk-in{width:100%;border:1px solid rgba(255,255,255,.12);background:#0b0b0b;color:#f6f1e7;padding:13px 14px;border-radius:14px;font:inherit;font-size:15px;margin-top:8px;-webkit-appearance:none}\
.tk-btn{width:100%;border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:13px;background:#151515;color:#f6f1e7;font:inherit;font-size:13px;font-weight:720;margin-top:10px;cursor:pointer}\
.tk-btn.p{border-color:transparent;background:linear-gradient(#f1ddb0,#d8bc80);color:#181209}.tk-btn.g{background:transparent}.tk-btn:disabled{opacity:.4}\
.tk-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}.tk-row .tk-btn{margin-top:10px}\
.tk-msg{font-size:12px;color:#e6a3a3;min-height:14px;margin-top:6px}.tk-msg.ok{color:#9bd1a6}\
.tk-rail{display:flex;gap:14px;overflow-x:auto;scroll-snap-type:x mandatory;margin:6px -16px 0;padding:6px 16px 18px;scrollbar-width:none}.tk-rail::-webkit-scrollbar{display:none}\
.tk-pass{flex:0 0 min(82vw,340px);scroll-snap-align:center;border-radius:26px;overflow:hidden;background:#f1eee6;color:#111;box-shadow:0 24px 60px rgba(0,0,0,.5);position:relative}\
.tk-pass.used,.tk-pass.dead{filter:saturate(.25);opacity:.75}\
.tk-art{height:150px;position:relative;background:radial-gradient(circle at 76% 18%,rgba(232,198,136,.62),transparent 18%),radial-gradient(circle at 15% 78%,rgba(120,73,45,.55),transparent 32%),linear-gradient(140deg,#382a20,#101010 62%)}\
.tk-art b{position:absolute;left:18px;bottom:14px;font:34px Georgia,serif;font-weight:400;letter-spacing:.12em;color:#fff3df}\
.tk-art i{position:absolute;right:16px;top:14px;font-style:normal;font-size:10px;letter-spacing:.22em;color:#f4dfb8}\
.tk-body{padding:16px 18px 18px}\
.tk-title{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.tk-title b{font-size:17px;font-weight:760;line-height:1.15}\
.tk-st{font-size:10px;font-weight:800;letter-spacing:.14em;color:#47784e;white-space:nowrap;padding-top:3px}.tk-st.bad{color:#8e4949}.tk-st.warn{color:#8a6a1f}\
.tk-info{display:grid;grid-template-columns:1.1fr 1fr;gap:12px 12px;padding-top:14px}\
.tk-lab{font-size:9px;color:#847d72;letter-spacing:.16em;text-transform:uppercase;margin-bottom:4px}.tk-val{font-size:13px;line-height:1.3;font-weight:650;word-break:break-all}\
.tk-tear{height:1px;background:rgba(0,0,0,.12);margin:16px -18px 14px;position:relative}.tk-tear:before,.tk-tear:after{content:'';position:absolute;width:20px;height:20px;border-radius:50%;background:var(--bg,#0b0b0b);top:50%;transform:translateY(-50%)}.tk-tear:before{left:-28px}.tk-tear:after{right:-28px}\
.tk-qr{background:#fff;border-radius:14px;padding:12px;display:flex;flex-direction:column;align-items:center;position:relative;overflow:hidden}\
.tk-qr canvas{width:180px!important;height:180px!important;display:block;max-width:none}.tk-qr small{font:9px ui-monospace,Menlo,monospace;color:#666;letter-spacing:.1em;margin-top:6px}\
.tk-qr:after{content:'';position:absolute;width:50px;height:140%;top:-20%;left:-80px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.6),transparent);transform:skewX(-15deg);animation:tkglow 4.4s linear infinite}@keyframes tkglow{0%{left:-80px}65%,100%{left:110%}}\
.tk-stub{background:#e9e4d8;border-radius:14px;padding:18px 12px;text-align:center;color:#4a4237}.tk-stub b{display:block;font-size:22px;letter-spacing:.1em}.tk-stub span{font-size:11px;letter-spacing:.06em}\
.tk-act{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}.tk-act .tk-btn{margin-top:0;padding:11px;font-size:12px}\
.tk-pass .tk-btn{background:#151515}.tk-pass .tk-btn.p{background:linear-gradient(#f1ddb0,#d8bc80)}\
.tk-dots{display:flex;justify-content:center;gap:6px;margin-top:-8px}.tk-dots i{width:5px;height:5px;border-radius:50%;background:#444}.tk-dots i.on{width:16px;border-radius:99px;background:#ead4a6}\
.tk-ev{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:12px 0;border-top:1px solid rgba(255,255,255,.08)}.tk-ev:first-child{border-top:0;padding-top:4px}\
.tk-ev b{display:block;font-size:14px}.tk-ev span{display:block;font-size:11px;color:#9c9589;margin-top:3px}\
.tk-ev .tk-btn{width:auto;margin:0;padding:10px 14px;font-size:12px;white-space:nowrap}\
.tk-note{margin-top:10px;padding:11px 13px;border:1px solid rgba(216,188,128,.18);background:rgba(216,188,128,.045);border-radius:14px;color:#cec5b4;font-size:11px;line-height:1.55}\
.tk-link{color:#d8bc80;font-size:12px;text-decoration:underline;background:none;border:0;padding:6px 0;font:inherit;cursor:pointer}\
.tk-sheet{position:fixed;inset:0;background:rgba(0,0,0,.74);z-index:100000;display:none;align-items:flex-end;justify-content:center}.tk-sheet.show{display:flex}\
.tk-box{width:min(100%,470px);max-height:92vh;overflow:auto;background:#121212;border:1px solid rgba(255,255,255,.1);border-radius:28px 28px 0 0;padding:22px 18px calc(28px + env(safe-area-inset-bottom));color:#f6f1e7;font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif}\
.tk-box h3{font-size:22px;margin:4px 0 6px}.tk-box .tk-hint{font-size:12px;line-height:1.55;color:#9c9589}\
.tk-qrwrap{display:flex;justify-content:center;margin:18px 0 10px}.tk-qrbox{padding:14px;background:#f3f0e8;border-radius:22px;line-height:0}.tk-qrbox canvas{width:220px!important;height:220px!important;display:block;max-width:none}\
.tk-count{text-align:center;font-size:13px;color:#efd9a9;font-variant-numeric:tabular-nums;margin:6px 0}\
.tk-tiny{font-size:10px;color:#9c9589;word-break:break-all;line-height:1.5;text-align:center}\
.tk-big{text-align:center;padding:26px 0 8px}.tk-big .ic{width:72px;height:72px;border-radius:50%;display:grid;place-items:center;margin:0 auto 14px;font-size:30px;border:1px solid rgba(216,188,128,.42);color:#efd9a9}.tk-big .ic.ok{border-color:rgba(155,209,166,.4);color:#9bd1a6;background:rgba(155,209,166,.07)}\
.tk-toast{position:fixed;left:50%;bottom:calc(110px + env(safe-area-inset-bottom));transform:translateX(-50%);background:#1b1b1b;border:1px solid rgba(216,188,128,.3);color:#f6f1e7;padding:10px 16px;border-radius:999px;font-size:12px;z-index:100001;opacity:0;transition:.25s;pointer-events:none;white-space:nowrap}.tk-toast.in{opacity:1}\
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
    var ev = [{ id: "meet-20261227", code: "1227", name: "CHANCE 見面會 12/27", startAt: "2026-12-27T14:00:00+08:00", venue: "微風影城 A 廳", price: 1200, capacity: 181, sold: 96, left: 85, productKey: "meet-20261227", onSale: true },
              { id: "meet-20270213", code: "0213", name: "CHANCE 見面會 2/13", startAt: "2027-02-13T14:00:00+08:00", venue: "微風影城 A 廳", price: 1200, capacity: 181, sold: 0, left: 181, productKey: null, onSale: false }];
    var T = [{ id: "1227-DEMO2345", eventId: "meet-20261227", status: "valid", ver: 1, issuedAt: new Date(now - 86400e3).toISOString(), usedAt: null, owner: "you@demo", transferPending: false, event: ev[0], qr: "CT1.1227-DEMO2345.1.0123456789abcdef0123", canTransfer: true, expired: false },
             { id: "1227-DEMO6789", eventId: "meet-20261227", status: "used", ver: 2, issuedAt: new Date(now - 86400e3).toISOString(), usedAt: new Date(now - 3600e3).toISOString(), owner: "you@demo", transferPending: false, event: ev[0], qr: null, canTransfer: false, expired: false }];
    var pending = null, sessions = {};
    return { call: function (p, b) { return new Promise(function (res) { setTimeout(function () { res(route(p, b)); }, 350); }); } };
    function route(p, b) {
      if (p === "/ticket/events") return { ok: true, events: ev };
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
  function refresh(force) {
    if (S.loading) return; S.loading = true; render();
    ensureSession().then(function () { return Promise.all([loadEvents(), loadMine(force)]); })
      .then(function () { S.loading = false; render(); });
  }

  /* ---------- 畫面 ---------- */
  var root, body;
  function mount() {
    if (document.getElementById("tk-root")) return;
    var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
    root = document.createElement("div"); root.id = "tk-root"; root.className = "tk";
    root.innerHTML = '<div class="tk-head"><div><div class="tk-eyebrow">Tickets</div><div class="tk-h">你的票</div></div><div class="tk-sub" id="tk-sub"></div></div><div id="tk-body"></div>';
    var host = $(C.mount), before = host && $(C.before, host);
    if (host && before) host.insertBefore(root, before); else (host || document.body).appendChild(root);
    body = $("#tk-body", root);
    root.addEventListener("click", onClick);
    root.addEventListener("submit", function (e) { e.preventDefault(); });
  }
  function render() {
    if (!body) return;
    $("#tk-sub").textContent = S.email ? S.email : "";
    var h = "";
    if (S.loading && !S.tickets.length && !S.events.length) { body.innerHTML = '<div class="tk-card"><p style="color:#9c9589">載入中…</p></div>'; return; }
    if (!S.session) h += loginCard();
    if (S.session) h += S.tickets.length ? ticketsHTML() : '<div class="tk-card"><p><b>還沒有票。</b>買了之後票會直接出現在這裡；朋友轉讓給你的票也會進來。</p></div>';
    h += eventsHTML();
    body.innerHTML = h;
    S.tickets.forEach(function (t) { if (t.qr && t.status === "valid") drawQR($("#tkqr-" + cssId(t.id)), t.qr, 180); });
  }
  function cssId(s) { return String(s).replace(/[^A-Za-z0-9]/g, "_"); }
  function loginCard() {
    return '<div class="tk-card" id="tk-login"><p><b>用 email 看票</b><br>買過專輯的話會自動登入；沒有的話輸入 email，我們寄一組驗證碼給你（收轉讓票也用這個）。</p>' +
      '<form><input class="tk-in" id="tk-em" type="email" inputmode="email" autocomplete="email" placeholder="你的 email" value="' + esc(lsGet(K.email) || "") + '">' +
      '<div id="tk-otpwrap" style="display:none"><input class="tk-in" id="tk-otp" inputmode="numeric" pattern="[0-9]*" maxlength="6" placeholder="6 位數驗證碼"></div>' +
      '<div class="tk-msg" id="tk-lmsg"></div>' +
      '<button class="tk-btn p" id="tk-send" data-act="otp">寄驗證碼給我</button>' +
      '<button class="tk-btn p" id="tk-login-btn" data-act="login" style="display:none">登入</button></form></div>';
  }
  function eventsHTML() {
    if (!S.events.length) return "";
    var rows = S.events.map(function (e) {
      var owned = S.tickets.filter(function (t) { return t.eventId === e.id; }).length;
      var cta;
      if (e.onSale && e.productKey && (e.left == null || e.left > 0)) cta = '<button class="tk-btn p" data-act="buy" data-ev="' + esc(e.id) + '">買票 NT$' + esc(e.price || "") + '</button>';
      else if (e.onSale && e.productKey) cta = '<button class="tk-btn" disabled>SOLD OUT</button>';
      else cta = '<button class="tk-btn g" disabled>尚未開賣</button>';
      return '<div class="tk-ev"><div><b>' + esc(e.name) + '</b><span>' + esc(fmt(e.startAt)) + ' · ' + esc(e.venue || "") + (owned ? ' · 你有 ' + owned + ' 張' : '') + '</span></div>' + cta + '</div>';
    }).join("");
    return '<div class="tk-card" style="padding-top:8px"><div class="tk-eyebrow" style="margin:6px 0 4px">見面會</div>' + rows + '</div>';
  }
  function ticketsHTML() {
    var cards = S.tickets.map(function (t) {
      var ev = t.event || {}, st, cls = "", stTxt;
      if (t.status === "used") { cls = "used"; stTxt = '<span class="tk-st warn">已入場</span>'; }
      else if (t.status === "void") { cls = "dead"; stTxt = '<span class="tk-st bad">已作廢</span>'; }
      else if (t.expired) { cls = "dead"; stTxt = '<span class="tk-st bad">已結束</span>'; }
      else if (t.transferPending) { stTxt = '<span class="tk-st warn">轉讓中</span>'; }
      else stTxt = '<span class="tk-st">VALID</span>';
      var mid;
      if (t.status === "valid" && t.qr && !t.expired) mid = '<div class="tk-qr"><canvas id="tkqr-' + cssId(t.id) + '" width="180" height="180"></canvas><small>' + esc(t.id) + '</small></div>';
      else if (t.status === "used") mid = '<div class="tk-stub"><b>✓ 已入場</b><span>' + esc(fmtT(t.usedAt)) + ' · ' + esc(t.id) + '</span></div>';
      else mid = '<div class="tk-stub"><b>—</b><span>' + esc(t.id) + '</span></div>';
      var act = "";
      if (t.status === "valid" && !t.expired) {
        act = t.transferPending
          ? '<div class="tk-act"><button class="tk-btn" data-act="showtransfer" data-id="' + esc(t.id) + '">看轉讓 QR</button><button class="tk-btn" data-act="cancel" data-id="' + esc(t.id) + '">取消轉讓</button></div>'
          : '<div class="tk-act"><button class="tk-btn" data-act="refresh">重新整理</button><button class="tk-btn p" data-act="transfer" data-id="' + esc(t.id) + '">轉讓給朋友</button></div>';
      }
      return '<article class="tk-pass ' + cls + '"><div class="tk-art"><i>' + esc(ev.code ? "MEET · " + ev.code : "MEET") + '</i><b>CHANCE</b></div><div class="tk-body">' +
        '<div class="tk-title"><b>' + esc(ev.name || "CHANCE") + '</b>' + stTxt + '</div>' +
        '<div class="tk-info"><div><div class="tk-lab">Date</div><div class="tk-val">' + esc(fmt(ev.startAt)) + '</div></div><div><div class="tk-lab">Venue</div><div class="tk-val">' + esc(ev.venue || "") + '</div></div>' +
        '<div><div class="tk-lab">Holder</div><div class="tk-val" style="font-size:11px">' + esc(S.email) + '</div></div><div><div class="tk-lab">Ticket</div><div class="tk-val">自由入座</div></div></div>' +
        '<div class="tk-tear"></div>' + mid + act + '</div></article>';
    }).join("");
    var dots = S.tickets.length > 1 ? '<div class="tk-dots">' + S.tickets.map(function (_, i) { return '<i class="' + (i ? "" : "on") + '"></i>'; }).join("") + '</div>' : "";
    return '<div class="tk-rail" id="tk-rail">' + cards + '</div>' + dots + '<div class="tk-note">入場時把 QR 給工作人員掃。要給朋友就按「轉讓給朋友」，對方掃了票就是他的，你的 QR 立刻失效。開演後 2 小時票就不能轉讓也不能入場。</div>';
  }
  function drawQR(canvas, value, size) { if (!canvas || !window.QRious) return; new QRious({ element: canvas, value: value, size: size * 2, level: "M", background: "#fff", foreground: "#111" }); }

  /* ---------- 事件 ---------- */
  function onClick(e) {
    var b = e.target.closest("[data-act]"); if (!b) return;
    var act = b.getAttribute("data-act"), id = b.getAttribute("data-id");
    if (act === "otp") return sendOtp();
    if (act === "login") return doLogin();
    if (act === "refresh") return refresh(true);
    if (act === "buy") return buy(b.getAttribute("data-ev"));
    if (act === "transfer") return startTransfer(id);
    if (act === "showtransfer") return S.transfer && S.transfer.ticketId === id ? openTransferSheet() : startTransfer(id);
    if (act === "cancel") return cancelTransfer(id);
  }
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
      }).catch(function () { location.href = endpoint + "?productKey=" + encodeURIComponent(ev.productKey) + "&email=" + encodeURIComponent(email); });
  }

  /* ---------- 轉讓（我給別人） ---------- */
  var sheetEl;
  function sheet(html) {
    if (!sheetEl) { sheetEl = document.createElement("div"); sheetEl.className = "tk-sheet"; sheetEl.addEventListener("click", function (e) { if (e.target === sheetEl) closeSheet(); }); document.body.appendChild(sheetEl); }
    sheetEl.innerHTML = '<div class="tk-box">' + html + '</div>'; sheetEl.classList.add("show");
    sheetEl.querySelectorAll("[data-sact]").forEach(function (b) { b.addEventListener("click", function () { sheetAct(b.getAttribute("data-sact"), b); }); });
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

  /* ---------- 啟動 ---------- */
  function boot() {
    mount(); render();
    var host = $(C.mount);
    if (host) {
      var mo = new MutationObserver(function () { if (host.classList.contains("active")) refresh(false); });
      mo.observe(host, { attributes: true, attributeFilter: ["class"] });
      if (host.classList.contains("active")) refresh(false);
    } else refresh(false);
    document.addEventListener("visibilitychange", function () { if (document.visibilityState === "visible" && S.session) loadMine(true).then(render); });
    var m = /[?&]transfer=([A-Za-z0-9]+)/.exec(location.search);
    if (m) { var nb = $(C.merchNavSel); if (nb) setTimeout(function () { nb.click(); }, 300); handleIncoming(m[1]); }
    else if (!host) refresh(false);
    if (unlockCreds() || lsGet(K.sess)) refresh(false);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
