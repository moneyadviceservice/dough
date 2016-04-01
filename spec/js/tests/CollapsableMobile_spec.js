describe('Visibility toggler on Mobile', function() {

  'use strict';

  beforeEach(function(done) {
    var self = this;

    this.$sandbox = $('<div />').appendTo('body');

    requirejs(['componentLoader', 'CollapsableMobile', 'eventsWithPromises', 'mediaQueries'],
      function(componentLoader, CollapsableMobile, eventsWithPromises, mediaQueries) {
        self.componentLoader = componentLoader;
        self.CollapsableMobile = CollapsableMobile;
        self.eventsWithPromises = eventsWithPromises;
        self.mediaQueries = mediaQueries;

        self.beforeEachHook = function(done, fixtureHTML) {
          this.$sandbox.html(fixtureHTML || $(window.__html__['spec/js/fixtures/CollapsableMobile.html']));
          this.componentLoader.init(this.$sandbox)
            .then(function() {
                this.$trigger = this.$sandbox.find('button');
                this.$target = this.$sandbox.find('[data-dough-collapsable-target]');
                this.$header = this.$sandbox.find('.collapsable__targets');
                this.$desktopLabel = this.$sandbox.find('.collapsable-mobile__desktop-label');
                done();
              }
              .bind(this));
        };
        done();
      });
  });

  afterEach(function() {
    this.$sandbox.empty();
  });

  describe('General init behaviour', function() {

    beforeEach(function(done) {
      this.beforeEachHook.call(this, done);
    });

    it('copies the desktop heading to outside the button', function() {
      // Get the element text without any child text:
      var mobileButtonText = this.$trigger.clone().children()
        .remove().end().text();
      expect(mobileButtonText).to.equal(this.$desktopLabel.text());
    });
  });


  describe('Mobile screen size', function() {

    beforeEach(function(done) {
      // Stub the ismobile function to return true
      sinon.stub(this.CollapsableMobile.prototype, '_isMobile', function() {
        return true;
      });
      this.beforeEachHook.call(this, done);
    });

    it('Has the active class after being triggered', function() {
      this.$trigger[0].click();
      expect(this.$target).to.have.class('is-active');
    });

    it('Removes the active class after being toggled twice', function() {
      this.$trigger[0].click();
      this.$trigger[0].click();
      expect(this.$target).to.not.have.class('is-active');
    });

    afterEach(function() {
      this.CollapsableMobile.prototype._isMobile.restore();
    });
  });


  describe('', function() {

    beforeEach(function(done) {
      this.beforeEachHook.call(this, done);
    });

    it('Does not have the active class after being triggered', function() {
      // Stub the ismobile function to always return false
      sinon.stub(this.CollapsableMobile.prototype, '_isMobile', function() {
        return false;
      });
      this.$trigger[0].click();
      expect(this.$target).to.not.have.class('is-active');
    });

    afterEach(function() {
      this.CollapsableMobile.prototype._isMobile.restore();
    });
  });

  describe('A test that subscribes to the media query handler', function() {

    beforeEach(function(done) {
      this.beforeEachHook.call(this, done);
    });

    it('responds to the mediaquery resize event', function() {
      var spy = sinon.spy(this.CollapsableMobile.prototype, '_openIfNotMobile'),
        spyStartCount = spy.callCount;
      this.eventsWithPromises.publish('mediaquery:resize', {});
      expect(spy.callCount).to.be.above(spyStartCount);
    });

    it('adds the active class when resized to desktop', function() {
      // Override the mediaqueries viewport checker
      var stubSmallViewport = true;
      sinon.stub(this.mediaQueries, 'atSmallViewport', function() {
        return stubSmallViewport;
      });
      this.eventsWithPromises.publish('mediaquery:resize', {});
      // Check mobile version is working as expected
      this.$trigger[0].click();
      expect(this.$target).to.have.class('is-active');
      this.$trigger[0].click();
      expect(this.$target).to.not.have.class('is-active');
      // Resize to desktop and ensure the class is added
      stubSmallViewport = false;
      this.eventsWithPromises.publish('mediaquery:resize', {});
      expect(this.$target).to.have.class('is-active');
      //Restore stub function
      this.mediaQueries.atSmallViewport.restore();
    });
  });
});
