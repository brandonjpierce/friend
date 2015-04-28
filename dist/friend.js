/*! Friend.js v0.1.0 :: by Brandon Pierce (brandon@brandonjpierce.com) MIT */
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):"object"==typeof exports?exports.Friend=e():t.Friend=e()}(this,function(){return function(t){function e(o){if(n[o])return n[o].exports;var i=n[o]={exports:{},id:o,loaded:!1};return t[o].call(i.exports,i,i.exports,e),i.loaded=!0,i.exports}var n={};return e.m=t,e.c=n,e.p="",e(0)}([function(t,e,n){function o(t){return this._enabled=!1,this._options=r({},h,t),this.cache={left:null,top:null},this.element={},this.target={},this._initialize(),this}var i=n(2),r=n(3),s=n(1),a=window,l=document,c=s.cssTransformSupported(),u=s.getVendorPrefix().lowercase,p=u+"Transform",h={enabled:!0,transforms:c,throttle:!1,throttleSpeed:200},f={positioning:"positioning",positioned:"positioned",initialized:"initialized",enabled:"enabled",disabled:"disabled"};i(o.prototype),o.prototype.use=function(t){return t(this),this},o.prototype.position=function(){return this.emit(f.positioning),this._enabled?this._nextTick(this._attachElements):this.enable(),this},o.prototype.update=function(t,e){return e=e||!0,this._options=r(this._options,t,!0),e&&this.position(),this},o.prototype.enable=function(){return this._enabled?void 0:(this._moveElement(),this._setFriendStyles(),this._enableHandlers(),this._enabled=!0,this.emit(f.enabled),this.position(),this)},o.prototype.disable=function(){return this._enabled?(this._moveBackElement(),this._removeFriendStyles(),this._disableHandlers(),this._enabled=!1,this.emit(f.disabled),this):void 0},o.prototype._initialize=function(){this._findNodes();var t=this.position.bind(this),e=this._options.throttleSpeed;this._positionFn=this._options.throttle?s.throttle(t,e):t,this._options.enabled&&this.enable(),this.emit(f.initialized)},o.prototype._enableHandlers=function(){this.target.scrollParents.forEach(function(t){s.addEvent(t,"scroll",this._positionFn)},this),s.addEvent(a,"resize",this._positionFn)},o.prototype._disableHandlers=function(){this.target.scrollParents.forEach(function(t){s.removeEvent(t,"scroll",this._positionFn)},this),s.removeEvent(a,"resize",this._positionFn)},o.prototype._findNodes=function(){var t=this._options.elementSelector,e=this._options.targetSelector;if(this.target.node=s.getDomNode(e),!this.target.node)throw new Error("Could not find target node");if(this.target.scrollParents=s.getScrollParents(this.target.node),this.element.node=s.getDomNode(t),!this.element.node)throw new Error("Could not find element node");this.element.initialStyles=this._getInitialStyles(),this.element.initialParent=this.element.node.parentNode},o.prototype._moveElement=function(){"BODY"!==this.element.node.parentNode.tagName&&(this.element.node.parentNode.removeChild(this.element.node),l.body.appendChild(this.element.node))},o.prototype._moveBackElement=function(){"BODY"!==this.element.initialParent.tagName&&(l.body.removeChild(this.element.node),this.element.initialParent.appendChild(this.element.node))},o.prototype._getInitialStyles=function(){var t=s.getStyles(this.element.node);return{position:t.position,left:t.left||0,top:t.top||0}},o.prototype._setFriendStyles=function(){var t=s.getStyles(this.target.node).position,e={position:"fixed"===t?t:"absolute",top:0,left:0};for(var n in e)e.hasOwnProperty(n)&&(this.element.node.style[n]=e[n])},o.prototype._removeFriendStyles=function(){var t={position:this.element.initialStyles.position,left:this.element.initialStyles.left,top:this.element.initialStyles.top};this._options.transforms&&c&&(t[p]=null);for(var e in t)t.hasOwnProperty(e)&&(this.element.node.style[e]=t[e])},o.prototype._attachElements=function(){var t=this._getTargetAttachment(),e=this._getElementAttachment(),n=Math.round(t.left-e.left),o=Math.round(t.top-e.top),i={};if(this.cache.left!==n||this.cache.top!==o){this.cache.left=n,this.cache.top=o;var r=["translateZ(0)","translateX("+n+"px)","translateY("+o+"px)"];this._options.transforms&&c?i[p]=r.join(" "):(i.left=n+"px",i.top=o+"px");for(var s in i)i.hasOwnProperty(s)&&(this.element.node.style[s]=i[s]);this.emit(f.positioned)}},o.prototype._getElementAttachment=function(){var t=s.getBounds(this.element.node),e=this._options.elementAttach,n=this._options.elementOffset||[0,0],o=e[0],i=e[1],r={};if(e.length<=1)throw new Error("Invalid attach property set for element object");var a={left:0-n[0],middle:t.width/2+n[0],right:t.width+n[0]},l={top:0+n[1],middle:t.height/2+n[1],bottom:t.height-n[1]};if(!a.hasOwnProperty(o)||!l.hasOwnProperty(i))throw new Error("Invalid attach values for element object");return r.left=a[o],r.top=l[i],r},o.prototype._getTargetAttachment=function(){var t=l.documentElement,e=a.pageXOffset||t.scrollLeft,n=a.pageYOffset||t.scrollTop,o=s.getBounds(this.target.node),i=this._options.targetAttach||this._options.elementAttach,r=i[0],c=i[1],u={},p={left:o.left,middle:o.left+o.width/2,right:o.right},h={top:o.top,middle:o.top+o.height/2,bottom:o.bottom};if(!p.hasOwnProperty(r)||!h.hasOwnProperty(c))throw new Error("Invalid attach values for target object");return u.left=p[r]+e,u.top=h[c]+n,u},o.prototype._nextTick=function(t){window.requestAnimationFrame(t.bind(this))},t.exports=o},function(t,e,n){t.exports={throttle:function(t,e){var n;return function(){var o=arguments,i=this;n||(n=setTimeout(function(){return n=0,t.apply(i,o)},e))}},addEvent:function(t,e,n){t.addEventListener(e,n,!1)},removeEvent:function(t,e,n){t.removeEventListener(e,n,!1)},triggerEvent:function(t,e){var n=document.createEvent("Event");n.initEvent(e,!0,!0),n.eventName=e,t.dispatchEvent(n)},getStyles:function(t){return t&&1===t.nodeType?t.currentStyle||document.defaultView.getComputedStyle(t):null},getBounds:function(t){var e=t.getBoundingClientRect();return e.hasOwnProperty("width")&&e.hasOwnProperty("height")||(e.width=t.offsetWidth,e.height=t.offsetHeight),e},getScrollParents:function(t){var e=this.getStyles(t).position,n=t.parentNode,o=[];if("fixed"===e)return o.push(t),o;for(;n;){if(1===n.nodeType){var i=this.getStyles(n),r=i.overflow,s=i.overflowY,a=i.overflowX,l=i.position,c=/(auto|scroll)/,u=r+s+a;c.test(u)&&("absolute"!==e||"relative"===l||"absolute"===l||"fixed"===l)&&o.push(n)}n=n.parentNode}return o.length||o.push(document),o},getDomNode:function(t){return document.querySelector(t)},getVendorPrefix:function(){var t=window.getComputedStyle(document.documentElement,""),e=(Array.prototype.slice.call(t).join("").match(/-(moz|webkit|ms)-/)||""===t.OLink&&["","o"])[1],n="WebKit|Moz|MS|O".match(new RegExp("("+e+")","i"))[1];return{dom:n,lowercase:e,css:"-"+e+"-",js:e[0].toUpperCase()+e.substr(1)}},cssTransformSupported:function(){var t=!1,e="transform",n="Webkit Moz ms MS O WebKit".split(" "),o=document.createElement("div"),i=null;if(o.style[e]&&(t=!0),t===!1){i=e.charAt(0).toUpperCase()+e.substr(1);for(var r=0,s=n.length;r!==s;r++)if(void 0!==o.style[n[r]+i]){t=!0;break}}return t}}},function(t,e,n){"use strict";var o,i,r,s,a,l,c,u=n(4),p=n(5),h=Function.prototype.apply,f=Function.prototype.call,d=Object.create,m=Object.defineProperty,y=Object.defineProperties,g=Object.prototype.hasOwnProperty,v={configurable:!0,enumerable:!1,writable:!0};o=function(t,e){var n;return p(e),g.call(this,"__ee__")?n=this.__ee__:(n=v.value=d(null),m(this,"__ee__",v),v.value=null),n[t]?"object"==typeof n[t]?n[t].push(e):n[t]=[n[t],e]:n[t]=e,this},i=function(t,e){var n,i;return p(e),i=this,o.call(this,t,n=function(){r.call(i,t,n),h.call(e,this,arguments)}),n.__eeOnceListener__=e,this},r=function(t,e){var n,o,i,r;if(p(e),!g.call(this,"__ee__"))return this;if(n=this.__ee__,!n[t])return this;if(o=n[t],"object"==typeof o)for(r=0;i=o[r];++r)(i===e||i.__eeOnceListener__===e)&&(2===o.length?n[t]=o[r?0:1]:o.splice(r,1));else(o===e||o.__eeOnceListener__===e)&&delete n[t];return this},s=function(t){var e,n,o,i,r;if(g.call(this,"__ee__")&&(i=this.__ee__[t]))if("object"==typeof i){for(n=arguments.length,r=new Array(n-1),e=1;n>e;++e)r[e-1]=arguments[e];for(i=i.slice(),e=0;o=i[e];++e)h.call(o,this,r)}else switch(arguments.length){case 1:f.call(i,this);break;case 2:f.call(i,this,arguments[1]);break;case 3:f.call(i,this,arguments[1],arguments[2]);break;default:for(n=arguments.length,r=new Array(n-1),e=1;n>e;++e)r[e-1]=arguments[e];h.call(i,this,r)}},a={on:o,once:i,off:r,emit:s},l={on:u(o),once:u(i),off:u(r),emit:u(s)},c=y({},l),t.exports=e=function(t){return null==t?d(c):y(Object(t),l)},e.methods=a},function(t,e,n){var o,i=Object.prototype.hasOwnProperty,r=Object.prototype.toString,s=function(t){"use strict";if(!t||"[object Object]"!==r.call(t))return!1;var e=i.call(t,"constructor"),n=t.constructor&&t.constructor.prototype&&i.call(t.constructor.prototype,"isPrototypeOf");if(t.constructor&&!e&&!n)return!1;var s;for(s in t);return s===o||i.call(t,s)};t.exports=function a(){"use strict";var t,e,n,i,r,l,c=arguments[0],u=1,p=arguments.length,h=!1;for("boolean"==typeof c?(h=c,c=arguments[1]||{},u=2):("object"!=typeof c&&"function"!=typeof c||null==c)&&(c={});p>u;++u)if(t=arguments[u],null!=t)for(e in t)n=c[e],i=t[e],c!==i&&(h&&i&&(s(i)||(r=Array.isArray(i)))?(r?(r=!1,l=n&&Array.isArray(n)?n:[]):l=n&&s(n)?n:{},c[e]=a(h,l,i)):i!==o&&(c[e]=i));return c}},function(t,e,n){"use strict";var o,i=n(8),r=n(6),s=n(7),a=n(9);o=t.exports=function(t,e){var n,o,s,l,c;return arguments.length<2||"string"!=typeof t?(l=e,e=t,t=null):l=arguments[2],null==t?(n=s=!0,o=!1):(n=a.call(t,"c"),o=a.call(t,"e"),s=a.call(t,"w")),c={value:e,configurable:n,enumerable:o,writable:s},l?i(r(l),c):c},o.gs=function(t,e,n){var o,l,c,u;return"string"!=typeof t?(c=n,n=e,e=t,t=null):c=arguments[3],null==e?e=void 0:s(e)?null==n?n=void 0:s(n)||(c=n,n=void 0):(c=e,e=n=void 0),null==t?(o=!0,l=!1):(o=a.call(t,"c"),l=a.call(t,"e")),u={get:e,set:n,configurable:o,enumerable:l},c?i(r(c),u):u}},function(t,e,n){"use strict";t.exports=function(t){if("function"!=typeof t)throw new TypeError(t+" is not a function");return t}},function(t,e,n){"use strict";var o=Array.prototype.forEach,i=Object.create,r=function(t,e){var n;for(n in t)e[n]=t[n]};t.exports=function(t){var e=i(null);return o.call(arguments,function(t){null!=t&&r(Object(t),e)}),e}},function(t,e,n){"use strict";t.exports=function(t){return"function"==typeof t}},function(t,e,n){"use strict";t.exports=n(10)()?Object.assign:n(11)},function(t,e,n){"use strict";t.exports=n(13)()?String.prototype.contains:n(14)},function(t,e,n){"use strict";t.exports=function(){var t,e=Object.assign;return"function"!=typeof e?!1:(t={foo:"raz"},e(t,{bar:"dwa"},{trzy:"trzy"}),t.foo+t.bar+t.trzy==="razdwatrzy")}},function(t,e,n){"use strict";var o=n(15),i=n(12),r=Math.max;t.exports=function(t,e){var n,s,a,l=r(arguments.length,2);for(t=Object(i(t)),a=function(o){try{t[o]=e[o]}catch(i){n||(n=i)}},s=1;l>s;++s)e=arguments[s],o(e).forEach(a);if(void 0!==n)throw n;return t}},function(t,e,n){"use strict";t.exports=function(t){if(null==t)throw new TypeError("Cannot use null or undefined");return t}},function(t,e,n){"use strict";var o="razdwatrzy";t.exports=function(){return"function"!=typeof o.contains?!1:o.contains("dwa")===!0&&o.contains("foo")===!1}},function(t,e,n){"use strict";var o=String.prototype.indexOf;t.exports=function(t){return o.call(this,t,arguments[1])>-1}},function(t,e,n){"use strict";t.exports=n(16)()?Object.keys:n(17)},function(t,e,n){"use strict";t.exports=function(){try{return Object.keys("primitive"),!0}catch(t){return!1}}},function(t,e,n){"use strict";var o=Object.keys;t.exports=function(t){return o(null==t?t:Object(t))}}])});