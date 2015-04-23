/*! Friend.js v0.1.0 :: by Brandon Pierce (brandon@brandonjpierce.com) MIT */
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