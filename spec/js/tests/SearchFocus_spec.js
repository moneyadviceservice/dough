describe('Sets focus after search', function() {
  'use strict';

  beforeEach(function(done) {
    var self = this;

    requirejs(
      ['jquery', 'SearchFocus'], function($, SearchFocus) {
        self.$html = $(window.__html__['spec/js/fixtures/SearchFocus.html']).appendTo('body');
        self.SearchFocus = SearchFocus;

        done();
      }, done);
  });

  afterEach(function() {
    this.$html.remove();
  });

  describe('Returns results', function() {
    beforeEach(function(done) {
      this.fixtureHTML = $(this.$html).find('#results');
      this.resultHeader = $(this.fixtureHTML).find('a').get(0);
      this.component = $(this.fixtureHTML).find('[data-dough-component="SearchFocus"]');
      this.searchFocus = new this.SearchFocus(this.component);
      this.searchFocus.init();

      done();
    });

    it('checks for returned results', function() {
      expect(this.resultHeader).to.equal(document.activeElement);
    });
  });

  describe('Returns no results', function() {
    beforeEach(function(done) {
      this.fixtureHTML = $(this.$html).find('#no-results');
      this.inputField = $(this.fixtureHTML).find('[data-dough-search-input]').get(0);
      this.component = $(this.fixtureHTML).find('[data-dough-component="SearchFocus"]');
      this.searchFocus = new this.SearchFocus(this.component);
      this.searchFocus.init();

      done();
    });

    it('checks for returned results', function() {
      expect(this.inputField).to.equal(document.activeElement);
    });
  });
});
