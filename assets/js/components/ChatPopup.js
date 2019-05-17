define(['jquery', 'DoughBaseComponent'],
  function($, DoughBaseComponent) {
  'use strict';

  var ChatPopup,
      defaultConfig = {};

  ChatPopup = function($el, config) {
    ChatPopup.baseConstructor.call(this, $el, config, defaultConfig);

    this.chatPopupBtn = $el;
  };

  /**
  * Inherit from base module, for shared methods and interface
  */
  DoughBaseComponent.extend(ChatPopup);

  ChatPopup.componentName = 'ChatPopup';

  /**
   * Public method imported in BackToTop.js to manage popup vertical position in article pages
   * @param {boolean} raised - set button raised state
   * @param {boolean} atSmallViewport - viewport width < 720px
   */
  ChatPopup.prototype._raisedChatPopup = function(raised, atSmallViewport) {
    raised && atSmallViewport ? this.chatPopupBtn.addClass('chat-popup--raised') : this.chatPopupBtn.removeClass('chat-popup--raised');
  }

  /**
  * @param {Promise} initialised
  */
 ChatPopup.prototype.init = function(initialised) {
    this._initialisedSuccess(initialised);
  };

  return ChatPopup;
});
