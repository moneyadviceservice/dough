define(['jquery', 'DoughBaseComponent'],
  function ($, DoughBaseComponent) {
    'use strict';

    var ChatPopup,
      defaultConfig = {
        scrollThrottle: 200,
        scrollLimit: 700,
        hiddenClass: 'mobile-webchat--hide'
      };

    ChatPopup = function ($el, config) {
      ChatPopup.baseConstructor.call(this, $el, config, defaultConfig);

      this.chatPopupBtn = $el;
      this.chatPopupIcon = $el.find('[data-dough-webchat-icon]');
      this.chatPopupClose = $el.find('[data-dough-webchat-close]');
      this.popupElements = $el.children().not('[data-dough-webchat-icon]');
      this.serviceSelect = $el.find('[data-dough-webchat-select]');
      this.whatsappBtn = $el.find('[data-dough-webchat-button-whatsapp]');
      this.webchatBtn = $el.find('[data-dough-webchat-button-webchat]');
      
    };

    /**
     * Inherit from base module, for shared methods and interface
     */
    DoughBaseComponent.extend(ChatPopup);

    ChatPopup.componentName = 'ChatPopup';

    ChatPopup.prototype._setupListeners = function () {
      var self = this;
      // on icon click open popup
      this.chatPopupIcon.click(function (event) {
        event.preventDefault();
        self._togglePopup();
        self._manageTransition(1);
      });
      // on X click close popup
      this.chatPopupClose.click(function (event) {
        event.preventDefault();
        self._togglePopup();
        self._manageTransition(0);
        self._setScrollLimits();
      });
      // on select change
      this.serviceSelect.change(function(event) {
        if(event.target.value === 'debt-and-borrowing' || event.target.value === 'pensions-and-retirement') {
          self.whatsappBtn.removeClass('is-hidden');
        } else {
          self.whatsappBtn.addClass('is-hidden');
        }
      });

      // on scroll hide
      $(window).scroll($.throttle(defaultConfig.scrollThrottle, function() {
        // past scroll limits
        if(self._hideChatPopup()) self.chatPopupBtn.addClass(defaultConfig.hiddenClass);
        // completely hide when contact panels are reached
        self._reachedContactPanels() ? self.chatPopupBtn.addClass('is-hidden') : self.chatPopupBtn.removeClass('is-hidden');
      }));
      // on left border click reveal popup
      this.chatPopupBtn.click(function(event){   
        // left border x-axis offset
        if(event.offsetX < 0) {
          self.chatPopupBtn.removeClass(defaultConfig.hiddenClass);
          self._setScrollLimits();
        }
      });
    };

    ChatPopup.prototype._setScrollLimits = function () {
      this.scrollLimitTop = this._getScrollAmount() - defaultConfig.scrollLimit;
      this.scrollLimitBottom = this._getScrollAmount() + defaultConfig.scrollLimit;
      if(this.scrollLimitTop < 0) this.scrollLimitTop = 0;
      // define offset for bottom contact panels
      this.contactPanelsOffset = $('[data-dough-contact-panels]').offset().top - $(window).innerHeight();
    };

    ChatPopup.prototype._hideChatPopup = function () {
      if(!this.chatPopupBtn.hasClass(defaultConfig.hiddenClass) && this.chatPopupBtn.hasClass('mobile-webchat--closed')){
        return this._getScrollAmount() < this.scrollLimitTop ||  this._getScrollAmount() > this.scrollLimitBottom;
      }
    };

    ChatPopup.prototype._reachedContactPanels = function () {
      return $(window).scrollTop() > this.contactPanelsOffset && this.chatPopupBtn.hasClass(defaultConfig.hiddenClass);
    };

    ChatPopup.prototype._getScrollAmount = function() {
      return $(window).scrollTop();
    };

    ChatPopup.prototype._manageTransition = function (opacity) {
      var self = this;
      setTimeout(function () {
        $.each(self.popupElements, function (index, value) {
          value.style.opacity = opacity;
          value.style.filter = "alpha(opacity=" + opacity + "00)"; // IE fallback
        });
      }, 100);
    };

    ChatPopup.prototype._togglePopup = function () {
      this.chatPopupBtn.toggleClass('mobile-webchat--opened').toggleClass('mobile-webchat--closed');
    };

    /**
     * Public method imported in BackToTop.js to manage popup vertical position in article pages
     * @param {boolean} raised - set button raised state
     * @param {boolean} atSmallViewport - viewport width < 720px
     */
    ChatPopup.prototype._raisedChatPopup = function (raised, atSmallViewport) {
      var raisedPopup = raised && atSmallViewport;
      // check if conditions are met
      if (raisedPopup) {
        this.chatPopupBtn.addClass('mobile-webchat--raised')
      } else {
        this.chatPopupBtn.removeClass('mobile-webchat--raised')
      };
    }

    /**
     * @param {Promise} initialised
     */
    ChatPopup.prototype.init = function (initialised) {
      this._setScrollLimits();
      this._setupListeners();
      this._initialisedSuccess(initialised);
    };

    return ChatPopup;
  });
