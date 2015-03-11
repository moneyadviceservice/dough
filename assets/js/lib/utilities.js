/**
 * @module utilities
 * @return {Function} utilities
 */
define([], function() {

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
     * @private
     * @returns {string} eg. tab-selector
     */
    convertCamelCaseToDashed: function(str) {
      return str.replace(/([^\s])([A-Z][a-z])/g, '$1-$2').toLowerCase();
    }

  };

});
