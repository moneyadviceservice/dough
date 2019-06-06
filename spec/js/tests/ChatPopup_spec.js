describe('Chat Popup', function() {
  'use strict';

  beforeEach(function(done) {
    var self = this;

    fixture.setBase('spec/js/fixtures');

    requirejs(
        ['jquery', 'BackToTop', 'ChatPopup'],
        function($, BackToTop, ChatPopup) {
          fixture.load('BackToTop.html');

          self.$backToTopcomponent = $(fixture.el).find('[data-dough-component="BackToTop"]');
          self.backToTop = new BackToTop(self.$backToTopcomponent);
          self.triggerPoint = self.backToTop.config.triggerPoint;
          self.$backToTopcomponent.height(4000);
          self.backToTop.init();

          self.ChatPopup = ChatPopup;
          self.$popupComponent = $(fixture.el).find('[data-dough-component="ChatPopup"]');
          self.chatPopupIcon = $(fixture.el).find('[data-dough-webchat-icon]');
          self.chatPopupCloseBtn = $(fixture.el).find('[data-dough-webchat-close]');
          self.chatPopupSelect = $(fixture.el).find('[data-dough-webchat-select]');
          self.whatsappBtn = $(fixture.el).find('[data-dough-webchat-button-whatsapp]');
          self.chatPopup = new ChatPopup(self.$popupComponent);
          self.scrollThrottle = self.chatPopup.config.scrollThrottle;
          self.scrollLimit = self.chatPopup.config.scrollLimit;
          self.hiddenClass = self.chatPopup.config.hiddenClass;
          self.chatPopup.init();
          
          done();
        }, done);
  });

  afterEach(function() {
    fixture.cleanup();
  });

  describe('Opening and Closing Popup', function() {

    beforeEach(function() {
      this.openSpy = sinon.spy(this.ChatPopup.prototype, '_togglePopup');
    });

    afterEach(function() {
      this.openSpy.restore();
    });

    it('Opens popup on click', function() {
      this.chatPopupIcon.click();
      sinon.assert.calledOnce(this.openSpy);
      expect(this.$popupComponent).not.to.have.class('mobile-webchat--closed');
      expect(this.$popupComponent).to.have.class('mobile-webchat--opened');
    });

    it('Closes popup on X button click', function() {
      this.chatPopupIcon.click();
      sinon.assert.calledOnce(this.openSpy);
      this.chatPopupCloseBtn.click();
      sinon.assert.calledTwice(this.openSpy);
      expect(this.$popupComponent).not.to.have.class('mobile-webchat--opened');
      expect(this.$popupComponent).to.have.class('mobile-webchat--closed');
    });

  });

  describe('Popup Select Change Events', function() {

    it('Changes Select to Work & Benefits', function() {
      this.chatPopupSelect.val('work_benefits').change();
      expect(this.whatsappBtn).to.have.class('is-hidden');
    });

    it('Changes Select to Debt & Borrowing', function() {
      this.chatPopupSelect.val('debt-and-borrowing').change();
      expect(this.whatsappBtn).not.to.have.class('is-hidden');
    });

    it('Changes Select to Pensions & Retirement', function() {
      this.chatPopupSelect.val('pensions-and-retirement').change();
      expect(this.whatsappBtn).not.to.have.class('is-hidden');
    });

  });

  describe('Raising the Webchat and Whatsapp popup in article pages', function() {

    beforeEach(function() {
      this.stub = sinon.stub(this.backToTop, '_getScrollAmount');
      this.popupSpy = sinon.spy(this.ChatPopup.prototype, '_raisedChatPopup');
    });

    afterEach(function() {
      this.stub.restore();
      this.popupSpy.restore();
    });

    it('Validates original popup state', function() {
      expect(this.$popupComponent).not.to.have.class('mobile-webchat--raised');
    });

    it('Raises the popup in article pages on small screens', function() {
      // simulate scrolling to over the trigger point
      this.stub.returns(this.triggerPoint);
      $(window).trigger('scroll');
      if (this.backToTop.atSmallViewport) {
        sinon.assert.called(this.popupSpy);
        expect(this.$popupComponent).to.have.class('mobile-webchat--raised');
      } else {
        sinon.assert.notCalled(this.popupSpy);
        expect(this.$popupComponent).not.to.have.class('mobile-webchat--raised');
      }
      
    });
    it('Doesn\'t raise the popup before trigger point', function() {
      // simulate scrolling to before the trigger point
      this.stub.returns(this.triggerPoint - 1);
      $(window).trigger('scroll');
      expect(this.$popupComponent).not.to.have.class('mobile-webchat--raised');
      if (this.backToTop.atSmallViewport) {
        sinon.assert.called(this.popupSpy);
        expect(this.popupSpy.getCalls()[0].args[0]).to.equals(false);
      } else {
        sinon.assert.notCalled(this.popupSpy);
      }
    });
  });

  describe('Hides the popup on scroll', function() {

    beforeEach(function() {
      this.clock = sinon.useFakeTimers();
      this.stub = sinon.stub(this.chatPopup, '_getScrollAmount');
    });

    afterEach(function() {
      this.clock.restore();
      this.stub.restore();
    });

    it('Doesn\'t hide before reaching the scroll limit', function() {
      this.stub.returns(this.scrollLimit - 1);
      $(window).trigger('scroll');
      this.clock.tick(this.scrollThrottle);
      expect(this.$popupComponent).not.to.have.class(this.hiddenClass);
        
    });

    it('Hides after scrolling 700 pixels', function() {
      this.stub.returns(this.scrollLimit + 1);
      $(window).trigger('scroll');
      this.clock.tick(this.scrollThrottle); 
      expect(this.$popupComponent).to.have.class(this.hiddenClass);
    });

    it('Reveals on border click', function() {
      this.stub.returns(this.scrollLimit + 1);
      $(window).trigger('scroll');
      this.clock.tick(this.scrollThrottle);
      expect(this.$popupComponent).to.have.class(this.hiddenClass);

      var popupEl = document.querySelectorAll('[data-dough-component="ChatPopup"]')[0];
      var rect = popupEl.getBoundingClientRect(),
        posX = rect.left - 1, posY = rect.top;
      // create event-object with calculated position
      var ev = document.createEvent('MouseEvent');
      ev.initMouseEvent(
        'click',
        true /* bubble */, 
        true /* cancelable */,
        window, 
        null,
        0, 0, posX, posY, /* coordinates */
        false, false, false, false, /* modifier keys */
        0, 
        null
      );
      // trigger the event
      popupEl.dispatchEvent(ev);

      expect(this.$popupComponent).not.to.have.class(this.hiddenClass);
    });

  });

});
