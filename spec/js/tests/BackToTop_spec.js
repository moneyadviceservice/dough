describe('Back to Top link', function() {
  'use strict';

  beforeEach(function(done) {
    var self = this;

    fixture.setBase('spec/js/fixtures');

    requirejs(
        ['jquery', 'BackToTop'],
        function($, BackToTop) {
          fixture.load('BackToTop.html');
          
          self.component = $(fixture.el).find('[data-dough-component="BackToTop"]');
          self.component.height(4000);

          self.backToTop = new BackToTop(self.component);
          self.triggerPoint = self.backToTop.config.triggerPoint;
          self.showClass = self.backToTop.showClass;
          
          self.backToTop.init();

          self.back_to_top_link = $(fixture.el).find('.back_to_top__link');

          done();
        }, done);
  });

  afterEach(function() {
    fixture.cleanup();
  });

  describe('Set up link', function() {
    it('Adds the link to the DOM', function() {
      expect(this.back_to_top_link.length).to.equal(1);
    });
  });

  describe('Set up footer', function() {
    it('Adds extra space to footer', function() {
      expect($(fixture.el).find('.l-footer-secondary')).to.have.class('back_to_top__spacer');
    });
  });

  describe('Tests link activated state', function() {
    beforeEach(function() {
      this.stub = sinon.stub(this.backToTop, '_getScrollAmount');
    });

    afterEach(function() {
      this.stub.restore();
    });

    it('Does not display link when user has scrolled up to trigger point in all views', function() {
      // simulate scrolling to less than trigger point
      this.stub.returns(this.triggerPoint - 1);
      $(window).trigger('scroll');

      expect(this.back_to_top_link).to.not.have.class(this.showClass);
    });

    it('Displays link when user has scrolled to trigger point in mobile view only', function() {
      // simulate scrolling to trigger point
      this.stub.returns(this.triggerPoint);
      $(window).trigger('scroll');

      if (this.backToTop.atSmallViewport) {
        expect(this.back_to_top_link).to.have.class(this.showClass);
      } else {
        expect(this.back_to_top_link).to.not.have.class(this.showClass);
      }
    });
  });

  describe('Tests link behaviour when activated', function() {
    beforeEach(function() {
      this.back_to_top_link.trigger('click');
    });

    it('Returns user to top of page when clicked', function() {
      expect($(window).scrollTop()).to.equal(0);
    });

    it('Hides link when clicked', function() {
      expect(this.back_to_top_link).to.not.have.class(this.showClass);
    });
  });
});
