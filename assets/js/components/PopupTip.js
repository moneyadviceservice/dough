define(['jquery', 'DoughBaseComponent', 'mediaQueries', 'utilities'],
  function(jquery, DoughBaseComponent, mediaQueries, utilities) {
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
    this.$component = this.$el;
    this.offset = 35;
    this.debounceWait = 100;

    return this;
  };

  DoughBaseComponent.extend(PopupTip);
  PopupTip.componentName = 'PopupTip';

  PopupTip.prototype._addEvents = function() {
    var $closeBtn = this.$el.find(this.config.selectors.popupClose);
    var resizeProxy = $.proxy(this._resize, this);

    this.$trigger.click($.proxy(this._showPopupTip, this));
    $closeBtn.click($.proxy(this._hidePopupTip, this));
    $(window).on('resize', utilities.debounce(resizeProxy, this.debounceWait));
  };

  PopupTip.prototype._showPopupTip = function(e) {
    this.$popup.removeClass(this.config.selectors.inactiveClass);
    this.$popup.addClass(this.config.selectors.activeClass);
    this.$popupContent.focus();
    this._positionPopup(this.$popup, e.target);
  };

  PopupTip.prototype._resize = function() {
    if (this.$el.find('.is-active').length > 0) {
      var $index = this.$el.find('.is-active');
      var trigger = $index.parents('[data-dough-component]').find('[data-dough-popup-trigger]');

      this._positionPopup($index, trigger[0]);
    }
  };

  PopupTip.prototype._positionPopup = function($index, trigger) {
    var componentPos = this.$component[0].getBoundingClientRect();
    var triggerPos = trigger.getBoundingClientRect();
    var indexPos = $index[0].getBoundingClientRect();

    this.$component.css('position', 'relative');
    $index.css('width', this.$component.width());

    if (this.atSmallViewport()) {
      // mobile view
      $index.css('top', triggerPos.top - componentPos.top + this.offset);
      $index.css('left', 0);
    } else {
      // desktop view
      $index.css('top', triggerPos.top - componentPos.top + this.offset);

      // is icon less or more than 50% across page width?
      if (triggerPos.left - (triggerPos.width / 2) < ($(window).width() / 2)) {
        // trigger is on LHS
        $index.css('left', triggerPos.left - componentPos.left + this.offset);
      } else {
        // trigger is on RHS
        $index.css('left', triggerPos.left - indexPos.width - componentPos.left - this.offset);
      }
    }
  };

  PopupTip.prototype._hidePopupTip = function() {
    this.$popup.addClass(this.config.selectors.inactiveClass);
    this.$popup.removeClass(this.config.selectors.activeClass);
    this.$trigger.focus();
  };

  PopupTip.prototype.atSmallViewport = function() {
    if (mediaQueries.atSmallViewport()) {
      return true;
    } else {
      return false;
    }
  };

  PopupTip.prototype.init = function(initialised) {
    this._addEvents();
    this._initialisedSuccess(initialised);

    return this;
  };

  return PopupTip;
});
