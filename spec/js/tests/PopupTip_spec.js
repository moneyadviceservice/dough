describe.only('Displays Popup Tooltip', function() {
  'use strict';

  var activeClass   = 'is-active',
      inactiveClass = 'is-inactive';

  beforeEach(function(done) {
    var self = this;

    fixture.setBase('spec/js/fixtures');

    requirejs(
      ['jquery', 'PopupTip'], function($, PopupTip) {
        fixture.load('PopupTip.html');

        self.$popupTip = $(fixture.el).find('[data-dough-component="PopupTip"]');
        self.obj = new PopupTip(self.$popupTip);
        self.$trigger   = self.$popupTip.find('[data-dough-popup-trigger]');
        self.$container = self.$popupTip.find('[data-dough-popup-container]');
        self.$close     = self.$popupTip.find('[data-dough-popup-close]');

        self.obj.init();

        done();
      }, done);
  });

  afterEach(function() {
    fixture.cleanup();
  });

  describe('Default behaviour', function() {
    it('hides the popup content on load', function() {
      expect(this.$container).to.not.have.class(activeClass);
    });

    it('displays the popup in the correct position on trigger click', function() {
      var trigger = this.$trigger[0];

      this.$trigger.click();
      expect(this.$container).to.have.class(activeClass);

      console.log(trigger.getBoundingClientRect());
      console.log($(window).width());
    });

    it('closes the popup on close button click', function() {
      this.$close.click();
      expect(this.$container).to.have.class(inactiveClass);
    });
  });
});
