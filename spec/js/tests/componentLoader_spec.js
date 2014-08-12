describe('componentLoader', function() {

  'use strict';

  beforeEach(function(done) {
    var self = this;
    window.Modernizr = {
      inputtypes: {
        range: true
      }
    };
    requirejs(['componentLoader'], function(componentLoader) {
      self.componentLoader = componentLoader;
      done();
    });
  });

  describe('init method', function() {

    beforeEach(function(done) {
      this.$html = $(window.__html__['test/fixtures/componentLoader.html']).appendTo('body');
      this.componentLoader.init(this.$html)
          .then(function() {
            done();
          });
    });

    it('should initialize all components in the DOM', function() {
      var allInitialised = true,
          $component,
          componentNames;

      // NOTE: components add a "data-dough-<componentName>-initialised='yes'" attribute to themselves once
      // they have successfully initialised
      this.$html.find('[data-dough-component]').each(function(){
        $component = $(this);
        componentNames = $component.attr('data-dough-component').split(' ');
        $.each(componentNames, function(idx, componentName) {
          if (!$component.is('[data-dough-' + componentName + '-initialised="yes"]')) {
            allInitialised = false;
          }
        });
      });
      expect(allInitialised).to.equal(true);
    });

    it('should set a flag to indicate all components have been initialised', function() {
      expect($('body').is('[data-dough-component-loader-all-loaded="yes"]')).to.equal(true);
    });

    it('should keep track of all initialized components', function() {
      var self = this;
      expect(this.componentLoader.components.TabSelector.length).to.equal(2);
      expect(this.componentLoader.components.RangeInput.length).to.equal(2);
      expect(this.componentLoader.components.Collapsable.length).to.equal(1);
      $.each(this.componentLoader.components, function(componentName, list) {
        $.each(list, function(i, component) {
          expect(self.$html.find(component.$el).length).to.equal(1);
        });
      });
    });

    it('should return a promise', function() {
      expect(typeof this.componentLoader.init().then).to.equal('function');
    });

    it('should supply any config to component', function() {
      expect(this.componentLoader.components.TabSelector[0].config.model.key).to.equal('value');
    });

    it('should allow multiple components to be initialised on the same element', function() {
      expect(this.componentLoader.components.RangeInput.length).to.eq(2);
      expect(this.componentLoader.components.Collapsable.length).to.eq(1);
    });

  });

  describe('init receives summary of success / failure of init of components', function() {

    beforeEach(function(done) {
      var self = this;
      this.$html = $(window.__html__['test/fixtures/componentLoader.html']);
      // make one of the components fail to init by removing some required elements
      this.$html.find('[data-dough-component="TabSelector"]').last().empty();
      this.componentLoader.init(this.$html)
          .then(function(results) {
            self.results = results;
            done();
          });
    });

    it('should receive array of init results with the failed component indicating its state', function() {
      expect(this.results.constructor).to.equal(Array);
      var failed = $.map(this.results, function(o) {
        return (o.state === 'rejected') ? o : null;
      });
      expect(failed[0].reason).to.equal('TabSelector');
    });

  });

  describe('init receives summary of successful init of components', function() {

    beforeEach(function(done) {
      var self = this;
      this.$html = $(window.__html__['test/fixtures/componentLoader.html']);
      this.componentLoader.init(this.$html)
          .then(function(results) {
            self.results = results;
            done();
          });
    });

    it('should receive array of init results with the successful components indicating their state', function() {
      expect(this.results.constructor).to.equal(Array);
      var succeeded = $.map(this.results, function(o) {
        return (o.state === 'fulfilled') ? o : null;
      });
      expect(succeeded.length).to.equal(5);
    });

  });

  describe('errors during initialisation are trapped', function() {

    beforeEach(function(done) {
      var self = this;
      this.$html = $(window.__html__['test/fixtures/componentLoader.html']);
      requirejs(['RangeInput', 'TabSelector'], function(RangeInput, TabSelector) {
        RangeInput.prototype.init = function() {
          throw 'Test error';
        };
        TabSelector.prototype.init = function(initialised) {
          this._initialisedSuccess(initialised);
        };
        self.componentLoader.init(self.$html)
            .then(function(results) {
              self.results = results;
              done();
            });
      });
    });

    it('should allow other components to initialise even if one throws an error during init', function() {
      var failed,
          succeeded;

      failed = $.map(this.results, function(o) {
        return (o.state === 'rejected') ? o : null;
      });
      succeeded = $.map(this.results, function(o) {
        return (o.state === 'fulfilled') ? o : null;
      });
      expect(failed.length).to.equal(2);
      expect(succeeded.length).to.equal(3);
    });

  });

});