/**
 * Client side validation. Mirrors HTML5 validation API as much as possible.
 *
 * Supported types are:
 * - required
 * - minlength
 * - pattern
 * - min/max number range checking
 *
 * @param  {Object} $         [description]
 * @return {Class}           Validation
 */
define(['jquery', 'DoughBaseComponent'], function($, DoughBaseComponent) {
  'use strict';

  var defaultConfig = {
    invalidClass: 'is-invalid',
    validClass: 'is-valid',
    rowInvalidClass: 'is-errored'
  },

  uiEvents = {
    'blur input': '_handleBlurEvent',
    'keyup input': '_handleKeyUpEvent',
    'submit': '_handleSubmit'
  },

    /**
   * Call base constructor
   * @constructor
   */
  Validation = function($el, config) {
    this.uiEvents = uiEvents;
    Validation.baseConstructor.apply(this, arguments);
    this.config = $.extend(defaultConfig, this.config);
    this.init();
  };

  DoughBaseComponent.extend(Validation);

  Validation.prototype.init = function() {
    return this;
  };

  /**
   * Inline errors are shown on input blur
   * @return {[type]} [description]
   */
  Validation.prototype._handleBlurEvent = function() {

  };

  /**
   * Error messages get corrected as the user types
   * @return {[type]} [description]
   */
  Validation.prototype._handleKeyUpEvent = function() {

  };

  /**
   * The validation summary is updated on form submit
   * @return {[type]} [description]
   */
  Validation.prototype._handleSubmit = function() {

  };


  return Validation;

});
