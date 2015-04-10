/*! Friend.js v0.1.0 :: by Brandon Pierce (brandon@brandonjpierce.com) MIT */
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):"object"==typeof exports?exports.Friend=e():t.Friend=e()}(this,function(){return function(t){function e(o){if(n[o])return n[o].exports;var i=n[o]={exports:{},id:o,loaded:!1};return t[o].call(i.exports,i,i.exports,e),i.loaded=!0,i.exports}var n={};return e.m=t,e.c=n,e.p="",e(0)}([function(t,e,n){function o(t){return this._enabled=!1,this._initialized=!1,this._transformName=l+"Transform",this._transitionName=l+"Transition",this._defaults=u,this._options=r({},u,t),this.element={},this.target={},this._throttled=this._options.throttle?s.throttle(this.position.bind(this),this._options.throttleSpeed):this.position.bind(this),this._options.enabled&&this.enable(),this}var i=n(2),r=n(3),s=n(1),a=s.cssTransformSupported(),l=s.getVendorPrefix().lowercase,u={enabled:!0,transforms:a,animate:!1,animationDuration:"100ms",animationEasing:"cubic-bezier(0.55,0,0.1,1)",throttle:!1,throttleSpeed:100},c={positioning:"positioning",positioned:"positioned",initialized:"initialized",enabled:"enabled",disabled:"disabled"};i(o.prototype),o.prototype.use=function(t){return t(this),this},o.prototype.position=function(){return this.emit(c.positioning),this._enabled?this._nextTick(this._attachElements):this.enable(),this},o.prototype.update=function(t,e){return e=e||!0,this._options=r(this._options,t,!0),e&&this.position(),this},o.prototype.enable=function(){return this._initialized||this._findNodes(),this._setFriendStyles(),this._enableHandlers(),this._enabled=!0,this.emit(c.enabled),this.position(),this},o.prototype.disable=function(){return this._enabled?(this._resetCSS(),this._disableHandlers(),this._enabled=!1,this.emit(c.disabled),this):void 0},o.prototype._enableHandlers=function(){this.target.scrollParents.forEach(function(t){s.addEvent(t,"scroll",this._throttled)},this),s.addEvent(this.target.node,"friend:"+c.positioned,this._throttled),s.addEvent(window,"resize",this._throttled)},o.prototype._disableHandlers=function(){this.target.scrollParents.forEach(function(t){s.removeEvent(t,"scroll",this._throttled)},this),s.removeEvent(window,"resize",this._throttled),s.removeEvent(this.target.node,"friend:"+c.positioned,this._throttled)},o.prototype._resetCSS=function(){var t={position:this.element.initialStyles.position,left:this.element.initialStyles.left,top:this.element.initialStyles.top};this._options.transforms&&a&&(t[this._transformName]=null),this._options.animate&&(t[this._transitionName]=null);for(var e in t)t.hasOwnProperty(e)&&(this.element.node.style[e]=t[e])},o.prototype._findNodes=function(){var t=this._options.element.selector,e=this._options.target.selector;this.element.node=s.getDomNode(t),this.target.node=s.getDomNode(e),this.target.scrollParents=s.getScrollParents(this.target.node),this.element.initialStyles=this._getInitialStyles(),this._moveElement(),this._initialized=!0,this.emit(c.initialized)},o.prototype._moveElement=function(){"BODY"!==this.element.node.parentNode.tagName&&(this.element.node.parentNode.removeChild(this.element.node),document.body.appendChild(this.element.node))},o.prototype._getInitialStyles=function(){return{position:s.getStyle(this.element.node,"position"),left:s.getStyle(this.element.node,"left")||0,top:s.getStyle(this.element.node,"top")||0}},o.prototype._setFriendStyles=function(){var t=s.getStyle(this.target.node,"position"),e={position:"fixed"===t?t:"absolute",left:0,top:0};this._options.animate&&(e[this._transitionName]=this._options.transforms&&a?"transform "+this._options.animationDuration+" "+this._options.animationEasing:"left "+this._options.animationDuration+" "+this._options.animationEasing+", top "+this._options.animationDuration+" "+this._options.animationEasing);for(var n in e)e.hasOwnProperty(n)&&(this.element.node.style[n]=e[n]);this._initalStylesSet=!0},o.prototype._attachElements=function(){var t=this._getTargetAttachment(),e=this._getElementAttachment(),n=Math.round(t.left-e.left),o=Math.round(t.top-e.top),i={},r=["translateZ(0)","translateX("+n+"px)","translateY("+o+"px)"];this._options.transforms&&a?i[this._transformName]=r.join(" "):(i.left=n+"px",i.top=o+"px");for(var l in i)i.hasOwnProperty(l)&&(this.element.node.style[l]=i[l]);this._options.animate?s.onAnimationEnd(this.element.node,function(){s.triggerEvent(this.element.node,"friend:"+c.positioned)}.bind(this)):s.triggerEvent(this.element.node,"friend:"+c.positioned),this.emit(c.positioned)},o.prototype._getBounds=function(t){var e={},n=t.getBoundingClientRect(),o=document.documentElement;for(var i in n)n.hasOwnProperty(i)&&(e[i]=n[i]);return e.top+=(window.pageYOffset||o.scrollTop)-(o.clientTop||0),e.left+=(window.pageXOffset||o.scrollLeft)-(o.clientLeft||0),e.hasOwnProperty("width")&&e.hasOwnProperty("height")||(e.width=t.offsetWidth,e.height=t.offsetHeight),e},o.prototype._getElementAttachment=function(){var t=this.element.bounds=this._getBounds(this.element.node),e=this._options.element.attach,n=this._options.element.offset||[0,0],o={},i=e[0],r=e[1];if(e.length<=1)throw new Error("Invalid attach property set for element object");var s={left:0-n[0],middle:t.width/2+n[0],right:t.width+n[0]},a={top:0+n[1],middle:t.height/2+n[1],bottom:t.height-n[1]};if(!s.hasOwnProperty(i)||!a.hasOwnProperty(r))throw new Error("Invalid attach values for element object");return o.left=s[i],o.top=a[r],this.element.attachment=o,o},o.prototype._getTargetAttachment=function(){var t=this.target.bounds=this._getBounds(this.target.node),e=this._options.target.attach||this._options.element.attach,n={},o=e[0],i=e[1],r={left:t.left,middle:t.left+t.width/2,right:t.right},s={top:t.top,middle:t.top+t.height/2,bottom:t.bottom};if(!r.hasOwnProperty(o)||!s.hasOwnProperty(i))throw new Error("Invalid attach values for target object");return n.left=r[o],n.top=s[i],this.target.attachment=n,n},o.prototype._nextTick=function(t){window.requestAnimationFrame(t.bind(this))},t.exports=o},function(t,e,n){t.exports={throttle:function(t,e){var n;return function(){var o=arguments,i=this;n||(n=setTimeout(function(){return n=0,t.apply(i,o)},e))}},onAnimationEnd:function(t,e){for(var n=["webkit","moz","MS","o",""],o="TransitionEnd",i=0,r=n.length;i!==r;i++)n[i]||(o=o.toLowerCase()),this.addEvent(t,n[i]+o,e)},addEvent:function(t,e,n){t.addEventListener(e,n,!1)},removeEvent:function(t,e,n){t.removeEventListener(e,n,!1)},triggerEvent:function(t,e){var n=document.createEvent("Event");n.initEvent(e,!0,!0),n.eventName=e,t.dispatchEvent(n)},getStyle:function(t,e){var n=null;return t&&1===t.nodeType&&(t.currentStyle?n=t.currentStyle[e]:window.getComputedStyle&&(n=document.defaultView.getComputedStyle(t,null).getPropertyValue(e))),n},getScrollParents:function(t){var e=this.getStyle(t,"position"),n=t.parentNode,o=[];if("fixed"===e)return o.push(t),o;for(;n;){var i=this.getStyle(n,"overflow"),r=this.getStyle(n,"overflowY"),s=this.getStyle(n,"overflowX"),a=this.getStyle(n,"position"),l=/(auto|scroll)/,u=i+r+s;l.test(u)&&("absolute"!==e||"relative"===a||"absolute"===a||"fixed"===a)&&o.push(n),n=n.parentNode}return o.push(document),o},getDomNode:function(t){return document.querySelector(t)},getVendorPrefix:function(){var t=window.getComputedStyle(document.documentElement,""),e=(Array.prototype.slice.call(t).join("").match(/-(moz|webkit|ms)-/)||""===t.OLink&&["","o"])[1],n="WebKit|Moz|MS|O".match(new RegExp("("+e+")","i"))[1];return{dom:n,lowercase:e,css:"-"+e+"-",js:e[0].toUpperCase()+e.substr(1)}},cssTransformSupported:function(){var t=!1,e="transform",n="Webkit Moz ms O".split(" "),o=document.createElement("div"),i=null;if(o.style[e]&&(t=!0),t===!1){i=e.charAt(0).toUpperCase()+e.substr(1);for(var r=0,s=n.length;r!==s;r++)if(void 0!==o.style[n[r]+i]){t=!0;break}}return t}}},function(t,e,n){"use strict";var o,i,r,s,a,l,u,c=n(4),h=n(5),p=Function.prototype.apply,f=Function.prototype.call,d=Object.create,m=Object.defineProperty,g=Object.defineProperties,y=Object.prototype.hasOwnProperty,_={configurable:!0,enumerable:!1,writable:!0};o=function(t,e){var n;return h(e),y.call(this,"__ee__")?n=this.__ee__:(n=_.value=d(null),m(this,"__ee__",_),_.value=null),n[t]?"object"==typeof n[t]?n[t].push(e):n[t]=[n[t],e]:n[t]=e,this},i=function(t,e){var n,i;return h(e),i=this,o.call(this,t,n=function(){r.call(i,t,n),p.call(e,this,arguments)}),n.__eeOnceListener__=e,this},r=function(t,e){var n,o,i,r;if(h(e),!y.call(this,"__ee__"))return this;if(n=this.__ee__,!n[t])return this;if(o=n[t],"object"==typeof o)for(r=0;i=o[r];++r)(i===e||i.__eeOnceListener__===e)&&(2===o.length?n[t]=o[r?0:1]:o.splice(r,1));else(o===e||o.__eeOnceListener__===e)&&delete n[t];return this},s=function(t){var e,n,o,i,r;if(y.call(this,"__ee__")&&(i=this.__ee__[t]))if("object"==typeof i){for(n=arguments.length,r=new Array(n-1),e=1;n>e;++e)r[e-1]=arguments[e];for(i=i.slice(),e=0;o=i[e];++e)p.call(o,this,r)}else switch(arguments.length){case 1:f.call(i,this);break;case 2:f.call(i,this,arguments[1]);break;case 3:f.call(i,this,arguments[1],arguments[2]);break;default:for(n=arguments.length,r=new Array(n-1),e=1;n>e;++e)r[e-1]=arguments[e];p.call(i,this,r)}},a={on:o,once:i,off:r,emit:s},l={on:c(o),once:c(i),off:c(r),emit:c(s)},u=g({},l),t.exports=e=function(t){return null==t?d(u):g(Object(t),l)},e.methods=a},function(t,e,n){var o,i=Object.prototype.hasOwnProperty,r=Object.prototype.toString,s=function(t){"use strict";if(!t||"[object Object]"!==r.call(t))return!1;var e=i.call(t,"constructor"),n=t.constructor&&t.constructor.prototype&&i.call(t.constructor.prototype,"isPrototypeOf");if(t.constructor&&!e&&!n)return!1;var s;for(s in t);return s===o||i.call(t,s)};t.exports=function a(){"use strict";var t,e,n,i,r,l,u=arguments[0],c=1,h=arguments.length,p=!1;for("boolean"==typeof u?(p=u,u=arguments[1]||{},c=2):("object"!=typeof u&&"function"!=typeof u||null==u)&&(u={});h>c;++c)if(t=arguments[c],null!=t)for(e in t)n=u[e],i=t[e],u!==i&&(p&&i&&(s(i)||(r=Array.isArray(i)))?(r?(r=!1,l=n&&Array.isArray(n)?n:[]):l=n&&s(n)?n:{},u[e]=a(p,l,i)):i!==o&&(u[e]=i));return u}},function(t,e,n){"use strict";var o,i=n(8),r=n(6),s=n(7),a=n(9);o=t.exports=function(t,e){var n,o,s,l,u;return arguments.length<2||"string"!=typeof t?(l=e,e=t,t=null):l=arguments[2],null==t?(n=s=!0,o=!1):(n=a.call(t,"c"),o=a.call(t,"e"),s=a.call(t,"w")),u={value:e,configurable:n,enumerable:o,writable:s},l?i(r(l),u):u},o.gs=function(t,e,n){var o,l,u,c;return"string"!=typeof t?(u=n,n=e,e=t,t=null):u=arguments[3],null==e?e=void 0:s(e)?null==n?n=void 0:s(n)||(u=n,n=void 0):(u=e,e=n=void 0),null==t?(o=!0,l=!1):(o=a.call(t,"c"),l=a.call(t,"e")),c={get:e,set:n,configurable:o,enumerable:l},u?i(r(u),c):c}},function(t,e,n){"use strict";t.exports=function(t){if("function"!=typeof t)throw new TypeError(t+" is not a function");return t}},function(t,e,n){"use strict";var o=Array.prototype.forEach,i=Object.create,r=function(t,e){var n;for(n in t)e[n]=t[n]};t.exports=function(t){var e=i(null);return o.call(arguments,function(t){null!=t&&r(Object(t),e)}),e}},function(t,e,n){"use strict";t.exports=function(t){return"function"==typeof t}},function(t,e,n){"use strict";t.exports=n(10)()?Object.assign:n(11)},function(t,e,n){"use strict";t.exports=n(12)()?String.prototype.contains:n(13)},function(t,e,n){"use strict";t.exports=function(){var t,e=Object.assign;return"function"!=typeof e?!1:(t={foo:"raz"},e(t,{bar:"dwa"},{trzy:"trzy"}),t.foo+t.bar+t.trzy==="razdwatrzy")}},function(t,e,n){"use strict";var o=n(15),i=n(14),r=Math.max;t.exports=function(t,e){var n,s,a,l=r(arguments.length,2);for(t=Object(i(t)),a=function(o){try{t[o]=e[o]}catch(i){n||(n=i)}},s=1;l>s;++s)e=arguments[s],o(e).forEach(a);if(void 0!==n)throw n;return t}},function(t,e,n){"use strict";var o="razdwatrzy";t.exports=function(){return"function"!=typeof o.contains?!1:o.contains("dwa")===!0&&o.contains("foo")===!1}},function(t,e,n){"use strict";var o=String.prototype.indexOf;t.exports=function(t){return o.call(this,t,arguments[1])>-1}},function(t,e,n){"use strict";t.exports=function(t){if(null==t)throw new TypeError("Cannot use null or undefined");return t}},function(t,e,n){"use strict";t.exports=n(16)()?Object.keys:n(17)},function(t,e,n){"use strict";t.exports=function(){try{return Object.keys("primitive"),!0}catch(t){return!1}}},function(t,e,n){"use strict";var o=Object.keys;t.exports=function(t){return o(null==t?t:Object(t))}}])});