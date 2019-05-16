describe('Chat Popup', function() {
  'use strict';

  beforeEach(function(done) {
    var self = this;

    fixture.setBase('spec/js/fixtures');

    requirejs(
        ['jquery', 'ChatPopup'],
        function($, ChatPopup) {
          fixture.load('ChatPopup.html');

          self.$popupTip = $(fixture.el).find('[data-dough-component="ChatPopup"]');
          self.chatPopup = ChatPopup;
          
          done();
        }, done);
  });

  afterEach(function() {
    fixture.cleanup();
  });

  describe('Raised Button', function() {
    it('Validates original state', function() {
      // this.chatPopup.raisedChatPopup(true, 1705);
      expect(this.$popupTip).not.to.have.class('chat-popup--raised');
    });
  });

});
