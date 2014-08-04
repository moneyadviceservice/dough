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

  function isActive($target) {
    return $target.hasClass(activeClass);
  }

  describe('closed by default', function() {

    beforeEach(function() {
      this.collapsable = new this.Collapsable(this.$html.filter('[data-dough-collapsable-trigger]'));
      this.collapsable.init();
      this.$trigger = this.$html.find('button');
      this.$triggerLabel = this.$html.find('[data-dough-collapsable-label]');
    });

    it('collapses the target panel by default', function() {
      expect(isActive(this.$target)).to.equal(false);
    });

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


  describe('expanded by default', function() {

    it('wraps a button around the trigger text', function() {
      this.collapsable = new this.Collapsable(
          this.$html.filter('[data-dough-collapsable-trigger]'),
          {
            forceTo: 'show'
          }
      );
      this.collapsable.init();
      expect(isActive(this.$target)).to.equal(true);
    });

  });

});
