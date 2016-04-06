define(['jquery',
    'DoughBaseComponent',
    'Collapsable',
    'featureDetect',
    'mediaQueries'],
  function($, DoughBaseComponent, Collapsable, featureDetect, mediaQueries) {

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

      // Copy the desktop specific heading to outside of the button.
      label = this.$triggers[0].childNodes[1].wholeText;
      this.$triggers.after('<span class="collapsable-mobile__desktop-label">' + label + '</span>');

      return this;
    };

    CollapsableMobile.prototype.toggle = function(forceTo, focusTarget) {
      // Override toggle()

      // Only call it's super method if on Mobile.
      if (mediaQueries.atSmallViewport()) {
        CollapsableMobile.superclass.toggle.call(this, forceTo, focusTarget);
      }
      else {
        event.preventDefault();
        event.stopImmediatePropagation();
      }

      return this;
    };

    return CollapsableMobile;
  });
