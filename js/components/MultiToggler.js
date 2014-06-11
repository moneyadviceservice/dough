/**
 * Pairs one or more containers with triggers. When a trigger is clicked, its associated panel is
 * marked active and all other panels are marked inactive.
 *
 * @param {Object} $ - jQuery
 * @param {Function} MASModule
 * @param {Object} eventsWithProm
 */
define(['jquery', 'MASModule', 'eventsWithPromises'], function ($, MASModule, eventsWithPromises) {

  'use strict';

  var activeClass = 'is-active',
      inactiveClass = 'is-inactive',
      attrNameTrigger = 'data-mas-toggler-target',
      attrNamePanel = 'data-mas-toggler',
      eventActive = 'contentActive',
      eventInactive = 'contentInactive',
      uiEvents = {
        'click [data-mas-toggler-target]': '_handleClickEvent'
      };

  /**
   *
   * @param {JQuery} $el - the container element of the module. Events will be bound to this and it
   * will be used as the context for finding child nodes
   * @param {object} [config] - hash of configuration options
   * @constructor
   */
  var MultiToggler = function ($el, config) {
    this.uiEvents = uiEvents;
    MultiToggler.baseConstructor.apply(this, arguments);
  };

  MASModule.extend(MultiToggler);

  /**
   * Initialise the module. Called automatically by the component loader
   * @param {object} initialised - a promise
   */
  MultiToggler.prototype.init = function(initialised) {
    this._initialisedSuccess(initialised);
  };

  /**
   * Handle a click on a trigger
   * @returns {MultiToggler}
   * @private
   */
  MultiToggler.prototype._handleClickEvent = function (e) {
    this._updateDOM($(e.currentTarget));
    e.preventDefault();
    return this;
  };

  /**
   * Update the component state after an event
   * @param {jQuery} $clicked
   * @returns {MultiToggler}
   * @private
   */
  MultiToggler.prototype._updateDOM = function ($clicked) {
    var targetAttr = $clicked.attr(attrNameTrigger),
        $selectedTriggers = this.$el.find('[' + attrNameTrigger + '="' + targetAttr + '"]'),
        $triggers = this.$el.find('[' + attrNameTrigger + ']').not($selectedTriggers),
        $target = this.$el.find('[' + attrNamePanel + '="' + targetAttr + '"]'),
        $panels = this.$el.find('[' + attrNamePanel + ']').not('[' + attrNamePanel + '="' + targetAttr + '"]');

    $target.add($selectedTriggers).removeClass(inactiveClass).addClass(activeClass);
    $panels.add($triggers).removeClass(activeClass).addClass(inactiveClass);
    this._publishEvents($target, $panels);
    return this;
  };

  /**
   * Publish event hub events
   * @param {jQuery} $target
   * @param {jQuery} $panels
   * @returns {MultiToggler}
   * @private
   */
  MultiToggler.prototype._publishEvents = function ($target, $panels) {
    eventsWithPromises.publish(eventActive, {
      $el: $target
    });
    eventsWithPromises.publish(eventInactive, {
      $el: $panels
    });
    return this;
  };

  return MultiToggler;

});
