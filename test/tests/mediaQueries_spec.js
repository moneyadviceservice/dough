describe('mediaQueries - fires JS events when breakpoints are crossed', function() {

  'use strict';


  beforeEach(function (done) {
    var self = this;
    requirejs(
        ['jquery', 'mediaQueries', 'eventsWithPromises'],
        function ($, mediaQueries, eventsWithPromises) {
          self.mediaQueries = mediaQueries;
          self.eventsWithPromises = eventsWithPromises;
          self.$html = $('<div />');
          done();
        }, done);
  });

  afterEach(function(){
    this.$html.empty();
  });

  it('places a media query test element in the DOM', function() {
    this.mediaQueries.init(this.$html);
    expect(this.$html.children('.js-mediaquery-test').length).to.equal(1);
  });

  it('fires a resize event on load', function() {
    var spy = sinon.spy();
    this.eventsWithPromises.subscribe('mediaquery:resize', spy);
    this.mediaQueries.init(this.$html);
    expect(spy).to.have.been.called;
  });

  it('doesn\'t re-add the element if initialised twice', function() {
    this.mediaQueries.init(this.$html);
    this.mediaQueries.init(this.$html);
    expect(this.$html.children('.js-mediaquery-test').length).to.equal(1);
  });

  it('only fires one resize event if initialised twice', function() {
    var spy = sinon.spy();
    this.eventsWithPromises.subscribe('mediaquery:resize', spy);
    this.mediaQueries.init(this.$html);
    this.mediaQueries.init(this.$html);
    spy.should.have.been.calledOnce;
  });

});
