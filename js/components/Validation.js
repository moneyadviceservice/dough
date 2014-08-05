/**
 * Client side validation. Mirrors HTML5 validation API as much as possible.
 * @param  {Object} $         [description]
 * @return {Class}           Validation
 */
define(['jquery', 'DoughBaseComponent'], function($, DoughBaseComponent) {
  'use strict';

  var defaultConfig = {},

    /**
   * Call base constructor
   * @constructor
   */
  Validation = function($el, config) {
    Validation.baseConstructor.apply(this, arguments);
    this.config = $.extend(defaultConfig, this.config);
    this.debounceTimer = null;
    this.init();
  };

  DoughBaseComponent.extend(Validation);

  Validation.prototype.init = function() {
    return this;
  };

  return Validation;

});
