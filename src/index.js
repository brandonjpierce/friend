/**
 * TODO
 *
 * 1. setup a small caching system so we can reduce our position() calls
 */

/**
 * Dependencies
 */
var EventEmitter = require('event-emitter');
var extend = require('extend');
var utils = require('utils');

/**
 * Localize some utils vars
 */
var transformsSupported = utils.cssTransformSupported();
var vendorPrefix = utils.getVendorPrefix().lowercase;

/**
 * Default options
 */
var DEFAULTS = {
  enabled: true,
  transforms: transformsSupported,
  animate: false,
  animationDuration: '100ms',
  animationEasing: 'cubic-bezier(0.55,0,0.1,1)',
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
  this._initialized = false;
  this._transformName = vendorPrefix + 'Transform';
  this._transitionName = vendorPrefix + 'Transition';
  this._defaults = DEFAULTS;
  this._options = extend({}, DEFAULTS, options);

  this.element = {};
  this.target = {};

  // throttle our position method to improve performance
  var positionFn = this.position.bind(this);
  this._positionFn = this._options.throttle ?
    utils.throttle(positionFn, this._options.throttleSpeed) :
    positionFn;

  if (this._options.enabled) {
    this.enable();
  }

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
  if (!this._initialized) {
    this._findNodes();
  }

  // setup initial styles and handlers
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
  this._resetCSS();
  this._disableHandlers();

  // let friend know were disabled
  this._enabled = false;
  this.emit(EVENTS.disabled);

  return this;
};

/**
 * Setup event handlers
 *
 * @api private
 */
Friend.prototype._enableHandlers = function() {
  // this will handle nested scroll elements
  this.target.scrollParents.forEach(function(node) {
    utils.addEvent(node, 'scroll', this._positionFn);
  }, this);

  utils.addEvent(this.target.node, 'friend:' + EVENTS.positioned, this._positionFn);
  utils.addEvent(window, 'resize', this._positionFn);
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
  utils.removeEvent(this.target.node, 'friend:' + EVENTS.positioned, this._positionFn);
};

/**
 * Reset elements CSS styles back to initial state
 *
 * @api private
 */
Friend.prototype._resetCSS = function() {
  var css = {
    position: this.element.initialStyles.position,
    left: this.element.initialStyles.left,
    top: this.element.initialStyles.top
  };

  if (this._options.transforms && transformsSupported) {
    css[this._transformName] = null;
  }

  if (this._options.animate) {
    css[this._transitionName] = null;
  }

  for (var key in css) {
    if (css.hasOwnProperty(key)) {
      this.element.node.style[key] = css[key];
    }
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

  this.element.node = utils.getDomNode(element);
  this.target.node = utils.getDomNode(target);
  this.target.scrollParents = utils.getScrollParents(this.target.node);
  this.element.initialStyles = this._getInitialStyles();

  this._moveElement();
  this._initialized = true;
  this.emit(EVENTS.initialized);
};

/**
 * Move element into the body
 *
 * @api private
 */
Friend.prototype._moveElement = function() {
  // remove node from its current position and insert into the body. This is
  // needed to allow position: absolute to work within relative scroll containers
  if (this.element.node.parentNode.tagName !== 'BODY') {
    this.element.node.parentNode.removeChild(this.element.node);
    document.body.appendChild(this.element.node);
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
    left: 0,
    top: 0
  };

  if (this._options.animate) {
    var easing = this._options.animationEasing;
    var duration = this._options.animationDuration;
    var animStyle = duration + ' ' + easing;
    var anim = null;

    if (this._options.transforms && transformsSupported) {
      anim = 'transform ' + ' ' + animStyle;
    } else {
      anim = 'left ' + animStyle + ', top ' + animStyle;
    }

    css[this._transitionName] = anim;
  }

  for (var key in css) {
    if (css.hasOwnProperty(key)) {
      this.element.node.style[key] = css[key];
    }
  }

  this._initalStylesSet = true;
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
    css[this._transformName] = transformValue.join(' ');
  } else {
    css.left = leftPoint + 'px';
    css.top = topPoint + 'px';
  }

  for (var key in css) {
    if (css.hasOwnProperty(key)) {
      this.element.node.style[key] = css[key];
    }
  }

  // If our items are animating only call our positioning event after they
  // have successfully been positioned
  if (this._options.animate) {
    utils.onAnimationEnd(this.element.node, function() {
      utils.triggerEvent(this.element.node, 'friend:' + EVENTS.positioned);
    }.bind(this));
  } else {
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
  var bounds = {};
  var clientRect = element.getBoundingClientRect();

  for (var key in clientRect) {
    if (clientRect.hasOwnProperty(key)) {
      bounds[key] = clientRect[key];
    }
  }

  // older versions of some browsers do not ship width / height
  if (!bounds.hasOwnProperty('width') || !bounds.hasOwnProperty('height')) {
    bounds.width = element.offsetWidth;
    bounds.height = element.offsetHeight;
  }

  return bounds;
};

/**
 * Grab attachment information for our element
 *
 * @return {Object} Attachment point and side values
 * @api private
 */
Friend.prototype._getElementAttachment = function() {
  var bounds = this.element.bounds = this._getBounds(this.element.node);
  var attachments = this._options.element.attach;
  var offset = this._options.element.offset || [0, 0];
  var points = {};
  var x = attachments[0];
  var y = attachments[1];

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

  this.element.attachment = points;

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
  var bounds = this.target.bounds = this._getBounds(this.target.node);
  var attachments = this._options.target.attach || this._options.element.attach;
  var points = {};
  var x = attachments[0];
  var y = attachments[1];

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

  points.left = xValues[x] + offsetX;
  points.top = yValues[y] + offsetY;

  this.target.attachment = points;

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
