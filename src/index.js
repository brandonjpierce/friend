/**
 * TODO
 *
 * 1. handle event handlers if Friend is constructed with enabled to false
 */

/**
 * Dependencies
 */
var EventEmitter = require('event-emitter');
var extend = require('extend');
var utils = require('utils');

/**
 * Default options
 */
var DEFAULTS = {
  enabled: true,
  transforms: true,
  animate: false,
  animationDelay: '100ms',
  animationEasing: 'cubic-bezier(0.55,0,0.1,1)',
  debounceThreshold: 0,
};

/**
 * Friend constructor
 *
 * @param {Object} options Options we want to pass to the constructor
 * @return {Object} Friend instance
 */
function Friend(options) {
  var vendorPrefix = utils.getVendorPrefix().lowercase;

  this._transformName = vendorPrefix + 'Transform';
  this._transitionName = vendorPrefix + 'Transition';
  this._transformSupported = utils.cssTransformSupported();
  this._defaults = DEFAULTS;
  this._options = extend({}, DEFAULTS, options);

  this.element = {};
  this.target = {};

  // debounce our position method to improve performance
  this._debounced = utils.debounce(
    this.position.bind(this),
    this._options.debounceThreshold,
    true
  );

  if (this._options.enabled) {
    this.enable();
  }

  console.log(this);

  return this;
}

EventEmitter(Friend.prototype);

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
  this.emit('positioning');

  if (!this._enabled) {
    this.enable();
  } else {
    this._findNodes();
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
    this.positionAfter();
  }

  return this;
};

/**
 * Enable Friend and setup event handlers
 *
 * @return {Friend}
 */
Friend.prototype.enable = function() {
  this._enabled = true;
  this._findNodes();
  this._enableHandlers();
  this._nextTick(this._attachElements);

  this.emit('intialized');

  return this;
};

/**
 * Disable Friend and remove event handlers
 *
 * @return {Friend}
 */
Friend.prototype.disable = function() {
  var css = {
    position: this.element.initialStyles.position,
    left: this.element.initialStyles.left,
    top: this.element.initialStyles.top
  };

  if (this._options.transforms && this._transformSupported) {
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

  this.target.scrollParents.forEach(function(node) {
    utils.removeEvent(node, 'scroll', this._debounced);
  }, this);

  utils.removeEvent(window, 'resize', this._debounced);
  utils.removeEvent(this.target.node, 'friend:positioning', this._debounced);

  this._initalStylesSet = false;

  return this;
};

Friend.prototype._enableHandlers = function() {
  // this will handle nested scroll elements
  this.target.scrollParents.forEach(function(node) {
    utils.addEvent(node, 'scroll', this._debounced);
  }, this);

  utils.addEvent(this.target.node, 'friend:positioning', this._debounced);
  utils.addEvent(window, 'resize', this._debounced);
};

/**
 * Find our element and target nodes in the DOM
 *
 * @api private
 */
Friend.prototype._findNodes = function() {
  var element = this._options.element.selector;
  var target = this._options.target.selector;

  if (!this.element.hasOwnProperty('node')) {
    this.element.node = utils.getDomNode(element);
  }

  if (!this.target.hasOwnProperty('node')) {
    this.target.node = utils.getDomNode(target);
  }

  if (!this.target.hasOwnProperty('scrollParent')) {
    this.target.scrollParents = utils.getScrollParents(this.target.node);
  }

  if (!this.element.hasOwnProperty('initialStyles')) {
    this.element.initialStyles = this._getInitialStyles();
  }

  if (!this._initalStylesSet) {
    this._setFriendStyles();
  }
};

/**
 *
 */

Friend.prototype._getInitialStyles = function() {
  return {
    position: utils.getStyle(this.element.node, 'position'),
    left: utils.getStyle(this.element.node, 'left') || 0,
    top: utils.getStyle(this.element.node, 'top') || 0
  };
};

/**
 * Initially stick element in top left corner to allow itself to position
 * correctly as well as give it the appropriate position attribute.
 *
 * @api private
 */
Friend.prototype._setFriendStyles = function() {
  var positionType = utils.getStyle(this.target.node, 'position');

  var css = {
    position: positionType === 'fixed' ? positionType : 'absolute',
    left: 0,
    top: 0
  };

  if (this._options.animate) {
    if (this._options.transforms && this._transformSupported) {
       css[this._transitionName] = 'transform ' + this._options.animationDelay +
        ' ' + this._options.animationEasing;
    } else {
      css[this._transitionName] = 'left ' + this._options.animationDelay + ' ' +
        this._options.animationEasing + ', top ' + this._options.animationDelay +
        ' ' + this._options.animationEasing;
    }
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
  var targetAttach = this._getTargetAttachment().points;
  var elementAttach = this._getElementAttachment().points;
  var leftPoint = targetAttach.left - elementAttach.left;
  var topPoint = targetAttach.top - elementAttach.top;
  var css = {};

  var transformValue = [
    'translateZ(0)',
    'translateX(' + leftPoint + 'px)',
    'translateY(' + topPoint + 'px)'
  ];

  if (this._options.transforms && this._transformSupported) {
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
      utils.triggerEvent(this.element.node, 'friend:positioning');
    }.bind(this));
  } else {
    utils.triggerEvent(this.element.node, 'friend:positioning');
  }

  this.emit('positioned');
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
  var documentEl = document.documentElement;

  for (var key in clientRect) {
    if (clientRect.hasOwnProperty(key)) {
      bounds[key] = clientRect[key];
    }
  }

  bounds.top +=
    (window.pageYOffset || documentEl.scrollTop) -
    (documentEl.clientTop  || 0);

  bounds.left +=
    (window.pageXOffset || documentEl.scrollLeft) -
    (documentEl.clientLeft  || 0);

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
  var data = { points: {} };
  var x = data.x = attachments[0];
  var y = data.y = attachments[1];

  switch (x) {
    case 'left':
      data.points.left = 0 - offset[0];
      break;
    case 'middle':
      data.points.left = (bounds.width / 2) + offset[0];
      break;
    case 'right':
      data.points.left = bounds.width + offset[0];
      break;
    default:
      throw new Error('X axis attachment point for element object is inavalid');
  }

  switch (y) {
    case 'top':
      data.points.top = 0 + offset[1];
      break;
    case 'middle':
      data.points.top = (bounds.height / 2) + offset[1];
      break;
    case 'bottom':
      data.points.top = bounds.height - offset[1];
      break;
    default:
      throw new Error('Y axis attachment point for element object is inavalid');
  }

  this.element.attachment = data.points;

  return data;
};

/**
 * Grab attachment information for our target
 *
 * @return {Object} Attachment point and side values
 * @api private
 */
Friend.prototype._getTargetAttachment = function() {
  var bounds = this.target.bounds = this._getBounds(this.target.node);
  var attachments = this._options.target.attach;
  var data = { points: {} };
  var x = data.x = attachments[0];
  var y = data.y = attachments[1];

  switch (x) {
    case 'left':
      data.points.left = bounds.left;
      break;
    case 'middle':
      data.points.left = bounds.left + (bounds.width / 2);
      break;
    case 'right':
      data.points.left = bounds.right;
      break;
    default:
      throw new Error('X axis attachment point for target object is inavalid');
  }

  switch (y) {
    case 'top':
      data.points.top = bounds.top;
      break;
    case 'middle':
      data.points.top = bounds.top + (bounds.height / 2);
      break;
    case 'bottom':
      data.points.top = bounds.bottom;
      break;
    default:
      throw new Error('Y axis attachment point for target object is inavalid');
  }

  this.target.attachment = data.points;

  return data;
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
