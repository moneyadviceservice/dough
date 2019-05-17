describe('Chat Popup', function() {
  'use strict';

  beforeEach(function(done) {
    var self = this;

    fixture.setBase('spec/js/fixtures');

    requirejs(
        ['jquery', 'BackToTop', 'ChatPopup'],
        function($, BackToTop, ChatPopup) {
          fixture.load('ChatPopup.html');

          self.$backToTopcomponent = $(fixture.el).find('[data-dough-component="BackToTop"]');
          self.backToTop = new BackToTop(self.$backToTopcomponent);
          self.triggerPoint = self.backToTop.config.triggerPoint;
          self.$backToTopcomponent.height(4000);
          self.backToTop.init();

          self.$popupComponent = $(fixture.el).find('[data-dough-component="ChatPopup"]');
          self.chatPopup = new ChatPopup(self.$popupComponent);
          self.chatPopup.init();
          
          done();
        }, done);
  });

  afterEach(function() {
    fixture.cleanup();
  });

  describe('Raising the Webchat and Whatsapp popup in article pages', function() {

    beforeEach(function() {
      this.stub = sinon.stub(this.backToTop, '_getScrollAmount');
    });

    afterEach(function() {
      this.stub.restore();
    });

    it('Validates original popup state', function() {
      expect(this.$popupComponent).not.to.have.class('chat-popup--raised');
    });

    it('Raises the popup in article pages on small screens', function() {
      
      // simulate scrolling to over the trigger point
      this.stub.returns(this.triggerPoint + 1);
      $(window).trigger('scroll');
      if (this.backToTop.atSmallViewport) {
        expect(this.$popupComponent).to.have.class('chat-popup--raised');
      } else {
        expect(this.$popupComponent).not.to.have.class('chat-popup--raised');
      }
      
    });
    it('Doesn\'t raise the popup before trigger point', function() {
      // simulate scrolling to before the trigger point
      this.stub.returns(this.triggerPoint - 1);
      $(window).trigger('scroll');
      expect(this.$popupComponent).not.to.have.class('chat-popup--raised');
    });
  });

});
