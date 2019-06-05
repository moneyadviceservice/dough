define(['jquery', 'DoughBaseComponent'],
  function ($, DoughBaseComponent) {
    'use strict';

    var ChatPopup,
      defaultConfig = {};

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
      $(window).scroll($.throttle(200, function() {
        // past scroll limits
        if(!self.chatPopupBtn.hasClass('mobile-webchat--hide') && self._outsideScrollLimits()) {
          // and popup is closed
          if(self.chatPopupBtn.hasClass('mobile-webchat--closed')) {
            self.chatPopupBtn.addClass('mobile-webchat--hide');
          }
        }
        // completely hide when contact panels are reached
        if($(window).scrollTop() > self.contactPanelsOffset && self.chatPopupBtn.hasClass('mobile-webchat--hide')) {
          self.chatPopupBtn.addClass('is-hidden');
        } else {
          self.chatPopupBtn.removeClass('is-hidden');
        }
      }));
      // on left border click reveal popup
      this.chatPopupBtn.click(function(event){   
        // left border x-axis offset
        if(event.offsetX < 0) {
          self.chatPopupBtn.removeClass('mobile-webchat--hide');
          self._setScrollLimits();
        }
      });
    };

    ChatPopup.prototype._setScrollLimits = function () {
      this.scrollLimitTop = $(window).scrollTop() - 700;
      this.scrollLimitBottom = $(window).scrollTop() + 700;
      // if limit top is negative set to 0
      if(this.scrollLimitTop < 0) this.scrollLimitTop = 0;
      // define offset for bottom contact panels
      this.contactPanelsOffset = $('[data-dough-contact-panels]').offset().top - $(window).innerHeight();
    };

    ChatPopup.prototype._outsideScrollLimits = function () {
      if($(window).scrollTop() < this.scrollLimitTop ||  $(window).scrollTop() > this.scrollLimitBottom) {
        return true;
      } else {
        return false;
      }
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
