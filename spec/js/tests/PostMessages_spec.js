describe('PostMessages component', function() {
  'use strict';

  beforeEach(function(done) {
    var self = this;

    fixture.setBase('spec/js/fixtures');

    requirejs(
      ['PostMessages'],
      function(PostMessages) {
        fixture.load('PostMessages.html');

        self.component = $(fixture.el).find('[data-dough-component="PostMessages"]');
        self.postMessages = new PostMessages(self.component);
        self.message = self.postMessages.message; 

        done();
      }, done);
  });

  afterEach(function() {
    fixture.cleanup();
  });

  describe('On initialising', function() {
    it('Calls the _addEvents method', function() {
      var addEventsSpy = sinon.spy(this.postMessages, '_addEvents'); 

      this.postMessages.init();
      expect(addEventsSpy.calledOnce).to.be.true;

      addEventsSpy.restore(); 
    });

    it('Calls the masResize method if method config is true', function() {
      var masResizeSpy = sinon.spy(this.postMessages, '_masResize'); 

      this.postMessages.init(); 
      expect(masResizeSpy.called).to.be.false; 

      this.postMessages.config.masresize = true; 
      this.postMessages.init(); 
      expect(masResizeSpy.calledOnce).to.be.true; 

      masResizeSpy.restore();
    }); 
  });

  describe.only('masResize method', function() {
    it('Calls the updateMessage method with the correct argument on body resize', function() {
      var clock = sinon.useFakeTimers();
      var updateMessageSpy = sinon.spy(this.postMessages, '_updateMessage');

      this.postMessages._masResize();
      clock.tick(200);

      expect(updateMessageSpy.callCount).to.equal(1); 
      expect(updateMessageSpy.calledWith('masResize', 1200)).to.be.true; 

      clock.restore(); 
      updateMessageSpy.restore(); 
    }); 
  }); 

  describe('On clicking a jump link', function() {
    it('Calls the updateMessage method with the correct argument', function() {
      var updateMessageSpy = sinon.spy(this.postMessages, '_updateMessage'); 

      this.postMessages._addEvents();

      this.component.find('#jump_link_1').trigger('click');
      expect(updateMessageSpy.callCount).to.equal(1);
      assert(updateMessageSpy.calledWith('content_1'));

      this.component.find('#jump_link_2').trigger('click');
      expect(updateMessageSpy.callCount).to.equal(2);
      assert(updateMessageSpy.calledWith('content_2'));

      this.component.find('#jump_link_3').trigger('click');
      expect(updateMessageSpy.callCount).to.equal(3);
      assert(updateMessageSpy.calledWith('content_3'));

      this.component.find('#external_link').trigger('click');
      expect(updateMessageSpy.callCount).to.equal(3);

      this.component.find('#internal_link').trigger('click');
      expect(updateMessageSpy.callCount).to.equal(3);

      updateMessageSpy.restore(); 
    })
  });

  describe('On calling the updateMessage method', function() {
    it('Calls the getOffset method with the correct argument', function() {
      var getOffsetSpy = sinon.spy(this.postMessages, '_getOffset');

      this.postMessages._updateMessage('content_1');
      expect(getOffsetSpy.callCount).to.equal(1);
      assert(getOffsetSpy.calledWith('content_1'));

      this.postMessages._updateMessage('content_2');
      expect(getOffsetSpy.callCount).to.equal(2);
      assert(getOffsetSpy.calledWith('content_2'));

      this.postMessages._updateMessage('content_3');
      expect(getOffsetSpy.callCount).to.equal(3);
      assert(getOffsetSpy.calledWith('content_3'));

      getOffsetSpy.restore(); 
    }); 

    it('Updates the message with the correct values', function() {
      var getOffsetStub = sinon.stub(this.postMessages, '_getOffset');

      getOffsetStub.returns(120); 
      this.postMessages._updateMessage('content_1');

      expect(this.message.jumpLink.id).to.equal('content_1'); 
      expect(this.message.jumpLink.offset).to.equal(120); 

      getOffsetStub.restore(); 
    }); 

    it('Calls the sendMessage method', function() {
      var sendMessageSpy = sinon.spy(this.postMessages, '_sendMessage'); 

      this.postMessages._updateMessage('content_1');
      expect(sendMessageSpy.calledOnce).to.be.true; 

      sendMessageSpy.restore(); 
    }); 
  });

  describe('On calling the getOffset method', function() {
    it('Returns the correct value', function() {
      var offset; 

      offset = this.postMessages._getOffset('content_1');
      expect(offset).to.equal(150); 

      offset = this.postMessages._getOffset('content_2');
      expect(offset).to.equal(300); 

      offset = this.postMessages._getOffset('content_3');
      expect(offset).to.equal(450); 
    })
  }); 
});
