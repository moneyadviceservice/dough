define([], function() {
  'use strict';

  var s = {};

  function supportTest(prop, context) {
    try {
      return prop in context && context[prop] !== null;
    } catch (e) {
      return false;
    }
  }

  s.js = ( supportTest('querySelector', document) && supportTest('localStorage', window) && supportTest('addEventListener', window) ) ? 'advanced' : 'basic';
  s.touch = ( supportTest('ontouchstart', window) || supportTest('onmsgesturechange', window) );
  s.localstorage = supportTest('localStorage', window);
  s.svg = (function () {
    return !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;
  })();

  s.html5Inputs = {
    range: function(){
      var i = document.createElement('input');
      i.setAttribute('type', 'range');
      return i.type !== 'text';
    }()
  };

  s.test = supportTest;

  return s;

});
