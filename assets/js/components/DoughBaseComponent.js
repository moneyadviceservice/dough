/**
 * This is used as the base class for all modules.
 * All components should extend this class.
 *
 * Includes:
 *  - event binding/triggering
 *  - logging
 *  - i18n library
 *
 * @module DoughBaseComponent
 * @returns {class} DoughBaseComponent
 */
define([], function() {
  'use strict';

  var DoughBaseComponent;

  /**
   * @constructor
   * @param {object} $el - Trigger element (jQuery element)
   * @param {object} [config] - this can be passed directly via the constructor,
   * or if using `componentLoader`, then as a JSON object `data-dough-COMPONENTNAME-config="{'foo': {'bar': 'baz'}}"` on the
   * component's HTML element.
   * @param {object} [defaultConfig] - Default component configuration. Is overridden by `config` values.
   * @returns {instance}
   */
  DoughBaseComponent = function($el, config, defaultConfig) {
    if (!$el || !$el.length) {
      throw new Error('Element not supplied to DoughBaseComponent constructor');
    }
    this.config = $.extend({}, defaultConfig || {}, config || {});

    this.setElement($el);

    this._setComponentName(this.config.componentName);
    /*
     Populate this array with the data attributes this module will use.
     Exclude 'data-dough-' prefix, as this is automatically added.

     For example: ['collapsible', 'only-first']
     */
    this.attrs = [];

    this._bindUiEvents(this.config.uiEvents || {});
    return this;
  };

  /**
   * Extend DoughBaseComponent class using the supplied constructor
   * @param {function} Subclass - Class which will be extended
   * @param {function} [Superclass] - If not supplied, defaults to DoughBaseComponent
   */
  DoughBaseComponent.extend = function(Subclass, Superclass) {
    var Super = Superclass || DoughBaseComponent;

    function TempConstructor() {
    }

    TempConstructor.prototype = Super.prototype;
    Subclass.prototype = new TempConstructor();
    Subclass.prototype.constructor = Subclass;
    Subclass.baseConstructor = Super;
    Subclass.superclass = Super.prototype;
  };

  /**
   * Set the parent element for this context.
   * @param {object} $el _jQuery_ element
   */
  DoughBaseComponent.prototype.setElement = function($el) {
    this.$el = $el;
    return this;
  };

  /**
   * All DoughBaseComponents (if applicable) should have this method,
   * which will unbind all events it attaches when initialising itself.
   *
   * After this has been run, you can safely run 'delete [[instance]]' to remove it from memory.
   *
   * @return {instance}
   */
  DoughBaseComponent.prototype.destroy = function() {
    this._unbindUiEvents();
    return this;
  };

  /**
   * Set callbacks, where `this.events` is a hash of `{"event selector": "callback"}`:
   *
   *     {
   *       'mousedown .title':  'edit',
   *       'click .button':     'save',
   *       'click .open':       function(e) { ... }
   *     }
   *
   * Callbacks will be bound to the view, with `this` set properly.
   * Uses event delegation for efficiency.
   * Omitting the selector binds the event to `this.el`.
   * This only works for delegate-able events: not `focus`, `blur`, and
   * not `change`, `submit`, and `reset` in Internet Explorer.
   *
   * Adapted from the equivalent function in [BackboneJS](http://backbonejs.org/#View-delegateEvents).
   *
   * @param events
   * @returns {instance}
   */

  DoughBaseComponent.prototype._bindUiEvents = function(events) {
    var delegateEventSplitter = /^(\S+)\s*(.*)$/;

    if (!events) {
      return this;
    }

    this._unbindUiEvents();
    for (var key in events) {
      var method = this[events[key]];
      if (!method) {
        continue;
      }

      var match = key.match(delegateEventSplitter);
      var eventName = match[1], selector = match[2];
      method = $.proxy(method, this);
      eventName += '.' + this.componentName + '-boundUiEvents';
      if (selector === '') {
        this.$el.on(eventName, method);
      } else {
        this.$el.on(eventName, selector, method);
      }
    }
    return this;
  };

  /**
   * Clears all callbacks previously bound to the component with `delegateEvents`.
   * @returns {instance}
   */

  DoughBaseComponent.prototype._unbindUiEvents = function() {
    this.$el.off('.' + this.componentName + '-boundUiEvents');
    return this;
  };

  /**
   * Indicate that the component initialised successfully, passing its component name. The resolved
   * promise will be fed back to the component loader
   */
  DoughBaseComponent.prototype._initialisedSuccess = function(initialised) {
    this.$el.attr('data-dough-' + this.componentName + '-initialised', 'yes');
    initialised && initialised.resolve(this.componentName);
  };

  /**
   * Indicate that the component failed to initialise, passing its component name. The rejected
   * promise will be fed back to the component loader
   */
  DoughBaseComponent.prototype._initialisedFailure = function(initialised) {
    initialised && initialised.reject(this.componentName);
  };

  /**
   * Checks whether a componentName has been passed via the config and whether it is actually
   * present in [data-dough-component] and displays a warning
   * @param  {string} componentName The componentName to check
   * @private
   */
  DoughBaseComponentProto._setComponentName = function(componentName) {
    var warning;

    if (typeof componentName !== 'undefined') {
      if (this.$el.data('dough-component').indexOf(componentName)) {
        warning = '\'' + componentName + '\' componentName was not found in the data-dough-component attribute';
      }
      this.componentName = componentName;
    }
    else {
      warning = 'componentName not specified';
    }

    if (warning && console && console.warn) {
      console.warn(warning);
    }
  };

  return DoughBaseComponent;

});
