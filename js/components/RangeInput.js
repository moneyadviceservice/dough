/**
 * Clone a range input / slider from an existing text / number input, when the range type is supported by the browser
 * @param  {[type]} $         [description]
 * @param  {[type]} VisibilityToggler [description]
 * @return {[type]}           [description]
 * @private
 */
define(['jquery', 'MASModule', 'featureDetect'], function ($, MASModule, featureDetect) {
  'use strict';

  /**
   * Call base constructor
   * @constructor
   */
  var RangeInput = function () {
    RangeInput.baseConstructor.apply(this, arguments);
  };

  MASModule.extend(RangeInput);

  /**
   * Init - detect range type support and clone input / label
   * @param initialised
   */
  RangeInput.prototype.init = function(initialised) {

    var $baseEl,
        $newEl;

    if (featureDetect.html5Inputs.range) {
      $baseEl = this.$el.find('[data-mas-range-input]');
      $newEl = $baseEl
          .clone()
          .removeClass('input--label')
          .addClass('.form__input--range')
          .attr({
            'id': $baseEl.attr('id') + '_range',
            'rv-range': $baseEl.attr('rv-inputchange'),
            'type': 'range',
            'aria-role': 'slider'
          })
          .removeAttr('rv-inputchange name data-mas-range-input')
          .on('input change', function () { // recapture focus on slider for iOS w/ Voiceover
            $(this).focus();
          })
          .appendTo(this.$el);

      this.$el.find('label[for="' + $baseEl.attr('id') + '"]')
          .clone()
          .attr('for', $newEl.attr('id'))
          .attr('class', 'visually-hidden')
          .insertBefore($newEl);
    }
    this._initialisedSuccess(initialised);
  };

  return RangeInput;

});
