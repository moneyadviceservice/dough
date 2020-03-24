define(['jquery', 'DoughBaseComponent'],
  function($, DoughBaseComponent) {
  'use strict';

  var CovidBanner,
      defaultConfig = {};

  CovidBanner = function($el, config) {
    CovidBanner.baseConstructor.call(this, $el, config, defaultConfig);

    this.closeBtn = this.$el.find('[data-dough-close]'); 
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
    this._setUpEvents(); 
  };

  CovidBanner.prototype._setUpEvents = function() {
    var _this = this; 

    this.closeBtn.click(function(e) {
      e.preventDefault(); 
      _this._setCookie(); 
      _this._removeBanner(); 
    }); 
  }; 

  CovidBanner.prototype._setCookie = function() {
    console.log('_setCookie!'); 
  }; 

  CovidBanner.prototype._removeBanner = function() {
    console.log('_removeBanner!'); 
  }; 

  return CovidBanner;
});
