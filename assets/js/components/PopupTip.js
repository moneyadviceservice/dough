define(['jquery', 'DoughBaseComponent'],
  function($, DoughBaseComponent) {
  'use strict';

  var defaultConfig = {
        selectors: {
          trigger:       '[data-dough-popup-trigger]',
          popupContent:  '[data-dough-popup-content]',
          popupClose:    '[data-dough-popup-close]',
          activeClass:   'is-active',
          inactiveClass: 'is-inactive',
        }
      },
      PopupTip;

  PopupTip = function($el, config) {
    PopupTip.baseConstructor.call(this, $el, config, defaultConfig);

    this.$trigger = this.$el.find(this.config.selectors.trigger);
    this.$popup   = this.$el.find(this.config.selectors.popupContent);

    return this;
  };

  DoughBaseComponent.extend(PopupTip);
  PopupTip.componentName = 'PopupTip';

  PopupTip.prototype._addEvents = function() {
    var $closeBtn = this.$el.find(this.config.selectors.popupClose);

    this.$trigger.on('click', $.proxy(this.showPopupTip, this));
    $closeBtn.on('click', $.proxy(this.hidePopupTip, this));
  };

  PopupTip.prototype.showPopupTip = function() {
    var triggerPos    = this.$trigger.offset();

    this.$popup.css({
      'top' : triggerPos.top
    });

    this.$popup.removeClass(this.config.selectors.inactiveClass);
    this.$popup.addClass(this.config.selectors.activeClass);
  };

  PopupTip.prototype.hidePopupTip = function() {
    this.$popup.addClass(this.config.selectors.inactiveClass);
    this.$popup.removeClass(this.config.selectors.activeClass);
  };

  PopupTip.prototype.init = function(initialised) {
    this._addEvents();
    this._initialisedSuccess(initialised);

    return this;
  };

  return PopupTip;
});
