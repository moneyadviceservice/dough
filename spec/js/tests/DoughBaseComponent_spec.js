describe('DoughBaseComponent', function() {
  'use strict';

  var sandbox;

  beforeEach(function(done) {
    var self = this;
    requirejs(['DoughBaseComponent'], function(DoughBaseComponent) {
      self.$html = $(window.__html__['spec/js/fixtures/DoughBaseComponent.html']);
      self.component = self.$html;
      self.DoughBaseComponent = DoughBaseComponent;
      sandbox = sinon.sandbox.create();
      done();
    });
  });

  afterEach(function() {
    this.$html.remove();
    sandbox.restore();
  });

  describe('instantiation', function() {
    it('should cache the element passed to the constructor', function() {
      var doughBaseComponent = new this.DoughBaseComponent(this.component, { componentName: 'Foo' });

      expect(doughBaseComponent.$el).to.equal(this.$html);
    });

    it('should use the config passed to the constructor', function() {
      var config,
          doughBaseComponent;

      config = {
        componentName: 'Foo',
        foo: 'bar'
      };

      doughBaseComponent = new this.DoughBaseComponent(this.component, config);

      expect(doughBaseComponent.config).to.eql({ foo: 'bar', componentName: 'Foo' });
    });

    it('should set the componentName', function() {
      var config,
          doughBaseComponent;

      config = {
        componentName: 'Foo'
      };

      doughBaseComponent = new this.DoughBaseComponent(this.component, config);

      expect(doughBaseComponent.componentName).to.equal('Foo');
      expect(doughBaseComponent.componentAttributeName).to.equal('foo');
    });

    it('should mix the passed config into the component\'s defaultConfig', function() {
      var doughBaseComponent,
          config,
          defaultConfig;

      defaultConfig = {
        componentName: 'Foo',
        foo: 'baz',
        baz: 'qux'
      };

      config = {
        foo: 'bar'
      };

      doughBaseComponent = new this.DoughBaseComponent(this.component, config, defaultConfig);

      expect(doughBaseComponent.config).to.eql({
        componentName: 'Foo',
        baz: 'qux',
        foo: 'bar'
      });
    });
  });

  describe('initialisation', function () {
    var initialised = {
      resolve: function() {},
      reject: function() {}
    };

    describe('successful', function () {
      it('should call the resolve (promise) function', function() {
        var spy = sandbox.spy(initialised, 'resolve'),
            doughBaseComponent = new this.DoughBaseComponent(this.component, { componentName: 'Foo' });

        doughBaseComponent._initialisedSuccess(initialised);

        expect(spy.called).to.be.true;
      });

      it('should stamp an initialised="yes" attribute on the component element', function() {
        var doughBaseComponent = new this.DoughBaseComponent(this.component, { componentName: 'Foo' });

        doughBaseComponent._initialisedSuccess(initialised);

        expect(doughBaseComponent.$el).to.have.attr('data-dough-foo-initialised', 'yes');
      });
    });

    describe('failed', function () {
      it('should call the reject (promise) function', function() {
        var spy = sandbox.spy(initialised, 'reject'),
            doughBaseComponent = new this.DoughBaseComponent(this.component, { componentName: 'Foo' });

        doughBaseComponent._initialisedFailure(initialised);

        expect(spy.called).to.be.true;
      });
    });
  });

  describe('extending', function () {
    it('should allow extending from the DoughBaseComponent', function() {
      var ExtendedComponent,
          extendedComponent;

      ExtendedComponent = function($el, config) {
        ExtendedComponent.baseConstructor.call(this, $el, config);
      };
      this.DoughBaseComponent.extend(ExtendedComponent);

      extendedComponent = new ExtendedComponent(this.$html, { componentName: 'Foo' });

      expect(extendedComponent).to.be.instanceof(this.DoughBaseComponent);
    });
  });

  describe('events', function () {
    beforeEach(function () {
      this.$button = $('<button data-dough-base-component-btn />');
      this.component.append(this.$button);
    });

    describe('binding events', function () {
      it('should bind UI events to the elements specified in the events hash', function() {
        var doughBaseComponent,
            spy;

        this.DoughBaseComponent.prototype.fn = function() {};
        spy = sandbox.stub(this.DoughBaseComponent.prototype, 'fn');

        doughBaseComponent = new this.DoughBaseComponent(this.component, {
          componentName: 'Foo',
          uiEvents: {
            'click [data-dough-base-component-btn]': 'fn'
          }
        });

        this.$button.click();
        delete this.DoughBaseComponent.prototype.fn;

        expect(spy.called).to.be.true;
      });
    });

    describe('unbinding events', function () {
      it('should unbind any events on the element when the destroy() method is invoked', function() {
        var doughBaseComponent,
            spy;

        this.DoughBaseComponent.prototype.fn = function() {};
        spy = sandbox.stub(this.DoughBaseComponent.prototype, 'fn');

        doughBaseComponent = new this.DoughBaseComponent(this.component, {
          componentName: 'Foo',
          uiEvents: {
            'click [data-dough-base-component-btn]': 'fn'
          }
        });

        this.$button.click();
        expect(spy.callCount).to.equal(1);
        doughBaseComponent.destroy();

        this.$button.click();
        expect(spy.callCount).to.equal(1);
      });
    });
  });

});
