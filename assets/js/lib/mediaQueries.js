/**
 * Gets the current media query and publishes it via an event with _eventsWithPromises_.
 *
 *
 * @example <caption>To subscribe to the event:</caption>
 *
 * eventsWithPromises.subscribe('mediaquery:resize', function(newSize) {
 *  // Use newSize
 *  // if(newSize === 'mq-m') {}
 * });
 *
 * @module mediaQueries
 * @returns {Function} mediaQueries - with `atSmallViewport` public method.
 */
define(['jquery', 'eventsWithPromises', 'featureDetect', 'jqueryThrottleDebounce'],
    function($, eventsWithPromises, featureDetect) {

  'use strict';

  var current = false,
      testElement = $('<div class="js-mediaquery-test" />');

  /**
   *
   * Gets current media query value (set on the `testElement`) and publishes an event `mediaquery:resize` via _eventsWithPromises_.
   * @function
   * @param  {Boolean} forceEvent Bypass the `current` and `newSize` and publish the event.
   */
  function checkSize(forceEvent) {
    var newSize = getSize();
    if ((newSize !== current) || forceEvent) {
      current = newSize;
      eventsWithPromises.publish('mediaquery:resize', {
        newSize: newSize // `mq-xs` or `mq-s`, etc
      });
    }
  }

  /**
   * Gets current media query value as set using the
   * Technique explained here: [Write Simple, Elegant and Maintainable Media Queries with Sass](http://davidwalsh.name/device-state-detection-css-media-queries-javascript)
   * @function
   * @return {String} mq-xs or mq-s or mq-m or mq-l or mq-xl
   */
  function getSize() {
    return window.getComputedStyle(testElement[0], ':after').getPropertyValue('content');
  }

  /**
   * Initialise module
   * @function
   */
  function init ($el) {

    if (!featureDetect.mediaQueries) {
      return;
    }

    $el = $el || $('body');
    if (!$(testElement).closest($el).length) {
      $el.append(testElement);

      // Create the listener function
      var updateLayout = $.debounce(250, checkSize);

      // Add the event listener
      window.addEventListener('resize', updateLayout, false);
      // Run to get initial value;
      checkSize();
    } else {
      checkSize(true);
    }
  }

  init();

  return {
    /**
     * @returns {Boolean} Returns true if current viewport is either `mq-xs` or `mq-s`
     */
    atSmallViewport: function() {
      return ($.inArray(getSize(), ['mq-xs', 'mq-s']) > -1);
    }

  };

});
