describe('mediaQueries - fires JS events when breakpoints are crossed', function() {
  'use strict';

  var self = this;

  function require(done, config) {
    requirejs(['jquery', 'squire'], function(jquery, squire) {
      self.injector = new squire();

      self.injector.mock('featureDetect', {
        mediaQueries: config.mediaQuerySupport
      })
      .require(['jquery', 'mediaQueries', 'eventsWithPromises'], function($, mediaQueries, eventsWithPromises) {
          self.mediaQueries = mediaQueries;
          self.eventsWithPromises = eventsWithPromises;
          self.$html = $('<div />').appendTo('body');

          done();
        }, done);
    }, done);
  }

  describe('media queries supported', function() {
    beforeEach(function(done) {
      require(done, { mediaQuerySupport: true });
    });

    it('fires a resize event on load', function() {
      var spy = sinon.spy();
      self.eventsWithPromises.subscribe('mediaquery:resize', spy);
      expect(spy).to.have.been.called;
    });

    it('only fires one resize event if initialised twice', function() {
      var spy = sinon.spy();
      self.eventsWithPromises.subscribe('mediaquery:resize', spy);
      expect(spy).to.have.been.calledOnce;
    });
  });

  describe('media queries not supported', function() {
    beforeEach(function(done) {
      require(done, { mediaQuerySupport: false });
    });

    describe('atSmallViewport', function() {
      it('returns false when media queries are not supported', function() {
        expect(self.mediaQueries.atSmallViewport()).to.be.equal(false);
      });
    });
  });

  afterEach(function() {
    self.$html.empty();
    self.injector.remove();
  });
});
