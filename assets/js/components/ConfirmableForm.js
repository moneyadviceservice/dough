/**
 * # Confirmable form
 *
 * A form that pops up a confirm dialogue before submission.
 * If the user says no, submission is blocked.
 * Otherwise, it submits as normal.
 *
 * You can set the confirmation message by setting the
 * attribute `data-dough-confirmation-message`.
 *
 * @module ConfirmableForm
 * @returns {class} ConfirmableForm
 */

define(['jquery', 'DoughBaseComponent'],
       function($, DoughBaseComponent) {
  'use strict';

  var ConfirmableFormProto,
      defaultConfig = {
        messageAttribute: 'data-dough-confirmation-message'
      };

  /**
   * @constructor
   * @extends {DoughBaseComponent}
   * @param {HTMLElement} $el    Element with dough-component on it
   * @param {Object}      config Hash of config options
   */
  function ConfirmableForm($el, config) {
    ConfirmableForm.baseConstructor.call(this, $el, config, defaultConfig);
  }

  /**
   * Inherit from base module, for shared methods and interface
   */
  DoughBaseComponent.extend(ConfirmableForm);
  ConfirmableForm.componentName = 'ConfirmableForm';
  ConfirmableFormProto = ConfirmableForm.prototype;

  /**
   * Init function
   *
   * Set up listeners and accept promise
   *
   * @param {Object} initialised Promise passed from eventsWithPromises (RSVP Promise).
   * @returns {MultiTableFilter}
   */
  ConfirmableFormProto.init = function(initialised) {
    this.message = this.$el.attr(this.config.messageAttribute);
    this.bindListenerToForm();
    this._initialisedSuccess(initialised);
    return this;
  };

  /**
   * bindListenerToForm
   *
   * Binds `submit` listener to form tag that pops
   * up a confirm dialogue.
   */
  ConfirmableFormProto.bindListenerToForm = function() {
    var self = this,
        $form = self.getFormFromComponent();

    $form.submit(function(e) {
      if(window.confirm(self.message)) {
        return true;
      } else {
        $.event.fix(e).preventDefault();
      }
    });
  };

  /**
   * getFormFromComponent
   *
   * If the component itself is a form, use that.
   * Otherwise, use the nearest parent form.
   *
   * @returns {HTMLElement} Form element to be used.
   */
  ConfirmableFormProto.getFormFromComponent = function() {
    if(this.$el.is('form')) { return this.$el; }
    return this.$el.parents('form').first();
  };

  return ConfirmableForm;
});
