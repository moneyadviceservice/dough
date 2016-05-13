/**
 * # Element visibility toggler.
 *
 * Requires an element to have a `data-dough-component="Collapsable"` attribute. The application
 * file will spawn an instance of this class for each element it finds on the page.
 *
 * Events used: `toggler:toggled(element, isShown)` (Event for when the toggler is doing its work)
 *
 * See test fixture for sample markup - _spec/js/fixtures/Collapsable.html_
 *
 * @module Collapsable
 * @returns {class} Collapsable
 */

define(['jquery', 'DoughBaseComponent', 'eventsWithPromises'], function($, DoughBaseComponent, eventsWithPromises) {
  'use strict';

  // Class variables
  var defaultConfig = {
        hideOnBlur: false,
        forceTo: false,
        oneGroupOpenOnly: false,
        focusTarget: true,
        showLabels: false,
        iconPosition: 'left',
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
      },
      Collapsable;

  /**
   * @constructor
   * @extends {DoughBaseComponent}
   * @param {object} $el - Trigger element (jQuery element)
   * @param {object} [config]
   * @returns {FieldHelpText}
   */
  Collapsable = function($el, config) {
    Collapsable.baseConstructor.call(this, $el, config, defaultConfig);
    this.$triggers =
      this.$el.is(this.config.selectors.trigger)? this.$el :
      this.$el.find(this.config.selectors.trigger);
    this.$target = $('[data-dough-collapsable-target="' + this.$triggers.attr('data-dough-collapsable-trigger') + '"]');
    this.groupName = this.$triggers.data('dough-collapsable-group');

    this._setupAccessibility();
    this.handleUIEventTracking = $.proxy(this.handleUIEventTracking, this);
    config && config.forceTo && this.toggle(config.forceTo, false);

    return this;
  };

  /**
   * Inherit from base module, for shared methods and interface
   */
  DoughBaseComponent.extend(Collapsable);

  Collapsable.componentName = 'Collapsable';

  /**
   * Setups accessibility functionality for trigger and target buttons
   */
  Collapsable.prototype._setupAccessibility = function() {
    var id = 'data-dough-collapsable-target-' + this.$target.attr('data-dough-collapsable-target');
    this.$triggers.addClass('collapsable--icon-' + this.config.iconPosition);
    this.$triggers.wrapInner('<button class="unstyled-button collapsable-button" type="button"/>');
    this.$triggers.find('button')
        .addClass('collapsable-button--' +
          (this.config.showLabels ? 'show' : 'hide') + '-label')
        .prepend('<span data-dough-collapsable-icon class="collapsable__trigger-icon icon ' +
          this.config.selectors.iconClassOpen + '"></span>')
        .append('<span class="' +
          (this.config.showLabels ? 'collapsable-icon-label' : 'visually-hidden') +
          '" data-dough-collapsable-label>' +
          this.config.i18nStrings.open + '</span>')
        .attr('aria-controls', id)
        .attr('aria-expanded', 'false');
    this.$target.attr('id', id);
    this.$target.addClass('collapsable__target--initialised');

    this.$triggers = this.$triggers.find('button');
  };

  /**
   * Initialises component
   * @param {object} initialised Promise passed from eventsWithPromises (RSVP Promise).
   * @returns {Collapsable}
   * @public
   */
  Collapsable.prototype.init = function(initialised) {
    // is the target element visible already
    this.isShown = !!this.$target.hasClass(this.config.selectors.activeClass);
    this.setListeners(true);
    this._initialisedSuccess(initialised);

    return this;
  };

  /**
   * Bind or unbind relevant DOM events on the trigger
   * @param {boolean} [isActive] Set to 'true' to bind to events, 'false' to unbind.
   * @public
   */
  Collapsable.prototype.setListeners = function(isActive) {
    this.$triggers[isActive ? 'on' : ' off']('click', $.proxy(function() {
      if (this.config.oneGroupOpenOnly) {
        eventsWithPromises.publish('toggler:close:' + this.groupName, this.$el);
      }

      this.toggle();
    }, this));

    if (this.config.oneGroupOpenOnly) {
      eventsWithPromises.subscribe('toggler:close:' + this.groupName, $.proxy(function($el) {
        if (!$el.is(this.$el)) {
          this.toggle('hide', false);
        }
      }, this));
    }

    return this;
  };

  /**
   * Sets up the target tracking
   * @param {boolean} [isActive] Set to `true` to bind to events, `false` to unbind.
   * @public
   */
  Collapsable.prototype.setTargetTrackingListeners = function(isActive) {
    $('body')[isActive ? 'on' : 'off']('click touchend keyup', this.handleUIEventTracking);

    return this;
  };

  /**
   * Handler function for tracking event targets
   * Checks if trigger element is focussed, if the focus is within the target
   * @param  {object} e The event object for the current target
   * @public
   * @returns {Collapsable}
   */
  Collapsable.prototype.handleUIEventTracking = function(e) {
    var $currentTarget = $(e.target);
    if (!$currentTarget.is(this.$triggers) && !$currentTarget.closest(this.$target).length) {
      this.toggle('hide');
    }

    return this;
  };

  /**
   * Toggle the element
   * @param  {string} [forceTo=show|hide] - explicitly toggle the element (set automatically by default).
   * @param {boolean} [focusTarget] - whether to focus the panel. Defaults to `config.focusTarget`
   * @returns {Collapsable}
   */
  Collapsable.prototype.toggle = function(forceTo, focusTarget) {
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
        .removeClass(this.config.selectors.iconClassOpen +
                     ' ' + this.config.selectors.iconClassClose).addClass(iconClass);

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
