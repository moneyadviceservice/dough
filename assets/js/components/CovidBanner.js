define(['jquery', 'DoughBaseComponent'],
  function($, DoughBaseComponent) {
  'use strict';

  var CovidBanner,
      defaultConfig = {};

  CovidBanner = function($el, config) {
    CovidBanner.baseConstructor.call(this, $el, config, defaultConfig);
  };

  /**
  * Inherit from base module, for shared methods and interface
  */
  DoughBaseComponent.extend(CovidBanner);

  CovidBanner.componentName = 'CovidBanner';

  /**
  * @param {Promise} initialised
  */
  CovidBanner.prototype.init = function(initialised) {
    this._initialisedSuccess(initialised);
  };

  return CovidBanner;
});
