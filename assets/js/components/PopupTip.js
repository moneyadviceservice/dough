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
    this.offset = 35;

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
      .addClass(this.config.selectors.activeClass);
    this.$popupContent.attr('tabindex', -1).focus();

    this._positionPopup(this.$popup, e.target);
  };

  PopupTip.prototype._resize = function() {
    if (this.$el.find('.is-active').length > 0) {
      this._positionPopup(this.$el.find('.is-active'));
    }
  }

  PopupTip.prototype._positionPopup = function($index, trigger) {
    if (!this.atSmallViewport) {
      $index.css('top', trigger.offsetTop + this.offset);

      // is icon less or more than 50% across page width
      if ($(trigger).position().left - ($(trigger).width() / 2) < ($(window).width() / 2)) {
        $index.css('left', trigger.offsetLeft + this.offset);
      } else {
        $index.css('left', trigger.offsetLeft - $index.width() - this.offset);
      }
    }
  }

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
