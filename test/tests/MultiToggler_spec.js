describe('Multi-Toggler', function () {

  'use strict';

  before(function (done) {
    var self = this;
    requirejs(
        ['jquery', 'MultiToggler', 'eventsWithPromises'],
        function ($, MultiToggler, pubsub) {
          self.$html = $(window.__html__['test/fixtures/MultiToggler.html']);
          self.$panel1 = self.$html.find('[data-panel="1"]');
          self.$panel2 = self.$html.find('[data-panel="2"]');
          self.$trigger2 = self.$html.find('[data-panel-target="2"]');
          self.pubsub = pubsub;
          self.multiToggler = new MultiToggler(self.$html);
          done();
        }, done);
  });

  afterEach(function() {
    this.pubsub.unsubscribeAll();
  });

  it('makes a panel invisible after the corresponding target is clicked', function () {
    this.$trigger2.click();
    assert.equal(this.$panel1.hasClass('is-active'), false, 'Invisible panel loses visible class');
    assert.equal(this.$panel1.hasClass('is-inactive'), true, 'Invisible panel gains invisible class');
    assert.equal(this.$panel2.hasClass('is-active'), true, 'visible panel gains visible class');
    assert.equal(this.$panel2.hasClass('is-inactive'), false, 'visible panel loses invisible class');
  });

  it('fires an event when panel shown', function() {
    var spy = sinon.spy();
    this.pubsub.subscribe('contentShown', spy);
    this.$html.find('[data-panel-target="2"]').click();
    sinon.assert.called(spy);
  });

  it('fires an event when panel hidden', function() {
    var spy = sinon.spy();
    this.pubsub.subscribe('contentHidden', spy);
    this.$html.find('[data-panel-target="2"]').click();
    sinon.assert.called(spy);
  });

});
