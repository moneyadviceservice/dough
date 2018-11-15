define(['jquery', 'DoughBaseComponent', 'mediaQueries'],
  function($, DoughBaseComponent, mediaQueries) {
  'use strict';

  var defaultConfig = {
        selectors: {
          trigger:        '[data-dough-popup-trigger]',
          popupContainer: '[data-dough-popup-container]',
          popupContent:   '[data-dough-popup-content]',
          popupClose:     '[data-dough-popup-close]',
          activeClass:    'is-active',
          inactiveClass:  'is-inactive',
        }
      },
      PopupTip;

  PopupTip = function($el, config) {
    PopupTip.baseConstructor.call(this, $el, config, defaultConfig);

    this.$trigger = this.$el.find(this.config.selectors.trigger);
    this.$popup   = this.$el.find(this.config.selectors.popupContainer);
    this.$popupContent = this.$el.find(this.config.selectors.popupContent);
    this.atLargeViewport = mediaQueries.atLargeViewport();
    this.atSmallViewport = mediaQueries.atSmallViewport();

    return this;
  };

  DoughBaseComponent.extend(PopupTip);
  PopupTip.componentName = 'PopupTip';

  PopupTip.prototype._addEvents = function() {
    var $closeBtn = this.$el.find(this.config.selectors.popupClose);

    this.$trigger.click($.proxy(this.showPopupTip, this));
    $closeBtn.click($.proxy(this.hidePopupTip, this));
  };

  PopupTip.prototype.showPopupTip = function(e) {
    this.$popup
      .removeClass(this.config.selectors.inactiveClass)
      .addClass(this.config.selectors.activeClass)
    this.$popupContent.attr('tabindex', -1).focus();

    // is icon less or more than 50% across page width
    if ($(e.target).position().left - ($(e.target).width() / 2) < ($(window).width() / 2)) {
      this.$popup.css('left', e.target.offsetLeft);
    } else {
      this.$popup.css('left', e.target.offsetLeft - this.$popup.width());
    }
  };

  PopupTip.prototype.hidePopupTip = function() {
    this.$popup.addClass(this.config.selectors.inactiveClass);
    this.$popup.removeClass(this.config.selectors.activeClass);
    this.$trigger.focus();
  };

  PopupTip.prototype.init = function(initialised) {
    this._addEvents();
    this._initialisedSuccess(initialised);

    return this;
  };

  return PopupTip;
});
