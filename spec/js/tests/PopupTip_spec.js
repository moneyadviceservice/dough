describe.only('Displays Popup Tooltip', function() {
  'use strict';

  // var webPage = require('webpage');
  // console.log(webPage);

  var activeClass   = 'is-active',
      inactiveClass = 'is-inactive';

  beforeEach(function(done) {
    var self = this;

    requirejs(
      ['jquery', 'PopupTip'], function($, PopupTip) {
        self.$html    = $(window.__html__['spec/js/fixtures/PopupTip.html']).appendTo('body');
        self.PopupTip = PopupTip;
        // self.webPage = require('webpage');

        done();
      }, done);
  });

  afterEach(function() {
    this.$html.remove();
  });

  describe('Default behaviour', function() {

    beforeEach(function(done) {
      this.$html      = $(window.__html__['spec/js/fixtures/PopupTip.html']);
      this.$trigger   = this.$html.find('[data-dough-popup-trigger]');
      this.$container = this.$html.find('[data-dough-popup-container]');
      this.$close     = this.$html.find('[data-dough-popup-close]');
      this.popupTip   = new this.PopupTip(this.$html);
      this.popupTip.init();

      // this.page = this.webPage.create();

      // console.log(page);

      done();
    });

    it('hides the popup content on load', function() {
      expect(this.$container).to.not.have.class(activeClass);
    });

    it('displays the popup in the correct position on trigger click', function() {
      this.$trigger.click();
      expect(this.$container).to.have.class(activeClass);

      var trigger = this.$trigger[0];
      console.log(trigger.getBoundingClientRect());
      console.log($(window).width());
      // console.log($(trigger).width());
    });

    it('closes the popup on close button click', function() {
      this.$close.click();
      expect(this.$container).to.have.class(inactiveClass);
    });

  });

});
