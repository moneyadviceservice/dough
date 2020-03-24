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
          self.hideClass = self.CovidBanner.hideClass;

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
      this.hideBannerSpy = sinon.spy(this.CovidBanner, '_hideBanner');
    }); 

    afterEach(function() {
      this.setCookieSpy.restore(); 
      this.hideBannerSpy.restore(); 
    }); 

    it('Calls the setCookie method', function() {
      this.closeBtn.trigger('click'); 

      expect(this.setCookieSpy.calledOnce).to.be.true;
    });

    it('Calls the hideBanner method', function() {
      this.closeBtn.trigger('click'); 

      expect(this.hideBannerSpy.calledOnce).to.be.true;
    });
  });

  describe('When the setCookie method is called', function() {
    beforeEach(function() {
      // Create some random cookies
      document.cookie = '';
      document.cookie = 'firstcookie=randomcookie';
      document.cookie = 'secondcookie=anotherrandomcookie';
    }); 

    it('Sets the cookie to the correct value', function() {
      this.CovidBanner._setCookie(); 

      var allCookies = document.cookie.replace(/ /g, ''); 

      expect(allCookies.indexOf('_covid_banner=y') >= 0).to.be.true; 
    }); 
  }); 

  describe('When the hideBanner method is called', function() {
    it('Hides the banner', function() {
      this.CovidBanner._hideBanner(); 

      expect(this.component).to.have.class(this.hideClass); 
    }); 
  }); 
});
