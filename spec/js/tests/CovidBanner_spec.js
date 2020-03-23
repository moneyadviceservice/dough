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

          done();
        }, done);
  });

  afterEach(function() {
    fixture.cleanup();
  });

  describe('When the component is initialised', function() {
    beforeEach(function() {
      this.setUpEventsSpy = sinon.spy(this.CovidBanner, '_setUpEvents'); 
    });

    afterEach(function() {
      this.setUpEventsSpy.restore(); 
    }); 

    it('Calls the setUpEvents method', function() {
      this.CovidBanner.init();

      expect(this.setUpEventsSpy.calledOnce).to.be.true; 
    }); 
  }); 
});
