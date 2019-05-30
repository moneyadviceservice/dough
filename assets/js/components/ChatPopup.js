define(['jquery', 'DoughBaseComponent'],
  function ($, DoughBaseComponent) {
    'use strict';

    var ChatPopup,
      defaultConfig = {};

    ChatPopup = function ($el, config) {
      ChatPopup.baseConstructor.call(this, $el, config, defaultConfig);

      this.chatPopupBtn = $el;
      this.chatPopupIcon = $('.mobile-webchat--icon');
      this.chatPopupClose = $('.mobile-webchat__close');
      this.popupElements = $('.mobile-webchat__container').children().not('.mobile-webchat--icon');
      this.serviceSelect = $('.mobile-webchat__select');
      this.whatsappBtn = $('.mobile-webchat__button--whatsapp');
      this.webchatBtn = $('.mobile-webchat__button--webchat');
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
      });
      // on select change
      this.serviceSelect.change(function(event) {
        if(event.target.value === 'debt-and-borrowing' || event.target.value === 'pensions-and-retirement') {
          self.whatsappBtn.removeClass('is-hidden');
        } else {
          self.whatsappBtn.addClass('is-hidden');
        }
      });
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
      raised && atSmallViewport ? this.chatPopupBtn.addClass('mobile-webchat--raised') : this.chatPopupBtn.removeClass('mobile-webchat--raised');
    }

    /**
     * @param {Promise} initialised
     */
    ChatPopup.prototype.init = function (initialised) {
      this._setupListeners();
      this._initialisedSuccess(initialised);
    };

    return ChatPopup;
  });
