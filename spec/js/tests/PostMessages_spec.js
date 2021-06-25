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

    it('Calls the scrollToTop method if method config is true', function() {
      var scrollToTopSpy = sinon.spy(this.postMessages, '_scrollToTop'); 

      this.postMessages.init(); 
      expect(scrollToTopSpy.called).to.be.false; 

      this.postMessages.config.scrollToTop = true; 
      this.postMessages.init(); 
      expect(scrollToTopSpy.calledOnce).to.be.true; 

      scrollToTopSpy.restore();
    }); 
  });

  describe('masResize method', function() {
    it('Calls the updateMessage method with the correct arguments', function() {
      var clock = sinon.useFakeTimers();
      var updateMessageSpy = sinon.spy(this.postMessages, '_updateMessage');

      this.postMessages._masResize();
      clock.tick(200);

      expect(updateMessageSpy.callCount).to.equal(1); 
      assert(updateMessageSpy.calledWith('masResize', 1200)); 

      clock.restore(); 
      updateMessageSpy.restore(); 
    }); 
  });

  describe.only('scrollToTop method', function() {
    it('Calls the updateMessage method with the correct arguments', function() {
      var updateMessageSpy = sinon.spy(this.postMessages, '_updateMessage');

      this.postMessages._scrollToTop('scrollToTop');

      expect(updateMessageSpy.callCount).to.equal(1); 
      assert(updateMessageSpy.calledWith('scrollToTop')); 

      updateMessageSpy.restore(); 
    }); 
  });

  describe('On clicking a jump link', function() {
    it('Calls the updateMessage method with the correct arguments', function() {
      var updateMessageSpy = sinon.spy(this.postMessages, '_updateMessage'); 

      this.postMessages._addEvents();

      this.component.find('#jump_link_1').trigger('click');
      expect(updateMessageSpy.callCount).to.equal(1);
      assert(updateMessageSpy.calledWith('jumpLink', 'content_1'));

      this.component.find('#jump_link_2').trigger('click');
      expect(updateMessageSpy.callCount).to.equal(2);
      assert(updateMessageSpy.calledWith('jumpLink', 'content_2'));

      this.component.find('#jump_link_3').trigger('click');
      expect(updateMessageSpy.callCount).to.equal(3);
      assert(updateMessageSpy.calledWith('jumpLink', 'content_3'));

      this.component.find('#external_link').trigger('click');
      expect(updateMessageSpy.callCount).to.equal(3);

      this.component.find('#internal_link').trigger('click');
      expect(updateMessageSpy.callCount).to.equal(3);

      updateMessageSpy.restore(); 
    })
  });

  describe('On calling the updateMessage method', function() {
    it('Calls the getOffset method where required with the correct argument', function() {
      var getOffsetSpy = sinon.spy(this.postMessages, '_getOffset');

      this.postMessages._updateMessage('jumpLink', 'content_1');
      expect(getOffsetSpy.callCount).to.equal(1);
      assert(getOffsetSpy.calledWith('content_1'));

      this.postMessages._updateMessage('jumpLink', 'content_2');
      expect(getOffsetSpy.callCount).to.equal(2);
      assert(getOffsetSpy.calledWith('content_2'));

      this.postMessages._updateMessage('jumpLink', 'content_3');
      expect(getOffsetSpy.callCount).to.equal(3);
      assert(getOffsetSpy.calledWith('content_3'));

      this.postMessages._updateMessage('masResize', 1200);
      expect(getOffsetSpy.callCount).to.equal(3);

      getOffsetSpy.restore(); 
    }); 

    it('Updates the message with the correct values', function() {
      // For jumpLink event
      var getOffsetStub = sinon.stub(this.postMessages, '_getOffset');

      getOffsetStub.returns(120); 
      this.postMessages._updateMessage('jumpLink', 'content_1');

      expect(this.postMessages.message.jumpLink.id).to.equal('content_1'); 
      expect(this.postMessages.message.jumpLink.offset).to.equal(120); 

      getOffsetStub.restore(); 

      // For masResize event
      this.postMessages._updateMessage('masResize', 1200);
      expect(this.postMessages.message).to.equal('MASRESIZE-1200'); 
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
