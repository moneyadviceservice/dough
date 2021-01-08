/**
 * This test is skipped at the minute 
 * It refrences a component that uses ES6 syntax that is not understood by PhnatomJS
 * Replacing Phantom with either Chrome or Firefox causes more problems than it solves for now
 */
xdescribe('Storage Access component', function () {
  'use strict';

  beforeEach(function (done) {
    var _this = this;

    requirejs(
      ['StorageAccess'],
      function (StorageAccess) {
        _this.obj = new StorageAccess();
        _this.el = _this.obj.el; 

        done();
      }, 
      done
    );
  });

  describe('On initialisation', function() {
    it('Calls the correct methods', function() {
      var queryDeviceSpy = sinon.spy(this.obj, 'queryDevice');
      var hideContentSpy = sinon.spy(this.obj, 'hideContent'); 

      this.obj.init(); 
      expect(queryDeviceSpy.calledOnce).to.be.true;
      expect(hideContentSpy.calledOnce).to.be.true; 

      queryDeviceSpy.restore(); 
      hideContentSpy.restore(); 
    }); 
  }); 

  describe('On calling the queryDevice method', function() {
    it('Calls the correct method on receiving return value', function() {
      var showContentSpy = sinon.spy(this.obj, 'showContent'); 
      var hasAccessSpy = sinon.spy(this.obj, 'hasAccess'); 
      var isStorageAccessKnownStub = sinon.stub(this.obj, 'isStorageAccessKnown'); 

      isStorageAccessKnownStub.returns(false); 

      this.obj.queryDevice(); 
      expect(showContentSpy.calledOnce).to.be.true; 

      isStorageAccessKnownStub.returns(true); 

      this.obj.queryDevice(); 
      expect(hasAccessSpy.calledOnce).to.be.true; 

      showContentSpy.restore(); 
      hasAccessSpy.restore(); 
      isStorageAccessKnownStub.restore(); 
    }); 
  }); 

  // TODO: Add test for the hasAccess method
  // This uses promises which doesn't seem to play nice with these tests
  xdescribe('On calling the hasAccess method', function() {
    it('Calls the correct methods on receiving the return value', function() {
      var documentStub = sinon.stub(document); 
      var showContentSpy = sinon.spy(this.obj, 'showContent'); 

      documentStub.hasStorageAccess.returns(false); 
      this.obj.hasAccess(); 
      expect(showContentSpy.calledOnce).to.be.true; 

      documentStub.restore(); 
      showContentSpy.restore(); 
    }); 
  }); 

  describe('On calling the hideContent method', function() {
    it('hides the content', function() {
      this.obj.hideContent(); 
      expect(this.el.style.display).to.equal('none'); 
    }); 
  }); 

  describe('On calling the showContent method', function() {
    it('shows the expected content', function() {
      this.obj.showContent(); 
      expect(this.el.style.display).to.equal('block'); 
    }); 
  }); 

  describe('On calling the renderLink method', function() {
    it('shows the expected content', function() {
      this.obj.renderLink(); 

      expect(this.el.style.display).to.equal('block'); 
      expect(this.el.querySelector('.storageAccessReferLink')).to.exist; 
    }); 
  }); 
}); 
