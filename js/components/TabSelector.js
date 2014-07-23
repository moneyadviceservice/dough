/**
 * # Tab selector
 *
 * Requires an element to have a data-dough-component="TabSelector" attribute. The application
 * file will spawn an instance of this class for each element it finds on the page.
 *
 * Events used: toggler:toggled(element, isShown) [Event for when the toggler is doing its work]
 *
 * ## Examples:
 *
 * ### Normal Toggler, specifies selector as target to show/hide on element click.
 *
 *     <div class="row" data-dough-toggler=".target"></div>
 *
 *
 *
 * ### Hide the trigger element after toggling visibility of the target.
 *
 *     <div class="row" data-dough-toggler=".target" data-toggler-hide-me></div>
 */


/**
 * Require from Config
 * @param  {[type]} $         [description]
 * @param  {[type]} VisibilityToggler [description]
 * @return {[type]}           [description]
 * @private
 */
define(['jquery', 'DoughBaseComponent'], function ($, DoughBaseComponent) {
  'use strict';

  var TabSelector,
      selectors = {
        triggersWrapper: '[data-dough-tabselector-wrapper]',
        triggers: '[data-dough-tabselector-triggers]',
        trigger: 'data-dough-tabselector-trigger',
        target: 'data-dough-tabselector-target',
        activeClass: 'is-active',
        inactiveClass: 'is-inactive'
      },
      uiEvents = {
        'click [data-dough-tabselector-trigger]': '_handleClickEvent'
      };

  /**
   * Call DoughBaseComponent constructor. Find options list.
   * @constructor
   */
  TabSelector = function () {
    this.uiEvents = uiEvents;
    TabSelector.baseConstructor.apply(this, arguments);
    this.selectors = $.extend(this.selectors || {}, selectors);
    this.$triggersContainer = this.$el.find(selectors.triggers).addClass(this.selectors.inactiveClass);
    this.$el.find(selectors.triggersWrapper).height(this.$triggersContainer.outerHeight());
    this._setupAccessibility();
  };

  /**
   * Inherit from base module, for shared methods and interface
   */
  DoughBaseComponent.extend(TabSelector);

  /**
   * Init function
   * @returns {TabSelector}
   */
  TabSelector.prototype.init = function(initialised) {
    var $first;
    $first = this.$triggersContainer.find('[' + selectors.trigger + ']').first();
    if ($first.length) {
      this._selectItem($first);
      this._initialisedSuccess(initialised);
    } else {
      this._initialisedFailure(initialised);
    }
    return this;
  };

  /**
   * Any one-off actions to make the component more accessible
   * @private
   */
  TabSelector.prototype._setupAccessibility = function() {
    this.$el.find('[' + selectors.target + ']').attr({
      'aria-hidden' : 'true',
      'tabindex' : '-1'
    });
    this._convertLinksToButtons();
  };

  /**
   * Change all links in tabs to button elements
   * @private
   */
  TabSelector.prototype._convertLinksToButtons = function() {
    this.$el.find('[' + this.selectors.trigger + '] a').each(function(){
      var content = $(this).html();
      $(this).replaceWith('<button class="unstyled-button" type="button">' + content + '</button>');
    });
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
    this._toggleMenu($trigger);
    e.preventDefault();
    return this;
  };

  /**
   * Select a trigger
   * @param {jQuery} $el
   * @private
   */
  TabSelector.prototype._selectItem = function ($el) {
    this.$selected = $el.addClass(this.selectors.activeClass).removeClass(this.selectors.inactiveClass).attr('aria-selected', true);
    this._positionMenu(this.$selected);
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
  TabSelector.prototype._toggleMenu = function ($trigger) {
    // if the clicked item is outside the menu, and the menu is closed, do nothing
    if (!$trigger.closest(this.$triggersContainer).length && !this.$triggersContainer.hasClass(this.selectors.activeClass)) {
      return;
    }
    this.$triggersContainer.toggleClass(this.selectors.activeClass).toggleClass(this.selectors.inactiveClass);
    this._positionMenu(this.$selected);
    return this;
  };

  /**
   * Position the menu when it's open
   * @param {jQuery} $selected - selected trigger
   * @private
   */
  TabSelector.prototype._positionMenu = function ($selected) {
    var pos;
    if ($selected) {
      pos = this.$triggersContainer.hasClass(this.selectors.activeClass) ? -1 * $selected.position().top : 0;
      $selected.length && this.$triggersContainer.css('top', pos);
    }

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
        $unselectedTriggers = this.$el.find('[' + selectors.trigger + ']').not($selectedTriggers),
        $selectedTarget = this.$el.find('[' + selectors.target + '="' + targetAttr + '"]'),
        $unselectedTargets = this.$el.find('[' + selectors.target + ']').not('[' + selectors.target + '="' + targetAttr + '"]');

    $selectedTarget
        .removeClass(this.selectors.inactiveClass)
        .addClass(this.selectors.activeClass)
        .attr('aria-hidden', 'false')
        .focus();

    $unselectedTargets
        .removeClass(this.selectors.activeClass)
        .addClass(this.selectors.inactiveClass)
        .attr({
          'aria-hidden' : 'true',
          'tabindex' : -1
        });

    $selectedTriggers
        .removeClass(this.selectors.inactiveClass)
        .addClass(this.selectors.activeClass)
        .find('button')
          .attr('aria-selected', 'true')
          .attr('tabindex', 0);

    $unselectedTriggers
        .removeClass(this.selectors.activeClass)
        .addClass(this.selectors.inactiveClass)
        .find('button')
          .attr('aria-selected', 'false');

    return this;
  };

  return TabSelector;

});
