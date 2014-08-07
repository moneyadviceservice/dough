describe('Visibility toggler', function() {

  'use strict';

  var activeClass = 'is-active';

  beforeEach(function(done) {
    var self = this;
    requirejs(
        ['jquery', 'Collapsable'],
        function($, Collapsable) {
          self.Collapsable = Collapsable;
          self.$html = $(window.__html__['test/fixtures/Collapsable.html']).appendTo('body');
          self.$target = self.$html.filter('[data-dough-collapsable-target]');
          done();
        }, done);
  });

  afterEach(function() {
    this.$html.remove();
  });

  describe('closed by default', function() {

    beforeEach(function() {
      this.collapsable = new this.Collapsable(this.$html.filter('[data-dough-collapsable-trigger]'));
      this.collapsable.init();
      this.$trigger = this.$html.find('button');
      this.$triggerLabel = this.$html.find('[data-dough-collapsable-label]');
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

    it('wraps a button around the trigger text', function() {
      this.collapsable = new this.Collapsable(
          this.$html.filter('[data-dough-collapsable-trigger]'),
          {
            forceTo: 'show'
          }
      );
      this.collapsable.init();
      expect(this.$target).to.have.class(activeClass);
    });

  });

});
