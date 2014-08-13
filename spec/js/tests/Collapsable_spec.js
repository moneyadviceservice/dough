describe('Visibility toggler', function() {

  'use strict';

  var activeClass = 'is-active';

  beforeEach(function(done) {
    var self = this;
    requirejs(
        ['jquery', 'Collapsable', 'componentLoader'],
        function($, Collapsable, componentLoader) {
          self.Collapsable = Collapsable;
          self.componentLoader = componentLoader;
          self.$html = $(window.__html__['spec/js/fixtures/Collapsable.html']).appendTo('body');
          done();
        }, done);
  });

  afterEach(function() {
    this.$html.remove();
  });

  describe('closed by default', function() {

    beforeEach(function(done) {
      var self = this;
      this.componentLoader.init(this.$html).then(function(){
        self.$trigger = self.$html.find('button').first();
        self.$triggerLabel = self.$trigger.find('[data-dough-collapsable-label]');
        self.$target = self.$html.find('[data-dough-collapsable-target]').first();
        done();
      });

    });

    it('collapses the target panel by default', function() {
      expect(this.$target).to.not.have.class(activeClass);
    });

    it('wraps a button around the trigger text', function() {
      expect(this.$trigger[0].tagName).to.equal('BUTTON');
    });

    it('adds visually hidden text to indicate the state of the button i.e open or closed', function() {
      expect(this.$triggerLabel).to.have.text('Show');
      this.$trigger.click();
      expect(this.$triggerLabel).to.have.text('Hide');
    });

    it('adds an accessibility attribute linking the trigger to the target', function() {
      expect(this.$trigger).to.have.attr('aria-controls', this.$target.attr('id'));
    });

    it('adds an accessibility attribute indicating the expanded state of the target', function() {
      expect(this.$trigger).to.have.attr('aria-expanded', 'false');
      this.$trigger.click();
      expect(this.$trigger).to.have.attr('aria-expanded', 'true');
      this.$trigger.click();
      expect(this.$trigger).to.have.attr('aria-expanded', 'false');
    });

    it('activates the trigger and target panel when the trigger is clicked', function() {
      this.$trigger.click();
      expect(this.$trigger).to.have.class(activeClass);
      expect(this.$target).to.have.class(activeClass);
    });

    it('deactivates an active trigger and target panel when the trigger is clicked a second time', function() {
      this.$trigger.click();
      this.$trigger.click();
      expect(this.$trigger).to.not.have.class(activeClass);
      expect(this.$target).to.not.have.class(activeClass);
    });

  });

  describe('expanded by default', function() {

    beforeEach(function(done) {
      this.$html.find('[data-dough-collapsable-trigger]').first().attr('data-dough-collapsable-config','{"forceTo": "show"}');
      this.componentLoader.init(this.$html).then(function() {
        done();
      });
    });

    it('wraps a button around the trigger text', function() {
      this.$target = this.$html.find('[data-dough-collapsable-target]').first();
      expect(this.$target).to.have.class(activeClass);
    });

  });

  describe('linked to other collapsables', function() {

    beforeEach(function(done) {
      this.componentLoader.init(this.$html).then(function() {
        done();
      });
    });

    it('closes linked collapsables when opened', function() {
      this.$trigger1 = this.$html.find('[data-dough-collapsable-trigger] button').first();
      this.$trigger2 = this.$html.find('[data-dough-collapsable-trigger] button').last();
      this.$target1 = this.$html.find('[data-dough-collapsable-target]').first();
      this.$target2 = this.$html.find('[data-dough-collapsable-target]').last();
      this.$trigger1.click();
      expect(this.$target1).to.have.class(activeClass);
      this.$trigger2.click();
      expect(this.$target2).to.have.class(activeClass);
      expect(this.$target1).to.not.have.class(activeClass);
      this.$trigger1.click();
      expect(this.$target1).to.have.class(activeClass);
      expect(this.$target2).to.not.have.class(activeClass);
    });
  });

});
