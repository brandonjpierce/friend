/*! Friend.js v0.1.0 :: by Brandon Pierce (brandon@brandonjpierce.com) MIT */
<<<<<<< HEAD
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):"object"==typeof exports?exports.Friend=e():t.Friend=e()}(this,function(){return function(t){function e(o){if(n[o])return n[o].exports;var i=n[o]={exports:{},id:o,loaded:!1};return t[o].call(i.exports,i,i.exports,e),i.loaded=!0,i.exports}var n={};return e.m=t,e.c=n,e.p="",e(0)}([function(t,e,n){function o(t){return this._enabled=!1,this._options=r({},u,t),this.cache={left:null,top:null},this.element={},this.target={},this._initialize(),this}var i=n(3),r=n(2),s=n(1),a=s.cssTransformSupported(),l=s.getVendorPrefix().lowercase,c=l+"Transform",u={enabled:!0,transforms:a,throttle:!1,throttleSpeed:200},p={positioning:"positioning",positioned:"positioned",initialized:"initialized",enabled:"enabled",disabled:"disabled"};i(o.prototype),o.prototype.use=function(t){return t(this),this},o.prototype.position=function(){return this.emit(p.positioning),this._enabled?this._nextTick(this._attachElements):this.enable(),this},o.prototype.update=function(t,e){return e=e||!0,this._options=r(this._options,t,!0),e&&this.position(),this},o.prototype.enable=function(){return this._enabled?void 0:(this._moveElement(),this._setFriendStyles(),this._enableHandlers(),this._enabled=!0,this.emit(p.enabled),this.position(),this)},o.prototype.disable=function(){return this._enabled?(this._moveBackElement(),this._removeFriendStyles(),this._disableHandlers(),this._enabled=!1,this.emit(p.disabled),this):void 0},o.prototype._initialize=function(){this._findNodes();var t=this.position.bind(this),e=this._options.throttleSpeed;this._positionFn=this._options.throttle?s.throttle(t,e):t,this._options.enabled&&this.enable(),this.emit(p.initialized)},o.prototype._enableHandlers=function(){this.target.scrollParents.forEach(function(t){s.addEvent(t,"scroll",this._positionFn)},this),s.addEvent(window,"resize",this._positionFn)},o.prototype._disableHandlers=function(){this.target.scrollParents.forEach(function(t){s.removeEvent(t,"scroll",this._positionFn)},this),s.removeEvent(window,"resize",this._positionFn)},o.prototype._findNodes=function(){var t=this._options.elementSelector,e=this._options.targetSelector;if(this.target.node=s.getDomNode(e),!this.target.node)throw new Error("Could not find target node");if(this.target.scrollParents=s.getScrollParents(this.target.node),this.element.node=s.getDomNode(t),!this.element.node)throw new Error("Could not find element node");this.element.initialStyles=this._getInitialStyles(),this.element.initialParent=this.element.node.parentNode},o.prototype._moveElement=function(){"BODY"!==this.element.node.parentNode.tagName&&(this.element.node.parentNode.removeChild(this.element.node),document.body.appendChild(this.element.node))},o.prototype._moveBackElement=function(){"BODY"!==this.element.initialParent.tagName&&(document.body.removeChild(this.element.node),this.element.initialParent.appendChild(this.element.node))},o.prototype._getInitialStyles=function(){var t=s.getStyles(this.element.node);return{position:t.position,left:t.left||0,top:t.top||0}},o.prototype._setFriendStyles=function(){var t=s.getStyles(this.target.node).position,e={position:"fixed"===t?t:"absolute",top:0,left:0};for(var n in e)e.hasOwnProperty(n)&&(this.element.node.style[n]=e[n])},o.prototype._removeFriendStyles=function(){var t={position:this.element.initialStyles.position,left:this.element.initialStyles.left,top:this.element.initialStyles.top};this._options.transforms&&a&&(t[c]=null);for(var e in t)t.hasOwnProperty(e)&&(this.element.node.style[e]=t[e])},o.prototype._attachElements=function(){var t=this._getTargetAttachment(),e=this._getElementAttachment(),n=Math.round(t.left-e.left),o=Math.round(t.top-e.top),i={};if(this.cache.left!==n||this.cache.top!==o){this.cache.left=n,this.cache.top=o;var r=["translateZ(0)","translateX("+n+"px)","translateY("+o+"px)"];this._options.transforms&&a?i[c]=r.join(" "):(i.left=n+"px",i.top=o+"px");for(var s in i)i.hasOwnProperty(s)&&(this.element.node.style[s]=i[s]);this.emit(p.positioned)}},o.prototype._getElementAttachment=function(){var t=s.getBounds(this.element.node),e=this._options.elementAttach,n=this._options.elementOffset||[0,0],o=e[0],i=e[1],r={};if(e.length<=1)throw new Error("Invalid attach property set for element object");var a={left:0-n[0],middle:t.width/2+n[0],right:t.width+n[0]},l={top:0+n[1],middle:t.height/2+n[1],bottom:t.height-n[1]};if(!a.hasOwnProperty(o)||!l.hasOwnProperty(i))throw new Error("Invalid attach values for element object");return r.left=a[o],r.top=l[i],r},o.prototype._getTargetAttachment=function(){var t=document.documentElement,e=window.pageXOffset||t.scrollLeft,n=window.pageYOffset||t.scrollTop,o=s.getBounds(this.target.node),i=this._options.targetAttach||this._options.elementAttach,r=i[0],a=i[1],l={},c={left:o.left,middle:o.left+o.width/2,right:o.right},u={top:o.top,middle:o.top+o.height/2,bottom:o.bottom};if(!c.hasOwnProperty(r)||!u.hasOwnProperty(a))throw new Error("Invalid attach values for target object");return l.left=c[r]+e,l.top=u[a]+n,l},o.prototype._nextTick=function(t){window.requestAnimationFrame(t.bind(this))},t.exports=o},function(t,e,n){t.exports={throttle:function(t,e){var n;return function(){var o=arguments,i=this;n||(n=setTimeout(function(){return n=0,t.apply(i,o)},e))}},addEvent:function(t,e,n){t.addEventListener(e,n,!1)},removeEvent:function(t,e,n){t.removeEventListener(e,n,!1)},triggerEvent:function(t,e){var n=document.createEvent("Event");n.initEvent(e,!0,!0),n.eventName=e,t.dispatchEvent(n)},getStyles:function(t){return t&&1===t.nodeType?t.currentStyle||document.defaultView.getComputedStyle(t):null},getBounds:function(t){var e=t.getBoundingClientRect();return e.hasOwnProperty("width")&&e.hasOwnProperty("height")||(e.width=t.offsetWidth,e.height=t.offsetHeight),e},getScrollParents:function(t){var e=this.getStyles(t).position,n=t.parentNode,o=[];if("fixed"===e)return o.push(t),o;for(;n;){if(1===n.nodeType){var i=this.getStyles(n),r=i.overflow,s=i.overflowY,a=i.overflowX,l=i.position,c=/(auto|scroll)/,u=r+s+a;c.test(u)&&("absolute"!==e||"relative"===l||"absolute"===l||"fixed"===l)&&o.push(n)}n=n.parentNode}return o.length||o.push(document),o},getDomNode:function(t){return document.querySelector(t)},getVendorPrefix:function(){var t=window.getComputedStyle(document.documentElement,""),e=(Array.prototype.slice.call(t).join("").match(/-(moz|webkit|ms)-/)||""===t.OLink&&["","o"])[1],n="WebKit|Moz|MS|O".match(new RegExp("("+e+")","i"))[1];return{dom:n,lowercase:e,css:"-"+e+"-",js:e[0].toUpperCase()+e.substr(1)}},cssTransformSupported:function(){var t=!1,e="transform",n="Webkit Moz ms MS O WebKit".split(" "),o=document.createElement("div"),i=null;if(o.style[e]&&(t=!0),t===!1){i=e.charAt(0).toUpperCase()+e.substr(1);for(var r=0,s=n.length;r!==s;r++)if(void 0!==o.style[n[r]+i]){t=!0;break}}return t}}},function(t,e,n){var o,i=Object.prototype.hasOwnProperty,r=Object.prototype.toString,s=function(t){"use strict";if(!t||"[object Object]"!==r.call(t))return!1;var e=i.call(t,"constructor"),n=t.constructor&&t.constructor.prototype&&i.call(t.constructor.prototype,"isPrototypeOf");if(t.constructor&&!e&&!n)return!1;var s;for(s in t);return s===o||i.call(t,s)};t.exports=function a(){"use strict";var t,e,n,i,r,l,c=arguments[0],u=1,p=arguments.length,h=!1;for("boolean"==typeof c?(h=c,c=arguments[1]||{},u=2):("object"!=typeof c&&"function"!=typeof c||null==c)&&(c={});p>u;++u)if(t=arguments[u],null!=t)for(e in t)n=c[e],i=t[e],c!==i&&(h&&i&&(s(i)||(r=Array.isArray(i)))?(r?(r=!1,l=n&&Array.isArray(n)?n:[]):l=n&&s(n)?n:{},c[e]=a(h,l,i)):i!==o&&(c[e]=i));return c}},function(t,e,n){"use strict";var o,i,r,s,a,l,c,u=n(4),p=n(5),h=Function.prototype.apply,f=Function.prototype.call,d=Object.create,m=Object.defineProperty,y=Object.defineProperties,g=Object.prototype.hasOwnProperty,v={configurable:!0,enumerable:!1,writable:!0};o=function(t,e){var n;return p(e),g.call(this,"__ee__")?n=this.__ee__:(n=v.value=d(null),m(this,"__ee__",v),v.value=null),n[t]?"object"==typeof n[t]?n[t].push(e):n[t]=[n[t],e]:n[t]=e,this},i=function(t,e){var n,i;return p(e),i=this,o.call(this,t,n=function(){r.call(i,t,n),h.call(e,this,arguments)}),n.__eeOnceListener__=e,this},r=function(t,e){var n,o,i,r;if(p(e),!g.call(this,"__ee__"))return this;if(n=this.__ee__,!n[t])return this;if(o=n[t],"object"==typeof o)for(r=0;i=o[r];++r)(i===e||i.__eeOnceListener__===e)&&(2===o.length?n[t]=o[r?0:1]:o.splice(r,1));else(o===e||o.__eeOnceListener__===e)&&delete n[t];return this},s=function(t){var e,n,o,i,r;if(g.call(this,"__ee__")&&(i=this.__ee__[t]))if("object"==typeof i){for(n=arguments.length,r=new Array(n-1),e=1;n>e;++e)r[e-1]=arguments[e];for(i=i.slice(),e=0;o=i[e];++e)h.call(o,this,r)}else switch(arguments.length){case 1:f.call(i,this);break;case 2:f.call(i,this,arguments[1]);break;case 3:f.call(i,this,arguments[1],arguments[2]);break;default:for(n=arguments.length,r=new Array(n-1),e=1;n>e;++e)r[e-1]=arguments[e];h.call(i,this,r)}},a={on:o,once:i,off:r,emit:s},l={on:u(o),once:u(i),off:u(r),emit:u(s)},c=y({},l),t.exports=e=function(t){return null==t?d(c):y(Object(t),l)},e.methods=a},function(t,e,n){"use strict";var o,i=n(8),r=n(6),s=n(7),a=n(9);o=t.exports=function(t,e){var n,o,s,l,c;return arguments.length<2||"string"!=typeof t?(l=e,e=t,t=null):l=arguments[2],null==t?(n=s=!0,o=!1):(n=a.call(t,"c"),o=a.call(t,"e"),s=a.call(t,"w")),c={value:e,configurable:n,enumerable:o,writable:s},l?i(r(l),c):c},o.gs=function(t,e,n){var o,l,c,u;return"string"!=typeof t?(c=n,n=e,e=t,t=null):c=arguments[3],null==e?e=void 0:s(e)?null==n?n=void 0:s(n)||(c=n,n=void 0):(c=e,e=n=void 0),null==t?(o=!0,l=!1):(o=a.call(t,"c"),l=a.call(t,"e")),u={get:e,set:n,configurable:o,enumerable:l},c?i(r(c),u):u}},function(t,e,n){"use strict";t.exports=function(t){if("function"!=typeof t)throw new TypeError(t+" is not a function");return t}},function(t,e,n){"use strict";var o=Array.prototype.forEach,i=Object.create,r=function(t,e){var n;for(n in t)e[n]=t[n]};t.exports=function(t){var e=i(null);return o.call(arguments,function(t){null!=t&&r(Object(t),e)}),e}},function(t,e,n){"use strict";t.exports=function(t){return"function"==typeof t}},function(t,e,n){"use strict";t.exports=n(10)()?Object.assign:n(11)},function(t,e,n){"use strict";t.exports=n(12)()?String.prototype.contains:n(13)},function(t,e,n){"use strict";t.exports=function(){var t,e=Object.assign;return"function"!=typeof e?!1:(t={foo:"raz"},e(t,{bar:"dwa"},{trzy:"trzy"}),t.foo+t.bar+t.trzy==="razdwatrzy")}},function(t,e,n){"use strict";var o=n(15),i=n(14),r=Math.max;t.exports=function(t,e){var n,s,a,l=r(arguments.length,2);for(t=Object(i(t)),a=function(o){try{t[o]=e[o]}catch(i){n||(n=i)}},s=1;l>s;++s)e=arguments[s],o(e).forEach(a);if(void 0!==n)throw n;return t}},function(t,e,n){"use strict";var o="razdwatrzy";t.exports=function(){return"function"!=typeof o.contains?!1:o.contains("dwa")===!0&&o.contains("foo")===!1}},function(t,e,n){"use strict";var o=String.prototype.indexOf;t.exports=function(t){return o.call(this,t,arguments[1])>-1}},function(t,e,n){"use strict";t.exports=function(t){if(null==t)throw new TypeError("Cannot use null or undefined");return t}},function(t,e,n){"use strict";t.exports=n(16)()?Object.keys:n(17)},function(t,e,n){"use strict";t.exports=function(){try{return Object.keys("primitive"),!0}catch(t){return!1}}},function(t,e,n){"use strict";var o=Object.keys;t.exports=function(t){return o(null==t?t:Object(t))}}])});
=======
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["Friend"] = factory();
	else
		root["Friend"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Dependencies
	 */
	var EventEmitter = __webpack_require__(2);
	var extend = __webpack_require__(3);
	var utils = __webpack_require__(1);

	/**
	 * Localize some utils vars
	 */
	var transformsSupported = utils.cssTransformSupported();
	var vendorPrefix = utils.getVendorPrefix().lowercase;
	var transformName = vendorPrefix + 'Transform';

	/**
	 * Default options
	 */
	var DEFAULTS = {
	  enabled: true,
	  transforms: transformsSupported,
	  throttle: false,
	  throttleSpeed: 100,
	};

	/**
	 * Event names
	 */
	var EVENTS = {
	  positioning: 'positioning',
	  positioned: 'positioned',
	  initialized: 'initialized',
	  enabled: 'enabled',
	  disabled: 'disabled'
	};

	/**
	 * Attach event emitter to our Friend class
	 */
	EventEmitter(Friend.prototype);

	/**
	 * Friend constructor
	 *
	 * @param {Object} options Options we want to pass to the constructor
	 * @return {Object} Friend instance
	 */
	function Friend(options) {
	  this._enabled = false;
	  this._options = extend({}, DEFAULTS, options);
	  this.element = {};
	  this.target = {};

	  this._initialize();

	  return this;
	}

	/**
	 * Add plugins or additional functionality to friend
	 *
	 * @param {Function} fn Callback function
	 * @return {Friend}
	 */
	Friend.prototype.use = function(fn) {
	  fn(this);

	  return this;
	};

	/**
	 * Find elements and make them friends
	 *
	 * @return {Friend}
	 */
	Friend.prototype.position = function() {
	  this.emit(EVENTS.positioning);

	  // we need to make sure Friend is enabled before positioning
	  if (!this._enabled) {
	    this.enable();
	  } else {
	    this._nextTick(this._attachElements);
	  }

	  return this;
	};

	/**
	 * Update options for Friend instance
	 *
	 * @param {Object} options Options you wish to override
	 * @param {Boolean} positionAfter Call position method after update?
	 * @return {Friend}
	 */
	Friend.prototype.update = function(options, positionAfter) {
	  positionAfter = positionAfter || true;
	  this._options = extend(this._options, options, true);

	  if (positionAfter) {
	    this.position();
	  }

	  return this;
	};

	/**
	 * Enable Friend and setup event handlers
	 *
	 * @return {Friend}
	 */
	Friend.prototype.enable = function() {
	  if (this._enabled) {
	    return;
	  }

	  // setup initial styles and handlers
	  this._moveElement();
	  this._setFriendStyles();
	  this._enableHandlers();

	  // let friend know were enabled and position element
	  this._enabled = true;
	  this.emit(EVENTS.enabled);
	  this.position();

	  return this;
	};

	/**
	 * Disable Friend and remove event handlers
	 *
	 * @return {Friend}
	 */
	Friend.prototype.disable = function() {
	  if (!this._enabled) {
	    return;
	  }

	  // reset element back to original state and clean up event handlers
	  this._moveBackElement();
	  this._removeFriendStyles();
	  this._disableHandlers();

	  // let friend know were disabled
	  this._enabled = false;
	  this.emit(EVENTS.disabled);

	  return this;
	};

	/**
	 * Initialize Friend
	 */
	Friend.prototype._initialize = function() {
	  // find our elements and get initial data for them
	  this._findNodes();

	  // determine if our position function is throttled or regular
	  var positionFn = this.position.bind(this);
	  var throttleSpeed = this._options.throttleSpeed;

	  this._positionFn = this._options.throttle ?
	                     utils.throttle(positionFn, throttleSpeed) :
	                     positionFn;

	  // auto enable Friend if option is set
	  if (this._options.enabled) {
	    this.enable();
	  }

	  this.emit(EVENTS.initialized);
	};

	/**
	 * Setup event handlers
	 *
	 * @api private
	 */
	Friend.prototype._enableHandlers = function() {
	  this.target.scrollParents.forEach(function(node) {
	    utils.addEvent(node, 'scroll', this._positionFn);
	  }, this);

	  utils.addEvent(window, 'resize', this._positionFn);

	  // we only want to listen to the friend browser event if were inside
	  // a nested scroll container so that we can listen to our targets scroll
	  // event as well
	  if (this.target.scrollParents.length > 1) {
	    utils.addEvent(
	      this.target.node,
	      'friend:' + EVENTS.positioned,
	      this._positionFn
	    );
	  }
	};

	/**
	 * Disable event handlers
	 *
	 * @api private
	 */
	Friend.prototype._disableHandlers = function() {
	  this.target.scrollParents.forEach(function(node) {
	    utils.removeEvent(node, 'scroll', this._positionFn);
	  }, this);

	  utils.removeEvent(window, 'resize', this._positionFn);

	  if (this.target.scrollParents.length > 1) {
	    utils.removeEvent(
	      this.target.node,
	      'friend:' + EVENTS.positioned,
	      this._positionFn
	    );
	  }
	};

	/**
	 * Find our element and target nodes in the DOM
	 *
	 * @api private
	 */
	Friend.prototype._findNodes = function() {
	  var element = this._options.element.selector;
	  var target = this._options.target.selector;

	  // target node and scroll parents
	  this.target.node = utils.getDomNode(target);

	  if (!this.target.node) {
	    throw new Error('Could not find target node');
	  }

	  this.target.scrollParents = utils.getScrollParents(this.target.node);

	  // element node and initial data
	  this.element.node = utils.getDomNode(element);

	  if (!this.element.node) {
	    throw new Error('Could not find element node');
	  }

	  this.element.initialStyles = this._getInitialStyles();
	  this.element.initialParent = this.element.node.parentNode;
	};

	/**
	 * Move element into the body
	 *
	 * @api private
	 */
	Friend.prototype._moveElement = function() {
	  if (this.element.node.parentNode.tagName !== 'BODY') {
	    this.element.node.parentNode.removeChild(this.element.node);
	    document.body.appendChild(this.element.node);
	  }
	};

	/**
	 * Move element back to its original position
	 *
	 * @api private
	 */
	Friend.prototype._moveBackElement = function() {
	  if (this.element.initialParent.tagName !== 'BODY') {
	    document.body.removeChild(this.element.node);
	    this.element.initialParent.appendChild(this.element.node);
	  }
	};

	/**
	 * Grab initial CSS state of our element
	 *
	 * @api private
	 */
	Friend.prototype._getInitialStyles = function() {
	  var elementStyles = utils.getStyles(this.element.node);

	  return {
	    position: elementStyles.position,
	    left: elementStyles.left || 0,
	    top: elementStyles.top || 0
	  };
	};

	/**
	 * Initially stick element in top left corner to allow itself to position
	 * correctly as well as give it the appropriate position attribute.
	 *
	 * @api private
	 */
	Friend.prototype._setFriendStyles = function() {
	  var positionType = utils.getStyles(this.target.node).position;
	  var css = {
	    position: positionType === 'fixed' ? positionType : 'absolute',
	    top: 0,
	    left: 0
	  };

	  for (var key in css) {
	    if (css.hasOwnProperty(key)) {
	      this.element.node.style[key] = css[key];
	    }
	  }
	};

	/**
	 * Reset elements CSS styles back to initial state
	 *
	 * @api private
	 */
	Friend.prototype._removeFriendStyles = function() {
	  var css = {
	    position: this.element.initialStyles.position,
	    left: this.element.initialStyles.left,
	    top: this.element.initialStyles.top
	  };

	  if (this._options.transforms && transformsSupported) {
	    css[transformName] = null;
	  }

	  for (var key in css) {
	    if (css.hasOwnProperty(key)) {
	      this.element.node.style[key] = css[key];
	    }
	  }
	};

	/**
	 * Attach our target and element nodes to one another
	 *
	 * @api private
	 */
	Friend.prototype._attachElements = function() {
	  var targetAttach = this._getTargetAttachment();
	  var elementAttach = this._getElementAttachment();
	  var leftPoint = Math.round(targetAttach.left - elementAttach.left);
	  var topPoint = Math.round(targetAttach.top - elementAttach.top);
	  var css = {};

	  var transformValue = [
	    'translateZ(0)',
	    'translateX(' + leftPoint + 'px)',
	    'translateY(' + topPoint + 'px)'
	  ];

	  if (this._options.transforms && transformsSupported) {
	    css[transformName] = transformValue.join(' ');
	  } else {
	    css.left = leftPoint + 'px';
	    css.top = topPoint + 'px';
	  }

	  for (var key in css) {
	    if (css.hasOwnProperty(key)) {
	      this.element.node.style[key] = css[key];
	    }
	  }

	  if (this.target.scrollParents.length > 1) {
	    utils.triggerEvent(this.element.node, 'friend:' + EVENTS.positioned);
	  }

	  this.emit(EVENTS.positioned);
	};

	/**
	 * Get position and dimension information for a DOM node
	 *
	 * @param {Node} element DOM node we want to get data for
	 * @return {Object} Dom node ClientRect bound data
	 * @api private
	 */
	Friend.prototype._getBounds = function(element) {
	  var documentEl = document.documentElement;
	  var offsetX = window.pageXOffset || documentEl.scrollLeft;
	  var offsetY = window.pageYOffset || documentEl.scrollTop;
	  var clientRect = element.getBoundingClientRect();
	  var bounds = {};

	  for (var key in clientRect) {
	    if (clientRect.hasOwnProperty(key)) {
	      bounds[key] = clientRect[key];
	    }
	  }

	  // if (!bounds.hasOwnProperty('width') || !bounds.hasOwnProperty('height')) {
	  //   bounds.width = element.offsetWidth;
	  //   bounds.height = element.offsetHeight;
	  // }

	  return bounds;
	};

	/**
	 * Grab attachment information for our element
	 *
	 * @return {Object} Attachment point and side values
	 * @api private
	 */
	Friend.prototype._getElementAttachment = function() {
	  var bounds = this._getBounds(this.element.node);
	  var attachments = this._options.element.attach;
	  var offset = this._options.element.offset || [0, 0];
	  var x = attachments[0];
	  var y = attachments[1];
	  var points = {};

	  if (attachments.length <= 1) {
	    throw new Error('Invalid attach property set for element object');
	  }

	  var xValues = {
	    left: 0 - offset[0],
	    middle: (bounds.width / 2) + offset[0],
	    right: bounds.width + offset[0]
	  };

	  var yValues = {
	    top: 0 + offset[1],
	    middle: (bounds.height / 2) + offset[1],
	    bottom: bounds.height - offset[1]
	  };

	  if (!xValues.hasOwnProperty(x) || !yValues.hasOwnProperty(y)) {
	    throw new Error('Invalid attach values for element object');
	  }

	  points.left = xValues[x];
	  points.top = yValues[y];

	  return points;
	};

	/**
	 * Grab attachment information for our target
	 *
	 * @return {Object} Attachment point and side values
	 * @api private
	 */
	Friend.prototype._getTargetAttachment = function() {
	  var documentEl = document.documentElement;
	  var offsetX = window.pageXOffset || documentEl.scrollLeft;
	  var offsetY = window.pageYOffset || documentEl.scrollTop;
	  var bounds = this._getBounds(this.target.node);
	  var attachments = this._options.target.attach || this._options.element.attach;
	  var x = attachments[0];
	  var y = attachments[1];
	  var points = {};

	  var xValues = {
	    left: bounds.left,
	    middle: bounds.left + (bounds.width / 2),
	    right: bounds.right
	  };

	  var yValues = {
	    top: bounds.top,
	    middle: bounds.top + (bounds.height / 2),
	    bottom: bounds.bottom
	  };

	  if (!xValues.hasOwnProperty(x) || !yValues.hasOwnProperty(y)) {
	    throw new Error('Invalid attach values for target object');
	  }

	  points.left = xValues[x] + (offsetX - (documentEl.clientLeft  || 0));
	  points.top = yValues[y] + (offsetY - (documentEl.clientTop  || 0));

	  return points;
	};

	/**
	 * Small wrapper for request animation frame
	 *
	 * @param {Function} fn Callback function we want to call in next frame
	 * @api private
	 */
	Friend.prototype._nextTick = function(fn) {
	  window.requestAnimationFrame(fn.bind(this));
	};

	/**
	 * Expose module
	 */
	module.exports = Friend;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {

	  /**
	   * Simple throttle function
	   *
	   * @param {Function} fn Function we want to throttle
	   * @param {Number} delay Throttle delay
	   */
	  throttle: function(fn, delay) {
	    var timeout;

	    return function() {
	      var args = arguments;
	      var context = this;
	      if (!timeout) {
	        timeout = setTimeout(function() {
	          timeout = 0;
	          return fn.apply(context, args);
	        }, delay);
	      }
	    };
	  },

	  /**
	   * Attach event handler to DOM node
	   *
	   * @param {Object} obj  DOM node
	   * @param {String} type Event name
	   * @param {Function} fn Event callback
	   */
	  addEvent: function(obj, type, fn) {
	    obj.addEventListener(type, fn, false);
	  },

	  /**
	   * Remove event handler from DOM node
	   *
	   * @param {Object} obj  DOM node
	   * @param {String} type Event name
	   * @param {Function} fn Event callback
	   */
	  removeEvent: function(obj, type, fn) {
	    obj.removeEventListener(type, fn, false);
	  },

	  /**
	   * Trigger event
	   *
	   * @param {Object} obj  DOM node
	   * @param {String} type Event name
	   */
	  triggerEvent: function(obj, type) {
	    var e = document.createEvent('Event');
	    e.initEvent(type, true, true);
	    e.eventName = type;

	    obj.dispatchEvent(e);
	  },

	  /**
	   * Get a specific style attribute from DOM node
	   *
	   * @param {Object} node DOM node
	   * @param {String} styleProp Style prop you want to get
	   */
	  getStyles: function(node) {
	    if (!node || node.nodeType !== 1) {
	    	return null;
	    }

	  	return node.currentStyle || document.defaultView.getComputedStyle(node);
	  },

	  /**
	   * Get an array of scrollable parents for a particular node
	   *
	   * @param {Object} node DOM node
	   */
	  getScrollParents: function(node) {
	    var positionType = this.getStyles(node).position;
	    var parentNode = node.parentNode;
	    var parents = [];

	    if (positionType === 'fixed') {
	      parents.push(node);
	      return parents;
	    }

	    while (parentNode) {
	      if (parentNode.nodeType === 1) {
	        var parentStyles = this.getStyles(parentNode);
	        var overflow = parentStyles.overflow;
	        var overflowY = parentStyles.overflowY;
	        var overflowX = parentStyles.overflowX;
	        var parentPositionType = parentStyles.position;

	        var regTest = /(auto|scroll)/;
	        var regValue = overflow + overflowY + overflowX;

	        if (regTest.test(regValue)) {
	          if (positionType !== 'absolute' || (
	               parentPositionType === 'relative' ||
	               parentPositionType === 'absolute' ||
	               parentPositionType === 'fixed'
	          )) {
	            parents.push(parentNode);
	          }
	        }
	      }

	      parentNode = parentNode.parentNode;
	    }

	    if (!parents.length) {
	      parents.push(document);
	    }

	    return parents;
	  },

	  /**
	   * Simple helper method to grab a DOM node
	   *
	   * @param {String} selector The query selector string we want to query
	   */
	  getDomNode: function(selector) {
	    return document.querySelector(selector);
	  },

	  /**
	   * Grab the current browsers vendor prefix for css3 styles
	   *
	   * taken from: http://davidwalsh.name/vendor-prefix
	   */
	  getVendorPrefix: function() {
	    var styles = window.getComputedStyle(document.documentElement, '');

	    var pre = (
	      Array.prototype.slice
	        .call(styles)
	        .join('')
	        .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
	    )[1];

	    var dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];

	    return {
	      dom: dom,
	      lowercase: pre,
	      css: '-' + pre + '-',
	      js: pre[0].toUpperCase() + pre.substr(1)
	    };
	  },

	  /**
	   * Detect if CSS transforms are usable for the users current browser
	   */
	  cssTransformSupported: function() {
	    var isSupported = false;
	    var propName = 'transform';
	    var domPrefixes = 'Webkit Moz ms MS O WebKit'.split(' ');
	    var el = document.createElement('div');
	    var propNameCapital = null;

	    if (el.style[propName]) {
	      isSupported = true;
	    }

	    if (isSupported === false) {
	      propNameCapital = propName.charAt(0).toUpperCase() + propName.substr(1);

	      for (var i = 0, len = domPrefixes.length; i !== len; i++) {
	        if (el.style[domPrefixes[i] + propNameCapital] !== undefined ) {
	          isSupported = true;
	          break;
	        }
	      }
	    }

	    return isSupported;
	  }
	};


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var d        = __webpack_require__(4)
	  , callable = __webpack_require__(5)

	  , apply = Function.prototype.apply, call = Function.prototype.call
	  , create = Object.create, defineProperty = Object.defineProperty
	  , defineProperties = Object.defineProperties
	  , hasOwnProperty = Object.prototype.hasOwnProperty
	  , descriptor = { configurable: true, enumerable: false, writable: true }

	  , on, once, off, emit, methods, descriptors, base;

	on = function (type, listener) {
		var data;

		callable(listener);

		if (!hasOwnProperty.call(this, '__ee__')) {
			data = descriptor.value = create(null);
			defineProperty(this, '__ee__', descriptor);
			descriptor.value = null;
		} else {
			data = this.__ee__;
		}
		if (!data[type]) data[type] = listener;
		else if (typeof data[type] === 'object') data[type].push(listener);
		else data[type] = [data[type], listener];

		return this;
	};

	once = function (type, listener) {
		var once, self;

		callable(listener);
		self = this;
		on.call(this, type, once = function () {
			off.call(self, type, once);
			apply.call(listener, this, arguments);
		});

		once.__eeOnceListener__ = listener;
		return this;
	};

	off = function (type, listener) {
		var data, listeners, candidate, i;

		callable(listener);

		if (!hasOwnProperty.call(this, '__ee__')) return this;
		data = this.__ee__;
		if (!data[type]) return this;
		listeners = data[type];

		if (typeof listeners === 'object') {
			for (i = 0; (candidate = listeners[i]); ++i) {
				if ((candidate === listener) ||
						(candidate.__eeOnceListener__ === listener)) {
					if (listeners.length === 2) data[type] = listeners[i ? 0 : 1];
					else listeners.splice(i, 1);
				}
			}
		} else {
			if ((listeners === listener) ||
					(listeners.__eeOnceListener__ === listener)) {
				delete data[type];
			}
		}

		return this;
	};

	emit = function (type) {
		var i, l, listener, listeners, args;

		if (!hasOwnProperty.call(this, '__ee__')) return;
		listeners = this.__ee__[type];
		if (!listeners) return;

		if (typeof listeners === 'object') {
			l = arguments.length;
			args = new Array(l - 1);
			for (i = 1; i < l; ++i) args[i - 1] = arguments[i];

			listeners = listeners.slice();
			for (i = 0; (listener = listeners[i]); ++i) {
				apply.call(listener, this, args);
			}
		} else {
			switch (arguments.length) {
			case 1:
				call.call(listeners, this);
				break;
			case 2:
				call.call(listeners, this, arguments[1]);
				break;
			case 3:
				call.call(listeners, this, arguments[1], arguments[2]);
				break;
			default:
				l = arguments.length;
				args = new Array(l - 1);
				for (i = 1; i < l; ++i) {
					args[i - 1] = arguments[i];
				}
				apply.call(listeners, this, args);
			}
		}
	};

	methods = {
		on: on,
		once: once,
		off: off,
		emit: emit
	};

	descriptors = {
		on: d(on),
		once: d(once),
		off: d(off),
		emit: d(emit)
	};

	base = defineProperties({}, descriptors);

	module.exports = exports = function (o) {
		return (o == null) ? create(base) : defineProperties(Object(o), descriptors);
	};
	exports.methods = methods;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var hasOwn = Object.prototype.hasOwnProperty;
	var toString = Object.prototype.toString;
	var undefined;

	var isPlainObject = function isPlainObject(obj) {
		'use strict';
		if (!obj || toString.call(obj) !== '[object Object]') {
			return false;
		}

		var has_own_constructor = hasOwn.call(obj, 'constructor');
		var has_is_property_of_method = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
		// Not own constructor property must be Object
		if (obj.constructor && !has_own_constructor && !has_is_property_of_method) {
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		var key;
		for (key in obj) {}

		return key === undefined || hasOwn.call(obj, key);
	};

	module.exports = function extend() {
		'use strict';
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0],
			i = 1,
			length = arguments.length,
			deep = false;

		// Handle a deep copy situation
		if (typeof target === 'boolean') {
			deep = target;
			target = arguments[1] || {};
			// skip the boolean and the target
			i = 2;
		} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
			target = {};
		}

		for (; i < length; ++i) {
			options = arguments[i];
			// Only deal with non-null/undefined values
			if (options != null) {
				// Extend the base object
				for (name in options) {
					src = target[name];
					copy = options[name];

					// Prevent never-ending loop
					if (target === copy) {
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && Array.isArray(src) ? src : [];
						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = extend(deep, clone, copy);

					// Don't bring in undefined values
					} else if (copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;
	};



/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var assign        = __webpack_require__(8)
	  , normalizeOpts = __webpack_require__(6)
	  , isCallable    = __webpack_require__(7)
	  , contains      = __webpack_require__(9)

	  , d;

	d = module.exports = function (dscr, value/*, options*/) {
		var c, e, w, options, desc;
		if ((arguments.length < 2) || (typeof dscr !== 'string')) {
			options = value;
			value = dscr;
			dscr = null;
		} else {
			options = arguments[2];
		}
		if (dscr == null) {
			c = w = true;
			e = false;
		} else {
			c = contains.call(dscr, 'c');
			e = contains.call(dscr, 'e');
			w = contains.call(dscr, 'w');
		}

		desc = { value: value, configurable: c, enumerable: e, writable: w };
		return !options ? desc : assign(normalizeOpts(options), desc);
	};

	d.gs = function (dscr, get, set/*, options*/) {
		var c, e, options, desc;
		if (typeof dscr !== 'string') {
			options = set;
			set = get;
			get = dscr;
			dscr = null;
		} else {
			options = arguments[3];
		}
		if (get == null) {
			get = undefined;
		} else if (!isCallable(get)) {
			options = get;
			get = set = undefined;
		} else if (set == null) {
			set = undefined;
		} else if (!isCallable(set)) {
			options = set;
			set = undefined;
		}
		if (dscr == null) {
			c = true;
			e = false;
		} else {
			c = contains.call(dscr, 'c');
			e = contains.call(dscr, 'e');
		}

		desc = { get: get, set: set, configurable: c, enumerable: e };
		return !options ? desc : assign(normalizeOpts(options), desc);
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (fn) {
		if (typeof fn !== 'function') throw new TypeError(fn + " is not a function");
		return fn;
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var forEach = Array.prototype.forEach, create = Object.create;

	var process = function (src, obj) {
		var key;
		for (key in src) obj[key] = src[key];
	};

	module.exports = function (options/*, …options*/) {
		var result = create(null);
		forEach.call(arguments, function (options) {
			if (options == null) return;
			process(Object(options), result);
		});
		return result;
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	// Deprecated

	'use strict';

	module.exports = function (obj) { return typeof obj === 'function'; };


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(10)()
		? Object.assign
		: __webpack_require__(11);


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(12)()
		? String.prototype.contains
		: __webpack_require__(13);


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function () {
		var assign = Object.assign, obj;
		if (typeof assign !== 'function') return false;
		obj = { foo: 'raz' };
		assign(obj, { bar: 'dwa' }, { trzy: 'trzy' });
		return (obj.foo + obj.bar + obj.trzy) === 'razdwatrzy';
	};


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var keys  = __webpack_require__(15)
	  , value = __webpack_require__(14)

	  , max = Math.max;

	module.exports = function (dest, src/*, …srcn*/) {
		var error, i, l = max(arguments.length, 2), assign;
		dest = Object(value(dest));
		assign = function (key) {
			try { dest[key] = src[key]; } catch (e) {
				if (!error) error = e;
			}
		};
		for (i = 1; i < l; ++i) {
			src = arguments[i];
			keys(src).forEach(assign);
		}
		if (error !== undefined) throw error;
		return dest;
	};


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var str = 'razdwatrzy';

	module.exports = function () {
		if (typeof str.contains !== 'function') return false;
		return ((str.contains('dwa') === true) && (str.contains('foo') === false));
	};


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var indexOf = String.prototype.indexOf;

	module.exports = function (searchString/*, position*/) {
		return indexOf.call(this, searchString, arguments[1]) > -1;
	};


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (value) {
		if (value == null) throw new TypeError("Cannot use null or undefined");
		return value;
	};


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(16)()
		? Object.keys
		: __webpack_require__(17);


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function () {
		try {
			Object.keys('primitive');
			return true;
		} catch (e) { return false; }
	};


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var keys = Object.keys;

	module.exports = function (object) {
		return keys(object == null ? object : Object(object));
	};


/***/ }
/******/ ])
});
;
>>>>>>> 5f57db948da10b8fe315fea167f1bf83a95344d3
