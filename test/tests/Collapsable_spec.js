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
          self.$triggerLabel = self.$html.find('[data-dough-collapsable-label]');
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

  it('wraps a button around the trigger text', function() {
    expect(this.$trigger[0].tagName).to.equal('BUTTON');
  });

  it('adds visually hidden text to indicate the state of the button i.e open or closed', function() {
    expect(this.$triggerLabel).to.have.text('Open');
    this.$trigger.click();
    expect(this.$triggerLabel).to.have.text('Close');
  });

  it('adds an accessibility attribute linking the trigger to the target', function() {
    expect(this.$trigger.attr('aria-controls')).to.equal(this.$target.attr('id'));
  });

  it('adds an accessibility attribute indicating the expanded state of the target', function() {
    expect(this.$trigger.attr('aria-expanded')).to.equal('false');
    this.$trigger.click();
    expect(this.$trigger.attr('aria-expanded')).to.equal('true');
    this.$trigger.click();
    expect(this.$trigger.attr('aria-expanded')).to.equal('false');
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
