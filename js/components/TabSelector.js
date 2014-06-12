/**
 * # Tab selector
 *
 * Requires an element to have a data-mas-component="TabSelector" attribute. The application
 * file will spawn an instance of this class for each element it finds on the page.
 *
 * Events used: toggler:toggled(element, isShown) [Event for when the toggler is doing its work]
 *
 * ## Examples:
 *
 * ### Normal Toggler, specifies selector as target to show/hide on element click.
 *
 *     <div class="row" data-mas-toggler=".target"></div>
 *
 *
 *
 * ### Hide the trigger element after toggling visibility of the target.
 *
 *     <div class="row" data-mas-toggler=".target" data-toggler-hide-me></div>
 */


/**
 * Require from Config
 * @param  {[type]} $         [description]
 * @param  {[type]} VisibilityToggler [description]
 * @return {[type]}           [description]
 * @private
 */
define(['jquery', 'MASModule', 'VisibilityToggler'], function ($, MASModule, VisibilityToggler) {
  'use strict';

  var TabSelector,
      selectors = {
        triggers: '[data-mas-tabselector-options]',
        trigger: 'data-mas-tabselector-trigger',
        target: 'data-mas-tabselector-target',
        activeClass: 'is-active',
        inactiveClass: 'is-inactive'
      },
      uiEvents = {
        'click [data-mas-tabselector-trigger]': '_handleClickEvent'
      };

  /**
   * Call MASModule constructor. Find options list.
   * @constructor
   */
  TabSelector = function () {
    this.uiEvents = uiEvents;
    TabSelector.baseConstructor.apply(this, arguments);
    this.selectors = $.extend(this.selectors || {}, selectors);
    this.$options = this.$el.find(selectors.triggers).addClass(this.selectors.inactiveClass);
  };

  MASModule.extend(TabSelector, MASModule);

  /**
   * Init function
   * @returns {TabSelector}
   */
  TabSelector.prototype.init = function(initialised) {
    var $first;
    $first = this.$options.find('[' + selectors.trigger + ']').first();
    if ($first.length) {
      this._selectItem($first);
      this._initialisedSuccess(initialised);
    } else {
      this._initialisedFailure(initialised);
    }
    return this;
  };

  /**
   * Handle a click on a trigger
   * @returns {TabSelector}
   * @private
   */
  TabSelector.prototype._handleClickEvent = function (e) {
    var $trigger = $(e.currentTarget);
    if (!$trigger.hasClass(this.selectors.activeClass)) {
      this._deSelectItem(this.$el.find('[' + selectors.trigger + '].is-active'));
      this._selectItem($trigger);
      this._updateTargets($trigger);
    }
    this._toggleMenu();
    return this;
  };

  /**
   * Select a trigger
   * @param {jQuery} $el
   * @private
   */
  TabSelector.prototype._selectItem = function ($el) {
    this.$selected = $el.addClass(this.selectors.activeClass).removeClass(this.selectors.inactiveClass).attr('aria-selected', true);
    this._positionMenu(true);
    return this;
  };

  /**
   * Deselect a trigger
   * @param {jQuery} $el
   * @private
   */
  TabSelector.prototype._deSelectItem = function ($el) {
    $el.removeClass(this.selectors.activeClass).addClass(this.selectors.inactiveClass).attr('aria-selected', false);
    return this;
  };

  /**
   * Show / hide and position the menu so the selected item remains stationary
   * @returns {TabSelector}
   * @private
   */
  TabSelector.prototype._toggleMenu = function () {
    this.$options.toggleClass(this.selectors.activeClass).toggleClass(this.selectors.inactiveClass);
    this._positionMenu(this.$options.hasClass(this.selectors.activeClass));
    return this;
  };

  /**
   * Position the menu when it's open
   * @param {boolean} open - is the menu open
   * @private
   */
  TabSelector.prototype._positionMenu = function (open) {
    var pos = open ? -1 * this.$selected.position().top : 0;
    this.$selected.length && this.$options.css('top', pos);
    return this;
  };

  /**
   * Activate / deactivate any targets based on the trigger clicked
   * @param {jQuery} $clicked
   * @returns {TabSelector}
   * @private
   */
  TabSelector.prototype._updateTargets = function ($clicked) {
    var targetAttr = $clicked.attr(selectors.trigger),
        $selectedTriggers = this.$el.find('[' + selectors.trigger + '="' + targetAttr + '"]'),
        $triggers = this.$el.find('[' + selectors.trigger + ']').not($selectedTriggers),
        $target = this.$el.find('[' + selectors.target + '="' + targetAttr + '"]'),
        $panels = this.$el.find('[' + selectors.target + ']').not('[' + selectors.target + '="' + targetAttr + '"]');

    $target.add($selectedTriggers).removeClass(this.selectors.inactiveClass).addClass(this.selectors.activeClass);
    $panels.add($triggers).removeClass(this.selectors.activeClass).addClass(this.selectors.inactiveClass);
    return this;
  };

  return TabSelector;

});
