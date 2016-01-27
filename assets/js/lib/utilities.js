/**
 * @module utilities
 * @return {Function} utilities
 */
define('utilities', [], function() {

  'use strict';

  return {

    /**
     * Convert a currency string into an integer.
     * @param {String} currency e.g. £24,000.12
     * @returns {Number} eg. 24000
     */
    currencyToInteger: function(currency) {
      return parseInt(currency.replace(/[£,]/g, ''), 10);
    },

    /**
     * Convert a number to a currency formatted string (rounded to the nearest integer)
     * @param {Number} num eg. 345893.90
     * @returns {String} eg. £345893
     */
    numberToCurrency: function(num) {
      var re = '\\d(?=(\\d{3})+$)';
      return '£' + Math.round(num).toFixed(0).replace(new RegExp(re, 'g'), '$&,');
    },

    /**
     * Converts a CamelCase string to a dashed-one
     * @param {string} str eg. TabSelector
     * @returns {string} eg. tab-selector
     */
    convertCamelCaseToDashed: function(str) {
      if (str.length > 2) {
        // First replace aA patterns with a-A
        str = str.replace(/([a-z])([A-Z])/g, '$1-$2')
                  // then AAa patterns with A-Aa
                 .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2');
      }
      return str.toLowerCase();
    },

    /**
     * Log function which checks for console presence
     * @param {string} message Log message
     * @param {string} type    Type of log message warn/info/table etc
     */
    log: function(message, type) {
      type = type ? type : 'log';

      if (this.doesConsoleExist(type)) {
        window.console[type](message);
      }
    },

    /**
     * Check to see if the console object exists
     * @param  {string} type The console method name
     * @return {Boolean}
     */
    doesConsoleExist: function(type) {
      return typeof window.console !== 'undefined' &&
             typeof window.console[type] !== 'undefined';
    },

    /**
     * Rate limit the amount of times a method is called
     * @param  {function} func Function to be called
     * @param  {Number} wait How long to wait until func is called in milliseconds
     * @return {function}
     */
    debounce: function(func, wait) {
      var timeout;

      return function() {
        var context = this,
            args = arguments,
            later = function() {
              timeout = null;
              func.apply(context, args);
            };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }
  };
});
