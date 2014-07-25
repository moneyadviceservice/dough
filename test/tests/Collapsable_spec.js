describe('Visibility toggler', function () {

  'use strict';

  var activeClass = 'is-active';

  beforeEach(function (done) {
    var self = this;
    requirejs(
        ['jquery', 'Collapsable'],
        function ($, Collapsable) {
          self.$html = $(window.__html__['test/fixtures/Collapsable.html']).appendTo('body');
          self.collapsable = new Collapsable(self.$html.filter('[data-dough-collapsable-trigger]'));
          self.collapsable.init();
          self.$trigger = self.$html.find('button');
          self.$target = self.$html.filter('[data-dough-collapsable-target]');
          done();
        }, done);
  });

  afterEach(function () {
    this.$html.remove();
  });

  function isActive($target){
    return $target.hasClass(activeClass);
  }

  it('must wrap a button around the trigger text', function() {
    expect(this.$trigger[0].tagName).to.equal('BUTTON');
  });

  it('must add visually hidden text to indicate the state of the button i.e open or closed', function() {
    expect(this.$trigger.find('.visually-hidden')).to.have.text('Open');
  });

  it('activates the trigger and target panel when the trigger is clicked', function() {
    this.$trigger.click();
    expect(isActive(this.$trigger)).to.equal(true);
    expect(isActive(this.$target)).to.equal(true);
  });

  it('deactivates an active trigger and target panel when the trigger is clicked a second time', function() {
    this.$trigger.click();
    this.$trigger.click();
    expect(isActive(this.$trigger)).to.equal(false);
    expect(isActive(this.$target)).to.equal(false);
  });


});
