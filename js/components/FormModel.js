/**
 * Bind form inputs to a simple data model held in memory (an object literal / hash of keys and values).
 * When the form submits, serialize the model and send to the server, then update it with the response.
 */
define(['jquery', 'DoughBaseComponent', 'dataBinding'], function($, DoughBaseComponent, dataBinding) {

  'use strict';

  var FormModel = function() {
    FormModel.baseConstructor.apply(this, arguments);
  };

  /**
   * Inherit from base module, for shared methods and interface
   */
  DoughBaseComponent.extend(FormModel);

  /**
   * Set up and populate the model from the form inputs
   * @param {Promise} initialised
   */
  FormModel.prototype.init = function(initialised) {

    this.model = {};
    this.view = dataBinding.bind(this.$el, this.model);
    // this will initially populate the model from values in the DOM
    this.view.publish();

    this._bindFormSubmit();
    this._initialisedSuccess(initialised);
  };

  /**
   * Hijack the form submit and send the model to the server
   * @private
   */
  FormModel.prototype._bindFormSubmit = function() {
    var self = this;
    this.$el.on('submit', function(e) {
      $.ajax({
        url: self.$el.attr('action'),
        dataType: 'json',
        data: $.param(self._getModelProperties())
      })
          .done(function(data) {
            $.extend(self.model, data);
          });
      e.preventDefault();
    });
  };

  FormModel.prototype._getModelProperties = function() {
    var model = $.extend({}, this.model);

    $.each(this.model, function(key, val) {
      if (typeof val === 'function') {
        delete model[key];
      }
    });
    return model;
  };

  return FormModel;
});
