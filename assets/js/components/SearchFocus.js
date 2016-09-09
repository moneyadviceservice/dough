/**
 * Search Focus
 *
 * Requires an element to have a data-dough-component="SearchFocus" attribute.
 *
 * This checks the search results page and shifts the focus of the page depending on its content:
 * - if a set of results is listed focus is on the first of these
 * - if there are no results focus is on the input field
 *
 * @module SearchFocus
 * @returns {class} SearchFocus
 */
define(['jquery', 'DoughBaseComponent'], function($, DoughBaseComponent) {
  'use strict';

  var SearchFocus,
      defaultConfig = {
          selectors: {
          searchResultsItem: '[data-dough-search-results-item]',
          noResults: '[data-dough-search-noresults]',
          searchInput: '[data-dough-search-input]'
        }
      };

  /**
   * @constructor
   * @extends {DoughBaseComponent}
   * @returns {SearchFocus}
   */
  SearchFocus = function($el, config) {
    SearchFocus.baseConstructor.call(this, $el, config, defaultConfig);

    this.results = this.$el.find(this.config.selectors.searchResultsItem);
    this.noresults = this.$el.find(this.config.selectors.noResults);
    this.searchInput = this.$el.find(this.config.selectors.searchInput);
  };

  DoughBaseComponent.extend(SearchFocus);

  SearchFocus.componentName = 'SearchFocus';

  /**
   * Initialise component
   * @param {Object} initialised Promise passed from eventsWithPromises (RSVP Promise).
   */
  SearchFocus.prototype.init = function(initialised) {
    this._checkResults();
    this._initialisedSuccess(initialised);
  };

  SearchFocus.prototype._checkResults = function() {
    var focussedElement;

    if (this.results.length) {
      focussedElement = this.results[0].getElementsByTagName('a')[0];
    } else if (this.noresults.length) {
      focussedElement = this.searchInput[0];
    }

    $(focussedElement).focus();
  };

  return SearchFocus;
});
