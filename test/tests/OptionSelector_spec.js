describe('Tab selector', function () {

  'use strict';

  var activeTrigger = '[data-mas-tabselector-trigger].is-active',
      triggers = '[data-mas-tabselector-trigger] a',
      activeTarget = '[data-mas-tabselector-target].is-active',
      activeClass = 'is-active';

  beforeEach(function (done) {
    var self = this;
    requirejs(
        ['jquery', 'OptionSelector'],
        function ($, OptionSelector) {
          self.$html = $(window.__html__['test/fixtures/OptionSelector.html']);
          self.$menu = self.$html.find('[data-mas-tabselector-menu]');
          self.tabSelector = new OptionSelector(self.$html);
          self.tabSelector.init();
          done();
        }, done);
  });

  it('selects the first item in the list', function() {
    expect(this.$html.find(activeTrigger + ' a').html()).to.equal('Show panel 1');
  });

  it('replaces the currently selected item', function() {
    this.$menu.find(triggers).last().click();
    this.$menu.find(triggers).first().click();
    expect(this.$html.find(activeTrigger + ' a').html()).to.equal('Show panel 1');
    expect(this.$html.find(activeTrigger).length).to.equal(1);
  });

  it('toggles the menu when the selected item is clicked', function() {
    this.$html.find(activeTrigger + ' a').click();
    expect(this.$menu.hasClass(activeClass)).to.equal(true);
    this.$html.find(activeTrigger + ' a').click();
    expect(this.$menu.hasClass(activeClass)).to.equal(false);
  });

  it('closes the menu when an item on it is clicked', function() {
    this.$html.find(activeTrigger + ' a').click();
    this.$menu.find('a').first().click();
    expect(this.$menu.hasClass(activeClass)).to.equal(false);
  });

  it('shows the associated target panel when a trigger is clicked', function() {
    this.$menu.find(triggers).last().click();
    expect(this.$html.find(activeTarget).text()).to.equal('Panel 3');
    this.$menu.find(triggers).first().click();
    expect(this.$html.find(activeTarget).text()).to.equal('Panel 1');
  });

});
