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
   * Get position and dimension information for a DOM node
   *
   * @param {Object} node DOM node we want to get data for
   * @return {Object} Dom node ClientRect bound data
   */
  getBounds: function(node) {
    var bounds = node.getBoundingClientRect();

    // older versions of some browsers do not ship width / height
    if (!bounds.hasOwnProperty('width') || !bounds.hasOwnProperty('height')) {
      bounds.width = node.offsetWidth;
      bounds.height = node.offsetHeight;
    }

    return bounds;
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
