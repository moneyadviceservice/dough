/**
 * Show/hide field tooltips when user focuses on relevant input field.
 *
 * @module FieldHelpText
 * @returns {class} FieldHelpText
 */
define(['jquery', 'DoughBaseComponent'], function($, DoughBaseComponent) {
  'use strict';

  var defaultConfig = {
    componentName: 'FieldHelpText',

    // Used to show/hide tooltip with focus
    hiddenClass: 'field-help-text--hidden',

    // Initially set for page load, so js-enabled users don't see the tooltips flashing on page load
    preInitHiddenClass: 'field-help-text--jshide'
  },
  FieldHelpText;

  /**
   * Call base constructor
   * @constructor
   * @extends {DoughBaseComponent}
   * @param {object} $el - Trigger element (_jQuery_ element)
   * @param {object} [config] - this can be passed directly via the constructor,
   * or if using `componentLoader`, then as a JSON object `data-dough-COMPONENTNAME-config="{'foo': {'bar': 'baz'}}"` on the
   * component's HTML element.
   * @returns {instance}
   */
  FieldHelpText = function($el, config) {
    FieldHelpText.baseConstructor.call(this, $el, config, defaultConfig);
    this.debounceTimer = null;
    this.init();
  };

  DoughBaseComponent.extend(FieldHelpText);

  /**
   * Initialises component
   * @returns {instance}
   */
  FieldHelpText.prototype.init = function() {
    var tooltipID = this.$el.attr('id');

    this.$inputTarget = $('input[aria-describedby="' + tooltipID + '"]');
    this.$el.removeClass(this.config.preInitHiddenClass);
    this.hideTooltip();
    this._addAccessibility();
    this._addListeners();

    return this;
  };

  /**
   * Show the tool tip
   * @returns {instance}
   */
  FieldHelpText.prototype.showTooltip = function() {
    this.$el.removeClass(this.config.hiddenClass);

    return this;
  };

  /**
   * Hide the tool tip
   * @returns {instance}
   */
  FieldHelpText.prototype.hideTooltip = function() {
    // Use this rather than $(...).is(':focus') as the latter fails in Phantom
    if (this.$inputTarget.get(0) !== document.activeElement) {
      this.$el.addClass(this.config.hiddenClass);
    }

    return this;
  };

  /**
   * Add ARIA roles
   * @returns {instance}
   */
  FieldHelpText.prototype._addAccessibility = function() {
    this.$el.attr('role', 'tooltip');
    return this;
  };

  /**
   * Setup event listeners on the input target
   * @returns {instance}
   */
  FieldHelpText.prototype._addListeners = function() {
    this.$inputTarget.
          on('focusin', $.proxy(this.showTooltip, this)).
          on('focusout', $.proxy(this._onBlur, this));

    return this;
  };

  /**
   * Setup onBlur events
   * @returns {instance}
   */
  FieldHelpText.prototype._onBlur = function() {
    var $activeElement = $(document.activeElement),
        $activeParents = $activeElement.parents();

    if (!($activeElement.is(this.$el) || $activeElement.is(this.$inputTarget) ||
      $activeParents.filter(this.$el).length || $activeParents.filter(this.$inputTarget).length)) {
      this.hideTooltip();
    }
  };

  return FieldHelpText;

});
