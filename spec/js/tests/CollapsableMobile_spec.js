describe.only('Visibility toggler on Mobile', function() {

  'use strict';

  beforeEach(function(done) {
    var self = this;

    this.$sandbox = $('<div />').appendTo('body');

    requirejs(['componentLoader', 'CollapsableMobile', 'eventsWithPromises'],
      function(componentLoader, CollapsableMobile, eventsWithPromises) {
        self.componentLoader = componentLoader;
        self.CollapsableMobile = CollapsableMobile;
        self.eventsWithPromises = eventsWithPromises;

        self.beforeEachHook = function(done, fixtureHTML) {
          this.$sandbox.html(fixtureHTML || $(window.__html__['spec/js/fixtures/CollapsableMobile.html']));

          this.componentLoader.init(this.$sandbox)
            .then(function() {
              this.$trigger = this.$sandbox.find('button');
              this.$target = this.$sandbox.find('[data-dough-collapsable-target]');
              this.$header = this.$sandbox.find('.collapsable__targets');
              this.$desktopLabel = this.$sandbox.find('.collapsable-mobile__desktop-label');
              this.breakPoint = 720;
              if (document.width < this.breakPoint) {
                this.isMobile = true;
              }
              done();
            }.bind(this));
        };
        done();
      });
  });

  afterEach(function() {
    this.$sandbox.empty();
  });

  describe('Testing the initialisation', function() {
    beforeEach(function(done) {
      this.beforeEachHook.call(this, done);
    });

    it('copies the desktop heading to outside the button', function() {
      // Get the immediate element text without any child element text:
      var mobileButtonText = this.$trigger.clone().children()
        .remove().end().text();
      expect(mobileButtonText).to.equal(this.$desktopLabel.text());
    });

    it('sets the aria-expanded attribute to false', function() {
      expect(this.$trigger.attr('aria-expanded')).to.equal('false');
    });
  });


  describe('Testing the toggle function', function() {
    beforeEach(function(done) {
      this.beforeEachHook.call(this, done);
    });

    it('has the active class after being toggled on Mobile', function() {
      this.$trigger[0].click();

      if (this.isMobile) {
        expect(this.$target).to.have.class('is-active');
      } else {
        expect(this.$target).to.not.have.class('is-active');
      }
    });

    it('removes the active class after being toggled twice', function() {
      this.$trigger[0].click();
      this.$trigger[0].click();
      expect(this.$target).to.not.have.class('is-active');
    });
  });
});
