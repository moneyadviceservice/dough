describe('Displays Popup Tooltip', function() {
  'use strict';

  var activeClass   = 'is-active',
      inactiveClass = 'is-inactive';

  beforeEach(function(done) {
    var self = this;

    requirejs(
      ['jquery', 'PopupTip'], function($, PopupTip) {
        self.$html    = $(window.__html__['spec/js/fixtures/PopupTip.html']).appendTo('body');
        self.PopupTip = PopupTip;
        
        done();
      }, done);
  });

  afterEach(function() {
    this.$html.remove();
  });

  describe('Default behaviour', function() {

    beforeEach(function(done) {
      this.$html    = $(window.__html__['spec/js/fixtures/PopupTip.html']);
      this.$trigger = this.$html.find('[data-dough-popup-trigger]');
      this.$content = this.$html.find('[data-dough-popup-content]');
      this.$close   = this.$html.find('[data-dough-popup-close]');
      this.popupTip = new this.PopupTip(this.$html);
      this.popupTip.init();

      done();
    });

    it('hides the popup content on load', function() {
      expect(this.$content).to.not.have.class(activeClass);    
    });

    it('displays the popup on trigger click', function() {
      this.$trigger.click();
      expect(this.$content).to.have.class(activeClass); 
    });

    it('closes the popup on close button click', function() {
      this.$close.click();
      expect(this.$content).to.have.class(inactiveClass);
    });

  });

});
