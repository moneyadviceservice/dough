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
define(['jquery', 'DoughBaseComponent', 'eventsWithPromises'], function($, DoughBaseComponent, eventsWithPromises) {
  'use strict';

  // Class variables
  var CollapsableProto,
      selectors = {
        activeClass: 'is-active',
        inactiveClass: 'is-inactive',
        iconClassOpen: 'icon--down-chevron-blue',
        iconClassClose: 'icon--up-chevron-blue'
      },
      i18nStrings = {
        open: 'Show',
        close: 'Hide'
      };

  /**
   *
   * @param {jQuery} $el - mandatory - the trigger
   * @param {object} config
   * @returns {Collapsable}
   * @constructor
   */
  function Collapsable($el, config) {
    this.selectors = selectors;
    DoughBaseComponent.call(this, $el, config);
    this.$trigger = this.$el;
    this.targetId = this.$trigger.attr('data-dough-collapsable-trigger');
    this.$target = $('[data-dough-collapsable-target="' + this.targetId + '"]');
    this.i18nStrings = (config && config.i18nStrings) ? config.i18nStrings : i18nStrings;
    this._setupAccessibility(this.targetId);
    this.$trigger = this.$trigger.find('button');
    this._eventHubSubscriptions();
    return this;
  }

  /**
   * Inherit from base module, for shared methods and interface
   * @type {[type]}
   * @private
   */
  DoughBaseComponent.extend(Collapsable);
  CollapsableProto = Collapsable.prototype;

  CollapsableProto._eventHubSubscriptions = function() {
    var _this = this;
    this.linkedIds = this.config.linkedIds;
    if (this.linkedIds && this.linkedIds.length) {
      eventsWithPromises.subscribe('Collapsable:toggled', function(data) {
        if ((data.visible === true) && ($.inArray(data.targetId, _this.linkedIds) > -1)) {
          _this.toggle('hide');
        }
      });
    }
  };

  CollapsableProto._setupAccessibility = function(targetId) {
    var id = 'data-dough-collapsable-target-' + targetId;

    this.$trigger.wrapInner('<button class="unstyled-button" type="button"/>');
    this.$trigger.find('button')
        .prepend('<span data-dough-collapsable-icon class="collapsable__trigger-icon icon ' +
            selectors.iconClassOpen +
            '"></span> <span class="visually-hidden" data-dough-collapsable-label>' +
            this.i18nStrings.open + '</span>')
        .attr('aria-controls', id)
        .attr('aria-expanded', 'false');
    this.$target.attr('id', id);
  };

  /**
   * Init function
   * @return {Collapsable}
   */
  CollapsableProto.init = function(initialised) {
    this.config && this.config.forceTo && this.toggle(this.config.forceTo);
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
  CollapsableProto.setListeners = function(isActive) {
    this.$trigger[isActive ? 'on' : ' off']('click', $.proxy(function(e) {
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
  CollapsableProto.toggle = function(forceTo) {
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
    this.isShown = !!this.$target[func](selectors.activeClass).hasClass(selectors.activeClass);

    // toggle the class on the trigger element (active = shown / nothing = not shown)
    this.$trigger[func](selectors.activeClass);

    if (this.isShown === true) {
      label = this.i18nStrings.close;
      expandedLabel = 'true';
      iconClass = selectors.iconClassClose;
      this.$target
          .attr('tabindex', 0)
          .focus();
    } else {
      label = this.i18nStrings.open;
      expandedLabel = 'false';
      iconClass = selectors.iconClassOpen;
    }

    this.$trigger.find('[data-dough-collapsable-label]').text(label);
    this.$trigger.attr('aria-expanded', expandedLabel);
    this.$trigger
        .find('[data-dough-collapsable-icon]')
        .removeClass(selectors.iconClassOpen + ' ' + selectors.iconClassClose).addClass(iconClass);

    // can bind to this by eventsWithPromises.subscribe('toggler:toggled', function(Collapsable) { });
    if (typeof forceTo === 'undefined') {
      eventsWithPromises.publish('Collapsable:toggled', {
        emitter: this,
        visible: this.isShown,
        targetId: this.targetId
      });
    }

    return this;
  };

  return Collapsable;
});
