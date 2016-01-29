/**
 * Attaches a click handler to $el which when triggered shows the print dialog.
 *
 * @param  {object} $ (jQuery)
 * @param  {function} DoughBaseComponent
 * @module Print
 * @returns {class} Print
 */
define(['jquery', 'DoughBaseComponent'], function($, DoughBaseComponent) {
  'use strict';

  var Print,
      defaultConfig = {};

  /**
   * @constructor
   * @extends {DoughBaseComponent}
   * @returns {Print}
   */

  Print = function($el, config) {
    Print.baseConstructor.call(this, $el, config, defaultConfig);
  };

  DoughBaseComponent.extend(Print);

  Print.componentName = 'Print';

  /**
   * Initialise component
   * @param {Object} initialised Promise passed from eventsWithPromises (RSVP Promise).
   */
  Print.prototype.init = function(initialised) {
    this.$el.click(function() {
      window.print();
    });

    this._initialisedSuccess(initialised);
  };

  return Print;
});
