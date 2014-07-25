/**
 * # Element visibility toggler.
 *
 * Requires an element to have a data-dough-toggler attribute. The application
 * file will spawn an instance of this class for each element it finds on the page.
 *
 * Events used: toggler:toggled(element, isShown) [Event for when the toggler is doing its work]
 *
 * See test fixture for sample markup - /test/fixtures/VisibilityToggler.html
 */

/**
 * Require from Config
 * @param  {[type]} $         [description]
 * @param  {[type]} DoughBaseComponent [description]
 * @return {[type]}           [description]
 * @private
 */
define(['jquery', 'DoughBaseComponent', 'eventsWithPromises'], function ($, DoughBaseComponent, eventsWithPromises) {
  'use strict';

  // Class variables
  var CollapsableProto,
      selectors = {
        activeClass: 'is-active',
        inactiveClass: 'is-inactive'
      };

  /**
   *
   * @param {jQuery} $el - mandatory - the trigger
   * @returns {Collapsable}
   * @constructor
   */
  function Collapsable($el) {
    this.selectors = selectors;
    DoughBaseComponent.apply(this, arguments);
    this.attrs = ['toggler'];
    this.$trigger = this.$el;
    this.$target = $('[data-dough-collapsable-target="' + this.$trigger.attr('data-dough-collapsable-trigger') + '"]');
    this._setupAccessibility();
    this.$trigger = this.$trigger.find('button');
    return this;
  }
  /**
   * Inherit from base module, for shared methods and interface
   * @type {[type]}
   * @private
   */
  DoughBaseComponent.extend(Collapsable);
  CollapsableProto = Collapsable.prototype;

  CollapsableProto._setupAccessibility = function () {

    this.$trigger.wrapInner('<button class="unstyled-button" type="button"/>');
    this.$trigger.find('button').prepend('<span class="visually-hidden">Open</span>');
  };

  /**
   * Init function
   * @return {Collapsable}
   */
  CollapsableProto.init = function (initialised) {
    // is the target element visible already
    this.isShown = !!this.$target.hasClass(this.selectors.activeClass);
    this.setListeners(true);
    this._initialisedSuccess(initialised);
    return this;
  };

  /**
   * Bind or unbind relevant DOM events
   * @param {Boolean} isActive Set to 'true' to bind to events, 'false' to unbind.
   */
  CollapsableProto.setListeners = function (isActive) {
    this.$trigger[isActive ? 'on' : ' off']('click', $.proxy(function (e) {
      this.toggle();
      e.preventDefault();
    }, this));

    return this;
  };

  /**
   * Toggle the element
   * @param  {[type]} forceTo Supply 'show' or 'hide' to
   * explicitly set, otherwise will automatically toggle
   * @return {[type]}         [description]
   */
  CollapsableProto.toggle = function (forceTo) {
    var func;

    // is there an override parameter?
    if (typeof forceTo !== 'undefined') {
      func = forceTo === 'show' ? 'addClass' : 'removeClass';
    } else {
      func = this.isShown ? 'removeClass' : 'addClass';
    }

    // toggle the element
    this.isShown = !!this.$target[func](selectors.activeClass).hasClass(selectors.activeClass);

    // toggle the class on the trigger element (active = shown / nothing = not shown)
    this.$trigger[func](selectors.activeClass);

    // can bind to this by eventsWithPromises.subscribe('toggler:toggled', function(Collapsable) { });
    if (typeof forceTo === 'undefined') {
      eventsWithPromises.publish('toggler:toggled', {
        emitter: this
      });
    }

    return this;
  };

  /**
   * Public method to unbind all events this instance bound.
   * @return {[type]}
   */
  CollapsableProto.destroy = function () {
    return this.setListeners(false);
  };

  return Collapsable;
});
