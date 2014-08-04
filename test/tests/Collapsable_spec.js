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
      this.$target.should.not.have.class(activeClass);
    });

    it('wraps a button around the trigger text', function() {
      expect(this.$trigger[0].tagName).to.equal('BUTTON');
    });

    it('adds visually hidden text to indicate the state of the button i.e open or closed', function() {
      this.$triggerLabel.should.have.text('Open');
      this.$trigger.click();
      this.$triggerLabel.should.have.text('Close');
    });

    it('adds an accessibility attribute linking the trigger to the target', function() {
      this.$trigger.should.have.attr('aria-controls', this.$target.attr('id'));
    });

    it('adds an accessibility attribute indicating the expanded state of the target', function() {
      this.$trigger.should.have.attr('aria-expanded', 'false');
      this.$trigger.click();
      this.$trigger.should.have.attr('aria-expanded', 'true');
      this.$trigger.click();
      this.$trigger.should.have.attr('aria-expanded', 'false');
    });

    it('activates the trigger and target panel when the trigger is clicked', function() {
      this.$trigger.click();
      this.$trigger.should.have.class(activeClass);
      this.$target.should.have.class(activeClass);
    });

    it('deactivates an active trigger and target panel when the trigger is clicked a second time', function() {
      this.$trigger.click();
      this.$trigger.click();
      this.$trigger.should.not.have.class(activeClass);
      this.$target.should.not.have.class(activeClass);
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
      this.$target.should.have.class(activeClass);
    });

  });

});
