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
var transformName = vendorPrefix + 'Transform';

/**
 * Default options
 */
var DEFAULTS = {
  enabled: true,
  transforms: transformsSupported,
  throttle: false,
  throttleSpeed: 200,
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
  this.cache = { left: null, top: null };
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
};

/**
 * Find our element and target nodes in the DOM
 *
 * @api private
 */
Friend.prototype._findNodes = function() {
  var element = this._options.elementSelector;
  var target = this._options.targetSelector;

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

  if (this.cache.left !== leftPoint || this.cache.top !== topPoint) {
    this.cache.left = leftPoint;
    this.cache.top = topPoint;
  } else {
    return;
  }

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

  this.emit(EVENTS.positioned);
};

/**
 * Grab attachment information for our element
 *
 * @return {Object} Attachment point and side values
 * @api private
 */
Friend.prototype._getElementAttachment = function() {
  var bounds = utils.getBounds(this.element.node);
  var attachments = this._options.elementAttach;
  var offset = this._options.elementOffset || [0, 0];
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
  var bounds = utils.getBounds(this.target.node);
  var attachments = this._options.targetAttach || this._options.elementAttach;
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

  // account for scroll offset
  points.left = xValues[x] + offsetX;
  points.top = yValues[y] + offsetY;

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
