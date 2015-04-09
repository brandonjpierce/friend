module.exports = {

  /**
   * Simple debounce function we use for window resizing
   *
   * @source https://gist.github.com/vincentorback/9649034
   *
   * @param  {Function} func The function we want to execute after debounce
   * @param  {Number} threshold Time until the function can be called again
   * @param  {Boolean} execAsap Execute function immediatialy when debounce called?
   */
  debounce: function(func, threshold, execAsap) {
    var timeout;

    return function debounced() {
      var obj = this;
      var args = Array.prototype.slice.apply(arguments);

      function delayed () {
        if (!execAsap) {
          func.apply(obj, args);
        }

        timeout = null;
      }

      if (timeout) {
        clearTimeout(timeout);
      } else if (execAsap) {
        func.apply(obj, args);
      }

      timeout = setTimeout(delayed, threshold);
    };
  },

  /**
   * Event capturing for css transitions
   *
   * @param {Object} obj DOM node you want to attach event to
   * @param {Function} fn Callback func for event
   */
  onAnimationEnd: function(obj, fn) {
    var prefixes = ['webkit', 'moz', 'MS', 'o', ''];
    var e = 'TransitionEnd';

    for (var i = 0, len = prefixes.length; i !== len; i++) {
      if (!prefixes[i]) {
        e = e.toLowerCase();
      }

      this.addEvent(obj, prefixes[i] + e, fn);
    }
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
  getStyle: function(node, styleProp) {
    var style = null;

    if (node && node.nodeType === 1) {
    	if (node.currentStyle) {
    		style = node.currentStyle[styleProp];
    	} else if (window.getComputedStyle) {
    		style = document.defaultView
          .getComputedStyle(node, null)
          .getPropertyValue(styleProp);
      }
    }

  	return style;
  },

  /**
   * Get an array of scrollable parents for a particular node
   *
   * @param {Object} node DOM node
   */
  getScrollParents: function(node) {
    var positionType = this.getStyle(node, 'position');
    var parentNode = node.parentNode;
    var parents = [];

    if (positionType === 'fixed') {
      parents.push(node);
      return parents;
    }

    while (parentNode) {
      var overflow = this.getStyle(parentNode, 'overflow');
      var overflowY = this.getStyle(parentNode, 'overflowY');
      var overflowX = this.getStyle(parentNode, 'overflowX');
      var parentPositionType = this.getStyle(parentNode, 'position');

      var regTest = /(auto|scroll)/;
      var regValue = overflow + overflowY + overflowX;

      if (regTest.test(regValue)) {
        if (positionType !== 'absolute' ||
           (
             parentPositionType === 'relative' ||
             parentPositionType === 'absolute' ||
             parentPositionType === 'fixed'
           )
        ) {
          parents.push(parentNode);
        }
      }

      parentNode = parentNode.parentNode;
    }

    parents.push(document);

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
    var domPrefixes = 'Webkit Moz ms O'.split(' ');
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
