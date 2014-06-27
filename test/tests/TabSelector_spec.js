describe('Tab selector', function () {

  'use strict';

  var activeClass = 'is-active',
      trigger = '[data-dough-tabselector-trigger]',
      active = trigger + '.' + activeClass + ' a',
      triggers = trigger + ' a',
      activeTarget = '[data-dough-tabselector-target].' + activeClass;

  beforeEach(function (done) {
    var self = this;
    requirejs(
        ['jquery', 'TabSelector'],
        function ($, TabSelector) {
          self.$html = $(window.__html__['test/fixtures/TabSelector.html']);
          self.$menu = self.$html.find('[data-dough-tabselector-triggers]');
          self.tabSelector = new TabSelector(self.$html);
          self.tabSelector.init();
          done();
        }, done);
  });

  function isOpen($menu){
    return $menu.hasClass(activeClass);
  }

  function activeTrigger($menu) {
    return $menu.find(active);
  }

  function activeTargetText($root) {
    return $root.find(activeTarget).text();
  }

  it('selects the first item in the list', function() {
    expect(this.$html.find(active).html()).to.equal('Show panel 1');
  });

  it('replaces the currently selected item', function() {
    this.$menu.find(triggers).last().click();
    this.$menu.find(triggers).eq(1).click();
    expect(activeTrigger(this.$menu).html()).to.equal('Show panel 2');
    expect(this.$html.find(active).length).to.equal(2);
  });

  it('toggles the menu when the selected item is clicked', function() {
    activeTrigger(this.$menu).click();
    expect(isOpen(this.$menu)).to.equal(true);
    activeTrigger(this.$menu).click();
    expect(isOpen(this.$menu)).to.equal(false);
  });

  it('closes the menu when an item on it is clicked', function() {
    activeTrigger(this.$menu).click();
    this.$menu.find(triggers).first().click();
    expect(isOpen(this.$menu)).to.equal(false);
  });

  it('shows the associated target panel when a trigger is clicked', function() {
    this.$menu.find(triggers).last().click();
    expect(activeTargetText(this.$html)).to.equal('Panel 3');
    this.$menu.find(triggers).first().click();
    expect(activeTargetText(this.$html)).to.equal('Panel 1');
  });

  it('updates other copies of the clicked trigger', function() {
    var $trigger = this.$html.find('.panel [data-dough-tabselector-trigger="2"]');
    $trigger.find('a').click();
    expect(this.$html.find('[data-dough-tabselector-trigger="2"].is-active').length).to.equal(2);
  });

  it('doesn\'t open the menu if a trigger outside the menu is clicked', function() {
    this.$html.find('.panel a:eq(2)').click();
    expect(isOpen(this.$menu)).to.equal(false);
  });
});
