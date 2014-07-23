describe('Tab selector', function () {

  'use strict';

  var activeClass = 'is-active',
      trigger = '[data-dough-tabselector-trigger]',
      active = trigger + '.' + activeClass + ' a',
      triggers = trigger + ' a';

  beforeEach(function (done) {
    var self = this;
    requirejs(
        ['jquery', 'TabSelector'],
        function ($, TabSelector) {
          self.$html = $(window.__html__['test/fixtures/TabSelector.html']);
          self.$menu = self.$html.find('[data-dough-tabselector-triggers]');
          self.tabSelector = new TabSelector(self.$html);
          self.tabSelector.init();
          self.$triggers = self.$menu.find(triggers);
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
    return $root.find('[data-dough-tabselector-target]').not('.visually-hidden').text().trim();
  }

  it('selects the first item in the list', function() {
    expect(this.$menu.find(active).text()).to.equal('Show panel 1 (Selected)');
  });

  it('replaces the currently selected item', function() {
    this.$triggers.last().click();
    this.$triggers.eq(1).click();
    expect(activeTrigger(this.$menu).text()).to.equal('Show panel 2 (Selected)');
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
    this.$triggers.first().click();
    expect(isOpen(this.$menu)).to.equal(false);
  });

  it('shows the associated target panel when a trigger is clicked', function() {
    this.$triggers.last().click();
    expect(activeTargetText(this.$html)).to.equal('Panel 3');
    this.$triggers.first().click();
    expect(activeTargetText(this.$html)).to.equal('Panel 1');
  });

  it('updates other copies of the clicked trigger', function() {
    var $trigger = this.$html.find('.tab-selector__target [data-dough-tabselector-trigger="2"]');
    $trigger.find('a').click();
    expect(this.$html.find('[data-dough-tabselector-trigger="2"].is-active a[aria-selected="true"]').length).to.equal(2);
  });

  it('doesn\'t open the menu if a trigger outside the menu is clicked', function() {
    this.$html.find('.tab-selector__target a:eq(2)').click();
    expect(isOpen(this.$menu)).to.equal(false);
  });
});
