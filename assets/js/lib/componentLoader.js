//= require dough/assets/js/lib/utilities
/**
 * UI component loader. Scans the supplied DOM for 'data-dough-component' attributes and initialises
 * components based on those attribute values
 *
 * The following markup will cause two components to be initialised, DropdownList and MultiToggler:
 *
 *     <div class="container">
 *       <div data-dough-component="DropdownList"></div>
 *       <div data-dough-component="MultiToggler"></div>
 *     </div>
 *
 * Components are created in two separate passes. The reason for this is so that all components can
 * have a chance to set up listeners to any other components they need. Once they are all created,
 * they are initialised (the `init` method of each is called) in a second pass.
 *
 * @module componentLoader
 * @returns {Function} componentLoader
 */
define(['jquery', 'rsvp', 'utilities'], function($, RSVP, utilities) {

  'use strict';

  return {

    /**
     * Each key will store a component name and an array of
     * instances of that component type.
     * @attribute
     * @type {Object}
     */
    components: {},

    /**
     * Create components based on the supplied DOM fragment
     * @param {jQuery} [$container] - Uses `$('body')` if not supplied.
     * @param {Boolean} [includeDeferred] - Includes deferred objects when initialising components.
     * Deferred objects can be specified for later instantiation by specifying `data-dough-defer` on the HTML element.
     * @returns {Object} - a promise that will resolve or reject depending on whether all modules
     * initialised successfully
     */
    init: function($container, includeDeferred) {
      var componentsToCreate,
          instantiatedList,
          initialisedList,
          self = this,
          promises;

      this.components = {};
      // if no DOM fragment supplied, use the `<body>` tag
      $container = $container || $('body');
      componentsToCreate = this._listComponentsToCreate($container, includeDeferred || false);
      instantiatedList = this._createPromises(componentsToCreate);
      initialisedList = this._createPromises(componentsToCreate);
      if (componentsToCreate.length) {
        this._instantiateComponents(componentsToCreate, instantiatedList.deferreds);
        // Wait until all components are instantiated before initialising them in a second pass
        RSVP.allSettled(instantiatedList.promises).then(function(results) {
          self._checkForFailedInstantiations(results, initialisedList.deferreds);
          self._initialiseComponents(self.components, initialisedList.deferreds);
        });
      }
      promises = RSVP.allSettled(initialisedList.promises);
      promises.then(function() {
        $('body').attr('data-dough-component-loader-all-loaded', 'yes');
      });
      return promises;
    },

    _checkForFailedInstantiations: function(results, initialisedList) {
      $.each(results, function(idx, obj) {
        if ((obj.state === 'rejected') && (obj.reason.description === 'SINGLETON-DUPLICATE')) {
          initialisedList[idx].resolve();
          initialisedList.splice(idx, 1);
        }
      });
    },

    /**
     * Make an array of objects, each containing pointers to a component container and name
     * @param {Object} $container
     * @param {Boolean} [includeDeferred] - Includes deferred objects when initialising components
     * @returns {Array}
     */
    _listComponentsToCreate: function($container, includeDeferred) {
      var componentsToCreate = [],
          $els,
          $el,
          attrs,
          selector = '[data-dough-component]';

      if (!includeDeferred) {
        selector += ':not([data-dough-defer])';
      }

      $els = $container.is(selector)? $container : $container.find(selector);
      $els.each(function() {
        $el = $(this);
        attrs = $el.attr('data-dough-component').split(' ');
        $.each(attrs, function(idx, val) {
          if (!$el.is('[data-dough-' + val + '-initialised="yes"]')) {
            componentsToCreate.push({
              $el: $el,
              componentName: val
            });
          }
        });
      });
      return componentsToCreate;
    },

    /**
     * Create a hash of deferreds and their associated promise properties (useful for passing to a
     * 'master' deferred for resolution)
     * @param {Array} componentsToCreate
     * @returns {{deferreds: Array, promises: Array}}
     */
    _createPromises: function(componentsToCreate) {
      var obj = {
        deferreds: [],
        promises: []
      };

      $.each(componentsToCreate, function(idx) {
        obj.deferreds.push(RSVP.defer());
        obj.promises.push(obj.deferreds[idx].promise);
      });
      return obj;
    },

    /**
     * Instantiate all components
     * @param {Array} componentsToCreate
     * @param {Array} instantiatedList - array of deferreds, one to be assigned to each new
     * component
     */
    _instantiateComponents: function(componentsToCreate, instantiatedList) {
      var self = this;
      $.each(componentsToCreate, function(idx, componentData) {
        self._instantiateComponent(componentData.componentName, componentData.$el, instantiatedList[idx]);
      });
    },

    /**
     * Instantiate an individual component
     * @param {string} componentName
     * @param {object} $el
     * @param {object} instantiated - a deferred, to be resolved after each component is required /
     * instantiated, which may be async, hence the use of a deferred
     */
    _instantiateComponent: function(componentName, $el, instantiated) {
      var self = this,
          config = this._parseConfig($el, componentName);

      require([componentName], function(Constr) {
        if (!Constr.isSingleton || !self.components[componentName]) {
          if (!self.components[componentName]) {
            self.components[componentName] = [];
          }
          self.components[componentName].push(new Constr($el, config));
          instantiated.resolve();
        } else {
          instantiated.reject({
            componentName: componentName,
            description: 'SINGLETON-DUPLICATE'
          });
        }
      });
    },

    /**
     * The second pass - all components have been instantiated, so now call init() on each. This
     * has given all components a chance to subscribe to events from other components, before they
     * are initialised. If one component errors, catch it so others to initialise
     * @param {object} components - a hash of component names and arrays of instances
     * @param {array} initialisedList - list of promises, one to pass to each component so it can
     * indicate when it has initialised (it might need to conduct async activity to do so, so it's
     * not enough to just set a flag after the constructor is called)
     */
    _initialiseComponents: function(components, initialisedList) {
      var i = 0;

      $.each(components, function(componentName, list) {
        $.each(list, function(idx, instance) {
          try {
            instance.init && instance.init(initialisedList[i]);
          } catch (err) {
            initialisedList[i].reject(err);
          }
          i++;
        });
      });
    },

    /**
     * Extract any config from the DOM for a given component
     * @param {jQuery} $el - component container
     * @param {string} componentName
     * @returns {object} - parsed JSON config or empty object
     */
    _parseConfig: function($el, componentName) {
      var config = $el.attr('data-dough-' + utilities.convertCamelCaseToDashed(componentName) + '-config');
      try {
        config = JSON.parse(config);
      } catch (err) {
        config = {};
      }
      return config;
    }
  };

});
