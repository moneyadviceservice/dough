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
        self.obj.init();
        self.offset = self.obj.offset;
        self.$popupTip_shortText = self.$popupTip[0];
        self.$popupTip_longText = self.$popupTip[1];
        self.$trigger = self.$popupTip.find('[data-dough-popup-trigger]');
        self.$container = self.$popupTip.find('[data-dough-popup-container]');
        self.$close = self.$popupTip.find('[data-dough-popup-close]');

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
      this.$trigger.click();
      expect(this.$container).to.have.class(activeClass);

      var trigger_1 = document.getElementById('trigger_1');
      var container_1 = document.getElementById('container_1');
      var trigger_2 = document.getElementById('trigger_2');
      var container_2 = document.getElementById('container_2');

      // Short text
      $(trigger_1).click();

      // Position is dynamically set only on larger viewports
      if (this.obj.atLargeViewport) {
        // Overlay aligns with trigger on LHS and top when icon < 50% viewport width
        expect(container_1.getBoundingClientRect().left).to.equal(trigger_1.getBoundingClientRect().left + this.offset);
        expect(container_1.getBoundingClientRect().top).to.equal(trigger_1.getBoundingClientRect().top + this.offset);
      }

      // Long text
      $(trigger_2).click();

      // Position is dynamically set only on larger viewports
      if (this.obj.atLargeViewport) {
        // Overlay aligns with trigger on LHS and top when icon > 50% viewport width
        expect(container_2.getBoundingClientRect().left).to.equal(trigger_2.getBoundingClientRect().left - container_2.getBoundingClientRect().width - this.offset);
        expect(container_2.getBoundingClientRect().top).to.equal(trigger_2.getBoundingClientRect().top + this.offset);
      }
    });

    it('closes the popup on close button click', function() {
      this.$close.click();
      expect(this.$container).to.have.class(inactiveClass);
    });
  });
});
