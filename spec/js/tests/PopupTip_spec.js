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

        self.clock = sinon.useFakeTimers();
        self.$popupTip = $(fixture.el).find('[data-dough-component="PopupTip"]');
        self.obj = new PopupTip(self.$popupTip);
        self.obj.init();
        self.offset = self.obj.offset;
        self.$container = self.$popupTip.find('[data-dough-popup-container]');
        self.$close = self.$popupTip.find('[data-dough-popup-close]');
        self.$trigger_1 = $(document).find('#trigger_1');
        self.$container_1 = $(document).find('#container_1');
        self.$trigger_2 = $(document).find('#trigger_2');
        self.$container_2 = $(document).find('#container_2');
        self.$trigger_3 = $(document).find('#trigger_3');
        self.$container_3 = $(document).find('#container_3');
        self.$component_mobile = $(document).find('#PopupTip_mobile');

        done();
      }, done);
  });

  afterEach(function() {
    fixture.cleanup();
    this.clock.restore();
  });

  describe('Default behaviour', function() {
    it('hides the popup content on load', function() {
      expect(this.$container).to.not.have.class(activeClass);
    });
  });

  describe('Dynamic behaviour', function() {
    beforeEach(function() {
      this.$container
        .removeClass(activeClass)
        .addClass(inactiveClass);
    });

    it('displays the popup on trigger click', function() {
      this.$trigger_1.click();
      expect(this.$container).to.have.class(activeClass);
    });

    it('aligns the popup with trigger on LHS/top when icon position < 50% viewport width on desktop', function() {
      var trigger = this.$trigger_1[0];
      var container = this.$container_1[0];

      trigger.click();

      if (!this.obj.atSmallViewport()) {
        expect(container.getBoundingClientRect().left).to.equal(trigger.getBoundingClientRect().left + this.offset);
        expect(container.getBoundingClientRect().top).to.equal(trigger.getBoundingClientRect().top + this.offset);
      }
    });

    it('aligns the popup with trigger on RHS/top when icon position > 50% viewport width on desktop', function() {
      var trigger = this.$trigger_2[0];
      var container = this.$container_2[0];

      trigger.click();

      if (!this.obj.atSmallViewport()) {
        expect(container.getBoundingClientRect().left).to.equal(trigger.getBoundingClientRect().left - container.getBoundingClientRect().width - this.offset);
        expect(container.getBoundingClientRect().top).to.equal(trigger.getBoundingClientRect().top + this.offset);
      }
    });

    it('displays the popup full width on mobile', function() {
      var trigger = this.$trigger_3[0];
      var container = this.$container_3[0];
      var component = this.$component_mobile[0];

      trigger.click();

      if (this.obj.atSmallViewport()) {
        expect(container.getBoundingClientRect().left).to.equal(component.getBoundingClientRect().left);
        expect(container.getBoundingClientRect().width).to.equal(component.getBoundingClientRect().width);
      }
    });

    it('sets the correct position of an open popup when the viewport resizes when icon position < 50% viewport width on desktop', function() {
      var trigger = this.$trigger_1[0];
      var container = this.$container_1[0];

      $(container)
        .removeClass(inactiveClass)
        .addClass(activeClass);

      $(window).resize();

      this.clock.tick(this.obj.debounceWait);

      if (!this.obj.atSmallViewport()) {
        expect(container.getBoundingClientRect().left).to.equal(trigger.getBoundingClientRect().left + this.offset);
        expect(container.getBoundingClientRect().top).to.equal(trigger.getBoundingClientRect().top + this.offset);
      }
    });

    it('sets the correct position of an open popup when the viewport resizes when icon position > 50% viewport width on desktop', function() {
      var trigger = this.$trigger_2[0];
      var container = this.$container_2[0];

      $(container)
        .removeClass(inactiveClass)
        .addClass(activeClass);

      $(window).resize();

      this.clock.tick(this.obj.debounceWait);

      if (!this.obj.atSmallViewport()) {
        expect(container.getBoundingClientRect().left).to.equal(trigger.getBoundingClientRect().left - container.getBoundingClientRect().width - this.offset);
        expect(container.getBoundingClientRect().top).to.equal(trigger.getBoundingClientRect().top + this.offset);
      }
    });

    it('sets the correct position of an open popup when the viewport resizes on mobile', function() {
      var container = this.$container_3[0];
      var component = this.$component_mobile[0];

      $(container)
        .removeClass(inactiveClass)
        .addClass(activeClass);

      $(window).resize();

      this.clock.tick(this.obj.debounceWait);

      if (this.obj.atSmallViewport()) {
        expect(container.getBoundingClientRect().left).to.equal(component.getBoundingClientRect().left);
        expect(container.getBoundingClientRect().width).to.equal(component.getBoundingClientRect().width);
      }
    });

    it('closes the popup on close button click', function() {
      this.$close.click();
      expect(this.$container).to.have.class(inactiveClass);
    });
  });
});
