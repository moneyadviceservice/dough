describe('Visibility toggler', function () {

  'use strict';

  var activeClass = 'is-active';

  beforeEach(function (done) {
    var self = this;
    requirejs(
        ['jquery', 'VisibilityToggler'],
        function ($, VisibilityToggler) {
          self.$html = $(window.__html__['test/fixtures/VisibilityToggler.html']).appendTo('body');
          self.$trigger = self.$html.filter('[data-dough-trigger]');
          self.$target = self.$html.filter('[data-dough-target]');
          self.visibilityToggler = new VisibilityToggler(self.$trigger);
          self.visibilityToggler.init();
          done();
        }, done);
  });

  afterEach(function () {
    this.$html.remove();
  });

  function isActive($target){
    return $target.hasClass(activeClass);
  }

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
