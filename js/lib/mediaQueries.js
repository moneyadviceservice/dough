define(['jquery', 'eventsWithPromises', 'jqueryThrottleDebounce'], function ($, eventsWithPromises) {

  'use strict';

  var current = false,
      testElement = $('<div class="js-mediaquery-test" />');

  function checkSize(forceEvent) {
    var newSize = getSize();
    if ((newSize !== current) || forceEvent) {
      current = newSize;
      eventsWithPromises.publish('mediaquery:resize', {
        newSize: newSize
      });
    }
  }

  function getSize() {
    return window.getComputedStyle(testElement[0], ':after').getPropertyValue('content');
  }

  return {
    init: function ($el) {

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
  };

});
