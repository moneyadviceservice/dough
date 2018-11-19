describe('Displays Popup Tooltip', function() {
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
        self.$container = self.$popupTip.find('[data-dough-popup-container]');
        self.$close = self.$popupTip.find('[data-dough-popup-close]');
        self.$trigger_1 = document.getElementById('trigger_1');
        self.$container_1 = document.getElementById('container_1');
        self.$trigger_2 = document.getElementById('trigger_2');
        self.$container_2 = document.getElementById('container_2');

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
  });

  describe('Dynamic behaviour', function() {
    it('displays the popup on trigger click', function() {
      this.$trigger_1.click();
      expect(this.$container).to.have.class(activeClass);
    });

    it('aligns the popup with trigger on LHS and top when icon position < 50% viewport width', function() {
      this.$trigger_1.click();

      // Position is dynamically set only on larger viewports
      if (this.obj.atLargeViewport) {
        expect(this.$container_1.getBoundingClientRect().left).to.equal(this.$trigger_1.getBoundingClientRect().left + this.offset);
        expect(this.$container_1.getBoundingClientRect().top).to.equal(this.$trigger_1.getBoundingClientRect().top + this.offset);
      }
    });

    it('aligns the popup with trigger on RHS and top when icon position > 50% viewport width', function() {
      var trigger_2 = document.getElementById('trigger_2');
      var container_2 = document.getElementById('container_2');

      $(trigger_2).click();

      // Position is dynamically set only on larger viewports
      if (this.obj.atLargeViewport) {
        expect(this.$container_2.getBoundingClientRect().left).to.equal(this.$trigger_2.getBoundingClientRect().left - this.$container_2.getBoundingClientRect().width - this.offset);
        expect(this.$container_2.getBoundingClientRect().top).to.equal(this.$trigger_2.getBoundingClientRect().top + this.offset);
      }
    });

    it('closes the popup on close button click', function() {
      this.$close.click();
      expect(this.$container).to.have.class(inactiveClass);
    });
  });
});
