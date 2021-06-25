/** 
 * This is a generic component designed to allow communication between 
 * MAS components and a host page on the Money Helper site
 * It uses the postMessage method to send an object to the host environment
 */
define(['DoughBaseComponent'],
  function(DoughBaseComponent) {
  'use strict';

  var PostMessages, 
      message,
      defaultConfig = {
        masresize: false, 
        scrollToTop: false
      };

  PostMessages = function($el, config) {
    PostMessages.baseConstructor.call(this, $el, config, defaultConfig);

    this.message = message; 
  };

  /**
   * Inherit from base module, for shared methods and interface
   */
  DoughBaseComponent.extend(PostMessages);

  PostMessages.componentName = 'PostMessages';

  /** 
   * Adds event listeners
   */
  PostMessages.prototype._addEvents = function() {
    var _this = this;
    var anchors = this.$el.find('a');

    // Adds listeners for click events to jump links
    for (var anchor in anchors) {
      if (anchors[anchor].href && anchors[anchor].href.indexOf('#') > -1) {
        $(anchors[anchor]).on('click', function(e) {
          e.preventDefault();
          _this._updateMessage('jumpLink', e.target.href.split('#')[1]);
        })
      }
    };
  }

  /**
   * Updates the message with required value
   */
  PostMessages.prototype._updateMessage = function(event, value) {
    switch(event) {
      case 'masResize': 
        // Updates the message with height value for document
        this.message = '';
        this.message = 'MASRESIZE-' + value;
        break;
      case 'jumpLink': 
        // Updates the message with vertical offset value for the supplied element
        var offset = this._getOffset(value);

        this.message = {}; 
        this.message['jumpLink'] = {
          id: value,
          offset: offset
        };
        break; 
      case 'scrollToTop': 
        // Updates the message with vertical offset value of 0
        this.message = {}; 
        this.message['scrollToTop'] = {
          offset: 0
        };
        break; 
    }

    this._sendMessage(); 
  }

  /**
   * Gets the vertical offset value of the required element
   */
  PostMessages.prototype._getOffset = function(id) {
    var el = this.$el.find('#' + id); 

    return el[0].getBoundingClientRect().top; 
  }

  /**
   * Sends the message
   */
  PostMessages.prototype._sendMessage = function() {
    console.log('message: ', this.message); 
    
    window.parent.postMessage(this.message, '*');
  }

  /**
   * A method to update the message on changes to the document height
   */
  PostMessages.prototype._masResize = function() {
    var _this = this, 
        currentHeight = 0, 
        timer,
        bodyNode = document.body, 
        minFrameHeight = 250;

    timer = setInterval(function() {
      var documentHeight = Math.max(
        bodyNode.scrollHeight,
        minFrameHeight
      );

      if (documentHeight !== currentHeight) {
        currentHeight = documentHeight;
        _this._updateMessage('masResize', documentHeight);
      }
    }, 200);
  }

  /**
   * A method to update the message on document reloads
   */
  PostMessages.prototype._scrollToTop = function() {
    this._updateMessage('scrollToTop', null);
  }

  /**
  * @param {Promise} initialised
  */
  PostMessages.prototype.init = function(initialised) {
    this._initialisedSuccess(initialised);
    this._addEvents();

    if (this.config.masresize) {
      this._masResize(); 
    }

    if (this.config.scrollToTop) {
      this._scrollToTop();
    }
  };

  return PostMessages;
});
