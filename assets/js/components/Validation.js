/**
 * Client side validation. Mirrors HTML5 validation API as much as possible.
 *
 * Supported types are:
 * - required
 * - minlength
 * - pattern
 * - min/max number range checking
 *
 * @param  {Object} $         jQuery
 * @return {Class}           Validation
 */
define(['jquery', 'DoughBaseComponent'], function($, DoughBaseComponent) {
  'use strict';

  var defaultConfig = {
    invalidClass: 'is-invalid',
    validClass: 'is-valid',
    rowInvalidClass: 'is-errored',
    validationSummaryClass: 'validation-summary',
    inlineErrorClass: 'js-inline-error'
  },

  uiEvents = {
    'blur input, select, textarea': '_handleBlurEvent',
    'keyup input, textarea': '_handleChangeEvent',
    'change select': '_handleChangeEvent',
    'submit': '_handleSubmit'
  },

  /**
   * Call base constructor
   * @constructor
   */
  Validation = function($el, config) {
    this.uiEvents = uiEvents;
    Validation.baseConstructor.apply(this, arguments);
    this.config = $.extend(defaultConfig, this.config);
  };

  DoughBaseComponent.extend(Validation);

  Validation.prototype.init = function() {
    this.ATTRIBUTE_VALIDATORS = {
      'required': '_validateRequired',
      'pattern': '_validatePattern',
      'min': '_validateMin',
      'max': '_validateMax',
      'minlength': '_validateMinLength'
    };

    this.errors = {};
    this._prepareMarkup();

    return this;
  };

  /**
   * Register an error, to be used with both inline and validation summary
   * @param {jQuery} $field        jQuery object of the field
   * @param {Object} fieldValidity The validity object generated by _getFieldValidity()
   * @return {Validation}        Class instance
   */
  Validation.prototype.addError = function($field, fieldValidity) {
    this.errors[$field.attr('id')] = fieldValidity;
    this.refreshInlineErrors();

    return this;
  };

  /**
   * Remove an error
   * @param  {jQuery} $field jQuery object of the field
   * @return {Validation}        Class instance
   */
  Validation.prototype.removeError = function($field) {
    delete this.errors[$field.attr('id')];
    this.refreshInlineErrors();

    return this;
  };

  /**
   * Refresh all the inline error messages
   * @return {Validation} Class instance
   */
  Validation.prototype.refreshInlineErrors = function() {
    $('.form__row').each($.proxy(function(i, o) {
      var $formRow = $(o),
          $errorContainer = $formRow.find('.' + this.config.inlineErrorClass),
          $inputs = $formRow.find('input, select, textarea'),
          errorHTML = "",
          rowHasErrors = false;

      $inputs.each($.proxy(function(_i, _o) {
        var $input = $(_o),
            inputID = $input.attr('id');

        if (typeof this.errors[inputID] !== 'undefined') {
          rowHasErrors = true;
          errorHTML += '<p>' + this.errors[inputID].message + '</p>';
        }
      }, this));

      if (rowHasErrors) {
        $formRow.addClass(this.config.rowInvalidClass);
      }
      else {
        $formRow.removeClass(this.config.rowInvalidClass);
      }

      $errorContainer.html(errorHTML);

    }, this));

    return this;
  };

  /**
   * Check a field's validity and update the errors hash
   * @param  {jQuery} $field The field to validate
   * @return {Validation}        Class instance
   */
  Validation.prototype.checkFieldValidity = function($field) {
    var fieldValidity = this._getFieldValidity($field);

    if (fieldValidity.hasError) {
      this.addError($field, fieldValidity);
    }
    else {
      this.removeError($field);
    }

    return this;
  };

  /**
   * Prepare the markup for both inline errors and the validation summary
   * @return {[type]} [description]
   */
  Validation.prototype._prepareMarkup = function() {
    this.$el.prepend($('<div class="' + this.config.validationSummaryClass + '" />').hide());

    $('.form__row').each($.proxy(function(i, o) {
      var $formRow = $(o);
      $formRow.prepend($('<span class="' + this.config.inlineErrorClass + '" />'));
    }, this));

    return this;
  };

  /**
   * Loop through the errors and build the summary markup
   * @return {Validation} Class instance
   */
  Validation.prototype._refreshValidationSummary = function() {
    var fieldID,
        fieldValidity,
        summaryHTML = '<ul id="validation-summary">';

    for (fieldID in this.errors) {
      fieldValidity = this.errors[fieldID];

      summaryHTML += '<li><a href="#' + fieldID + '">' + fieldValidity.message + '</a></li>';
    }

    summaryHTML += '</ul>';

    this.$el.find('.' + this.config.validationSummaryClass).html(summaryHTML).show();

    return this;
  };

  /**
   * Check a field's validity
   * @param  {jQuery} $field The field to validate
   * @return {Object}        A hash containing status and the appropriate error message
   */
  Validation.prototype._getFieldValidity = function($field) {
    var fieldValidity = {
      errors: [],
      isEmpty: false,
      isInvalid: false,
      hasError: false,
      message: '',
      $field: $field
    };

    // Populate the field validity with an array of results from the various validators
    $.each(this.ATTRIBUTE_VALIDATORS, $.proxy(function(attributeSelector, handler) {
      var attr = $field.attr(attributeSelector);
      if (attr) {
        fieldValidity.errors.push(this[handler]($field, $field.val(), attr));
      }
    }, this));

    // Hoist up to top level for ease of access
    $.each(fieldValidity.errors, function(i, validatorResults) {
      if (validatorResults.isEmpty) {
        fieldValidity.isEmpty = true;
      }

      if (validatorResults.isInvalid) {
        fieldValidity.isInvalid = true;
      }
    });

    fieldValidity.hasError = fieldValidity.isEmpty || fieldValidity.isInvalid;

    // Check which message to use
    if (fieldValidity.isEmpty) {
      fieldValidity.message = $field.attr('data-dough-validation-empty');
    }

    if (fieldValidity.isInvalid) {
      fieldValidity.message = $field.attr('data-dough-validation-invalid') || $field.attr('data-dough-validation-empty');
    }

    return fieldValidity;
  };

  /**
   * Build the markup for an inline error message
   * @param  {String} message The error message
   * @return {jQuery}         jQuery object in memory
   */
  Validation.prototype._buildInlineError = function($field, message) {
    return $('<p id="error-' + $field.attr('id') + '" class="error">' + message + '</p>');
  };


  Validation.prototype._validateRequired = function($field, value, required) {
    var validity = { name: 'required' };
    if (value == '') {
      validity.isEmpty = true;
    }

    return validity;
  };

  Validation.prototype._validatePattern = function($field, value, pattern) {
    var validity = { name: 'pattern' };
    if (!value.match(pattern)) {
      validity.isInvalid = true;
    }

    return validity;
  };

  Validation.prototype._validateMin = function($field, value, min) {
    var validity = { name: 'min' };
    if (Number(value) < min) {
      validity.isInvalid = true;
    }

    return validity;
  };

  Validation.prototype._validateMax = function($field, value, max) {
    var validity = { name: 'max' };
    if (Number(value) > min) {
      validity.isInvalid = true;
    }

    return validity;
  };

  Validation.prototype._validateMinLength = function($field, value, minlength) {
    var validity = { name: 'minlength' };
    // Check for more than 0 otherwise we clash with 'isEmpty'
    if (value.length > 0 && value.length < minlength) {
      validity.isInvalid = true;
    }

    return validity;
  };



  /**
   * Inline errors are shown on input blur
   * @param  {Event} e BlurEvent
   * @return {void}
   */
  Validation.prototype._handleBlurEvent = function(e) {
    this.checkFieldValidity($(e.target));
  };

  /**
   * Error messages get corrected as the user types. Only do this if we can see an error exists.
   * @param  {Object} e ChangeEvent
   * @return {void}
   */
  Validation.prototype._handleChangeEvent = function(e) {
    var $field = $(e.target);

    if (typeof this.errors[$field.attr('id')] === 'object') {
      this.checkFieldValidity($field);
    }
  };

  Validation.prototype._countErrors = function() {
    var p, count = 0;

    for (p in this.errors) {
      count++;
    }

    return count;
  };

  /**
   * The validation summary is updated on form submit
   * @return {void}
   */
  Validation.prototype._handleSubmit = function(e) {
    e.preventDefault();

    this.$el.find('input, textarea, select').each($.proxy(function(i, field) {
      this.checkFieldValidity($(field));
    }, this));

    if (this._countErrors()) {
      e.preventDefault();
      this._refreshValidationSummary();
    }
  };


  return Validation;

});
