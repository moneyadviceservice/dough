define(['jquery', 'DoughBaseComponent', 'mediaQueries', 'utilities', 'ChatPopup', 'CovidBanner'],
  function($, DoughBaseComponent, mediaQueries, utilities, ChatPopup, CovidBanner) {
  'use strict';

  var BackToTop,
      defaultConfig = {
        triggerPoint: 1704,
      },
      i18nStrings = {
        title: 'Back to top'
      };

  BackToTop = function($el, config) {
    BackToTop.baseConstructor.call(this, $el, config, defaultConfig);

    this.i18nStrings = (config && config.i18nStrings) ? config.i18nStrings : i18nStrings;
    this.atSmallViewport = false;
    this.linkHeight = 0;
    this.hiddenClass = 'visually-hidden';
    this.showClass = 'back_to_top__link--shown';
    this.active = false;
    this.scrollingToTop = false;
    // import the ChatPopup class
    this.popupComponent = $(document).find('[data-dough-component="ChatPopup"]');
    this.chatPopup = new ChatPopup(this.popupComponent);
    // import the CovidBanner class
    if ($(document).find('[data-dough-component="CovidBanner"]').length > 0) {
      this.covidComponent = $(document).find('[data-dough-component="CovidBanner"]');
      this.covidBanner = new CovidBanner(this.covidComponent);
    } else {
      this.covidBanner = null; 
    }
  };

  /**
  * Inherit from base module, for shared methods and interface
  */
  DoughBaseComponent.extend(BackToTop);

  BackToTop.componentName = 'BackToTop';

  BackToTop.prototype._setUpBTTLink = function() {
    var resizeProxy = $.proxy(this._resize, this);
    var scrollProxy = $.proxy(this._scroll, this);
    var self = this;

    this.$bttLink =
      $('<a class="back_to_top__link" href="#" aria-hidden="true">' +
        this.i18nStrings.title +
        '<svg xmlns="http://www.w3.org/2000/svg" class="back_to_top__link__arrow" viewBox="0 0 20.4 12.4">' +
          '<path d="M20.4 10.3L10.1 0 0 10.1l2.1 2.1 8-8 8.2 8.2z"/>' +
        '</svg>' +
      '</a>');

    this.$el.parentsUntil('l-body').parent().find('footer')
      .append(this.$bttLink)
      .find('.l-footer-secondary')
        .addClass('back_to_top__spacer');

    if (mediaQueries.atSmallViewport()) {
      this.atSmallViewport = true;
    }

    $(window).on('resize', utilities.debounce(resizeProxy, 100));
    $(window).on('scroll', $.throttle(100, scrollProxy));

    this.$bttLink
      .click(function() {
        $(this).removeClass(self.showClass);
        self.chatPopup._raisedChatPopup(false, self.atSmallViewport);
        self.scrollingToTop = true;
        $('html, body').animate({scrollTop: 0}, 800, function() {
          self.scrollingToTop = false;
        });
      });
  };

  BackToTop.prototype._getActive = function() {
    var scrollAmount = this._getScrollAmount();

    if (scrollAmount < this.config.triggerPoint && !this.scrollingToTop) {
      this.active = false;
    } else {
      this.active = true;
    }
  };

  BackToTop.prototype._getScrollAmount = function() {
    return $(window).scrollTop();
  };

  BackToTop.prototype._resize = function() {
    if (mediaQueries.atSmallViewport()) {
      this.atSmallViewport = true;
      this._position();
      this.$bttLink.removeClass(this.hiddenClass);
      // on resize, validate scroll amount and manage raised class in whatsapp popup
      if (this._getScrollAmount() < this.config.triggerPoint) {
        this.chatPopup._raisedChatPopup(false, this.atSmallViewport);
        if (this.covidBanner) {
          this.covidBanner._raisedCovidBanner(false, this.atSmallViewport);
        }
      } else {
        this.chatPopup._raisedChatPopup(true, this.atSmallViewport);
        if (this.covidBanner) {
          this.covidBanner._raisedCovidBanner(true, this.atSmallViewport);
        }
      }
    } else {
      this.atSmallViewport = false;
      this.$bttLink.addClass(this.hiddenClass);
      this.chatPopup._raisedChatPopup(false, this.atSmallViewport);
      if (this.covidBanner) {
        this.covidBanner._raisedCovidBanner(false, this.atSmallViewport);
      }
    }
  };

  BackToTop.prototype._scroll = function() {
    if (this.atSmallViewport) {
      this._position();
    }
  };

  BackToTop.prototype._position = function() {
    if (!this.scrollingToTop) {
      this._getActive();

      // we are beyond the scroll point
      if (this.active) {
        this.$bttLink.addClass(this.showClass);
        this.chatPopup._raisedChatPopup(true, this.atSmallViewport);
        if (this.covidBanner) {
          this.covidBanner._raisedCovidBanner(true, this.atSmallViewport);
        }
      // we are not beyond the scroll point
      } else {
        this.$bttLink.removeClass(this.showClass);
        this.chatPopup._raisedChatPopup(false, this.atSmallViewport);
        if (this.covidBanner) {
          this.covidBanner._raisedCovidBanner(false, this.atSmallViewport);
        }
      }
    }
  };

  /**
  * @param {Promise} initialised
  */
  BackToTop.prototype.init = function(initialised) {
    this._setUpBTTLink();
    this._initialisedSuccess(initialised);
  };

  return BackToTop;
});
