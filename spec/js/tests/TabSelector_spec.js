describe('Tab selector', function() {

  'use strict';

  var activeClass = 'is-active',
      triggersInner = '[data-dough-tab-selector-triggers-inner]',
      triggerSelector = '[data-dough-tab-selector-trigger]',
      activeTrigger = triggerSelector + '.' + activeClass,
      target = '[data-dough-tab-selector-target].' + activeClass + ' .tab-selector__target-heading';

  beforeEach(function(done) {
    var self = this;
    requirejs(
        ['jquery', 'TabSelector', 'eventsWithPromises'],
        function($, TabSelector, eventsWithPromises) {
          self.$html = $(window.__html__['spec/js/fixtures/TabSelector.html']);
          self.$triggersInner = self.$html.find(triggersInner);
          self.tabSelector = new TabSelector(self.$html);
          self.tabSelector.init();
          self.$triggers = self.$triggersInner.find(triggerSelector);
          self.eventsWithPromises = eventsWithPromises;
          done();
        }, done);
  });

  function isOpen($menu) {
    return $menu.hasClass(activeClass);
  }

  function findActiveTrigger($menu) {
    return $menu.find(activeTrigger);
  }

  function activeTarget($root) {
    return $root.find(target);
  }

  it('selects the first item in the list', function() {
    this.$html.find(activeTrigger).each(function() {
      expect($(this).text()).to.contain('panel 1');
      expect($(this).text()).to.contain('selected');
    });
  });

  it('converts all anchor links to buttons', function() {
    expect(this.$html.find(triggerSelector).length).to.equal(6);
  });

  it('adds a hidden show label to unselected triggers', function() {
    expect(this.$triggersInner.not(activeTrigger).text()).to.contain('show');
  });

  it('replaces the currently selected item', function() {
    this.$triggers.last().click();
    this.$triggers.eq(1).click();
    expect(findActiveTrigger(this.$triggersInner).text()).to.contain('panel 2');
    expect(this.$html.find(activeTrigger).length).to.equal(2);
  });

  it('toggles the menu when the selected item is clicked', function() {
    findActiveTrigger(this.$triggersInner).click();
    expect(isOpen(this.$triggersInner)).to.equal(true);
    findActiveTrigger(this.$triggersInner).click();
    expect(isOpen(this.$triggersInner)).to.equal(false);
  });

  it('closes the menu when an item on it is clicked', function() {
    findActiveTrigger(this.$triggersInner).click();
    this.$triggers.first().click();
    expect(isOpen(this.$triggersInner)).to.equal(false);
  });

  it('shows the associated target panel when a trigger is clicked', function() {
    this.$triggers.last().click();
    expect(activeTarget(this.$html)).to.have.text('Panel 3');
    this.$triggers.first().click();
    expect(activeTarget(this.$html)).to.have.text('Panel 1');
  });

  it('updates other copies of the clicked trigger', function() {
    var $trigger = this.$html.find('[data-dough-tab-selector-target] [data-dough-tab-selector-trigger="2"]');
    $trigger.click();
    expect(this.$html.find('[data-dough-tab-selector-trigger="2"].is-active[aria-selected="true"]').length).to.equal(2);
  });

  it('doesn\'t open the menu if a trigger outside the menu is clicked', function() {
    this.$html.find('.tab-selector__target button:eq(2)').click();
    expect(isOpen(this.$triggersInner)).to.equal(false);
  });

  it('closes the menu if the viewport is resized to small', function() {
    this.$triggers.last().click();
    this.eventsWithPromises.publish('mediaquery:resize', {
      newSize: 'mq-s'
    });
    expect(isOpen(this.$triggersInner)).to.equal(false);
  });

});

