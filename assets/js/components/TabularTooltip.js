/**
 * Replaces browser default tooltips for elements, with
 * CSS-powered tooltips that work on touchscreen devices too.
 *
 * @param  {object} $ (jQuery)
 * @param  {function} DoughBaseComponent
 * @module TabularTooltip
 * @return {class} TabularTooltip
 */
define(['jquery', 'DoughBaseComponent'], function($, DoughBaseComponent) {
  'use strict';

  var TabularTooltip;

  /**
   * @constructor
   * @extends {DoughBaseComponent}
   * @returns {TabularTooltip}
   */
  TabularTooltip = function() {
    TabularTooltip.baseConstructor.apply(this, arguments);
  };

  DoughBaseComponent.extend(TabularTooltip);

  /**
   * Initialise component
   * @param {Object} initialised Promise passed from eventsWithPromises (RSVP Promise).
   */
  TabularTooltip.prototype.init = function(initialised) {
    var title = this.$el.attr('title');
    this.$el.attr('data-tooltip', title)  // store title in new data-attribute
        .removeAttr('title');          // remove old title, to avoid double tooltip (see comment in css)

    this._initialisedSuccess(initialised);
  };

  return TabularTooltip;

});
