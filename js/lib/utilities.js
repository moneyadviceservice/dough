define([], function() {

  'use strict';

  var urlParams;

  /**
   * Converts a querystring into key / value pairs
   * @param {string} query - a querystring eg. key1=val1&key2=val2
   * @returns {{object}} - a hash of key / value pairs. Values are decoded
   */
  function decodeUrlParams (query){
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, ' ')); };

    if (query[0] === '?') {
      query = query.substring(1);
    }

    urlParams =  {};
    while (match = search.exec(query)) {
      urlParams[decode(match[1])] = decode(match[2]);
    }
    return urlParams;
  }

  return {

    /**
     * Extracts a value from a querystring using the supplied key
     * @param {String} key
     * @returns {{String}} - value
     */
    getUrlParam: function(querystring, key) {
      if (!urlParams) {
        urlParams = decodeUrlParams(querystring);
      }
      return urlParams[key];
    },

    /**
     * Convert a currency string into an integer
     * @param {String} currency eg. £24,000.12
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
     * Unescape HTML entities in a string
     * @param {string} input
     * @returns {string}
     */
    decodeHtml: function(input){
      var e = document.createElement('div');
      e.innerHTML = input;
      return e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue;
    }

  };

});
