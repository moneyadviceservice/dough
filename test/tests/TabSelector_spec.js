describe('Tab selector', function () {

  'use strict';

  var activeClass = 'is-active',
      activeTrigger = '[data-mas-tabselector-trigger].' + activeClass,
      triggers = '[data-mas-tabselector-trigger] a',
      activeTarget = '[data-mas-tabselector-target].' + activeClass;

  beforeEach(function (done) {
    var self = this;
    requirejs(
        ['jquery', 'TabSelector'],
        function ($, TabSelector) {
          self.$html = $(window.__html__['test/fixtures/TabSelector.html']);
          self.$options = self.$html.find('[data-mas-tabselector-options]');
          self.tabSelector = new TabSelector(self.$html);
          self.tabSelector.init();
          done();
        }, done);
  });

  it('selects the first item in the list', function() {
    expect(this.$html.find(activeTrigger + ' a').html()).to.equal('Show panel 1');
  });

  it('replaces the currently selected item', function() {
    this.$options.find(triggers).last().click();
    this.$options.find(triggers).first().click();
    expect(this.$html.find(activeTrigger + ' a').html()).to.equal('Show panel 1');
    expect(this.$html.find(activeTrigger).length).to.equal(1);
  });

  it('toggles the menu when the selected item is clicked', function() {
    this.$html.find(activeTrigger + ' a').click();
    expect(this.$options.hasClass(activeClass)).to.equal(true);
    this.$html.find(activeTrigger + ' a').click();
    expect(this.$options.hasClass(activeClass)).to.equal(false);
  });

  it('closes the menu when an item on it is clicked', function() {
    this.$html.find(activeTrigger + ' a').click();
    this.$options.find('a').first().click();
    expect(this.$options.hasClass(activeClass)).to.equal(false);
  });

  it('shows the associated target panel when a trigger is clicked', function() {
    this.$options.find(triggers).last().click();
    expect(this.$html.find(activeTarget).text()).to.equal('Panel 3');
    this.$options.find(triggers).first().click();
    expect(this.$html.find(activeTarget).text()).to.equal('Panel 1');
  });

});
