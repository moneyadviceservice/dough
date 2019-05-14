define(['jquery', 'DoughBaseComponent'],
  function($, DoughBaseComponent) {
  'use strict';

  var ChatPopup,
      defaultConfig = {},
      chatPopupBtn = $('#js-chat-popup-mobile');


  ChatPopup = function($el, config) {
    ChatPopup.baseConstructor.call(this, $el, config, defaultConfig);
  };

  /**
  * Inherit from base module, for shared methods and interface
  */
  DoughBaseComponent.extend(ChatPopup);

  ChatPopup.componentName = 'ChatPopup';

  /**
  * Public method imported in BackToTop.js to manage popup vertical position in article pages
  */
  ChatPopup.raisedChatPopup = function(action, atSmallViewport) {
    // only raise the popup at small viewports where the button will be visible
    action && atSmallViewport ? chatPopupBtn.addClass('chat-popup--raised') : chatPopupBtn.removeClass('chat-popup--raised');
  };

  /**
  * @param {Promise} initialised
  */
 ChatPopup.prototype.init = function(initialised) {
    this._initialisedSuccess(initialised);
  };

  return ChatPopup;
  
});
