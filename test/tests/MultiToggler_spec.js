describe('Multi-Toggler', function () {

  'use strict';

  var activeClass = 'is-active',
      inactiveClass = 'is-inactive',
      attrNameTrigger = 'data-mas-toggler-target',
      attrNamePanel = 'data-mas-toggler';

  beforeEach(function (done) {
    var self = this;
    requirejs(
        ['jquery', 'MultiToggler', 'eventsWithPromises'],
        function ($, MultiToggler, pubsub) {
          self.$html = $(window.__html__['test/fixtures/MultiToggler.html']);
          self.$panel1 = self.$html.find('[' + attrNamePanel + '="1"]');
          self.$panel2 = self.$html.find('[' + attrNamePanel + '="2"]');
          self.$trigger2 = self.$html.find('[' + attrNameTrigger + '="2"]');
          self.pubsub = pubsub;
          self.multiToggler = new MultiToggler(self.$html);
          self.multiToggler.init();
          done();
        }, done);
  });

  afterEach(function() {
    this.pubsub.unsubscribeAll();
  });

  it('makes a panel inactive after the corresponding target is clicked', function () {
    this.$trigger2.click();
    assert.equal(this.$panel1.hasClass(activeClass), false, 'Inactive panel loses active class');
    assert.equal(this.$panel1.hasClass(inactiveClass), true, 'Inactive panel gains inactive class');
    assert.equal(this.$panel2.hasClass(activeClass), true, 'Active panel gains active class');
    assert.equal(this.$panel2.hasClass(inactiveClass), false, 'Active panel loses inactive class');
  });

  it('fires an event when panel made active', function() {
    var spy = sinon.spy();
    this.pubsub.subscribe('contentActive', spy);
    this.$html.find('[data-mas-toggler-target="2"]').click();
    sinon.assert.called(spy);
  });

  it('fires an event when panel made inactive', function() {
    var spy = sinon.spy();
    this.pubsub.subscribe('contentInactive', spy);
    this.$html.find('[data-mas-toggler-target="2"]').click();
    sinon.assert.called(spy);
  });

});
