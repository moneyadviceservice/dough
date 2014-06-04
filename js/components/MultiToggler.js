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
      inactiveClass = 'is-inactive';


  /**
   *
   * @param {JQuery} $el - the container element of the module. Events will be bound to this and it
   * will be used as the context for finding child nodes
   * @param {object} [config] - hash of configuration options
   * @constructor
   */
  var MultiToggler = function ($el, config) {
    MultiToggler.baseConstructor.apply(this, arguments);
    this._attachUIListeners();
  };

  MASModule.extend(MultiToggler);

  /**
   * Attach UI handlers to the component container
   * @returns {MultiToggler}
   * @private
   */
  MultiToggler.prototype._attachUIListeners = function () {
    var self = this;
    this.$el.on('click', '[data-panel-target]', function (e) {
      self._updateDOM($(this));
      e.preventDefault();
    });
    return this;
  };

  /**
   * Update the component state after an event
   * @param {jQuery} $clicked
   * @returns {MultiToggler}
   * @private
   */
  MultiToggler.prototype._updateDOM = function ($clicked) {
    var targetAttr = $clicked.attr('data-panel-target'),
        $triggers = this.$el.find('[data-panel-target]').not('[data-panel-target="' + targetAttr + '"]'),
        $target = this.$el.find('[data-panel="' + targetAttr + '"]'),
        $panels = this.$el.find('[data-panel]').not('[data-panel="' + targetAttr + '"]');

    $target.add($clicked).removeClass(inactiveClass).addClass(activeClass);
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
    eventsWithPromises.publish('contentShown', {
      $el: $target
    });
    eventsWithPromises.publish('contentHidden', {
      $el: $panels
    });
    return this;
  };

  return MultiToggler;

});
