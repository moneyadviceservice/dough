describe('Visibility toggler', function() {

  'use strict';

  var activeClass = 'is-active';

  beforeEach(function(done) {
    var self = this;

    this.$sandbox = $('<div />').appendTo('body');

    requirejs(['componentLoader'], function(componentLoader) {
      self.componentLoader = componentLoader;

      self.beforeEachHook = function(done, fixtureHTML) {
        this.$sandbox.html(fixtureHTML || $(window.__html__['spec/js/fixtures/Collapsable.html']).filter('#fixture-1').html());

        this.componentLoader.init(this.$sandbox)
          .then(function() {
            this.$trigger = this.$sandbox.find('button');
            this.$target = this.$sandbox.find('[data-dough-collapsable-target]');
            this.$triggerLabel = this.$sandbox.find('[data-dough-collapsable-label]');
            done();
          }.bind(this));
      };
      done();
    });
  });

  afterEach(function() {
    this.$sandbox.empty();
  });

  describe('closed by default', function() {

    beforeEach(function(done) {
      this.beforeEachHook.call(this, done);
    });

    it('collapses the target panel by default', function() {
      expect(this.$target).to.not.have.class(activeClass);
    });

    it('wraps a button around the trigger text', function() {
      expect(this.$trigger[0].tagName).to.equal('BUTTON');
    });

    it('adds visually hidden text to indicate the state of the button i.e open or closed', function() {
      expect(this.$triggerLabel).to.have.class('visually-hidden');
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

  describe('On blur', function() {

    beforeEach(function(done) {
      var fixtureHTML = $(window.__html__['spec/js/fixtures/Collapsable.html']).filter('#fixture-3').html();
      this.beforeEachHook.call(this, done, fixtureHTML);
    });

    it('collapsable target should be toggled if focus is lost from the trigger or target', function() {
      this.$trigger.click();
      expect(this.$target).to.have.class(activeClass);
      expect(this.$trigger).to.have.class(activeClass);
      $('body').click();
      expect(this.$target).to.not.have.class(activeClass);
      expect(this.$trigger).to.not.have.class(activeClass);
    });

  });


  describe('expanded by default', function() {
    beforeEach(function(done) {
      var fixtureHTML = $(window.__html__['spec/js/fixtures/Collapsable.html']).filter('#fixture-2').html();
      this.beforeEachHook.call(this, done, fixtureHTML);
    });

    it('wraps a button around the trigger text', function() {
      expect(this.$target).to.have.class(activeClass);
    });

  });


  describe('Panel focussed after opening by default', function() {
    beforeEach(function(done) {
      var fixtureHTML = $(window.__html__['spec/js/fixtures/Collapsable.html']).filter('#fixture-1').html();
      this.beforeEachHook.call(this, done, fixtureHTML);
    });

    it('collapsable target should be focussed', function() {
      this.$trigger.click();
      expect(this.$target[0]).to.equal(document.activeElement);
    });
  });


  describe('Panel not focussed after opening', function() {
    beforeEach(function(done) {
      var fixtureHTML = $(window.__html__['spec/js/fixtures/Collapsable.html']).filter('#fixture-4').html();
      this.beforeEachHook.call(this, done, fixtureHTML);
    });

    it('collapsable target should not be focussed', function() {
      this.$trigger.click();
      expect(this.$target[0]).to.not.equal(document.activeElement);
    });
  });


  describe('Panel focussed after opening', function() {
    beforeEach(function(done) {
      var fixtureHTML = $(window.__html__['spec/js/fixtures/Collapsable.html']).filter('#fixture-5').html();
      this.beforeEachHook.call(this, done, fixtureHTML);
    });

    it('collapsable target should be focussed', function() {
      this.$trigger.click();
      expect(this.$target[0]).to.equal(document.activeElement);
    });
  });

  describe('Grouped collapsables', function() {
    beforeEach(function(done) {
      var fixtureHTML = $(window.__html__['spec/js/fixtures/Collapsable.html']).filter('#fixture-6').html();
      this.beforeEachHook.call(this, done, fixtureHTML);
    });

    it('collapsables in a group should close when one of them is clicked', function() {
      this.$sandbox.find('button').last().click();
      expect(this.$target.first().attr('class')).to.equal('target');

      this.$sandbox.find('button').first().click();
      expect(this.$target.last().attr('class')).to.equal('target');
    });
  });


  describe('Show labels attribute', function() {
    beforeEach(function(done) {
      var fixtureHTML = $(window.__html__['spec/js/fixtures/Collapsable.html']).filter('#fixture-7').html();
      this.beforeEachHook.call(this, done, fixtureHTML);
    });

    it('does not have the hidden class', function() {
      expect(this.$triggerLabel).to.not.have.class('visually-hidden');
    });

    it('has the expected class', function() {
      expect(this.$triggerLabel).to.have.class('collapsable-icon-label');
    });
  });

  describe('Icon position attribute', function() {
    beforeEach(function(done) {
      var fixtureHTML = $(window.__html__['spec/js/fixtures/Collapsable.html']).filter('#fixture-8').html();
      this.beforeEachHook.call(this, done, fixtureHTML);
    });

    it('Has the icon-right class', function() {
      expect(this.$trigger).to.have.class('visually-hidden');
    });
  });

});
