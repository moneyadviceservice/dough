describe('mediaQueries - fires JS events when breakpoints are crossed', function() {

  'use strict';


  beforeEach(function (done) {
    var self = this;
    requirejs(
        ['jquery', 'mediaQueries', 'eventsWithPromises'],
        function ($, mediaQueries, eventsWithPromises) {
          self.mediaQueries = mediaQueries;
          self.eventsWithPromises = eventsWithPromises;
          done();
        }, done);
  });

  it('places a media query test element in the DOM', function() {
    this.mediaQueries.init($('body'));
    expect($('body > .js-mediaquery-test').length).to.equal(1);
  });

  it('fires a resize event on load', function() {
    var spy = sinon.spy();
    this.eventsWithPromises.subscribe('mediaquery:resize', spy);
    this.mediaQueries.init($('body'));
    expect(spy).to.have.been.called;
  });

});
