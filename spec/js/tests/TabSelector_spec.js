describe('Tab selector', function() {

  'use strict';

  var activeClass = 'is-active',
      triggersInner = '[data-dough-tab-selector-triggers-inner]',
      triggerSelector = '[data-dough-tab-selector-trigger]',
      activeTrigger = triggerSelector + '.' + activeClass,
      target = '[data-dough-tab-selector-target].' + activeClass,
      inactiveTarget = '[data-dough-tab-selector-target].is-inactive';

  beforeEach(function(done) {
    var self = this;
    requirejs(
        ['jquery', 'TabSelector', 'eventsWithPromises'],
        function($, TabSelector, eventsWithPromises) {
          self.eventsWithPromises = eventsWithPromises;
          self.eventsWithPromises.unsubscribeAll();
          self.TabSelector = TabSelector;
          done();
        }, done);
  });

  afterEach(function() {
    this.eventsWithPromises.unsubscribeAll();
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

  function activeTargetHeading($root) {
    return activeTarget($root).find('.tab-selector__target-heading');
  }

  function inactiveTargets($root) {
    return $root.find(inactiveTarget);
  }

  describe('general functions', function() {

    beforeEach(function(done) {
      this.$html = $(window.__html__['spec/js/fixtures/TabSelector.html']);
      this.$triggersInner = this.$html.find(triggersInner);
      this.tabSelector = new this.TabSelector(this.$html);
      this.tabSelector.init();
      this.$triggers = this.$triggersInner.find(triggerSelector);
      done();
    });

    it('selects the first item in the list', function() {
      var _this = this;
      this.$html.find(activeTrigger).each(function() {
        expect($(this).text()).to.contain('panel 1');
        expect($(this).text()).to.contain('selected');

        expect(activeTarget(_this.$html)).not.to.have.attr('aria-hidden', 'true');
      });
    });

    it('sets aria-hidden=true on inactive items', function() {
      inactiveTargets(this.$html).each(function() {
        expect($(this)).to.have.attr('aria-hidden', 'true');
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

    it('shows the associated target panel when a trigger is clicked', function() {
      this.$triggers.last().click();
      expect(activeTargetHeading(this.$html)).to.have.text('Panel 3');
      expect(activeTarget(this.$html)).to.have.attr('aria-hidden', 'false');
      this.$triggers.first().click();
      expect(activeTargetHeading(this.$html)).to.have.text('Panel 1');
      expect(activeTarget(this.$html)).to.have.attr('aria-hidden', 'false');
    });

    it('sets aria-hidden to false on other target panels when a trigger is clicked', function() {
      this.$triggers.last().click();
      inactiveTargets(this.$html).each(function() {
        expect($(this)).to.have.attr('aria-hidden', 'true');
      });
    });

    it('updates other copies of the clicked trigger', function() {
      var sel = '[data-dough-tab-selector-trigger="2"].is-active[aria-selected="true"]',
          $trigger = this.$html.find('[data-dough-tab-selector-target] [data-dough-tab-selector-trigger="2"]');
      $trigger.click();
      expect(this.$html.find(sel).length).to.equal(2);
    });
  });

  describe('collapses at small viewports', function() {

    beforeEach(function(done) {
      this.$html = $(window.__html__['spec/js/fixtures/TabSelector.html']);
      this.$triggersInner = this.$html.find(triggersInner);
      this.tabSelector = new this.TabSelector(this.$html, {'collapseInSmallViewport': true});
      this.tabSelector.init();
      this.$triggers = this.$triggersInner.find(triggerSelector);
      done();
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

    it('doesn\'t open the menu if a trigger outside the menu is clicked', function() {
      this.$html.find('.tab-selector__target button:eq(2)').click();
      expect(isOpen(this.$triggersInner)).to.equal(false);
    });

    it('closes the menu if the viewport is resized to small', function() {
      this.$triggers.last().click();
      sinon.stub(this.TabSelector.prototype, '_haveTriggersWrapped').callsFake(function() {
        return true;
      });
      this.eventsWithPromises.publish('mediaquery:resize', {
        newSize: 'mq-s'
      });
      expect(isOpen(this.$triggersInner)).to.equal(false);
      this.TabSelector.prototype._haveTriggersWrapped.restore();
    });

  });


  describe('doesn\'t collapse at small viewports if config supplied', function() {

    beforeEach(function(done) {
      this.$html = $(window.__html__['spec/js/fixtures/TabSelector.html']);
      this.$triggersInner = this.$html.find(triggersInner);
      this.tabSelector = new this.TabSelector(this.$html);
      this.tabSelector.init();
      this.$triggers = this.$triggersInner.find(triggerSelector);
      done();
    });

    it('doesn\'t close the menu if the viewport is resized to small', function() {
      this.$triggers.last().click();
      this.eventsWithPromises.publish('mediaquery:resize', {
        newSize: 'mq-s'
      });
      expect(isOpen(this.$triggersInner)).to.equal(true);
    });

  });

});

