/**
 * Show/hide field tooltips when user focuses on relevant input field.
 * @param  {[type]} $         [description]
 * @return {[type]}           [description]
 * @private
 */
define(['jquery', 'DoughBaseComponent', 'eventsWithPromises'], function ($, DoughBaseComponent, eventsWithPromises) {
  'use strict';

  var defaultConfig = {
    },

    /**
   * Call base constructor
   * @constructor
   */
  FieldTooltip = function ($el, config) {
    RangeInput.baseConstructor.apply(this, arguments);
    this.config = $.extend(defaultConfig, this.config);
  };

  DoughBaseComponent.extend(FieldTooltip);

  return FieldTooltip;

});
