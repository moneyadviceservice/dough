describe('componentLoader', function() {

  'use strict';

  beforeEach(function(done) {
    var self = this;
    window.Modernizr = {
      inputtypes: {
        range: true
      }
    };
    requirejs(['jquery', 'componentLoader', 'utilities'], function(jquery, componentLoader, utilities) {
      self.componentLoader = componentLoader;
      self.utilities = utilities;
      done();
    });
  });

  afterEach(function() {
    this.$html && this.$html.remove();
  });

  describe('init method', function() {

    beforeEach(function(done) {
      this.$html = $(window.__html__['spec/js/fixtures/componentLoader.html']);
      this.componentLoader.init(this.$html)
          .then(function() {
            done();
          });
    });

    it('should initialize all components in the DOM', function() {
      var allInitialised = true,
          $component,
          componentNames,
          self = this;

      // NOTE: components add a "data-dough-<componentName>-initialised='yes'" attribute to themselves once
      // they have successfully initialised
      this.$html.find('[data-dough-component]:not([data-dough-defer])').each(function() {
        $component = $(this);
        componentNames = $component.attr('data-dough-component').split(' ');
        $.each(componentNames, function(idx, componentName) {
          componentName = self.utilities.convertCamelCaseToDashed(componentName);
          if (!$component.is('[data-dough-' + componentName + '-initialised="yes"]')) {
            allInitialised = false;
            return false;
          }
        });
      });
      expect(allInitialised).to.equal(true);
    });

    it('should ignore deferred components', function() {
      var allInitialised = true;

      this.$html.find('[data-dough-component][data-dough-defer]').each(function() {
        var $component,
            componentName;

        $component = $(this);
        componentName = $component.attr('data-dough-component').split(' ');
        if (!$component.is('[data-dough-' + componentName + '-initialised="yes"]')) {
          allInitialised = false;
          return false;
        }
      });
      expect(allInitialised).to.be.false;
    });

    it('should enable a deferred component', function(done) {
      var $deferredComponent = this.$html.find('[data-dough-component][data-dough-defer]').eq(0);

      this.componentLoader.init(this.$html, true).then(function() {
        expect($deferredComponent.is('[data-dough-range-input-initialised="yes"]')).to.be.true;
        done();
      });
    });

    it('should set a flag to indicate all components have been initialised', function() {
      expect($('body').is('[data-dough-component-loader-all-loaded="yes"]')).to.equal(true);
    });

    it('should fire a COMPONENTS_COMPLETE.DoughBaseEvent when all components have been initialised', function() {
      var spy = sinon.spy();

      this.$html.on('COMPONENTS_COMPLETE.DoughBaseEvent', spy);

      this.componentLoader.init(this.$html, true).then(function() {
        expect(spy.called).to.be.true;
        done();
      });
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
      this.$html = $(window.__html__['spec/js/fixtures/componentLoader.html']);
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
      this.$html = $(window.__html__['spec/js/fixtures/componentLoader.html']);
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
      this.$html = $(window.__html__['spec/js/fixtures/componentLoader.html']);
      requirejs(['jquery', 'RangeInput', 'TabSelector'], function(jquery, RangeInput, TabSelector) {
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

  describe('Some component types should only have one instance', function() {

    beforeEach(function(done) {
      var self = this;
      this.$html = $(window.__html__['spec/js/fixtures/componentLoader.html']);
      requirejs(['jquery', 'TabSelector'], function(jquery, TabSelector) {
        self.TabSelector = TabSelector;
        self.TabSelector.isSingleton = true;
        self.componentLoader.init(self.$html)
            .then(function(results) {
              self.results = results;
              done();
            });
      });
    });

    afterEach(function() {
      delete this.TabSelector;
    });

    it('will not allow a second instance of a "single instance" component to be created', function() {
      var tabSelectorCount = $.map(this.results, function(val) {
        if (val.value === 'TabSelector') {
          return val;
        }
      });
      expect(tabSelectorCount.length).to.equal(1);
    });

  });

});
