// @todo Add tests for _initialisedSuccess and _initialisedFailure

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
  });

  describe('extending', function () {
    it('should allow extending from the DoughBaseComponent constructor', function() {
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

        this.DoughBaseComponent.prototype.fn = $.noop;
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

        this.DoughBaseComponent.prototype.fn = $.noop;
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
