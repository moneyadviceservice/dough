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
          self.closeBtn = $(fixture.el).find('[data-dough-close]');
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

  describe('When the close icon is clicked', function() {
    beforeEach(function() {
      this.CovidBanner.init(); 
      this.setCookieSpy = sinon.spy(this.CovidBanner, '_setCookie');
      this.removeBannerSpy = sinon.spy(this.CovidBanner, '_removeBanner');
    }); 

    afterEach(function() {
      this.setCookieSpy.restore(); 
      this.removeBannerSpy.restore(); 
    }); 

    it('Calls the setCookie method', function() {
      this.closeBtn.trigger('click'); 

      expect(this.setCookieSpy.calledOnce).to.be.true;
    });

    it('Calls the removeBanner method', function() {
      this.closeBtn.trigger('click'); 

      expect(this.removeBannerSpy.calledOnce).to.be.true;
    });
  });
});
