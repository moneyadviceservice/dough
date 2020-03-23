describe.only('Coronavirus Banner', function() {
  'use strict';

  beforeEach(function(done) {
    var self = this;

    fixture.setBase('spec/js/fixtures');

    requirejs(
        ['jquery', 'CovidBanner'],
        function($, CovidBanner) {
          fixture.load('CovidBanner.html');

          self.component = $(fixture.el).find('[data-dough-component="CovidBanner"]');

          self.CovidBanner = new CovidBanner(self.component);
          
          self.CovidBanner.init();

          done();
        }, done);
  });

  afterEach(function() {
    fixture.cleanup();
  });

  describe('Do nothing', function() {
    it('Does nothing', function() {
      expect(1).to.equal(1);
    });
  });
});
