
(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
      typeof define === 'function' && define.amd ? define(factory) :
         (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Swiper = factory());
}(this, (function () {
   'use strict';

   /* eslint-disable no-param-reassign */
   function isObject$1(obj) {
      return obj !== null && typeof obj === 'object' && 'constructor' in obj && obj.constructor === Object;
   }

   function extend$1(target = {}, src = {}) {
      Object.keys(src).forEach(key => {
         if (typeof target[key] === 'undefined') target[key] = src[key]; else if (isObject$1(src[key]) && isObject$1(target[key]) && Object.keys(src[key]).length > 0) {
            extend$1(target[key], src[key]);
         }
      });
   }

   const ssrDocument = {
      body: {},

      addEventListener() { },

      removeEventListener() { },

      activeElement: {
         blur() { },

         nodeName: ''
      },

      querySelector() {
         return null;
      },

      querySelectorAll() {
         return [];
      },

      getElementById() {
         return null;
      },

      createEvent() {
         return {
            initEvent() { }

         };
      },

      createElement() {
         return {
            children: [],
            childNodes: [],
            style: {},

            setAttribute() { },

            getElementsByTagName() {
               return [];
            }

         };
      },

      createElementNS() {
         return {};
      },

      importNode() {
         return null;
      },

      location: {
         hash: '',
         host: '',
         hostname: '',
         href: '',
         origin: '',
         pathname: '',
         protocol: '',
         search: ''
      }
   };

   function getDocument() {
      const doc = typeof document !== 'undefined' ? document : {};
      extend$1(doc, ssrDocument);
      return doc;
   }

   const ssrWindow = {
      document: ssrDocument,
      navigator: {
         userAgent: ''
      },
      location: {
         hash: '',
         host: '',
         hostname: '',
         href: '',
         origin: '',
         pathname: '',
         protocol: '',
         search: ''
      },
      history: {
         replaceState() { },

         pushState() { },

         go() { },

         back() { }

      },
      CustomEvent: function CustomEvent() {
         return this;
      },

      addEventListener() { },

      removeEventListener() { },

      getComputedStyle() {
         return {
            getPropertyValue() {
               return '';
            }

         };
      },

      Image() { },

      Date() { },

      screen: {},

      setTimeout() { },

      clearTimeout() { },

      matchMedia() {
         return {};
      },

      requestAnimationFrame(callback) {
         if (typeof setTimeout === 'undefined') {
            callback();
            return null;
         }

         return setTimeout(callback, 0);
      },

      cancelAnimationFrame(id) {
         if (typeof setTimeout === 'undefined') {
            return;
         }

         clearTimeout(id);
      }

   };

   function getWindow() {
      const win = typeof window !== 'undefined' ? window : {};
      extend$1(win, ssrWindow);
      return win;
   }

   /**
    * Dom7 4.0.0
    * Minimalistic JavaScript library for DOM manipulation, with a jQuery-compatible API
    * https://framework7.io/docs/dom7.html
    *
    * Copyright 2021, Vladimir Kharlampidi
    *
    * Licensed under MIT
    *
    * Released on: August 25, 2021
    */
   /* eslint-disable no-proto */

   function makeReactive(obj) {
      const proto = obj.__proto__;
      Object.defineProperty(obj, '__proto__', {
         get() {
            return proto;
         },

         set(value) {
            proto.__proto__ = value;
         }

      });
   }

   class Dom7 extends Array {
      constructor(items) {
         super(...(items || []));
         makeReactive(this);
      }

   }

   function arrayFlat(arr = []) {
      const res = [];
      arr.forEach(el => {
         if (Array.isArray(el)) {
            res.push(...arrayFlat(el));
         } else {
            res.push(el);
         }
      });
      return res;
   }

   function arrayFilter(arr, callback) {
      return Array.prototype.filter.call(arr, callback);
   }

   function arrayUnique(arr) {
      const uniqueArray = [];

      for (let i = 0; i < arr.length; i += 1) {
         if (uniqueArray.indexOf(arr[i]) === -1) uniqueArray.push(arr[i]);
      }

      return uniqueArray;
   }


   function qsa(selector, context) {
      if (typeof selector !== 'string') {
         return [selector];
      }

      const a = [];
      const res = context.querySelectorAll(selector);

      for (let i = 0; i < res.length; i += 1) {
         a.push(res[i]);
      }

      return a;
   }

   function $(selector, context) {
      const window = getWindow();
      const document = getDocument();
      let arr = [];

      if (!context && selector instanceof Dom7) {
         return selector;
      }

      if (!selector) {
         return new Dom7(arr);
      }

      if (typeof selector === 'string') {
         const html = selector.trim();

         if (html.indexOf('<') >= 0 && html.indexOf('>') >= 0) {
            let toCreate = 'div';
            if (html.indexOf('<li') === 0) toCreate = 'ul';
            if (html.indexOf('<tr') === 0) toCreate = 'tbody';
            if (html.indexOf('<td') === 0 || html.indexOf('<th') === 0) toCreate = 'tr';
            if (html.indexOf('<tbody') === 0) toCreate = 'table';
            if (html.indexOf('<option') === 0) toCreate = 'select';
            const tempParent = document.createElement(toCreate);
            tempParent.innerHTML = html;

            for (let i = 0; i < tempParent.childNodes.length; i += 1) {
               arr.push(tempParent.childNodes[i]);
            }
         } else {
            arr = qsa(selector.trim(), context || document);
         } // arr = qsa(selector, document);

      } else if (selector.nodeType || selector === window || selector === document) {
         arr.push(selector);
      } else if (Array.isArray(selector)) {
         if (selector instanceof Dom7) return selector;
         arr = selector;
      }

      return new Dom7(arrayUnique(arr));
   }

   $.fn = Dom7.prototype; // eslint-disable-next-line

   function addClass(...classes) {
      const classNames = arrayFlat(classes.map(c => c.split(' ')));
      this.forEach(el => {
         el.classList.add(...classNames);
      });
      return this;
   }

   function removeClass(...classes) {
      const classNames = arrayFlat(classes.map(c => c.split(' ')));
      this.forEach(el => {
         el.classList.remove(...classNames);
      });
      return this;
   }

   function toggleClass(...classes) {
      const classNames = arrayFlat(classes.map(c => c.split(' ')));
      this.forEach(el => {
         classNames.forEach(className => {
            el.classList.toggle(className);
         });
      });
   }

   function hasClass(...classes) {
      const classNames = arrayFlat(classes.map(c => c.split(' ')));
      return arrayFilter(this, el => {
         return classNames.filter(className => el.classList.contains(className)).length > 0;
      }).length > 0;
   }

   function attr(attrs, value) {
      if (arguments.length === 1 && typeof attrs === 'string') {
         // Get attr
         if (this[0]) return this[0].getAttribute(attrs);
         return undefined;
      } // Set attrs


      for (let i = 0; i < this.length; i += 1) {
         if (arguments.length === 2) {
            // String
            this[i].setAttribute(attrs, value);
         } else {
            // Object
            for (const attrName in attrs) {
               this[i][attrName] = attrs[attrName];
               this[i].setAttribute(attrName, attrs[attrName]);
            }
         }
      }

      return this;
   }

   function removeAttr(attr) {
      for (let i = 0; i < this.length; i += 1) {
         this[i].removeAttribute(attr);
      }

      return this;
   }

   function transform(transform) {
      for (let i = 0; i < this.length; i += 1) {
         this[i].style.transform = transform;
      }

      return this;
   }

   function transition$1(duration) {
      for (let i = 0; i < this.length; i += 1) {
         this[i].style.transitionDuration = typeof duration !== 'string' ? `${duration}ms` : duration;
      }

      return this;
   }

   function on(...args) {
      let [eventType, targetSelector, listener, capture] = args;

      if (typeof args[1] === 'function') {
         [eventType, listener, capture] = args;
         targetSelector = undefined;
      }

      if (!capture) capture = false;

      function handleLiveEvent(e) {
         const target = e.target;
         if (!target) return;
         const eventData = e.target.dom7EventData || [];

         if (eventData.indexOf(e) < 0) {
            eventData.unshift(e);
         }

         if ($(target).is(targetSelector)) listener.apply(target, eventData); else {
            const parents = $(target).parents(); // eslint-disable-line

            for (let k = 0; k < parents.length; k += 1) {
               if ($(parents[k]).is(targetSelector)) listener.apply(parents[k], eventData);
            }
         }
      }

      function handleEvent(e) {
         const eventData = e && e.target ? e.target.dom7EventData || [] : [];

         if (eventData.indexOf(e) < 0) {
            eventData.unshift(e);
         }

         listener.apply(this, eventData);
      }

      const events = eventType.split(' ');
      let j;

      for (let i = 0; i < this.length; i += 1) {
         const el = this[i];

         if (!targetSelector) {
            for (j = 0; j < events.length; j += 1) {
               const event = events[j];
               if (!el.dom7Listeners) el.dom7Listeners = {};
               if (!el.dom7Listeners[event]) el.dom7Listeners[event] = [];
               el.dom7Listeners[event].push({
                  listener,
                  proxyListener: handleEvent
               });
               el.addEventListener(event, handleEvent, capture);
            }
         } else {
            // Live events
            for (j = 0; j < events.length; j += 1) {
               const event = events[j];
               if (!el.dom7LiveListeners) el.dom7LiveListeners = {};
               if (!el.dom7LiveListeners[event]) el.dom7LiveListeners[event] = [];
               el.dom7LiveListeners[event].push({
                  listener,
                  proxyListener: handleLiveEvent
               });
               el.addEventListener(event, handleLiveEvent, capture);
            }
         }
      }

      return this;
   }

   function off(...args) {
      let [eventType, targetSelector, listener, capture] = args;

      if (typeof args[1] === 'function') {
         [eventType, listener, capture] = args;
         targetSelector = undefined;
      }

      if (!capture) capture = false;
      const events = eventType.split(' ');

      for (let i = 0; i < events.length; i += 1) {
         const event = events[i];

         for (let j = 0; j < this.length; j += 1) {
            const el = this[j];
            let handlers;

            if (!targetSelector && el.dom7Listeners) {
               handlers = el.dom7Listeners[event];
            } else if (targetSelector && el.dom7LiveListeners) {
               handlers = el.dom7LiveListeners[event];
            }

            if (handlers && handlers.length) {
               for (let k = handlers.length - 1; k >= 0; k -= 1) {
                  const handler = handlers[k];

                  if (listener && handler.listener === listener) {
                     el.removeEventListener(event, handler.proxyListener, capture);
                     handlers.splice(k, 1);
                  } else if (listener && handler.listener && handler.listener.dom7proxy && handler.listener.dom7proxy === listener) {
                     el.removeEventListener(event, handler.proxyListener, capture);
                     handlers.splice(k, 1);
                  } else if (!listener) {
                     el.removeEventListener(event, handler.proxyListener, capture);
                     handlers.splice(k, 1);
                  }
               }
            }
         }
      }

      return this;
   }

   function trigger(...args) {
      const window = getWindow();
      const events = args[0].split(' ');
      const eventData = args[1];

      for (let i = 0; i < events.length; i += 1) {
         const event = events[i];

         for (let j = 0; j < this.length; j += 1) {
            const el = this[j];

            if (window.CustomEvent) {
               const evt = new window.CustomEvent(event, {
                  detail: eventData,
                  bubbles: true,
                  cancelable: true
               });
               el.dom7EventData = args.filter((data, dataIndex) => dataIndex > 0);
               el.dispatchEvent(evt);
               el.dom7EventData = [];
               delete el.dom7EventData;
            }
         }
      }

      return this;
   }

   function transitionEnd$1(callback) {
      const dom = this;

      function fireCallBack(e) {
         if (e.target !== this) return;
         callback.call(this, e);
         dom.off('transitionend', fireCallBack);
      }

      if (callback) {
         dom.on('transitionend', fireCallBack);
      }

      return this;
   }

   function outerWidth(includeMargins) {
      if (this.length > 0) {
         if (includeMargins) {
            const styles = this.styles();
            return this[0].offsetWidth + parseFloat(styles.getPropertyValue('margin-right')) + parseFloat(styles.getPropertyValue('margin-left'));
         }

         return this[0].offsetWidth;
      }

      return null;
   }

   function outerHeight(includeMargins) {
      if (this.length > 0) {
         if (includeMargins) {
            const styles = this.styles();
            return this[0].offsetHeight + parseFloat(styles.getPropertyValue('margin-top')) + parseFloat(styles.getPropertyValue('margin-bottom'));
         }

         return this[0].offsetHeight;
      }

      return null;
   }

   function offset() {
      if (this.length > 0) {
         const window = getWindow();
         const document = getDocument();
         const el = this[0];
         const box = el.getBoundingClientRect();
         const body = document.body;
         const clientTop = el.clientTop || body.clientTop || 0;
         const clientLeft = el.clientLeft || body.clientLeft || 0;
         const scrollTop = el === window ? window.scrollY : el.scrollTop;
         const scrollLeft = el === window ? window.scrollX : el.scrollLeft;
         return {
            top: box.top + scrollTop - clientTop,
            left: box.left + scrollLeft - clientLeft
         };
      }

      return null;
   }

   function styles() {
      const window = getWindow();
      if (this[0]) return window.getComputedStyle(this[0], null);
      return {};
   }

   function css(props, value) {
      const window = getWindow();
      let i;

      if (arguments.length === 1) {
         if (typeof props === 'string') {
            // .css('width')
            if (this[0]) return window.getComputedStyle(this[0], null).getPropertyValue(props);
         } else {
            // .css({ width: '100px' })
            for (i = 0; i < this.length; i += 1) {
               for (const prop in props) {
                  this[i].style[prop] = props[prop];
               }
            }

            return this;
         }
      }

      if (arguments.length === 2 && typeof props === 'string') {
         // .css('width', '100px')
         for (i = 0; i < this.length; i += 1) {
            this[i].style[props] = value;
         }

         return this;
      }

      return this;
   }

   function each(callback) {
      if (!callback) return this;
      this.forEach((el, index) => {
         callback.apply(el, [el, index]);
      });
      return this;
   }

   function filter(callback) {
      const result = arrayFilter(this, callback);
      return $(result);
   }

   function html(html) {
      if (typeof html === 'undefined') {
         return this[0] ? this[0].innerHTML : null;
      }

      for (let i = 0; i < this.length; i += 1) {
         this[i].innerHTML = html;
      }

      return this;
   }

   function text(text) {
      if (typeof text === 'undefined') {
         return this[0] ? this[0].textContent.trim() : null;
      }

      for (let i = 0; i < this.length; i += 1) {
         this[i].textContent = text;
      }

      return this;
   }

   function is(selector) {
      const window = getWindow();
      const document = getDocument();
      const el = this[0];
      let compareWith;
      let i;
      if (!el || typeof selector === 'undefined') return false;

      if (typeof selector === 'string') {
         if (el.matches) return el.matches(selector);
         if (el.webkitMatchesSelector) return el.webkitMatchesSelector(selector);
         if (el.msMatchesSelector) return el.msMatchesSelector(selector);
         compareWith = $(selector);

         for (i = 0; i < compareWith.length; i += 1) {
            if (compareWith[i] === el) return true;
         }

         return false;
      }

      if (selector === document) {
         return el === document;
      }

      if (selector === window) {
         return el === window;
      }

      if (selector.nodeType || selector instanceof Dom7) {
         compareWith = selector.nodeType ? [selector] : selector;

         for (i = 0; i < compareWith.length; i += 1) {
            if (compareWith[i] === el) return true;
         }

         return false;
      }

      return false;
   }

   function index() {
      let child = this[0];
      let i;

      if (child) {
         i = 0; // eslint-disable-next-line

         while ((child = child.previousSibling) !== null) {
            if (child.nodeType === 1) i += 1;
         }

         return i;
      }

      return undefined;
   }

   function eq(index) {
      if (typeof index === 'undefined') return this;
      const length = this.length;

      if (index > length - 1) {
         return $([]);
      }

      if (index < 0) {
         const returnIndex = length + index;
         if (returnIndex < 0) return $([]);
         return $([this[returnIndex]]);
      }

      return $([this[index]]);
   }

   function append(...els) {
      let newChild;
      const document = getDocument();

      for (let k = 0; k < els.length; k += 1) {
         newChild = els[k];

         for (let i = 0; i < this.length; i += 1) {
            if (typeof newChild === 'string') {
               const tempDiv = document.createElement('div');
               tempDiv.innerHTML = newChild;

               while (tempDiv.firstChild) {
                  this[i].appendChild(tempDiv.firstChild);
               }
            } else if (newChild instanceof Dom7) {
               for (let j = 0; j < newChild.length; j += 1) {
                  this[i].appendChild(newChild[j]);
               }
            } else {
               this[i].appendChild(newChild);
            }
         }
      }

      return this;
   }

   function prepend(newChild) {
      const document = getDocument();
      let i;
      let j;

      for (i = 0; i < this.length; i += 1) {
         if (typeof newChild === 'string') {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = newChild;

            for (j = tempDiv.childNodes.length - 1; j >= 0; j -= 1) {
               this[i].insertBefore(tempDiv.childNodes[j], this[i].childNodes[0]);
            }
         } else if (newChild instanceof Dom7) {
            for (j = 0; j < newChild.length; j += 1) {
               this[i].insertBefore(newChild[j], this[i].childNodes[0]);
            }
         } else {
            this[i].insertBefore(newChild, this[i].childNodes[0]);
         }
      }

      return this;
   }

   function next(selector) {
      if (this.length > 0) {
         if (selector) {
            if (this[0].nextElementSibling && $(this[0].nextElementSibling).is(selector)) {
               return $([this[0].nextElementSibling]);
            }

            return $([]);
         }

         if (this[0].nextElementSibling) return $([this[0].nextElementSibling]);
         return $([]);
      }

      return $([]);
   }

   function nextAll(selector) {
      const nextEls = [];
      let el = this[0];
      if (!el) return $([]);

      while (el.nextElementSibling) {
         const next = el.nextElementSibling; // eslint-disable-line

         if (selector) {
            if ($(next).is(selector)) nextEls.push(next);
         } else nextEls.push(next);

         el = next;
      }

      return $(nextEls);
   }

   function prev(selector) {
      if (this.length > 0) {
         const el = this[0];

         if (selector) {
            if (el.previousElementSibling && $(el.previousElementSibling).is(selector)) {
               return $([el.previousElementSibling]);
            }

            return $([]);
         }

         if (el.previousElementSibling) return $([el.previousElementSibling]);
         return $([]);
      }

      return $([]);
   }

   function prevAll(selector) {
      const prevEls = [];
      let el = this[0];
      if (!el) return $([]);

      while (el.previousElementSibling) {
         const prev = el.previousElementSibling; // eslint-disable-line

         if (selector) {
            if ($(prev).is(selector)) prevEls.push(prev);
         } else prevEls.push(prev);

         el = prev;
      }

      return $(prevEls);
   }

   function parent(selector) {
      const parents = []; // eslint-disable-line

      for (let i = 0; i < this.length; i += 1) {
         if (this[i].parentNode !== null) {
            if (selector) {
               if ($(this[i].parentNode).is(selector)) parents.push(this[i].parentNode);
            } else {
               parents.push(this[i].parentNode);
            }
         }
      }

      return $(parents);
   }

   function parents(selector) {
      const parents = []; // eslint-disable-line

      for (let i = 0; i < this.length; i += 1) {
         let parent = this[i].parentNode; // eslint-disable-line

         while (parent) {
            if (selector) {
               if ($(parent).is(selector)) parents.push(parent);
            } else {
               parents.push(parent);
            }

            parent = parent.parentNode;
         }
      }

      return $(parents);
   }

   function closest(selector) {
      let closest = this; // eslint-disable-line

      if (typeof selector === 'undefined') {
         return $([]);
      }

      if (!closest.is(selector)) {
         closest = closest.parents(selector).eq(0);
      }

      return closest;
   }

   function find(selector) {
      const foundElements = [];

      for (let i = 0; i < this.length; i += 1) {
         const found = this[i].querySelectorAll(selector);

         for (let j = 0; j < found.length; j += 1) {
            foundElements.push(found[j]);
         }
      }

      return $(foundElements);
   }

   function children(selector) {
      const children = []; // eslint-disable-line

      for (let i = 0; i < this.length; i += 1) {
         const childNodes = this[i].children;

         for (let j = 0; j < childNodes.length; j += 1) {
            if (!selector || $(childNodes[j]).is(selector)) {
               children.push(childNodes[j]);
            }
         }
      }

      return $(children);
   }

   function remove() {
      for (let i = 0; i < this.length; i += 1) {
         if (this[i].parentNode) this[i].parentNode.removeChild(this[i]);
      }

      return this;
   }

   const Methods = {
      addClass,
      removeClass,
      hasClass,
      toggleClass,
      attr,
      removeAttr,
      transform,
      transition: transition$1,
      on,
      off,
      trigger,
      transitionEnd: transitionEnd$1,
      outerWidth,
      outerHeight,
      styles,
      offset,
      css,
      each,
      html,
      text,
      is,
      index,
      eq,
      append,
      prepend,
      next,
      nextAll,
      prev,
      prevAll,
      parent,
      parents,
      closest,
      find,
      children,
      filter,
      remove
   };
   Object.keys(Methods).forEach(methodName => {
      Object.defineProperty($.fn, methodName, {
         value: Methods[methodName],
         writable: true
      });
   });

   function deleteProps(obj) {
      const object = obj;
      Object.keys(object).forEach(key => {
         try {
            object[key] = null;
         } catch (e) {// no getter for object
         }

         try {
            delete object[key];
         } catch (e) {// something got wrong
         }
      });
   }

   function nextTick(callback, delay = 0) {
      return setTimeout(callback, delay);
   }

   function now() {
      return Date.now();
   }

   function getComputedStyle$1(el) {
      const window = getWindow();
      let style;

      if (window.getComputedStyle) {
         style = window.getComputedStyle(el, null);
      }

      if (!style && el.currentStyle) {
         style = el.currentStyle;
      }

      if (!style) {
         style = el.style;
      }

      return style;
   }

   function getTranslate(el, axis = 'x') {
      const window = getWindow();
      let matrix;
      let curTransform;
      let transformMatrix;
      const curStyle = getComputedStyle$1(el);

      if (window.WebKitCSSMatrix) {
         curTransform = curStyle.transform || curStyle.webkitTransform;

         if (curTransform.split(',').length > 6) {
            curTransform = curTransform.split(', ').map(a => a.replace(',', '.')).join(', ');
         } // Some old versions of Webkit choke when 'none' is passed; pass
         // empty string instead in this case


         transformMatrix = new window.WebKitCSSMatrix(curTransform === 'none' ? '' : curTransform);
      } else {
         transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
         matrix = transformMatrix.toString().split(',');
      }

      if (axis === 'x') {
         // Latest Chrome and webkits Fix
         if (window.WebKitCSSMatrix) curTransform = transformMatrix.m41; // Crazy IE10 Matrix
         else if (matrix.length === 16) curTransform = parseFloat(matrix[12]); // Normal Browsers
         else curTransform = parseFloat(matrix[4]);
      }

      if (axis === 'y') {
         // Latest Chrome and webkits Fix
         if (window.WebKitCSSMatrix) curTransform = transformMatrix.m42; // Crazy IE10 Matrix
         else if (matrix.length === 16) curTransform = parseFloat(matrix[13]); // Normal Browsers
         else curTransform = parseFloat(matrix[5]);
      }

      return curTransform || 0;
   }

   function isObject(o) {
      return typeof o === 'object' && o !== null && o.constructor && Object.prototype.toString.call(o).slice(8, -1) === 'Object';
   }

   function isNode(node) {
      // eslint-disable-next-line
      if (typeof window !== 'undefined' && typeof window.HTMLElement !== 'undefined') {
         return node instanceof HTMLElement;
      }

      return node && (node.nodeType === 1 || node.nodeType === 11);
   }

   function extend(...args) {
      const to = Object(args[0]);
      const noExtend = ['__proto__', 'constructor', 'prototype'];

      for (let i = 1; i < args.length; i += 1) {
         const nextSource = args[i];

         if (nextSource !== undefined && nextSource !== null && !isNode(nextSource)) {
            const keysArray = Object.keys(Object(nextSource)).filter(key => noExtend.indexOf(key) < 0);

            for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
               const nextKey = keysArray[nextIndex];
               const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);

               if (desc !== undefined && desc.enumerable) {
                  if (isObject(to[nextKey]) && isObject(nextSource[nextKey])) {
                     if (nextSource[nextKey].__swiper__) {
                        to[nextKey] = nextSource[nextKey];
                     } else {
                        extend(to[nextKey], nextSource[nextKey]);
                     }
                  } else if (!isObject(to[nextKey]) && isObject(nextSource[nextKey])) {
                     to[nextKey] = {};

                     if (nextSource[nextKey].__swiper__) {
                        to[nextKey] = nextSource[nextKey];
                     } else {
                        extend(to[nextKey], nextSource[nextKey]);
                     }
                  } else {
                     to[nextKey] = nextSource[nextKey];
                  }
               }
            }
         }
      }

      return to;
   }

   function setCSSProperty(el, varName, varValue) {
      el.style.setProperty(varName, varValue);
   }

   function animateCSSModeScroll({
      swiper,
      targetPosition,
      side
   }) {
      const window = getWindow();
      const startPosition = -swiper.translate;
      let startTime = null;
      let time;
      const duration = swiper.params.speed;
      swiper.wrapperEl.style.scrollSnapType = 'none';
      window.cancelAnimationFrame(swiper.cssModeFrameID);
      const dir = targetPosition > startPosition ? 'next' : 'prev';

      const isOutOfBound = (current, target) => {
         return dir === 'next' && current >= target || dir === 'prev' && current <= target;
      };

      const animate = () => {
         time = new Date().getTime();

         if (startTime === null) {
            startTime = time;
         }

         const progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
         const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
         let currentPosition = startPosition + easeProgress * (targetPosition - startPosition);

         if (isOutOfBound(currentPosition, targetPosition)) {
            currentPosition = targetPosition;
         }

         swiper.wrapperEl.scrollTo({
            [side]: currentPosition
         });

         if (isOutOfBound(currentPosition, targetPosition)) {
            swiper.wrapperEl.style.overflow = 'hidden';
            swiper.wrapperEl.style.scrollSnapType = '';
            setTimeout(() => {
               swiper.wrapperEl.style.overflow = '';
               swiper.wrapperEl.scrollTo({
                  [side]: currentPosition
               });
            });
            window.cancelAnimationFrame(swiper.cssModeFrameID);
            return;
         }

         swiper.cssModeFrameID = window.requestAnimationFrame(animate);
      };

      animate();
   }

   let support;

   function calcSupport() {
      const window = getWindow();
      const document = getDocument();
      return {
         smoothScroll: document.documentElement && 'scrollBehavior' in document.documentElement.style,
         touch: !!('ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch),
         passiveListener: function checkPassiveListener() {
            let supportsPassive = false;

            try {
               const opts = Object.defineProperty({}, 'passive', {
                  // eslint-disable-next-line
                  get() {
                     supportsPassive = true;
                  }

               });
               window.addEventListener('testPassiveListener', null, opts);
            } catch (e) {// No support
            }

            return supportsPassive;
         }(),
         gestures: function checkGestures() {
            return 'ongesturestart' in window;
         }()
      };
   }

   function getSupport() {
      if (!support) {
         support = calcSupport();
      }

      return support;
   }

   let deviceCached;

   function calcDevice({
      userAgent
   } = {}) {
      const support = getSupport();
      const window = getWindow();
      const platform = window.navigator.platform;
      const ua = userAgent || window.navigator.userAgent;
      const device = {
         ios: false,
         android: false
      };
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/); // eslint-disable-line

      let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
      const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
      const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
      const windows = platform === 'Win32';
      let macos = platform === 'MacIntel'; // iPadOs 13 fix

      const iPadScreens = ['1024x1366', '1366x1024', '834x1194', '1194x834', '834x1112', '1112x834', '768x1024', '1024x768', '820x1180', '1180x820', '810x1080', '1080x810'];

      if (!ipad && macos && support.touch && iPadScreens.indexOf(`${screenWidth}x${screenHeight}`) >= 0) {
         ipad = ua.match(/(Version)\/([\d.]+)/);
         if (!ipad) ipad = [0, 1, '13_0_0'];
         macos = false;
      } // Android


      if (android && !windows) {
         device.os = 'android';
         device.android = true;
      }

      if (ipad || iphone || ipod) {
         device.os = 'ios';
         device.ios = true;
      } // Export object


      return device;
   }

   function getDevice(overrides = {}) {
      if (!deviceCached) {
         deviceCached = calcDevice(overrides);
      }

      return deviceCached;
   }

   let browser;

   function calcBrowser() {
      const window = getWindow();

      function isSafari() {
         const ua = window.navigator.userAgent.toLowerCase();
         return ua.indexOf('safari') >= 0 && ua.indexOf('chrome') < 0 && ua.indexOf('android') < 0;
      }

      return {
         isSafari: isSafari(),
         isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window.navigator.userAgent)
      };
   }

   function getBrowser() {
      if (!browser) {
         browser = calcBrowser();
      }

      return browser;
   }

   function Resize({
      swiper,
      on,
      emit
   }) {
      const window = getWindow();
      let observer = null;

      const resizeHandler = () => {
         if (!swiper || swiper.destroyed || !swiper.initialized) return;
         emit('beforeResize');
         emit('resize');
      };

      const createObserver = () => {
         if (!swiper || swiper.destroyed || !swiper.initialized) return;
         observer = new ResizeObserver(entries => {
            const {
               width,
               height
            } = swiper;
            let newWidth = width;
            let newHeight = height;
            entries.forEach(({
               contentBoxSize,
               contentRect,
               target
            }) => {
               if (target && target !== swiper.el) return;
               newWidth = contentRect ? contentRect.width : (contentBoxSize[0] || contentBoxSize).inlineSize;
               newHeight = contentRect ? contentRect.height : (contentBoxSize[0] || contentBoxSize).blockSize;
            });

            if (newWidth !== width || newHeight !== height) {
               resizeHandler();
            }
         });
         observer.observe(swiper.el);
      };

      const removeObserver = () => {
         if (observer && observer.unobserve && swiper.el) {
            observer.unobserve(swiper.el);
            observer = null;
         }
      };

      const orientationChangeHandler = () => {
         if (!swiper || swiper.destroyed || !swiper.initialized) return;
         emit('orientationchange');
      };

      on('init', () => {
         if (swiper.params.resizeObserver && typeof window.ResizeObserver !== 'undefined') {
            createObserver();
            return;
         }

         window.addEventListener('resize', resizeHandler);
         window.addEventListener('orientationchange', orientationChangeHandler);
      });
      on('destroy', () => {
         removeObserver();
         window.removeEventListener('resize', resizeHandler);
         window.removeEventListener('orientationchange', orientationChangeHandler);
      });
   }

   function Observer({
      swiper,
      extendParams,
      on,
      emit
   }) {
      const observers = [];
      const window = getWindow();

      const attach = (target, options = {}) => {
         const ObserverFunc = window.MutationObserver || window.WebkitMutationObserver;
         const observer = new ObserverFunc(mutations => {
            // The observerUpdate event should only be triggered
            // once despite the number of mutations.  Additional
            // triggers are redundant and are very costly
            if (mutations.length === 1) {
               emit('observerUpdate', mutations[0]);
               return;
            }

            const observerUpdate = function observerUpdate() {
               emit('observerUpdate', mutations[0]);
            };

            if (window.requestAnimationFrame) {
               window.requestAnimationFrame(observerUpdate);
            } else {
               window.setTimeout(observerUpdate, 0);
            }
         });
         observer.observe(target, {
            attributes: typeof options.attributes === 'undefined' ? true : options.attributes,
            childList: typeof options.childList === 'undefined' ? true : options.childList,
            characterData: typeof options.characterData === 'undefined' ? true : options.characterData
         });
         observers.push(observer);
      };

      const init = () => {
         if (!swiper.params.observer) return;

         if (swiper.params.observeParents) {
            const containerParents = swiper.$el.parents();

            for (let i = 0; i < containerParents.length; i += 1) {
               attach(containerParents[i]);
            }
         } // Observe container


         attach(swiper.$el[0], {
            childList: swiper.params.observeSlideChildren
         }); // Observe wrapper

         attach(swiper.$wrapperEl[0], {
            attributes: false
         });
      };

      const destroy = () => {
         observers.forEach(observer => {
            observer.disconnect();
         });
         observers.splice(0, observers.length);
      };

      extendParams({
         observer: false,
         observeParents: false,
         observeSlideChildren: false
      });
      on('init', init);
      on('destroy', destroy);
   }

   /* eslint-disable no-underscore-dangle */
   var eventsEmitter = {
      on(events, handler, priority) {
         const self = this;
         if (typeof handler !== 'function') return self;
         const method = priority ? 'unshift' : 'push';
         events.split(' ').forEach(event => {
            if (!self.eventsListeners[event]) self.eventsListeners[event] = [];
            self.eventsListeners[event][method](handler);
         });
         return self;
      },

      once(events, handler, priority) {
         const self = this;
         if (typeof handler !== 'function') return self;

         function onceHandler(...args) {
            self.off(events, onceHandler);

            if (onceHandler.__emitterProxy) {
               delete onceHandler.__emitterProxy;
            }

            handler.apply(self, args);
         }

         onceHandler.__emitterProxy = handler;
         return self.on(events, onceHandler, priority);
      },

      onAny(handler, priority) {
         const self = this;
         if (typeof handler !== 'function') return self;
         const method = priority ? 'unshift' : 'push';

         if (self.eventsAnyListeners.indexOf(handler) < 0) {
            self.eventsAnyListeners[method](handler);
         }

         return self;
      },

      offAny(handler) {
         const self = this;
         if (!self.eventsAnyListeners) return self;
         const index = self.eventsAnyListeners.indexOf(handler);

         if (index >= 0) {
            self.eventsAnyListeners.splice(index, 1);
         }

         return self;
      },

      off(events, handler) {
         const self = this;
         if (!self.eventsListeners) return self;
         events.split(' ').forEach(event => {
            if (typeof handler === 'undefined') {
               self.eventsListeners[event] = [];
            } else if (self.eventsListeners[event]) {
               self.eventsListeners[event].forEach((eventHandler, index) => {
                  if (eventHandler === handler || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler) {
                     self.eventsListeners[event].splice(index, 1);
                  }
               });
            }
         });
         return self;
      },

      emit(...args) {
         const self = this;
         if (!self.eventsListeners) return self;
         let events;
         let data;
         let context;

         if (typeof args[0] === 'string' || Array.isArray(args[0])) {
            events = args[0];
            data = args.slice(1, args.length);
            context = self;
         } else {
            events = args[0].events;
            data = args[0].data;
            context = args[0].context || self;
         }

         data.unshift(context);
         const eventsArray = Array.isArray(events) ? events : events.split(' ');
         eventsArray.forEach(event => {
            if (self.eventsAnyListeners && self.eventsAnyListeners.length) {
               self.eventsAnyListeners.forEach(eventHandler => {
                  eventHandler.apply(context, [event, ...data]);
               });
            }

            if (self.eventsListeners && self.eventsListeners[event]) {
               self.eventsListeners[event].forEach(eventHandler => {
                  eventHandler.apply(context, data);
               });
            }
         });
         return self;
      }

   };

   function updateSize() {
      const swiper = this;
      let width;
      let height;
      const $el = swiper.$el;

      if (typeof swiper.params.width !== 'undefined' && swiper.params.width !== null) {
         width = swiper.params.width;
      } else {
         width = $el[0].clientWidth;
      }

      if (typeof swiper.params.height !== 'undefined' && swiper.params.height !== null) {
         height = swiper.params.height;
      } else {
         height = $el[0].clientHeight;
      }

      if (width === 0 && swiper.isHorizontal() || height === 0 && swiper.isVertical()) {
         return;
      } // Subtract paddings


      width = width - parseInt($el.css('padding-left') || 0, 10) - parseInt($el.css('padding-right') || 0, 10);
      height = height - parseInt($el.css('padding-top') || 0, 10) - parseInt($el.css('padding-bottom') || 0, 10);
      if (Number.isNaN(width)) width = 0;
      if (Number.isNaN(height)) height = 0;
      Object.assign(swiper, {
         width,
         height,
         size: swiper.isHorizontal() ? width : height
      });
   }

   function updateSlides() {
      const swiper = this;

      function getDirectionLabel(property) {
         if (swiper.isHorizontal()) {
            return property;
         } // prettier-ignore


         return {
            'width': 'height',
            'margin-top': 'margin-left',
            'margin-bottom ': 'margin-right',
            'margin-left': 'margin-top',
            'margin-right': 'margin-bottom',
            'padding-left': 'padding-top',
            'padding-right': 'padding-bottom',
            'marginRight': 'marginBottom'
         }[property];
      }

      function getDirectionPropertyValue(node, label) {
         return parseFloat(node.getPropertyValue(getDirectionLabel(label)) || 0);
      }

      const params = swiper.params;
      const {
         $wrapperEl,
         size: swiperSize,
         rtlTranslate: rtl,
         wrongRTL
      } = swiper;
      const isVirtual = swiper.virtual && params.virtual.enabled;
      const previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
      const slides = $wrapperEl.children(`.${swiper.params.slideClass}`);
      const slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
      let snapGrid = [];
      const slidesGrid = [];
      const slidesSizesGrid = [];
      let offsetBefore = params.slidesOffsetBefore;

      if (typeof offsetBefore === 'function') {
         offsetBefore = params.slidesOffsetBefore.call(swiper);
      }

      let offsetAfter = params.slidesOffsetAfter;

      if (typeof offsetAfter === 'function') {
         offsetAfter = params.slidesOffsetAfter.call(swiper);
      }

      const previousSnapGridLength = swiper.snapGrid.length;
      const previousSlidesGridLength = swiper.slidesGrid.length;
      let spaceBetween = params.spaceBetween;
      let slidePosition = -offsetBefore;
      let prevSlideSize = 0;
      let index = 0;

      if (typeof swiperSize === 'undefined') {
         return;
      }

      if (typeof spaceBetween === 'string' && spaceBetween.indexOf('%') >= 0) {
         spaceBetween = parseFloat(spaceBetween.replace('%', '')) / 100 * swiperSize;
      }

      swiper.virtualSize = -spaceBetween; // reset margins

      if (rtl) slides.css({
         marginLeft: '',
         marginBottom: '',
         marginTop: ''
      }); else slides.css({
         marginRight: '',
         marginBottom: '',
         marginTop: ''
      }); // reset cssMode offsets

      if (params.centeredSlides && params.cssMode) {
         setCSSProperty(swiper.wrapperEl, '--swiper-centered-offset-before', '');
         setCSSProperty(swiper.wrapperEl, '--swiper-centered-offset-after', '');
      }

      const gridEnabled = params.grid && params.grid.rows > 1 && swiper.grid;

      if (gridEnabled) {
         swiper.grid.initSlides(slidesLength);
      } // Calc slides


      let slideSize;
      const shouldResetSlideSize = params.slidesPerView === 'auto' && params.breakpoints && Object.keys(params.breakpoints).filter(key => {
         return typeof params.breakpoints[key].slidesPerView !== 'undefined';
      }).length > 0;

      for (let i = 0; i < slidesLength; i += 1) {
         slideSize = 0;
         const slide = slides.eq(i);

         if (gridEnabled) {
            swiper.grid.updateSlide(i, slide, slidesLength, getDirectionLabel);
         }

         if (slide.css('display') === 'none') continue; // eslint-disable-line

         if (params.slidesPerView === 'auto') {
            if (shouldResetSlideSize) {
               slides[i].style[getDirectionLabel('width')] = ``;
            }

            const slideStyles = getComputedStyle(slide[0]);
            const currentTransform = slide[0].style.transform;
            const currentWebKitTransform = slide[0].style.webkitTransform;

            if (currentTransform) {
               slide[0].style.transform = 'none';
            }

            if (currentWebKitTransform) {
               slide[0].style.webkitTransform = 'none';
            }

            if (params.roundLengths) {
               slideSize = swiper.isHorizontal() ? slide.outerWidth(true) : slide.outerHeight(true);
            } else {
               // eslint-disable-next-line
               const width = getDirectionPropertyValue(slideStyles, 'width');
               const paddingLeft = getDirectionPropertyValue(slideStyles, 'padding-left');
               const paddingRight = getDirectionPropertyValue(slideStyles, 'padding-right');
               const marginLeft = getDirectionPropertyValue(slideStyles, 'margin-left');
               const marginRight = getDirectionPropertyValue(slideStyles, 'margin-right');
               const boxSizing = slideStyles.getPropertyValue('box-sizing');

               if (boxSizing && boxSizing === 'border-box') {
                  slideSize = width + marginLeft + marginRight;
               } else {
                  const {
                     clientWidth,
                     offsetWidth
                  } = slide[0];
                  slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + (offsetWidth - clientWidth);
               }
            }

            if (currentTransform) {
               slide[0].style.transform = currentTransform;
            }

            if (currentWebKitTransform) {
               slide[0].style.webkitTransform = currentWebKitTransform;
            }

            if (params.roundLengths) slideSize = Math.floor(slideSize);
         } else {
            slideSize = (swiperSize - (params.slidesPerView - 1) * spaceBetween) / params.slidesPerView;
            if (params.roundLengths) slideSize = Math.floor(slideSize);

            if (slides[i]) {
               slides[i].style[getDirectionLabel('width')] = `${slideSize}px`;
            }
         }

         if (slides[i]) {
            slides[i].swiperSlideSize = slideSize;
         }

         slidesSizesGrid.push(slideSize);

         if (params.centeredSlides) {
            slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
            if (prevSlideSize === 0 && i !== 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
            if (i === 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
            if (Math.abs(slidePosition) < 1 / 1000) slidePosition = 0;
            if (params.roundLengths) slidePosition = Math.floor(slidePosition);
            if (index % params.slidesPerGroup === 0) snapGrid.push(slidePosition);
            slidesGrid.push(slidePosition);
         } else {
            if (params.roundLengths) slidePosition = Math.floor(slidePosition);
            if ((index - Math.min(swiper.params.slidesPerGroupSkip, index)) % swiper.params.slidesPerGroup === 0) snapGrid.push(slidePosition);
            slidesGrid.push(slidePosition);
            slidePosition = slidePosition + slideSize + spaceBetween;
         }

         swiper.virtualSize += slideSize + spaceBetween;
         prevSlideSize = slideSize;
         index += 1;
      }

      swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;

      if (rtl && wrongRTL && (params.effect === 'slide' || params.effect === 'coverflow')) {
         $wrapperEl.css({
            width: `${swiper.virtualSize + params.spaceBetween}px`
         });
      }

      if (params.setWrapperSize) {
         $wrapperEl.css({
            [getDirectionLabel('width')]: `${swiper.virtualSize + params.spaceBetween}px`
         });
      }

      if (gridEnabled) {
         swiper.grid.updateWrapperSize(slideSize, snapGrid, getDirectionLabel);
      } // Remove last grid elements depending on width


      if (!params.centeredSlides) {
         const newSlidesGrid = [];

         for (let i = 0; i < snapGrid.length; i += 1) {
            let slidesGridItem = snapGrid[i];
            if (params.roundLengths) slidesGridItem = Math.floor(slidesGridItem);

            if (snapGrid[i] <= swiper.virtualSize - swiperSize) {
               newSlidesGrid.push(slidesGridItem);
            }
         }

         snapGrid = newSlidesGrid;

         if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) {
            snapGrid.push(swiper.virtualSize - swiperSize);
         }
      }

      if (snapGrid.length === 0) snapGrid = [0];

      if (params.spaceBetween !== 0) {
         const key = swiper.isHorizontal() && rtl ? 'marginLeft' : getDirectionLabel('marginRight');
         slides.filter((_, slideIndex) => {
            if (!params.cssMode) return true;

            if (slideIndex === slides.length - 1) {
               return false;
            }

            return true;
         }).css({
            [key]: `${spaceBetween}px`
         });
      }

      if (params.centeredSlides && params.centeredSlidesBounds) {
         let allSlidesSize = 0;
         slidesSizesGrid.forEach(slideSizeValue => {
            allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
         });
         allSlidesSize -= params.spaceBetween;
         const maxSnap = allSlidesSize - swiperSize;
         snapGrid = snapGrid.map(snap => {
            if (snap < 0) return -offsetBefore;
            if (snap > maxSnap) return maxSnap + offsetAfter;
            return snap;
         });
      }

      if (params.centerInsufficientSlides) {
         let allSlidesSize = 0;
         slidesSizesGrid.forEach(slideSizeValue => {
            allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
         });
         allSlidesSize -= params.spaceBetween;

         if (allSlidesSize < swiperSize) {
            const allSlidesOffset = (swiperSize - allSlidesSize) / 2;
            snapGrid.forEach((snap, snapIndex) => {
               snapGrid[snapIndex] = snap - allSlidesOffset;
            });
            slidesGrid.forEach((snap, snapIndex) => {
               slidesGrid[snapIndex] = snap + allSlidesOffset;
            });
         }
      }

      Object.assign(swiper, {
         slides,
         snapGrid,
         slidesGrid,
         slidesSizesGrid
      });

      if (params.centeredSlides && params.cssMode && !params.centeredSlidesBounds) {
         setCSSProperty(swiper.wrapperEl, '--swiper-centered-offset-before', `${-snapGrid[0]}px`);
         setCSSProperty(swiper.wrapperEl, '--swiper-centered-offset-after', `${swiper.size / 2 - slidesSizesGrid[slidesSizesGrid.length - 1] / 2}px`);
         const addToSnapGrid = -swiper.snapGrid[0];
         const addToSlidesGrid = -swiper.slidesGrid[0];
         swiper.snapGrid = swiper.snapGrid.map(v => v + addToSnapGrid);
         swiper.slidesGrid = swiper.slidesGrid.map(v => v + addToSlidesGrid);
      }

      if (slidesLength !== previousSlidesLength) {
         swiper.emit('slidesLengthChange');
      }

      if (snapGrid.length !== previousSnapGridLength) {
         if (swiper.params.watchOverflow) swiper.checkOverflow();
         swiper.emit('snapGridLengthChange');
      }

      if (slidesGrid.length !== previousSlidesGridLength) {
         swiper.emit('slidesGridLengthChange');
      }

      if (params.watchSlidesProgress) {
         swiper.updateSlidesOffset();
      }
   }

   function updateAutoHeight(speed) {
      const swiper = this;
      const activeSlides = [];
      const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
      let newHeight = 0;
      let i;

      if (typeof speed === 'number') {
         swiper.setTransition(speed);
      } else if (speed === true) {
         swiper.setTransition(swiper.params.speed);
      }

      const getSlideByIndex = index => {
         if (isVirtual) {
            return swiper.slides.filter(el => parseInt(el.getAttribute('data-swiper-slide-index'), 10) === index)[0];
         }

         return swiper.slides.eq(index)[0];
      }; // Find slides currently in view


      if (swiper.params.slidesPerView !== 'auto' && swiper.params.slidesPerView > 1) {
         if (swiper.params.centeredSlides) {
            swiper.visibleSlides.each(slide => {
               activeSlides.push(slide);
            });
         } else {
            for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
               const index = swiper.activeIndex + i;
               if (index > swiper.slides.length && !isVirtual) break;
               activeSlides.push(getSlideByIndex(index));
            }
         }
      } else {
         activeSlides.push(getSlideByIndex(swiper.activeIndex));
      } // Find new height from highest slide in view


      for (i = 0; i < activeSlides.length; i += 1) {
         if (typeof activeSlides[i] !== 'undefined') {
            const height = activeSlides[i].offsetHeight;
            newHeight = height > newHeight ? height : newHeight;
         }
      } // Update Height


      if (newHeight) swiper.$wrapperEl.css('height', `${newHeight}px`);
   }

   function updateSlidesOffset() {
      const swiper = this;
      const slides = swiper.slides;

      for (let i = 0; i < slides.length; i += 1) {
         slides[i].swiperSlideOffset = swiper.isHorizontal() ? slides[i].offsetLeft : slides[i].offsetTop;
      }
   }

   function updateSlidesProgress(translate = this && this.translate || 0) {
      const swiper = this;
      const params = swiper.params;
      const {
         slides,
         rtlTranslate: rtl
      } = swiper;
      if (slides.length === 0) return;
      if (typeof slides[0].swiperSlideOffset === 'undefined') swiper.updateSlidesOffset();
      let offsetCenter = -translate;
      if (rtl) offsetCenter = translate; // Visible Slides

      slides.removeClass(params.slideVisibleClass);
      swiper.visibleSlidesIndexes = [];
      swiper.visibleSlides = [];

      for (let i = 0; i < slides.length; i += 1) {
         const slide = slides[i];
         let slideOffset = slide.swiperSlideOffset;

         if (params.cssMode && params.centeredSlides) {
            slideOffset -= slides[0].swiperSlideOffset;
         }

         const slideProgress = (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + params.spaceBetween);
         const slideBefore = -(offsetCenter - slideOffset);
         const slideAfter = slideBefore + swiper.slidesSizesGrid[i];
         const isVisible = slideBefore >= 0 && slideBefore < swiper.size - 1 || slideAfter > 1 && slideAfter <= swiper.size || slideBefore <= 0 && slideAfter >= swiper.size;

         if (isVisible) {
            swiper.visibleSlides.push(slide);
            swiper.visibleSlidesIndexes.push(i);
            slides.eq(i).addClass(params.slideVisibleClass);
         }

         slide.progress = rtl ? -slideProgress : slideProgress;
      }

      swiper.visibleSlides = $(swiper.visibleSlides);
   }

   function updateProgress(translate) {
      const swiper = this;

      if (typeof translate === 'undefined') {
         const multiplier = swiper.rtlTranslate ? -1 : 1; // eslint-disable-next-line

         translate = swiper && swiper.translate && swiper.translate * multiplier || 0;
      }

      const params = swiper.params;
      const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
      let {
         progress,
         isBeginning,
         isEnd
      } = swiper;
      const wasBeginning = isBeginning;
      const wasEnd = isEnd;

      if (translatesDiff === 0) {
         progress = 0;
         isBeginning = true;
         isEnd = true;
      } else {
         progress = (translate - swiper.minTranslate()) / translatesDiff;
         isBeginning = progress <= 0;
         isEnd = progress >= 1;
      }

      Object.assign(swiper, {
         progress,
         isBeginning,
         isEnd
      });
      if (params.watchSlidesProgress || params.centeredSlides && params.autoHeight) swiper.updateSlidesProgress(translate);

      if (isBeginning && !wasBeginning) {
         swiper.emit('reachBeginning toEdge');
      }

      if (isEnd && !wasEnd) {
         swiper.emit('reachEnd toEdge');
      }

      if (wasBeginning && !isBeginning || wasEnd && !isEnd) {
         swiper.emit('fromEdge');
      }

      swiper.emit('progress', progress);
   }

   function updateSlidesClasses() {
      const swiper = this;
      const {
         slides,
         params,
         $wrapperEl,
         activeIndex,
         realIndex
      } = swiper;
      const isVirtual = swiper.virtual && params.virtual.enabled;
      slides.removeClass(`${params.slideActiveClass} ${params.slideNextClass} ${params.slidePrevClass} ${params.slideDuplicateActiveClass} ${params.slideDuplicateNextClass} ${params.slideDuplicatePrevClass}`);
      let activeSlide;

      if (isVirtual) {
         activeSlide = swiper.$wrapperEl.find(`.${params.slideClass}[data-swiper-slide-index="${activeIndex}"]`);
      } else {
         activeSlide = slides.eq(activeIndex);
      } // Active classes


      activeSlide.addClass(params.slideActiveClass);

      if (params.loop) {
         // Duplicate to all looped slides
         if (activeSlide.hasClass(params.slideDuplicateClass)) {
            $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${realIndex}"]`).addClass(params.slideDuplicateActiveClass);
         } else {
            $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${realIndex}"]`).addClass(params.slideDuplicateActiveClass);
         }
      } // Next Slide


      let nextSlide = activeSlide.nextAll(`.${params.slideClass}`).eq(0).addClass(params.slideNextClass);

      if (params.loop && nextSlide.length === 0) {
         nextSlide = slides.eq(0);
         nextSlide.addClass(params.slideNextClass);
      } // Prev Slide


      let prevSlide = activeSlide.prevAll(`.${params.slideClass}`).eq(0).addClass(params.slidePrevClass);

      if (params.loop && prevSlide.length === 0) {
         prevSlide = slides.eq(-1);
         prevSlide.addClass(params.slidePrevClass);
      }

      if (params.loop) {
         // Duplicate to all looped slides
         if (nextSlide.hasClass(params.slideDuplicateClass)) {
            $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${nextSlide.attr('data-swiper-slide-index')}"]`).addClass(params.slideDuplicateNextClass);
         } else {
            $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${nextSlide.attr('data-swiper-slide-index')}"]`).addClass(params.slideDuplicateNextClass);
         }

         if (prevSlide.hasClass(params.slideDuplicateClass)) {
            $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${prevSlide.attr('data-swiper-slide-index')}"]`).addClass(params.slideDuplicatePrevClass);
         } else {
            $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${prevSlide.attr('data-swiper-slide-index')}"]`).addClass(params.slideDuplicatePrevClass);
         }
      }

      swiper.emitSlidesClasses();
   }

   function updateActiveIndex(newActiveIndex) {
      const swiper = this;
      const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
      const {
         slidesGrid,
         snapGrid,
         params,
         activeIndex: previousIndex,
         realIndex: previousRealIndex,
         snapIndex: previousSnapIndex
      } = swiper;
      let activeIndex = newActiveIndex;
      let snapIndex;

      if (typeof activeIndex === 'undefined') {
         for (let i = 0; i < slidesGrid.length; i += 1) {
            if (typeof slidesGrid[i + 1] !== 'undefined') {
               if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1] - (slidesGrid[i + 1] - slidesGrid[i]) / 2) {
                  activeIndex = i;
               } else if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1]) {
                  activeIndex = i + 1;
               }
            } else if (translate >= slidesGrid[i]) {
               activeIndex = i;
            }
         } // Normalize slideIndex


         if (params.normalizeSlideIndex) {
            if (activeIndex < 0 || typeof activeIndex === 'undefined') activeIndex = 0;
         }
      }

      if (snapGrid.indexOf(translate) >= 0) {
         snapIndex = snapGrid.indexOf(translate);
      } else {
         const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
         snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
      }

      if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;

      if (activeIndex === previousIndex) {
         if (snapIndex !== previousSnapIndex) {
            swiper.snapIndex = snapIndex;
            swiper.emit('snapIndexChange');
         }

         return;
      } // Get real index


      const realIndex = parseInt(swiper.slides.eq(activeIndex).attr('data-swiper-slide-index') || activeIndex, 10);
      Object.assign(swiper, {
         snapIndex,
         realIndex,
         previousIndex,
         activeIndex
      });
      swiper.emit('activeIndexChange');
      swiper.emit('snapIndexChange');

      if (previousRealIndex !== realIndex) {
         swiper.emit('realIndexChange');
      }

      if (swiper.initialized || swiper.params.runCallbacksOnInit) {
         swiper.emit('slideChange');
      }
   }

   function updateClickedSlide(e) {
      const swiper = this;
      const params = swiper.params;
      const slide = $(e.target).closest(`.${params.slideClass}`)[0];
      let slideFound = false;
      let slideIndex;

      if (slide) {
         for (let i = 0; i < swiper.slides.length; i += 1) {
            if (swiper.slides[i] === slide) {
               slideFound = true;
               slideIndex = i;
               break;
            }
         }
      }

      if (slide && slideFound) {
         swiper.clickedSlide = slide;

         if (swiper.virtual && swiper.params.virtual.enabled) {
            swiper.clickedIndex = parseInt($(slide).attr('data-swiper-slide-index'), 10);
         } else {
            swiper.clickedIndex = slideIndex;
         }
      } else {
         swiper.clickedSlide = undefined;
         swiper.clickedIndex = undefined;
         return;
      }

      if (params.slideToClickedSlide && swiper.clickedIndex !== undefined && swiper.clickedIndex !== swiper.activeIndex) {
         swiper.slideToClickedSlide();
      }
   }

   var update = {
      updateSize,
      updateSlides,
      updateAutoHeight,
      updateSlidesOffset,
      updateSlidesProgress,
      updateProgress,
      updateSlidesClasses,
      updateActiveIndex,
      updateClickedSlide
   };

   function getSwiperTranslate(axis = this.isHorizontal() ? 'x' : 'y') {
      const swiper = this;
      const {
         params,
         rtlTranslate: rtl,
         translate,
         $wrapperEl
      } = swiper;

      if (params.virtualTranslate) {
         return rtl ? -translate : translate;
      }

      if (params.cssMode) {
         return translate;
      }

      let currentTranslate = getTranslate($wrapperEl[0], axis);
      if (rtl) currentTranslate = -currentTranslate;
      return currentTranslate || 0;
   }

   function setTranslate(translate, byController) {
      const swiper = this;
      const {
         rtlTranslate: rtl,
         params,
         $wrapperEl,
         wrapperEl,
         progress
      } = swiper;
      let x = 0;
      let y = 0;
      const z = 0;

      if (swiper.isHorizontal()) {
         x = rtl ? -translate : translate;
      } else {
         y = translate;
      }

      if (params.roundLengths) {
         x = Math.floor(x);
         y = Math.floor(y);
      }

      if (params.cssMode) {
         wrapperEl[swiper.isHorizontal() ? 'scrollLeft' : 'scrollTop'] = swiper.isHorizontal() ? -x : -y;
      } else if (!params.virtualTranslate) {
         $wrapperEl.transform(`translate3d(${x}px, ${y}px, ${z}px)`);
      }

      swiper.previousTranslate = swiper.translate;
      swiper.translate = swiper.isHorizontal() ? x : y; // Check if we need to update progress

      let newProgress;
      const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();

      if (translatesDiff === 0) {
         newProgress = 0;
      } else {
         newProgress = (translate - swiper.minTranslate()) / translatesDiff;
      }

      if (newProgress !== progress) {
         swiper.updateProgress(translate);
      }

      swiper.emit('setTranslate', swiper.translate, byController);
   }

   function minTranslate() {
      return -this.snapGrid[0];
   }

   function maxTranslate() {
      return -this.snapGrid[this.snapGrid.length - 1];
   }

   function translateTo(translate = 0, speed = this.params.speed, runCallbacks = true, translateBounds = true, internal) {
      const swiper = this;
      const {
         params,
         wrapperEl
      } = swiper;

      if (swiper.animating && params.preventInteractionOnTransition) {
         return false;
      }

      const minTranslate = swiper.minTranslate();
      const maxTranslate = swiper.maxTranslate();
      let newTranslate;
      if (translateBounds && translate > minTranslate) newTranslate = minTranslate; else if (translateBounds && translate < maxTranslate) newTranslate = maxTranslate; else newTranslate = translate; // Update progress

      swiper.updateProgress(newTranslate);

      if (params.cssMode) {
         const isH = swiper.isHorizontal();

         if (speed === 0) {
            wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = -newTranslate;
         } else {
            if (!swiper.support.smoothScroll) {
               animateCSSModeScroll({
                  swiper,
                  targetPosition: -newTranslate,
                  side: isH ? 'left' : 'top'
               });
               return true;
            }

            wrapperEl.scrollTo({
               [isH ? 'left' : 'top']: -newTranslate,
               behavior: 'smooth'
            });
         }

         return true;
      }

      if (speed === 0) {
         swiper.setTransition(0);
         swiper.setTranslate(newTranslate);

         if (runCallbacks) {
            swiper.emit('beforeTransitionStart', speed, internal);
            swiper.emit('transitionEnd');
         }
      } else {
         swiper.setTransition(speed);
         swiper.setTranslate(newTranslate);

         if (runCallbacks) {
            swiper.emit('beforeTransitionStart', speed, internal);
            swiper.emit('transitionStart');
         }

         if (!swiper.animating) {
            swiper.animating = true;

            if (!swiper.onTranslateToWrapperTransitionEnd) {
               swiper.onTranslateToWrapperTransitionEnd = function transitionEnd(e) {
                  if (!swiper || swiper.destroyed) return;
                  if (e.target !== this) return;
                  swiper.$wrapperEl[0].removeEventListener('transitionend', swiper.onTranslateToWrapperTransitionEnd);
                  swiper.$wrapperEl[0].removeEventListener('webkitTransitionEnd', swiper.onTranslateToWrapperTransitionEnd);
                  swiper.onTranslateToWrapperTransitionEnd = null;
                  delete swiper.onTranslateToWrapperTransitionEnd;

                  if (runCallbacks) {
                     swiper.emit('transitionEnd');
                  }
               };
            }

            swiper.$wrapperEl[0].addEventListener('transitionend', swiper.onTranslateToWrapperTransitionEnd);
            swiper.$wrapperEl[0].addEventListener('webkitTransitionEnd', swiper.onTranslateToWrapperTransitionEnd);
         }
      }

      return true;
   }

   var translate = {
      getTranslate: getSwiperTranslate,
      setTranslate,
      minTranslate,
      maxTranslate,
      translateTo
   };

   function setTransition(duration, byController) {
      const swiper = this;

      if (!swiper.params.cssMode) {
         swiper.$wrapperEl.transition(duration);
      }

      swiper.emit('setTransition', duration, byController);
   }

   function transitionEmit({
      swiper,
      runCallbacks,
      direction,
      step
   }) {
      const {
         activeIndex,
         previousIndex
      } = swiper;
      let dir = direction;

      if (!dir) {
         if (activeIndex > previousIndex) dir = 'next'; else if (activeIndex < previousIndex) dir = 'prev'; else dir = 'reset';
      }

      swiper.emit(`transition${step}`);

      if (runCallbacks && activeIndex !== previousIndex) {
         if (dir === 'reset') {
            swiper.emit(`slideResetTransition${step}`);
            return;
         }

         swiper.emit(`slideChangeTransition${step}`);

         if (dir === 'next') {
            swiper.emit(`slideNextTransition${step}`);
         } else {
            swiper.emit(`slidePrevTransition${step}`);
         }
      }
   }

   function transitionStart(runCallbacks = true, direction) {
      const swiper = this;
      const {
         params
      } = swiper;
      if (params.cssMode) return;

      if (params.autoHeight) {
         swiper.updateAutoHeight();
      }

      transitionEmit({
         swiper,
         runCallbacks,
         direction,
         step: 'Start'
      });
   }

   function transitionEnd(runCallbacks = true, direction) {
      const swiper = this;
      const {
         params
      } = swiper;
      swiper.animating = false;
      if (params.cssMode) return;
      swiper.setTransition(0);
      transitionEmit({
         swiper,
         runCallbacks,
         direction,
         step: 'End'
      });
   }

   var transition = {
      setTransition,
      transitionStart,
      transitionEnd
   };

   function slideTo(index = 0, speed = this.params.speed, runCallbacks = true, internal, initial) {
      if (typeof index !== 'number' && typeof index !== 'string') {
         throw new Error(`The 'index' argument cannot have type other than 'number' or 'string'. [${typeof index}] given.`);
      }

      if (typeof index === 'string') {
         /**
          * The `index` argument converted from `string` to `number`.
          * @type {number}
          */
         const indexAsNumber = parseInt(index, 10);
         /**
          * Determines whether the `index` argument is a valid `number`
          * after being converted from the `string` type.
          * @type {boolean}
          */

         const isValidNumber = isFinite(indexAsNumber);

         if (!isValidNumber) {
            throw new Error(`The passed-in 'index' (string) couldn't be converted to 'number'. [${index}] given.`);
         } // Knowing that the converted `index` is a valid number,
         // we can update the original argument's value.


         index = indexAsNumber;
      }

      const swiper = this;
      let slideIndex = index;
      if (slideIndex < 0) slideIndex = 0;
      const {
         params,
         snapGrid,
         slidesGrid,
         previousIndex,
         activeIndex,
         rtlTranslate: rtl,
         wrapperEl,
         enabled
      } = swiper;

      if (swiper.animating && params.preventInteractionOnTransition || !enabled && !internal && !initial) {
         return false;
      }

      const skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
      let snapIndex = skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
      if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;

      if ((activeIndex || params.initialSlide || 0) === (previousIndex || 0) && runCallbacks) {
         swiper.emit('beforeSlideChangeStart');
      }

      const translate = -snapGrid[snapIndex]; // Update progress

      swiper.updateProgress(translate); // Normalize slideIndex

      if (params.normalizeSlideIndex) {
         for (let i = 0; i < slidesGrid.length; i += 1) {
            const normalizedTranslate = -Math.floor(translate * 100);
            const normalizedGrid = Math.floor(slidesGrid[i] * 100);
            const normalizedGridNext = Math.floor(slidesGrid[i + 1] * 100);

            if (typeof slidesGrid[i + 1] !== 'undefined') {
               if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2) {
                  slideIndex = i;
               } else if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext) {
                  slideIndex = i + 1;
               }
            } else if (normalizedTranslate >= normalizedGrid) {
               slideIndex = i;
            }
         }
      } // Directions locks


      if (swiper.initialized && slideIndex !== activeIndex) {
         if (!swiper.allowSlideNext && translate < swiper.translate && translate < swiper.minTranslate()) {
            return false;
         }

         if (!swiper.allowSlidePrev && translate > swiper.translate && translate > swiper.maxTranslate()) {
            if ((activeIndex || 0) !== slideIndex) return false;
         }
      }

      let direction;
      if (slideIndex > activeIndex) direction = 'next'; else if (slideIndex < activeIndex) direction = 'prev'; else direction = 'reset'; // Update Index

      if (rtl && -translate === swiper.translate || !rtl && translate === swiper.translate) {
         swiper.updateActiveIndex(slideIndex); // Update Height

         if (params.autoHeight) {
            swiper.updateAutoHeight();
         }

         swiper.updateSlidesClasses();

         if (params.effect !== 'slide') {
            swiper.setTranslate(translate);
         }

         if (direction !== 'reset') {
            swiper.transitionStart(runCallbacks, direction);
            swiper.transitionEnd(runCallbacks, direction);
         }

         return false;
      }

      if (params.cssMode) {
         const isH = swiper.isHorizontal();
         const t = rtl ? translate : -translate;

         if (speed === 0) {
            const isVirtual = swiper.virtual && swiper.params.virtual.enabled;

            if (isVirtual) {
               swiper.wrapperEl.style.scrollSnapType = 'none';
            }

            wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = t;

            if (isVirtual) {
               requestAnimationFrame(() => {
                  swiper.wrapperEl.style.scrollSnapType = '';
               });
            }
         } else {
            if (!swiper.support.smoothScroll) {
               animateCSSModeScroll({
                  swiper,
                  targetPosition: t,
                  side: isH ? 'left' : 'top'
               });
               return true;
            }

            wrapperEl.scrollTo({
               [isH ? 'left' : 'top']: t,
               behavior: 'smooth'
            });
         }

         return true;
      }

      if (speed === 0) {
         swiper.setTransition(0);
         swiper.setTranslate(translate);
         swiper.updateActiveIndex(slideIndex);
         swiper.updateSlidesClasses();
         swiper.emit('beforeTransitionStart', speed, internal);
         swiper.transitionStart(runCallbacks, direction);
         swiper.transitionEnd(runCallbacks, direction);
      } else {
         swiper.setTransition(speed);
         swiper.setTranslate(translate);
         swiper.updateActiveIndex(slideIndex);
         swiper.updateSlidesClasses();
         swiper.emit('beforeTransitionStart', speed, internal);
         swiper.transitionStart(runCallbacks, direction);

         if (!swiper.animating) {
            swiper.animating = true;

            if (!swiper.onSlideToWrapperTransitionEnd) {
               swiper.onSlideToWrapperTransitionEnd = function transitionEnd(e) {
                  if (!swiper || swiper.destroyed) return;
                  if (e.target !== this) return;
                  swiper.$wrapperEl[0].removeEventListener('transitionend', swiper.onSlideToWrapperTransitionEnd);
                  swiper.$wrapperEl[0].removeEventListener('webkitTransitionEnd', swiper.onSlideToWrapperTransitionEnd);
                  swiper.onSlideToWrapperTransitionEnd = null;
                  delete swiper.onSlideToWrapperTransitionEnd;
                  swiper.transitionEnd(runCallbacks, direction);
               };
            }

            swiper.$wrapperEl[0].addEventListener('transitionend', swiper.onSlideToWrapperTransitionEnd);
            swiper.$wrapperEl[0].addEventListener('webkitTransitionEnd', swiper.onSlideToWrapperTransitionEnd);
         }
      }

      return true;
   }

   function slideToLoop(index = 0, speed = this.params.speed, runCallbacks = true, internal) {
      const swiper = this;
      let newIndex = index;

      if (swiper.params.loop) {
         newIndex += swiper.loopedSlides;
      }

      return swiper.slideTo(newIndex, speed, runCallbacks, internal);
   }

   /* eslint no-unused-vars: "off" */
   function slideNext(speed = this.params.speed, runCallbacks = true, internal) {
      const swiper = this;
      const {
         animating,
         enabled,
         params
      } = swiper;
      if (!enabled) return swiper;
      let perGroup = params.slidesPerGroup;

      if (params.slidesPerView === 'auto' && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
         perGroup = Math.max(swiper.slidesPerViewDynamic('current', true), 1);
      }

      const increment = swiper.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup;

      if (params.loop) {
         if (animating && params.loopPreventsSlide) return false;
         swiper.loopFix(); // eslint-disable-next-line

         swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
      }

      return swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
   }

   /* eslint no-unused-vars: "off" */
   function slidePrev(speed = this.params.speed, runCallbacks = true, internal) {
      const swiper = this;
      const {
         params,
         animating,
         snapGrid,
         slidesGrid,
         rtlTranslate,
         enabled
      } = swiper;
      if (!enabled) return swiper;

      if (params.loop) {
         if (animating && params.loopPreventsSlide) return false;
         swiper.loopFix(); // eslint-disable-next-line

         swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
      }

      const translate = rtlTranslate ? swiper.translate : -swiper.translate;

      function normalize(val) {
         if (val < 0) return -Math.floor(Math.abs(val));
         return Math.floor(val);
      }

      const normalizedTranslate = normalize(translate);
      const normalizedSnapGrid = snapGrid.map(val => normalize(val));
      let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];

      if (typeof prevSnap === 'undefined' && params.cssMode) {
         let prevSnapIndex;
         snapGrid.forEach((snap, snapIndex) => {
            if (normalizedTranslate >= snap) {
               // prevSnap = snap;
               prevSnapIndex = snapIndex;
            }
         });

         if (typeof prevSnapIndex !== 'undefined') {
            prevSnap = snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex];
         }
      }

      let prevIndex = 0;

      if (typeof prevSnap !== 'undefined') {
         prevIndex = slidesGrid.indexOf(prevSnap);
         if (prevIndex < 0) prevIndex = swiper.activeIndex - 1;

         if (params.slidesPerView === 'auto' && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
            prevIndex = prevIndex - swiper.slidesPerViewDynamic('previous', true) + 1;
            prevIndex = Math.max(prevIndex, 0);
         }
      }

      return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
   }

   /* eslint no-unused-vars: "off" */
   function slideReset(speed = this.params.speed, runCallbacks = true, internal) {
      const swiper = this;
      return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
   }

   /* eslint no-unused-vars: "off" */
   function slideToClosest(speed = this.params.speed, runCallbacks = true, internal, threshold = 0.5) {
      const swiper = this;
      let index = swiper.activeIndex;
      const skip = Math.min(swiper.params.slidesPerGroupSkip, index);
      const snapIndex = skip + Math.floor((index - skip) / swiper.params.slidesPerGroup);
      const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;

      if (translate >= swiper.snapGrid[snapIndex]) {
         // The current translate is on or after the current snap index, so the choice
         // is between the current index and the one after it.
         const currentSnap = swiper.snapGrid[snapIndex];
         const nextSnap = swiper.snapGrid[snapIndex + 1];

         if (translate - currentSnap > (nextSnap - currentSnap) * threshold) {
            index += swiper.params.slidesPerGroup;
         }
      } else {
         // The current translate is before the current snap index, so the choice
         // is between the current index and the one before it.
         const prevSnap = swiper.snapGrid[snapIndex - 1];
         const currentSnap = swiper.snapGrid[snapIndex];

         if (translate - prevSnap <= (currentSnap - prevSnap) * threshold) {
            index -= swiper.params.slidesPerGroup;
         }
      }

      index = Math.max(index, 0);
      index = Math.min(index, swiper.slidesGrid.length - 1);
      return swiper.slideTo(index, speed, runCallbacks, internal);
   }

   function slideToClickedSlide() {
      const swiper = this;
      const {
         params,
         $wrapperEl
      } = swiper;
      const slidesPerView = params.slidesPerView === 'auto' ? swiper.slidesPerViewDynamic() : params.slidesPerView;
      let slideToIndex = swiper.clickedIndex;
      let realIndex;

      if (params.loop) {
         if (swiper.animating) return;
         realIndex = parseInt($(swiper.clickedSlide).attr('data-swiper-slide-index'), 10);

         if (params.centeredSlides) {
            if (slideToIndex < swiper.loopedSlides - slidesPerView / 2 || slideToIndex > swiper.slides.length - swiper.loopedSlides + slidesPerView / 2) {
               swiper.loopFix();
               slideToIndex = $wrapperEl.children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`).eq(0).index();
               nextTick(() => {
                  swiper.slideTo(slideToIndex);
               });
            } else {
               swiper.slideTo(slideToIndex);
            }
         } else if (slideToIndex > swiper.slides.length - slidesPerView) {
            swiper.loopFix();
            slideToIndex = $wrapperEl.children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`).eq(0).index();
            nextTick(() => {
               swiper.slideTo(slideToIndex);
            });
         } else {
            swiper.slideTo(slideToIndex);
         }
      } else {
         swiper.slideTo(slideToIndex);
      }
   }

   var slide = {
      slideTo,
      slideToLoop,
      slideNext,
      slidePrev,
      slideReset,
      slideToClosest,
      slideToClickedSlide
   };

   function loopCreate() {
      const swiper = this;
      const document = getDocument();
      const {
         params,
         $wrapperEl
      } = swiper; // Remove duplicated slides

      $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}`).remove();
      let slides = $wrapperEl.children(`.${params.slideClass}`);

      if (params.loopFillGroupWithBlank) {
         const blankSlidesNum = params.slidesPerGroup - slides.length % params.slidesPerGroup;

         if (blankSlidesNum !== params.slidesPerGroup) {
            for (let i = 0; i < blankSlidesNum; i += 1) {
               const blankNode = $(document.createElement('div')).addClass(`${params.slideClass} ${params.slideBlankClass}`);
               $wrapperEl.append(blankNode);
            }

            slides = $wrapperEl.children(`.${params.slideClass}`);
         }
      }

      if (params.slidesPerView === 'auto' && !params.loopedSlides) params.loopedSlides = slides.length;
      swiper.loopedSlides = Math.ceil(parseFloat(params.loopedSlides || params.slidesPerView, 10));
      swiper.loopedSlides += params.loopAdditionalSlides;

      if (swiper.loopedSlides > slides.length) {
         swiper.loopedSlides = slides.length;
      }

      const prependSlides = [];
      const appendSlides = [];
      slides.each((el, index) => {
         const slide = $(el);

         if (index < swiper.loopedSlides) {
            appendSlides.push(el);
         }

         if (index < slides.length && index >= slides.length - swiper.loopedSlides) {
            prependSlides.push(el);
         }

         slide.attr('data-swiper-slide-index', index);
      });

      for (let i = 0; i < appendSlides.length; i += 1) {
         $wrapperEl.append($(appendSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
      }

      for (let i = prependSlides.length - 1; i >= 0; i -= 1) {
         $wrapperEl.prepend($(prependSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
      }
   }

   function loopFix() {
      const swiper = this;
      swiper.emit('beforeLoopFix');
      const {
         activeIndex,
         slides,
         loopedSlides,
         allowSlidePrev,
         allowSlideNext,
         snapGrid,
         rtlTranslate: rtl
      } = swiper;
      let newIndex;
      swiper.allowSlidePrev = true;
      swiper.allowSlideNext = true;
      const snapTranslate = -snapGrid[activeIndex];
      const diff = snapTranslate - swiper.getTranslate(); // Fix For Negative Oversliding

      if (activeIndex < loopedSlides) {
         newIndex = slides.length - loopedSlides * 3 + activeIndex;
         newIndex += loopedSlides;
         const slideChanged = swiper.slideTo(newIndex, 0, false, true);

         if (slideChanged && diff !== 0) {
            swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
         }
      } else if (activeIndex >= slides.length - loopedSlides) {
         // Fix For Positive Oversliding
         newIndex = -slides.length + activeIndex + loopedSlides;
         newIndex += loopedSlides;
         const slideChanged = swiper.slideTo(newIndex, 0, false, true);

         if (slideChanged && diff !== 0) {
            swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
         }
      }

      swiper.allowSlidePrev = allowSlidePrev;
      swiper.allowSlideNext = allowSlideNext;
      swiper.emit('loopFix');
   }

   function loopDestroy() {
      const swiper = this;
      const {
         $wrapperEl,
         params,
         slides
      } = swiper;
      $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass},.${params.slideClass}.${params.slideBlankClass}`).remove();
      slides.removeAttr('data-swiper-slide-index');
   }

   var loop = {
      loopCreate,
      loopFix,
      loopDestroy
   };

   function setGrabCursor(moving) {
      const swiper = this;
      if (swiper.support.touch || !swiper.params.simulateTouch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
      const el = swiper.params.touchEventsTarget === 'container' ? swiper.el : swiper.wrapperEl;
      el.style.cursor = 'move';
      el.style.cursor = moving ? '-webkit-grabbing' : '-webkit-grab';
      el.style.cursor = moving ? '-moz-grabbin' : '-moz-grab';
      el.style.cursor = moving ? 'grabbing' : 'grab';
   }

   function unsetGrabCursor() {
      const swiper = this;

      if (swiper.support.touch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) {
         return;
      }

      swiper[swiper.params.touchEventsTarget === 'container' ? 'el' : 'wrapperEl'].style.cursor = '';
   }

   var grabCursor = {
      setGrabCursor,
      unsetGrabCursor
   };

   function closestElement(selector, base = this) {
      function __closestFrom(el) {
         if (!el || el === getDocument() || el === getWindow()) return null;
         if (el.assignedSlot) el = el.assignedSlot;
         const found = el.closest(selector);
         return found || __closestFrom(el.getRootNode().host);
      }

      return __closestFrom(base);
   }

   function onTouchStart(event) {
      const swiper = this;
      const document = getDocument();
      const window = getWindow();
      const data = swiper.touchEventsData;
      const {
         params,
         touches,
         enabled
      } = swiper;
      if (!enabled) return;

      if (swiper.animating && params.preventInteractionOnTransition) {
         return;
      }

      if (!swiper.animating && params.cssMode && params.loop) {
         swiper.loopFix();
      }

      let e = event;
      if (e.originalEvent) e = e.originalEvent;
      let $targetEl = $(e.target);

      if (params.touchEventsTarget === 'wrapper') {
         if (!$targetEl.closest(swiper.wrapperEl).length) return;
      }

      data.isTouchEvent = e.type === 'touchstart';
      if (!data.isTouchEvent && 'which' in e && e.which === 3) return;
      if (!data.isTouchEvent && 'button' in e && e.button > 0) return;
      if (data.isTouched && data.isMoved) return; // change target el for shadow root component

      const swipingClassHasValue = !!params.noSwipingClass && params.noSwipingClass !== '';

      if (swipingClassHasValue && e.target && e.target.shadowRoot && event.path && event.path[0]) {
         $targetEl = $(event.path[0]);
      }

      const noSwipingSelector = params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`;
      const isTargetShadow = !!(e.target && e.target.shadowRoot); // use closestElement for shadow root element to get the actual closest for nested shadow root element

      if (params.noSwiping && (isTargetShadow ? closestElement(noSwipingSelector, e.target) : $targetEl.closest(noSwipingSelector)[0])) {
         swiper.allowClick = true;
         return;
      }

      if (params.swipeHandler) {
         if (!$targetEl.closest(params.swipeHandler)[0]) return;
      }

      touches.currentX = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
      touches.currentY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
      const startX = touches.currentX;
      const startY = touches.currentY; // Do NOT start if iOS edge swipe is detected. Otherwise iOS app cannot swipe-to-go-back anymore

      const edgeSwipeDetection = params.edgeSwipeDetection || params.iOSEdgeSwipeDetection;
      const edgeSwipeThreshold = params.edgeSwipeThreshold || params.iOSEdgeSwipeThreshold;

      if (edgeSwipeDetection && (startX <= edgeSwipeThreshold || startX >= window.innerWidth - edgeSwipeThreshold)) {
         if (edgeSwipeDetection === 'prevent') {
            event.preventDefault();
         } else {
            return;
         }
      }

      Object.assign(data, {
         isTouched: true,
         isMoved: false,
         allowTouchCallbacks: true,
         isScrolling: undefined,
         startMoving: undefined
      });
      touches.startX = startX;
      touches.startY = startY;
      data.touchStartTime = now();
      swiper.allowClick = true;
      swiper.updateSize();
      swiper.swipeDirection = undefined;
      if (params.threshold > 0) data.allowThresholdMove = false;

      if (e.type !== 'touchstart') {
         let preventDefault = true;
         if ($targetEl.is(data.focusableElements)) preventDefault = false;

         if (document.activeElement && $(document.activeElement).is(data.focusableElements) && document.activeElement !== $targetEl[0]) {
            document.activeElement.blur();
         }

         const shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;

         if ((params.touchStartForcePreventDefault || shouldPreventDefault) && !$targetEl[0].isContentEditable) {
            e.preventDefault();
         }
      }

      swiper.emit('touchStart', e);
   }

   function onTouchMove(event) {
      const document = getDocument();
      const swiper = this;
      const data = swiper.touchEventsData;
      const {
         params,
         touches,
         rtlTranslate: rtl,
         enabled
      } = swiper;
      if (!enabled) return;
      let e = event;
      if (e.originalEvent) e = e.originalEvent;

      if (!data.isTouched) {
         if (data.startMoving && data.isScrolling) {
            swiper.emit('touchMoveOpposite', e);
         }

         return;
      }

      if (data.isTouchEvent && e.type !== 'touchmove') return;
      const targetTouch = e.type === 'touchmove' && e.targetTouches && (e.targetTouches[0] || e.changedTouches[0]);
      const pageX = e.type === 'touchmove' ? targetTouch.pageX : e.pageX;
      const pageY = e.type === 'touchmove' ? targetTouch.pageY : e.pageY;

      if (e.preventedByNestedSwiper) {
         touches.startX = pageX;
         touches.startY = pageY;
         return;
      }

      if (!swiper.allowTouchMove) {
         // isMoved = true;
         swiper.allowClick = false;

         if (data.isTouched) {
            Object.assign(touches, {
               startX: pageX,
               startY: pageY,
               currentX: pageX,
               currentY: pageY
            });
            data.touchStartTime = now();
         }

         return;
      }

      if (data.isTouchEvent && params.touchReleaseOnEdges && !params.loop) {
         if (swiper.isVertical()) {
            // Vertical
            if (pageY < touches.startY && swiper.translate <= swiper.maxTranslate() || pageY > touches.startY && swiper.translate >= swiper.minTranslate()) {
               data.isTouched = false;
               data.isMoved = false;
               return;
            }
         } else if (pageX < touches.startX && swiper.translate <= swiper.maxTranslate() || pageX > touches.startX && swiper.translate >= swiper.minTranslate()) {
            return;
         }
      }

      if (data.isTouchEvent && document.activeElement) {
         if (e.target === document.activeElement && $(e.target).is(data.focusableElements)) {
            data.isMoved = true;
            swiper.allowClick = false;
            return;
         }
      }

      if (data.allowTouchCallbacks) {
         swiper.emit('touchMove', e);
      }

      if (e.targetTouches && e.targetTouches.length > 1) return;
      touches.currentX = pageX;
      touches.currentY = pageY;
      const diffX = touches.currentX - touches.startX;
      const diffY = touches.currentY - touches.startY;
      if (swiper.params.threshold && Math.sqrt(diffX ** 2 + diffY ** 2) < swiper.params.threshold) return;

      if (typeof data.isScrolling === 'undefined') {
         let touchAngle;

         if (swiper.isHorizontal() && touches.currentY === touches.startY || swiper.isVertical() && touches.currentX === touches.startX) {
            data.isScrolling = false;
         } else {
            // eslint-disable-next-line
            if (diffX * diffX + diffY * diffY >= 25) {
               touchAngle = Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180 / Math.PI;
               data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
            }
         }
      }

      if (data.isScrolling) {
         swiper.emit('touchMoveOpposite', e);
      }

      if (typeof data.startMoving === 'undefined') {
         if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) {
            data.startMoving = true;
         }
      }

      if (data.isScrolling) {
         data.isTouched = false;
         return;
      }

      if (!data.startMoving) {
         return;
      }

      swiper.allowClick = false;

      if (!params.cssMode && e.cancelable) {
         e.preventDefault();
      }

      if (params.touchMoveStopPropagation && !params.nested) {
         e.stopPropagation();
      }

      if (!data.isMoved) {
         if (params.loop && !params.cssMode) {
            swiper.loopFix();
         }

         data.startTranslate = swiper.getTranslate();
         swiper.setTransition(0);

         if (swiper.animating) {
            swiper.$wrapperEl.trigger('webkitTransitionEnd transitionend');
         }

         data.allowMomentumBounce = false; // Grab Cursor

         if (params.grabCursor && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
            swiper.setGrabCursor(true);
         }

         swiper.emit('sliderFirstMove', e);
      }

      swiper.emit('sliderMove', e);
      data.isMoved = true;
      let diff = swiper.isHorizontal() ? diffX : diffY;
      touches.diff = diff;
      diff *= params.touchRatio;
      if (rtl) diff = -diff;
      swiper.swipeDirection = diff > 0 ? 'prev' : 'next';
      data.currentTranslate = diff + data.startTranslate;
      let disableParentSwiper = true;
      let resistanceRatio = params.resistanceRatio;

      if (params.touchReleaseOnEdges) {
         resistanceRatio = 0;
      }

      if (diff > 0 && data.currentTranslate > swiper.minTranslate()) {
         disableParentSwiper = false;
         if (params.resistance) data.currentTranslate = swiper.minTranslate() - 1 + (-swiper.minTranslate() + data.startTranslate + diff) ** resistanceRatio;
      } else if (diff < 0 && data.currentTranslate < swiper.maxTranslate()) {
         disableParentSwiper = false;
         if (params.resistance) data.currentTranslate = swiper.maxTranslate() + 1 - (swiper.maxTranslate() - data.startTranslate - diff) ** resistanceRatio;
      }

      if (disableParentSwiper) {
         e.preventedByNestedSwiper = true;
      } // Directions locks


      if (!swiper.allowSlideNext && swiper.swipeDirection === 'next' && data.currentTranslate < data.startTranslate) {
         data.currentTranslate = data.startTranslate;
      }

      if (!swiper.allowSlidePrev && swiper.swipeDirection === 'prev' && data.currentTranslate > data.startTranslate) {
         data.currentTranslate = data.startTranslate;
      }

      if (!swiper.allowSlidePrev && !swiper.allowSlideNext) {
         data.currentTranslate = data.startTranslate;
      } // Threshold


      if (params.threshold > 0) {
         if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
            if (!data.allowThresholdMove) {
               data.allowThresholdMove = true;
               touches.startX = touches.currentX;
               touches.startY = touches.currentY;
               data.currentTranslate = data.startTranslate;
               touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
               return;
            }
         } else {
            data.currentTranslate = data.startTranslate;
            return;
         }
      }

      if (!params.followFinger || params.cssMode) return; // Update active index in free mode

      if (params.freeMode && params.freeMode.enabled && swiper.freeMode || params.watchSlidesProgress) {
         swiper.updateActiveIndex();
         swiper.updateSlidesClasses();
      }

      if (swiper.params.freeMode && params.freeMode.enabled && swiper.freeMode) {
         swiper.freeMode.onTouchMove();
      } // Update progress


      swiper.updateProgress(data.currentTranslate); // Update translate

      swiper.setTranslate(data.currentTranslate);
   }

   function onTouchEnd(event) {
      const swiper = this;
      const data = swiper.touchEventsData;
      const {
         params,
         touches,
         rtlTranslate: rtl,
         slidesGrid,
         enabled
      } = swiper;
      if (!enabled) return;
      let e = event;
      if (e.originalEvent) e = e.originalEvent;

      if (data.allowTouchCallbacks) {
         swiper.emit('touchEnd', e);
      }

      data.allowTouchCallbacks = false;

      if (!data.isTouched) {
         if (data.isMoved && params.grabCursor) {
            swiper.setGrabCursor(false);
         }

         data.isMoved = false;
         data.startMoving = false;
         return;
      } // Return Grab Cursor


      if (params.grabCursor && data.isMoved && data.isTouched && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
         swiper.setGrabCursor(false);
      } // Time diff


      const touchEndTime = now();
      const timeDiff = touchEndTime - data.touchStartTime; // Tap, doubleTap, Click

      if (swiper.allowClick) {
         swiper.updateClickedSlide(e);
         swiper.emit('tap click', e);

         if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) {
            swiper.emit('doubleTap doubleClick', e);
         }
      }

      data.lastClickTime = now();
      nextTick(() => {
         if (!swiper.destroyed) swiper.allowClick = true;
      });

      if (!data.isTouched || !data.isMoved || !swiper.swipeDirection || touches.diff === 0 || data.currentTranslate === data.startTranslate) {
         data.isTouched = false;
         data.isMoved = false;
         data.startMoving = false;
         return;
      }

      data.isTouched = false;
      data.isMoved = false;
      data.startMoving = false;
      let currentPos;

      if (params.followFinger) {
         currentPos = rtl ? swiper.translate : -swiper.translate;
      } else {
         currentPos = -data.currentTranslate;
      }

      if (params.cssMode) {
         return;
      }

      if (swiper.params.freeMode && params.freeMode.enabled) {
         swiper.freeMode.onTouchEnd({
            currentPos
         });
         return;
      } // Find current slide


      let stopIndex = 0;
      let groupSize = swiper.slidesSizesGrid[0];

      for (let i = 0; i < slidesGrid.length; i += i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup) {
         const increment = i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;

         if (typeof slidesGrid[i + increment] !== 'undefined') {
            if (currentPos >= slidesGrid[i] && currentPos < slidesGrid[i + increment]) {
               stopIndex = i;
               groupSize = slidesGrid[i + increment] - slidesGrid[i];
            }
         } else if (currentPos >= slidesGrid[i]) {
            stopIndex = i;
            groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
         }
      } // Find current slide size


      const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
      const increment = stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;

      if (timeDiff > params.longSwipesMs) {
         // Long touches
         if (!params.longSwipes) {
            swiper.slideTo(swiper.activeIndex);
            return;
         }

         if (swiper.swipeDirection === 'next') {
            if (ratio >= params.longSwipesRatio) swiper.slideTo(stopIndex + increment); else swiper.slideTo(stopIndex);
         }

         if (swiper.swipeDirection === 'prev') {
            if (ratio > 1 - params.longSwipesRatio) swiper.slideTo(stopIndex + increment); else swiper.slideTo(stopIndex);
         }
      } else {
         // Short swipes
         if (!params.shortSwipes) {
            swiper.slideTo(swiper.activeIndex);
            return;
         }

         const isNavButtonTarget = swiper.navigation && (e.target === swiper.navigation.nextEl || e.target === swiper.navigation.prevEl);

         if (!isNavButtonTarget) {
            if (swiper.swipeDirection === 'next') {
               swiper.slideTo(stopIndex + increment);
            }

            if (swiper.swipeDirection === 'prev') {
               swiper.slideTo(stopIndex);
            }
         } else if (e.target === swiper.navigation.nextEl) {
            swiper.slideTo(stopIndex + increment);
         } else {
            swiper.slideTo(stopIndex);
         }
      }
   }

   function onResize() {
      const swiper = this;
      const {
         params,
         el
      } = swiper;
      if (el && el.offsetWidth === 0) return; // Breakpoints

      if (params.breakpoints) {
         swiper.setBreakpoint();
      } // Save locks


      const {
         allowSlideNext,
         allowSlidePrev,
         snapGrid
      } = swiper; // Disable locks on resize

      swiper.allowSlideNext = true;
      swiper.allowSlidePrev = true;
      swiper.updateSize();
      swiper.updateSlides();
      swiper.updateSlidesClasses();

      if ((params.slidesPerView === 'auto' || params.slidesPerView > 1) && swiper.isEnd && !swiper.isBeginning && !swiper.params.centeredSlides) {
         swiper.slideTo(swiper.slides.length - 1, 0, false, true);
      } else {
         swiper.slideTo(swiper.activeIndex, 0, false, true);
      }

      if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
         swiper.autoplay.run();
      } // Return locks after resize


      swiper.allowSlidePrev = allowSlidePrev;
      swiper.allowSlideNext = allowSlideNext;

      if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) {
         swiper.checkOverflow();
      }
   }

   function onClick(e) {
      const swiper = this;
      if (!swiper.enabled) return;

      if (!swiper.allowClick) {
         if (swiper.params.preventClicks) e.preventDefault();

         if (swiper.params.preventClicksPropagation && swiper.animating) {
            e.stopPropagation();
            e.stopImmediatePropagation();
         }
      }
   }

   function onScroll() {
      const swiper = this;
      const {
         wrapperEl,
         rtlTranslate,
         enabled
      } = swiper;
      if (!enabled) return;
      swiper.previousTranslate = swiper.translate;

      if (swiper.isHorizontal()) {
         swiper.translate = -wrapperEl.scrollLeft;
      } else {
         swiper.translate = -wrapperEl.scrollTop;
      } // eslint-disable-next-line


      if (swiper.translate === -0) swiper.translate = 0;
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
      let newProgress;
      const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();

      if (translatesDiff === 0) {
         newProgress = 0;
      } else {
         newProgress = (swiper.translate - swiper.minTranslate()) / translatesDiff;
      }

      if (newProgress !== swiper.progress) {
         swiper.updateProgress(rtlTranslate ? -swiper.translate : swiper.translate);
      }

      swiper.emit('setTranslate', swiper.translate, false);
   }

   let dummyEventAttached = false;

   function dummyEventListener() { }

   const events = (swiper, method) => {
      const document = getDocument();
      const {
         params,
         touchEvents,
         el,
         wrapperEl,
         device,
         support
      } = swiper;
      const capture = !!params.nested;
      const domMethod = method === 'on' ? 'addEventListener' : 'removeEventListener';
      const swiperMethod = method; // Touch Events

      if (!support.touch) {
         el[domMethod](touchEvents.start, swiper.onTouchStart, false);
         document[domMethod](touchEvents.move, swiper.onTouchMove, capture);
         document[domMethod](touchEvents.end, swiper.onTouchEnd, false);
      } else {
         const passiveListener = touchEvents.start === 'touchstart' && support.passiveListener && params.passiveListeners ? {
            passive: true,
            capture: false
         } : false;
         el[domMethod](touchEvents.start, swiper.onTouchStart, passiveListener);
         el[domMethod](touchEvents.move, swiper.onTouchMove, support.passiveListener ? {
            passive: false,
            capture
         } : capture);
         el[domMethod](touchEvents.end, swiper.onTouchEnd, passiveListener);

         if (touchEvents.cancel) {
            el[domMethod](touchEvents.cancel, swiper.onTouchEnd, passiveListener);
         }
      } // Prevent Links Clicks


      if (params.preventClicks || params.preventClicksPropagation) {
         el[domMethod]('click', swiper.onClick, true);
      }

      if (params.cssMode) {
         wrapperEl[domMethod]('scroll', swiper.onScroll);
      } // Resize handler


      if (params.updateOnWindowResize) {
         swiper[swiperMethod](device.ios || device.android ? 'resize orientationchange observerUpdate' : 'resize observerUpdate', onResize, true);
      } else {
         swiper[swiperMethod]('observerUpdate', onResize, true);
      }
   };

   function attachEvents() {
      const swiper = this;
      const document = getDocument();
      const {
         params,
         support
      } = swiper;
      swiper.onTouchStart = onTouchStart.bind(swiper);
      swiper.onTouchMove = onTouchMove.bind(swiper);
      swiper.onTouchEnd = onTouchEnd.bind(swiper);

      if (params.cssMode) {
         swiper.onScroll = onScroll.bind(swiper);
      }

      swiper.onClick = onClick.bind(swiper);

      if (support.touch && !dummyEventAttached) {
         document.addEventListener('touchstart', dummyEventListener);
         dummyEventAttached = true;
      }

      events(swiper, 'on');
   }

   function detachEvents() {
      const swiper = this;
      events(swiper, 'off');
   }

   var events$1 = {
      attachEvents,
      detachEvents
   };

   const isGridEnabled = (swiper, params) => {
      return swiper.grid && params.grid && params.grid.rows > 1;
   };

   function setBreakpoint() {
      const swiper = this;
      const {
         activeIndex,
         initialized,
         loopedSlides = 0,
         params,
         $el
      } = swiper;
      const breakpoints = params.breakpoints;
      if (!breakpoints || breakpoints && Object.keys(breakpoints).length === 0) return; // Get breakpoint for window width and update parameters

      const breakpoint = swiper.getBreakpoint(breakpoints, swiper.params.breakpointsBase, swiper.el);
      if (!breakpoint || swiper.currentBreakpoint === breakpoint) return;
      const breakpointOnlyParams = breakpoint in breakpoints ? breakpoints[breakpoint] : undefined;
      const breakpointParams = breakpointOnlyParams || swiper.originalParams;
      const wasMultiRow = isGridEnabled(swiper, params);
      const isMultiRow = isGridEnabled(swiper, breakpointParams);
      const wasEnabled = params.enabled;

      if (wasMultiRow && !isMultiRow) {
         $el.removeClass(`${params.containerModifierClass}grid ${params.containerModifierClass}grid-column`);
         swiper.emitContainerClasses();
      } else if (!wasMultiRow && isMultiRow) {
         $el.addClass(`${params.containerModifierClass}grid`);

         if (breakpointParams.grid.fill && breakpointParams.grid.fill === 'column' || !breakpointParams.grid.fill && params.grid.fill === 'column') {
            $el.addClass(`${params.containerModifierClass}grid-column`);
         }

         swiper.emitContainerClasses();
      }

      const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
      const needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);

      if (directionChanged && initialized) {
         swiper.changeDirection();
      }

      extend(swiper.params, breakpointParams);
      const isEnabled = swiper.params.enabled;
      Object.assign(swiper, {
         allowTouchMove: swiper.params.allowTouchMove,
         allowSlideNext: swiper.params.allowSlideNext,
         allowSlidePrev: swiper.params.allowSlidePrev
      });

      if (wasEnabled && !isEnabled) {
         swiper.disable();
      } else if (!wasEnabled && isEnabled) {
         swiper.enable();
      }

      swiper.currentBreakpoint = breakpoint;
      swiper.emit('_beforeBreakpoint', breakpointParams);

      if (needsReLoop && initialized) {
         swiper.loopDestroy();
         swiper.loopCreate();
         swiper.updateSlides();
         swiper.slideTo(activeIndex - loopedSlides + swiper.loopedSlides, 0, false);
      }

      swiper.emit('breakpoint', breakpointParams);
   }

   function getBreakpoint(breakpoints, base = 'window', containerEl) {
      if (!breakpoints || base === 'container' && !containerEl) return undefined;
      let breakpoint = false;
      const window = getWindow();
      const currentHeight = base === 'window' ? window.innerHeight : containerEl.clientHeight;
      const points = Object.keys(breakpoints).map(point => {
         if (typeof point === 'string' && point.indexOf('@') === 0) {
            const minRatio = parseFloat(point.substr(1));
            const value = currentHeight * minRatio;
            return {
               value,
               point
            };
         }

         return {
            value: point,
            point
         };
      });
      points.sort((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10));

      for (let i = 0; i < points.length; i += 1) {
         const {
            point,
            value
         } = points[i];

         if (base === 'window') {
            if (window.matchMedia(`(min-width: ${value}px)`).matches) {
               breakpoint = point;
            }
         } else if (value <= containerEl.clientWidth) {
            breakpoint = point;
         }
      }

      return breakpoint || 'max';
   }

   var breakpoints = {
      setBreakpoint,
      getBreakpoint
   };

   function prepareClasses(entries, prefix) {
      const resultClasses = [];
      entries.forEach(item => {
         if (typeof item === 'object') {
            Object.keys(item).forEach(classNames => {
               if (item[classNames]) {
                  resultClasses.push(prefix + classNames);
               }
            });
         } else if (typeof item === 'string') {
            resultClasses.push(prefix + item);
         }
      });
      return resultClasses;
   }

   function addClasses() {
      const swiper = this;
      const {
         classNames,
         params,
         rtl,
         $el,
         device,
         support
      } = swiper; // prettier-ignore

      const suffixes = prepareClasses(['initialized', params.direction, {
         'pointer-events': !support.touch
      }, {
            'free-mode': swiper.params.freeMode && params.freeMode.enabled
         }, {
            'autoheight': params.autoHeight
         }, {
            'rtl': rtl
         }, {
            'grid': params.grid && params.grid.rows > 1
         }, {
            'grid-column': params.grid && params.grid.rows > 1 && params.grid.fill === 'column'
         }, {
            'android': device.android
         }, {
            'ios': device.ios
         }, {
            'css-mode': params.cssMode
         }, {
            'centered': params.cssMode && params.centeredSlides
         }], params.containerModifierClass);
      classNames.push(...suffixes);
      $el.addClass([...classNames].join(' '));
      swiper.emitContainerClasses();
   }

   function removeClasses() {
      const swiper = this;
      const {
         $el,
         classNames
      } = swiper;
      $el.removeClass(classNames.join(' '));
      swiper.emitContainerClasses();
   }

   var classes = {
      addClasses,
      removeClasses
   };

   function loadImage(imageEl, src, srcset, sizes, checkForComplete, callback) {
      const window = getWindow();
      let image;

      function onReady() {
         if (callback) callback();
      }

      const isPicture = $(imageEl).parent('picture')[0];

      if (!isPicture && (!imageEl.complete || !checkForComplete)) {
         if (src) {
            image = new window.Image();
            image.onload = onReady;
            image.onerror = onReady;

            if (sizes) {
               image.sizes = sizes;
            }

            if (srcset) {
               image.srcset = srcset;
            }

            if (src) {
               image.src = src;
            }
         } else {
            onReady();
         }
      } else {
         // image already loaded...
         onReady();
      }
   }

   function preloadImages() {
      const swiper = this;
      swiper.imagesToLoad = swiper.$el.find('img');

      function onReady() {
         if (typeof swiper === 'undefined' || swiper === null || !swiper || swiper.destroyed) return;
         if (swiper.imagesLoaded !== undefined) swiper.imagesLoaded += 1;

         if (swiper.imagesLoaded === swiper.imagesToLoad.length) {
            if (swiper.params.updateOnImagesReady) swiper.update();
            swiper.emit('imagesReady');
         }
      }

      for (let i = 0; i < swiper.imagesToLoad.length; i += 1) {
         const imageEl = swiper.imagesToLoad[i];
         swiper.loadImage(imageEl, imageEl.currentSrc || imageEl.getAttribute('src'), imageEl.srcset || imageEl.getAttribute('srcset'), imageEl.sizes || imageEl.getAttribute('sizes'), true, onReady);
      }
   }

   var images = {
      loadImage,
      preloadImages
   };

   function checkOverflow() {
      const swiper = this;
      const {
         isLocked: wasLocked,
         params
      } = swiper;
      const {
         slidesOffsetBefore
      } = params;

      if (slidesOffsetBefore) {
         const lastSlideIndex = swiper.slides.length - 1;
         const lastSlideRightEdge = swiper.slidesGrid[lastSlideIndex] + swiper.slidesSizesGrid[lastSlideIndex] + slidesOffsetBefore * 2;
         swiper.isLocked = swiper.size > lastSlideRightEdge;
      } else {
         swiper.isLocked = swiper.snapGrid.length === 1;
      }

      if (params.allowSlideNext === true) {
         swiper.allowSlideNext = !swiper.isLocked;
      }

      if (params.allowSlidePrev === true) {
         swiper.allowSlidePrev = !swiper.isLocked;
      }

      if (wasLocked && wasLocked !== swiper.isLocked) {
         swiper.isEnd = false;
      }

      if (wasLocked !== swiper.isLocked) {
         swiper.emit(swiper.isLocked ? 'lock' : 'unlock');
      }
   }

   var checkOverflow$1 = {
      checkOverflow
   };

   var defaults = {
      init: true,
      direction: 'horizontal',
      touchEventsTarget: 'wrapper',
      initialSlide: 0,
      speed: 300,
      cssMode: false,
      updateOnWindowResize: true,
      resizeObserver: true,
      nested: false,
      createElements: false,
      enabled: true,
      focusableElements: 'input, select, option, textarea, button, video, label',
      // Overrides
      width: null,
      height: null,
      //
      preventInteractionOnTransition: false,
      // ssr
      userAgent: null,
      url: null,
      // To support iOS's swipe-to-go-back gesture (when being used in-app).
      edgeSwipeDetection: false,
      edgeSwipeThreshold: 20,
      // Autoheight
      autoHeight: false,
      // Set wrapper width
      setWrapperSize: false,
      // Virtual Translate
      virtualTranslate: false,
      // Effects
      effect: 'slide',
      // 'slide' or 'fade' or 'cube' or 'coverflow' or 'flip'
      // Breakpoints
      breakpoints: undefined,
      breakpointsBase: 'window',
      // Slides grid
      spaceBetween: 0,
      slidesPerView: 1,
      slidesPerGroup: 1,
      slidesPerGroupSkip: 0,
      slidesPerGroupAuto: false,
      centeredSlides: false,
      centeredSlidesBounds: false,
      slidesOffsetBefore: 0,
      // in px
      slidesOffsetAfter: 0,
      // in px
      normalizeSlideIndex: true,
      centerInsufficientSlides: false,
      // Disable swiper and hide navigation when container not overflow
      watchOverflow: true,
      // Round length
      roundLengths: false,
      // Touches
      touchRatio: 1,
      touchAngle: 45,
      simulateTouch: true,
      shortSwipes: true,
      longSwipes: true,
      longSwipesRatio: 0.5,
      longSwipesMs: 300,
      followFinger: true,
      allowTouchMove: true,
      threshold: 0,
      touchMoveStopPropagation: false,
      touchStartPreventDefault: true,
      touchStartForcePreventDefault: false,
      touchReleaseOnEdges: false,
      // Unique Navigation Elements
      uniqueNavElements: true,
      // Resistance
      resistance: true,
      resistanceRatio: 0.85,
      // Progress
      watchSlidesProgress: false,
      // Cursor
      grabCursor: false,
      // Clicks
      preventClicks: true,
      preventClicksPropagation: true,
      slideToClickedSlide: false,
      // Images
      preloadImages: true,
      updateOnImagesReady: true,
      // loop
      loop: false,
      loopAdditionalSlides: 0,
      loopedSlides: null,
      loopFillGroupWithBlank: false,
      loopPreventsSlide: true,
      // Swiping/no swiping
      allowSlidePrev: true,
      allowSlideNext: true,
      swipeHandler: null,
      // '.swipe-handler',
      noSwiping: true,
      noSwipingClass: 'swiper-no-swiping',
      noSwipingSelector: null,
      // Passive Listeners
      passiveListeners: true,
      // NS
      containerModifierClass: 'swiper-',
      // NEW
      slideClass: 'swiper-slide',
      slideBlankClass: 'swiper-slide-invisible-blank',
      slideActiveClass: 'swiper-slide-active',
      slideDuplicateActiveClass: 'swiper-slide-duplicate-active',
      slideVisibleClass: 'swiper-slide-visible',
      slideDuplicateClass: 'swiper-slide-duplicate',
      slideNextClass: 'swiper-slide-next',
      slideDuplicateNextClass: 'swiper-slide-duplicate-next',
      slidePrevClass: 'swiper-slide-prev',
      slideDuplicatePrevClass: 'swiper-slide-duplicate-prev',
      wrapperClass: 'swiper-wrapper',
      // Callbacks
      runCallbacksOnInit: true,
      // Internals
      _emitClasses: false
   };

   function moduleExtendParams(params, allModulesParams) {
      return function extendParams(obj = {}) {
         const moduleParamName = Object.keys(obj)[0];
         const moduleParams = obj[moduleParamName];

         if (typeof moduleParams !== 'object' || moduleParams === null) {
            extend(allModulesParams, obj);
            return;
         }

         if (['navigation', 'pagination', 'scrollbar'].indexOf(moduleParamName) >= 0 && params[moduleParamName] === true) {
            params[moduleParamName] = {
               auto: true
            };
         }

         if (!(moduleParamName in params && 'enabled' in moduleParams)) {
            extend(allModulesParams, obj);
            return;
         }

         if (params[moduleParamName] === true) {
            params[moduleParamName] = {
               enabled: true
            };
         }

         if (typeof params[moduleParamName] === 'object' && !('enabled' in params[moduleParamName])) {
            params[moduleParamName].enabled = true;
         }

         if (!params[moduleParamName]) params[moduleParamName] = {
            enabled: false
         };
         extend(allModulesParams, obj);
      };
   }

   /* eslint no-param-reassign: "off" */
   const prototypes = {
      eventsEmitter,
      update,
      translate,
      transition,
      slide,
      loop,
      grabCursor,
      events: events$1,
      breakpoints,
      checkOverflow: checkOverflow$1,
      classes,
      images
   };
   const extendedDefaults = {};

   class Swiper {
      constructor(...args) {
         let el;
         let params;

         if (args.length === 1 && args[0].constructor && Object.prototype.toString.call(args[0]).slice(8, -1) === 'Object') {
            params = args[0];
         } else {
            [el, params] = args;
         }

         if (!params) params = {};
         params = extend({}, params);
         if (el && !params.el) params.el = el;

         if (params.el && $(params.el).length > 1) {
            const swipers = [];
            $(params.el).each(containerEl => {
               const newParams = extend({}, params, {
                  el: containerEl
               });
               swipers.push(new Swiper(newParams));
            });
            return swipers;
         } // Swiper Instance


         const swiper = this;
         swiper.__swiper__ = true;
         swiper.support = getSupport();
         swiper.device = getDevice({
            userAgent: params.userAgent
         });
         swiper.browser = getBrowser();
         swiper.eventsListeners = {};
         swiper.eventsAnyListeners = [];
         swiper.modules = [...swiper.__modules__];

         if (params.modules && Array.isArray(params.modules)) {
            swiper.modules.push(...params.modules);
         }

         const allModulesParams = {};
         swiper.modules.forEach(mod => {
            mod({
               swiper,
               extendParams: moduleExtendParams(params, allModulesParams),
               on: swiper.on.bind(swiper),
               once: swiper.once.bind(swiper),
               off: swiper.off.bind(swiper),
               emit: swiper.emit.bind(swiper)
            });
         }); // Extend defaults with modules params

         const swiperParams = extend({}, defaults, allModulesParams); // Extend defaults with passed params

         swiper.params = extend({}, swiperParams, extendedDefaults, params);
         swiper.originalParams = extend({}, swiper.params);
         swiper.passedParams = extend({}, params); // add event listeners

         if (swiper.params && swiper.params.on) {
            Object.keys(swiper.params.on).forEach(eventName => {
               swiper.on(eventName, swiper.params.on[eventName]);
            });
         }

         if (swiper.params && swiper.params.onAny) {
            swiper.onAny(swiper.params.onAny);
         } // Save Dom lib


         swiper.$ = $; // Extend Swiper

         Object.assign(swiper, {
            enabled: swiper.params.enabled,
            el,
            // Classes
            classNames: [],
            // Slides
            slides: $(),
            slidesGrid: [],
            snapGrid: [],
            slidesSizesGrid: [],

            // isDirection
            isHorizontal() {
               return swiper.params.direction === 'horizontal';
            },

            isVertical() {
               return swiper.params.direction === 'vertical';
            },

            // Indexes
            activeIndex: 0,
            realIndex: 0,
            //
            isBeginning: true,
            isEnd: false,
            // Props
            translate: 0,
            previousTranslate: 0,
            progress: 0,
            velocity: 0,
            animating: false,
            // Locks
            allowSlideNext: swiper.params.allowSlideNext,
            allowSlidePrev: swiper.params.allowSlidePrev,
            // Touch Events
            touchEvents: function touchEvents() {
               const touch = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
               const desktop = ['pointerdown', 'pointermove', 'pointerup'];
               swiper.touchEventsTouch = {
                  start: touch[0],
                  move: touch[1],
                  end: touch[2],
                  cancel: touch[3]
               };
               swiper.touchEventsDesktop = {
                  start: desktop[0],
                  move: desktop[1],
                  end: desktop[2]
               };
               return swiper.support.touch || !swiper.params.simulateTouch ? swiper.touchEventsTouch : swiper.touchEventsDesktop;
            }(),
            touchEventsData: {
               isTouched: undefined,
               isMoved: undefined,
               allowTouchCallbacks: undefined,
               touchStartTime: undefined,
               isScrolling: undefined,
               currentTranslate: undefined,
               startTranslate: undefined,
               allowThresholdMove: undefined,
               // Form elements to match
               focusableElements: swiper.params.focusableElements,
               // Last click time
               lastClickTime: now(),
               clickTimeout: undefined,
               // Velocities
               velocities: [],
               allowMomentumBounce: undefined,
               isTouchEvent: undefined,
               startMoving: undefined
            },
            // Clicks
            allowClick: true,
            // Touches
            allowTouchMove: swiper.params.allowTouchMove,
            touches: {
               startX: 0,
               startY: 0,
               currentX: 0,
               currentY: 0,
               diff: 0
            },
            // Images
            imagesToLoad: [],
            imagesLoaded: 0
         });
         swiper.emit('_swiper'); // Init

         if (swiper.params.init) {
            swiper.init();
         } // Return app instance


         return swiper;
      }

      enable() {
         const swiper = this;
         if (swiper.enabled) return;
         swiper.enabled = true;

         if (swiper.params.grabCursor) {
            swiper.setGrabCursor();
         }

         swiper.emit('enable');
      }

      disable() {
         const swiper = this;
         if (!swiper.enabled) return;
         swiper.enabled = false;

         if (swiper.params.grabCursor) {
            swiper.unsetGrabCursor();
         }

         swiper.emit('disable');
      }

      setProgress(progress, speed) {
         const swiper = this;
         progress = Math.min(Math.max(progress, 0), 1);
         const min = swiper.minTranslate();
         const max = swiper.maxTranslate();
         const current = (max - min) * progress + min;
         swiper.translateTo(current, typeof speed === 'undefined' ? 0 : speed);
         swiper.updateActiveIndex();
         swiper.updateSlidesClasses();
      }

      emitContainerClasses() {
         const swiper = this;
         if (!swiper.params._emitClasses || !swiper.el) return;
         const cls = swiper.el.className.split(' ').filter(className => {
            return className.indexOf('swiper') === 0 || className.indexOf(swiper.params.containerModifierClass) === 0;
         });
         swiper.emit('_containerClasses', cls.join(' '));
      }

      getSlideClasses(slideEl) {
         const swiper = this;
         return slideEl.className.split(' ').filter(className => {
            return className.indexOf('swiper-slide') === 0 || className.indexOf(swiper.params.slideClass) === 0;
         }).join(' ');
      }

      emitSlidesClasses() {
         const swiper = this;
         if (!swiper.params._emitClasses || !swiper.el) return;
         const updates = [];
         swiper.slides.each(slideEl => {
            const classNames = swiper.getSlideClasses(slideEl);
            updates.push({
               slideEl,
               classNames
            });
            swiper.emit('_slideClass', slideEl, classNames);
         });
         swiper.emit('_slideClasses', updates);
      }

      slidesPerViewDynamic(view = 'current', exact = false) {
         const swiper = this;
         const {
            params,
            slides,
            slidesGrid,
            slidesSizesGrid,
            size: swiperSize,
            activeIndex
         } = swiper;
         let spv = 1;

         if (params.centeredSlides) {
            let slideSize = slides[activeIndex].swiperSlideSize;
            let breakLoop;

            for (let i = activeIndex + 1; i < slides.length; i += 1) {
               if (slides[i] && !breakLoop) {
                  slideSize += slides[i].swiperSlideSize;
                  spv += 1;
                  if (slideSize > swiperSize) breakLoop = true;
               }
            }

            for (let i = activeIndex - 1; i >= 0; i -= 1) {
               if (slides[i] && !breakLoop) {
                  slideSize += slides[i].swiperSlideSize;
                  spv += 1;
                  if (slideSize > swiperSize) breakLoop = true;
               }
            }
         } else {
            // eslint-disable-next-line
            if (view === 'current') {
               for (let i = activeIndex + 1; i < slides.length; i += 1) {
                  const slideInView = exact ? slidesGrid[i] + slidesSizesGrid[i] - slidesGrid[activeIndex] < swiperSize : slidesGrid[i] - slidesGrid[activeIndex] < swiperSize;

                  if (slideInView) {
                     spv += 1;
                  }
               }
            } else {
               // previous
               for (let i = activeIndex - 1; i >= 0; i -= 1) {
                  const slideInView = slidesGrid[activeIndex] - slidesGrid[i] < swiperSize;

                  if (slideInView) {
                     spv += 1;
                  }
               }
            }
         }

         return spv;
      }

      update() {
         const swiper = this;
         if (!swiper || swiper.destroyed) return;
         const {
            snapGrid,
            params
         } = swiper; // Breakpoints

         if (params.breakpoints) {
            swiper.setBreakpoint();
         }

         swiper.updateSize();
         swiper.updateSlides();
         swiper.updateProgress();
         swiper.updateSlidesClasses();

         function setTranslate() {
            const translateValue = swiper.rtlTranslate ? swiper.translate * -1 : swiper.translate;
            const newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
            swiper.setTranslate(newTranslate);
            swiper.updateActiveIndex();
            swiper.updateSlidesClasses();
         }

         let translated;

         if (swiper.params.freeMode && swiper.params.freeMode.enabled) {
            setTranslate();

            if (swiper.params.autoHeight) {
               swiper.updateAutoHeight();
            }
         } else {
            if ((swiper.params.slidesPerView === 'auto' || swiper.params.slidesPerView > 1) && swiper.isEnd && !swiper.params.centeredSlides) {
               translated = swiper.slideTo(swiper.slides.length - 1, 0, false, true);
            } else {
               translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
            }

            if (!translated) {
               setTranslate();
            }
         }

         if (params.watchOverflow && snapGrid !== swiper.snapGrid) {
            swiper.checkOverflow();
         }

         swiper.emit('update');
      }

      changeDirection(newDirection, needUpdate = true) {
         const swiper = this;
         const currentDirection = swiper.params.direction;

         if (!newDirection) {
            // eslint-disable-next-line
            newDirection = currentDirection === 'horizontal' ? 'vertical' : 'horizontal';
         }

         if (newDirection === currentDirection || newDirection !== 'horizontal' && newDirection !== 'vertical') {
            return swiper;
         }

         swiper.$el.removeClass(`${swiper.params.containerModifierClass}${currentDirection}`).addClass(`${swiper.params.containerModifierClass}${newDirection}`);
         swiper.emitContainerClasses();
         swiper.params.direction = newDirection;
         swiper.slides.each(slideEl => {
            if (newDirection === 'vertical') {
               slideEl.style.width = '';
            } else {
               slideEl.style.height = '';
            }
         });
         swiper.emit('changeDirection');
         if (needUpdate) swiper.update();
         return swiper;
      }

      mount(el) {
         const swiper = this;
         if (swiper.mounted) return true; // Find el

         const $el = $(el || swiper.params.el);
         el = $el[0];

         if (!el) {
            return false;
         }

         el.swiper = swiper;

         const getWrapperSelector = () => {
            return `.${(swiper.params.wrapperClass || '').trim().split(' ').join('.')}`;
         };

         const getWrapper = () => {
            if (el && el.shadowRoot && el.shadowRoot.querySelector) {
               const res = $(el.shadowRoot.querySelector(getWrapperSelector())); // Children needs to return slot items

               res.children = options => $el.children(options);

               return res;
            }

            return $el.children(getWrapperSelector());
         }; // Find Wrapper


         let $wrapperEl = getWrapper();

         if ($wrapperEl.length === 0 && swiper.params.createElements) {
            const document = getDocument();
            const wrapper = document.createElement('div');
            $wrapperEl = $(wrapper);
            wrapper.className = swiper.params.wrapperClass;
            $el.append(wrapper);
            $el.children(`.${swiper.params.slideClass}`).each(slideEl => {
               $wrapperEl.append(slideEl);
            });
         }

         Object.assign(swiper, {
            $el,
            el,
            $wrapperEl,
            wrapperEl: $wrapperEl[0],
            mounted: true,
            // RTL
            rtl: el.dir.toLowerCase() === 'rtl' || $el.css('direction') === 'rtl',
            rtlTranslate: swiper.params.direction === 'horizontal' && (el.dir.toLowerCase() === 'rtl' || $el.css('direction') === 'rtl'),
            wrongRTL: $wrapperEl.css('display') === '-webkit-box'
         });
         return true;
      }

      init(el) {
         const swiper = this;
         if (swiper.initialized) return swiper;
         const mounted = swiper.mount(el);
         if (mounted === false) return swiper;
         swiper.emit('beforeInit'); // Set breakpoint

         if (swiper.params.breakpoints) {
            swiper.setBreakpoint();
         } // Add Classes


         swiper.addClasses(); // Create loop

         if (swiper.params.loop) {
            swiper.loopCreate();
         } // Update size


         swiper.updateSize(); // Update slides

         swiper.updateSlides();

         if (swiper.params.watchOverflow) {
            swiper.checkOverflow();
         } // Set Grab Cursor


         if (swiper.params.grabCursor && swiper.enabled) {
            swiper.setGrabCursor();
         }

         if (swiper.params.preloadImages) {
            swiper.preloadImages();
         } // Slide To Initial Slide


         if (swiper.params.loop) {
            swiper.slideTo(swiper.params.initialSlide + swiper.loopedSlides, 0, swiper.params.runCallbacksOnInit, false, true);
         } else {
            swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit, false, true);
         } // Attach events


         swiper.attachEvents(); // Init Flag

         swiper.initialized = true; // Emit

         swiper.emit('init');
         swiper.emit('afterInit');
         return swiper;
      }

      destroy(deleteInstance = true, cleanStyles = true) {
         const swiper = this;
         const {
            params,
            $el,
            $wrapperEl,
            slides
         } = swiper;

         if (typeof swiper.params === 'undefined' || swiper.destroyed) {
            return null;
         }

         swiper.emit('beforeDestroy'); // Init Flag

         swiper.initialized = false; // Detach events

         swiper.detachEvents(); // Destroy loop

         if (params.loop) {
            swiper.loopDestroy();
         } // Cleanup styles


         if (cleanStyles) {
            swiper.removeClasses();
            $el.removeAttr('style');
            $wrapperEl.removeAttr('style');

            if (slides && slides.length) {
               slides.removeClass([params.slideVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass].join(' ')).removeAttr('style').removeAttr('data-swiper-slide-index');
            }
         }

         swiper.emit('destroy'); // Detach emitter events

         Object.keys(swiper.eventsListeners).forEach(eventName => {
            swiper.off(eventName);
         });

         if (deleteInstance !== false) {
            swiper.$el[0].swiper = null;
            deleteProps(swiper);
         }

         swiper.destroyed = true;
         return null;
      }

      static extendDefaults(newDefaults) {
         extend(extendedDefaults, newDefaults);
      }

      static get extendedDefaults() {
         return extendedDefaults;
      }

      static get defaults() {
         return defaults;
      }

      static installModule(mod) {
         if (!Swiper.prototype.__modules__) Swiper.prototype.__modules__ = [];
         const modules = Swiper.prototype.__modules__;

         if (typeof mod === 'function' && modules.indexOf(mod) < 0) {
            modules.push(mod);
         }
      }

      static use(module) {
         if (Array.isArray(module)) {
            module.forEach(m => Swiper.installModule(m));
            return Swiper;
         }

         Swiper.installModule(module);
         return Swiper;
      }

   }

   Object.keys(prototypes).forEach(prototypeGroup => {
      Object.keys(prototypes[prototypeGroup]).forEach(protoMethod => {
         Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
      });
   });
   Swiper.use([Resize, Observer]);

   function Virtual({
      swiper,
      extendParams,
      on
   }) {
      extendParams({
         virtual: {
            enabled: false,
            slides: [],
            cache: true,
            renderSlide: null,
            renderExternal: null,
            renderExternalUpdate: true,
            addSlidesBefore: 0,
            addSlidesAfter: 0
         }
      });
      swiper.virtual = {
         cache: {},
         from: undefined,
         to: undefined,
         slides: [],
         offset: 0,
         slidesGrid: []
      };

      function renderSlide(slide, index) {
         const params = swiper.params.virtual;

         if (params.cache && swiper.virtual.cache[index]) {
            return swiper.virtual.cache[index];
         }

         const $slideEl = params.renderSlide ? $(params.renderSlide.call(swiper, slide, index)) : $(`<div class="${swiper.params.slideClass}" data-swiper-slide-index="${index}">${slide}</div>`);
         if (!$slideEl.attr('data-swiper-slide-index')) $slideEl.attr('data-swiper-slide-index', index);
         if (params.cache) swiper.virtual.cache[index] = $slideEl;
         return $slideEl;
      }

      function update(force) {
         const {
            slidesPerView,
            slidesPerGroup,
            centeredSlides
         } = swiper.params;
         const {
            addSlidesBefore,
            addSlidesAfter
         } = swiper.params.virtual;
         const {
            from: previousFrom,
            to: previousTo,
            slides,
            slidesGrid: previousSlidesGrid,
            offset: previousOffset
         } = swiper.virtual;
         swiper.updateActiveIndex();
         const activeIndex = swiper.activeIndex || 0;
         let offsetProp;
         if (swiper.rtlTranslate) offsetProp = 'right'; else offsetProp = swiper.isHorizontal() ? 'left' : 'top';
         let slidesAfter;
         let slidesBefore;

         if (centeredSlides) {
            slidesAfter = Math.floor(slidesPerView / 2) + slidesPerGroup + addSlidesAfter;
            slidesBefore = Math.floor(slidesPerView / 2) + slidesPerGroup + addSlidesBefore;
         } else {
            slidesAfter = slidesPerView + (slidesPerGroup - 1) + addSlidesAfter;
            slidesBefore = slidesPerGroup + addSlidesBefore;
         }

         const from = Math.max((activeIndex || 0) - slidesBefore, 0);
         const to = Math.min((activeIndex || 0) + slidesAfter, slides.length - 1);
         const offset = (swiper.slidesGrid[from] || 0) - (swiper.slidesGrid[0] || 0);
         Object.assign(swiper.virtual, {
            from,
            to,
            offset,
            slidesGrid: swiper.slidesGrid
         });

         function onRendered() {
            swiper.updateSlides();
            swiper.updateProgress();
            swiper.updateSlidesClasses();

            if (swiper.lazy && swiper.params.lazy.enabled) {
               swiper.lazy.load();
            }
         }

         if (previousFrom === from && previousTo === to && !force) {
            if (swiper.slidesGrid !== previousSlidesGrid && offset !== previousOffset) {
               swiper.slides.css(offsetProp, `${offset}px`);
            }

            swiper.updateProgress();
            return;
         }

         if (swiper.params.virtual.renderExternal) {
            swiper.params.virtual.renderExternal.call(swiper, {
               offset,
               from,
               to,
               slides: function getSlides() {
                  const slidesToRender = [];

                  for (let i = from; i <= to; i += 1) {
                     slidesToRender.push(slides[i]);
                  }

                  return slidesToRender;
               }()
            });

            if (swiper.params.virtual.renderExternalUpdate) {
               onRendered();
            }

            return;
         }

         const prependIndexes = [];
         const appendIndexes = [];

         if (force) {
            swiper.$wrapperEl.find(`.${swiper.params.slideClass}`).remove();
         } else {
            for (let i = previousFrom; i <= previousTo; i += 1) {
               if (i < from || i > to) {
                  swiper.$wrapperEl.find(`.${swiper.params.slideClass}[data-swiper-slide-index="${i}"]`).remove();
               }
            }
         }

         for (let i = 0; i < slides.length; i += 1) {
            if (i >= from && i <= to) {
               if (typeof previousTo === 'undefined' || force) {
                  appendIndexes.push(i);
               } else {
                  if (i > previousTo) appendIndexes.push(i);
                  if (i < previousFrom) prependIndexes.push(i);
               }
            }
         }

         appendIndexes.forEach(index => {
            swiper.$wrapperEl.append(renderSlide(slides[index], index));
         });
         prependIndexes.sort((a, b) => b - a).forEach(index => {
            swiper.$wrapperEl.prepend(renderSlide(slides[index], index));
         });
         swiper.$wrapperEl.children('.swiper-slide').css(offsetProp, `${offset}px`);
         onRendered();
      }

      function appendSlide(slides) {
         if (typeof slides === 'object' && 'length' in slides) {
            for (let i = 0; i < slides.length; i += 1) {
               if (slides[i]) swiper.virtual.slides.push(slides[i]);
            }
         } else {
            swiper.virtual.slides.push(slides);
         }

         update(true);
      }

      function prependSlide(slides) {
         const activeIndex = swiper.activeIndex;
         let newActiveIndex = activeIndex + 1;
         let numberOfNewSlides = 1;

         if (Array.isArray(slides)) {
            for (let i = 0; i < slides.length; i += 1) {
               if (slides[i]) swiper.virtual.slides.unshift(slides[i]);
            }

            newActiveIndex = activeIndex + slides.length;
            numberOfNewSlides = slides.length;
         } else {
            swiper.virtual.slides.unshift(slides);
         }

         if (swiper.params.virtual.cache) {
            const cache = swiper.virtual.cache;
            const newCache = {};
            Object.keys(cache).forEach(cachedIndex => {
               const $cachedEl = cache[cachedIndex];
               const cachedElIndex = $cachedEl.attr('data-swiper-slide-index');

               if (cachedElIndex) {
                  $cachedEl.attr('data-swiper-slide-index', parseInt(cachedElIndex, 10) + 1);
               }

               newCache[parseInt(cachedIndex, 10) + numberOfNewSlides] = $cachedEl;
            });
            swiper.virtual.cache = newCache;
         }

         update(true);
         swiper.slideTo(newActiveIndex, 0);
      }

      function removeSlide(slidesIndexes) {
         if (typeof slidesIndexes === 'undefined' || slidesIndexes === null) return;
         let activeIndex = swiper.activeIndex;

         if (Array.isArray(slidesIndexes)) {
            for (let i = slidesIndexes.length - 1; i >= 0; i -= 1) {
               swiper.virtual.slides.splice(slidesIndexes[i], 1);

               if (swiper.params.virtual.cache) {
                  delete swiper.virtual.cache[slidesIndexes[i]];
               }

               if (slidesIndexes[i] < activeIndex) activeIndex -= 1;
               activeIndex = Math.max(activeIndex, 0);
            }
         } else {
            swiper.virtual.slides.splice(slidesIndexes, 1);

            if (swiper.params.virtual.cache) {
               delete swiper.virtual.cache[slidesIndexes];
            }

            if (slidesIndexes < activeIndex) activeIndex -= 1;
            activeIndex = Math.max(activeIndex, 0);
         }

         update(true);
         swiper.slideTo(activeIndex, 0);
      }

      function removeAllSlides() {
         swiper.virtual.slides = [];

         if (swiper.params.virtual.cache) {
            swiper.virtual.cache = {};
         }

         update(true);
         swiper.slideTo(0, 0);
      }

      on('beforeInit', () => {
         if (!swiper.params.virtual.enabled) return;
         swiper.virtual.slides = swiper.params.virtual.slides;
         swiper.classNames.push(`${swiper.params.containerModifierClass}virtual`);
         swiper.params.watchSlidesProgress = true;
         swiper.originalParams.watchSlidesProgress = true;

         if (!swiper.params.initialSlide) {
            update();
         }
      });
      on('setTranslate', () => {
         if (!swiper.params.virtual.enabled) return;
         update();
      });
      on('init update resize', () => {
         if (!swiper.params.virtual.enabled) return;

         if (swiper.params.cssMode) {
            setCSSProperty(swiper.wrapperEl, '--swiper-virtual-size', `${swiper.virtualSize}px`);
         }
      });
      Object.assign(swiper.virtual, {
         appendSlide,
         prependSlide,
         removeSlide,
         removeAllSlides,
         update
      });
   }

   /* eslint-disable consistent-return */
   function Keyboard({
      swiper,
      extendParams,
      on,
      emit
   }) {
      const document = getDocument();
      const window = getWindow();
      swiper.keyboard = {
         enabled: false
      };
      extendParams({
         keyboard: {
            enabled: false,
            onlyInViewport: true,
            pageUpDown: true
         }
      });

      function handle(event) {
         if (!swiper.enabled) return;
         const {
            rtlTranslate: rtl
         } = swiper;
         let e = event;
         if (e.originalEvent) e = e.originalEvent; // jquery fix

         const kc = e.keyCode || e.charCode;
         const pageUpDown = swiper.params.keyboard.pageUpDown;
         const isPageUp = pageUpDown && kc === 33;
         const isPageDown = pageUpDown && kc === 34;
         const isArrowLeft = kc === 37;
         const isArrowRight = kc === 39;
         const isArrowUp = kc === 38;
         const isArrowDown = kc === 40; // Directions locks

         if (!swiper.allowSlideNext && (swiper.isHorizontal() && isArrowRight || swiper.isVertical() && isArrowDown || isPageDown)) {
            return false;
         }

         if (!swiper.allowSlidePrev && (swiper.isHorizontal() && isArrowLeft || swiper.isVertical() && isArrowUp || isPageUp)) {
            return false;
         }

         if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) {
            return undefined;
         }

         if (document.activeElement && document.activeElement.nodeName && (document.activeElement.nodeName.toLowerCase() === 'input' || document.activeElement.nodeName.toLowerCase() === 'textarea')) {
            return undefined;
         }

         if (swiper.params.keyboard.onlyInViewport && (isPageUp || isPageDown || isArrowLeft || isArrowRight || isArrowUp || isArrowDown)) {
            let inView = false; // Check that swiper should be inside of visible area of window

            if (swiper.$el.parents(`.${swiper.params.slideClass}`).length > 0 && swiper.$el.parents(`.${swiper.params.slideActiveClass}`).length === 0) {
               return undefined;
            }

            const $el = swiper.$el;
            const swiperWidth = $el[0].clientWidth;
            const swiperHeight = $el[0].clientHeight;
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            const swiperOffset = swiper.$el.offset();
            if (rtl) swiperOffset.left -= swiper.$el[0].scrollLeft;
            const swiperCoord = [[swiperOffset.left, swiperOffset.top], [swiperOffset.left + swiperWidth, swiperOffset.top], [swiperOffset.left, swiperOffset.top + swiperHeight], [swiperOffset.left + swiperWidth, swiperOffset.top + swiperHeight]];

            for (let i = 0; i < swiperCoord.length; i += 1) {
               const point = swiperCoord[i];

               if (point[0] >= 0 && point[0] <= windowWidth && point[1] >= 0 && point[1] <= windowHeight) {
                  if (point[0] === 0 && point[1] === 0) continue; // eslint-disable-line

                  inView = true;
               }
            }

            if (!inView) return undefined;
         }

         if (swiper.isHorizontal()) {
            if (isPageUp || isPageDown || isArrowLeft || isArrowRight) {
               if (e.preventDefault) e.preventDefault(); else e.returnValue = false;
            }

            if ((isPageDown || isArrowRight) && !rtl || (isPageUp || isArrowLeft) && rtl) swiper.slideNext();
            if ((isPageUp || isArrowLeft) && !rtl || (isPageDown || isArrowRight) && rtl) swiper.slidePrev();
         } else {
            if (isPageUp || isPageDown || isArrowUp || isArrowDown) {
               if (e.preventDefault) e.preventDefault(); else e.returnValue = false;
            }

            if (isPageDown || isArrowDown) swiper.slideNext();
            if (isPageUp || isArrowUp) swiper.slidePrev();
         }

         emit('keyPress', kc);
         return undefined;
      }

      function enable() {
         if (swiper.keyboard.enabled) return;
         $(document).on('keydown', handle);
         swiper.keyboard.enabled = true;
      }

      function disable() {
         if (!swiper.keyboard.enabled) return;
         $(document).off('keydown', handle);
         swiper.keyboard.enabled = false;
      }

      on('init', () => {
         if (swiper.params.keyboard.enabled) {
            enable();
         }
      });
      on('destroy', () => {
         if (swiper.keyboard.enabled) {
            disable();
         }
      });
      Object.assign(swiper.keyboard, {
         enable,
         disable
      });
   }

   /* eslint-disable consistent-return */
   function Mousewheel({
      swiper,
      extendParams,
      on,
      emit
   }) {
      const window = getWindow();
      extendParams({
         mousewheel: {
            enabled: false,
            releaseOnEdges: false,
            invert: false,
            forceToAxis: false,
            sensitivity: 1,
            eventsTarget: 'container',
            thresholdDelta: null,
            thresholdTime: null
         }
      });
      swiper.mousewheel = {
         enabled: false
      };
      let timeout;
      let lastScrollTime = now();
      let lastEventBeforeSnap;
      const recentWheelEvents = [];

      function normalize(e) {
         // Reasonable defaults
         const PIXEL_STEP = 10;
         const LINE_HEIGHT = 40;
         const PAGE_HEIGHT = 800;
         let sX = 0;
         let sY = 0; // spinX, spinY

         let pX = 0;
         let pY = 0; // pixelX, pixelY
         // Legacy

         if ('detail' in e) {
            sY = e.detail;
         }

         if ('wheelDelta' in e) {
            sY = -e.wheelDelta / 120;
         }

         if ('wheelDeltaY' in e) {
            sY = -e.wheelDeltaY / 120;
         }

         if ('wheelDeltaX' in e) {
            sX = -e.wheelDeltaX / 120;
         } // side scrolling on FF with DOMMouseScroll


         if ('axis' in e && e.axis === e.HORIZONTAL_AXIS) {
            sX = sY;
            sY = 0;
         }

         pX = sX * PIXEL_STEP;
         pY = sY * PIXEL_STEP;

         if ('deltaY' in e) {
            pY = e.deltaY;
         }

         if ('deltaX' in e) {
            pX = e.deltaX;
         }

         if (e.shiftKey && !pX) {
            // if user scrolls with shift he wants horizontal scroll
            pX = pY;
            pY = 0;
         }

         if ((pX || pY) && e.deltaMode) {
            if (e.deltaMode === 1) {
               // delta in LINE units
               pX *= LINE_HEIGHT;
               pY *= LINE_HEIGHT;
            } else {
               // delta in PAGE units
               pX *= PAGE_HEIGHT;
               pY *= PAGE_HEIGHT;
            }
         } // Fall-back if spin cannot be determined


         if (pX && !sX) {
            sX = pX < 1 ? -1 : 1;
         }

         if (pY && !sY) {
            sY = pY < 1 ? -1 : 1;
         }

         return {
            spinX: sX,
            spinY: sY,
            pixelX: pX,
            pixelY: pY
         };
      }

      function handleMouseEnter() {
         if (!swiper.enabled) return;
         swiper.mouseEntered = true;
      }

      function handleMouseLeave() {
         if (!swiper.enabled) return;
         swiper.mouseEntered = false;
      }

      function animateSlider(newEvent) {
         if (swiper.params.mousewheel.thresholdDelta && newEvent.delta < swiper.params.mousewheel.thresholdDelta) {
            // Prevent if delta of wheel scroll delta is below configured threshold
            return false;
         }

         if (swiper.params.mousewheel.thresholdTime && now() - lastScrollTime < swiper.params.mousewheel.thresholdTime) {
            // Prevent if time between scrolls is below configured threshold
            return false;
         } // If the movement is NOT big enough and
         // if the last time the user scrolled was too close to the current one (avoid continuously triggering the slider):
         //   Don't go any further (avoid insignificant scroll movement).


         if (newEvent.delta >= 6 && now() - lastScrollTime < 60) {
            // Return false as a default
            return true;
         } // If user is scrolling towards the end:
         //   If the slider hasn't hit the latest slide or
         //   if the slider is a loop and
         //   if the slider isn't moving right now:
         //     Go to next slide and
         //     emit a scroll event.
         // Else (the user is scrolling towards the beginning) and
         // if the slider hasn't hit the first slide or
         // if the slider is a loop and
         // if the slider isn't moving right now:
         //   Go to prev slide and
         //   emit a scroll event.


         if (newEvent.direction < 0) {
            if ((!swiper.isEnd || swiper.params.loop) && !swiper.animating) {
               swiper.slideNext();
               emit('scroll', newEvent.raw);
            }
         } else if ((!swiper.isBeginning || swiper.params.loop) && !swiper.animating) {
            swiper.slidePrev();
            emit('scroll', newEvent.raw);
         } // If you got here is because an animation has been triggered so store the current time


         lastScrollTime = new window.Date().getTime(); // Return false as a default

         return false;
      }

      function releaseScroll(newEvent) {
         const params = swiper.params.mousewheel;

         if (newEvent.direction < 0) {
            if (swiper.isEnd && !swiper.params.loop && params.releaseOnEdges) {
               // Return true to animate scroll on edges
               return true;
            }
         } else if (swiper.isBeginning && !swiper.params.loop && params.releaseOnEdges) {
            // Return true to animate scroll on edges
            return true;
         }

         return false;
      }

      function handle(event) {
         let e = event;
         let disableParentSwiper = true;
         if (!swiper.enabled) return;
         const params = swiper.params.mousewheel;

         if (swiper.params.cssMode) {
            e.preventDefault();
         }

         let target = swiper.$el;

         if (swiper.params.mousewheel.eventsTarget !== 'container') {
            target = $(swiper.params.mousewheel.eventsTarget);
         }

         if (!swiper.mouseEntered && !target[0].contains(e.target) && !params.releaseOnEdges) return true;
         if (e.originalEvent) e = e.originalEvent; // jquery fix

         let delta = 0;
         const rtlFactor = swiper.rtlTranslate ? -1 : 1;
         const data = normalize(e);

         if (params.forceToAxis) {
            if (swiper.isHorizontal()) {
               if (Math.abs(data.pixelX) > Math.abs(data.pixelY)) delta = -data.pixelX * rtlFactor; else return true;
            } else if (Math.abs(data.pixelY) > Math.abs(data.pixelX)) delta = -data.pixelY; else return true;
         } else {
            delta = Math.abs(data.pixelX) > Math.abs(data.pixelY) ? -data.pixelX * rtlFactor : -data.pixelY;
         }

         if (delta === 0) return true;
         if (params.invert) delta = -delta; // Get the scroll positions

         let positions = swiper.getTranslate() + delta * params.sensitivity;
         if (positions >= swiper.minTranslate()) positions = swiper.minTranslate();
         if (positions <= swiper.maxTranslate()) positions = swiper.maxTranslate(); // When loop is true:
         //     the disableParentSwiper will be true.
         // When loop is false:
         //     if the scroll positions is not on edge,
         //     then the disableParentSwiper will be true.
         //     if the scroll on edge positions,
         //     then the disableParentSwiper will be false.

         disableParentSwiper = swiper.params.loop ? true : !(positions === swiper.minTranslate() || positions === swiper.maxTranslate());
         if (disableParentSwiper && swiper.params.nested) e.stopPropagation();

         if (!swiper.params.freeMode || !swiper.params.freeMode.enabled) {
            // Register the new event in a variable which stores the relevant data
            const newEvent = {
               time: now(),
               delta: Math.abs(delta),
               direction: Math.sign(delta),
               raw: event
            }; // Keep the most recent events

            if (recentWheelEvents.length >= 2) {
               recentWheelEvents.shift(); // only store the last N events
            }

            const prevEvent = recentWheelEvents.length ? recentWheelEvents[recentWheelEvents.length - 1] : undefined;
            recentWheelEvents.push(newEvent); // If there is at least one previous recorded event:
            //   If direction has changed or
            //   if the scroll is quicker than the previous one:
            //     Animate the slider.
            // Else (this is the first time the wheel is moved):
            //     Animate the slider.

            if (prevEvent) {
               if (newEvent.direction !== prevEvent.direction || newEvent.delta > prevEvent.delta || newEvent.time > prevEvent.time + 150) {
                  animateSlider(newEvent);
               }
            } else {
               animateSlider(newEvent);
            } // If it's time to release the scroll:
            //   Return now so you don't hit the preventDefault.


            if (releaseScroll(newEvent)) {
               return true;
            }
         } else {
            // Freemode or scrollContainer:
            // If we recently snapped after a momentum scroll, then ignore wheel events
            // to give time for the deceleration to finish. Stop ignoring after 500 msecs
            // or if it's a new scroll (larger delta or inverse sign as last event before
            // an end-of-momentum snap).
            const newEvent = {
               time: now(),
               delta: Math.abs(delta),
               direction: Math.sign(delta)
            };
            const ignoreWheelEvents = lastEventBeforeSnap && newEvent.time < lastEventBeforeSnap.time + 500 && newEvent.delta <= lastEventBeforeSnap.delta && newEvent.direction === lastEventBeforeSnap.direction;

            if (!ignoreWheelEvents) {
               lastEventBeforeSnap = undefined;

               if (swiper.params.loop) {
                  swiper.loopFix();
               }

               let position = swiper.getTranslate() + delta * params.sensitivity;
               const wasBeginning = swiper.isBeginning;
               const wasEnd = swiper.isEnd;
               if (position >= swiper.minTranslate()) position = swiper.minTranslate();
               if (position <= swiper.maxTranslate()) position = swiper.maxTranslate();
               swiper.setTransition(0);
               swiper.setTranslate(position);
               swiper.updateProgress();
               swiper.updateActiveIndex();
               swiper.updateSlidesClasses();

               if (!wasBeginning && swiper.isBeginning || !wasEnd && swiper.isEnd) {
                  swiper.updateSlidesClasses();
               }

               if (swiper.params.freeMode.sticky) {
                  // When wheel scrolling starts with sticky (aka snap) enabled, then detect
                  // the end of a momentum scroll by storing recent (N=15?) wheel events.
                  // 1. do all N events have decreasing or same (absolute value) delta?
                  // 2. did all N events arrive in the last M (M=500?) msecs?
                  // 3. does the earliest event have an (absolute value) delta that's
                  //    at least P (P=1?) larger than the most recent event's delta?
                  // 4. does the latest event have a delta that's smaller than Q (Q=6?) pixels?
                  // If 1-4 are "yes" then we're near the end of a momentum scroll deceleration.
                  // Snap immediately and ignore remaining wheel events in this scroll.
                  // See comment above for "remaining wheel events in this scroll" determination.
                  // If 1-4 aren't satisfied, then wait to snap until 500ms after the last event.
                  clearTimeout(timeout);
                  timeout = undefined;

                  if (recentWheelEvents.length >= 15) {
                     recentWheelEvents.shift(); // only store the last N events
                  }

                  const prevEvent = recentWheelEvents.length ? recentWheelEvents[recentWheelEvents.length - 1] : undefined;
                  const firstEvent = recentWheelEvents[0];
                  recentWheelEvents.push(newEvent);

                  if (prevEvent && (newEvent.delta > prevEvent.delta || newEvent.direction !== prevEvent.direction)) {
                     // Increasing or reverse-sign delta means the user started scrolling again. Clear the wheel event log.
                     recentWheelEvents.splice(0);
                  } else if (recentWheelEvents.length >= 15 && newEvent.time - firstEvent.time < 500 && firstEvent.delta - newEvent.delta >= 1 && newEvent.delta <= 6) {
                     // We're at the end of the deceleration of a momentum scroll, so there's no need
                     // to wait for more events. Snap ASAP on the next tick.
                     // Also, because there's some remaining momentum we'll bias the snap in the
                     // direction of the ongoing scroll because it's better UX for the scroll to snap
                     // in the same direction as the scroll instead of reversing to snap.  Therefore,
                     // if it's already scrolled more than 20% in the current direction, keep going.
                     const snapToThreshold = delta > 0 ? 0.8 : 0.2;
                     lastEventBeforeSnap = newEvent;
                     recentWheelEvents.splice(0);
                     timeout = nextTick(() => {
                        swiper.slideToClosest(swiper.params.speed, true, undefined, snapToThreshold);
                     }, 0); // no delay; move on next tick
                  }

                  if (!timeout) {
                     // if we get here, then we haven't detected the end of a momentum scroll, so
                     // we'll consider a scroll "complete" when there haven't been any wheel events
                     // for 500ms.
                     timeout = nextTick(() => {
                        const snapToThreshold = 0.5;
                        lastEventBeforeSnap = newEvent;
                        recentWheelEvents.splice(0);
                        swiper.slideToClosest(swiper.params.speed, true, undefined, snapToThreshold);
                     }, 500);
                  }
               } // Emit event


               if (!ignoreWheelEvents) emit('scroll', e); // Stop autoplay

               if (swiper.params.autoplay && swiper.params.autoplayDisableOnInteraction) swiper.autoplay.stop(); // Return page scroll on edge positions

               if (position === swiper.minTranslate() || position === swiper.maxTranslate()) return true;
            }
         }

         if (e.preventDefault) e.preventDefault(); else e.returnValue = false;
         return false;
      }

      function events(method) {
         let target = swiper.$el;

         if (swiper.params.mousewheel.eventsTarget !== 'container') {
            target = $(swiper.params.mousewheel.eventsTarget);
         }

         target[method]('mouseenter', handleMouseEnter);
         target[method]('mouseleave', handleMouseLeave);
         target[method]('wheel', handle);
      }

      function enable() {
         if (swiper.params.cssMode) {
            swiper.wrapperEl.removeEventListener('wheel', handle);
            return true;
         }

         if (swiper.mousewheel.enabled) return false;
         events('on');
         swiper.mousewheel.enabled = true;
         return true;
      }

      function disable() {
         if (swiper.params.cssMode) {
            swiper.wrapperEl.addEventListener(event, handle);
            return true;
         }

         if (!swiper.mousewheel.enabled) return false;
         events('off');
         swiper.mousewheel.enabled = false;
         return true;
      }

      on('init', () => {
         if (!swiper.params.mousewheel.enabled && swiper.params.cssMode) {
            disable();
         }

         if (swiper.params.mousewheel.enabled) enable();
      });
      on('destroy', () => {
         if (swiper.params.cssMode) {
            enable();
         }

         if (swiper.mousewheel.enabled) disable();
      });
      Object.assign(swiper.mousewheel, {
         enable,
         disable
      });
   }

   function createElementIfNotDefined(swiper, originalParams, params, checkProps) {
      const document = getDocument();

      if (swiper.params.createElements) {
         Object.keys(checkProps).forEach(key => {
            if (!params[key] && params.auto === true) {
               let element = swiper.$el.children(`.${checkProps[key]}`)[0];

               if (!element) {
                  element = document.createElement('div');
                  element.className = checkProps[key];
                  swiper.$el.append(element);
               }

               params[key] = element;
               originalParams[key] = element;
            }
         });
      }

      return params;
   }

   function Navigation({
      swiper,
      extendParams,
      on,
      emit
   }) {
      extendParams({
         navigation: {
            nextEl: null,
            prevEl: null,
            hideOnClick: false,
            disabledClass: 'swiper-button-disabled',
            hiddenClass: 'swiper-button-hidden',
            lockClass: 'swiper-button-lock'
         }
      });
      swiper.navigation = {
         nextEl: null,
         $nextEl: null,
         prevEl: null,
         $prevEl: null
      };

      function getEl(el) {
         let $el;

         if (el) {
            $el = $(el);

            if (swiper.params.uniqueNavElements && typeof el === 'string' && $el.length > 1 && swiper.$el.find(el).length === 1) {
               $el = swiper.$el.find(el);
            }
         }

         return $el;
      }

      function toggleEl($el, disabled) {
         const params = swiper.params.navigation;

         if ($el && $el.length > 0) {
            $el[disabled ? 'addClass' : 'removeClass'](params.disabledClass);
            if ($el[0] && $el[0].tagName === 'BUTTON') $el[0].disabled = disabled;

            if (swiper.params.watchOverflow && swiper.enabled) {
               $el[swiper.isLocked ? 'addClass' : 'removeClass'](params.lockClass);
            }
         }
      }

      function update() {
         // Update Navigation Buttons
         if (swiper.params.loop) return;
         const {
            $nextEl,
            $prevEl
         } = swiper.navigation;
         toggleEl($prevEl, swiper.isBeginning);
         toggleEl($nextEl, swiper.isEnd);
      }

      function onPrevClick(e) {
         e.preventDefault();
         if (swiper.isBeginning && !swiper.params.loop) return;
         swiper.slidePrev();
      }

      function onNextClick(e) {
         e.preventDefault();
         if (swiper.isEnd && !swiper.params.loop) return;
         swiper.slideNext();
      }

      function init() {
         const params = swiper.params.navigation;
         swiper.params.navigation = createElementIfNotDefined(swiper, swiper.originalParams.navigation, swiper.params.navigation, {
            nextEl: 'swiper-button-next',
            prevEl: 'swiper-button-prev'
         });
         if (!(params.nextEl || params.prevEl)) return;
         const $nextEl = getEl(params.nextEl);
         const $prevEl = getEl(params.prevEl);

         if ($nextEl && $nextEl.length > 0) {
            $nextEl.on('click', onNextClick);
         }

         if ($prevEl && $prevEl.length > 0) {
            $prevEl.on('click', onPrevClick);
         }

         Object.assign(swiper.navigation, {
            $nextEl,
            nextEl: $nextEl && $nextEl[0],
            $prevEl,
            prevEl: $prevEl && $prevEl[0]
         });

         if (!swiper.enabled) {
            if ($nextEl) $nextEl.addClass(params.lockClass);
            if ($prevEl) $prevEl.addClass(params.lockClass);
         }
      }

      function destroy() {
         const {
            $nextEl,
            $prevEl
         } = swiper.navigation;

         if ($nextEl && $nextEl.length) {
            $nextEl.off('click', onNextClick);
            $nextEl.removeClass(swiper.params.navigation.disabledClass);
         }

         if ($prevEl && $prevEl.length) {
            $prevEl.off('click', onPrevClick);
            $prevEl.removeClass(swiper.params.navigation.disabledClass);
         }
      }

      on('init', () => {
         init();
         update();
      });
      on('toEdge fromEdge lock unlock', () => {
         update();
      });
      on('destroy', () => {
         destroy();
      });
      on('enable disable', () => {
         const {
            $nextEl,
            $prevEl
         } = swiper.navigation;

         if ($nextEl) {
            $nextEl[swiper.enabled ? 'removeClass' : 'addClass'](swiper.params.navigation.lockClass);
         }

         if ($prevEl) {
            $prevEl[swiper.enabled ? 'removeClass' : 'addClass'](swiper.params.navigation.lockClass);
         }
      });
      on('click', (_s, e) => {
         const {
            $nextEl,
            $prevEl
         } = swiper.navigation;
         const targetEl = e.target;

         if (swiper.params.navigation.hideOnClick && !$(targetEl).is($prevEl) && !$(targetEl).is($nextEl)) {
            if (swiper.pagination && swiper.params.pagination && swiper.params.pagination.clickable && (swiper.pagination.el === targetEl || swiper.pagination.el.contains(targetEl))) return;
            let isHidden;

            if ($nextEl) {
               isHidden = $nextEl.hasClass(swiper.params.navigation.hiddenClass);
            } else if ($prevEl) {
               isHidden = $prevEl.hasClass(swiper.params.navigation.hiddenClass);
            }

            if (isHidden === true) {
               emit('navigationShow');
            } else {
               emit('navigationHide');
            }

            if ($nextEl) {
               $nextEl.toggleClass(swiper.params.navigation.hiddenClass);
            }

            if ($prevEl) {
               $prevEl.toggleClass(swiper.params.navigation.hiddenClass);
            }
         }
      });
      Object.assign(swiper.navigation, {
         update,
         init,
         destroy
      });
   }

   function classesToSelector(classes = '') {
      return `.${classes.trim().replace(/([\.:!\/])/g, '\\$1') // eslint-disable-line
         .replace(/ /g, '.')}`;
   }

   function Pagination({
      swiper,
      extendParams,
      on,
      emit
   }) {
      const pfx = 'swiper-pagination';
      extendParams({
         pagination: {
            el: null,
            bulletElement: 'span',
            clickable: false,
            hideOnClick: false,
            renderBullet: null,
            renderProgressbar: null,
            renderFraction: null,
            renderCustom: null,
            progressbarOpposite: false,
            type: 'bullets',
            // 'bullets' or 'progressbar' or 'fraction' or 'custom'
            dynamicBullets: false,
            dynamicMainBullets: 1,
            formatFractionCurrent: number => number,
            formatFractionTotal: number => number,
            bulletClass: `${pfx}-bullet`,
            bulletActiveClass: `${pfx}-bullet-active`,
            modifierClass: `${pfx}-`,
            currentClass: `${pfx}-current`,
            totalClass: `${pfx}-total`,
            hiddenClass: `${pfx}-hidden`,
            progressbarFillClass: `${pfx}-progressbar-fill`,
            progressbarOppositeClass: `${pfx}-progressbar-opposite`,
            clickableClass: `${pfx}-clickable`,
            lockClass: `${pfx}-lock`,
            horizontalClass: `${pfx}-horizontal`,
            verticalClass: `${pfx}-vertical`
         }
      });
      swiper.pagination = {
         el: null,
         $el: null,
         bullets: []
      };
      let bulletSize;
      let dynamicBulletIndex = 0;

      function isPaginationDisabled() {
         return !swiper.params.pagination.el || !swiper.pagination.el || !swiper.pagination.$el || swiper.pagination.$el.length === 0;
      }

      function setSideBullets($bulletEl, position) {
         const {
            bulletActiveClass
         } = swiper.params.pagination;
         $bulletEl[position]().addClass(`${bulletActiveClass}-${position}`)[position]().addClass(`${bulletActiveClass}-${position}-${position}`);
      }

      function update() {
         // Render || Update Pagination bullets/items
         const rtl = swiper.rtl;
         const params = swiper.params.pagination;
         if (isPaginationDisabled()) return;
         const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
         const $el = swiper.pagination.$el; // Current/Total

         let current;
         const total = swiper.params.loop ? Math.ceil((slidesLength - swiper.loopedSlides * 2) / swiper.params.slidesPerGroup) : swiper.snapGrid.length;

         if (swiper.params.loop) {
            current = Math.ceil((swiper.activeIndex - swiper.loopedSlides) / swiper.params.slidesPerGroup);

            if (current > slidesLength - 1 - swiper.loopedSlides * 2) {
               current -= slidesLength - swiper.loopedSlides * 2;
            }

            if (current > total - 1) current -= total;
            if (current < 0 && swiper.params.paginationType !== 'bullets') current = total + current;
         } else if (typeof swiper.snapIndex !== 'undefined') {
            current = swiper.snapIndex;
         } else {
            current = swiper.activeIndex || 0;
         } // Types


         if (params.type === 'bullets' && swiper.pagination.bullets && swiper.pagination.bullets.length > 0) {
            const bullets = swiper.pagination.bullets;
            let firstIndex;
            let lastIndex;
            let midIndex;

            if (params.dynamicBullets) {
               bulletSize = bullets.eq(0)[swiper.isHorizontal() ? 'outerWidth' : 'outerHeight'](true);
               $el.css(swiper.isHorizontal() ? 'width' : 'height', `${bulletSize * (params.dynamicMainBullets + 4)}px`);

               if (params.dynamicMainBullets > 1 && swiper.previousIndex !== undefined) {
                  dynamicBulletIndex += current - swiper.previousIndex;

                  if (dynamicBulletIndex > params.dynamicMainBullets - 1) {
                     dynamicBulletIndex = params.dynamicMainBullets - 1;
                  } else if (dynamicBulletIndex < 0) {
                     dynamicBulletIndex = 0;
                  }
               }

               firstIndex = current - dynamicBulletIndex;
               lastIndex = firstIndex + (Math.min(bullets.length, params.dynamicMainBullets) - 1);
               midIndex = (lastIndex + firstIndex) / 2;
            }

            bullets.removeClass(['', '-next', '-next-next', '-prev', '-prev-prev', '-main'].map(suffix => `${params.bulletActiveClass}${suffix}`).join(' '));

            if ($el.length > 1) {
               bullets.each(bullet => {
                  const $bullet = $(bullet);
                  const bulletIndex = $bullet.index();

                  if (bulletIndex === current) {
                     $bullet.addClass(params.bulletActiveClass);
                  }

                  if (params.dynamicBullets) {
                     if (bulletIndex >= firstIndex && bulletIndex <= lastIndex) {
                        $bullet.addClass(`${params.bulletActiveClass}-main`);
                     }

                     if (bulletIndex === firstIndex) {
                        setSideBullets($bullet, 'prev');
                     }

                     if (bulletIndex === lastIndex) {
                        setSideBullets($bullet, 'next');
                     }
                  }
               });
            } else {
               const $bullet = bullets.eq(current);
               const bulletIndex = $bullet.index();
               $bullet.addClass(params.bulletActiveClass);

               if (params.dynamicBullets) {
                  const $firstDisplayedBullet = bullets.eq(firstIndex);
                  const $lastDisplayedBullet = bullets.eq(lastIndex);

                  for (let i = firstIndex; i <= lastIndex; i += 1) {
                     bullets.eq(i).addClass(`${params.bulletActiveClass}-main`);
                  }

                  if (swiper.params.loop) {
                     if (bulletIndex >= bullets.length - params.dynamicMainBullets) {
                        for (let i = params.dynamicMainBullets; i >= 0; i -= 1) {
                           bullets.eq(bullets.length - i).addClass(`${params.bulletActiveClass}-main`);
                        }

                        bullets.eq(bullets.length - params.dynamicMainBullets - 1).addClass(`${params.bulletActiveClass}-prev`);
                     } else {
                        setSideBullets($firstDisplayedBullet, 'prev');
                        setSideBullets($lastDisplayedBullet, 'next');
                     }
                  } else {
                     setSideBullets($firstDisplayedBullet, 'prev');
                     setSideBullets($lastDisplayedBullet, 'next');
                  }
               }
            }

            if (params.dynamicBullets) {
               const dynamicBulletsLength = Math.min(bullets.length, params.dynamicMainBullets + 4);
               const bulletsOffset = (bulletSize * dynamicBulletsLength - bulletSize) / 2 - midIndex * bulletSize;
               const offsetProp = rtl ? 'right' : 'left';
               bullets.css(swiper.isHorizontal() ? offsetProp : 'top', `${bulletsOffset}px`);
            }
         }

         if (params.type === 'fraction') {
            $el.find(classesToSelector(params.currentClass)).text(params.formatFractionCurrent(current + 1));
            $el.find(classesToSelector(params.totalClass)).text(params.formatFractionTotal(total));
         }

         if (params.type === 'progressbar') {
            let progressbarDirection;

            if (params.progressbarOpposite) {
               progressbarDirection = swiper.isHorizontal() ? 'vertical' : 'horizontal';
            } else {
               progressbarDirection = swiper.isHorizontal() ? 'horizontal' : 'vertical';
            }

            const scale = (current + 1) / total;
            let scaleX = 1;
            let scaleY = 1;

            if (progressbarDirection === 'horizontal') {
               scaleX = scale;
            } else {
               scaleY = scale;
            }

            $el.find(classesToSelector(params.progressbarFillClass)).transform(`translate3d(0,0,0) scaleX(${scaleX}) scaleY(${scaleY})`).transition(swiper.params.speed);
         }

         if (params.type === 'custom' && params.renderCustom) {
            $el.html(params.renderCustom(swiper, current + 1, total));
            emit('paginationRender', $el[0]);
         } else {
            emit('paginationUpdate', $el[0]);
         }

         if (swiper.params.watchOverflow && swiper.enabled) {
            $el[swiper.isLocked ? 'addClass' : 'removeClass'](params.lockClass);
         }
      }

      function render() {
         // Render Container
         const params = swiper.params.pagination;
         if (isPaginationDisabled()) return;
         const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
         const $el = swiper.pagination.$el;
         let paginationHTML = '';

         if (params.type === 'bullets') {
            let numberOfBullets = swiper.params.loop ? Math.ceil((slidesLength - swiper.loopedSlides * 2) / swiper.params.slidesPerGroup) : swiper.snapGrid.length;

            if (swiper.params.freeMode && swiper.params.freeMode.enabled && !swiper.params.loop && numberOfBullets > slidesLength) {
               numberOfBullets = slidesLength;
            }

            for (let i = 0; i < numberOfBullets; i += 1) {
               if (params.renderBullet) {
                  paginationHTML += params.renderBullet.call(swiper, i, params.bulletClass);
               } else {
                  paginationHTML += `<${params.bulletElement} class="${params.bulletClass}"></${params.bulletElement}>`;
               }
            }

            $el.html(paginationHTML);
            swiper.pagination.bullets = $el.find(classesToSelector(params.bulletClass));
         }

         if (params.type === 'fraction') {
            if (params.renderFraction) {
               paginationHTML = params.renderFraction.call(swiper, params.currentClass, params.totalClass);
            } else {
               paginationHTML = `<span class="${params.currentClass}"></span>` + ' / ' + `<span class="${params.totalClass}"></span>`;
            }

            $el.html(paginationHTML);
         }

         if (params.type === 'progressbar') {
            if (params.renderProgressbar) {
               paginationHTML = params.renderProgressbar.call(swiper, params.progressbarFillClass);
            } else {
               paginationHTML = `<span class="${params.progressbarFillClass}"></span>`;
            }

            $el.html(paginationHTML);
         }

         if (params.type !== 'custom') {
            emit('paginationRender', swiper.pagination.$el[0]);
         }
      }

      function init() {
         swiper.params.pagination = createElementIfNotDefined(swiper, swiper.originalParams.pagination, swiper.params.pagination, {
            el: 'swiper-pagination'
         });
         const params = swiper.params.pagination;
         if (!params.el) return;
         let $el = $(params.el);
         if ($el.length === 0) return;

         if (swiper.params.uniqueNavElements && typeof params.el === 'string' && $el.length > 1) {
            $el = swiper.$el.find(params.el); // check if it belongs to another nested Swiper

            if ($el.length > 1) {
               $el = $el.filter(el => {
                  if ($(el).parents('.swiper')[0] !== swiper.el) return false;
                  return true;
               });
            }
         }

         if (params.type === 'bullets' && params.clickable) {
            $el.addClass(params.clickableClass);
         }

         $el.addClass(params.modifierClass + params.type);
         $el.addClass(params.modifierClass + swiper.params.direction);

         if (params.type === 'bullets' && params.dynamicBullets) {
            $el.addClass(`${params.modifierClass}${params.type}-dynamic`);
            dynamicBulletIndex = 0;

            if (params.dynamicMainBullets < 1) {
               params.dynamicMainBullets = 1;
            }
         }

         if (params.type === 'progressbar' && params.progressbarOpposite) {
            $el.addClass(params.progressbarOppositeClass);
         }

         if (params.clickable) {
            $el.on('click', classesToSelector(params.bulletClass), function onClick(e) {
               e.preventDefault();
               let index = $(this).index() * swiper.params.slidesPerGroup;
               if (swiper.params.loop) index += swiper.loopedSlides;
               swiper.slideTo(index);
            });
         }

         Object.assign(swiper.pagination, {
            $el,
            el: $el[0]
         });

         if (!swiper.enabled) {
            $el.addClass(params.lockClass);
         }
      }

      function destroy() {
         const params = swiper.params.pagination;
         if (isPaginationDisabled()) return;
         const $el = swiper.pagination.$el;
         $el.removeClass(params.hiddenClass);
         $el.removeClass(params.modifierClass + params.type);
         $el.removeClass(params.modifierClass + swiper.params.direction);
         if (swiper.pagination.bullets && swiper.pagination.bullets.removeClass) swiper.pagination.bullets.removeClass(params.bulletActiveClass);

         if (params.clickable) {
            $el.off('click', classesToSelector(params.bulletClass));
         }
      }

      on('init', () => {
         init();
         render();
         update();
      });
      on('activeIndexChange', () => {
         if (swiper.params.loop) {
            update();
         } else if (typeof swiper.snapIndex === 'undefined') {
            update();
         }
      });
      on('snapIndexChange', () => {
         if (!swiper.params.loop) {
            update();
         }
      });
      on('slidesLengthChange', () => {
         if (swiper.params.loop) {
            render();
            update();
         }
      });
      on('snapGridLengthChange', () => {
         if (!swiper.params.loop) {
            render();
            update();
         }
      });
      on('destroy', () => {
         destroy();
      });
      on('enable disable', () => {
         const {
            $el
         } = swiper.pagination;

         if ($el) {
            $el[swiper.enabled ? 'removeClass' : 'addClass'](swiper.params.pagination.lockClass);
         }
      });
      on('lock unlock', () => {
         update();
      });
      on('click', (_s, e) => {
         const targetEl = e.target;
         const {
            $el
         } = swiper.pagination;

         if (swiper.params.pagination.el && swiper.params.pagination.hideOnClick && $el.length > 0 && !$(targetEl).hasClass(swiper.params.pagination.bulletClass)) {
            if (swiper.navigation && (swiper.navigation.nextEl && targetEl === swiper.navigation.nextEl || swiper.navigation.prevEl && targetEl === swiper.navigation.prevEl)) return;
            const isHidden = $el.hasClass(swiper.params.pagination.hiddenClass);

            if (isHidden === true) {
               emit('paginationShow');
            } else {
               emit('paginationHide');
            }

            $el.toggleClass(swiper.params.pagination.hiddenClass);
         }
      });
      Object.assign(swiper.pagination, {
         render,
         update,
         init,
         destroy
      });
   }

   function Scrollbar({
      swiper,
      extendParams,
      on,
      emit
   }) {
      const document = getDocument();
      let isTouched = false;
      let timeout = null;
      let dragTimeout = null;
      let dragStartPos;
      let dragSize;
      let trackSize;
      let divider;
      extendParams({
         scrollbar: {
            el: null,
            dragSize: 'auto',
            hide: false,
            draggable: false,
            snapOnRelease: true,
            lockClass: 'swiper-scrollbar-lock',
            dragClass: 'swiper-scrollbar-drag'
         }
      });
      swiper.scrollbar = {
         el: null,
         dragEl: null,
         $el: null,
         $dragEl: null
      };

      function setTranslate() {
         if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
         const {
            scrollbar,
            rtlTranslate: rtl,
            progress
         } = swiper;
         const {
            $dragEl,
            $el
         } = scrollbar;
         const params = swiper.params.scrollbar;
         let newSize = dragSize;
         let newPos = (trackSize - dragSize) * progress;

         if (rtl) {
            newPos = -newPos;

            if (newPos > 0) {
               newSize = dragSize - newPos;
               newPos = 0;
            } else if (-newPos + dragSize > trackSize) {
               newSize = trackSize + newPos;
            }
         } else if (newPos < 0) {
            newSize = dragSize + newPos;
            newPos = 0;
         } else if (newPos + dragSize > trackSize) {
            newSize = trackSize - newPos;
         }

         if (swiper.isHorizontal()) {
            $dragEl.transform(`translate3d(${newPos}px, 0, 0)`);
            $dragEl[0].style.width = `${newSize}px`;
         } else {
            $dragEl.transform(`translate3d(0px, ${newPos}px, 0)`);
            $dragEl[0].style.height = `${newSize}px`;
         }

         if (params.hide) {
            clearTimeout(timeout);
            $el[0].style.opacity = 1;
            timeout = setTimeout(() => {
               $el[0].style.opacity = 0;
               $el.transition(400);
            }, 1000);
         }
      }

      function setTransition(duration) {
         if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
         swiper.scrollbar.$dragEl.transition(duration);
      }

      function updateSize() {
         if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
         const {
            scrollbar
         } = swiper;
         const {
            $dragEl,
            $el
         } = scrollbar;
         $dragEl[0].style.width = '';
         $dragEl[0].style.height = '';
         trackSize = swiper.isHorizontal() ? $el[0].offsetWidth : $el[0].offsetHeight;
         divider = swiper.size / (swiper.virtualSize + swiper.params.slidesOffsetBefore - (swiper.params.centeredSlides ? swiper.snapGrid[0] : 0));

         if (swiper.params.scrollbar.dragSize === 'auto') {
            dragSize = trackSize * divider;
         } else {
            dragSize = parseInt(swiper.params.scrollbar.dragSize, 10);
         }

         if (swiper.isHorizontal()) {
            $dragEl[0].style.width = `${dragSize}px`;
         } else {
            $dragEl[0].style.height = `${dragSize}px`;
         }

         if (divider >= 1) {
            $el[0].style.display = 'none';
         } else {
            $el[0].style.display = '';
         }

         if (swiper.params.scrollbar.hide) {
            $el[0].style.opacity = 0;
         }

         if (swiper.params.watchOverflow && swiper.enabled) {
            scrollbar.$el[swiper.isLocked ? 'addClass' : 'removeClass'](swiper.params.scrollbar.lockClass);
         }
      }

      function getPointerPosition(e) {
         if (swiper.isHorizontal()) {
            return e.type === 'touchstart' || e.type === 'touchmove' ? e.targetTouches[0].clientX : e.clientX;
         }

         return e.type === 'touchstart' || e.type === 'touchmove' ? e.targetTouches[0].clientY : e.clientY;
      }

      function setDragPosition(e) {
         const {
            scrollbar,
            rtlTranslate: rtl
         } = swiper;
         const {
            $el
         } = scrollbar;
         let positionRatio;
         positionRatio = (getPointerPosition(e) - $el.offset()[swiper.isHorizontal() ? 'left' : 'top'] - (dragStartPos !== null ? dragStartPos : dragSize / 2)) / (trackSize - dragSize);
         positionRatio = Math.max(Math.min(positionRatio, 1), 0);

         if (rtl) {
            positionRatio = 1 - positionRatio;
         }

         const position = swiper.minTranslate() + (swiper.maxTranslate() - swiper.minTranslate()) * positionRatio;
         swiper.updateProgress(position);
         swiper.setTranslate(position);
         swiper.updateActiveIndex();
         swiper.updateSlidesClasses();
      }

      function onDragStart(e) {
         const params = swiper.params.scrollbar;
         const {
            scrollbar,
            $wrapperEl
         } = swiper;
         const {
            $el,
            $dragEl
         } = scrollbar;
         isTouched = true;
         dragStartPos = e.target === $dragEl[0] || e.target === $dragEl ? getPointerPosition(e) - e.target.getBoundingClientRect()[swiper.isHorizontal() ? 'left' : 'top'] : null;
         e.preventDefault();
         e.stopPropagation();
         $wrapperEl.transition(100);
         $dragEl.transition(100);
         setDragPosition(e);
         clearTimeout(dragTimeout);
         $el.transition(0);

         if (params.hide) {
            $el.css('opacity', 1);
         }

         if (swiper.params.cssMode) {
            swiper.$wrapperEl.css('scroll-snap-type', 'none');
         }

         emit('scrollbarDragStart', e);
      }

      function onDragMove(e) {
         const {
            scrollbar,
            $wrapperEl
         } = swiper;
         const {
            $el,
            $dragEl
         } = scrollbar;
         if (!isTouched) return;
         if (e.preventDefault) e.preventDefault(); else e.returnValue = false;
         setDragPosition(e);
         $wrapperEl.transition(0);
         $el.transition(0);
         $dragEl.transition(0);
         emit('scrollbarDragMove', e);
      }

      function onDragEnd(e) {
         const params = swiper.params.scrollbar;
         const {
            scrollbar,
            $wrapperEl
         } = swiper;
         const {
            $el
         } = scrollbar;
         if (!isTouched) return;
         isTouched = false;

         if (swiper.params.cssMode) {
            swiper.$wrapperEl.css('scroll-snap-type', '');
            $wrapperEl.transition('');
         }

         if (params.hide) {
            clearTimeout(dragTimeout);
            dragTimeout = nextTick(() => {
               $el.css('opacity', 0);
               $el.transition(400);
            }, 1000);
         }

         emit('scrollbarDragEnd', e);

         if (params.snapOnRelease) {
            swiper.slideToClosest();
         }
      }

      function events(method) {
         const {
            scrollbar,
            touchEventsTouch,
            touchEventsDesktop,
            params,
            support
         } = swiper;
         const $el = scrollbar.$el;
         const target = $el[0];
         const activeListener = support.passiveListener && params.passiveListeners ? {
            passive: false,
            capture: false
         } : false;
         const passiveListener = support.passiveListener && params.passiveListeners ? {
            passive: true,
            capture: false
         } : false;
         if (!target) return;
         const eventMethod = method === 'on' ? 'addEventListener' : 'removeEventListener';

         if (!support.touch) {
            target[eventMethod](touchEventsDesktop.start, onDragStart, activeListener);
            document[eventMethod](touchEventsDesktop.move, onDragMove, activeListener);
            document[eventMethod](touchEventsDesktop.end, onDragEnd, passiveListener);
         } else {
            target[eventMethod](touchEventsTouch.start, onDragStart, activeListener);
            target[eventMethod](touchEventsTouch.move, onDragMove, activeListener);
            target[eventMethod](touchEventsTouch.end, onDragEnd, passiveListener);
         }
      }

      function enableDraggable() {
         if (!swiper.params.scrollbar.el) return;
         events('on');
      }

      function disableDraggable() {
         if (!swiper.params.scrollbar.el) return;
         events('off');
      }

      function init() {
         const {
            scrollbar,
            $el: $swiperEl
         } = swiper;
         swiper.params.scrollbar = createElementIfNotDefined(swiper, swiper.originalParams.scrollbar, swiper.params.scrollbar, {
            el: 'swiper-scrollbar'
         });
         const params = swiper.params.scrollbar;
         if (!params.el) return;
         let $el = $(params.el);

         if (swiper.params.uniqueNavElements && typeof params.el === 'string' && $el.length > 1 && $swiperEl.find(params.el).length === 1) {
            $el = $swiperEl.find(params.el);
         }

         let $dragEl = $el.find(`.${swiper.params.scrollbar.dragClass}`);

         if ($dragEl.length === 0) {
            $dragEl = $(`<div class="${swiper.params.scrollbar.dragClass}"></div>`);
            $el.append($dragEl);
         }

         Object.assign(scrollbar, {
            $el,
            el: $el[0],
            $dragEl,
            dragEl: $dragEl[0]
         });

         if (params.draggable) {
            enableDraggable();
         }

         if ($el) {
            $el[swiper.enabled ? 'removeClass' : 'addClass'](swiper.params.scrollbar.lockClass);
         }
      }

      function destroy() {
         disableDraggable();
      }

      on('init', () => {
         init();
         updateSize();
         setTranslate();
      });
      on('update resize observerUpdate lock unlock', () => {
         updateSize();
      });
      on('setTranslate', () => {
         setTranslate();
      });
      on('setTransition', (_s, duration) => {
         setTransition(duration);
      });
      on('enable disable', () => {
         const {
            $el
         } = swiper.scrollbar;

         if ($el) {
            $el[swiper.enabled ? 'removeClass' : 'addClass'](swiper.params.scrollbar.lockClass);
         }
      });
      on('destroy', () => {
         destroy();
      });
      Object.assign(swiper.scrollbar, {
         updateSize,
         setTranslate,
         init,
         destroy
      });
   }

   function Parallax({
      swiper,
      extendParams,
      on
   }) {
      extendParams({
         parallax: {
            enabled: false
         }
      });

      const setTransform = (el, progress) => {
         const {
            rtl
         } = swiper;
         const $el = $(el);
         const rtlFactor = rtl ? -1 : 1;
         const p = $el.attr('data-swiper-parallax') || '0';
         let x = $el.attr('data-swiper-parallax-x');
         let y = $el.attr('data-swiper-parallax-y');
         const scale = $el.attr('data-swiper-parallax-scale');
         const opacity = $el.attr('data-swiper-parallax-opacity');

         if (x || y) {
            x = x || '0';
            y = y || '0';
         } else if (swiper.isHorizontal()) {
            x = p;
            y = '0';
         } else {
            y = p;
            x = '0';
         }

         if (x.indexOf('%') >= 0) {
            x = `${parseInt(x, 10) * progress * rtlFactor}%`;
         } else {
            x = `${x * progress * rtlFactor}px`;
         }

         if (y.indexOf('%') >= 0) {
            y = `${parseInt(y, 10) * progress}%`;
         } else {
            y = `${y * progress}px`;
         }

         if (typeof opacity !== 'undefined' && opacity !== null) {
            const currentOpacity = opacity - (opacity - 1) * (1 - Math.abs(progress));
            $el[0].style.opacity = currentOpacity;
         }

         if (typeof scale === 'undefined' || scale === null) {
            $el.transform(`translate3d(${x}, ${y}, 0px)`);
         } else {
            const currentScale = scale - (scale - 1) * (1 - Math.abs(progress));
            $el.transform(`translate3d(${x}, ${y}, 0px) scale(${currentScale})`);
         }
      };

      const setTranslate = () => {
         const {
            $el,
            slides,
            progress,
            snapGrid
         } = swiper;
         $el.children('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]').each(el => {
            setTransform(el, progress);
         });
         slides.each((slideEl, slideIndex) => {
            let slideProgress = slideEl.progress;

            if (swiper.params.slidesPerGroup > 1 && swiper.params.slidesPerView !== 'auto') {
               slideProgress += Math.ceil(slideIndex / 2) - progress * (snapGrid.length - 1);
            }

            slideProgress = Math.min(Math.max(slideProgress, -1), 1);
            $(slideEl).find('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]').each(el => {
               setTransform(el, slideProgress);
            });
         });
      };

      const setTransition = (duration = swiper.params.speed) => {
         const {
            $el
         } = swiper;
         $el.find('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]').each(parallaxEl => {
            const $parallaxEl = $(parallaxEl);
            let parallaxDuration = parseInt($parallaxEl.attr('data-swiper-parallax-duration'), 10) || duration;
            if (duration === 0) parallaxDuration = 0;
            $parallaxEl.transition(parallaxDuration);
         });
      };

      on('beforeInit', () => {
         if (!swiper.params.parallax.enabled) return;
         swiper.params.watchSlidesProgress = true;
         swiper.originalParams.watchSlidesProgress = true;
      });
      on('init', () => {
         if (!swiper.params.parallax.enabled) return;
         setTranslate();
      });
      on('setTranslate', () => {
         if (!swiper.params.parallax.enabled) return;
         setTranslate();
      });
      on('setTransition', (_swiper, duration) => {
         if (!swiper.params.parallax.enabled) return;
         setTransition(duration);
      });
   }

   function Zoom({
      swiper,
      extendParams,
      on,
      emit
   }) {
      const window = getWindow();
      extendParams({
         zoom: {
            enabled: false,
            maxRatio: 3,
            minRatio: 1,
            toggle: true,
            containerClass: 'swiper-zoom-container',
            zoomedSlideClass: 'swiper-slide-zoomed'
         }
      });
      swiper.zoom = {
         enabled: false
      };
      let currentScale = 1;
      let isScaling = false;
      let gesturesEnabled;
      let fakeGestureTouched;
      let fakeGestureMoved;
      const gesture = {
         $slideEl: undefined,
         slideWidth: undefined,
         slideHeight: undefined,
         $imageEl: undefined,
         $imageWrapEl: undefined,
         maxRatio: 3
      };
      const image = {
         isTouched: undefined,
         isMoved: undefined,
         currentX: undefined,
         currentY: undefined,
         minX: undefined,
         minY: undefined,
         maxX: undefined,
         maxY: undefined,
         width: undefined,
         height: undefined,
         startX: undefined,
         startY: undefined,
         touchesStart: {},
         touchesCurrent: {}
      };
      const velocity = {
         x: undefined,
         y: undefined,
         prevPositionX: undefined,
         prevPositionY: undefined,
         prevTime: undefined
      };
      let scale = 1;
      Object.defineProperty(swiper.zoom, 'scale', {
         get() {
            return scale;
         },

         set(value) {
            if (scale !== value) {
               const imageEl = gesture.$imageEl ? gesture.$imageEl[0] : undefined;
               const slideEl = gesture.$slideEl ? gesture.$slideEl[0] : undefined;
               emit('zoomChange', value, imageEl, slideEl);
            }

            scale = value;
         }

      });

      function getDistanceBetweenTouches(e) {
         if (e.targetTouches.length < 2) return 1;
         const x1 = e.targetTouches[0].pageX;
         const y1 = e.targetTouches[0].pageY;
         const x2 = e.targetTouches[1].pageX;
         const y2 = e.targetTouches[1].pageY;
         const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
         return distance;
      } // Events


      function onGestureStart(e) {
         const support = swiper.support;
         const params = swiper.params.zoom;
         fakeGestureTouched = false;
         fakeGestureMoved = false;

         if (!support.gestures) {
            if (e.type !== 'touchstart' || e.type === 'touchstart' && e.targetTouches.length < 2) {
               return;
            }

            fakeGestureTouched = true;
            gesture.scaleStart = getDistanceBetweenTouches(e);
         }

         if (!gesture.$slideEl || !gesture.$slideEl.length) {
            gesture.$slideEl = $(e.target).closest(`.${swiper.params.slideClass}`);
            if (gesture.$slideEl.length === 0) gesture.$slideEl = swiper.slides.eq(swiper.activeIndex);
            gesture.$imageEl = gesture.$slideEl.find(`.${params.containerClass}`).eq(0).find('img, svg, canvas, picture, .swiper-zoom-target');
            gesture.$imageWrapEl = gesture.$imageEl.parent(`.${params.containerClass}`);
            gesture.maxRatio = gesture.$imageWrapEl.attr('data-swiper-zoom') || params.maxRatio;

            if (gesture.$imageWrapEl.length === 0) {
               gesture.$imageEl = undefined;
               return;
            }
         }

         if (gesture.$imageEl) {
            gesture.$imageEl.transition(0);
         }

         isScaling = true;
      }

      function onGestureChange(e) {
         const support = swiper.support;
         const params = swiper.params.zoom;
         const zoom = swiper.zoom;

         if (!support.gestures) {
            if (e.type !== 'touchmove' || e.type === 'touchmove' && e.targetTouches.length < 2) {
               return;
            }

            fakeGestureMoved = true;
            gesture.scaleMove = getDistanceBetweenTouches(e);
         }

         if (!gesture.$imageEl || gesture.$imageEl.length === 0) {
            if (e.type === 'gesturechange') onGestureStart(e);
            return;
         }

         if (support.gestures) {
            zoom.scale = e.scale * currentScale;
         } else {
            zoom.scale = gesture.scaleMove / gesture.scaleStart * currentScale;
         }

         if (zoom.scale > gesture.maxRatio) {
            zoom.scale = gesture.maxRatio - 1 + (zoom.scale - gesture.maxRatio + 1) ** 0.5;
         }

         if (zoom.scale < params.minRatio) {
            zoom.scale = params.minRatio + 1 - (params.minRatio - zoom.scale + 1) ** 0.5;
         }

         gesture.$imageEl.transform(`translate3d(0,0,0) scale(${zoom.scale})`);
      }

      function onGestureEnd(e) {
         const device = swiper.device;
         const support = swiper.support;
         const params = swiper.params.zoom;
         const zoom = swiper.zoom;

         if (!support.gestures) {
            if (!fakeGestureTouched || !fakeGestureMoved) {
               return;
            }

            if (e.type !== 'touchend' || e.type === 'touchend' && e.changedTouches.length < 2 && !device.android) {
               return;
            }

            fakeGestureTouched = false;
            fakeGestureMoved = false;
         }

         if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;
         zoom.scale = Math.max(Math.min(zoom.scale, gesture.maxRatio), params.minRatio);
         gesture.$imageEl.transition(swiper.params.speed).transform(`translate3d(0,0,0) scale(${zoom.scale})`);
         currentScale = zoom.scale;
         isScaling = false;
         if (zoom.scale === 1) gesture.$slideEl = undefined;
      }

      function onTouchStart(e) {
         const device = swiper.device;
         if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;
         if (image.isTouched) return;
         if (device.android && e.cancelable) e.preventDefault();
         image.isTouched = true;
         image.touchesStart.x = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
         image.touchesStart.y = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
      }

      function onTouchMove(e) {
         const zoom = swiper.zoom;
         if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;
         swiper.allowClick = false;
         if (!image.isTouched || !gesture.$slideEl) return;

         if (!image.isMoved) {
            image.width = gesture.$imageEl[0].offsetWidth;
            image.height = gesture.$imageEl[0].offsetHeight;
            image.startX = getTranslate(gesture.$imageWrapEl[0], 'x') || 0;
            image.startY = getTranslate(gesture.$imageWrapEl[0], 'y') || 0;
            gesture.slideWidth = gesture.$slideEl[0].offsetWidth;
            gesture.slideHeight = gesture.$slideEl[0].offsetHeight;
            gesture.$imageWrapEl.transition(0);
         } // Define if we need image drag


         const scaledWidth = image.width * zoom.scale;
         const scaledHeight = image.height * zoom.scale;
         if (scaledWidth < gesture.slideWidth && scaledHeight < gesture.slideHeight) return;
         image.minX = Math.min(gesture.slideWidth / 2 - scaledWidth / 2, 0);
         image.maxX = -image.minX;
         image.minY = Math.min(gesture.slideHeight / 2 - scaledHeight / 2, 0);
         image.maxY = -image.minY;
         image.touchesCurrent.x = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
         image.touchesCurrent.y = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;

         if (!image.isMoved && !isScaling) {
            if (swiper.isHorizontal() && (Math.floor(image.minX) === Math.floor(image.startX) && image.touchesCurrent.x < image.touchesStart.x || Math.floor(image.maxX) === Math.floor(image.startX) && image.touchesCurrent.x > image.touchesStart.x)) {
               image.isTouched = false;
               return;
            }

            if (!swiper.isHorizontal() && (Math.floor(image.minY) === Math.floor(image.startY) && image.touchesCurrent.y < image.touchesStart.y || Math.floor(image.maxY) === Math.floor(image.startY) && image.touchesCurrent.y > image.touchesStart.y)) {
               image.isTouched = false;
               return;
            }
         }

         if (e.cancelable) {
            e.preventDefault();
         }

         e.stopPropagation();
         image.isMoved = true;
         image.currentX = image.touchesCurrent.x - image.touchesStart.x + image.startX;
         image.currentY = image.touchesCurrent.y - image.touchesStart.y + image.startY;

         if (image.currentX < image.minX) {
            image.currentX = image.minX + 1 - (image.minX - image.currentX + 1) ** 0.8;
         }

         if (image.currentX > image.maxX) {
            image.currentX = image.maxX - 1 + (image.currentX - image.maxX + 1) ** 0.8;
         }

         if (image.currentY < image.minY) {
            image.currentY = image.minY + 1 - (image.minY - image.currentY + 1) ** 0.8;
         }

         if (image.currentY > image.maxY) {
            image.currentY = image.maxY - 1 + (image.currentY - image.maxY + 1) ** 0.8;
         } // Velocity


         if (!velocity.prevPositionX) velocity.prevPositionX = image.touchesCurrent.x;
         if (!velocity.prevPositionY) velocity.prevPositionY = image.touchesCurrent.y;
         if (!velocity.prevTime) velocity.prevTime = Date.now();
         velocity.x = (image.touchesCurrent.x - velocity.prevPositionX) / (Date.now() - velocity.prevTime) / 2;
         velocity.y = (image.touchesCurrent.y - velocity.prevPositionY) / (Date.now() - velocity.prevTime) / 2;
         if (Math.abs(image.touchesCurrent.x - velocity.prevPositionX) < 2) velocity.x = 0;
         if (Math.abs(image.touchesCurrent.y - velocity.prevPositionY) < 2) velocity.y = 0;
         velocity.prevPositionX = image.touchesCurrent.x;
         velocity.prevPositionY = image.touchesCurrent.y;
         velocity.prevTime = Date.now();
         gesture.$imageWrapEl.transform(`translate3d(${image.currentX}px, ${image.currentY}px,0)`);
      }

      function onTouchEnd() {
         const zoom = swiper.zoom;
         if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;

         if (!image.isTouched || !image.isMoved) {
            image.isTouched = false;
            image.isMoved = false;
            return;
         }

         image.isTouched = false;
         image.isMoved = false;
         let momentumDurationX = 300;
         let momentumDurationY = 300;
         const momentumDistanceX = velocity.x * momentumDurationX;
         const newPositionX = image.currentX + momentumDistanceX;
         const momentumDistanceY = velocity.y * momentumDurationY;
         const newPositionY = image.currentY + momentumDistanceY; // Fix duration

         if (velocity.x !== 0) momentumDurationX = Math.abs((newPositionX - image.currentX) / velocity.x);
         if (velocity.y !== 0) momentumDurationY = Math.abs((newPositionY - image.currentY) / velocity.y);
         const momentumDuration = Math.max(momentumDurationX, momentumDurationY);
         image.currentX = newPositionX;
         image.currentY = newPositionY; // Define if we need image drag

         const scaledWidth = image.width * zoom.scale;
         const scaledHeight = image.height * zoom.scale;
         image.minX = Math.min(gesture.slideWidth / 2 - scaledWidth / 2, 0);
         image.maxX = -image.minX;
         image.minY = Math.min(gesture.slideHeight / 2 - scaledHeight / 2, 0);
         image.maxY = -image.minY;
         image.currentX = Math.max(Math.min(image.currentX, image.maxX), image.minX);
         image.currentY = Math.max(Math.min(image.currentY, image.maxY), image.minY);
         gesture.$imageWrapEl.transition(momentumDuration).transform(`translate3d(${image.currentX}px, ${image.currentY}px,0)`);
      }

      function onTransitionEnd() {
         const zoom = swiper.zoom;

         if (gesture.$slideEl && swiper.previousIndex !== swiper.activeIndex) {
            if (gesture.$imageEl) {
               gesture.$imageEl.transform('translate3d(0,0,0) scale(1)');
            }

            if (gesture.$imageWrapEl) {
               gesture.$imageWrapEl.transform('translate3d(0,0,0)');
            }

            zoom.scale = 1;
            currentScale = 1;
            gesture.$slideEl = undefined;
            gesture.$imageEl = undefined;
            gesture.$imageWrapEl = undefined;
         }
      }

      function zoomIn(e) {
         const zoom = swiper.zoom;
         const params = swiper.params.zoom;

         if (!gesture.$slideEl) {
            if (e && e.target) {
               gesture.$slideEl = $(e.target).closest(`.${swiper.params.slideClass}`);
            }

            if (!gesture.$slideEl) {
               if (swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual) {
                  gesture.$slideEl = swiper.$wrapperEl.children(`.${swiper.params.slideActiveClass}`);
               } else {
                  gesture.$slideEl = swiper.slides.eq(swiper.activeIndex);
               }
            }

            gesture.$imageEl = gesture.$slideEl.find(`.${params.containerClass}`).eq(0).find('img, svg, canvas, picture, .swiper-zoom-target');
            gesture.$imageWrapEl = gesture.$imageEl.parent(`.${params.containerClass}`);
         }

         if (!gesture.$imageEl || gesture.$imageEl.length === 0 || !gesture.$imageWrapEl || gesture.$imageWrapEl.length === 0) return;

         if (swiper.params.cssMode) {
            swiper.wrapperEl.style.overflow = 'hidden';
            swiper.wrapperEl.style.touchAction = 'none';
         }

         gesture.$slideEl.addClass(`${params.zoomedSlideClass}`);
         let touchX;
         let touchY;
         let offsetX;
         let offsetY;
         let diffX;
         let diffY;
         let translateX;
         let translateY;
         let imageWidth;
         let imageHeight;
         let scaledWidth;
         let scaledHeight;
         let translateMinX;
         let translateMinY;
         let translateMaxX;
         let translateMaxY;
         let slideWidth;
         let slideHeight;

         if (typeof image.touchesStart.x === 'undefined' && e) {
            touchX = e.type === 'touchend' ? e.changedTouches[0].pageX : e.pageX;
            touchY = e.type === 'touchend' ? e.changedTouches[0].pageY : e.pageY;
         } else {
            touchX = image.touchesStart.x;
            touchY = image.touchesStart.y;
         }

         zoom.scale = gesture.$imageWrapEl.attr('data-swiper-zoom') || params.maxRatio;
         currentScale = gesture.$imageWrapEl.attr('data-swiper-zoom') || params.maxRatio;

         if (e) {
            slideWidth = gesture.$slideEl[0].offsetWidth;
            slideHeight = gesture.$slideEl[0].offsetHeight;
            offsetX = gesture.$slideEl.offset().left + window.scrollX;
            offsetY = gesture.$slideEl.offset().top + window.scrollY;
            diffX = offsetX + slideWidth / 2 - touchX;
            diffY = offsetY + slideHeight / 2 - touchY;
            imageWidth = gesture.$imageEl[0].offsetWidth;
            imageHeight = gesture.$imageEl[0].offsetHeight;
            scaledWidth = imageWidth * zoom.scale;
            scaledHeight = imageHeight * zoom.scale;
            translateMinX = Math.min(slideWidth / 2 - scaledWidth / 2, 0);
            translateMinY = Math.min(slideHeight / 2 - scaledHeight / 2, 0);
            translateMaxX = -translateMinX;
            translateMaxY = -translateMinY;
            translateX = diffX * zoom.scale;
            translateY = diffY * zoom.scale;

            if (translateX < translateMinX) {
               translateX = translateMinX;
            }

            if (translateX > translateMaxX) {
               translateX = translateMaxX;
            }

            if (translateY < translateMinY) {
               translateY = translateMinY;
            }

            if (translateY > translateMaxY) {
               translateY = translateMaxY;
            }
         } else {
            translateX = 0;
            translateY = 0;
         }

         gesture.$imageWrapEl.transition(300).transform(`translate3d(${translateX}px, ${translateY}px,0)`);
         gesture.$imageEl.transition(300).transform(`translate3d(0,0,0) scale(${zoom.scale})`);
      }

      function zoomOut() {
         const zoom = swiper.zoom;
         const params = swiper.params.zoom;

         if (!gesture.$slideEl) {
            if (swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual) {
               gesture.$slideEl = swiper.$wrapperEl.children(`.${swiper.params.slideActiveClass}`);
            } else {
               gesture.$slideEl = swiper.slides.eq(swiper.activeIndex);
            }

            gesture.$imageEl = gesture.$slideEl.find(`.${params.containerClass}`).eq(0).find('img, svg, canvas, picture, .swiper-zoom-target');
            gesture.$imageWrapEl = gesture.$imageEl.parent(`.${params.containerClass}`);
         }

         if (!gesture.$imageEl || gesture.$imageEl.length === 0 || !gesture.$imageWrapEl || gesture.$imageWrapEl.length === 0) return;

         if (swiper.params.cssMode) {
            swiper.wrapperEl.style.overflow = '';
            swiper.wrapperEl.style.touchAction = '';
         }

         zoom.scale = 1;
         currentScale = 1;
         gesture.$imageWrapEl.transition(300).transform('translate3d(0,0,0)');
         gesture.$imageEl.transition(300).transform('translate3d(0,0,0) scale(1)');
         gesture.$slideEl.removeClass(`${params.zoomedSlideClass}`);
         gesture.$slideEl = undefined;
      } // Toggle Zoom


      function zoomToggle(e) {
         const zoom = swiper.zoom;

         if (zoom.scale && zoom.scale !== 1) {
            // Zoom Out
            zoomOut();
         } else {
            // Zoom In
            zoomIn(e);
         }
      }

      function getListeners() {
         const support = swiper.support;
         const passiveListener = swiper.touchEvents.start === 'touchstart' && support.passiveListener && swiper.params.passiveListeners ? {
            passive: true,
            capture: false
         } : false;
         const activeListenerWithCapture = support.passiveListener ? {
            passive: false,
            capture: true
         } : true;
         return {
            passiveListener,
            activeListenerWithCapture
         };
      }

      function getSlideSelector() {
         return `.${swiper.params.slideClass}`;
      }

      function toggleGestures(method) {
         const {
            passiveListener
         } = getListeners();
         const slideSelector = getSlideSelector();
         swiper.$wrapperEl[method]('gesturestart', slideSelector, onGestureStart, passiveListener);
         swiper.$wrapperEl[method]('gesturechange', slideSelector, onGestureChange, passiveListener);
         swiper.$wrapperEl[method]('gestureend', slideSelector, onGestureEnd, passiveListener);
      }

      function enableGestures() {
         if (gesturesEnabled) return;
         gesturesEnabled = true;
         toggleGestures('on');
      }

      function disableGestures() {
         if (!gesturesEnabled) return;
         gesturesEnabled = false;
         toggleGestures('off');
      } // Attach/Detach Events


      function enable() {
         const zoom = swiper.zoom;
         if (zoom.enabled) return;
         zoom.enabled = true;
         const support = swiper.support;
         const {
            passiveListener,
            activeListenerWithCapture
         } = getListeners();
         const slideSelector = getSlideSelector(); // Scale image

         if (support.gestures) {
            swiper.$wrapperEl.on(swiper.touchEvents.start, enableGestures, passiveListener);
            swiper.$wrapperEl.on(swiper.touchEvents.end, disableGestures, passiveListener);
         } else if (swiper.touchEvents.start === 'touchstart') {
            swiper.$wrapperEl.on(swiper.touchEvents.start, slideSelector, onGestureStart, passiveListener);
            swiper.$wrapperEl.on(swiper.touchEvents.move, slideSelector, onGestureChange, activeListenerWithCapture);
            swiper.$wrapperEl.on(swiper.touchEvents.end, slideSelector, onGestureEnd, passiveListener);

            if (swiper.touchEvents.cancel) {
               swiper.$wrapperEl.on(swiper.touchEvents.cancel, slideSelector, onGestureEnd, passiveListener);
            }
         } // Move image


         swiper.$wrapperEl.on(swiper.touchEvents.move, `.${swiper.params.zoom.containerClass}`, onTouchMove, activeListenerWithCapture);
      }

      function disable() {
         const zoom = swiper.zoom;
         if (!zoom.enabled) return;
         const support = swiper.support;
         zoom.enabled = false;
         const {
            passiveListener,
            activeListenerWithCapture
         } = getListeners();
         const slideSelector = getSlideSelector(); // Scale image

         if (support.gestures) {
            swiper.$wrapperEl.off(swiper.touchEvents.start, enableGestures, passiveListener);
            swiper.$wrapperEl.off(swiper.touchEvents.end, disableGestures, passiveListener);
         } else if (swiper.touchEvents.start === 'touchstart') {
            swiper.$wrapperEl.off(swiper.touchEvents.start, slideSelector, onGestureStart, passiveListener);
            swiper.$wrapperEl.off(swiper.touchEvents.move, slideSelector, onGestureChange, activeListenerWithCapture);
            swiper.$wrapperEl.off(swiper.touchEvents.end, slideSelector, onGestureEnd, passiveListener);

            if (swiper.touchEvents.cancel) {
               swiper.$wrapperEl.off(swiper.touchEvents.cancel, slideSelector, onGestureEnd, passiveListener);
            }
         } // Move image


         swiper.$wrapperEl.off(swiper.touchEvents.move, `.${swiper.params.zoom.containerClass}`, onTouchMove, activeListenerWithCapture);
      }

      on('init', () => {
         if (swiper.params.zoom.enabled) {
            enable();
         }
      });
      on('destroy', () => {
         disable();
      });
      on('touchStart', (_s, e) => {
         if (!swiper.zoom.enabled) return;
         onTouchStart(e);
      });
      on('touchEnd', (_s, e) => {
         if (!swiper.zoom.enabled) return;
         onTouchEnd();
      });
      on('doubleTap', (_s, e) => {
         if (!swiper.animating && swiper.params.zoom.enabled && swiper.zoom.enabled && swiper.params.zoom.toggle) {
            zoomToggle(e);
         }
      });
      on('transitionEnd', () => {
         if (swiper.zoom.enabled && swiper.params.zoom.enabled) {
            onTransitionEnd();
         }
      });
      on('slideChange', () => {
         if (swiper.zoom.enabled && swiper.params.zoom.enabled && swiper.params.cssMode) {
            onTransitionEnd();
         }
      });
      Object.assign(swiper.zoom, {
         enable,
         disable,
         in: zoomIn,
         out: zoomOut,
         toggle: zoomToggle
      });
   }

   function Lazy({
      swiper,
      extendParams,
      on,
      emit
   }) {
      extendParams({
         lazy: {
            checkInView: false,
            enabled: false,
            loadPrevNext: false,
            loadPrevNextAmount: 1,
            loadOnTransitionStart: false,
            scrollingElement: '',
            elementClass: 'swiper-lazy',
            loadingClass: 'swiper-lazy-loading',
            loadedClass: 'swiper-lazy-loaded',
            preloaderClass: 'swiper-lazy-preloader'
         }
      });
      swiper.lazy = {};
      let scrollHandlerAttached = false;
      let initialImageLoaded = false;

      function loadInSlide(index, loadInDuplicate = true) {
         const params = swiper.params.lazy;
         if (typeof index === 'undefined') return;
         if (swiper.slides.length === 0) return;
         const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
         const $slideEl = isVirtual ? swiper.$wrapperEl.children(`.${swiper.params.slideClass}[data-swiper-slide-index="${index}"]`) : swiper.slides.eq(index);
         const $images = $slideEl.find(`.${params.elementClass}:not(.${params.loadedClass}):not(.${params.loadingClass})`);

         if ($slideEl.hasClass(params.elementClass) && !$slideEl.hasClass(params.loadedClass) && !$slideEl.hasClass(params.loadingClass)) {
            $images.push($slideEl[0]);
         }

         if ($images.length === 0) return;
         $images.each(imageEl => {
            const $imageEl = $(imageEl);
            $imageEl.addClass(params.loadingClass);
            const background = $imageEl.attr('data-background');
            const src = $imageEl.attr('data-src');
            const srcset = $imageEl.attr('data-srcset');
            const sizes = $imageEl.attr('data-sizes');
            const $pictureEl = $imageEl.parent('picture');
            swiper.loadImage($imageEl[0], src || background, srcset, sizes, false, () => {
               if (typeof swiper === 'undefined' || swiper === null || !swiper || swiper && !swiper.params || swiper.destroyed) return;

               if (background) {
                  $imageEl.css('background-image', `url("${background}")`);
                  $imageEl.removeAttr('data-background');
               } else {
                  if (srcset) {
                     $imageEl.attr('srcset', srcset);
                     $imageEl.removeAttr('data-srcset');
                  }

                  if (sizes) {
                     $imageEl.attr('sizes', sizes);
                     $imageEl.removeAttr('data-sizes');
                  }

                  if ($pictureEl.length) {
                     $pictureEl.children('source').each(sourceEl => {
                        const $source = $(sourceEl);

                        if ($source.attr('data-srcset')) {
                           $source.attr('srcset', $source.attr('data-srcset'));
                           $source.removeAttr('data-srcset');
                        }
                     });
                  }

                  if (src) {
                     $imageEl.attr('src', src);
                     $imageEl.removeAttr('data-src');
                  }
               }

               $imageEl.addClass(params.loadedClass).removeClass(params.loadingClass);
               $slideEl.find(`.${params.preloaderClass}`).remove();

               if (swiper.params.loop && loadInDuplicate) {
                  const slideOriginalIndex = $slideEl.attr('data-swiper-slide-index');

                  if ($slideEl.hasClass(swiper.params.slideDuplicateClass)) {
                     const originalSlide = swiper.$wrapperEl.children(`[data-swiper-slide-index="${slideOriginalIndex}"]:not(.${swiper.params.slideDuplicateClass})`);
                     loadInSlide(originalSlide.index(), false);
                  } else {
                     const duplicatedSlide = swiper.$wrapperEl.children(`.${swiper.params.slideDuplicateClass}[data-swiper-slide-index="${slideOriginalIndex}"]`);
                     loadInSlide(duplicatedSlide.index(), false);
                  }
               }

               emit('lazyImageReady', $slideEl[0], $imageEl[0]);

               if (swiper.params.autoHeight) {
                  swiper.updateAutoHeight();
               }
            });
            emit('lazyImageLoad', $slideEl[0], $imageEl[0]);
         });
      }

      function load() {
         const {
            $wrapperEl,
            params: swiperParams,
            slides,
            activeIndex
         } = swiper;
         const isVirtual = swiper.virtual && swiperParams.virtual.enabled;
         const params = swiperParams.lazy;
         let slidesPerView = swiperParams.slidesPerView;

         if (slidesPerView === 'auto') {
            slidesPerView = 0;
         }

         function slideExist(index) {
            if (isVirtual) {
               if ($wrapperEl.children(`.${swiperParams.slideClass}[data-swiper-slide-index="${index}"]`).length) {
                  return true;
               }
            } else if (slides[index]) return true;

            return false;
         }

         function slideIndex(slideEl) {
            if (isVirtual) {
               return $(slideEl).attr('data-swiper-slide-index');
            }

            return $(slideEl).index();
         }

         if (!initialImageLoaded) initialImageLoaded = true;

         if (swiper.params.watchSlidesProgress) {
            $wrapperEl.children(`.${swiperParams.slideVisibleClass}`).each(slideEl => {
               const index = isVirtual ? $(slideEl).attr('data-swiper-slide-index') : $(slideEl).index();
               loadInSlide(index);
            });
         } else if (slidesPerView > 1) {
            for (let i = activeIndex; i < activeIndex + slidesPerView; i += 1) {
               if (slideExist(i)) loadInSlide(i);
            }
         } else {
            loadInSlide(activeIndex);
         }

         if (params.loadPrevNext) {
            if (slidesPerView > 1 || params.loadPrevNextAmount && params.loadPrevNextAmount > 1) {
               const amount = params.loadPrevNextAmount;
               const spv = slidesPerView;
               const maxIndex = Math.min(activeIndex + spv + Math.max(amount, spv), slides.length);
               const minIndex = Math.max(activeIndex - Math.max(spv, amount), 0); // Next Slides

               for (let i = activeIndex + slidesPerView; i < maxIndex; i += 1) {
                  if (slideExist(i)) loadInSlide(i);
               } // Prev Slides


               for (let i = minIndex; i < activeIndex; i += 1) {
                  if (slideExist(i)) loadInSlide(i);
               }
            } else {
               const nextSlide = $wrapperEl.children(`.${swiperParams.slideNextClass}`);
               if (nextSlide.length > 0) loadInSlide(slideIndex(nextSlide));
               const prevSlide = $wrapperEl.children(`.${swiperParams.slidePrevClass}`);
               if (prevSlide.length > 0) loadInSlide(slideIndex(prevSlide));
            }
         }
      }

      function checkInViewOnLoad() {
         const window = getWindow();
         if (!swiper || swiper.destroyed) return;
         const $scrollElement = swiper.params.lazy.scrollingElement ? $(swiper.params.lazy.scrollingElement) : $(window);
         const isWindow = $scrollElement[0] === window;
         const scrollElementWidth = isWindow ? window.innerWidth : $scrollElement[0].offsetWidth;
         const scrollElementHeight = isWindow ? window.innerHeight : $scrollElement[0].offsetHeight;
         const swiperOffset = swiper.$el.offset();
         const {
            rtlTranslate: rtl
         } = swiper;
         let inView = false;
         if (rtl) swiperOffset.left -= swiper.$el[0].scrollLeft;
         const swiperCoord = [[swiperOffset.left, swiperOffset.top], [swiperOffset.left + swiper.width, swiperOffset.top], [swiperOffset.left, swiperOffset.top + swiper.height], [swiperOffset.left + swiper.width, swiperOffset.top + swiper.height]];

         for (let i = 0; i < swiperCoord.length; i += 1) {
            const point = swiperCoord[i];

            if (point[0] >= 0 && point[0] <= scrollElementWidth && point[1] >= 0 && point[1] <= scrollElementHeight) {
               if (point[0] === 0 && point[1] === 0) continue; // eslint-disable-line

               inView = true;
            }
         }

         const passiveListener = swiper.touchEvents.start === 'touchstart' && swiper.support.passiveListener && swiper.params.passiveListeners ? {
            passive: true,
            capture: false
         } : false;

         if (inView) {
            load();
            $scrollElement.off('scroll', checkInViewOnLoad, passiveListener);
         } else if (!scrollHandlerAttached) {
            scrollHandlerAttached = true;
            $scrollElement.on('scroll', checkInViewOnLoad, passiveListener);
         }
      }

      on('beforeInit', () => {
         if (swiper.params.lazy.enabled && swiper.params.preloadImages) {
            swiper.params.preloadImages = false;
         }
      });
      on('init', () => {
         if (swiper.params.lazy.enabled) {
            if (swiper.params.lazy.checkInView) {
               checkInViewOnLoad();
            } else {
               load();
            }
         }
      });
      on('scroll', () => {
         if (swiper.params.freeMode && swiper.params.freeMode.enabled && !swiper.params.freeMode.sticky) {
            load();
         }
      });
      on('scrollbarDragMove resize _freeModeNoMomentumRelease', () => {
         if (swiper.params.lazy.enabled) {
            if (swiper.params.lazy.checkInView) {
               checkInViewOnLoad();
            } else {
               load();
            }
         }
      });
      on('transitionStart', () => {
         if (swiper.params.lazy.enabled) {
            if (swiper.params.lazy.loadOnTransitionStart || !swiper.params.lazy.loadOnTransitionStart && !initialImageLoaded) {
               if (swiper.params.lazy.checkInView) {
                  checkInViewOnLoad();
               } else {
                  load();
               }
            }
         }
      });
      on('transitionEnd', () => {
         if (swiper.params.lazy.enabled && !swiper.params.lazy.loadOnTransitionStart) {
            if (swiper.params.lazy.checkInView) {
               checkInViewOnLoad();
            } else {
               load();
            }
         }
      });
      on('slideChange', () => {
         const {
            lazy,
            cssMode,
            watchSlidesProgress,
            touchReleaseOnEdges,
            resistanceRatio
         } = swiper.params;

         if (lazy.enabled && (cssMode || watchSlidesProgress && (touchReleaseOnEdges || resistanceRatio === 0))) {
            load();
         }
      });
      Object.assign(swiper.lazy, {
         load,
         loadInSlide
      });
   }

   /* eslint no-bitwise: ["error", { "allow": [">>"] }] */
   function Controller({
      swiper,
      extendParams,
      on
   }) {
      extendParams({
         controller: {
            control: undefined,
            inverse: false,
            by: 'slide' // or 'container'

         }
      });
      swiper.controller = {
         control: undefined
      };

      function LinearSpline(x, y) {
         const binarySearch = function search() {
            let maxIndex;
            let minIndex;
            let guess;
            return (array, val) => {
               minIndex = -1;
               maxIndex = array.length;

               while (maxIndex - minIndex > 1) {
                  guess = maxIndex + minIndex >> 1;

                  if (array[guess] <= val) {
                     minIndex = guess;
                  } else {
                     maxIndex = guess;
                  }
               }

               return maxIndex;
            };
         }();

         this.x = x;
         this.y = y;
         this.lastIndex = x.length - 1; // Given an x value (x2), return the expected y2 value:
         // (x1,y1) is the known point before given value,
         // (x3,y3) is the known point after given value.

         let i1;
         let i3;

         this.interpolate = function interpolate(x2) {
            if (!x2) return 0; // Get the indexes of x1 and x3 (the array indexes before and after given x2):

            i3 = binarySearch(this.x, x2);
            i1 = i3 - 1; // We have our indexes i1 & i3, so we can calculate already:
            // y2 := ((x2−x1) × (y3−y1)) ÷ (x3−x1) + y1

            return (x2 - this.x[i1]) * (this.y[i3] - this.y[i1]) / (this.x[i3] - this.x[i1]) + this.y[i1];
         };

         return this;
      } // xxx: for now i will just save one spline function to to


      function getInterpolateFunction(c) {
         if (!swiper.controller.spline) {
            swiper.controller.spline = swiper.params.loop ? new LinearSpline(swiper.slidesGrid, c.slidesGrid) : new LinearSpline(swiper.snapGrid, c.snapGrid);
         }
      }

      function setTranslate(_t, byController) {
         const controlled = swiper.controller.control;
         let multiplier;
         let controlledTranslate;
         const Swiper = swiper.constructor;

         function setControlledTranslate(c) {
            // this will create an Interpolate function based on the snapGrids
            // x is the Grid of the scrolled scroller and y will be the controlled scroller
            // it makes sense to create this only once and recall it for the interpolation
            // the function does a lot of value caching for performance
            const translate = swiper.rtlTranslate ? -swiper.translate : swiper.translate;

            if (swiper.params.controller.by === 'slide') {
               getInterpolateFunction(c); // i am not sure why the values have to be multiplicated this way, tried to invert the snapGrid
               // but it did not work out

               controlledTranslate = -swiper.controller.spline.interpolate(-translate);
            }

            if (!controlledTranslate || swiper.params.controller.by === 'container') {
               multiplier = (c.maxTranslate() - c.minTranslate()) / (swiper.maxTranslate() - swiper.minTranslate());
               controlledTranslate = (translate - swiper.minTranslate()) * multiplier + c.minTranslate();
            }

            if (swiper.params.controller.inverse) {
               controlledTranslate = c.maxTranslate() - controlledTranslate;
            }

            c.updateProgress(controlledTranslate);
            c.setTranslate(controlledTranslate, swiper);
            c.updateActiveIndex();
            c.updateSlidesClasses();
         }

         if (Array.isArray(controlled)) {
            for (let i = 0; i < controlled.length; i += 1) {
               if (controlled[i] !== byController && controlled[i] instanceof Swiper) {
                  setControlledTranslate(controlled[i]);
               }
            }
         } else if (controlled instanceof Swiper && byController !== controlled) {
            setControlledTranslate(controlled);
         }
      }

      function setTransition(duration, byController) {
         const Swiper = swiper.constructor;
         const controlled = swiper.controller.control;
         let i;

         function setControlledTransition(c) {
            c.setTransition(duration, swiper);

            if (duration !== 0) {
               c.transitionStart();

               if (c.params.autoHeight) {
                  nextTick(() => {
                     c.updateAutoHeight();
                  });
               }

               c.$wrapperEl.transitionEnd(() => {
                  if (!controlled) return;

                  if (c.params.loop && swiper.params.controller.by === 'slide') {
                     c.loopFix();
                  }

                  c.transitionEnd();
               });
            }
         }

         if (Array.isArray(controlled)) {
            for (i = 0; i < controlled.length; i += 1) {
               if (controlled[i] !== byController && controlled[i] instanceof Swiper) {
                  setControlledTransition(controlled[i]);
               }
            }
         } else if (controlled instanceof Swiper && byController !== controlled) {
            setControlledTransition(controlled);
         }
      }

      function removeSpline() {
         if (!swiper.controller.control) return;

         if (swiper.controller.spline) {
            swiper.controller.spline = undefined;
            delete swiper.controller.spline;
         }
      }

      on('beforeInit', () => {
         swiper.controller.control = swiper.params.controller.control;
      });
      on('update', () => {
         removeSpline();
      });
      on('resize', () => {
         removeSpline();
      });
      on('observerUpdate', () => {
         removeSpline();
      });
      on('setTranslate', (_s, translate, byController) => {
         if (!swiper.controller.control) return;
         swiper.controller.setTranslate(translate, byController);
      });
      on('setTransition', (_s, duration, byController) => {
         if (!swiper.controller.control) return;
         swiper.controller.setTransition(duration, byController);
      });
      Object.assign(swiper.controller, {
         setTranslate,
         setTransition
      });
   }

   function A11y({
      swiper,
      extendParams,
      on
   }) {
      extendParams({
         a11y: {
            enabled: true,
            notificationClass: 'swiper-notification',
            prevSlideMessage: 'Previous slide',
            nextSlideMessage: 'Next slide',
            firstSlideMessage: 'This is the first slide',
            lastSlideMessage: 'This is the last slide',
            paginationBulletMessage: 'Go to slide {{index}}',
            slideLabelMessage: '{{index}} / {{slidesLength}}',
            containerMessage: null,
            containerRoleDescriptionMessage: null,
            itemRoleDescriptionMessage: null,
            slideRole: 'group'
         }
      });
      let liveRegion = null;

      function notify(message) {
         const notification = liveRegion;
         if (notification.length === 0) return;
         notification.html('');
         notification.html(message);
      }

      function getRandomNumber(size = 16) {
         const randomChar = () => Math.round(16 * Math.random()).toString(16);

         return 'x'.repeat(size).replace(/x/g, randomChar);
      }

      function makeElFocusable($el) {
         $el.attr('tabIndex', '0');
      }

      function makeElNotFocusable($el) {
         $el.attr('tabIndex', '-1');
      }

      function addElRole($el, role) {
         $el.attr('role', role);
      }

      function addElRoleDescription($el, description) {
         $el.attr('aria-roledescription', description);
      }

      function addElControls($el, controls) {
         $el.attr('aria-controls', controls);
      }

      function addElLabel($el, label) {
         $el.attr('aria-label', label);
      }

      function addElId($el, id) {
         $el.attr('id', id);
      }

      function addElLive($el, live) {
         $el.attr('aria-live', live);
      }

      function disableEl($el) {
         $el.attr('aria-disabled', true);
      }

      function enableEl($el) {
         $el.attr('aria-disabled', false);
      }

      function onEnterOrSpaceKey(e) {
         if (e.keyCode !== 13 && e.keyCode !== 32) return;
         const params = swiper.params.a11y;
         const $targetEl = $(e.target);

         if (swiper.navigation && swiper.navigation.$nextEl && $targetEl.is(swiper.navigation.$nextEl)) {
            if (!(swiper.isEnd && !swiper.params.loop)) {
               swiper.slideNext();
            }

            if (swiper.isEnd) {
               notify(params.lastSlideMessage);
            } else {
               notify(params.nextSlideMessage);
            }
         }

         if (swiper.navigation && swiper.navigation.$prevEl && $targetEl.is(swiper.navigation.$prevEl)) {
            if (!(swiper.isBeginning && !swiper.params.loop)) {
               swiper.slidePrev();
            }

            if (swiper.isBeginning) {
               notify(params.firstSlideMessage);
            } else {
               notify(params.prevSlideMessage);
            }
         }

         if (swiper.pagination && $targetEl.is(classesToSelector(swiper.params.pagination.bulletClass))) {
            $targetEl[0].click();
         }
      }

      function updateNavigation() {
         if (swiper.params.loop || !swiper.navigation) return;
         const {
            $nextEl,
            $prevEl
         } = swiper.navigation;

         if ($prevEl && $prevEl.length > 0) {
            if (swiper.isBeginning) {
               disableEl($prevEl);
               makeElNotFocusable($prevEl);
            } else {
               enableEl($prevEl);
               makeElFocusable($prevEl);
            }
         }

         if ($nextEl && $nextEl.length > 0) {
            if (swiper.isEnd) {
               disableEl($nextEl);
               makeElNotFocusable($nextEl);
            } else {
               enableEl($nextEl);
               makeElFocusable($nextEl);
            }
         }
      }

      function hasPagination() {
         return swiper.pagination && swiper.params.pagination.clickable && swiper.pagination.bullets && swiper.pagination.bullets.length;
      }

      function updatePagination() {
         const params = swiper.params.a11y;

         if (hasPagination()) {
            swiper.pagination.bullets.each(bulletEl => {
               const $bulletEl = $(bulletEl);
               makeElFocusable($bulletEl);

               if (!swiper.params.pagination.renderBullet) {
                  addElRole($bulletEl, 'button');
                  addElLabel($bulletEl, params.paginationBulletMessage.replace(/\{\{index\}\}/, $bulletEl.index() + 1));
               }
            });
         }
      }

      const initNavEl = ($el, wrapperId, message) => {
         makeElFocusable($el);

         if ($el[0].tagName !== 'BUTTON') {
            addElRole($el, 'button');
            $el.on('keydown', onEnterOrSpaceKey);
         }

         addElLabel($el, message);
         addElControls($el, wrapperId);
      };

      function init() {
         const params = swiper.params.a11y;
         swiper.$el.append(liveRegion); // Container

         const $containerEl = swiper.$el;

         if (params.containerRoleDescriptionMessage) {
            addElRoleDescription($containerEl, params.containerRoleDescriptionMessage);
         }

         if (params.containerMessage) {
            addElLabel($containerEl, params.containerMessage);
         } // Wrapper


         const $wrapperEl = swiper.$wrapperEl;
         const wrapperId = $wrapperEl.attr('id') || `swiper-wrapper-${getRandomNumber(16)}`;
         const live = swiper.params.autoplay && swiper.params.autoplay.enabled ? 'off' : 'polite';
         addElId($wrapperEl, wrapperId);
         addElLive($wrapperEl, live); // Slide

         if (params.itemRoleDescriptionMessage) {
            addElRoleDescription($(swiper.slides), params.itemRoleDescriptionMessage);
         }

         addElRole($(swiper.slides), params.slideRole);
         const slidesLength = swiper.params.loop ? swiper.slides.filter(el => !el.classList.contains(swiper.params.slideDuplicateClass)).length : swiper.slides.length;
         swiper.slides.each((slideEl, index) => {
            const $slideEl = $(slideEl);
            const slideIndex = swiper.params.loop ? parseInt($slideEl.attr('data-swiper-slide-index'), 10) : index;
            const ariaLabelMessage = params.slideLabelMessage.replace(/\{\{index\}\}/, slideIndex + 1).replace(/\{\{slidesLength\}\}/, slidesLength);
            addElLabel($slideEl, ariaLabelMessage);
         }); // Navigation

         let $nextEl;
         let $prevEl;

         if (swiper.navigation && swiper.navigation.$nextEl) {
            $nextEl = swiper.navigation.$nextEl;
         }

         if (swiper.navigation && swiper.navigation.$prevEl) {
            $prevEl = swiper.navigation.$prevEl;
         }

         if ($nextEl && $nextEl.length) {
            initNavEl($nextEl, wrapperId, params.nextSlideMessage);
         }

         if ($prevEl && $prevEl.length) {
            initNavEl($prevEl, wrapperId, params.prevSlideMessage);
         } // Pagination


         if (hasPagination()) {
            swiper.pagination.$el.on('keydown', classesToSelector(swiper.params.pagination.bulletClass), onEnterOrSpaceKey);
         }
      }

      function destroy() {
         if (liveRegion && liveRegion.length > 0) liveRegion.remove();
         let $nextEl;
         let $prevEl;

         if (swiper.navigation && swiper.navigation.$nextEl) {
            $nextEl = swiper.navigation.$nextEl;
         }

         if (swiper.navigation && swiper.navigation.$prevEl) {
            $prevEl = swiper.navigation.$prevEl;
         }

         if ($nextEl) {
            $nextEl.off('keydown', onEnterOrSpaceKey);
         }

         if ($prevEl) {
            $prevEl.off('keydown', onEnterOrSpaceKey);
         } // Pagination


         if (hasPagination()) {
            swiper.pagination.$el.off('keydown', classesToSelector(swiper.params.pagination.bulletClass), onEnterOrSpaceKey);
         }
      }

      on('beforeInit', () => {
         liveRegion = $(`<span class="${swiper.params.a11y.notificationClass}" aria-live="assertive" aria-atomic="true"></span>`);
      });
      on('afterInit', () => {
         if (!swiper.params.a11y.enabled) return;
         init();
         updateNavigation();
      });
      on('toEdge', () => {
         if (!swiper.params.a11y.enabled) return;
         updateNavigation();
      });
      on('fromEdge', () => {
         if (!swiper.params.a11y.enabled) return;
         updateNavigation();
      });
      on('paginationUpdate', () => {
         if (!swiper.params.a11y.enabled) return;
         updatePagination();
      });
      on('destroy', () => {
         if (!swiper.params.a11y.enabled) return;
         destroy();
      });
   }

   function History({
      swiper,
      extendParams,
      on
   }) {
      extendParams({
         history: {
            enabled: false,
            root: '',
            replaceState: false,
            key: 'slides'
         }
      });
      let initialized = false;
      let paths = {};

      const slugify = text => {
         return text.toString().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
      };

      const getPathValues = urlOverride => {
         const window = getWindow();
         let location;

         if (urlOverride) {
            location = new URL(urlOverride);
         } else {
            location = window.location;
         }

         const pathArray = location.pathname.slice(1).split('/').filter(part => part !== '');
         const total = pathArray.length;
         const key = pathArray[total - 2];
         const value = pathArray[total - 1];
         return {
            key,
            value
         };
      };

      const setHistory = (key, index) => {
         const window = getWindow();
         if (!initialized || !swiper.params.history.enabled) return;
         let location;

         if (swiper.params.url) {
            location = new URL(swiper.params.url);
         } else {
            location = window.location;
         }

         const slide = swiper.slides.eq(index);
         let value = slugify(slide.attr('data-history'));

         if (swiper.params.history.root.length > 0) {
            let root = swiper.params.history.root;
            if (root[root.length - 1] === '/') root = root.slice(0, root.length - 1);
            value = `${root}/${key}/${value}`;
         } else if (!location.pathname.includes(key)) {
            value = `${key}/${value}`;
         }

         const currentState = window.history.state;

         if (currentState && currentState.value === value) {
            return;
         }

         if (swiper.params.history.replaceState) {
            window.history.replaceState({
               value
            }, null, value);
         } else {
            window.history.pushState({
               value
            }, null, value);
         }
      };

      const scrollToSlide = (speed, value, runCallbacks) => {
         if (value) {
            for (let i = 0, length = swiper.slides.length; i < length; i += 1) {
               const slide = swiper.slides.eq(i);
               const slideHistory = slugify(slide.attr('data-history'));

               if (slideHistory === value && !slide.hasClass(swiper.params.slideDuplicateClass)) {
                  const index = slide.index();
                  swiper.slideTo(index, speed, runCallbacks);
               }
            }
         } else {
            swiper.slideTo(0, speed, runCallbacks);
         }
      };

      const setHistoryPopState = () => {
         paths = getPathValues(swiper.params.url);
         scrollToSlide(swiper.params.speed, swiper.paths.value, false);
      };

      const init = () => {
         const window = getWindow();
         if (!swiper.params.history) return;

         if (!window.history || !window.history.pushState) {
            swiper.params.history.enabled = false;
            swiper.params.hashNavigation.enabled = true;
            return;
         }

         initialized = true;
         paths = getPathValues(swiper.params.url);
         if (!paths.key && !paths.value) return;
         scrollToSlide(0, paths.value, swiper.params.runCallbacksOnInit);

         if (!swiper.params.history.replaceState) {
            window.addEventListener('popstate', setHistoryPopState);
         }
      };

      const destroy = () => {
         const window = getWindow();

         if (!swiper.params.history.replaceState) {
            window.removeEventListener('popstate', setHistoryPopState);
         }
      };

      on('init', () => {
         if (swiper.params.history.enabled) {
            init();
         }
      });
      on('destroy', () => {
         if (swiper.params.history.enabled) {
            destroy();
         }
      });
      on('transitionEnd _freeModeNoMomentumRelease', () => {
         if (initialized) {
            setHistory(swiper.params.history.key, swiper.activeIndex);
         }
      });
      on('slideChange', () => {
         if (initialized && swiper.params.cssMode) {
            setHistory(swiper.params.history.key, swiper.activeIndex);
         }
      });
   }

   function HashNavigation({
      swiper,
      extendParams,
      emit,
      on
   }) {
      let initialized = false;
      const document = getDocument();
      const window = getWindow();
      extendParams({
         hashNavigation: {
            enabled: false,
            replaceState: false,
            watchState: false
         }
      });

      const onHashChange = () => {
         emit('hashChange');
         const newHash = document.location.hash.replace('#', '');
         const activeSlideHash = swiper.slides.eq(swiper.activeIndex).attr('data-hash');

         if (newHash !== activeSlideHash) {
            const newIndex = swiper.$wrapperEl.children(`.${swiper.params.slideClass}[data-hash="${newHash}"]`).index();
            if (typeof newIndex === 'undefined') return;
            swiper.slideTo(newIndex);
         }
      };

      const setHash = () => {
         if (!initialized || !swiper.params.hashNavigation.enabled) return;

         if (swiper.params.hashNavigation.replaceState && window.history && window.history.replaceState) {
            window.history.replaceState(null, null, `#${swiper.slides.eq(swiper.activeIndex).attr('data-hash')}` || '');
            emit('hashSet');
         } else {
            const slide = swiper.slides.eq(swiper.activeIndex);
            const hash = slide.attr('data-hash') || slide.attr('data-history');
            document.location.hash = hash || '';
            emit('hashSet');
         }
      };

      const init = () => {
         if (!swiper.params.hashNavigation.enabled || swiper.params.history && swiper.params.history.enabled) return;
         initialized = true;
         const hash = document.location.hash.replace('#', '');

         if (hash) {
            const speed = 0;

            for (let i = 0, length = swiper.slides.length; i < length; i += 1) {
               const slide = swiper.slides.eq(i);
               const slideHash = slide.attr('data-hash') || slide.attr('data-history');

               if (slideHash === hash && !slide.hasClass(swiper.params.slideDuplicateClass)) {
                  const index = slide.index();
                  swiper.slideTo(index, speed, swiper.params.runCallbacksOnInit, true);
               }
            }
         }

         if (swiper.params.hashNavigation.watchState) {
            $(window).on('hashchange', onHashChange);
         }
      };

      const destroy = () => {
         if (swiper.params.hashNavigation.watchState) {
            $(window).off('hashchange', onHashChange);
         }
      };

      on('init', () => {
         if (swiper.params.hashNavigation.enabled) {
            init();
         }
      });
      on('destroy', () => {
         if (swiper.params.hashNavigation.enabled) {
            destroy();
         }
      });
      on('transitionEnd _freeModeNoMomentumRelease', () => {
         if (initialized) {
            setHash();
         }
      });
      on('slideChange', () => {
         if (initialized && swiper.params.cssMode) {
            setHash();
         }
      });
   }

   /* eslint no-underscore-dangle: "off" */
   function Autoplay({
      swiper,
      extendParams,
      on,
      emit
   }) {
      let timeout;
      swiper.autoplay = {
         running: false,
         paused: false
      };
      extendParams({
         autoplay: {
            enabled: false,
            delay: 3000,
            waitForTransition: true,
            disableOnInteraction: true,
            stopOnLastSlide: false,
            reverseDirection: false,
            pauseOnMouseEnter: false
         }
      });

      function run() {
         const $activeSlideEl = swiper.slides.eq(swiper.activeIndex);
         let delay = swiper.params.autoplay.delay;

         if ($activeSlideEl.attr('data-swiper-autoplay')) {
            delay = $activeSlideEl.attr('data-swiper-autoplay') || swiper.params.autoplay.delay;
         }

         clearTimeout(timeout);
         timeout = nextTick(() => {
            let autoplayResult;

            if (swiper.params.autoplay.reverseDirection) {
               if (swiper.params.loop) {
                  swiper.loopFix();
                  autoplayResult = swiper.slidePrev(swiper.params.speed, true, true);
                  emit('autoplay');
               } else if (!swiper.isBeginning) {
                  autoplayResult = swiper.slidePrev(swiper.params.speed, true, true);
                  emit('autoplay');
               } else if (!swiper.params.autoplay.stopOnLastSlide) {
                  autoplayResult = swiper.slideTo(swiper.slides.length - 1, swiper.params.speed, true, true);
                  emit('autoplay');
               } else {
                  stop();
               }
            } else if (swiper.params.loop) {
               swiper.loopFix();
               autoplayResult = swiper.slideNext(swiper.params.speed, true, true);
               emit('autoplay');
            } else if (!swiper.isEnd) {
               autoplayResult = swiper.slideNext(swiper.params.speed, true, true);
               emit('autoplay');
            } else if (!swiper.params.autoplay.stopOnLastSlide) {
               autoplayResult = swiper.slideTo(0, swiper.params.speed, true, true);
               emit('autoplay');
            } else {
               stop();
            }

            if (swiper.params.cssMode && swiper.autoplay.running) run(); else if (autoplayResult === false) {
               run();
            }
         }, delay);
      }

      function start() {
         if (typeof timeout !== 'undefined') return false;
         if (swiper.autoplay.running) return false;
         swiper.autoplay.running = true;
         emit('autoplayStart');
         run();
         return true;
      }

      function stop() {
         if (!swiper.autoplay.running) return false;
         if (typeof timeout === 'undefined') return false;

         if (timeout) {
            clearTimeout(timeout);
            timeout = undefined;
         }

         swiper.autoplay.running = false;
         emit('autoplayStop');
         return true;
      }

      function pause(speed) {
         if (!swiper.autoplay.running) return;
         if (swiper.autoplay.paused) return;
         if (timeout) clearTimeout(timeout);
         swiper.autoplay.paused = true;

         if (speed === 0 || !swiper.params.autoplay.waitForTransition) {
            swiper.autoplay.paused = false;
            run();
         } else {
            ['transitionend', 'webkitTransitionEnd'].forEach(event => {
               swiper.$wrapperEl[0].addEventListener(event, onTransitionEnd);
            });
         }
      }

      function onVisibilityChange() {
         const document = getDocument();

         if (document.visibilityState === 'hidden' && swiper.autoplay.running) {
            pause();
         }

         if (document.visibilityState === 'visible' && swiper.autoplay.paused) {
            run();
            swiper.autoplay.paused = false;
         }
      }

      function onTransitionEnd(e) {
         if (!swiper || swiper.destroyed || !swiper.$wrapperEl) return;
         if (e.target !== swiper.$wrapperEl[0]) return;
         ['transitionend', 'webkitTransitionEnd'].forEach(event => {
            swiper.$wrapperEl[0].removeEventListener(event, onTransitionEnd);
         });
         swiper.autoplay.paused = false;

         if (!swiper.autoplay.running) {
            stop();
         } else {
            run();
         }
      }

      function onMouseEnter() {
         if (swiper.params.autoplay.disableOnInteraction) {
            stop();
         } else {
            pause();
         }

         ['transitionend', 'webkitTransitionEnd'].forEach(event => {
            swiper.$wrapperEl[0].removeEventListener(event, onTransitionEnd);
         });
      }

      function onMouseLeave() {
         if (swiper.params.autoplay.disableOnInteraction) {
            return;
         }

         swiper.autoplay.paused = false;
         run();
      }

      function attachMouseEvents() {
         if (swiper.params.autoplay.pauseOnMouseEnter) {
            swiper.$el.on('mouseenter', onMouseEnter);
            swiper.$el.on('mouseleave', onMouseLeave);
         }
      }

      function detachMouseEvents() {
         swiper.$el.off('mouseenter', onMouseEnter);
         swiper.$el.off('mouseleave', onMouseLeave);
      }

      on('init', () => {
         if (swiper.params.autoplay.enabled) {
            start();
            const document = getDocument();
            document.addEventListener('visibilitychange', onVisibilityChange);
            attachMouseEvents();
         }
      });
      on('beforeTransitionStart', (_s, speed, internal) => {
         if (swiper.autoplay.running) {
            if (internal || !swiper.params.autoplay.disableOnInteraction) {
               swiper.autoplay.pause(speed);
            } else {
               stop();
            }
         }
      });
      on('sliderFirstMove', () => {
         if (swiper.autoplay.running) {
            if (swiper.params.autoplay.disableOnInteraction) {
               stop();
            } else {
               pause();
            }
         }
      });
      on('touchEnd', () => {
         if (swiper.params.cssMode && swiper.autoplay.paused && !swiper.params.autoplay.disableOnInteraction) {
            run();
         }
      });
      on('destroy', () => {
         detachMouseEvents();

         if (swiper.autoplay.running) {
            stop();
         }

         const document = getDocument();
         document.removeEventListener('visibilitychange', onVisibilityChange);
      });
      Object.assign(swiper.autoplay, {
         pause,
         run,
         start,
         stop
      });
   }

   function Thumb({
      swiper,
      extendParams,
      on
   }) {
      extendParams({
         thumbs: {
            swiper: null,
            multipleActiveThumbs: true,
            autoScrollOffset: 0,
            slideThumbActiveClass: 'swiper-slide-thumb-active',
            thumbsContainerClass: 'swiper-thumbs'
         }
      });
      let initialized = false;
      let swiperCreated = false;
      swiper.thumbs = {
         swiper: null
      };

      function onThumbClick() {
         const thumbsSwiper = swiper.thumbs.swiper;
         if (!thumbsSwiper) return;
         const clickedIndex = thumbsSwiper.clickedIndex;
         const clickedSlide = thumbsSwiper.clickedSlide;
         if (clickedSlide && $(clickedSlide).hasClass(swiper.params.thumbs.slideThumbActiveClass)) return;
         if (typeof clickedIndex === 'undefined' || clickedIndex === null) return;
         let slideToIndex;

         if (thumbsSwiper.params.loop) {
            slideToIndex = parseInt($(thumbsSwiper.clickedSlide).attr('data-swiper-slide-index'), 10);
         } else {
            slideToIndex = clickedIndex;
         }

         if (swiper.params.loop) {
            let currentIndex = swiper.activeIndex;

            if (swiper.slides.eq(currentIndex).hasClass(swiper.params.slideDuplicateClass)) {
               swiper.loopFix(); // eslint-disable-next-line

               swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
               currentIndex = swiper.activeIndex;
            }

            const prevIndex = swiper.slides.eq(currentIndex).prevAll(`[data-swiper-slide-index="${slideToIndex}"]`).eq(0).index();
            const nextIndex = swiper.slides.eq(currentIndex).nextAll(`[data-swiper-slide-index="${slideToIndex}"]`).eq(0).index();
            if (typeof prevIndex === 'undefined') slideToIndex = nextIndex; else if (typeof nextIndex === 'undefined') slideToIndex = prevIndex; else if (nextIndex - currentIndex < currentIndex - prevIndex) slideToIndex = nextIndex; else slideToIndex = prevIndex;
         }

         swiper.slideTo(slideToIndex);
      }

      function init() {
         const {
            thumbs: thumbsParams
         } = swiper.params;
         if (initialized) return false;
         initialized = true;
         const SwiperClass = swiper.constructor;

         if (thumbsParams.swiper instanceof SwiperClass) {
            swiper.thumbs.swiper = thumbsParams.swiper;
            Object.assign(swiper.thumbs.swiper.originalParams, {
               watchSlidesProgress: true,
               slideToClickedSlide: false
            });
            Object.assign(swiper.thumbs.swiper.params, {
               watchSlidesProgress: true,
               slideToClickedSlide: false
            });
         } else if (isObject(thumbsParams.swiper)) {
            const thumbsSwiperParams = Object.assign({}, thumbsParams.swiper);
            Object.assign(thumbsSwiperParams, {
               watchSlidesProgress: true,
               slideToClickedSlide: false
            });
            swiper.thumbs.swiper = new SwiperClass(thumbsSwiperParams);
            swiperCreated = true;
         }

         swiper.thumbs.swiper.$el.addClass(swiper.params.thumbs.thumbsContainerClass);
         swiper.thumbs.swiper.on('tap', onThumbClick);
         return true;
      }

      function update(initial) {
         const thumbsSwiper = swiper.thumbs.swiper;
         if (!thumbsSwiper) return;
         const slidesPerView = thumbsSwiper.params.slidesPerView === 'auto' ? thumbsSwiper.slidesPerViewDynamic() : thumbsSwiper.params.slidesPerView;
         const autoScrollOffset = swiper.params.thumbs.autoScrollOffset;
         const useOffset = autoScrollOffset && !thumbsSwiper.params.loop;

         if (swiper.realIndex !== thumbsSwiper.realIndex || useOffset) {
            let currentThumbsIndex = thumbsSwiper.activeIndex;
            let newThumbsIndex;
            let direction;

            if (thumbsSwiper.params.loop) {
               if (thumbsSwiper.slides.eq(currentThumbsIndex).hasClass(thumbsSwiper.params.slideDuplicateClass)) {
                  thumbsSwiper.loopFix(); // eslint-disable-next-line

                  thumbsSwiper._clientLeft = thumbsSwiper.$wrapperEl[0].clientLeft;
                  currentThumbsIndex = thumbsSwiper.activeIndex;
               } // Find actual thumbs index to slide to


               const prevThumbsIndex = thumbsSwiper.slides.eq(currentThumbsIndex).prevAll(`[data-swiper-slide-index="${swiper.realIndex}"]`).eq(0).index();
               const nextThumbsIndex = thumbsSwiper.slides.eq(currentThumbsIndex).nextAll(`[data-swiper-slide-index="${swiper.realIndex}"]`).eq(0).index();

               if (typeof prevThumbsIndex === 'undefined') {
                  newThumbsIndex = nextThumbsIndex;
               } else if (typeof nextThumbsIndex === 'undefined') {
                  newThumbsIndex = prevThumbsIndex;
               } else if (nextThumbsIndex - currentThumbsIndex === currentThumbsIndex - prevThumbsIndex) {
                  newThumbsIndex = thumbsSwiper.params.slidesPerGroup > 1 ? nextThumbsIndex : currentThumbsIndex;
               } else if (nextThumbsIndex - currentThumbsIndex < currentThumbsIndex - prevThumbsIndex) {
                  newThumbsIndex = nextThumbsIndex;
               } else {
                  newThumbsIndex = prevThumbsIndex;
               }

               direction = swiper.activeIndex > swiper.previousIndex ? 'next' : 'prev';
            } else {
               newThumbsIndex = swiper.realIndex;
               direction = newThumbsIndex > swiper.previousIndex ? 'next' : 'prev';
            }

            if (useOffset) {
               newThumbsIndex += direction === 'next' ? autoScrollOffset : -1 * autoScrollOffset;
            }

            if (thumbsSwiper.visibleSlidesIndexes && thumbsSwiper.visibleSlidesIndexes.indexOf(newThumbsIndex) < 0) {
               if (thumbsSwiper.params.centeredSlides) {
                  if (newThumbsIndex > currentThumbsIndex) {
                     newThumbsIndex = newThumbsIndex - Math.floor(slidesPerView / 2) + 1;
                  } else {
                     newThumbsIndex = newThumbsIndex + Math.floor(slidesPerView / 2) - 1;
                  }
               } else if (newThumbsIndex > currentThumbsIndex && thumbsSwiper.params.slidesPerGroup === 1);

               thumbsSwiper.slideTo(newThumbsIndex, initial ? 0 : undefined);
            }
         } // Activate thumbs


         let thumbsToActivate = 1;
         const thumbActiveClass = swiper.params.thumbs.slideThumbActiveClass;

         if (swiper.params.slidesPerView > 1 && !swiper.params.centeredSlides) {
            thumbsToActivate = swiper.params.slidesPerView;
         }

         if (!swiper.params.thumbs.multipleActiveThumbs) {
            thumbsToActivate = 1;
         }

         thumbsToActivate = Math.floor(thumbsToActivate);
         thumbsSwiper.slides.removeClass(thumbActiveClass);

         if (thumbsSwiper.params.loop || thumbsSwiper.params.virtual && thumbsSwiper.params.virtual.enabled) {
            for (let i = 0; i < thumbsToActivate; i += 1) {
               thumbsSwiper.$wrapperEl.children(`[data-swiper-slide-index="${swiper.realIndex + i}"]`).addClass(thumbActiveClass);
            }
         } else {
            for (let i = 0; i < thumbsToActivate; i += 1) {
               thumbsSwiper.slides.eq(swiper.realIndex + i).addClass(thumbActiveClass);
            }
         }
      }

      on('beforeInit', () => {
         const {
            thumbs
         } = swiper.params;
         if (!thumbs || !thumbs.swiper) return;
         init();
         update(true);
      });
      on('slideChange update resize observerUpdate', () => {
         if (!swiper.thumbs.swiper) return;
         update();
      });
      on('setTransition', (_s, duration) => {
         const thumbsSwiper = swiper.thumbs.swiper;
         if (!thumbsSwiper) return;
         thumbsSwiper.setTransition(duration);
      });
      on('beforeDestroy', () => {
         const thumbsSwiper = swiper.thumbs.swiper;
         if (!thumbsSwiper) return;

         if (swiperCreated && thumbsSwiper) {
            thumbsSwiper.destroy();
         }
      });
      Object.assign(swiper.thumbs, {
         init,
         update
      });
   }

   function freeMode({
      swiper,
      extendParams,
      emit,
      once
   }) {
      extendParams({
         freeMode: {
            enabled: false,
            momentum: true,
            momentumRatio: 1,
            momentumBounce: true,
            momentumBounceRatio: 1,
            momentumVelocityRatio: 1,
            sticky: false,
            minimumVelocity: 0.02
         }
      });

      function onTouchMove() {
         const {
            touchEventsData: data,
            touches
         } = swiper; // Velocity

         if (data.velocities.length === 0) {
            data.velocities.push({
               position: touches[swiper.isHorizontal() ? 'startX' : 'startY'],
               time: data.touchStartTime
            });
         }

         data.velocities.push({
            position: touches[swiper.isHorizontal() ? 'currentX' : 'currentY'],
            time: now()
         });
      }

      function onTouchEnd({
         currentPos
      }) {
         const {
            params,
            $wrapperEl,
            rtlTranslate: rtl,
            snapGrid,
            touchEventsData: data
         } = swiper; // Time diff

         const touchEndTime = now();
         const timeDiff = touchEndTime - data.touchStartTime;

         if (currentPos < -swiper.minTranslate()) {
            swiper.slideTo(swiper.activeIndex);
            return;
         }

         if (currentPos > -swiper.maxTranslate()) {
            if (swiper.slides.length < snapGrid.length) {
               swiper.slideTo(snapGrid.length - 1);
            } else {
               swiper.slideTo(swiper.slides.length - 1);
            }

            return;
         }

         if (params.freeMode.momentum) {
            if (data.velocities.length > 1) {
               const lastMoveEvent = data.velocities.pop();
               const velocityEvent = data.velocities.pop();
               const distance = lastMoveEvent.position - velocityEvent.position;
               const time = lastMoveEvent.time - velocityEvent.time;
               swiper.velocity = distance / time;
               swiper.velocity /= 2;

               if (Math.abs(swiper.velocity) < params.freeMode.minimumVelocity) {
                  swiper.velocity = 0;
               } // this implies that the user stopped moving a finger then released.
               // There would be no events with distance zero, so the last event is stale.


               if (time > 150 || now() - lastMoveEvent.time > 300) {
                  swiper.velocity = 0;
               }
            } else {
               swiper.velocity = 0;
            }

            swiper.velocity *= params.freeMode.momentumVelocityRatio;
            data.velocities.length = 0;
            let momentumDuration = 1000 * params.freeMode.momentumRatio;
            const momentumDistance = swiper.velocity * momentumDuration;
            let newPosition = swiper.translate + momentumDistance;
            if (rtl) newPosition = -newPosition;
            let doBounce = false;
            let afterBouncePosition;
            const bounceAmount = Math.abs(swiper.velocity) * 20 * params.freeMode.momentumBounceRatio;
            let needsLoopFix;

            if (newPosition < swiper.maxTranslate()) {
               if (params.freeMode.momentumBounce) {
                  if (newPosition + swiper.maxTranslate() < -bounceAmount) {
                     newPosition = swiper.maxTranslate() - bounceAmount;
                  }

                  afterBouncePosition = swiper.maxTranslate();
                  doBounce = true;
                  data.allowMomentumBounce = true;
               } else {
                  newPosition = swiper.maxTranslate();
               }

               if (params.loop && params.centeredSlides) needsLoopFix = true;
            } else if (newPosition > swiper.minTranslate()) {
               if (params.freeMode.momentumBounce) {
                  if (newPosition - swiper.minTranslate() > bounceAmount) {
                     newPosition = swiper.minTranslate() + bounceAmount;
                  }

                  afterBouncePosition = swiper.minTranslate();
                  doBounce = true;
                  data.allowMomentumBounce = true;
               } else {
                  newPosition = swiper.minTranslate();
               }

               if (params.loop && params.centeredSlides) needsLoopFix = true;
            } else if (params.freeMode.sticky) {
               let nextSlide;

               for (let j = 0; j < snapGrid.length; j += 1) {
                  if (snapGrid[j] > -newPosition) {
                     nextSlide = j;
                     break;
                  }
               }

               if (Math.abs(snapGrid[nextSlide] - newPosition) < Math.abs(snapGrid[nextSlide - 1] - newPosition) || swiper.swipeDirection === 'next') {
                  newPosition = snapGrid[nextSlide];
               } else {
                  newPosition = snapGrid[nextSlide - 1];
               }

               newPosition = -newPosition;
            }

            if (needsLoopFix) {
               once('transitionEnd', () => {
                  swiper.loopFix();
               });
            } // Fix duration


            if (swiper.velocity !== 0) {
               if (rtl) {
                  momentumDuration = Math.abs((-newPosition - swiper.translate) / swiper.velocity);
               } else {
                  momentumDuration = Math.abs((newPosition - swiper.translate) / swiper.velocity);
               }

               if (params.freeMode.sticky) {
                  // If freeMode.sticky is active and the user ends a swipe with a slow-velocity
                  // event, then durations can be 20+ seconds to slide one (or zero!) slides.
                  // It's easy to see this when simulating touch with mouse events. To fix this,
                  // limit single-slide swipes to the default slide duration. This also has the
                  // nice side effect of matching slide speed if the user stopped moving before
                  // lifting finger or mouse vs. moving slowly before lifting the finger/mouse.
                  // For faster swipes, also apply limits (albeit higher ones).
                  const moveDistance = Math.abs((rtl ? -newPosition : newPosition) - swiper.translate);
                  const currentSlideSize = swiper.slidesSizesGrid[swiper.activeIndex];

                  if (moveDistance < currentSlideSize) {
                     momentumDuration = params.speed;
                  } else if (moveDistance < 2 * currentSlideSize) {
                     momentumDuration = params.speed * 1.5;
                  } else {
                     momentumDuration = params.speed * 2.5;
                  }
               }
            } else if (params.freeMode.sticky) {
               swiper.slideToClosest();
               return;
            }

            if (params.freeMode.momentumBounce && doBounce) {
               swiper.updateProgress(afterBouncePosition);
               swiper.setTransition(momentumDuration);
               swiper.setTranslate(newPosition);
               swiper.transitionStart(true, swiper.swipeDirection);
               swiper.animating = true;
               $wrapperEl.transitionEnd(() => {
                  if (!swiper || swiper.destroyed || !data.allowMomentumBounce) return;
                  emit('momentumBounce');
                  swiper.setTransition(params.speed);
                  setTimeout(() => {
                     swiper.setTranslate(afterBouncePosition);
                     $wrapperEl.transitionEnd(() => {
                        if (!swiper || swiper.destroyed) return;
                        swiper.transitionEnd();
                     });
                  }, 0);
               });
            } else if (swiper.velocity) {
               emit('_freeModeNoMomentumRelease');
               swiper.updateProgress(newPosition);
               swiper.setTransition(momentumDuration);
               swiper.setTranslate(newPosition);
               swiper.transitionStart(true, swiper.swipeDirection);

               if (!swiper.animating) {
                  swiper.animating = true;
                  $wrapperEl.transitionEnd(() => {
                     if (!swiper || swiper.destroyed) return;
                     swiper.transitionEnd();
                  });
               }
            } else {
               swiper.updateProgress(newPosition);
            }

            swiper.updateActiveIndex();
            swiper.updateSlidesClasses();
         } else if (params.freeMode.sticky) {
            swiper.slideToClosest();
            return;
         } else if (params.freeMode) {
            emit('_freeModeNoMomentumRelease');
         }

         if (!params.freeMode.momentum || timeDiff >= params.longSwipesMs) {
            swiper.updateProgress();
            swiper.updateActiveIndex();
            swiper.updateSlidesClasses();
         }
      }

      Object.assign(swiper, {
         freeMode: {
            onTouchMove,
            onTouchEnd
         }
      });
   }

   function Grid({
      swiper,
      extendParams
   }) {
      extendParams({
         grid: {
            rows: 1,
            fill: 'column'
         }
      });
      let slidesNumberEvenToRows;
      let slidesPerRow;
      let numFullColumns;

      const initSlides = slidesLength => {
         const {
            slidesPerView
         } = swiper.params;
         const {
            rows,
            fill
         } = swiper.params.grid;
         slidesPerRow = slidesNumberEvenToRows / rows;
         numFullColumns = Math.floor(slidesLength / rows);

         if (Math.floor(slidesLength / rows) === slidesLength / rows) {
            slidesNumberEvenToRows = slidesLength;
         } else {
            slidesNumberEvenToRows = Math.ceil(slidesLength / rows) * rows;
         }

         if (slidesPerView !== 'auto' && fill === 'row') {
            slidesNumberEvenToRows = Math.max(slidesNumberEvenToRows, slidesPerView * rows);
         }
      };

      const updateSlide = (i, slide, slidesLength, getDirectionLabel) => {
         const {
            slidesPerGroup,
            spaceBetween
         } = swiper.params;
         const {
            rows,
            fill
         } = swiper.params.grid; // Set slides order

         let newSlideOrderIndex;
         let column;
         let row;

         if (fill === 'row' && slidesPerGroup > 1) {
            const groupIndex = Math.floor(i / (slidesPerGroup * rows));
            const slideIndexInGroup = i - rows * slidesPerGroup * groupIndex;
            const columnsInGroup = groupIndex === 0 ? slidesPerGroup : Math.min(Math.ceil((slidesLength - groupIndex * rows * slidesPerGroup) / rows), slidesPerGroup);
            row = Math.floor(slideIndexInGroup / columnsInGroup);
            column = slideIndexInGroup - row * columnsInGroup + groupIndex * slidesPerGroup;
            newSlideOrderIndex = column + row * slidesNumberEvenToRows / rows;
            slide.css({
               '-webkit-order': newSlideOrderIndex,
               order: newSlideOrderIndex
            });
         } else if (fill === 'column') {
            column = Math.floor(i / rows);
            row = i - column * rows;

            if (column > numFullColumns || column === numFullColumns && row === rows - 1) {
               row += 1;

               if (row >= rows) {
                  row = 0;
                  column += 1;
               }
            }
         } else {
            row = Math.floor(i / slidesPerRow);
            column = i - row * slidesPerRow;
         }

         slide.css(getDirectionLabel('margin-top'), row !== 0 ? spaceBetween && `${spaceBetween}px` : '');
      };

      const updateWrapperSize = (slideSize, snapGrid, getDirectionLabel) => {
         const {
            spaceBetween,
            centeredSlides,
            roundLengths
         } = swiper.params;
         const {
            rows
         } = swiper.params.grid;
         swiper.virtualSize = (slideSize + spaceBetween) * slidesNumberEvenToRows;
         swiper.virtualSize = Math.ceil(swiper.virtualSize / rows) - spaceBetween;
         swiper.$wrapperEl.css({
            [getDirectionLabel('width')]: `${swiper.virtualSize + spaceBetween}px`
         });

         if (centeredSlides) {
            snapGrid.splice(0, snapGrid.length);
            const newSlidesGrid = [];

            for (let i = 0; i < snapGrid.length; i += 1) {
               let slidesGridItem = snapGrid[i];
               if (roundLengths) slidesGridItem = Math.floor(slidesGridItem);
               if (snapGrid[i] < swiper.virtualSize + snapGrid[0]) newSlidesGrid.push(slidesGridItem);
            }

            snapGrid.push(...newSlidesGrid);
         }
      };

      swiper.grid = {
         initSlides,
         updateSlide,
         updateWrapperSize
      };
   }

   function appendSlide(slides) {
      const swiper = this;
      const {
         $wrapperEl,
         params
      } = swiper;

      if (params.loop) {
         swiper.loopDestroy();
      }

      if (typeof slides === 'object' && 'length' in slides) {
         for (let i = 0; i < slides.length; i += 1) {
            if (slides[i]) $wrapperEl.append(slides[i]);
         }
      } else {
         $wrapperEl.append(slides);
      }

      if (params.loop) {
         swiper.loopCreate();
      }

      if (!params.observer) {
         swiper.update();
      }
   }

   function prependSlide(slides) {
      const swiper = this;
      const {
         params,
         $wrapperEl,
         activeIndex
      } = swiper;

      if (params.loop) {
         swiper.loopDestroy();
      }

      let newActiveIndex = activeIndex + 1;

      if (typeof slides === 'object' && 'length' in slides) {
         for (let i = 0; i < slides.length; i += 1) {
            if (slides[i]) $wrapperEl.prepend(slides[i]);
         }

         newActiveIndex = activeIndex + slides.length;
      } else {
         $wrapperEl.prepend(slides);
      }

      if (params.loop) {
         swiper.loopCreate();
      }

      if (!params.observer) {
         swiper.update();
      }

      swiper.slideTo(newActiveIndex, 0, false);
   }

   function addSlide(index, slides) {
      const swiper = this;
      const {
         $wrapperEl,
         params,
         activeIndex
      } = swiper;
      let activeIndexBuffer = activeIndex;

      if (params.loop) {
         activeIndexBuffer -= swiper.loopedSlides;
         swiper.loopDestroy();
         swiper.slides = $wrapperEl.children(`.${params.slideClass}`);
      }

      const baseLength = swiper.slides.length;

      if (index <= 0) {
         swiper.prependSlide(slides);
         return;
      }

      if (index >= baseLength) {
         swiper.appendSlide(slides);
         return;
      }

      let newActiveIndex = activeIndexBuffer > index ? activeIndexBuffer + 1 : activeIndexBuffer;
      const slidesBuffer = [];

      for (let i = baseLength - 1; i >= index; i -= 1) {
         const currentSlide = swiper.slides.eq(i);
         currentSlide.remove();
         slidesBuffer.unshift(currentSlide);
      }

      if (typeof slides === 'object' && 'length' in slides) {
         for (let i = 0; i < slides.length; i += 1) {
            if (slides[i]) $wrapperEl.append(slides[i]);
         }

         newActiveIndex = activeIndexBuffer > index ? activeIndexBuffer + slides.length : activeIndexBuffer;
      } else {
         $wrapperEl.append(slides);
      }

      for (let i = 0; i < slidesBuffer.length; i += 1) {
         $wrapperEl.append(slidesBuffer[i]);
      }

      if (params.loop) {
         swiper.loopCreate();
      }

      if (!params.observer) {
         swiper.update();
      }

      if (params.loop) {
         swiper.slideTo(newActiveIndex + swiper.loopedSlides, 0, false);
      } else {
         swiper.slideTo(newActiveIndex, 0, false);
      }
   }

   function removeSlide(slidesIndexes) {
      const swiper = this;
      const {
         params,
         $wrapperEl,
         activeIndex
      } = swiper;
      let activeIndexBuffer = activeIndex;

      if (params.loop) {
         activeIndexBuffer -= swiper.loopedSlides;
         swiper.loopDestroy();
         swiper.slides = $wrapperEl.children(`.${params.slideClass}`);
      }

      let newActiveIndex = activeIndexBuffer;
      let indexToRemove;

      if (typeof slidesIndexes === 'object' && 'length' in slidesIndexes) {
         for (let i = 0; i < slidesIndexes.length; i += 1) {
            indexToRemove = slidesIndexes[i];
            if (swiper.slides[indexToRemove]) swiper.slides.eq(indexToRemove).remove();
            if (indexToRemove < newActiveIndex) newActiveIndex -= 1;
         }

         newActiveIndex = Math.max(newActiveIndex, 0);
      } else {
         indexToRemove = slidesIndexes;
         if (swiper.slides[indexToRemove]) swiper.slides.eq(indexToRemove).remove();
         if (indexToRemove < newActiveIndex) newActiveIndex -= 1;
         newActiveIndex = Math.max(newActiveIndex, 0);
      }

      if (params.loop) {
         swiper.loopCreate();
      }

      if (!params.observer) {
         swiper.update();
      }

      if (params.loop) {
         swiper.slideTo(newActiveIndex + swiper.loopedSlides, 0, false);
      } else {
         swiper.slideTo(newActiveIndex, 0, false);
      }
   }

   function removeAllSlides() {
      const swiper = this;
      const slidesIndexes = [];

      for (let i = 0; i < swiper.slides.length; i += 1) {
         slidesIndexes.push(i);
      }

      swiper.removeSlide(slidesIndexes);
   }

   function Manipulation({
      swiper
   }) {
      Object.assign(swiper, {
         appendSlide: appendSlide.bind(swiper),
         prependSlide: prependSlide.bind(swiper),
         addSlide: addSlide.bind(swiper),
         removeSlide: removeSlide.bind(swiper),
         removeAllSlides: removeAllSlides.bind(swiper)
      });
   }

   function effectInit(params) {
      const {
         effect,
         swiper,
         on,
         setTranslate,
         setTransition,
         overwriteParams,
         perspective
      } = params;
      on('beforeInit', () => {
         if (swiper.params.effect !== effect) return;
         swiper.classNames.push(`${swiper.params.containerModifierClass}${effect}`);

         if (perspective && perspective()) {
            swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);
         }

         const overwriteParamsResult = overwriteParams ? overwriteParams() : {};
         Object.assign(swiper.params, overwriteParamsResult);
         Object.assign(swiper.originalParams, overwriteParamsResult);
      });
      on('setTranslate', () => {
         if (swiper.params.effect !== effect) return;
         setTranslate();
      });
      on('setTransition', (_s, duration) => {
         if (swiper.params.effect !== effect) return;
         setTransition(duration);
      });
   }

   function effectTarget(effectParams, $slideEl) {
      if (effectParams.transformEl) {
         return $slideEl.find(effectParams.transformEl).css({
            'backface-visibility': 'hidden',
            '-webkit-backface-visibility': 'hidden'
         });
      }

      return $slideEl;
   }

   function effectVirtualTransitionEnd({
      swiper,
      duration,
      transformEl,
      allSlides
   }) {
      const {
         slides,
         activeIndex,
         $wrapperEl
      } = swiper;

      if (swiper.params.virtualTranslate && duration !== 0) {
         let eventTriggered = false;
         let $transitionEndTarget;

         if (allSlides) {
            $transitionEndTarget = transformEl ? slides.find(transformEl) : slides;
         } else {
            $transitionEndTarget = transformEl ? slides.eq(activeIndex).find(transformEl) : slides.eq(activeIndex);
         }

         $transitionEndTarget.transitionEnd(() => {
            if (eventTriggered) return;
            if (!swiper || swiper.destroyed) return;
            eventTriggered = true;
            swiper.animating = false;
            const triggerEvents = ['webkitTransitionEnd', 'transitionend'];

            for (let i = 0; i < triggerEvents.length; i += 1) {
               $wrapperEl.trigger(triggerEvents[i]);
            }
         });
      }
   }

   function EffectFade({
      swiper,
      extendParams,
      on
   }) {
      extendParams({
         fadeEffect: {
            crossFade: false,
            transformEl: null
         }
      });

      const setTranslate = () => {
         const {
            slides
         } = swiper;
         const params = swiper.params.fadeEffect;

         for (let i = 0; i < slides.length; i += 1) {
            const $slideEl = swiper.slides.eq(i);
            const offset = $slideEl[0].swiperSlideOffset;
            let tx = -offset;
            if (!swiper.params.virtualTranslate) tx -= swiper.translate;
            let ty = 0;

            if (!swiper.isHorizontal()) {
               ty = tx;
               tx = 0;
            }

            const slideOpacity = swiper.params.fadeEffect.crossFade ? Math.max(1 - Math.abs($slideEl[0].progress), 0) : 1 + Math.min(Math.max($slideEl[0].progress, -1), 0);
            const $targetEl = effectTarget(params, $slideEl);
            $targetEl.css({
               opacity: slideOpacity
            }).transform(`translate3d(${tx}px, ${ty}px, 0px)`);
         }
      };

      const setTransition = duration => {
         const {
            transformEl
         } = swiper.params.fadeEffect;
         const $transitionElements = transformEl ? swiper.slides.find(transformEl) : swiper.slides;
         $transitionElements.transition(duration);
         effectVirtualTransitionEnd({
            swiper,
            duration,
            transformEl,
            allSlides: true
         });
      };

      effectInit({
         effect: 'fade',
         swiper,
         on,
         setTranslate,
         setTransition,
         overwriteParams: () => ({
            slidesPerView: 1,
            slidesPerGroup: 1,
            watchSlidesProgress: true,
            spaceBetween: 0,
            virtualTranslate: !swiper.params.cssMode
         })
      });
   }

   function EffectCube({
      swiper,
      extendParams,
      on
   }) {
      extendParams({
         cubeEffect: {
            slideShadows: true,
            shadow: true,
            shadowOffset: 20,
            shadowScale: 0.94
         }
      });

      const setTranslate = () => {
         const {
            $el,
            $wrapperEl,
            slides,
            width: swiperWidth,
            height: swiperHeight,
            rtlTranslate: rtl,
            size: swiperSize,
            browser
         } = swiper;
         const params = swiper.params.cubeEffect;
         const isHorizontal = swiper.isHorizontal();
         const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
         let wrapperRotate = 0;
         let $cubeShadowEl;

         if (params.shadow) {
            if (isHorizontal) {
               $cubeShadowEl = $wrapperEl.find('.swiper-cube-shadow');

               if ($cubeShadowEl.length === 0) {
                  $cubeShadowEl = $('<div class="swiper-cube-shadow"></div>');
                  $wrapperEl.append($cubeShadowEl);
               }

               $cubeShadowEl.css({
                  height: `${swiperWidth}px`
               });
            } else {
               $cubeShadowEl = $el.find('.swiper-cube-shadow');

               if ($cubeShadowEl.length === 0) {
                  $cubeShadowEl = $('<div class="swiper-cube-shadow"></div>');
                  $el.append($cubeShadowEl);
               }
            }
         }

         for (let i = 0; i < slides.length; i += 1) {
            const $slideEl = slides.eq(i);
            let slideIndex = i;

            if (isVirtual) {
               slideIndex = parseInt($slideEl.attr('data-swiper-slide-index'), 10);
            }

            let slideAngle = slideIndex * 90;
            let round = Math.floor(slideAngle / 360);

            if (rtl) {
               slideAngle = -slideAngle;
               round = Math.floor(-slideAngle / 360);
            }

            const progress = Math.max(Math.min($slideEl[0].progress, 1), -1);
            let tx = 0;
            let ty = 0;
            let tz = 0;

            if (slideIndex % 4 === 0) {
               tx = -round * 4 * swiperSize;
               tz = 0;
            } else if ((slideIndex - 1) % 4 === 0) {
               tx = 0;
               tz = -round * 4 * swiperSize;
            } else if ((slideIndex - 2) % 4 === 0) {
               tx = swiperSize + round * 4 * swiperSize;
               tz = swiperSize;
            } else if ((slideIndex - 3) % 4 === 0) {
               tx = -swiperSize;
               tz = 3 * swiperSize + swiperSize * 4 * round;
            }

            if (rtl) {
               tx = -tx;
            }

            if (!isHorizontal) {
               ty = tx;
               tx = 0;
            }

            const transform = `rotateX(${isHorizontal ? 0 : -slideAngle}deg) rotateY(${isHorizontal ? slideAngle : 0}deg) translate3d(${tx}px, ${ty}px, ${tz}px)`;

            if (progress <= 1 && progress > -1) {
               wrapperRotate = slideIndex * 90 + progress * 90;
               if (rtl) wrapperRotate = -slideIndex * 90 - progress * 90;
            }

            $slideEl.transform(transform);

            if (params.slideShadows) {
               // Set shadows
               let shadowBefore = isHorizontal ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
               let shadowAfter = isHorizontal ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');

               if (shadowBefore.length === 0) {
                  shadowBefore = $(`<div class="swiper-slide-shadow-${isHorizontal ? 'left' : 'top'}"></div>`);
                  $slideEl.append(shadowBefore);
               }

               if (shadowAfter.length === 0) {
                  shadowAfter = $(`<div class="swiper-slide-shadow-${isHorizontal ? 'right' : 'bottom'}"></div>`);
                  $slideEl.append(shadowAfter);
               }

               if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
               if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
            }
         }

         $wrapperEl.css({
            '-webkit-transform-origin': `50% 50% -${swiperSize / 2}px`,
            'transform-origin': `50% 50% -${swiperSize / 2}px`
         });

         if (params.shadow) {
            if (isHorizontal) {
               $cubeShadowEl.transform(`translate3d(0px, ${swiperWidth / 2 + params.shadowOffset}px, ${-swiperWidth / 2}px) rotateX(90deg) rotateZ(0deg) scale(${params.shadowScale})`);
            } else {
               const shadowAngle = Math.abs(wrapperRotate) - Math.floor(Math.abs(wrapperRotate) / 90) * 90;
               const multiplier = 1.5 - (Math.sin(shadowAngle * 2 * Math.PI / 360) / 2 + Math.cos(shadowAngle * 2 * Math.PI / 360) / 2);
               const scale1 = params.shadowScale;
               const scale2 = params.shadowScale / multiplier;
               const offset = params.shadowOffset;
               $cubeShadowEl.transform(`scale3d(${scale1}, 1, ${scale2}) translate3d(0px, ${swiperHeight / 2 + offset}px, ${-swiperHeight / 2 / scale2}px) rotateX(-90deg)`);
            }
         }

         const zFactor = browser.isSafari || browser.isWebView ? -swiperSize / 2 : 0;
         $wrapperEl.transform(`translate3d(0px,0,${zFactor}px) rotateX(${swiper.isHorizontal() ? 0 : wrapperRotate}deg) rotateY(${swiper.isHorizontal() ? -wrapperRotate : 0}deg)`);
      };

      const setTransition = duration => {
         const {
            $el,
            slides
         } = swiper;
         slides.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);

         if (swiper.params.cubeEffect.shadow && !swiper.isHorizontal()) {
            $el.find('.swiper-cube-shadow').transition(duration);
         }
      };

      effectInit({
         effect: 'cube',
         swiper,
         on,
         setTranslate,
         setTransition,
         perspective: () => true,
         overwriteParams: () => ({
            slidesPerView: 1,
            slidesPerGroup: 1,
            watchSlidesProgress: true,
            resistanceRatio: 0,
            spaceBetween: 0,
            centeredSlides: false,
            virtualTranslate: true
         })
      });
   }

   function createShadow(params, $slideEl, side) {
      const shadowClass = `swiper-slide-shadow${side ? `-${side}` : ''}`;
      const $shadowContainer = params.transformEl ? $slideEl.find(params.transformEl) : $slideEl;
      let $shadowEl = $shadowContainer.children(`.${shadowClass}`);

      if (!$shadowEl.length) {
         $shadowEl = $(`<div class="swiper-slide-shadow${side ? `-${side}` : ''}"></div>`);
         $shadowContainer.append($shadowEl);
      }

      return $shadowEl;
   }

   function EffectFlip({
      swiper,
      extendParams,
      on
   }) {
      extendParams({
         flipEffect: {
            slideShadows: true,
            limitRotation: true,
            transformEl: null
         }
      });

      const setTranslate = () => {
         const {
            slides,
            rtlTranslate: rtl
         } = swiper;
         const params = swiper.params.flipEffect;

         for (let i = 0; i < slides.length; i += 1) {
            const $slideEl = slides.eq(i);
            let progress = $slideEl[0].progress;

            if (swiper.params.flipEffect.limitRotation) {
               progress = Math.max(Math.min($slideEl[0].progress, 1), -1);
            }

            const offset = $slideEl[0].swiperSlideOffset;
            const rotate = -180 * progress;
            let rotateY = rotate;
            let rotateX = 0;
            let tx = swiper.params.cssMode ? -offset - swiper.translate : -offset;
            let ty = 0;

            if (!swiper.isHorizontal()) {
               ty = tx;
               tx = 0;
               rotateX = -rotateY;
               rotateY = 0;
            } else if (rtl) {
               rotateY = -rotateY;
            }

            $slideEl[0].style.zIndex = -Math.abs(Math.round(progress)) + slides.length;

            if (params.slideShadows) {
               // Set shadows
               let shadowBefore = swiper.isHorizontal() ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
               let shadowAfter = swiper.isHorizontal() ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');

               if (shadowBefore.length === 0) {
                  shadowBefore = createShadow(params, $slideEl, swiper.isHorizontal() ? 'left' : 'top');
               }

               if (shadowAfter.length === 0) {
                  shadowAfter = createShadow(params, $slideEl, swiper.isHorizontal() ? 'right' : 'bottom');
               }

               if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
               if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
            }

            const transform = `translate3d(${tx}px, ${ty}px, 0px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            const $targetEl = effectTarget(params, $slideEl);
            $targetEl.transform(transform);
         }
      };

      const setTransition = duration => {
         const {
            transformEl
         } = swiper.params.flipEffect;
         const $transitionElements = transformEl ? swiper.slides.find(transformEl) : swiper.slides;
         $transitionElements.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);
         effectVirtualTransitionEnd({
            swiper,
            duration,
            transformEl
         });
      };

      effectInit({
         effect: 'flip',
         swiper,
         on,
         setTranslate,
         setTransition,
         perspective: () => true,
         overwriteParams: () => ({
            slidesPerView: 1,
            slidesPerGroup: 1,
            watchSlidesProgress: true,
            spaceBetween: 0,
            virtualTranslate: !swiper.params.cssMode
         })
      });
   }

   function EffectCoverflow({
      swiper,
      extendParams,
      on
   }) {
      extendParams({
         coverflowEffect: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            scale: 1,
            modifier: 1,
            slideShadows: true,
            transformEl: null
         }
      });

      const setTranslate = () => {
         const {
            width: swiperWidth,
            height: swiperHeight,
            slides,
            slidesSizesGrid
         } = swiper;
         const params = swiper.params.coverflowEffect;
         const isHorizontal = swiper.isHorizontal();
         const transform = swiper.translate;
         const center = isHorizontal ? -transform + swiperWidth / 2 : -transform + swiperHeight / 2;
         const rotate = isHorizontal ? params.rotate : -params.rotate;
         const translate = params.depth; // Each slide offset from center

         for (let i = 0, length = slides.length; i < length; i += 1) {
            const $slideEl = slides.eq(i);
            const slideSize = slidesSizesGrid[i];
            const slideOffset = $slideEl[0].swiperSlideOffset;
            const offsetMultiplier = (center - slideOffset - slideSize / 2) / slideSize * params.modifier;
            let rotateY = isHorizontal ? rotate * offsetMultiplier : 0;
            let rotateX = isHorizontal ? 0 : rotate * offsetMultiplier; // var rotateZ = 0

            let translateZ = -translate * Math.abs(offsetMultiplier);
            let stretch = params.stretch; // Allow percentage to make a relative stretch for responsive sliders

            if (typeof stretch === 'string' && stretch.indexOf('%') !== -1) {
               stretch = parseFloat(params.stretch) / 100 * slideSize;
            }

            let translateY = isHorizontal ? 0 : stretch * offsetMultiplier;
            let translateX = isHorizontal ? stretch * offsetMultiplier : 0;
            let scale = 1 - (1 - params.scale) * Math.abs(offsetMultiplier); // Fix for ultra small values

            if (Math.abs(translateX) < 0.001) translateX = 0;
            if (Math.abs(translateY) < 0.001) translateY = 0;
            if (Math.abs(translateZ) < 0.001) translateZ = 0;
            if (Math.abs(rotateY) < 0.001) rotateY = 0;
            if (Math.abs(rotateX) < 0.001) rotateX = 0;
            if (Math.abs(scale) < 0.001) scale = 0;
            const slideTransform = `translate3d(${translateX}px,${translateY}px,${translateZ}px)  rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
            const $targetEl = effectTarget(params, $slideEl);
            $targetEl.transform(slideTransform);
            $slideEl[0].style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1;

            if (params.slideShadows) {
               // Set shadows
               let $shadowBeforeEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
               let $shadowAfterEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');

               if ($shadowBeforeEl.length === 0) {
                  $shadowBeforeEl = createShadow(params, $slideEl, isHorizontal ? 'left' : 'top');
               }

               if ($shadowAfterEl.length === 0) {
                  $shadowAfterEl = createShadow(params, $slideEl, isHorizontal ? 'right' : 'bottom');
               }

               if ($shadowBeforeEl.length) $shadowBeforeEl[0].style.opacity = offsetMultiplier > 0 ? offsetMultiplier : 0;
               if ($shadowAfterEl.length) $shadowAfterEl[0].style.opacity = -offsetMultiplier > 0 ? -offsetMultiplier : 0;
            }
         }
      };

      const setTransition = duration => {
         const {
            transformEl
         } = swiper.params.coverflowEffect;
         const $transitionElements = transformEl ? swiper.slides.find(transformEl) : swiper.slides;
         $transitionElements.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);
      };

      effectInit({
         effect: 'coverflow',
         swiper,
         on,
         setTranslate,
         setTransition,
         perspective: () => true,
         overwriteParams: () => ({
            watchSlidesProgress: true
         })
      });
   }

   function EffectCreative({
      swiper,
      extendParams,
      on
   }) {
      extendParams({
         creativeEffect: {
            transformEl: null,
            limitProgress: 1,
            shadowPerProgress: false,
            progressMultiplier: 1,
            perspective: true,
            prev: {
               translate: [0, 0, 0],
               rotate: [0, 0, 0],
               opacity: 1,
               scale: 1
            },
            next: {
               translate: [0, 0, 0],
               rotate: [0, 0, 0],
               opacity: 1,
               scale: 1
            }
         }
      });

      const getTranslateValue = value => {
         if (typeof value === 'string') return value;
         return `${value}px`;
      };

      const setTranslate = () => {
         const {
            slides
         } = swiper;
         const params = swiper.params.creativeEffect;
         const {
            progressMultiplier: multiplier
         } = params;

         for (let i = 0; i < slides.length; i += 1) {
            const $slideEl = slides.eq(i);
            const slideProgress = $slideEl[0].progress;
            const progress = Math.min(Math.max($slideEl[0].progress, -params.limitProgress), params.limitProgress);
            const offset = $slideEl[0].swiperSlideOffset;
            const t = [swiper.params.cssMode ? -offset - swiper.translate : -offset, 0, 0];
            const r = [0, 0, 0];
            let custom = false;

            if (!swiper.isHorizontal()) {
               t[1] = t[0];
               t[0] = 0;
            }

            let data = {
               translate: [0, 0, 0],
               rotate: [0, 0, 0],
               scale: 1,
               opacity: 1
            };

            if (progress < 0) {
               data = params.next;
               custom = true;
            } else if (progress > 0) {
               data = params.prev;
               custom = true;
            } // set translate


            t.forEach((value, index) => {
               t[index] = `calc(${value}px + (${getTranslateValue(data.translate[index])} * ${Math.abs(progress * multiplier)}))`;
            }); // set rotates

            r.forEach((value, index) => {
               r[index] = data.rotate[index] * Math.abs(progress * multiplier);
            });
            $slideEl[0].style.zIndex = -Math.abs(Math.round(slideProgress)) + slides.length;
            const translateString = t.join(', ');
            const rotateString = `rotateX(${r[0]}deg) rotateY(${r[1]}deg) rotateZ(${r[2]}deg)`;
            const scaleString = progress < 0 ? `scale(${1 + (1 - data.scale) * progress * multiplier})` : `scale(${1 - (1 - data.scale) * progress * multiplier})`;
            const opacityString = progress < 0 ? 1 + (1 - data.opacity) * progress * multiplier : 1 - (1 - data.opacity) * progress * multiplier;
            const transform = `translate3d(${translateString}) ${rotateString} ${scaleString}`; // Set shadows

            if (custom && data.shadow || !custom) {
               let $shadowEl = $slideEl.children('.swiper-slide-shadow');

               if ($shadowEl.length === 0 && data.shadow) {
                  $shadowEl = createShadow(params, $slideEl);
               }

               if ($shadowEl.length) {
                  const shadowOpacity = params.shadowPerProgress ? progress * (1 / params.limitProgress) : progress;
                  $shadowEl[0].style.opacity = Math.min(Math.max(Math.abs(shadowOpacity), 0), 1);
               }
            }

            const $targetEl = effectTarget(params, $slideEl);
            $targetEl.transform(transform).css({
               opacity: opacityString
            });

            if (data.origin) {
               $targetEl.css('transform-origin', data.origin);
            }
         }
      };

      const setTransition = duration => {
         const {
            transformEl
         } = swiper.params.creativeEffect;
         const $transitionElements = transformEl ? swiper.slides.find(transformEl) : swiper.slides;
         $transitionElements.transition(duration).find('.swiper-slide-shadow').transition(duration);
         effectVirtualTransitionEnd({
            swiper,
            duration,
            transformEl,
            allSlides: true
         });
      };

      effectInit({
         effect: 'creative',
         swiper,
         on,
         setTranslate,
         setTransition,
         perspective: () => swiper.params.creativeEffect.perspective,
         overwriteParams: () => ({
            watchSlidesProgress: true,
            virtualTranslate: !swiper.params.cssMode
         })
      });
   }

   function EffectCards({
      swiper,
      extendParams,
      on
   }) {
      extendParams({
         cardsEffect: {
            slideShadows: true,
            transformEl: null
         }
      });

      const setTranslate = () => {
         const {
            slides,
            activeIndex
         } = swiper;
         const params = swiper.params.cardsEffect;
         const {
            startTranslate,
            isTouched
         } = swiper.touchEventsData;
         const currentTranslate = swiper.translate;

         for (let i = 0; i < slides.length; i += 1) {
            const $slideEl = slides.eq(i);
            const slideProgress = $slideEl[0].progress;
            const progress = Math.min(Math.max(slideProgress, -4), 4);
            let offset = $slideEl[0].swiperSlideOffset;

            if (swiper.params.centeredSlides && !swiper.params.cssMode) {
               swiper.$wrapperEl.transform(`translateX(${swiper.minTranslate()}px)`);
            }

            if (swiper.params.centeredSlides && swiper.params.cssMode) {
               offset -= slides[0].swiperSlideOffset;
            }

            let tX = swiper.params.cssMode ? -offset - swiper.translate : -offset;
            let tY = 0;
            const tZ = -100 * Math.abs(progress);
            let scale = 1;
            let rotate = -2 * progress;
            let tXAdd = 8 - Math.abs(progress) * 0.75;
            const isSwipeToNext = (i === activeIndex || i === activeIndex - 1) && progress > 0 && progress < 1 && (isTouched || swiper.params.cssMode) && currentTranslate < startTranslate;
            const isSwipeToPrev = (i === activeIndex || i === activeIndex + 1) && progress < 0 && progress > -1 && (isTouched || swiper.params.cssMode) && currentTranslate > startTranslate;

            if (isSwipeToNext || isSwipeToPrev) {
               const subProgress = (1 - Math.abs((Math.abs(progress) - 0.5) / 0.5)) ** 0.5;
               rotate += -28 * progress * subProgress;
               scale += -0.5 * subProgress;
               tXAdd += 96 * subProgress;
               tY = `${-25 * subProgress * Math.abs(progress)}%`;
            }

            if (progress < 0) {
               // next
               tX = `calc(${tX}px + (${tXAdd * Math.abs(progress)}%))`;
            } else if (progress > 0) {
               // prev
               tX = `calc(${tX}px + (-${tXAdd * Math.abs(progress)}%))`;
            } else {
               tX = `${tX}px`;
            }

            if (!swiper.isHorizontal()) {
               const prevY = tY;
               tY = tX;
               tX = prevY;
            }

            const scaleString = progress < 0 ? `${1 + (1 - scale) * progress}` : `${1 - (1 - scale) * progress}`;
            const transform = `
       translate3d(${tX}, ${tY}, ${tZ}px)
       rotateZ(${rotate}deg)
       scale(${scaleString})
     `;

            if (params.slideShadows) {
               // Set shadows
               let $shadowEl = $slideEl.find('.swiper-slide-shadow');

               if ($shadowEl.length === 0) {
                  $shadowEl = createShadow(params, $slideEl);
               }

               if ($shadowEl.length) $shadowEl[0].style.opacity = Math.min(Math.max((Math.abs(progress) - 0.5) / 0.5, 0), 1);
            }

            $slideEl[0].style.zIndex = -Math.abs(Math.round(slideProgress)) + slides.length;
            const $targetEl = effectTarget(params, $slideEl);
            $targetEl.transform(transform);
         }
      };

      const setTransition = duration => {
         const {
            transformEl
         } = swiper.params.cardsEffect;
         const $transitionElements = transformEl ? swiper.slides.find(transformEl) : swiper.slides;
         $transitionElements.transition(duration).find('.swiper-slide-shadow').transition(duration);
         effectVirtualTransitionEnd({
            swiper,
            duration,
            transformEl
         });
      };

      effectInit({
         effect: 'cards',
         swiper,
         on,
         setTranslate,
         setTransition,
         perspective: () => true,
         overwriteParams: () => ({
            watchSlidesProgress: true,
            virtualTranslate: !swiper.params.cssMode
         })
      });
   }

   // Swiper Class
   const modules = [Virtual, Keyboard, Mousewheel, Navigation, Pagination, Scrollbar, Parallax, Zoom, Lazy, Controller, A11y, History, HashNavigation, Autoplay, Thumb, freeMode, Grid, Manipulation, EffectFade, EffectCube, EffectFlip, EffectCoverflow, EffectCreative, EffectCards];
   Swiper.use(modules);

   return Swiper;

})));;
/*! nouislider - 14.7.0 - 4/6/2021 */
(function (factory) {
   if (typeof define === "function" && define.amd) {
      define([], factory);
   } else if (typeof exports === "object") {
      module.exports = factory();
   } else {
      window.noUiSlider = factory();
   }
})(function () {
   "use strict";
   var VERSION = "14.7.0";
   //region Helper Methods
   function isValidFormatter(entry) {
      return typeof entry === "object" && typeof entry.to === "function" && typeof entry.from === "function";
   }
   function removeElement(el) {
      el.parentElement.removeChild(el);
   }
   function isSet(value) {
      return value !== null && value !== undefined;
   }
   // Bindable version
   function preventDefault(e) {
      e.preventDefault();
   }
   // Removes duplicates from an array.
   function unique(array) {
      return array.filter(function (a) {
         return !this[a] ? (this[a] = true) : false;
      }, {});
   }
   // Round a value to the closest 'to'.
   function closest(value, to) {
      return Math.round(value / to) * to;
   }
   // Current position of an element relative to the document.
   function offset(elem, orientation) {
      var rect = elem.getBoundingClientRect();
      var doc = elem.ownerDocument;
      var docElem = doc.documentElement;
      var pageOffset = getPageOffset(doc);
      // getBoundingClientRect contains left scroll in Chrome on Android.
      // I haven't found a feature detection that proves this. Worst case
      // scenario on mis-match: the 'tap' feature on horizontal sliders breaks.
      if (/webkit.*Chrome.*Mobile/i.test(navigator.userAgent)) {
         pageOffset.x = 0;
      }
      return orientation ? rect.top + pageOffset.y - docElem.clientTop : rect.left + pageOffset.x - docElem.clientLeft;
   }
   // Checks whether a value is numerical.
   function isNumeric(a) {
      return typeof a === "number" && !isNaN(a) && isFinite(a);
   }
   // Sets a class and removes it after [duration] ms.
   function addClassFor(element, className, duration) {
      if (duration > 0) {
         addClass(element, className);
         setTimeout(function () {
            removeClass(element, className);
         }, duration);
      }
   }
   // Limits a value to 0 - 100
   function limit(a) {
      return Math.max(Math.min(a, 100), 0);
   }
   // Wraps a variable as an array, if it isn't one yet.
   // Note that an input array is returned by reference!
   function asArray(a) {
      return Array.isArray(a) ? a : [a];
   }
   // Counts decimals
   function countDecimals(numStr) {
      numStr = String(numStr);
      var pieces = numStr.split(".");
      return pieces.length > 1 ? pieces[1].length : 0;
   }
   // http://youmightnotneedjquery.com/#add_class
   function addClass(el, className) {
      if (el.classList && !/\s/.test(className)) {
         el.classList.add(className);
      }
      else {
         el.className += " " + className;
      }
   }
   // http://youmightnotneedjquery.com/#remove_class
   function removeClass(el, className) {
      if (el.classList && !/\s/.test(className)) {
         el.classList.remove(className);
      }
      else {
         el.className = el.className.replace(new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"), " ");
      }
   }
   // https://plainjs.com/javascript/attributes/adding-removing-and-testing-for-classes-9/
   function hasClass(el, className) {
      return el.classList ? el.classList.contains(className) : new RegExp("\\b" + className + "\\b").test(el.className);
   }
   // https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY#Notes
   function getPageOffset(doc) {
      var supportPageOffset = window.pageXOffset !== undefined;
      var isCSS1Compat = (doc.compatMode || "") === "CSS1Compat";
      var x = supportPageOffset
         ? window.pageXOffset
         : isCSS1Compat
            ? doc.documentElement.scrollLeft
            : doc.body.scrollLeft;
      var y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? doc.documentElement.scrollTop : doc.body.scrollTop;
      return {
         x: x,
         y: y
      };
   }
   // we provide a function to compute constants instead
   // of accessing window.* as soon as the module needs it
   // so that we do not compute anything if not needed
   function getActions() {
      // Determine the events to bind. IE11 implements pointerEvents without
      // a prefix, which breaks compatibility with the IE10 implementation.
      return window.navigator.pointerEnabled
         ? {
            start: "pointerdown",
            move: "pointermove",
            end: "pointerup"
         }
         : window.navigator.msPointerEnabled
            ? {
               start: "MSPointerDown",
               move: "MSPointerMove",
               end: "MSPointerUp"
            }
            : {
               start: "mousedown touchstart",
               move: "mousemove touchmove",
               end: "mouseup touchend"
            };
   }
   // https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
   // Issue #785
   function getSupportsPassive() {
      var supportsPassive = false;
      /* eslint-disable */
      try {
         var opts = Object.defineProperty({}, "passive", {
            get: function () {
               supportsPassive = true;
            }
         });
         window.addEventListener("test", null, opts);
      }
      catch (e) { }
      /* eslint-enable */
      return supportsPassive;
   }
   function getSupportsTouchActionNone() {
      return window.CSS && CSS.supports && CSS.supports("touch-action", "none");
   }
   //endregion
   //region Range Calculation
   // Determine the size of a sub-range in relation to a full range.
   function subRangeRatio(pa, pb) {
      return 100 / (pb - pa);
   }
   // (percentage) How many percent is this value of this range?
   function fromPercentage(range, value, startRange) {
      return (value * 100) / (range[startRange + 1] - range[startRange]);
   }
   // (percentage) Where is this value on this range?
   function toPercentage(range, value) {
      return fromPercentage(range, range[0] < 0 ? value + Math.abs(range[0]) : value - range[0], 0);
   }
   // (value) How much is this percentage on this range?
   function isPercentage(range, value) {
      return (value * (range[1] - range[0])) / 100 + range[0];
   }
   function getJ(value, arr) {
      var j = 1;
      while (value >= arr[j]) {
         j += 1;
      }
      return j;
   }
   // (percentage) Input a value, find where, on a scale of 0-100, it applies.
   function toStepping(xVal, xPct, value) {
      if (value >= xVal.slice(-1)[0]) {
         return 100;
      }
      var j = getJ(value, xVal);
      var va = xVal[j - 1];
      var vb = xVal[j];
      var pa = xPct[j - 1];
      var pb = xPct[j];
      return pa + toPercentage([va, vb], value) / subRangeRatio(pa, pb);
   }
   // (value) Input a percentage, find where it is on the specified range.
   function fromStepping(xVal, xPct, value) {
      // There is no range group that fits 100
      if (value >= 100) {
         return xVal.slice(-1)[0];
      }
      var j = getJ(value, xPct);
      var va = xVal[j - 1];
      var vb = xVal[j];
      var pa = xPct[j - 1];
      var pb = xPct[j];
      return isPercentage([va, vb], (value - pa) * subRangeRatio(pa, pb));
   }
   // (percentage) Get the step that applies at a certain value.
   function getStep(xPct, xSteps, snap, value) {
      if (value === 100) {
         return value;
      }
      var j = getJ(value, xPct);
      var a = xPct[j - 1];
      var b = xPct[j];
      // If 'snap' is set, steps are used as fixed points on the slider.
      if (snap) {
         // Find the closest position, a or b.
         if (value - a > (b - a) / 2) {
            return b;
         }
         return a;
      }
      if (!xSteps[j - 1]) {
         return value;
      }
      return xPct[j - 1] + closest(value - xPct[j - 1], xSteps[j - 1]);
   }
   function handleEntryPoint(index, value, that) {
      var percentage;
      // Wrap numerical input in an array.
      if (typeof value === "number") {
         value = [value];
      }
      // Reject any invalid input, by testing whether value is an array.
      if (!Array.isArray(value)) {
         throw new Error("noUiSlider (" + VERSION + "): 'range' contains invalid value.");
      }
      // Covert min/max syntax to 0 and 100.
      if (index === "min") {
         percentage = 0;
      }
      else if (index === "max") {
         percentage = 100;
      }
      else {
         percentage = parseFloat(index);
      }
      // Check for correct input.
      if (!isNumeric(percentage) || !isNumeric(value[0])) {
         throw new Error("noUiSlider (" + VERSION + "): 'range' value isn't numeric.");
      }
      // Store values.
      that.xPct.push(percentage);
      that.xVal.push(value[0]);
      // NaN will evaluate to false too, but to keep
      // logging clear, set step explicitly. Make sure
      // not to override the 'step' setting with false.
      if (!percentage) {
         if (!isNaN(value[1])) {
            that.xSteps[0] = value[1];
         }
      }
      else {
         that.xSteps.push(isNaN(value[1]) ? false : value[1]);
      }
      that.xHighestCompleteStep.push(0);
   }
   function handleStepPoint(i, n, that) {
      // Ignore 'false' stepping.
      if (!n) {
         return;
      }
      // Step over zero-length ranges (#948);
      if (that.xVal[i] === that.xVal[i + 1]) {
         that.xSteps[i] = that.xHighestCompleteStep[i] = that.xVal[i];
         return;
      }
      // Factor to range ratio
      that.xSteps[i] =
         fromPercentage([that.xVal[i], that.xVal[i + 1]], n, 0) / subRangeRatio(that.xPct[i], that.xPct[i + 1]);
      var totalSteps = (that.xVal[i + 1] - that.xVal[i]) / that.xNumSteps[i];
      var highestStep = Math.ceil(Number(totalSteps.toFixed(3)) - 1);
      var step = that.xVal[i] + that.xNumSteps[i] * highestStep;
      that.xHighestCompleteStep[i] = step;
   }
   //endregion
   //region Spectrum
   function Spectrum(entry, snap, singleStep) {
      this.xPct = [];
      this.xVal = [];
      this.xSteps = [singleStep || false];
      this.xNumSteps = [false];
      this.xHighestCompleteStep = [];
      this.snap = snap;
      var index;
      var ordered = []; // [0, 'min'], [1, '50%'], [2, 'max']
      // Map the object keys to an array.
      for (index in entry) {
         if (entry.hasOwnProperty(index)) {
            ordered.push([entry[index], index]);
         }
      }
      // Sort all entries by value (numeric sort).
      if (ordered.length && typeof ordered[0][0] === "object") {
         ordered.sort(function (a, b) {
            return a[0][0] - b[0][0];
         });
      }
      else {
         ordered.sort(function (a, b) {
            return a[0] - b[0];
         });
      }
      // Convert all entries to subranges.
      for (index = 0; index < ordered.length; index++) {
         handleEntryPoint(ordered[index][1], ordered[index][0], this);
      }
      // Store the actual step values.
      // xSteps is sorted in the same order as xPct and xVal.
      this.xNumSteps = this.xSteps.slice(0);
      // Convert all numeric steps to the percentage of the subrange they represent.
      for (index = 0; index < this.xNumSteps.length; index++) {
         handleStepPoint(index, this.xNumSteps[index], this);
      }
   }
   Spectrum.prototype.getDistance = function (value) {
      var index;
      var distances = [];
      for (index = 0; index < this.xNumSteps.length - 1; index++) {
         // last "range" can't contain step size as it is purely an endpoint.
         var step = this.xNumSteps[index];
         if (step && (value / step) % 1 !== 0) {
            throw new Error("noUiSlider (" +
               VERSION +
               "): 'limit', 'margin' and 'padding' of " +
               this.xPct[index] +
               "% range must be divisible by step.");
         }
         // Calculate percentual distance in current range of limit, margin or padding
         distances[index] = fromPercentage(this.xVal, value, index);
      }
      return distances;
   };
   // Calculate the percentual distance over the whole scale of ranges.
   // direction: 0 = backwards / 1 = forwards
   Spectrum.prototype.getAbsoluteDistance = function (value, distances, direction) {
      var xPct_index = 0;
      // Calculate range where to start calculation
      if (value < this.xPct[this.xPct.length - 1]) {
         while (value > this.xPct[xPct_index + 1]) {
            xPct_index++;
         }
      }
      else if (value === this.xPct[this.xPct.length - 1]) {
         xPct_index = this.xPct.length - 2;
      }
      // If looking backwards and the value is exactly at a range separator then look one range further
      if (!direction && value === this.xPct[xPct_index + 1]) {
         xPct_index++;
      }
      var start_factor;
      var rest_factor = 1;
      var rest_rel_distance = distances[xPct_index];
      var range_pct = 0;
      var rel_range_distance = 0;
      var abs_distance_counter = 0;
      var range_counter = 0;
      // Calculate what part of the start range the value is
      if (direction) {
         start_factor = (value - this.xPct[xPct_index]) / (this.xPct[xPct_index + 1] - this.xPct[xPct_index]);
      }
      else {
         start_factor = (this.xPct[xPct_index + 1] - value) / (this.xPct[xPct_index + 1] - this.xPct[xPct_index]);
      }
      // Do until the complete distance across ranges is calculated
      while (rest_rel_distance > 0) {
         // Calculate the percentage of total range
         range_pct = this.xPct[xPct_index + 1 + range_counter] - this.xPct[xPct_index + range_counter];
         // Detect if the margin, padding or limit is larger then the current range and calculate
         if (distances[xPct_index + range_counter] * rest_factor + 100 - start_factor * 100 > 100) {
            // If larger then take the percentual distance of the whole range
            rel_range_distance = range_pct * start_factor;
            // Rest factor of relative percentual distance still to be calculated
            rest_factor = (rest_rel_distance - 100 * start_factor) / distances[xPct_index + range_counter];
            // Set start factor to 1 as for next range it does not apply.
            start_factor = 1;
         }
         else {
            // If smaller or equal then take the percentual distance of the calculate percentual part of that range
            rel_range_distance = ((distances[xPct_index + range_counter] * range_pct) / 100) * rest_factor;
            // No rest left as the rest fits in current range
            rest_factor = 0;
         }
         if (direction) {
            abs_distance_counter = abs_distance_counter - rel_range_distance;
            // Limit range to first range when distance becomes outside of minimum range
            if (this.xPct.length + range_counter >= 1) {
               range_counter--;
            }
         }
         else {
            abs_distance_counter = abs_distance_counter + rel_range_distance;
            // Limit range to last range when distance becomes outside of maximum range
            if (this.xPct.length - range_counter >= 1) {
               range_counter++;
            }
         }
         // Rest of relative percentual distance still to be calculated
         rest_rel_distance = distances[xPct_index + range_counter] * rest_factor;
      }
      return value + abs_distance_counter;
   };
   Spectrum.prototype.toStepping = function (value) {
      value = toStepping(this.xVal, this.xPct, value);
      return value;
   };
   Spectrum.prototype.fromStepping = function (value) {
      return fromStepping(this.xVal, this.xPct, value);
   };
   Spectrum.prototype.getStep = function (value) {
      value = getStep(this.xPct, this.xSteps, this.snap, value);
      return value;
   };
   Spectrum.prototype.getDefaultStep = function (value, isDown, size) {
      var j = getJ(value, this.xPct);
      // When at the top or stepping down, look at the previous sub-range
      if (value === 100 || (isDown && value === this.xPct[j - 1])) {
         j = Math.max(j - 1, 1);
      }
      return (this.xVal[j] - this.xVal[j - 1]) / size;
   };
   Spectrum.prototype.getNearbySteps = function (value) {
      var j = getJ(value, this.xPct);
      return {
         stepBefore: {
            startValue: this.xVal[j - 2],
            step: this.xNumSteps[j - 2],
            highestStep: this.xHighestCompleteStep[j - 2]
         },
         thisStep: {
            startValue: this.xVal[j - 1],
            step: this.xNumSteps[j - 1],
            highestStep: this.xHighestCompleteStep[j - 1]
         },
         stepAfter: {
            startValue: this.xVal[j],
            step: this.xNumSteps[j],
            highestStep: this.xHighestCompleteStep[j]
         }
      };
   };
   Spectrum.prototype.countStepDecimals = function () {
      var stepDecimals = this.xNumSteps.map(countDecimals);
      return Math.max.apply(null, stepDecimals);
   };
   // Outside testing
   Spectrum.prototype.convert = function (value) {
      return this.getStep(this.toStepping(value));
   };
   //endregion
   //region Options
   /*	Every input option is tested and parsed. This'll prevent
       endless validation in internal methods. These tests are
       structured with an item for every option available. An
       option can be marked as required by setting the 'r' flag.
       The testing function is provided with three arguments:
           - The provided value for the option;
           - A reference to the options object;
           - The name for the option;
   
       The testing function returns false when an error is detected,
       or true when everything is OK. It can also modify the option
       object, to make sure all values can be correctly looped elsewhere. */
   //region Defaults
   var defaultFormatter = {
      to: function (value) {
         return value !== undefined && value.toFixed(2);
      },
      from: Number
   };
   var cssClasses = {
      target: "target",
      base: "base",
      origin: "origin",
      handle: "handle",
      handleLower: "handle-lower",
      handleUpper: "handle-upper",
      touchArea: "touch-area",
      horizontal: "horizontal",
      vertical: "vertical",
      background: "background",
      connect: "connect",
      connects: "connects",
      ltr: "ltr",
      rtl: "rtl",
      textDirectionLtr: "txt-dir-ltr",
      textDirectionRtl: "txt-dir-rtl",
      draggable: "draggable",
      drag: "state-drag",
      tap: "state-tap",
      active: "active",
      tooltip: "tooltip",
      pips: "pips",
      pipsHorizontal: "pips-horizontal",
      pipsVertical: "pips-vertical",
      marker: "marker",
      markerHorizontal: "marker-horizontal",
      markerVertical: "marker-vertical",
      markerNormal: "marker-normal",
      markerLarge: "marker-large",
      markerSub: "marker-sub",
      value: "value",
      valueHorizontal: "value-horizontal",
      valueVertical: "value-vertical",
      valueNormal: "value-normal",
      valueLarge: "value-large",
      valueSub: "value-sub"
   };
   // Namespaces of internal event listeners
   var INTERNAL_EVENT_NS = {
      tooltips: ".__tooltips",
      aria: ".__aria"
   };
   //endregion
   function validateFormat(entry) {
      // Any object with a to and from method is supported.
      if (isValidFormatter(entry)) {
         return true;
      }
      throw new Error("noUiSlider (" + VERSION + "): 'format' requires 'to' and 'from' methods.");
   }
   function testStep(parsed, entry) {
      if (!isNumeric(entry)) {
         throw new Error("noUiSlider (" + VERSION + "): 'step' is not numeric.");
      }
      // The step option can still be used to set stepping
      // for linear sliders. Overwritten if set in 'range'.
      parsed.singleStep = entry;
   }
   function testKeyboardPageMultiplier(parsed, entry) {
      if (!isNumeric(entry)) {
         throw new Error("noUiSlider (" + VERSION + "): 'keyboardPageMultiplier' is not numeric.");
      }
      parsed.keyboardPageMultiplier = entry;
   }
   function testKeyboardDefaultStep(parsed, entry) {
      if (!isNumeric(entry)) {
         throw new Error("noUiSlider (" + VERSION + "): 'keyboardDefaultStep' is not numeric.");
      }
      parsed.keyboardDefaultStep = entry;
   }
   function testRange(parsed, entry) {
      // Filter incorrect input.
      if (typeof entry !== "object" || Array.isArray(entry)) {
         throw new Error("noUiSlider (" + VERSION + "): 'range' is not an object.");
      }
      // Catch missing start or end.
      if (entry.min === undefined || entry.max === undefined) {
         throw new Error("noUiSlider (" + VERSION + "): Missing 'min' or 'max' in 'range'.");
      }
      // Catch equal start or end.
      if (entry.min === entry.max) {
         throw new Error("noUiSlider (" + VERSION + "): 'range' 'min' and 'max' cannot be equal.");
      }
      parsed.spectrum = new Spectrum(entry, parsed.snap, parsed.singleStep);
   }
   function testStart(parsed, entry) {
      entry = asArray(entry);
      // Validate input. Values aren't tested, as the public .val method
      // will always provide a valid location.
      if (!Array.isArray(entry) || !entry.length) {
         throw new Error("noUiSlider (" + VERSION + "): 'start' option is incorrect.");
      }
      // Store the number of handles.
      parsed.handles = entry.length;
      // When the slider is initialized, the .val method will
      // be called with the start options.
      parsed.start = entry;
   }
   function testSnap(parsed, entry) {
      // Enforce 100% stepping within subranges.
      parsed.snap = entry;
      if (typeof entry !== "boolean") {
         throw new Error("noUiSlider (" + VERSION + "): 'snap' option must be a boolean.");
      }
   }
   function testAnimate(parsed, entry) {
      // Enforce 100% stepping within subranges.
      parsed.animate = entry;
      if (typeof entry !== "boolean") {
         throw new Error("noUiSlider (" + VERSION + "): 'animate' option must be a boolean.");
      }
   }
   function testAnimationDuration(parsed, entry) {
      parsed.animationDuration = entry;
      if (typeof entry !== "number") {
         throw new Error("noUiSlider (" + VERSION + "): 'animationDuration' option must be a number.");
      }
   }
   function testConnect(parsed, entry) {
      var connect = [false];
      var i;
      // Map legacy options
      if (entry === "lower") {
         entry = [true, false];
      }
      else if (entry === "upper") {
         entry = [false, true];
      }
      // Handle boolean options
      if (entry === true || entry === false) {
         for (i = 1; i < parsed.handles; i++) {
            connect.push(entry);
         }
         connect.push(false);
      }
      // Reject invalid input
      else if (!Array.isArray(entry) || !entry.length || entry.length !== parsed.handles + 1) {
         throw new Error("noUiSlider (" + VERSION + "): 'connect' option doesn't match handle count.");
      }
      else {
         connect = entry;
      }
      parsed.connect = connect;
   }
   function testOrientation(parsed, entry) {
      // Set orientation to an a numerical value for easy
      // array selection.
      switch (entry) {
         case "horizontal":
            parsed.ort = 0;
            break;
         case "vertical":
            parsed.ort = 1;
            break;
         default:
            throw new Error("noUiSlider (" + VERSION + "): 'orientation' option is invalid.");
      }
   }
   function testMargin(parsed, entry) {
      if (!isNumeric(entry)) {
         throw new Error("noUiSlider (" + VERSION + "): 'margin' option must be numeric.");
      }
      // Issue #582
      if (entry === 0) {
         return;
      }
      parsed.margin = parsed.spectrum.getDistance(entry);
   }
   function testLimit(parsed, entry) {
      if (!isNumeric(entry)) {
         throw new Error("noUiSlider (" + VERSION + "): 'limit' option must be numeric.");
      }
      parsed.limit = parsed.spectrum.getDistance(entry);
      if (!parsed.limit || parsed.handles < 2) {
         throw new Error("noUiSlider (" + VERSION + "): 'limit' option is only supported on linear sliders with 2 or more handles.");
      }
   }
   function testPadding(parsed, entry) {
      var index;
      if (!isNumeric(entry) && !Array.isArray(entry)) {
         throw new Error("noUiSlider (" + VERSION + "): 'padding' option must be numeric or array of exactly 2 numbers.");
      }
      if (Array.isArray(entry) && !(entry.length === 2 || isNumeric(entry[0]) || isNumeric(entry[1]))) {
         throw new Error("noUiSlider (" + VERSION + "): 'padding' option must be numeric or array of exactly 2 numbers.");
      }
      if (entry === 0) {
         return;
      }
      if (!Array.isArray(entry)) {
         entry = [entry, entry];
      }
      // 'getDistance' returns false for invalid values.
      parsed.padding = [parsed.spectrum.getDistance(entry[0]), parsed.spectrum.getDistance(entry[1])];
      for (index = 0; index < parsed.spectrum.xNumSteps.length - 1; index++) {
         // last "range" can't contain step size as it is purely an endpoint.
         if (parsed.padding[0][index] < 0 || parsed.padding[1][index] < 0) {
            throw new Error("noUiSlider (" + VERSION + "): 'padding' option must be a positive number(s).");
         }
      }
      var totalPadding = entry[0] + entry[1];
      var firstValue = parsed.spectrum.xVal[0];
      var lastValue = parsed.spectrum.xVal[parsed.spectrum.xVal.length - 1];
      if (totalPadding / (lastValue - firstValue) > 1) {
         throw new Error("noUiSlider (" + VERSION + "): 'padding' option must not exceed 100% of the range.");
      }
   }
   function testDirection(parsed, entry) {
      // Set direction as a numerical value for easy parsing.
      // Invert connection for RTL sliders, so that the proper
      // handles get the connect/background classes.
      switch (entry) {
         case "ltr":
            parsed.dir = 0;
            break;
         case "rtl":
            parsed.dir = 1;
            break;
         default:
            throw new Error("noUiSlider (" + VERSION + "): 'direction' option was not recognized.");
      }
   }
   function testBehaviour(parsed, entry) {
      // Make sure the input is a string.
      if (typeof entry !== "string") {
         throw new Error("noUiSlider (" + VERSION + "): 'behaviour' must be a string containing options.");
      }
      // Check if the string contains any keywords.
      // None are required.
      var tap = entry.indexOf("tap") >= 0;
      var drag = entry.indexOf("drag") >= 0;
      var fixed = entry.indexOf("fixed") >= 0;
      var snap = entry.indexOf("snap") >= 0;
      var hover = entry.indexOf("hover") >= 0;
      var unconstrained = entry.indexOf("unconstrained") >= 0;
      if (fixed) {
         if (parsed.handles !== 2) {
            throw new Error("noUiSlider (" + VERSION + "): 'fixed' behaviour must be used with 2 handles");
         }
         // Use margin to enforce fixed state
         testMargin(parsed, parsed.start[1] - parsed.start[0]);
      }
      if (unconstrained && (parsed.margin || parsed.limit)) {
         throw new Error("noUiSlider (" + VERSION + "): 'unconstrained' behaviour cannot be used with margin or limit");
      }
      parsed.events = {
         tap: tap || snap,
         drag: drag,
         fixed: fixed,
         snap: snap,
         hover: hover,
         unconstrained: unconstrained
      };
   }
   function testTooltips(parsed, entry) {
      if (entry === false) {
         return;
      }
      if (entry === true) {
         parsed.tooltips = [];
         for (var i = 0; i < parsed.handles; i++) {
            parsed.tooltips.push(true);
         }
      }
      else {
         parsed.tooltips = asArray(entry);
         if (parsed.tooltips.length !== parsed.handles) {
            throw new Error("noUiSlider (" + VERSION + "): must pass a formatter for all handles.");
         }
         parsed.tooltips.forEach(function (formatter) {
            if (typeof formatter !== "boolean" &&
               (typeof formatter !== "object" || typeof formatter.to !== "function")) {
               throw new Error("noUiSlider (" + VERSION + "): 'tooltips' must be passed a formatter or 'false'.");
            }
         });
      }
   }
   function testAriaFormat(parsed, entry) {
      parsed.ariaFormat = entry;
      validateFormat(entry);
   }
   function testFormat(parsed, entry) {
      parsed.format = entry;
      validateFormat(entry);
   }
   function testKeyboardSupport(parsed, entry) {
      parsed.keyboardSupport = entry;
      if (typeof entry !== "boolean") {
         throw new Error("noUiSlider (" + VERSION + "): 'keyboardSupport' option must be a boolean.");
      }
   }
   function testDocumentElement(parsed, entry) {
      // This is an advanced option. Passed values are used without validation.
      parsed.documentElement = entry;
   }
   function testCssPrefix(parsed, entry) {
      if (typeof entry !== "string" && entry !== false) {
         throw new Error("noUiSlider (" + VERSION + "): 'cssPrefix' must be a string or `false`.");
      }
      parsed.cssPrefix = entry;
   }
   function testCssClasses(parsed, entry) {
      if (typeof entry !== "object") {
         throw new Error("noUiSlider (" + VERSION + "): 'cssClasses' must be an object.");
      }
      if (typeof parsed.cssPrefix === "string") {
         parsed.cssClasses = {};
         for (var key in entry) {
            if (!entry.hasOwnProperty(key)) {
               continue;
            }
            parsed.cssClasses[key] = parsed.cssPrefix + entry[key];
         }
      }
      else {
         parsed.cssClasses = entry;
      }
   }
   // Test all developer settings and parse to assumption-safe values.
   function testOptions(options) {
      // To prove a fix for #537, freeze options here.
      // If the object is modified, an error will be thrown.
      // Object.freeze(options);
      var parsed = {
         margin: 0,
         limit: 0,
         padding: 0,
         animate: true,
         animationDuration: 300,
         ariaFormat: defaultFormatter,
         format: defaultFormatter
      };
      // Tests are executed in the order they are presented here.
      var tests = {
         step: { r: false, t: testStep },
         keyboardPageMultiplier: { r: false, t: testKeyboardPageMultiplier },
         keyboardDefaultStep: { r: false, t: testKeyboardDefaultStep },
         start: { r: true, t: testStart },
         connect: { r: true, t: testConnect },
         direction: { r: true, t: testDirection },
         snap: { r: false, t: testSnap },
         animate: { r: false, t: testAnimate },
         animationDuration: { r: false, t: testAnimationDuration },
         range: { r: true, t: testRange },
         orientation: { r: false, t: testOrientation },
         margin: { r: false, t: testMargin },
         limit: { r: false, t: testLimit },
         padding: { r: false, t: testPadding },
         behaviour: { r: true, t: testBehaviour },
         ariaFormat: { r: false, t: testAriaFormat },
         format: { r: false, t: testFormat },
         tooltips: { r: false, t: testTooltips },
         keyboardSupport: { r: true, t: testKeyboardSupport },
         documentElement: { r: false, t: testDocumentElement },
         cssPrefix: { r: true, t: testCssPrefix },
         cssClasses: { r: true, t: testCssClasses }
      };
      var defaults = {
         connect: false,
         direction: "ltr",
         behaviour: "tap",
         orientation: "horizontal",
         keyboardSupport: true,
         cssPrefix: "noUi-",
         cssClasses: cssClasses,
         keyboardPageMultiplier: 5,
         keyboardDefaultStep: 10
      };
      // AriaFormat defaults to regular format, if any.
      if (options.format && !options.ariaFormat) {
         options.ariaFormat = options.format;
      }
      // Run all options through a testing mechanism to ensure correct
      // input. It should be noted that options might get modified to
      // be handled properly. E.g. wrapping integers in arrays.
      Object.keys(tests).forEach(function (name) {
         // If the option isn't set, but it is required, throw an error.
         if (!isSet(options[name]) && defaults[name] === undefined) {
            if (tests[name].r) {
               throw new Error("noUiSlider (" + VERSION + "): '" + name + "' is required.");
            }
            return true;
         }
         tests[name].t(parsed, !isSet(options[name]) ? defaults[name] : options[name]);
      });
      // Forward pips options
      parsed.pips = options.pips;
      // All recent browsers accept unprefixed transform.
      // We need -ms- for IE9 and -webkit- for older Android;
      // Assume use of -webkit- if unprefixed and -ms- are not supported.
      // https://caniuse.com/#feat=transforms2d
      var d = document.createElement("div");
      var msPrefix = d.style.msTransform !== undefined;
      var noPrefix = d.style.transform !== undefined;
      parsed.transformRule = noPrefix ? "transform" : msPrefix ? "msTransform" : "webkitTransform";
      // Pips don't move, so we can place them using left/top.
      var styles = [["left", "top"], ["right", "bottom"]];
      parsed.style = styles[parsed.dir][parsed.ort];
      return parsed;
   }
   //endregion
   function scope(target, options, originalOptions) {
      var actions = getActions();
      var supportsTouchActionNone = getSupportsTouchActionNone();
      var supportsPassive = supportsTouchActionNone && getSupportsPassive();
      // All variables local to 'scope' are prefixed with 'scope_'
      // Slider DOM Nodes
      var scope_Target = target;
      var scope_Base;
      var scope_Handles;
      var scope_Connects;
      var scope_Pips;
      var scope_Tooltips;
      // Slider state values
      var scope_Spectrum = options.spectrum;
      var scope_Values = [];
      var scope_Locations = [];
      var scope_HandleNumbers = [];
      var scope_ActiveHandlesCount = 0;
      var scope_Events = {};
      // Exposed API
      var scope_Self;
      // Document Nodes
      var scope_Document = target.ownerDocument;
      var scope_DocumentElement = options.documentElement || scope_Document.documentElement;
      var scope_Body = scope_Document.body;
      // Pips constants
      var PIPS_NONE = -1;
      var PIPS_NO_VALUE = 0;
      var PIPS_LARGE_VALUE = 1;
      var PIPS_SMALL_VALUE = 2;
      // For horizontal sliders in standard ltr documents,
      // make .noUi-origin overflow to the left so the document doesn't scroll.
      var scope_DirOffset = scope_Document.dir === "rtl" || options.ort === 1 ? 0 : 100;
      // Creates a node, adds it to target, returns the new node.
      function addNodeTo(addTarget, className) {
         var div = scope_Document.createElement("div");
         if (className) {
            addClass(div, className);
         }
         addTarget.appendChild(div);
         return div;
      }
      // Append a origin to the base
      function addOrigin(base, handleNumber) {
         var origin = addNodeTo(base, options.cssClasses.origin);
         var handle = addNodeTo(origin, options.cssClasses.handle);
         addNodeTo(handle, options.cssClasses.touchArea);
         handle.setAttribute("data-handle", handleNumber);
         if (options.keyboardSupport) {
            // https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex
            // 0 = focusable and reachable
            handle.setAttribute("tabindex", "0");
            handle.addEventListener("keydown", function (event) {
               return eventKeydown(event, handleNumber);
            });
         }
         handle.setAttribute("role", "slider");
         handle.setAttribute("aria-orientation", options.ort ? "vertical" : "horizontal");
         if (handleNumber === 0) {
            addClass(handle, options.cssClasses.handleLower);
         }
         else if (handleNumber === options.handles - 1) {
            addClass(handle, options.cssClasses.handleUpper);
         }
         return origin;
      }
      // Insert nodes for connect elements
      function addConnect(base, add) {
         if (!add) {
            return false;
         }
         return addNodeTo(base, options.cssClasses.connect);
      }
      // Add handles to the slider base.
      function addElements(connectOptions, base) {
         var connectBase = addNodeTo(base, options.cssClasses.connects);
         scope_Handles = [];
         scope_Connects = [];
         scope_Connects.push(addConnect(connectBase, connectOptions[0]));
         // [::::O====O====O====]
         // connectOptions = [0, 1, 1, 1]
         for (var i = 0; i < options.handles; i++) {
            // Keep a list of all added handles.
            scope_Handles.push(addOrigin(base, i));
            scope_HandleNumbers[i] = i;
            scope_Connects.push(addConnect(connectBase, connectOptions[i + 1]));
         }
      }
      // Initialize a single slider.
      function addSlider(addTarget) {
         // Apply classes and data to the target.
         addClass(addTarget, options.cssClasses.target);
         if (options.dir === 0) {
            addClass(addTarget, options.cssClasses.ltr);
         }
         else {
            addClass(addTarget, options.cssClasses.rtl);
         }
         if (options.ort === 0) {
            addClass(addTarget, options.cssClasses.horizontal);
         }
         else {
            addClass(addTarget, options.cssClasses.vertical);
         }
         var textDirection = getComputedStyle(addTarget).direction;
         if (textDirection === "rtl") {
            addClass(addTarget, options.cssClasses.textDirectionRtl);
         }
         else {
            addClass(addTarget, options.cssClasses.textDirectionLtr);
         }
         return addNodeTo(addTarget, options.cssClasses.base);
      }
      function addTooltip(handle, handleNumber) {
         if (!options.tooltips[handleNumber]) {
            return false;
         }
         return addNodeTo(handle.firstChild, options.cssClasses.tooltip);
      }
      function isSliderDisabled() {
         return scope_Target.hasAttribute("disabled");
      }
      // Disable the slider dragging if any handle is disabled
      function isHandleDisabled(handleNumber) {
         var handleOrigin = scope_Handles[handleNumber];
         return handleOrigin.hasAttribute("disabled");
      }
      function removeTooltips() {
         if (scope_Tooltips) {
            removeEvent("update" + INTERNAL_EVENT_NS.tooltips);
            scope_Tooltips.forEach(function (tooltip) {
               if (tooltip) {
                  removeElement(tooltip);
               }
            });
            scope_Tooltips = null;
         }
      }
      // The tooltips option is a shorthand for using the 'update' event.
      function tooltips() {
         removeTooltips();
         // Tooltips are added with options.tooltips in original order.
         scope_Tooltips = scope_Handles.map(addTooltip);
         bindEvent("update" + INTERNAL_EVENT_NS.tooltips, function (values, handleNumber, unencoded) {
            if (!scope_Tooltips[handleNumber]) {
               return;
            }
            var formattedValue = values[handleNumber];
            if (options.tooltips[handleNumber] !== true) {
               formattedValue = options.tooltips[handleNumber].to(unencoded[handleNumber]);
            }
            scope_Tooltips[handleNumber].innerHTML = formattedValue;
         });
      }
      function aria() {
         removeEvent("update" + INTERNAL_EVENT_NS.aria);
         bindEvent("update" + INTERNAL_EVENT_NS.aria, function (values, handleNumber, unencoded, tap, positions) {
            // Update Aria Values for all handles, as a change in one changes min and max values for the next.
            scope_HandleNumbers.forEach(function (index) {
               var handle = scope_Handles[index];
               var min = checkHandlePosition(scope_Locations, index, 0, true, true, true);
               var max = checkHandlePosition(scope_Locations, index, 100, true, true, true);
               var now = positions[index];
               // Formatted value for display
               var text = options.ariaFormat.to(unencoded[index]);
               // Map to slider range values
               min = scope_Spectrum.fromStepping(min).toFixed(1);
               max = scope_Spectrum.fromStepping(max).toFixed(1);
               now = scope_Spectrum.fromStepping(now).toFixed(1);
               handle.children[0].setAttribute("aria-valuemin", min);
               handle.children[0].setAttribute("aria-valuemax", max);
               handle.children[0].setAttribute("aria-valuenow", now);
               handle.children[0].setAttribute("aria-valuetext", text);
            });
         });
      }
      function getGroup(mode, values, stepped) {
         // Use the range.
         if (mode === "range" || mode === "steps") {
            return scope_Spectrum.xVal;
         }
         if (mode === "count") {
            if (values < 2) {
               throw new Error("noUiSlider (" + VERSION + "): 'values' (>= 2) required for mode 'count'.");
            }
            // Divide 0 - 100 in 'count' parts.
            var interval = values - 1;
            var spread = 100 / interval;
            values = [];
            // List these parts and have them handled as 'positions'.
            while (interval--) {
               values[interval] = interval * spread;
            }
            values.push(100);
            mode = "positions";
         }
         if (mode === "positions") {
            // Map all percentages to on-range values.
            return values.map(function (value) {
               return scope_Spectrum.fromStepping(stepped ? scope_Spectrum.getStep(value) : value);
            });
         }
         if (mode === "values") {
            // If the value must be stepped, it needs to be converted to a percentage first.
            if (stepped) {
               return values.map(function (value) {
                  // Convert to percentage, apply step, return to value.
                  return scope_Spectrum.fromStepping(scope_Spectrum.getStep(scope_Spectrum.toStepping(value)));
               });
            }
            // Otherwise, we can simply use the values.
            return values;
         }
      }
      function generateSpread(density, mode, group) {
         function safeIncrement(value, increment) {
            // Avoid floating point variance by dropping the smallest decimal places.
            return (value + increment).toFixed(7) / 1;
         }
         var indexes = {};
         var firstInRange = scope_Spectrum.xVal[0];
         var lastInRange = scope_Spectrum.xVal[scope_Spectrum.xVal.length - 1];
         var ignoreFirst = false;
         var ignoreLast = false;
         var prevPct = 0;
         // Create a copy of the group, sort it and filter away all duplicates.
         group = unique(group.slice().sort(function (a, b) {
            return a - b;
         }));
         // Make sure the range starts with the first element.
         if (group[0] !== firstInRange) {
            group.unshift(firstInRange);
            ignoreFirst = true;
         }
         // Likewise for the last one.
         if (group[group.length - 1] !== lastInRange) {
            group.push(lastInRange);
            ignoreLast = true;
         }
         group.forEach(function (current, index) {
            // Get the current step and the lower + upper positions.
            var step;
            var i;
            var q;
            var low = current;
            var high = group[index + 1];
            var newPct;
            var pctDifference;
            var pctPos;
            var type;
            var steps;
            var realSteps;
            var stepSize;
            var isSteps = mode === "steps";
            // When using 'steps' mode, use the provided steps.
            // Otherwise, we'll step on to the next subrange.
            if (isSteps) {
               step = scope_Spectrum.xNumSteps[index];
            }
            // Default to a 'full' step.
            if (!step) {
               step = high - low;
            }
            // Low can be 0, so test for false. Index 0 is already handled.
            if (low === false) {
               return;
            }
            // If high is undefined we are at the last subrange. Make sure it iterates once (#1088)
            if (high === undefined) {
               high = low;
            }
            // Make sure step isn't 0, which would cause an infinite loop (#654)
            step = Math.max(step, 0.0000001);
            // Find all steps in the subrange.
            for (i = low; i <= high; i = safeIncrement(i, step)) {
               // Get the percentage value for the current step,
               // calculate the size for the subrange.
               newPct = scope_Spectrum.toStepping(i);
               pctDifference = newPct - prevPct;
               steps = pctDifference / density;
               realSteps = Math.round(steps);
               // This ratio represents the amount of percentage-space a point indicates.
               // For a density 1 the points/percentage = 1. For density 2, that percentage needs to be re-divided.
               // Round the percentage offset to an even number, then divide by two
               // to spread the offset on both sides of the range.
               stepSize = pctDifference / realSteps;
               // Divide all points evenly, adding the correct number to this subrange.
               // Run up to <= so that 100% gets a point, event if ignoreLast is set.
               for (q = 1; q <= realSteps; q += 1) {
                  // The ratio between the rounded value and the actual size might be ~1% off.
                  // Correct the percentage offset by the number of points
                  // per subrange. density = 1 will result in 100 points on the
                  // full range, 2 for 50, 4 for 25, etc.
                  pctPos = prevPct + q * stepSize;
                  indexes[pctPos.toFixed(5)] = [scope_Spectrum.fromStepping(pctPos), 0];
               }
               // Determine the point type.
               type = group.indexOf(i) > -1 ? PIPS_LARGE_VALUE : isSteps ? PIPS_SMALL_VALUE : PIPS_NO_VALUE;
               // Enforce the 'ignoreFirst' option by overwriting the type for 0.
               if (!index && ignoreFirst && i !== high) {
                  type = 0;
               }
               if (!(i === high && ignoreLast)) {
                  // Mark the 'type' of this point. 0 = plain, 1 = real value, 2 = step value.
                  indexes[newPct.toFixed(5)] = [i, type];
               }
               // Update the percentage count.
               prevPct = newPct;
            }
         });
         return indexes;
      }
      function addMarking(spread, filterFunc, formatter) {
         var element = scope_Document.createElement("div");
         var valueSizeClasses = [];
         valueSizeClasses[PIPS_NO_VALUE] = options.cssClasses.valueNormal;
         valueSizeClasses[PIPS_LARGE_VALUE] = options.cssClasses.valueLarge;
         valueSizeClasses[PIPS_SMALL_VALUE] = options.cssClasses.valueSub;
         var markerSizeClasses = [];
         markerSizeClasses[PIPS_NO_VALUE] = options.cssClasses.markerNormal;
         markerSizeClasses[PIPS_LARGE_VALUE] = options.cssClasses.markerLarge;
         markerSizeClasses[PIPS_SMALL_VALUE] = options.cssClasses.markerSub;
         var valueOrientationClasses = [options.cssClasses.valueHorizontal, options.cssClasses.valueVertical];
         var markerOrientationClasses = [options.cssClasses.markerHorizontal, options.cssClasses.markerVertical];
         addClass(element, options.cssClasses.pips);
         addClass(element, options.ort === 0 ? options.cssClasses.pipsHorizontal : options.cssClasses.pipsVertical);
         function getClasses(type, source) {
            var a = source === options.cssClasses.value;
            var orientationClasses = a ? valueOrientationClasses : markerOrientationClasses;
            var sizeClasses = a ? valueSizeClasses : markerSizeClasses;
            return source + " " + orientationClasses[options.ort] + " " + sizeClasses[type];
         }
         function addSpread(offset, value, type) {
            // Apply the filter function, if it is set.
            type = filterFunc ? filterFunc(value, type) : type;
            if (type === PIPS_NONE) {
               return;
            }
            // Add a marker for every point
            var node = addNodeTo(element, false);
            node.className = getClasses(type, options.cssClasses.marker);
            node.style[options.style] = offset + "%";
            // Values are only appended for points marked '1' or '2'.
            if (type > PIPS_NO_VALUE) {
               node = addNodeTo(element, false);
               node.className = getClasses(type, options.cssClasses.value);
               node.setAttribute("data-value", value);
               node.style[options.style] = offset + "%";
               node.innerHTML = formatter.to(value);
            }
         }
         // Append all points.
         Object.keys(spread).forEach(function (offset) {
            addSpread(offset, spread[offset][0], spread[offset][1]);
         });
         return element;
      }
      function removePips() {
         if (scope_Pips) {
            removeElement(scope_Pips);
            scope_Pips = null;
         }
      }
      function pips(grid) {
         // Fix #669
         removePips();
         var mode = grid.mode;
         var density = grid.density || 1;
         var filter = grid.filter || false;
         var values = grid.values || false;
         var stepped = grid.stepped || false;
         var group = getGroup(mode, values, stepped);
         var spread = generateSpread(density, mode, group);
         var format = grid.format || {
            to: Math.round
         };
         scope_Pips = scope_Target.appendChild(addMarking(spread, filter, format));
         return scope_Pips;
      }
      // Shorthand for base dimensions.
      function baseSize() {
         var rect = scope_Base.getBoundingClientRect();
         var alt = "offset" + ["Width", "Height"][options.ort];
         return options.ort === 0 ? rect.width || scope_Base[alt] : rect.height || scope_Base[alt];
      }
      // Handler for attaching events trough a proxy.
      function attachEvent(events, element, callback, data) {
         // This function can be used to 'filter' events to the slider.
         // element is a node, not a nodeList
         var method = function (e) {
            e = fixEvent(e, data.pageOffset, data.target || element);
            // fixEvent returns false if this event has a different target
            // when handling (multi-) touch events;
            if (!e) {
               return false;
            }
            // doNotReject is passed by all end events to make sure released touches
            // are not rejected, leaving the slider "stuck" to the cursor;
            if (isSliderDisabled() && !data.doNotReject) {
               return false;
            }
            // Stop if an active 'tap' transition is taking place.
            if (hasClass(scope_Target, options.cssClasses.tap) && !data.doNotReject) {
               return false;
            }
            // Ignore right or middle clicks on start #454
            if (events === actions.start && e.buttons !== undefined && e.buttons > 1) {
               return false;
            }
            // Ignore right or middle clicks on start #454
            if (data.hover && e.buttons) {
               return false;
            }
            // 'supportsPassive' is only true if a browser also supports touch-action: none in CSS.
            // iOS safari does not, so it doesn't get to benefit from passive scrolling. iOS does support
            // touch-action: manipulation, but that allows panning, which breaks
            // sliders after zooming/on non-responsive pages.
            // See: https://bugs.webkit.org/show_bug.cgi?id=133112
            if (!supportsPassive) {
               e.preventDefault();
            }
            e.calcPoint = e.points[options.ort];
            // Call the event handler with the event [ and additional data ].
            callback(e, data);
         };
         var methods = [];
         // Bind a closure on the target for every event type.
         events.split(" ").forEach(function (eventName) {
            element.addEventListener(eventName, method, supportsPassive ? { passive: true } : false);
            methods.push([eventName, method]);
         });
         return methods;
      }
      // Provide a clean event with standardized offset values.
      function fixEvent(e, pageOffset, eventTarget) {
         // Filter the event to register the type, which can be
         // touch, mouse or pointer. Offset changes need to be
         // made on an event specific basis.
         var touch = e.type.indexOf("touch") === 0;
         var mouse = e.type.indexOf("mouse") === 0;
         var pointer = e.type.indexOf("pointer") === 0;
         var x;
         var y;
         // IE10 implemented pointer events with a prefix;
         if (e.type.indexOf("MSPointer") === 0) {
            pointer = true;
         }
         // Erroneous events seem to be passed in occasionally on iOS/iPadOS after user finishes interacting with
         // the slider. They appear to be of type MouseEvent, yet they don't have usual properties set. Ignore
         // events that have no touches or buttons associated with them. (#1057, #1079, #1095)
         if (e.type === "mousedown" && !e.buttons && !e.touches) {
            return false;
         }
         // The only thing one handle should be concerned about is the touches that originated on top of it.
         if (touch) {
            // Returns true if a touch originated on the target.
            var isTouchOnTarget = function (checkTouch) {
               return (checkTouch.target === eventTarget ||
                  eventTarget.contains(checkTouch.target) ||
                  (checkTouch.target.shadowRoot && checkTouch.target.shadowRoot.contains(eventTarget)));
            };
            // In the case of touchstart events, we need to make sure there is still no more than one
            // touch on the target so we look amongst all touches.
            if (e.type === "touchstart") {
               var targetTouches = Array.prototype.filter.call(e.touches, isTouchOnTarget);
               // Do not support more than one touch per handle.
               if (targetTouches.length > 1) {
                  return false;
               }
               x = targetTouches[0].pageX;
               y = targetTouches[0].pageY;
            }
            else {
               // In the other cases, find on changedTouches is enough.
               var targetTouch = Array.prototype.find.call(e.changedTouches, isTouchOnTarget);
               // Cancel if the target touch has not moved.
               if (!targetTouch) {
                  return false;
               }
               x = targetTouch.pageX;
               y = targetTouch.pageY;
            }
         }
         pageOffset = pageOffset || getPageOffset(scope_Document);
         if (mouse || pointer) {
            x = e.clientX + pageOffset.x;
            y = e.clientY + pageOffset.y;
         }
         e.pageOffset = pageOffset;
         e.points = [x, y];
         e.cursor = mouse || pointer; // Fix #435
         return e;
      }
      // Translate a coordinate in the document to a percentage on the slider
      function calcPointToPercentage(calcPoint) {
         var location = calcPoint - offset(scope_Base, options.ort);
         var proposal = (location * 100) / baseSize();
         // Clamp proposal between 0% and 100%
         // Out-of-bound coordinates may occur when .noUi-base pseudo-elements
         // are used (e.g. contained handles feature)
         proposal = limit(proposal);
         return options.dir ? 100 - proposal : proposal;
      }
      // Find handle closest to a certain percentage on the slider
      function getClosestHandle(clickedPosition) {
         var smallestDifference = 100;
         var handleNumber = false;
         scope_Handles.forEach(function (handle, index) {
            // Disabled handles are ignored
            if (isHandleDisabled(index)) {
               return;
            }
            var handlePosition = scope_Locations[index];
            var differenceWithThisHandle = Math.abs(handlePosition - clickedPosition);
            // Initial state
            var clickAtEdge = differenceWithThisHandle === 100 && smallestDifference === 100;
            // Difference with this handle is smaller than the previously checked handle
            var isCloser = differenceWithThisHandle < smallestDifference;
            var isCloserAfter = differenceWithThisHandle <= smallestDifference && clickedPosition > handlePosition;
            if (isCloser || isCloserAfter || clickAtEdge) {
               handleNumber = index;
               smallestDifference = differenceWithThisHandle;
            }
         });
         return handleNumber;
      }
      // Fire 'end' when a mouse or pen leaves the document.
      function documentLeave(event, data) {
         if (event.type === "mouseout" && event.target.nodeName === "HTML" && event.relatedTarget === null) {
            eventEnd(event, data);
         }
      }
      // Handle movement on document for handle and range drag.
      function eventMove(event, data) {
         // Fix #498
         // Check value of .buttons in 'start' to work around a bug in IE10 mobile (data.buttonsProperty).
         // https://connect.microsoft.com/IE/feedback/details/927005/mobile-ie10-windows-phone-buttons-property-of-pointermove-event-always-zero
         // IE9 has .buttons and .which zero on mousemove.
         // Firefox breaks the spec MDN defines.
         if (navigator.appVersion.indexOf("MSIE 9") === -1 && event.buttons === 0 && data.buttonsProperty !== 0) {
            return eventEnd(event, data);
         }
         // Check if we are moving up or down
         var movement = (options.dir ? -1 : 1) * (event.calcPoint - data.startCalcPoint);
         // Convert the movement into a percentage of the slider width/height
         var proposal = (movement * 100) / data.baseSize;
         moveHandles(movement > 0, proposal, data.locations, data.handleNumbers);
      }
      // Unbind move events on document, call callbacks.
      function eventEnd(event, data) {
         // The handle is no longer active, so remove the class.
         if (data.handle) {
            removeClass(data.handle, options.cssClasses.active);
            scope_ActiveHandlesCount -= 1;
         }
         // Unbind the move and end events, which are added on 'start'.
         data.listeners.forEach(function (c) {
            scope_DocumentElement.removeEventListener(c[0], c[1]);
         });
         if (scope_ActiveHandlesCount === 0) {
            // Remove dragging class.
            removeClass(scope_Target, options.cssClasses.drag);
            setZindex();
            // Remove cursor styles and text-selection events bound to the body.
            if (event.cursor) {
               scope_Body.style.cursor = "";
               scope_Body.removeEventListener("selectstart", preventDefault);
            }
         }
         data.handleNumbers.forEach(function (handleNumber) {
            fireEvent("change", handleNumber);
            fireEvent("set", handleNumber);
            fireEvent("end", handleNumber);
         });
      }
      // Bind move events on document.
      function eventStart(event, data) {
         // Ignore event if any handle is disabled
         if (data.handleNumbers.some(isHandleDisabled)) {
            return false;
         }
         var handle;
         if (data.handleNumbers.length === 1) {
            var handleOrigin = scope_Handles[data.handleNumbers[0]];
            handle = handleOrigin.children[0];
            scope_ActiveHandlesCount += 1;
            // Mark the handle as 'active' so it can be styled.
            addClass(handle, options.cssClasses.active);
         }
         // A drag should never propagate up to the 'tap' event.
         event.stopPropagation();
         // Record the event listeners.
         var listeners = [];
         // Attach the move and end events.
         var moveEvent = attachEvent(actions.move, scope_DocumentElement, eventMove, {
            // The event target has changed so we need to propagate the original one so that we keep
            // relying on it to extract target touches.
            target: event.target,
            handle: handle,
            listeners: listeners,
            startCalcPoint: event.calcPoint,
            baseSize: baseSize(),
            pageOffset: event.pageOffset,
            handleNumbers: data.handleNumbers,
            buttonsProperty: event.buttons,
            locations: scope_Locations.slice()
         });
         var endEvent = attachEvent(actions.end, scope_DocumentElement, eventEnd, {
            target: event.target,
            handle: handle,
            listeners: listeners,
            doNotReject: true,
            handleNumbers: data.handleNumbers
         });
         var outEvent = attachEvent("mouseout", scope_DocumentElement, documentLeave, {
            target: event.target,
            handle: handle,
            listeners: listeners,
            doNotReject: true,
            handleNumbers: data.handleNumbers
         });
         // We want to make sure we pushed the listeners in the listener list rather than creating
         // a new one as it has already been passed to the event handlers.
         listeners.push.apply(listeners, moveEvent.concat(endEvent, outEvent));
         // Text selection isn't an issue on touch devices,
         // so adding cursor styles can be skipped.
         if (event.cursor) {
            // Prevent the 'I' cursor and extend the range-drag cursor.
            scope_Body.style.cursor = getComputedStyle(event.target).cursor;
            // Mark the target with a dragging state.
            if (scope_Handles.length > 1) {
               addClass(scope_Target, options.cssClasses.drag);
            }
            // Prevent text selection when dragging the handles.
            // In noUiSlider <= 9.2.0, this was handled by calling preventDefault on mouse/touch start/move,
            // which is scroll blocking. The selectstart event is supported by FireFox starting from version 52,
            // meaning the only holdout is iOS Safari. This doesn't matter: text selection isn't triggered there.
            // The 'cursor' flag is false.
            // See: http://caniuse.com/#search=selectstart
            scope_Body.addEventListener("selectstart", preventDefault, false);
         }
         data.handleNumbers.forEach(function (handleNumber) {
            fireEvent("start", handleNumber);
         });
      }
      // Move closest handle to tapped location.
      function eventTap(event) {
         // The tap event shouldn't propagate up
         event.stopPropagation();
         var proposal = calcPointToPercentage(event.calcPoint);
         var handleNumber = getClosestHandle(proposal);
         // Tackle the case that all handles are 'disabled'.
         if (handleNumber === false) {
            return false;
         }
         // Flag the slider as it is now in a transitional state.
         // Transition takes a configurable amount of ms (default 300). Re-enable the slider after that.
         if (!options.events.snap) {
            addClassFor(scope_Target, options.cssClasses.tap, options.animationDuration);
         }
         setHandle(handleNumber, proposal, true, true);
         setZindex();
         fireEvent("slide", handleNumber, true);
         fireEvent("update", handleNumber, true);
         fireEvent("change", handleNumber, true);
         fireEvent("set", handleNumber, true);
         if (options.events.snap) {
            eventStart(event, { handleNumbers: [handleNumber] });
         }
      }
      // Fires a 'hover' event for a hovered mouse/pen position.
      function eventHover(event) {
         var proposal = calcPointToPercentage(event.calcPoint);
         var to = scope_Spectrum.getStep(proposal);
         var value = scope_Spectrum.fromStepping(to);
         Object.keys(scope_Events).forEach(function (targetEvent) {
            if ("hover" === targetEvent.split(".")[0]) {
               scope_Events[targetEvent].forEach(function (callback) {
                  callback.call(scope_Self, value);
               });
            }
         });
      }
      // Handles keydown on focused handles
      // Don't move the document when pressing arrow keys on focused handles
      function eventKeydown(event, handleNumber) {
         if (isSliderDisabled() || isHandleDisabled(handleNumber)) {
            return false;
         }
         var horizontalKeys = ["Left", "Right"];
         var verticalKeys = ["Down", "Up"];
         var largeStepKeys = ["PageDown", "PageUp"];
         var edgeKeys = ["Home", "End"];
         if (options.dir && !options.ort) {
            // On an right-to-left slider, the left and right keys act inverted
            horizontalKeys.reverse();
         }
         else if (options.ort && !options.dir) {
            // On a top-to-bottom slider, the up and down keys act inverted
            verticalKeys.reverse();
            largeStepKeys.reverse();
         }
         // Strip "Arrow" for IE compatibility. https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
         var key = event.key.replace("Arrow", "");
         var isLargeDown = key === largeStepKeys[0];
         var isLargeUp = key === largeStepKeys[1];
         var isDown = key === verticalKeys[0] || key === horizontalKeys[0] || isLargeDown;
         var isUp = key === verticalKeys[1] || key === horizontalKeys[1] || isLargeUp;
         var isMin = key === edgeKeys[0];
         var isMax = key === edgeKeys[1];
         if (!isDown && !isUp && !isMin && !isMax) {
            return true;
         }
         event.preventDefault();
         var to;
         if (isUp || isDown) {
            var multiplier = options.keyboardPageMultiplier;
            var direction = isDown ? 0 : 1;
            var steps = getNextStepsForHandle(handleNumber);
            var step = steps[direction];
            // At the edge of a slider, do nothing
            if (step === null) {
               return false;
            }
            // No step set, use the default of 10% of the sub-range
            if (step === false) {
               step = scope_Spectrum.getDefaultStep(scope_Locations[handleNumber], isDown, options.keyboardDefaultStep);
            }
            if (isLargeUp || isLargeDown) {
               step *= multiplier;
            }
            // Step over zero-length ranges (#948);
            step = Math.max(step, 0.0000001);
            // Decrement for down steps
            step = (isDown ? -1 : 1) * step;
            to = scope_Values[handleNumber] + step;
         }
         else if (isMax) {
            // End key
            to = options.spectrum.xVal[options.spectrum.xVal.length - 1];
         }
         else {
            // Home key
            to = options.spectrum.xVal[0];
         }
         setHandle(handleNumber, scope_Spectrum.toStepping(to), true, true);
         fireEvent("slide", handleNumber);
         fireEvent("update", handleNumber);
         fireEvent("change", handleNumber);
         fireEvent("set", handleNumber);
         return false;
      }
      // Attach events to several slider parts.
      function bindSliderEvents(behaviour) {
         // Attach the standard drag event to the handles.
         if (!behaviour.fixed) {
            scope_Handles.forEach(function (handle, index) {
               // These events are only bound to the visual handle
               // element, not the 'real' origin element.
               attachEvent(actions.start, handle.children[0], eventStart, {
                  handleNumbers: [index]
               });
            });
         }
         // Attach the tap event to the slider base.
         if (behaviour.tap) {
            attachEvent(actions.start, scope_Base, eventTap, {});
         }
         // Fire hover events
         if (behaviour.hover) {
            attachEvent(actions.move, scope_Base, eventHover, {
               hover: true
            });
         }
         // Make the range draggable.
         if (behaviour.drag) {
            scope_Connects.forEach(function (connect, index) {
               if (connect === false || index === 0 || index === scope_Connects.length - 1) {
                  return;
               }
               var handleBefore = scope_Handles[index - 1];
               var handleAfter = scope_Handles[index];
               var eventHolders = [connect];
               addClass(connect, options.cssClasses.draggable);
               // When the range is fixed, the entire range can
               // be dragged by the handles. The handle in the first
               // origin will propagate the start event upward,
               // but it needs to be bound manually on the other.
               if (behaviour.fixed) {
                  eventHolders.push(handleBefore.children[0]);
                  eventHolders.push(handleAfter.children[0]);
               }
               eventHolders.forEach(function (eventHolder) {
                  attachEvent(actions.start, eventHolder, eventStart, {
                     handles: [handleBefore, handleAfter],
                     handleNumbers: [index - 1, index]
                  });
               });
            });
         }
      }
      // Attach an event to this slider, possibly including a namespace
      function bindEvent(namespacedEvent, callback) {
         scope_Events[namespacedEvent] = scope_Events[namespacedEvent] || [];
         scope_Events[namespacedEvent].push(callback);
         // If the event bound is 'update,' fire it immediately for all handles.
         if (namespacedEvent.split(".")[0] === "update") {
            scope_Handles.forEach(function (a, index) {
               fireEvent("update", index);
            });
         }
      }
      function isInternalNamespace(namespace) {
         return namespace === INTERNAL_EVENT_NS.aria || namespace === INTERNAL_EVENT_NS.tooltips;
      }
      // Undo attachment of event
      function removeEvent(namespacedEvent) {
         var event = namespacedEvent && namespacedEvent.split(".")[0];
         var namespace = event ? namespacedEvent.substring(event.length) : namespacedEvent;
         Object.keys(scope_Events).forEach(function (bind) {
            var tEvent = bind.split(".")[0];
            var tNamespace = bind.substring(tEvent.length);
            if ((!event || event === tEvent) && (!namespace || namespace === tNamespace)) {
               // only delete protected internal event if intentional
               if (!isInternalNamespace(tNamespace) || namespace === tNamespace) {
                  delete scope_Events[bind];
               }
            }
         });
      }
      // External event handling
      function fireEvent(eventName, handleNumber, tap) {
         Object.keys(scope_Events).forEach(function (targetEvent) {
            var eventType = targetEvent.split(".")[0];
            if (eventName === eventType) {
               scope_Events[targetEvent].forEach(function (callback) {
                  callback.call(
                     // Use the slider public API as the scope ('this')
                     scope_Self,
                     // Return values as array, so arg_1[arg_2] is always valid.
                     scope_Values.map(options.format.to),
                     // Handle index, 0 or 1
                     handleNumber,
                     // Un-formatted slider values
                     scope_Values.slice(),
                     // Event is fired by tap, true or false
                     tap || false,
                     // Left offset of the handle, in relation to the slider
                     scope_Locations.slice(),
                     // add the slider public API to an accessible parameter when this is unavailable
                     scope_Self);
               });
            }
         });
      }
      // Split out the handle positioning logic so the Move event can use it, too
      function checkHandlePosition(reference, handleNumber, to, lookBackward, lookForward, getValue) {
         var distance;
         // For sliders with multiple handles, limit movement to the other handle.
         // Apply the margin option by adding it to the handle positions.
         if (scope_Handles.length > 1 && !options.events.unconstrained) {
            if (lookBackward && handleNumber > 0) {
               distance = scope_Spectrum.getAbsoluteDistance(reference[handleNumber - 1], options.margin, 0);
               to = Math.max(to, distance);
            }
            if (lookForward && handleNumber < scope_Handles.length - 1) {
               distance = scope_Spectrum.getAbsoluteDistance(reference[handleNumber + 1], options.margin, 1);
               to = Math.min(to, distance);
            }
         }
         // The limit option has the opposite effect, limiting handles to a
         // maximum distance from another. Limit must be > 0, as otherwise
         // handles would be unmovable.
         if (scope_Handles.length > 1 && options.limit) {
            if (lookBackward && handleNumber > 0) {
               distance = scope_Spectrum.getAbsoluteDistance(reference[handleNumber - 1], options.limit, 0);
               to = Math.min(to, distance);
            }
            if (lookForward && handleNumber < scope_Handles.length - 1) {
               distance = scope_Spectrum.getAbsoluteDistance(reference[handleNumber + 1], options.limit, 1);
               to = Math.max(to, distance);
            }
         }
         // The padding option keeps the handles a certain distance from the
         // edges of the slider. Padding must be > 0.
         if (options.padding) {
            if (handleNumber === 0) {
               distance = scope_Spectrum.getAbsoluteDistance(0, options.padding[0], 0);
               to = Math.max(to, distance);
            }
            if (handleNumber === scope_Handles.length - 1) {
               distance = scope_Spectrum.getAbsoluteDistance(100, options.padding[1], 1);
               to = Math.min(to, distance);
            }
         }
         to = scope_Spectrum.getStep(to);
         // Limit percentage to the 0 - 100 range
         to = limit(to);
         // Return false if handle can't move
         if (to === reference[handleNumber] && !getValue) {
            return false;
         }
         return to;
      }
      // Uses slider orientation to create CSS rules. a = base value;
      function inRuleOrder(v, a) {
         var o = options.ort;
         return (o ? a : v) + ", " + (o ? v : a);
      }
      // Moves handle(s) by a percentage
      // (bool, % to move, [% where handle started, ...], [index in scope_Handles, ...])
      function moveHandles(upward, proposal, locations, handleNumbers) {
         var proposals = locations.slice();
         var b = [!upward, upward];
         var f = [upward, !upward];
         // Copy handleNumbers so we don't change the dataset
         handleNumbers = handleNumbers.slice();
         // Check to see which handle is 'leading'.
         // If that one can't move the second can't either.
         if (upward) {
            handleNumbers.reverse();
         }
         // Step 1: get the maximum percentage that any of the handles can move
         if (handleNumbers.length > 1) {
            handleNumbers.forEach(function (handleNumber, o) {
               var to = checkHandlePosition(proposals, handleNumber, proposals[handleNumber] + proposal, b[o], f[o], false);
               // Stop if one of the handles can't move.
               if (to === false) {
                  proposal = 0;
               }
               else {
                  proposal = to - proposals[handleNumber];
                  proposals[handleNumber] = to;
               }
            });
         }
         // If using one handle, check backward AND forward
         else {
            b = f = [true];
         }
         var state = false;
         // Step 2: Try to set the handles with the found percentage
         handleNumbers.forEach(function (handleNumber, o) {
            state = setHandle(handleNumber, locations[handleNumber] + proposal, b[o], f[o]) || state;
         });
         // Step 3: If a handle moved, fire events
         if (state) {
            handleNumbers.forEach(function (handleNumber) {
               fireEvent("update", handleNumber);
               fireEvent("slide", handleNumber);
            });
         }
      }
      // Takes a base value and an offset. This offset is used for the connect bar size.
      // In the initial design for this feature, the origin element was 1% wide.
      // Unfortunately, a rounding bug in Chrome makes it impossible to implement this feature
      // in this manner: https://bugs.chromium.org/p/chromium/issues/detail?id=798223
      function transformDirection(a, b) {
         return options.dir ? 100 - a - b : a;
      }
      // Updates scope_Locations and scope_Values, updates visual state
      function updateHandlePosition(handleNumber, to) {
         // Update locations.
         scope_Locations[handleNumber] = to;
         // Convert the value to the slider stepping/range.
         scope_Values[handleNumber] = scope_Spectrum.fromStepping(to);
         var translation = 10 * (transformDirection(to, 0) - scope_DirOffset);
         var translateRule = "translate(" + inRuleOrder(translation + "%", "0") + ")";
         scope_Handles[handleNumber].style[options.transformRule] = translateRule;
         updateConnect(handleNumber);
         updateConnect(handleNumber + 1);
      }
      // Handles before the slider middle are stacked later = higher,
      // Handles after the middle later is lower
      // [[7] [8] .......... | .......... [5] [4]
      function setZindex() {
         scope_HandleNumbers.forEach(function (handleNumber) {
            var dir = scope_Locations[handleNumber] > 50 ? -1 : 1;
            var zIndex = 3 + (scope_Handles.length + dir * handleNumber);
            scope_Handles[handleNumber].style.zIndex = zIndex;
         });
      }
      // Test suggested values and apply margin, step.
      // if exactInput is true, don't run checkHandlePosition, then the handle can be placed in between steps (#436)
      function setHandle(handleNumber, to, lookBackward, lookForward, exactInput) {
         if (!exactInput) {
            to = checkHandlePosition(scope_Locations, handleNumber, to, lookBackward, lookForward, false);
         }
         if (to === false) {
            return false;
         }
         updateHandlePosition(handleNumber, to);
         return true;
      }
      // Updates style attribute for connect nodes
      function updateConnect(index) {
         // Skip connects set to false
         if (!scope_Connects[index]) {
            return;
         }
         var l = 0;
         var h = 100;
         if (index !== 0) {
            l = scope_Locations[index - 1];
         }
         if (index !== scope_Connects.length - 1) {
            h = scope_Locations[index];
         }
         // We use two rules:
         // 'translate' to change the left/top offset;
         // 'scale' to change the width of the element;
         // As the element has a width of 100%, a translation of 100% is equal to 100% of the parent (.noUi-base)
         var connectWidth = h - l;
         var translateRule = "translate(" + inRuleOrder(transformDirection(l, connectWidth) + "%", "0") + ")";
         var scaleRule = "scale(" + inRuleOrder(connectWidth / 100, "1") + ")";
         scope_Connects[index].style[options.transformRule] = translateRule + " " + scaleRule;
      }
      // Parses value passed to .set method. Returns current value if not parse-able.
      function resolveToValue(to, handleNumber) {
         // Setting with null indicates an 'ignore'.
         // Inputting 'false' is invalid.
         if (to === null || to === false || to === undefined) {
            return scope_Locations[handleNumber];
         }
         // If a formatted number was passed, attempt to decode it.
         if (typeof to === "number") {
            to = String(to);
         }
         to = options.format.from(to);
         to = scope_Spectrum.toStepping(to);
         // If parsing the number failed, use the current value.
         if (to === false || isNaN(to)) {
            return scope_Locations[handleNumber];
         }
         return to;
      }
      // Set the slider value.
      function valueSet(input, fireSetEvent, exactInput) {
         var values = asArray(input);
         var isInit = scope_Locations[0] === undefined;
         // Event fires by default
         fireSetEvent = fireSetEvent === undefined ? true : !!fireSetEvent;
         // Animation is optional.
         // Make sure the initial values were set before using animated placement.
         if (options.animate && !isInit) {
            addClassFor(scope_Target, options.cssClasses.tap, options.animationDuration);
         }
         // First pass, without lookAhead but with lookBackward. Values are set from left to right.
         scope_HandleNumbers.forEach(function (handleNumber) {
            setHandle(handleNumber, resolveToValue(values[handleNumber], handleNumber), true, false, exactInput);
         });
         var i = scope_HandleNumbers.length === 1 ? 0 : 1;
         // Secondary passes. Now that all base values are set, apply constraints.
         // Iterate all handles to ensure constraints are applied for the entire slider (Issue #1009)
         for (; i < scope_HandleNumbers.length; ++i) {
            scope_HandleNumbers.forEach(function (handleNumber) {
               setHandle(handleNumber, scope_Locations[handleNumber], true, true, exactInput);
            });
         }
         setZindex();
         scope_HandleNumbers.forEach(function (handleNumber) {
            fireEvent("update", handleNumber);
            // Fire the event only for handles that received a new value, as per #579
            if (values[handleNumber] !== null && fireSetEvent) {
               fireEvent("set", handleNumber);
            }
         });
      }
      // Reset slider to initial values
      function valueReset(fireSetEvent) {
         valueSet(options.start, fireSetEvent);
      }
      // Set value for a single handle
      function valueSetHandle(handleNumber, value, fireSetEvent, exactInput) {
         // Ensure numeric input
         handleNumber = Number(handleNumber);
         if (!(handleNumber >= 0 && handleNumber < scope_HandleNumbers.length)) {
            throw new Error("noUiSlider (" + VERSION + "): invalid handle number, got: " + handleNumber);
         }
         // Look both backward and forward, since we don't want this handle to "push" other handles (#960);
         // The exactInput argument can be used to ignore slider stepping (#436)
         setHandle(handleNumber, resolveToValue(value, handleNumber), true, true, exactInput);
         fireEvent("update", handleNumber);
         if (fireSetEvent) {
            fireEvent("set", handleNumber);
         }
      }
      // Get the slider value.
      function valueGet() {
         var values = scope_Values.map(options.format.to);
         // If only one handle is used, return a single value.
         if (values.length === 1) {
            return values[0];
         }
         return values;
      }
      // Removes classes from the root and empties it.
      function destroy() {
         // remove protected internal listeners
         removeEvent(INTERNAL_EVENT_NS.aria);
         removeEvent(INTERNAL_EVENT_NS.tooltips);
         for (var key in options.cssClasses) {
            if (!options.cssClasses.hasOwnProperty(key)) {
               continue;
            }
            removeClass(scope_Target, options.cssClasses[key]);
         }
         while (scope_Target.firstChild) {
            scope_Target.removeChild(scope_Target.firstChild);
         }
         delete scope_Target.noUiSlider;
      }
      function getNextStepsForHandle(handleNumber) {
         var location = scope_Locations[handleNumber];
         var nearbySteps = scope_Spectrum.getNearbySteps(location);
         var value = scope_Values[handleNumber];
         var increment = nearbySteps.thisStep.step;
         var decrement = null;
         // If snapped, directly use defined step value
         if (options.snap) {
            return [
               value - nearbySteps.stepBefore.startValue || null,
               nearbySteps.stepAfter.startValue - value || null
            ];
         }
         // If the next value in this step moves into the next step,
         // the increment is the start of the next step - the current value
         if (increment !== false) {
            if (value + increment > nearbySteps.stepAfter.startValue) {
               increment = nearbySteps.stepAfter.startValue - value;
            }
         }
         // If the value is beyond the starting point
         if (value > nearbySteps.thisStep.startValue) {
            decrement = nearbySteps.thisStep.step;
         }
         else if (nearbySteps.stepBefore.step === false) {
            decrement = false;
         }
         // If a handle is at the start of a step, it always steps back into the previous step first
         else {
            decrement = value - nearbySteps.stepBefore.highestStep;
         }
         // Now, if at the slider edges, there is no in/decrement
         if (location === 100) {
            increment = null;
         }
         else if (location === 0) {
            decrement = null;
         }
         // As per #391, the comparison for the decrement step can have some rounding issues.
         var stepDecimals = scope_Spectrum.countStepDecimals();
         // Round per #391
         if (increment !== null && increment !== false) {
            increment = Number(increment.toFixed(stepDecimals));
         }
         if (decrement !== null && decrement !== false) {
            decrement = Number(decrement.toFixed(stepDecimals));
         }
         return [decrement, increment];
      }
      // Get the current step size for the slider.
      function getNextSteps() {
         return scope_HandleNumbers.map(getNextStepsForHandle);
      }
      // Updateable: margin, limit, padding, step, range, animate, snap
      function updateOptions(optionsToUpdate, fireSetEvent) {
         // Spectrum is created using the range, snap, direction and step options.
         // 'snap' and 'step' can be updated.
         // If 'snap' and 'step' are not passed, they should remain unchanged.
         var v = valueGet();
         var updateAble = [
            "margin",
            "limit",
            "padding",
            "range",
            "animate",
            "snap",
            "step",
            "format",
            "pips",
            "tooltips"
         ];
         // Only change options that we're actually passed to update.
         updateAble.forEach(function (name) {
            // Check for undefined. null removes the value.
            if (optionsToUpdate[name] !== undefined) {
               originalOptions[name] = optionsToUpdate[name];
            }
         });
         var newOptions = testOptions(originalOptions);
         // Load new options into the slider state
         updateAble.forEach(function (name) {
            if (optionsToUpdate[name] !== undefined) {
               options[name] = newOptions[name];
            }
         });
         scope_Spectrum = newOptions.spectrum;
         // Limit, margin and padding depend on the spectrum but are stored outside of it. (#677)
         options.margin = newOptions.margin;
         options.limit = newOptions.limit;
         options.padding = newOptions.padding;
         // Update pips, removes existing.
         if (options.pips) {
            pips(options.pips);
         }
         else {
            removePips();
         }
         // Update tooltips, removes existing.
         if (options.tooltips) {
            tooltips();
         }
         else {
            removeTooltips();
         }
         // Invalidate the current positioning so valueSet forces an update.
         scope_Locations = [];
         valueSet(isSet(optionsToUpdate.start) ? optionsToUpdate.start : v, fireSetEvent);
      }
      // Initialization steps
      function setupSlider() {
         // Create the base element, initialize HTML and set classes.
         // Add handles and connect elements.
         scope_Base = addSlider(scope_Target);
         addElements(options.connect, scope_Base);
         // Attach user events.
         bindSliderEvents(options.events);
         // Use the public value method to set the start values.
         valueSet(options.start);
         if (options.pips) {
            pips(options.pips);
         }
         if (options.tooltips) {
            tooltips();
         }
         aria();
      }
      setupSlider();
      // noinspection JSUnusedGlobalSymbols
      scope_Self = {
         destroy: destroy,
         steps: getNextSteps,
         on: bindEvent,
         off: removeEvent,
         get: valueGet,
         set: valueSet,
         setHandle: valueSetHandle,
         reset: valueReset,
         // Exposed for unit testing, don't use this in your application.
         __moveHandles: function (a, b, c) {
            moveHandles(a, b, scope_Locations, c);
         },
         options: originalOptions,
         updateOptions: updateOptions,
         target: scope_Target,
         removePips: removePips,
         removeTooltips: removeTooltips,
         getTooltips: function () {
            return scope_Tooltips;
         },
         getOrigins: function () {
            return scope_Handles;
         },
         pips: pips // Issue #594
      };
      return scope_Self;
   }
   // Run the standard initializer
   function initialize(target, originalOptions) {
      if (!target || !target.nodeName) {
         throw new Error("noUiSlider (" + VERSION + "): create requires a single element, got: " + target);
      }
      // Throw an error if the slider was already initialized.
      if (target.noUiSlider) {
         throw new Error("noUiSlider (" + VERSION + "): Slider was already initialized.");
      }
      // Test the options and create the slider environment;
      var options = testOptions(originalOptions);
      var api = scope(target, options, originalOptions);
      target.noUiSlider = api;
      return api;
   }
   // Use an object instead of a function for future expandability;
   return {
      // Exposed for unit testing, don't use this in your application.
      __spectrum: Spectrum,
      version: VERSION,
      // A reference to the default classes, allows global changes.
      // Use the cssClasses option for changes to one slider.
      cssClasses: cssClasses,
      create: initialize
   };
});
;
function tamingselect()
{
	if(!document.getElementById && !document.createTextNode){return;}
	
// Classes for the link and the visible dropdown
	var ts_selectclass='turnintodropdown'; 	// class to identify selects
	var ts_listclass='turnintoselect';		// class to identify ULs
	var ts_boxclass='dropcontainer'; 		// parent element
	var ts_triggeron='activetrigger'; 		// class for the active trigger link
	var ts_triggeroff='trigger';			// class for the inactive trigger link
	var ts_dropdownclosed='dropdownhidden'; // closed dropdown
	var ts_dropdownopen='dropdownvisible';	// open dropdown
/*
	Turn all selects into DOM dropdowns
*/
	var count=0;
	var toreplace=new Array();
	var sels=document.getElementsByTagName('select');
	for(var i=0;i<sels.length;i++){
		if (ts_check(sels[i],ts_selectclass))
		{
			var hiddenfield=document.createElement('input');
			hiddenfield.name=sels[i].name;
			hiddenfield.type='hidden';
			hiddenfield.id=sels[i].id;
			hiddenfield.value=sels[i].options[0].value;
			sels[i].parentNode.insertBefore(hiddenfield,sels[i])
			var trigger=document.createElement('a');
			ts_addclass(trigger,ts_triggeroff);
			trigger.href='#';
			trigger.onclick=function(){
				ts_swapclass(this,ts_triggeroff,ts_triggeron)
				ts_swapclass(this.parentNode.getElementsByTagName('ul')[0],ts_dropdownclosed,ts_dropdownopen);
				return false;
			}
			trigger.appendChild(document.createTextNode(sels[i].options[0].text));
			sels[i].parentNode.insertBefore(trigger,sels[i]);
			var replaceUL=document.createElement('ul');
			for(var j=0;j<sels[i].getElementsByTagName('option').length;j++)
			{
				var newli=document.createElement('li');
				var newa=document.createElement('a');
				newli.v=sels[i].getElementsByTagName('option')[j].value;
				newli.elm=hiddenfield;
				newli.istrigger=trigger;
				newa.href='#';
				newa.appendChild(document.createTextNode(
				sels[i].getElementsByTagName('option')[j].text));
				newli.onclick=function(){ 
					this.elm.value=this.v;
					ts_swapclass(this.istrigger,ts_triggeron,ts_triggeroff);
					ts_swapclass(this.parentNode,ts_dropdownopen,ts_dropdownclosed)
					this.istrigger.firstChild.nodeValue=this.firstChild.firstChild.nodeValue;
					return false;
				}
				newli.appendChild(newa);
				replaceUL.appendChild(newli);
			}
			ts_addclass(replaceUL,ts_dropdownclosed);
			var div=document.createElement('div');
			div.appendChild(replaceUL);
			ts_addclass(div,ts_boxclass);
			sels[i].parentNode.insertBefore(div,sels[i])
			toreplace[count]=sels[i];
			count++;
		}
	}
	
/*
	Turn all ULs with the class defined above into dropdown navigations
*/	

	var uls=document.getElementsByTagName('ul');
	for(var i=0;i<uls.length;i++)
	{
		if(ts_check(uls[i],ts_listclass))
		{
			var newform=document.createElement('form');
			var newselect=document.createElement('select');
			for(j=0;j<uls[i].getElementsByTagName('a').length;j++)
			{
				var newopt=document.createElement('option');
				newopt.value=uls[i].getElementsByTagName('a')[j].href;	
				newopt.appendChild(document.createTextNode(uls[i].getElementsByTagName('a')[j].innerHTML));	
				newselect.appendChild(newopt);
			}
			newselect.onchange=function()
			{
				window.location=this.options[this.selectedIndex].value;
			}
			newform.appendChild(newselect);
			uls[i].parentNode.insertBefore(newform,uls[i]);
			toreplace[count]=uls[i];
			count++;
		}
	}
	for(i=0;i<count;i++){
		toreplace[i].parentNode.removeChild(toreplace[i]);
	}
	function ts_check(o,c)
	{
	 	return new RegExp('\\b'+c+'\\b').test(o.className);
	}
	function ts_swapclass(o,c1,c2)
	{
		var cn=o.className
		o.className=!ts_check(o,c1)?cn.replace(c2,c1):cn.replace(c1,c2);
	}
	function ts_addclass(o,c)
	{
		if(!ts_check(o,c)){o.className+=o.className==''?c:' '+c;}
	}
}

window.onload=function()
{
	tamingselect();
	// add more functions if necessary
}
;
!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var n=t();for(var o in n)("object"==typeof exports?exports:e)[o]=n[o]}}(window,(function(){return function(e){var t={};function n(o){if(t[o])return t[o].exports;var i=t[o]={i:o,l:!1,exports:{}};return e[o].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(o,i,function(t){return e[t]}.bind(null,i));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";n.r(t);var o,i="fslightbox-",r="".concat(i,"styles"),s="".concat(i,"cursor-grabbing"),a="".concat(i,"full-dimension"),c="".concat(i,"flex-centered"),l="".concat(i,"open"),u="".concat(i,"transform-transition"),d="".concat(i,"absoluted"),p="".concat(i,"slide-btn"),f="".concat(p,"-container"),h="".concat(i,"fade-in"),m="".concat(i,"fade-out"),g=h+"-strong",v=m+"-strong",b="".concat(i,"opacity-"),x="".concat(b,"1"),y="".concat(i,"source");function S(e){return(S="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}"object"===("undefined"==typeof document?"undefined":S(document))&&((o=document.createElement("style")).className=r,o.appendChild(document.createTextNode(".fslightbox-absoluted{position:absolute;top:0;left:0}.fslightbox-fade-in{animation:fslightbox-fade-in .25s cubic-bezier(0,0,.7,1)}.fslightbox-fade-out{animation:fslightbox-fade-out .25s ease}.fslightbox-fade-in-strong{animation:fslightbox-fade-in-strong .25s cubic-bezier(0,0,.7,1)}.fslightbox-fade-out-strong{animation:fslightbox-fade-out-strong .25s ease}@keyframes fslightbox-fade-in{from{opacity:.65}to{opacity:1}}@keyframes fslightbox-fade-out{from{opacity:.35}to{opacity:0}}@keyframes fslightbox-fade-in-strong{from{opacity:.3}to{opacity:1}}@keyframes fslightbox-fade-out-strong{from{opacity:1}to{opacity:0}}.fslightbox-cursor-grabbing{cursor:grabbing}.fslightbox-full-dimension{width:100%;height:100%}.fslightbox-open{overflow:hidden;height:100%}.fslightbox-flex-centered{display:flex;justify-content:center;align-items:center}.fslightbox-opacity-0{opacity:0!important}.fslightbox-opacity-1{opacity:1!important}.fslightbox-scrollbarfix{padding-right:17px}.fslightbox-transform-transition{transition:transform .3s}.fslightbox-container{font-family:Arial,sans-serif;position:fixed;top:0;left:0;background:linear-gradient(rgba(30,30,30,.9),#000 1810%);z-index:1000000000;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent}.fslightbox-container *{box-sizing:border-box}.fslightbox-svg-path{transition:fill .15s ease;fill:#ddd}.fslightbox-nav{height:45px;width:100%;position:absolute;top:0;left:0}.fslightbox-slide-number-container{display:flex;justify-content:center;align-items:center;position:relative;height:100%;font-size:15px;color:#d7d7d7;z-index:0;max-width:55px;text-align:left}.fslightbox-slide-number-container .fslightbox-flex-centered{height:100%}.fslightbox-slash{display:block;margin:0 5px;width:1px;height:12px;transform:rotate(15deg);background:#fff}.fslightbox-toolbar{position:absolute;z-index:3;right:0;top:0;height:100%;display:flex;background:rgba(35,35,35,.65)}.fslightbox-toolbar-button{height:100%;width:45px;cursor:pointer}.fslightbox-toolbar-button:hover .fslightbox-svg-path{fill:#fff}.fslightbox-slide-btn-container{display:flex;align-items:center;padding:12px 12px 12px 6px;position:absolute;top:50%;cursor:pointer;z-index:3;transform:translateY(-50%)}@media (min-width:476px){.fslightbox-slide-btn-container{padding:22px 22px 22px 6px}}@media (min-width:768px){.fslightbox-slide-btn-container{padding:30px 30px 30px 6px}}.fslightbox-slide-btn-container:hover .fslightbox-svg-path{fill:#f1f1f1}.fslightbox-slide-btn{padding:9px;font-size:26px;background:rgba(35,35,35,.65)}@media (min-width:768px){.fslightbox-slide-btn{padding:10px}}@media (min-width:1600px){.fslightbox-slide-btn{padding:11px}}.fslightbox-slide-btn-container-previous{left:0}@media (max-width:475.99px){.fslightbox-slide-btn-container-previous{padding-left:3px}}.fslightbox-slide-btn-container-next{right:0;padding-left:12px;padding-right:3px}@media (min-width:476px){.fslightbox-slide-btn-container-next{padding-left:22px}}@media (min-width:768px){.fslightbox-slide-btn-container-next{padding-left:30px}}@media (min-width:476px){.fslightbox-slide-btn-container-next{padding-right:6px}}.fslightbox-down-event-detector{position:absolute;z-index:1}.fslightbox-slide-swiping-hoverer{z-index:4}.fslightbox-invalid-file-wrapper{font-size:22px;color:#eaebeb;margin:auto}.fslightbox-video{object-fit:cover}.fslightbox-youtube-iframe{border:0}.fslightbox-loader{display:block;margin:auto;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:67px;height:67px}.fslightbox-loader div{box-sizing:border-box;display:block;position:absolute;width:54px;height:54px;margin:6px;border:5px solid;border-color:#999 transparent transparent transparent;border-radius:50%;animation:fslightbox-loader 1.2s cubic-bezier(.5,0,.5,1) infinite}.fslightbox-loader div:nth-child(1){animation-delay:-.45s}.fslightbox-loader div:nth-child(2){animation-delay:-.3s}.fslightbox-loader div:nth-child(3){animation-delay:-.15s}@keyframes fslightbox-loader{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}.fslightbox-source{position:relative;z-index:2;opacity:0}")),document.head.appendChild(o));function w(e){var t,n=e.props,o=0,i={};this.getSourceTypeFromLocalStorageByUrl=function(e){return t[e]?t[e]:r(e)},this.handleReceivedSourceTypeForUrl=function(e,n){!1===i[n]&&(o--,"invalid"!==e?i[n]=e:delete i[n],0===o&&(!function(e,t){for(var n in t)e[n]=t[n]}(t,i),localStorage.setItem("fslightbox-types",JSON.stringify(t))))};var r=function(e){o++,i[e]=!1};n.disableLocalStorage?(this.getSourceTypeFromLocalStorageByUrl=function(){},this.handleReceivedSourceTypeForUrl=function(){}):(t=JSON.parse(localStorage.getItem("fslightbox-types")))||(t={},this.getSourceTypeFromLocalStorageByUrl=r)}function L(e,t,n,o){var i=e.data,r=e.elements.sources,s=n/o,a=0;this.adjustSize=function(){if((a=i.maxSourceWidth/s)<i.maxSourceHeight)return n<i.maxSourceWidth&&(a=o),c();a=o>i.maxSourceHeight?i.maxSourceHeight:o,c()};var c=function(){r[t].style.width=a*s+"px",r[t].style.height=a+"px"}}function C(e,t){var n=this,o=e.collections.sourceSizers,i=e.elements,r=i.sourceAnimationWrappers,s=i.sourceMainWrappers,a=i.sources,c=e.resolve;function l(e,n){o[t]=c(L,[t,e,n]),o[t].adjustSize()}this.runActions=function(e,o){a[t].classList.add(x),r[t].classList.add(g),s[t].removeChild(s[t].firstChild),l(e,o),n.runActions=l}}function F(e,t){var n,o=this,i=e.elements.sources,r=e.props,s=(0,e.resolve)(C,[t]);this.handleImageLoad=function(e){var t=e.target,n=t.naturalWidth,o=t.naturalHeight;s.runActions(n,o)},this.handleVideoLoad=function(e){var t=e.target,o=t.videoWidth,i=t.videoHeight;n=!0,s.runActions(o,i)},this.handleNotMetaDatedVideoLoad=function(){n||o.handleYoutubeLoad()},this.handleYoutubeLoad=function(){var e=1920,t=1080;r.maxYoutubeDimensions&&(e=r.maxYoutubeDimensions.width,t=r.maxYoutubeDimensions.height),s.runActions(e,t)},this.handleCustomLoad=function(){setTimeout((function(){var e=i[t];s.runActions(e.offsetWidth,e.offsetHeight)}))}}function A(e,t,n){var o=e.elements.sources,i=e.props.customClasses,r=i[t]?i[t]:"";o[t].className=n+" "+r}function E(e,t){var n=e.elements.sources,o=e.props.customAttributes;for(var i in o[t])n[t].setAttribute(i,o[t][i])}function I(e,t){var n=e.collections.sourceLoadHandlers,o=e.elements,i=o.sources,r=o.sourceAnimationWrappers,s=e.props.sources;i[t]=document.createElement("img"),A(e,t,y),i[t].src=s[t],i[t].onload=n[t].handleImageLoad,E(e,t),r[t].appendChild(i[t])}function T(e,t){var n=e.collections.sourceLoadHandlers,o=e.elements,i=o.sources,r=o.sourceAnimationWrappers,s=e.props,a=s.sources,c=s.videosPosters;i[t]=document.createElement("video"),A(e,t,y),i[t].src=a[t],i[t].onloadedmetadata=function(e){n[t].handleVideoLoad(e)},i[t].controls=!0,E(e,t),c[t]&&(i[t].poster=c[t]);var l=document.createElement("source");l.src=a[t],i[t].appendChild(l),setTimeout(n[t].handleNotMetaDatedVideoLoad,3e3),r[t].appendChild(i[t])}function W(e,t){var n=e.collections.sourceLoadHandlers,o=e.elements,r=o.sources,s=o.sourceAnimationWrappers,a=e.props.sources;r[t]=document.createElement("iframe"),A(e,t,"".concat(y," ").concat(i,"youtube-iframe")),r[t].src="https://www.youtube.com/embed/".concat(a[t].match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/)[2]),r[t].allowFullscreen=!0,E(e,t),s[t].appendChild(r[t]),n[t].handleYoutubeLoad()}function N(e,t){var n=e.collections.sourceLoadHandlers,o=e.elements,i=o.sources,r=o.sourceAnimationWrappers,s=e.props.sources;i[t]=s[t],A(e,t,"".concat(i[t].className," ").concat(y)),r[t].appendChild(i[t]),n[t].handleCustomLoad()}function z(e,t){var n=e.elements,o=n.sources,r=n.sourceAnimationWrappers,s=n.sourceMainWrappers;e.props.sources;o[t]=document.createElement("div"),o[t].className="".concat(i,"invalid-file-wrapper ").concat(c),o[t].innerHTML="Invalid source",r[t].classList.add(g),r[t].appendChild(o[t]),s[t].removeChild(s[t].firstChild)}function M(e){var t=e.collections,n=t.sourceLoadHandlers,o=t.sourcesRenderFunctions,i=e.core.sourceDisplayFacade,r=e.resolve;this.runActionsForSourceTypeAndIndex=function(t,s){var a;switch("invalid"!==t&&(n[s]=r(F,[s])),t){case"image":a=I;break;case"video":a=T;break;case"youtube":a=W;break;case"custom":a=N;break;default:a=z}o[s]=function(){return a(e,s)},i.displaySourcesWhichShouldBeDisplayed()}}function H(){var e,t,n,o={isUrlYoutubeOne:function(e){var t=document.createElement("a");return t.href=e,"www.youtube.com"===t.hostname},getTypeFromResponseContentType:function(e){return e.slice(0,e.indexOf("/"))}};function i(){if(4!==n.readyState){if(2===n.readyState){var e;switch(o.getTypeFromResponseContentType(n.getResponseHeader("content-type"))){case"image":e="image";break;case"video":e="video";break;default:e="invalid"}n.onreadystatechange=null,n.abort(),t(e)}}else t("invalid")}this.setUrlToCheck=function(t){e=t},this.getSourceType=function(r){if(o.isUrlYoutubeOne(e))return r("youtube");t=r,(n=new XMLHttpRequest).onreadystatechange=i,n.open("GET",e,!0),n.send()}}function k(e,t,n){var o=e.props,i=o.types,r=o.type,s=o.sources,a=e.resolve;this.getTypeSetByClientForIndex=function(e){var t;return i&&i[e]?t=i[e]:r&&(t=r),t},this.retrieveTypeWithXhrForIndex=function(e){var o=a(H);o.setUrlToCheck(s[e]),o.getSourceType((function(o){t.handleReceivedSourceTypeForUrl(o,s[e]),n.runActionsForSourceTypeAndIndex(o,e)}))}}function O(e,t){var n=e.componentsServices.hideSourceLoaderIfNotYetCollection,o=e.elements,i=o.sourceWrappersContainer,r=o.sourceMainWrappers;r[t]=document.createElement("div"),r[t].className="".concat(d," ").concat(a," ").concat(c),r[t].innerHTML='<div class="fslightbox-loader"><div></div><div></div><div></div><div></div></div>';var s=r[t].firstChild;n[t]=function(){r[t].contains(s)&&r[t].removeChild(s)},i.appendChild(r[t]),function(e,t){var n=e.elements,o=n.sourceMainWrappers,i=n.sourceAnimationWrappers;i[t]=document.createElement("div"),o[t].appendChild(i[t])}(e,t)}function R(e,t,n,o){var r=document.createElementNS("http://www.w3.org/2000/svg","svg");r.setAttributeNS(null,"width",t),r.setAttributeNS(null,"height",t),r.setAttributeNS(null,"viewBox",n);var s=document.createElementNS("http://www.w3.org/2000/svg","path");return s.setAttributeNS(null,"class","".concat(i,"svg-path")),s.setAttributeNS(null,"d",o),r.appendChild(s),e.appendChild(r),r}function D(e,t){var n=document.createElement("div");return n.className="".concat(i,"toolbar-button ").concat(c),n.title=t,e.appendChild(n),n}function j(e,t){var n=document.createElement("div");n.className="".concat(i,"toolbar"),t.appendChild(n),function(e,t){var n=e.componentsServices,o=e.core.fullscreenToggler,i=e.data,r="M4.5 11H3v4h4v-1.5H4.5V11zM3 7h1.5V4.5H7V3H3v4zm10.5 6.5H11V15h4v-4h-1.5v2.5zM11 3v1.5h2.5V7H15V3h-4z",s=D(t);s.title="Enter fullscreen";var a=R(s,"20px","0 0 18 18",r);n.enterFullscreen=function(){i.isFullscreenOpen=!0,s.title="Exit fullscreen",a.setAttributeNS(null,"width","24px"),a.setAttributeNS(null,"height","24px"),a.setAttributeNS(null,"viewBox","0 0 950 1024"),a.firstChild.setAttributeNS(null,"d","M682 342h128v84h-212v-212h84v128zM598 810v-212h212v84h-128v128h-84zM342 342v-128h84v212h-212v-84h128zM214 682v-84h212v212h-84v-128h-128z")},n.exitFullscreen=function(){i.isFullscreenOpen=!1,s.title="Enter fullscreen",a.setAttributeNS(null,"width","20px"),a.setAttributeNS(null,"height","20px"),a.setAttributeNS(null,"viewBox","0 0 18 18"),a.firstChild.setAttributeNS(null,"d",r)},s.onclick=function(){i.isFullscreenOpen?o.exitFullscreen():o.enterFullscreen()}}(e,n),function(e,t){var n=D(t,"Close");n.onclick=e.core.lightboxCloser.closeLightbox,R(n,"20px","0 0 24 24","M 4.7070312 3.2929688 L 3.2929688 4.7070312 L 10.585938 12 L 3.2929688 19.292969 L 4.7070312 20.707031 L 12 13.414062 L 19.292969 20.707031 L 20.707031 19.292969 L 13.414062 12 L 20.707031 4.7070312 L 19.292969 3.2929688 L 12 10.585938 L 4.7070312 3.2929688 z")}(e,n)}function P(e){var t=e.props.sources,n=e.elements.container,o=document.createElement("div");o.className="".concat(i,"nav"),n.appendChild(o),j(e,o),t.length>1&&function(e,t){var n=e.componentsServices,o=e.props.sources,r=(e.stageIndexes,document.createElement("div"));r.className="".concat(i,"slide-number-container");var s=document.createElement("div");s.className=c;var a=document.createElement("span");n.setSlideNumber=function(e){return a.innerHTML=e};var l=document.createElement("span");l.className="".concat(i,"slash");var u=document.createElement("div");u.innerHTML=o.length,r.appendChild(s),s.appendChild(a),s.appendChild(l),s.appendChild(u),t.appendChild(r),setTimeout((function(){s.offsetWidth>55&&(r.style.justifyContent="flex-start")}))}(e,o)}function X(e,t){var n=this,o=e.elements.sourceMainWrappers,i=e.props,r=0;this.byValue=function(e){return r=e,n},this.negative=function(){s(-a())},this.zero=function(){s(0)},this.positive=function(){s(a())};var s=function(e){o[t].style.transform="translateX(".concat(e+r,"px)"),r=0},a=function(){return(1+i.slideDistance)*innerWidth}}function B(e,t,n,o){var i=e.elements.container,r=n.charAt(0).toUpperCase()+n.slice(1),s=document.createElement("div");s.className="".concat(f," ").concat(f,"-").concat(n),s.title="".concat(r," slide"),s.onclick=t,function(e,t){var n=document.createElement("div");n.className="".concat(p," ").concat(c),R(n,"20px","0 0 20 20",t),e.appendChild(n)}(s,o),i.appendChild(s)}function U(e,t){var n=e.classList;n.contains(t)&&n.remove(t)}function V(e){var t=this,n=e.core,o=n.eventsDispatcher,i=n.fullscreenToggler,r=n.globalEventsController,s=n.scrollbarRecompensor,a=e.data,c=e.elements,u=e.props,d=e.slideSwipingProps;this.isLightboxFadingOut=!1,this.runActions=function(){t.isLightboxFadingOut=!0,c.container.classList.add(v),r.removeListeners(),u.exitFullscreenOnClose&&a.isFullscreenOpen&&i.exitFullscreen(),setTimeout((function(){t.isLightboxFadingOut=!1,d.isSwiping=!1,c.container.classList.remove(v),document.documentElement.classList.remove(l),s.removeRecompense(),document.body.removeChild(c.container),o.dispatch("onClose")}),220)}}function Y(e){var t,n,o,i=e.collections.sourceMainWrappersTransformers,r=e.componentsServices,s=e.core,a=s.classFacade,c=s.slideIndexChanger,l=s.sourceDisplayFacade,d=s.stageManager,p=e.elements.sourceAnimationWrappers,f=e.stageIndexes,v=(t=function(){a.removeFromEachElementClassIfContains("sourceAnimationWrappers",m)},n=250,o=[],function(){o.push(!0),setTimeout((function(){o.pop(),o.length||t()}),n)});c.changeTo=function(e){f.current=e,d.updateStageIndexes(),r.setSlideNumber(e+1),l.displaySourcesWhichShouldBeDisplayed()},c.jumpTo=function(e){var t=f.current;c.changeTo(e),a.removeFromEachElementClassIfContains("sourceMainWrappers",u),U(p[t],g),U(p[t],h),p[t].classList.add(m),U(p[e],g),U(p[e],m),p[e].classList.add(h),v(),i[e].zero(),setTimeout((function(){t!==f.current&&i[t].negative()}),220)}}function q(e){return e.touches?e.touches[0].clientX:e.clientX}function _(e){var t=e.core,n=t.lightboxCloser,o=t.fullscreenToggler,i=t.slideChangeFacade;this.listener=function(e){switch(e.key){case"Escape":n.closeLightbox();break;case"ArrowLeft":i.changeToPrevious();break;case"ArrowRight":i.changeToNext();break;case"F11":e.preventDefault(),o.enterFullscreen()}}}function J(e){var t=e.collections.sourceMainWrappersTransformers,n=e.elements,o=e.slideSwipingProps,i=e.stageIndexes;this.runActionsForEvent=function(e){var t,a,c;n.container.contains(n.slideSwipingHoverer)||n.container.appendChild(n.slideSwipingHoverer),t=n.container,a=s,(c=t.classList).contains(a)||c.add(a),o.swipedX=q(e)-o.downClientX,r(i.current,"zero"),void 0!==i.previous&&o.swipedX>0?r(i.previous,"negative"):void 0!==i.next&&o.swipedX<0&&r(i.next,"positive")};var r=function(e,n){t[e].byValue(o.swipedX)[n]()}}function G(e){var t,n=e.props.sources,o=e.resolve,i=e.slideSwipingProps,r=o(J),s=(t=!1,function(){return!t&&(t=!0,requestAnimationFrame((function(){t=!1})),!0)});1===n.length?this.listener=function(){i.swipedX=1}:this.listener=function(e){i.isSwiping&&s()&&r.runActionsForEvent(e)}}function $(e){var t=e.collections.sourceMainWrappersTransformers,n=e.core.slideIndexChanger,o=e.elements.sourceMainWrappers,i=e.stageIndexes;this.runPositiveSwipedXActions=function(){void 0===i.previous||(r("positive"),n.changeTo(i.previous)),r("zero")},this.runNegativeSwipedXActions=function(){void 0===i.next||(r("negative"),n.changeTo(i.next)),r("zero")};var r=function(e){o[i.current].classList.add(u),t[i.current][e]()}}function K(e,t){e.contains(t)&&e.removeChild(t)}function Q(e){var t=e.core.lightboxCloser,n=e.elements,o=e.resolve,i=e.slideSwipingProps,r=o($);this.runNoSwipeActions=function(){K(n.container,n.slideSwipingHoverer),i.isSourceDownEventTarget||t.closeLightbox(),i.isSwiping=!1},this.runActions=function(){i.swipedX>0?r.runPositiveSwipedXActions():r.runNegativeSwipedXActions(),K(n.container,n.slideSwipingHoverer),n.container.classList.remove(s),i.isSwiping=!1}}function Z(e){var t=e.resolve,n=e.slideSwipingProps,o=t(Q);this.listener=function(){n.isSwiping&&(n.swipedX?o.runActions():o.runNoSwipeActions())}}function ee(e){var t,n,o;n=(t=e).core.classFacade,o=t.elements,n.removeFromEachElementClassIfContains=function(e,t){for(var n=0;n<o[e].length;n++)U(o[e][n],t)},function(e){var t=e.core.eventsDispatcher,n=e.props;t.dispatch=function(e){n[e]&&n[e]()}}(e),function(e){var t=e.componentsServices,n=e.core.fullscreenToggler;n.enterFullscreen=function(){t.enterFullscreen();var e=document.documentElement;e.requestFullscreen?e.requestFullscreen():e.mozRequestFullScreen?e.mozRequestFullScreen():e.webkitRequestFullscreen?e.webkitRequestFullscreen():e.msRequestFullscreen&&e.msRequestFullscreen()},n.exitFullscreen=function(){t.exitFullscreen(),document.exitFullscreen?document.exitFullscreen():document.mozCancelFullScreen?document.mozCancelFullScreen():document.webkitExitFullscreen?document.webkitExitFullscreen():document.msExitFullscreen&&document.msExitFullscreen()}}(e),function(e){var t=e.core,n=t.globalEventsController,o=t.windowResizeActioner,i=e.resolve,r=i(_),s=i(G),a=i(Z);n.attachListeners=function(){document.addEventListener("mousemove",s.listener),document.addEventListener("touchmove",s.listener,{passive:!0}),document.addEventListener("mouseup",a.listener),document.addEventListener("touchend",a.listener,{passive:!0}),addEventListener("resize",o.runActions),document.addEventListener("keydown",r.listener)},n.removeListeners=function(){document.removeEventListener("mousemove",s.listener),document.removeEventListener("touchmove",s.listener),document.removeEventListener("mouseup",a.listener),document.removeEventListener("touchend",a.listener),removeEventListener("resize",o.runActions),document.removeEventListener("keydown",r.listener)}}(e),function(e){var t=e.core.lightboxCloser,n=(0,e.resolve)(V);t.closeLightbox=function(){n.isLightboxFadingOut||n.runActions()}}(e),ne(e),function(e){var t=e.data,n=e.core.scrollbarRecompensor;n.addRecompense=function(){"complete"===document.readyState?o():addEventListener("load",(function(){o(),n.addRecompense=o}))};var o=function(){document.body.offsetHeight>innerHeight&&(document.body.style.marginRight=t.scrollbarWidth+"px")};n.removeRecompense=function(){document.body.style.removeProperty("margin-right")}}(e),function(e){var t=e.core,n=t.slideChangeFacade,o=t.slideIndexChanger,i=t.stageManager;e.props.sources.length>1?(n.changeToPrevious=function(){o.jumpTo(i.getPreviousSlideIndex())},n.changeToNext=function(){o.jumpTo(i.getNextSlideIndex())}):(n.changeToPrevious=function(){},n.changeToNext=function(){})}(e),Y(e),function(e){var t=e.core,n=t.classFacade,o=t.slideSwipingDown,i=e.elements.sources,r=e.slideSwipingProps,s=e.stageIndexes;o.listener=function(e){r.isSwiping=!0,r.downClientX=q(e),r.swipedX=0,"VIDEO"===e.target.tagName||e.touches||e.preventDefault();var t=i[s.current];t&&t.contains(e.target)?r.isSourceDownEventTarget=!0:r.isSourceDownEventTarget=!1,n.removeFromEachElementClassIfContains("sourceMainWrappers",u)}}(e),function(e){var t=e.collections.sourcesRenderFunctions,n=e.core.sourceDisplayFacade,o=e.props,i=e.stageIndexes;function r(e){t[e]&&(t[e](),delete t[e])}n.displaySourcesWhichShouldBeDisplayed=function(){if(o.loadOnlyCurrentSource)r(i.current);else for(var e in i)r(i[e])}}(e),function(e){var t=e.stageIndexes,n=e.core.stageManager,o=e.props.sources.length-1;n.getPreviousSlideIndex=function(){return 0===t.current?o:t.current-1},n.getNextSlideIndex=function(){return t.current===o?0:t.current+1},n.updateStageIndexes=0===o?function(){}:1===o?function(){0===t.current?(t.next=1,delete t.previous):(t.previous=0,delete t.next)}:function(){t.previous=n.getPreviousSlideIndex(),t.next=n.getNextSlideIndex()},n.isSourceInStage=o<=2?function(){return!0}:function(e){var n=t.current;if(0===n&&e===o||n===o&&0===e)return!0;var i=n-e;return-1===i||0===i||1===i}}(e),function(e){var t=e.collections,n=t.sourceMainWrappersTransformers,o=t.sourceSizers,i=e.core.windowResizeActioner,r=e.data,s=e.elements.sourceMainWrappers,a=e.props,c=e.stageIndexes;i.runActions=function(){innerWidth<992?r.maxSourceWidth=innerWidth:r.maxSourceWidth=.9*innerWidth,r.maxSourceHeight=.9*innerHeight;for(var e=0;e<a.sources.length;e++)U(s[e],u),e!==c.current&&n[e].negative(),o[e]&&o[e].adjustSize()}}(e)}function te(e){var t=e.core.eventsDispatcher,n=e.data,o=e.elements,r=e.props.sources;n.isInitialized=!0,function(e){for(var t=e.collections.sourceMainWrappersTransformers,n=e.props.sources,o=e.resolve,i=0;i<n.length;i++)t[i]=o(X,[i])}(e),ee(e),o.container=document.createElement("div"),o.container.className="".concat(i,"container ").concat(a," ").concat(g),function(e){var t=e.elements;t.slideSwipingHoverer=document.createElement("div"),t.slideSwipingHoverer.className="".concat(i,"slide-swiping-hoverer ").concat(a," ").concat(d)}(e),P(e),function(e){var t=e.core.slideSwipingDown,n=e.elements,o=e.props.sources;n.sourceWrappersContainer=document.createElement("div"),n.sourceWrappersContainer.className="".concat(d," ").concat(a),n.container.appendChild(n.sourceWrappersContainer),n.sourceWrappersContainer.addEventListener("mousedown",t.listener),n.sourceWrappersContainer.addEventListener("touchstart",t.listener,{passive:!0});for(var i=0;i<o.length;i++)O(e,i)}(e),r.length>1&&function(e){var t=e.core.slideChangeFacade;B(e,t.changeToPrevious,"previous","M18.271,9.212H3.615l4.184-4.184c0.306-0.306,0.306-0.801,0-1.107c-0.306-0.306-0.801-0.306-1.107,0L1.21,9.403C1.194,9.417,1.174,9.421,1.158,9.437c-0.181,0.181-0.242,0.425-0.209,0.66c0.005,0.038,0.012,0.071,0.022,0.109c0.028,0.098,0.075,0.188,0.142,0.271c0.021,0.026,0.021,0.061,0.045,0.085c0.015,0.016,0.034,0.02,0.05,0.033l5.484,5.483c0.306,0.307,0.801,0.307,1.107,0c0.306-0.305,0.306-0.801,0-1.105l-4.184-4.185h14.656c0.436,0,0.788-0.353,0.788-0.788S18.707,9.212,18.271,9.212z"),B(e,t.changeToNext,"next","M1.729,9.212h14.656l-4.184-4.184c-0.307-0.306-0.307-0.801,0-1.107c0.305-0.306,0.801-0.306,1.106,0l5.481,5.482c0.018,0.014,0.037,0.019,0.053,0.034c0.181,0.181,0.242,0.425,0.209,0.66c-0.004,0.038-0.012,0.071-0.021,0.109c-0.028,0.098-0.075,0.188-0.143,0.271c-0.021,0.026-0.021,0.061-0.045,0.085c-0.015,0.016-0.034,0.02-0.051,0.033l-5.483,5.483c-0.306,0.307-0.802,0.307-1.106,0c-0.307-0.305-0.307-0.801,0-1.105l4.184-4.185H1.729c-0.436,0-0.788-0.353-0.788-0.788S1.293,9.212,1.729,9.212z")}(e),function(e){for(var t=e.props.sources,n=e.resolve,o=n(w),i=n(M),r=n(k,[o,i]),s=0;s<t.length;s++)if("string"==typeof t[s]){var a=r.getTypeSetByClientForIndex(s);if(a)i.runActionsForSourceTypeAndIndex(a,s);else{var c=o.getSourceTypeFromLocalStorageByUrl(t[s]);c?i.runActionsForSourceTypeAndIndex(c,s):r.retrieveTypeWithXhrForIndex(s)}}else i.runActionsForSourceTypeAndIndex("custom",s)}(e),t.dispatch("onInit")}function ne(e){var t=e.collections.sourceMainWrappersTransformers,n=e.componentsServices,o=e.core,i=o.eventsDispatcher,r=o.lightboxOpener,s=o.globalEventsController,a=o.scrollbarRecompensor,c=o.sourceDisplayFacade,u=o.stageManager,d=o.windowResizeActioner,p=e.data,f=e.elements,h=e.stageIndexes;r.open=function(){var o=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;h.current=o,p.isInitialized?i.dispatch("onShow"):te(e),u.updateStageIndexes(),c.displaySourcesWhichShouldBeDisplayed(),n.setSlideNumber(o+1),document.body.appendChild(f.container),document.documentElement.classList.add(l),a.addRecompense(),s.attachListeners(),d.runActions(),t[h.current].zero(),i.dispatch("onOpen")}}function oe(){var e=localStorage.getItem("fslightbox-scrollbar-width");if(e)return e;var t=function(){var e=document.createElement("div"),t=e.style;return t.visibility="hidden",t.width="100px",t.msOverflowStyle="scrollbar",t.overflow="scroll",e}(),n=function(){var e=document.createElement("div");return e.style.width="100%",e}();document.body.appendChild(t);var o=t.offsetWidth;t.appendChild(n);var i=n.offsetWidth;document.body.removeChild(t);var r=o-i;return localStorage.setItem("fslightbox-scrollbar-width",r.toString()),r}function ie(e,t,n){return(ie=re()?Reflect.construct:function(e,t,n){var o=[null];o.push.apply(o,t);var i=new(Function.bind.apply(e,o));return n&&se(i,n.prototype),i}).apply(null,arguments)}function re(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}function se(e,t){return(se=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function ae(e){return function(e){if(Array.isArray(e))return ce(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||function(e,t){if(!e)return;if("string"==typeof e)return ce(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return ce(e,t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function ce(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,o=new Array(t);n<t;n++)o[n]=e[n];return o}function le(){for(var e=document.getElementsByTagName("a"),t=function(t){if(!e[t].hasAttribute("data-fslightbox"))return"continue";var n=e[t].getAttribute("data-fslightbox"),o=e[t].getAttribute("href");fsLightboxInstances[n]||(fsLightboxInstances[n]=new FsLightbox);var i=null;i="#"===o.charAt(0)?document.getElementById(o.substring(1)):o,fsLightboxInstances[n].props.sources.push(i),fsLightboxInstances[n].elements.a.push(e[t]);var r=fsLightboxInstances[n].props.sources.length-1;e[t].onclick=function(e){e.preventDefault(),fsLightboxInstances[n].open(r)},d("types","data-type"),d("videosPosters","data-video-poster"),d("customClasses","data-class"),d("customClasses","data-custom-class");for(var s=["href","data-fslightbox","data-type","data-video-poster","data-class","data-custom-class"],a=e[t].attributes,c=fsLightboxInstances[n].props.customAttributes,l=0;l<a.length;l++)if(-1===s.indexOf(a[l].name)&&"data-"===a[l].name.substr(0,5)){c[r]||(c[r]={});var u=a[l].name.substr(5);c[r][u]=a[l].value}function d(o,i){e[t].hasAttribute(i)&&(fsLightboxInstances[n].props[o][r]=e[t].getAttribute(i))}},n=0;n<e.length;n++)t(n);var o=Object.keys(fsLightboxInstances);window.fsLightbox=fsLightboxInstances[o[o.length-1]]}window.FsLightbox=function(){var e=this;this.props={sources:[],customAttributes:[],customClasses:[],types:[],videosPosters:[],slideDistance:.3},this.data={isInitialized:!1,maxSourceWidth:0,maxSourceHeight:0,scrollbarWidth:oe(),isFullscreenOpen:!1},this.slideSwipingProps={isSwiping:!1,downClientX:null,isSourceDownEventTarget:!1,swipedX:0},this.stageIndexes={},this.elements={a:[],container:null,slideSwipingHoverer:null,sourceWrappersContainer:null,sources:[],sourceMainWrappers:[],sourceAnimationWrappers:[]},this.componentsServices={enterFullscreen:null,exitFullscreen:null,hideSourceLoaderIfNotYetCollection:[],setSlideNumber:function(){}},this.resolve=function(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[];return n.unshift(e),ie(t,ae(n))},this.collections={sourceMainWrappersTransformers:[],sourceLoadHandlers:[],sourcesRenderFunctions:[],sourceSizers:[]},this.core={classFacade:{},eventsDispatcher:{},fullscreenToggler:{},globalEventsController:{},lightboxCloser:{},lightboxOpener:{},lightboxUpdater:{},scrollbarRecompensor:{},slideChangeFacade:{},slideIndexChanger:{},slideSwipingDown:{},sourceDisplayFacade:{},stageManager:{},windowResizeActioner:{}},ne(this),this.open=function(t){return e.core.lightboxOpener.open(t)},this.close=function(){return e.core.lightboxCloser.closeLightbox()}},window.fsLightboxInstances={},le(),window.refreshFsLightbox=function(){for(var e in fsLightboxInstances){var t=fsLightboxInstances[e].props;fsLightboxInstances[e]=new FsLightbox,fsLightboxInstances[e].props=t,fsLightboxInstances[e].props.sources=[],fsLightboxInstances[e].elements.a=[]}le()}}])}));;
'use strict'

if ((document.body.clientWidth > 992)) {
   let introSlider = new Swiper('.intro-slider__container', {
      navigation: {
         nextEl: '.intro-slider__button-next',
         prevEl: '.intro-slider__button-prev',
      },

      loop: true,

      slidesPerView: 'auto',

      speed: 1200,

      autoplay: {
         delay: 7000,
      },

      effect: 'slide',

   })
} else {
   let introSlider = new Swiper('.intro-slider__container', {
      navigation: {
         nextEl: '.intro-slider__button-next',
         prevEl: '.intro-slider__button-prev',
      },

      loop: true,

      slidesPerView: 'auto',

      speed: 1200,

      autoplay: {
         delay: 7000,
      },

      effect: 'fade',

      fadeEffect: {
         crossFade: true
      },

   })
}

;
'use strict'

let typesSlider = new Swiper('.types-slider__container', {
   navigation: {
      nextEl: '.types-slider__button-next',
      prevEl: '.types-slider__button-prev',
   },

   // loop: true,

   slidesPerView: 'auto',

   speed: 1000,

   autoHeight: true,

   grabCursor: true,

   scrollbar: {
      el: ".types-slider__scrollbar",
      draggable: true,
   },
})
;

if (document.querySelector('.projects__sliders')) {

   let projectsSubSlider = new Swiper('.projects-subslider', {

      scrollbar: {
         el: ".projects-subslider__scrollbar",
      },

      slidesPerView: 'auto',

      spaceBetween: 100,

      speed: 700,

      resistanceRatio: 0,

      centeredSlides: 'true',

      loop: 'true',

      breakpoints: {
         320: {
            spaceBetween: 50,
         },
         487: {
            spaceBetween: 100,
         }
      }

   })

   let projectsMainSlider = new Swiper('.projects-mainslider', {

      navigation: {
         nextEl: '.projects-mainslider__button-next',
         prevEl: '.projects-mainslider__button-prev',
      },

      thumbs: {
         swiper: projectsSubSlider,
      },

      speed: 700,

      autoHeight: true,

      effect: 'fade',

      fadeEffect: {
         crossFade: true
      },

      loop: 'true',
   })


   // логика перехода к слайдам при клике, учитывая loop
   document.querySelector('.projects-subslider__wrapper').onclick = (event) => {
      if (event.target.closest('div').classList.contains('swiper-slide')) {
         projectsSubSlider.slideToLoop(Number(event.target.closest('div').dataset.swiperSlideIndex))
      }
   }

   document.querySelector('.projects-mainslider__button-prev').onclick = () => {
      projectsSubSlider.slideToLoop(Number(document.querySelector('.swiper-slide-thumb-active').dataset.swiperSlideIndex))
   }

   document.querySelector('.projects-mainslider__button-next').onclick = () => {
      projectsSubSlider.slideToLoop(Number(document.querySelector('.swiper-slide-thumb-active').dataset.swiperSlideIndex))
   }
};
'use strict'

let catalogSlider = new Swiper('.catalog-slider', {
   navigation: {
      nextEl: '.catalog-slider__button-next',
      prevEl: '.catalog-slider__button-prev',
   },

   scrollbar: {
      el: ".catalog-slider__scrollbar",
   },

   slidesPerView: 'auto',

   speed: 1500,

   autoHeight: true,

   spaceBetween: 30,

   centeredSlides: 'true',

   loop: 'true',
})
;

if (document.querySelector('.main-page')) {

   function offset(el) {
      const rect = el.getBoundingClientRect(),
         scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
         scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
   }

   // логика работы счетчиков
   let statCounter = () => {

      let statTop = offset(document.querySelector('.statistics')).top;

      let startSatistics = () => {
         let statisticsYear = document.querySelector('.statistics-item__numb-year')
         let statisticsProject = document.querySelector('.statistics-item__numb-project')
         let statisticsTechnique = document.querySelector('.statistics-item__numb-technique')

         let statisticsYearInterval = setInterval(() => {
            statisticsYear.textContent = Number(statisticsYear.textContent) + 1;
            if (statisticsYear.textContent == '20') { clearInterval(statisticsYearInterval) }
         }, 100)

         let statisticsProjectInterval = setInterval(() => {
            statisticsProject.textContent = Number(statisticsProject.textContent) + 10;
            if (statisticsProject.textContent == '1000') {
               clearInterval(statisticsProjectInterval)
               statisticsProject.textContent += '+'
            }
         }, 20)

         let statisticsTechniqueInterval = setInterval(() => {
            statisticsTechnique.textContent = Number(statisticsTechnique.textContent) + 1;
            if (statisticsTechnique.textContent == '20') {
               clearInterval(statisticsTechniqueInterval)
               statisticsTechnique.textContent += '+'
            }
         }, 100)
      }

      //при показе блока со счетчиками на экране, запуск анимации и удаление обработчика
      if (window.pageYOffset >= statTop - window.innerHeight + document.querySelector('.statistics').offsetHeight) {
         startSatistics()
         window.removeEventListener('scroll', statCounter)
      }
   }

   // логика с анимацией элементов при показе их на странице
   let animateElem = () => {
      let deliveryTop = offset(document.querySelector('.delivery__container')).top;

      if (window.pageYOffset >= deliveryTop - window.innerHeight + document.querySelector('.delivery__container').offsetHeight) {
         document.querySelector('.delivery__container').classList.add('_active')
         window.removeEventListener('scroll', animateElem)
      }
   }

   window.addEventListener('scroll', statCounter)

   window.addEventListener('scroll', animateElem)

};

// логика чекбоксов в parametres__types
if (document.querySelector('.filter-tonnage__slider')) {
   document.querySelector('.parametres__types').onchange = (event) => {

      let currentElem = event.target.parentNode;

      if (event.target.getAttribute('type') == 'checkbox') {

         if (!currentElem.classList.contains('_active')) {
            currentElem.classList.add('_active')

         } else if (currentElem.classList.contains('_active')) {
            currentElem.classList.remove('_active')
         }
      }
   }
}

// =====================================================================================================//

// слайдеры noUiSlider, проверяем на наличие на странице и дальше логика
if (document.querySelector('.filter-tonnage__slider')) {
   var tonnageFilter = document.querySelector('.filter-tonnage__slider');

   noUiSlider.create(tonnageFilter, {
      start: [40, 750],

      //цифровые подсказки под ползунками
      // tooltips: [true, true],
      connect: true,
      range: {
         'min': [40],
         'max': [750],
      },
      snap: true,
      range: {
         'min': 40,
         '6%': 50,
         '12%': 65,
         '17%': 68,
         '21%': 70,
         '24%': 82.5,
         '28%': 84,
         '32%': 85,
         '35%': 90,
         '39%': 93.8,
         '43%': 95,
         '48%': 112.5,
         '53%': 120,
         '58%': 131.6,
         '62%': 150,
         '67%': 160,
         '72%': 200,
         '76%': 250,
         '80%': 280,
         '85%': 300,
         '89%': 350,
         '92%': 400,
         '96%': 500,
         'max': 750,
      },
      // изменяет значения tooltop'ов с дробных на целые числа
      format: {
         from: function (value) {
            return Math.round(value);
         },
         to: function (value) {
            return Math.round(value);
         }
      }
   })

   // при вводе в инпуте мы меняем значение в ползунке
   document.querySelector('.filter-tonnage__input-1').onkeyup = () => {
      tonnageFilter.noUiSlider.set([document.querySelector('.filter-tonnage__input-1').value, null])
   }
   document.querySelector('.filter-tonnage__input-2').onkeyup = () => {
      tonnageFilter.noUiSlider.set([null, document.querySelector('.filter-tonnage__input-2').value])
   }

   // в массиве значения ползунков в price-filter
   let filterTooltip = document.querySelectorAll('.filter-tonnage .noUi-handle')

   // при изменении значения в ползунке в price-filter, меняется значения инпутов ниже
   let mutateToolStart = new MutationObserver(() => {
      document.querySelector(`.filter-tonnage__input-1`).value = filterTooltip[0].getAttribute('aria-valuetext');
   });
   mutateToolStart.observe(filterTooltip[0], { attributes: true });

   let mutateToolEnd = new MutationObserver(() => {
      document.querySelector(`.filter-tonnage__input-2`).value = filterTooltip[1].getAttribute('aria-valuetext');
   });
   mutateToolEnd.observe(filterTooltip[1], { attributes: true });
}

if (document.querySelector('.filter-lifting__slider')) {
   var liftingFilter = document.querySelector('.filter-lifting__slider');

   noUiSlider.create(liftingFilter, {
      start: [40, 750],

      //цифровые подсказки под ползунками
      // tooltips: [true, true],
      connect: true,
      range: {
         'min': [40],
         'max': [750],
      },
      snap: true,
      range: {
         'min': 40,
         '6%': 50,
         '12%': 65,
         '17%': 68,
         '21%': 70,
         '24%': 82.5,
         '28%': 84,
         '32%': 85,
         '35%': 90,
         '39%': 93.8,
         '43%': 95,
         '48%': 112.5,
         '53%': 120,
         '58%': 131.6,
         '62%': 150,
         '67%': 160,
         '72%': 200,
         '76%': 250,
         '80%': 280,
         '85%': 300,
         '89%': 350,
         '92%': 400,
         '96%': 500,
         'max': 750,
      },
      // изменяет значения tooltop'ов с дробных на целые числа
      format: {
         from: function (value) {
            return Math.round(value);
         },
         to: function (value) {
            return Math.round(value);
         }
      }
   })

   // при вводе в инпуте мы меняем значение в ползунке
   document.querySelector('.filter-lifting__input-1').onkeyup = () => {
      liftingFilter.noUiSlider.set([document.querySelector('.filter-lifting__input-1').value, null])
   }
   document.querySelector('.filter-lifting__input-2').onkeyup = () => {
      liftingFilter.noUiSlider.set([null, document.querySelector('.filter-lifting__input-2').value])
   }

   // в массиве значения ползунков в price-filter
   let filterTooltip = document.querySelectorAll('.filter-lifting .noUi-handle')

   // при изменении значения в ползунке в price-filter, меняется значения инпутов ниже
   let mutateToolStart = new MutationObserver(() => {
      document.querySelector(`.filter-lifting__input-1`).value = filterTooltip[0].getAttribute('aria-valuetext');
   });
   mutateToolStart.observe(filterTooltip[0], { attributes: true });

   let mutateToolEnd = new MutationObserver(() => {
      document.querySelector(`.filter-lifting__input-2`).value = filterTooltip[1].getAttribute('aria-valuetext');
   });
   mutateToolEnd.observe(filterTooltip[1], { attributes: true });
}

if (document.querySelector('.filter-departure__slider')) {
   var departureFilter = document.querySelector('.filter-departure__slider');

   noUiSlider.create(departureFilter, {
      start: [40, 750],

      //цифровые подсказки под ползунками
      // tooltips: [true, true],
      connect: true,
      range: {
         'min': [40],
         'max': [750],
      },
      snap: true,
      range: {
         'min': 40,
         '6%': 50,
         '12%': 65,
         '17%': 68,
         '21%': 70,
         '24%': 82.5,
         '28%': 84,
         '32%': 85,
         '35%': 90,
         '39%': 93.8,
         '43%': 95,
         '48%': 112.5,
         '53%': 120,
         '58%': 131.6,
         '62%': 150,
         '67%': 160,
         '72%': 200,
         '76%': 250,
         '80%': 280,
         '85%': 300,
         '89%': 350,
         '92%': 400,
         '96%': 500,
         'max': 750,
      },
      // изменяет значения tooltop'ов с дробных на целые числа
      format: {
         from: function (value) {
            return Math.round(value);
         },
         to: function (value) {
            return Math.round(value);
         }
      }
   })

   // при вводе в инпуте мы меняем значение в ползунке
   document.querySelector('.filter-departure__input-1').onkeyup = () => {
      departureFilter.noUiSlider.set([document.querySelector('.filter-departure__input-1').value, null])
   }
   document.querySelector('.filter-departure__input-2').onkeyup = () => {
      departureFilter.noUiSlider.set([null, document.querySelector('.filter-departure__input-2').value])
   }

   // в массиве значения ползунков в price-filter
   let filterTooltip = document.querySelectorAll('.filter-departure .noUi-handle')

   // при изменении значения в ползунке в price-filter, меняется значения инпутов ниже
   let mutateToolStart = new MutationObserver(() => {
      document.querySelector(`.filter-departure__input-1`).value = filterTooltip[0].getAttribute('aria-valuetext');
   });
   mutateToolStart.observe(filterTooltip[0], { attributes: true });

   let mutateToolEnd = new MutationObserver(() => {
      document.querySelector(`.filter-departure__input-2`).value = filterTooltip[1].getAttribute('aria-valuetext');
   });
   mutateToolEnd.observe(filterTooltip[1], { attributes: true });
}

//======================================================================================================//

// проверяем на наличие фильтра на странице + логика работы аккордионов
if (document.querySelector('.ingenierie__body')) {
   // собирает кнопки в section-filter, которые при активации показыают section-filter__body
   let sectionsFilterShow = document.querySelectorAll('.ingenierie__section');

   // навешиваем  выбранному section-filter класс _active
   for (let i of sectionsFilterShow) {
      i.onclick = (event) => {
         if (event.target.closest('.ingenierie__section-header')) {
            if (event.target.closest('.ingenierie__section').classList.contains('_active')) {
               event.target.closest('.ingenierie__section').classList.remove('_active')
               return
            }

            for (let i of sectionsFilterShow) {
               if (i.getAttribute('class') == event.target.closest('.ingenierie__section').getAttribute('class')) {
                  i.classList.add('_active');
               } else { i.classList.remove('_active') }
            }
         }
      }
   }
}

//======================================================================================================//

//логика работы бургеров при ширине страницы меньше 860px
if (document.querySelector('.catalog__aside')) {
   let parametresBurger = (document.querySelector('.parametres__burger-icon'))
   let ingenierieBurger = (document.querySelector('.ingenierie__burger-icon'))

   parametresBurger.onclick = () => {
      if (!parametresBurger.closest('.parametres').classList.contains('_active')) {
         parametresBurger.closest('.parametres').classList.add('_active')
      } else {
         parametresBurger.closest('.parametres').classList.remove('_active')
      }
   }

   ingenierieBurger.onclick = () => {
      if (!ingenierieBurger.closest('.ingenierie').classList.contains('_active')) {
         ingenierieBurger.closest('.ingenierie').classList.add('_active')
      } else {
         ingenierieBurger.closest('.ingenierie').classList.remove('_active')
      }
   }
};
if (document.querySelector('.product-page')) {

   let productSubSlider = new Swiper('.product-subslider', {

      slidesPerView: 3,

      freeMode: true,

      spaceBetween: 40,

      speed: 700,

      resistanceRatio: 0,

      breakpoints: {
         320: {
            spaceBetween: 10,
         },
         550: {
            spaceBetween: 40,
         }
      }

   })

   let productMainSlider = new Swiper('.product-mainslider', {

      grabCursor: 'true',

      speed: 700,

      loop: true,

      thumbs: {
         swiper: productSubSlider,
      },
   })
};

if (document.querySelector('.product-page')) {

   tabsButtons = document.querySelectorAll('.product-page .tabs__button');
   tabsItems = document.querySelectorAll('.product-page .tabs__item');

   document.querySelector('.product-page .tabs__buttons').onclick = (event) => {
      if (event.target.classList.contains('tabs__button') && event.target.classList.contains('_active')) {
         return
      } else {
         tabsButtons.forEach((e, i) => {
            e.classList.remove('_active')
            tabsItems[i].classList.remove('_active')
         })
         event.target.classList.add('_active')
         tabsItems[event.target.dataset.tab].classList.add('_active')
      }
   }
};

let similarSlider = new Swiper('.similar-slider', {
   navigation: {
      nextEl: '.similar-slider__button-next',
      prevEl: '.similar-slider__button-prev',
   },

   scrollbar: {
      el: ".similar-slider__scrollbar",
   },

   slidesPerView: 3,

   speed: 1500,

   autoHeight: true,

   spaceBetween: 30,

   breakpoints: {
      320: {
         slidesPerView: 1,
      },
      600: {
         slidesPerView: 2,
      },
      992: {
         slidesPerView: 3,
      }
   },

   loop: 'true',
});
// запуск видео из ютуба при нажатии на картинку
if (document.querySelector('.about-page')) {
   let aboutVideo = document.querySelector('.about__content')
   document.querySelector('.about__img-container').onclick = () => {
      document.querySelector('.about__img-container').style.display = 'none';
      document.querySelector('.about__video').style.display = 'block';
      setTimeout(() => {
         aboutVideo.setAttribute('src', aboutVideo.src + 'autoplay=1')
      }, 1000)
   }
}

//=================================================================================================//
let documentSlider = new Swiper('.documents-slider__container', {
   navigation: {
      nextEl: '.documents-slider__button-next',
      prevEl: '.documents-slider__button-prev',
   },

   scrollbar: {
      el: ".documents-slider__scrollbar",
      draggable: true,
   },

   slidesPerView: 3,

   speed: 1500,

   autoHeight: true,

   spaceBetween: 30,

   breakpoints: {
      320: {
         slidesPerView: 2,
      },
      992: {
         slidesPerView: 3,
      }
   }

   // centeredSlides: 'true',

   // loop: 'true',


});


if (document.querySelector('.objects-page')) {
   // объект с данными подгружаемых статей
   let articlesData = {
      article_1: {
         id: 1,
         img: 'img/ARTICLE__IMG-1.jpg',
         text: 'Разгрузка и монтаж трансформатора автокраном LIEBHERR LTM1500',
         city: 'г.Туапсе'
      },
      article_2: {
         id: 2,
         img: 'img/ARTICLE__IMG-2.jpg',
         text: 'Погрузка, перевозка и разгрузка КТГ',
         city: 'г. Москва'
      },
      article_3: {
         id: 3,
         img: 'img/ARTICLE__IMG-3.jpg',
         text: 'Перевалка грузов кранами LIEBHERR LTM1500 и LIEBHERR LTM1400',
         city: 'порт Беседы'
      },
      article_4: {
         id: 4,
         img: 'img/ARTICLE__IMG-4.jpg',
         text: 'Разгрузка и монтаж трансформатора автокраном LIEBHERR LTM1500',
         city: 'г.Туапсе'
      },
      article_5: {
         id: 5,
         img: 'img/ARTICLE__IMG-5.jpg',
         text: 'Погрузка, перевозка и разгрузка КТГ',
         city: 'г. Москва'
      },
      article_6: {
         id: 6,
         img: 'img/ARTICLE__IMG-6.jpg',
         text: 'Перевалка грузов кранами LIEBHERR LTM1500 и LIEBHERR LTM1400',
         city: 'порт Беседы'
      },
      article_7: {
         id: 7,
         img: 'img/ARTICLE__IMG-1.jpg',
         text: 'Разгрузка и монтаж трансформатора автокраном LIEBHERR LTM1500',
         city: 'г.Туапсе'
      },
      article_8: {
         id: 8,
         img: 'img/ARTICLE__IMG-2.jpg',
         text: 'Погрузка, перевозка и разгрузка КТГ',
         city: 'г. Москва'
      },
      article_9: {
         id: 9,
         img: 'img/ARTICLE__IMG-3.jpg',
         text: 'Перевалка грузов кранами LIEBHERR LTM1500 и LIEBHERR LTM1400',
         city: 'порт Беседы'
      },
      article_10: {
         id: 10,
         img: 'img/ARTICLE__IMG-4.jpg',
         text: 'Разгрузка и монтаж трансформатора автокраном LIEBHERR LTM1500',
         city: 'г.Туапсе'
      },
      article_11: {
         id: 11,
         img: 'img/ARTICLE__IMG-5.jpg',
         text: 'Погрузка, перевозка и разгрузка КТГ',
         city: 'г. Москва'
      },
      article_12: {
         id: 12,
         img: 'img/ARTICLE__IMG-6.jpg',
         text: 'Перевалка грузов кранами LIEBHERR LTM1500 и LIEBHERR LTM1400',
         city: 'порт Беседы'
      },
      article_13: {
         id: 13,
         img: 'img/ARTICLE__IMG-1.jpg',
         text: 'Разгрузка и монтаж трансформатора автокраном LIEBHERR LTM1500',
         city: 'г.Туапсе'
      },
      article_14: {
         id: 14,
         img: 'img/ARTICLE__IMG-2.jpg',
         text: 'Погрузка, перевозка и разгрузка КТГ',
         city: 'г. Москва'
      },
      article_15: {
         id: 15,
         img: 'img/ARTICLE__IMG-3.jpg',
         text: 'Перевалка грузов кранами LIEBHERR LTM1500 и LIEBHERR LTM1400',
         city: 'порт Беседы'
      },
      article_16: {
         id: 16,
         img: 'img/ARTICLE__IMG-4.jpg',
         text: 'Разгрузка и монтаж трансформатора автокраном LIEBHERR LTM1500',
         city: 'г.Туапсе'
      },
      article_17: {
         id: 17,
         img: 'img/ARTICLE__IMG-5.jpg',
         text: 'Погрузка, перевозка и разгрузка КТГ',
         city: 'г. Москва'
      },
      article_18: {
         id: 18,
         img: 'img/ARTICLE__IMG-6.jpg',
         text: 'Перевалка грузов кранами LIEBHERR LTM1500 и LIEBHERR LTM1400',
         city: 'порт Беседы'
      },
   }

   let valueArticlesPage = 0;

   // изменяет значение нужного количества стартовых статей при разной ширине экрана
   if (document.body.clientWidth >= 830) {
      valueArticlesPage = 12;
   } else if ((document.body.clientWidth >= 600)) {
      valueArticlesPage = 9;
   } else if ((document.body.clientWidth >= 320)) {
      valueArticlesPage = 6;
   }

   // логика добавления статей в html
   if (valueArticlesPage != 0) {
      // console.log(Object.keys(articlesData).length)
      for (let i = 1; i <= valueArticlesPage; i++) {
         let articleCurrent = articlesData[`article_${i}`]

         let articleHtml =
            `
            <div class="articles__item articles-item">
               <a href="instance.html" class="articles-item__link">
               <div class="articles-item__img-container">
                  <img src="${articleCurrent.img}" class="articles-item__img"></img>
               </div>
               <div class="articles-item__content">
                  <p class="articles-item__text">${articleCurrent.text} <br> ${articleCurrent.city}</p>
               </div>
               </a>
            </div>
            `;

         // добавляем новую статью в html
         document.querySelector('.articles__items').insertAdjacentHTML("beforeend", articleHtml);
      }
   }

   document.querySelector('.articles__button').onclick = () => {

      //количество статей на странице в html
      let articlesValuePage = document.querySelector('.articles__items').children.length
      let articlesButton = document.querySelector('.articles__button')
      let articlesValueTotal = Object.keys(articlesData).length

      if (articlesButton.textContent == 'Скрыть') {
         for (let i = articlesValuePage; i != valueArticlesPage; i--) {
            allArticles = document.querySelector('.articles__items').children
            let lastArticles = allArticles[allArticles.length - 1]
            lastArticles.parentNode.removeChild(lastArticles)
         }
         articlesButton.textContent = 'Загрузить еще';
         articlesButton.scrollIntoView(false)

      }

      // если статей в объекте больше нет, то вызывается return
      if (articlesValuePage == articlesValueTotal) {
         return
      }

      for (let i = 1; i <= 3; i++) {
         // создаем статью в html по шаблону, с данными из объекта articlesData
         let articleCurrent = articlesData[`article_${articlesValuePage + i}`]

         let articleHtml =
            `<div class="articles__item articles-item">
            <a href="#!" class="articles-item__link">
               <div class="articles-item__img-container">
                  <img src="${articleCurrent.img}" class="articles-item__img"></img>
               </div>
               <div class="articles-item__content">
                  <p class="articles-item__text">${articleCurrent.text} <br> ${articleCurrent.city}</p>
               </div>
            </a>
         </div>`
            ;

         // добавляем новую статью в html
         document.querySelector('.articles__items').insertAdjacentHTML("beforeend", articleHtml);
      }

      if (articlesValuePage + 3 == articlesValueTotal) {
         articlesButton.textContent = 'Скрыть';
      }
   }
}
;
if (document.querySelector('.instance-page')) {

   let slidesValue = document.querySelectorAll('.instance-subslider .instance-subslider__slide').length
   let slidesShow = 0

   if (slidesValue >= 6) {
      slidesShow = 6
   } else {
      slidesShow = slidesValue;
   }

   let instanceSubSlider = new Swiper('.instance-subslider', {

      slidesPerView: slidesShow,

      // freeMode: true,

      spaceBetween: 30,

      speed: 700,

      resistanceRatio: 0,

      resistance: true,

      breakpoints: {
         320: {
            slidesPerView: 4,
            spaceBetween: 15,
         },
         600: {
            spaceBetween: 15,
         },
         880: {
            spaceBetween: 25,
         },
         1100: {
            spaceBetween: 30,
         }
      },

   })

   let instanceMainSlider = new Swiper('.instance-mainslider', {

      navigation: {
         nextEl: '.instance-mainslider__button-next',
         prevEl: '.instance-mainslider__button-prev',
      },

      grabCursor: 'true',

      speed: 700,

      loop: true,

      thumbs: {
         swiper: instanceSubSlider,
      },

      effect: 'fade',

      fadeEffect: {
         crossFade: true
      },
   })
}
;
if (document.querySelector('.blog-page')) {

   // объект с данными подгружаемых статей
   let articlesData = {
      article_1: {
         id: 1,
         img: 'img/BLOG__IMG.jpg',
         title: 'Аренда автокрана LIEBHERR LTM 1160 в Москве',
         subtle: 'Компания Liebherr – ведущий поставщик строительной и землеройной техники в мире. Предлагаем автомобильные краны от легкой до тяжелой категории.'
      },
      article_2: {
         id: 2,
         img: 'img/BLOG__IMG.jpg',
         title: 'Аренда автокрана LIEBHERR LTM 1160 в Москве',
         subtle: 'Компания Liebherr – ведущий поставщик строительной и землеройной техники в мире. Предлагаем автомобильные краны от легкой до тяжелой категории.'
      },
      article_3: {
         id: 3,
         img: 'img/BLOG__IMG.jpg',
         title: 'Аренда автокрана LIEBHERR LTM 1160 в Москве',
         subtle: 'Компания Liebherr – ведущий поставщик строительной и землеройной техники в мире. Предлагаем автомобильные краны от легкой до тяжелой категории.'
      },
      article_4: {
         id: 4,
         img: 'img/BLOG__IMG.jpg',
         title: 'Аренда автокрана LIEBHERR LTM 1160 в Москве',
         subtle: 'Компания Liebherr – ведущий поставщик строительной и землеройной техники в мире. Предлагаем автомобильные краны от легкой до тяжелой категории.'
      },
      article_5: {
         id: 5,
         img: 'img/BLOG__IMG.jpg',
         title: 'Аренда автокрана LIEBHERR LTM 1160 в Москве',
         subtle: 'Компания Liebherr – ведущий поставщик строительной и землеройной техники в мире. Предлагаем автомобильные краны от легкой до тяжелой категории.'
      },
      article_6: {
         id: 6,
         img: 'img/BLOG__IMG.jpg',
         title: 'Аренда автокрана LIEBHERR LTM 1160 в Москве',
         subtle: 'Компания Liebherr – ведущий поставщик строительной и землеройной техники в мире. Предлагаем автомобильные краны от легкой до тяжелой категории.'
      },
      article_7: {
         id: 7,
         img: 'img/BLOG__IMG.jpg',
         title: 'Аренда автокрана LIEBHERR LTM 1160 в Москве',
         subtle: 'Компания Liebherr – ведущий поставщик строительной и землеройной техники в мире. Предлагаем автомобильные краны от легкой до тяжелой категории.'
      },
      article_8: {
         id: 8,
         img: 'img/BLOG__IMG.jpg',
         title: 'Аренда автокрана LIEBHERR LTM 1160 в Москве',
         subtle: 'Компания Liebherr – ведущий поставщик строительной и землеройной техники в мире. Предлагаем автомобильные краны от легкой до тяжелой категории.'
      },
      article_9: {
         id: 9,
         img: 'img/BLOG__IMG.jpg',
         title: 'Аренда автокрана LIEBHERR LTM 1160 в Москве',
         subtle: 'Компания Liebherr – ведущий поставщик строительной и землеройной техники в мире. Предлагаем автомобильные краны от легкой до тяжелой категории.'
      },
      article_10: {
         id: 10,
         img: 'img/BLOG__IMG.jpg',
         title: 'Аренда автокрана LIEBHERR LTM 1160 в Москве',
         subtle: 'Компания Liebherr – ведущий поставщик строительной и землеройной техники в мире. Предлагаем автомобильные краны от легкой до тяжелой категории.'
      },
      article_11: {
         id: 11,
         img: 'img/BLOG__IMG.jpg',
         title: 'Аренда автокрана LIEBHERR LTM 1160 в Москве',
         subtle: 'Компания Liebherr – ведущий поставщик строительной и землеройной техники в мире. Предлагаем автомобильные краны от легкой до тяжелой категории.'
      },
      article_12: {
         id: 12,
         img: 'img/BLOG__IMG.jpg',
         title: 'Аренда автокрана LIEBHERR LTM 1160 в Москве',
         subtle: 'Компания Liebherr – ведущий поставщик строительной и землеройной техники в мире. Предлагаем автомобильные краны от легкой до тяжелой категории.'
      },
      article_13: {
         id: 13,
         img: 'img/BLOG__IMG.jpg',
         title: 'Аренда автокрана LIEBHERR LTM 1160 в Москве',
         subtle: 'Компания Liebherr – ведущий поставщик строительной и землеройной техники в мире. Предлагаем автомобильные краны от легкой до тяжелой категории.'
      },
      article_14: {
         id: 14,
         img: 'img/BLOG__IMG.jpg',
         title: 'Аренда автокрана LIEBHERR LTM 1160 в Москве',
         subtle: 'Компания Liebherr – ведущий поставщик строительной и землеройной техники в мире. Предлагаем автомобильные краны от легкой до тяжелой категории.'
      },
      article_15: {
         id: 15,
         img: 'img/BLOG__IMG.jpg',
         title: 'Аренда автокрана LIEBHERR LTM 1160 в Москве',
         subtle: 'Компания Liebherr – ведущий поставщик строительной и землеройной техники в мире. Предлагаем автомобильные краны от легкой до тяжелой категории.'
      },
   }

   let valueArticlesPage = 0;

   // изменяет значение нужного количества стартовых статей при разной ширине экрана
   if (document.body.clientWidth >= 600) {
      valueArticlesPage = 9;
   } else if ((document.body.clientWidth >= 320)) {
      valueArticlesPage = 6;
   }

   // логика добавления статей в html
   if (valueArticlesPage != 0) {
      // console.log(Object.keys(articlesData).length)
      for (let i = 1; i <= valueArticlesPage; i++) {
         let articleCurrent = articlesData[`article_${i}`]

         let articleHtml =
            `
            <div class="articles__item articles-item">
               <div class="articles-item__img-container">
                  <img src="${articleCurrent.img}" class="articles-item__img"></img>
               </div>
               <div class="articles-item__content">
                  <p class="articles-item__title">${articleCurrent.title}</p>
                  <p class="articles-item__text">${articleCurrent.subtle} </p>
                  <a href="article.html" class="articles-item__link">Подробнее</a>
               </div>
            </div>
            `
            ;

         // добавляем новую статью в html
         document.querySelector('.articles__items').insertAdjacentHTML("beforeend", articleHtml);
      }
   }

   document.querySelector('.articles__button').onclick = () => {

      //количество статей на странице в html
      let articlesValuePage = document.querySelector('.articles__items').children.length
      let articlesButton = document.querySelector('.articles__button')
      let articlesValueTotal = Object.keys(articlesData).length

      // логика удаления со страницы добавленных статей. В цикле удаляется последняя статья, пока их не будет 12
      if (articlesButton.textContent == 'Скрыть') {
         for (let i = articlesValuePage; i != valueArticlesPage; i--) {
            allArticles = document.querySelector('.articles__items').children
            let lastArticles = allArticles[allArticles.length - 1]
            lastArticles.parentNode.removeChild(lastArticles)
         }
         articlesButton.textContent = 'Загрузить еще';
         articlesButton.scrollIntoView(false)

      }

      // если статей в объекте больше нет, то вызывается return
      if (articlesValuePage == articlesValueTotal) {
         return
      }

      for (let i = 1; i <= 3; i++) {
         // создаем статью в html по шаблону, с данными из объекта articlesData
         let articleCurrent = articlesData[`article_${articlesValuePage + i}`]

         let articleHtml =
            `
            <div class="articles__item articles-item">
               <div class="articles-item__img-container">
                  <img src="${articleCurrent.img}" class="articles-item__img"></img>
               </div>
               <div class="articles-item__content">
                  <p class="articles-item__title">${articleCurrent.title}</p>
                  <p class="articles-item__text">${articleCurrent.subtle} </p>
                  <a href="article.html" class="articles-item__link">Подробнее</a>
               </div>
            </div>
            `
            ;

         // добавляем новую статью в html
         document.querySelector('.articles__items').insertAdjacentHTML("beforeend", articleHtml);
      }

      if (articlesValuePage + 3 == articlesValueTotal) {
         articlesButton.textContent = 'Скрыть';
      }

   }
};
;

if (document.querySelector('.catalog-page')) {
   function offset(el) {
      const rect = el.getBoundingClientRect(),
         scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
         scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
   }
   // логика с анимацией элементов при показе их на странице
   let animateElem = () => {
      let helpTop = offset(document.querySelector('.help__container')).top;

      if (window.pageYOffset >= helpTop - window.innerHeight + document.querySelector('.help__container').offsetHeight) {
         document.querySelector('.help__container').classList.add('_active')
         window.removeEventListener('scroll', animateElem)
      }
   }

   window.addEventListener('scroll', animateElem)

   //логика работы скрытия элементов в блоке tonnes
   let tonnesButton = document.querySelector('.tonnes__button-more');

   tonnesButton.onclick = () => {
      if (!tonnesButton.closest('.tonnes').classList.contains('_active')) {
         tonnesButton.closest('.tonnes').classList.add('_active')
         tonnesButton.textContent = 'скрыть'
      } else {
         tonnesButton.closest('.tonnes').classList.remove('_active')
         tonnesButton.textContent = 'ещё'
      }
   }
};

if (document.querySelector('.product-page')) {
   function offset(el) {
      const rect = el.getBoundingClientRect(),
         scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
         scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
   }

   // логика с анимацией элементов при показе их на странице
   let animateElem = () => {
      let helpTop = offset(document.querySelector('.help__container')).top;

      if (window.pageYOffset >= helpTop - window.innerHeight + document.querySelector('.help__container').offsetHeight) {
         document.querySelector('.help__container').classList.add('_active')
         window.removeEventListener('scroll', animateElem)
      }
   }

   window.addEventListener('scroll', animateElem)
};
if (document.querySelector('.popup')) {

   let popup = document.querySelector('.popup')
   // список всех кнопок вызывающих попап
   let popupButtons = document.querySelectorAll('._popup')
   let closeCallback = document.querySelector('.popup-callback__button-close')
   let closeSuccess = document.querySelector('.popup-success__button-close')
   let popupSubmit = document.querySelector('.popup-callback__button-submit')

   //вешается на кнопки, которые открывают попап, его логика открытия
   for (let i of popupButtons) {
      i.onclick = () => {
         popup.classList.add('_active')
         document.body.style.overflow = 'hidden';
         setTimeout(() => popup.style.boxShadow = '0 0 200px 500px rgba(0, 0, 0,0.7) inset', 10);
         setTimeout(() => document.querySelector('.popup-callback').classList.add('_active'), 200);
      }
   }

   closeCallback.onclick = () => {
      document.querySelector('.popup-callback').classList.remove('_active')
      setTimeout(() => popup.style.boxShadow = '0 0 100px 0 rgba(0, 0, 0,0.7) inset', 220);
      setTimeout(() => popup.classList.remove('_active'), 350)
      document.querySelector('.popup-success').style.display = 'none';
      document.body.style.overflow = 'visible';
   }

   closeSuccess.onclick = () => {
      document.querySelector('.popup-callback').classList.remove('_active')
      document.querySelector('.popup-success').classList.remove('_active')
      document.body.style.overflow = 'visible';
      setTimeout(() => popup.style.boxShadow = '0 0 100px 0 rgba(0, 0, 0,0.7) inset', 220);
      setTimeout(() => {
         popup.classList.remove('_active')
         document.querySelector('.popup-success').style.display = 'none';
      }, 350)
   }

   //закрытие при клике на область вне попапа
   popup.onclick = (event) => {
      if (event.target.classList.contains('popup-bg')) {
         document.querySelector('.popup-callback').classList.remove('_active')
         document.querySelector('.popup-success').classList.remove('_active')
         document.body.style.overflow = 'visible';
         setTimeout(() => popup.style.boxShadow = '0 0 150px 0 rgba(0, 0, 0,0.7) inset', 220);
         setTimeout(() => {
            popup.classList.remove('_active')
            document.querySelector('.popup-success').style.display = 'none';
         }, 350)

      }
   }

   popupSubmit.onclick = () => {
      document.querySelector('.popup-callback').classList.remove('_active')
      document.querySelector('.popup-success').style.display = 'flex';
      setTimeout(() => document.querySelector('.popup-success').classList.add('_active'), 10)
   }
};

if (document.querySelector('.header')) {
   let burgerIcon = document.querySelector('.header__burger-icon')
   let headerBurger = document.querySelector('.header__burger')
   let headerMenu = document.querySelector('.header__menu')
   let headerInfo = document.querySelector('.header__info')

   burgerIcon.onclick = (e) => {
      if (!burgerIcon.classList.contains('_active')) {
         burgerIcon.classList.add('_active')
         headerBurger.classList.add('_active')
         headerMenu.classList.add('_active')
         headerInfo.classList.add('_active')
         document.body.style.overflow = 'hidden';
      } else {
         burgerIcon.classList.remove('_active')
         headerBurger.classList.remove('_active')
         headerMenu.classList.remove('_active')
         headerInfo.classList.remove('_active')
         document.body.style.overflow = 'visible';
      }
   }
};



// console.log(document.querySelector('.costs__item-numb').textContent)
