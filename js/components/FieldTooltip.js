/**
 * Show/hide field tooltips when user focuses on relevant input field.
 * @param  {[type]} $         [description]
 * @return {[type]}           [description]
 * @private
 */
define(['jquery', 'DoughBaseComponent'], function ($, DoughBaseComponent) {
  'use strict';

  var defaultConfig = {
    hiddenClass: 'tooltip--hidden'
  },

    /**
   * Call base constructor
   * @constructor
   */
  FieldTooltip = function ($el, config) {
    FieldTooltip.baseConstructor.apply(this, arguments);
    this.config = $.extend(defaultConfig, this.config);
    this.debounceTimer = null;
    this.init();
  };

  DoughBaseComponent.extend(FieldTooltip);

  FieldTooltip.prototype.init = function() {
    var tooltipID = this.$el.attr('id');

    this.$inputTarget = $('input[aria-describedby="' + tooltipID + '"]');
    this.hideTooltip();
    this._addListeners();

    return this;
  };

  FieldTooltip.prototype.showTooltip = function() {
    this.$el.removeClass(this.config.hiddenClass);
    return this;
  };

  FieldTooltip.prototype.hideTooltip = function() {
    if (!this.$inputTarget.is(':focus')) {
      this.$el.addClass(this.config.hiddenClass);
    }

    return this;
  };

  FieldTooltip.prototype._addListeners = function() {
    this.$inputTarget.
          on('focusin', this.showTooltip).
          on('focusout', this._onBlur);

    return this;
  };

  FieldTooltip.prototype._onBlur = function() {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout($.proxy(function() {
      var $activeElement = $(document.activeElement),
          $activeParents = $activeElement.parents();

      if (!($activeElement.is(this.$el) || $activeElement.is(this.$inputTarget) ||
        $activeParents.filter(this.$el).length || $activeParents.filter(this.$inputTarget).length)) {
        this.hideTooltip();
      }
    }, this));
  };

  return FieldTooltip;

});
