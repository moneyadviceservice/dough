/**
 * Clone a range input / slider from an existing text / number input, when the range type is supported by the browser
 * @param  {[type]} $         [description]
 * @param  {[type]} VisibilityToggler [description]
 * @return {[type]}           [description]
 * @private
 */
define(['jquery', 'MASModule', 'featureDetect', 'eventsWithPromises'], function ($, MASModule, featureDetect, eventsWithPromises) {
  'use strict';

  var defaultConfig = {
      keepSynced: true
    },

    /**
   * Call base constructor
   * @constructor
   */
  RangeInput = function ($el, config) {
    RangeInput.baseConstructor.apply(this, arguments);
    this.config = $.extend(defaultConfig, this.config);

    if (featureDetect.html5Inputs.range) {
      this._cloneElements();
    }
  };

  MASModule.extend(RangeInput);

  /**
   * Init - detect range type support and clone input / label
   * @param initialised
   */
  RangeInput.prototype.init = function(initialised) {
    this._initialisedSuccess(initialised);
  };

  RangeInput.prototype._cloneElements = function() {
    var $baseEl,
        $newEl;

    $baseEl = this.$el.find('[data-mas-range-input]');
    $newEl = $baseEl
        .clone()
        .removeClass('input--label')
        .addClass('form__input-range')
        .attr({
          'id': $baseEl.attr('id') + '_range',
          'type': 'range',
          'aria-role': 'slider'
        })
        .removeAttr('name data-mas-range-input')
        .on('input change', function () { // recapture focus on slider for iOS w/ Voiceover
          $(this).focus();
        })
        .appendTo(this.$el);

    this.$el.find('label[for="' + $baseEl.attr('id') + '"]')
        .clone()
        .attr('for', $newEl.attr('id'))
        .attr('class', 'visually-hidden')
        .insertBefore($newEl);

    if (this.config.keepSynced === true) {
      this._setupSyncInputs($baseEl, $newEl);
    }
  };

  RangeInput.prototype._setupSyncInputs = function($baseEl, $newEl) {
    $baseEl.on('change keyup', function() {
      var val = $baseEl.val();
      $newEl.val(val);
      eventsWithPromises.publish('rangeInput:change', {
        emitter: $baseEl,
        value: val
      });
    });
    $newEl.on('change input', function() {
      $baseEl.val($newEl.val());
    });
  };

  return RangeInput;

});
