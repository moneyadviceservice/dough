/**
 * # Element visibility toggler.
 *
 * Requires an element to have a data-dough-component="Collapsable" attribute. The application
 * file will spawn an instance of this class for each element it finds on the page.
 *
 * Events used: toggler:toggled(element, isShown) [Event for when the toggler is doing its work]
 *
 * See test fixture for sample markup - /spec/js/fixtures/Collapsable.html
 */

/**
 * Require from Config
 * @param  {[type]} $         [description]
 * @param  {[type]} DoughBaseComponent [description]
 * @return {[type]}           [description]
 * @private
 */
define(['jquery', 'DoughBaseComponent', 'eventsWithPromises'], function($, DoughBaseComponent, eventsWithPromises) {
  'use strict';

  // Class variables
  var CollapsableProto,
      defaultConfig = {
        hideOnBlur: false,
        forceTo: false,
        focusTarget: true,
        selectors: {
          trigger: '[data-dough-collapsable-trigger]',
          activeClass: 'is-active',
          inactiveClass: 'is-inactive',
          iconClassOpen: 'icon--down-chevron-blue',
          iconClassClose: 'icon--up-chevron-blue'
        },
        i18nStrings: {
          open: 'Show',
          close: 'Hide'
        }
      };

  /**
   *
   * @param {jQuery} $el - mandatory - the trigger
   * @param {object} config
   * @returns {Collapsable}
   * @constructor
   */
  function Collapsable($el, config) {
    Collapsable.baseConstructor.call(this, $el, config, defaultConfig);

    this.$triggers = this.$el.is(this.config.selectors.trigger)? this.$el : this.$el.find(this.config.selectors.trigger);
    this.$target = $('[data-dough-collapsable-target="' + this.$triggers.attr('data-dough-collapsable-trigger') + '"]');
    this._setupAccessibility();
    this.handleUIEventTracking = $.proxy(this.handleUIEventTracking, this);
    config && config.forceTo && this.toggle(config.forceTo, false);
    return this;
  }

  /**
   * Inherit from base module, for shared methods and interface
   * @type {[type]}
   * @private
   */
  DoughBaseComponent.extend(Collapsable);
  CollapsableProto = Collapsable.prototype;

  CollapsableProto._setupAccessibility = function() {
    var id = 'data-dough-collapsable-target-' + this.$target.attr('data-dough-collapsable-target');

    this.$triggers.wrapInner('<button class="unstyled-button" type="button"/>');
    this.$triggers.find('button')
        .prepend('<span data-dough-collapsable-icon class="collapsable__trigger-icon icon ' +
            this.config.selectors.iconClassOpen + '"></span>')
        .append('<span class="visually-hidden" data-dough-collapsable-label>' +
            this.config.i18nStrings.open + '</span>')
        .attr('aria-controls', id)
        .attr('aria-expanded', 'false');
    this.$target.attr('id', id);
    this.$triggers = this.$triggers.find('button');
  };

  /**
   * Init function
   * @return {Collapsable}
   */
  CollapsableProto.init = function(initialised) {
    // is the target element visible already
    this.isShown = !!this.$target.hasClass(this.config.selectors.activeClass);
    this.setListeners(true);
    this._initialisedSuccess(initialised);
    return this;
  };

  /**
   * Bind or unbind relevant DOM events
   * @param {Boolean} isActive Set to 'true' to bind to events, 'false' to unbind.
   */
  CollapsableProto.setListeners = function(isActive) {
    this.$triggers[isActive ? 'on' : ' off']('click', $.proxy(function() {
      this.toggle();
    }, this));

    return this;
  };

  /**
   * Bind or unbinds the UI Events for tracking the current target
   */
  CollapsableProto.setTargetTrackingListeners = function(isActive) {
    $('body')[isActive ? 'on' : 'off']('click touchend keyup', this.handleUIEventTracking);

    return this;
  };

  /**
   * Handler function for tracking event targets
   * Checks if trigger element is focussed, if the focus is within the target
   * @param  {Object} e The event object for the current target
   * @return {this} This
   */
  CollapsableProto.handleUIEventTracking = function(e) {
    var $currentTarget = $(e.target);
    if (!$currentTarget.is(this.$triggers) && !$currentTarget.closest(this.$target).length) {
      this.toggle('hide');
    }

    return this;
  };

  /**
   * Toggle the element
   * @param  {[type]} forceTo Supply 'show' or 'hide' to
   * explicitly set, otherwise will automatically toggle
   * @param {boolean} [focusTarget] - whether to focus the panel. Defaults to `config.focusTarget`
   * @return {[type]}         [description]
   */
  CollapsableProto.toggle = function(forceTo, focusTarget) {
    var func,
        label,
        expandedLabel,
        iconClass;

    // is there an override parameter?
    if (typeof forceTo !== 'undefined') {
      func = forceTo === 'show' ? 'addClass' : 'removeClass';
    } else {
      func = this.isShown ? 'removeClass' : 'addClass';
    }


    // toggle the element
    this.isShown = !!this.$target[func](this.config.selectors.activeClass).hasClass(this.config.selectors.activeClass);

    // toggle the class on the trigger element (active = shown / nothing = not shown)
    this.$triggers[func](this.config.selectors.activeClass);

    if (this.isShown === true) {
      label = this.config.i18nStrings.close;
      expandedLabel = 'true';
      iconClass = this.config.selectors.iconClassClose;
      if (focusTarget !== false && this.config.focusTarget) {
        this.$target
            .attr('tabindex', -1)
            .focus();
      }
      if (this.config.hideOnBlur) {
        this.setTargetTrackingListeners(true);
      }
    } else {
      label = this.config.i18nStrings.open;
      expandedLabel = 'false';
      iconClass = this.config.selectors.iconClassOpen;
      if (this.config.hideOnBlur) {
        this.setTargetTrackingListeners(false);
      }
    }

    this.$triggers.find('[data-dough-collapsable-label]').text(label);
    this.$triggers.attr('aria-expanded', expandedLabel);
    this.$triggers
        .find('[data-dough-collapsable-icon]')
        .removeClass(this.config.selectors.iconClassOpen + ' ' + this.config.selectors.iconClassClose).addClass(iconClass);

    // can bind to this by eventsWithPromises.subscribe('toggler:toggled', function(Collapsable) { });
    if (typeof forceTo === 'undefined') {
      eventsWithPromises.publish('toggler:toggled', {
        emitter: this,
        visible: this.isShown
      });
    }

    return this;
  };

  return Collapsable;
});
