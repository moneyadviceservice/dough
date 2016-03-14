define(['jquery',
    'DoughBaseComponent',
    'Collapsable',
    'featureDetect',
    'mediaQueries',
    'eventsWithPromises'],
  function($, DoughBaseComponent, Collapsable, featureDetect, mediaQueries, eventsWithPromises) {

    'use strict';

    var CollapsableMobile,
      defaultConfig = {
        forceTo: true
      };

    CollapsableMobile = function($el, config) {
      CollapsableMobile.baseConstructor.call(this, $el, config, defaultConfig);
    };

    /**
     * Inherit from base module, for shared methods and interface
     */
    DoughBaseComponent.extend(CollapsableMobile, Collapsable);

    CollapsableMobile.componentName = 'CollapsableMobile';

    /**
     * @param {Promise} initialised
     */
    CollapsableMobile.prototype.init = function(initialised) {
      var label;

      // Call Super() method
      CollapsableMobile.superclass.init.call(this, initialised);

      eventsWithPromises.subscribe('mediaquery:resize', $.proxy(this._mediaQueryResizeHandler, this));

      // Copy the desktop specific heading to outside of the button.
      label = this.$triggers[0].childNodes[1].wholeText;
      this.$triggers.after('<span class="collapsable-mobile__desktop-label">' + label + '</span>');

      return this;
    };

    CollapsableMobile.prototype.toggle = function(forceTo, focusTarget) {
      // Override toggle()

      // Only call it's super method if on Mobile.
      if (this._isMobile()) {
        CollapsableMobile.superclass.toggle.call(this, forceTo, focusTarget);
      }
      else {
        event.preventDefault();
        event.stopImmediatePropagation();
      }

      return this;
    };

    CollapsableMobile.prototype._isMobile = function() {

      return mediaQueries.atSmallViewport();

    };

    CollapsableMobile.prototype._mediaQueryResizeHandler = function() {

      this._openIfNotMobile();

    };

    CollapsableMobile.prototype._openIfNotMobile = function() {

      if (!this._isMobile()) {
        if (!this.isShown) {
          CollapsableMobile.superclass.toggle.call(this);
        }
      }

    };

    return CollapsableMobile;
  });
