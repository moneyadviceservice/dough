/**
 * A list of triggers show / hide associated targets eg. panels
 */
define(['jquery', 'MASModule'], function ($, MASModule) {
  'use strict';

  var itemSelector = '[data-mas-tabselector-trigger]',
      OptionSelector,
      activeClass = 'is-active',
      inactiveClass = 'is-inactive',
      attrNameTrigger = 'data-mas-tabselector-trigger',
      attrNamePanel = 'data-mas-tabselector-target',
      attrNameMenu = '[data-mas-tabselector-menu]',
      uiEvents = {
        'click [data-mas-tabselector-trigger]': '_handleClickEvent'
      };

  /**
   * Dropdown list
   * @constructor
   */
  OptionSelector = function () {
    this.uiEvents = uiEvents;
    OptionSelector.baseConstructor.apply(this, arguments);
    this.$menu = this.$el.find(attrNameMenu).addClass(inactiveClass);
  };

  MASModule.extend(OptionSelector);

  OptionSelector.prototype.init = function(initialised) {
    var $first;
    $first = this.$menu.find(itemSelector).first();
    if ($first.length) {
      this._selectItem($first);
      this._initialisedSuccess(initialised);
    } else {
      this._initialisedFailure(initialised);
    }
  };

  /**
   * Handle a click on a trigger
   * @returns {OptionSelector}
   * @private
   */
  OptionSelector.prototype._handleClickEvent = function (e) {
    var $trigger = $(e.currentTarget);
    if (!$trigger.hasClass(activeClass)) {
      this._deSelectItem(this.$el.find(itemSelector + '.is-active'));
      this._selectItem($trigger);
      this._updateTargets($trigger);
    }
    this._toggleMenu();
  };

  /**
   * Select a trigger
   * @param {jQuery} $el
   * @private
   */
  OptionSelector.prototype._selectItem = function ($el) {
    this.$selected = $el.addClass(activeClass).removeClass(inactiveClass).attr('aria-selected', true);
    this.$selected.length && this.$menu.css('top', -1 * this.$selected.position().top);
    return this;
  };

  /**
   * Deselect a trigger
   * @param {jQuery} $el
   * @private
   */
  OptionSelector.prototype._deSelectItem = function ($el) {
    $el.removeClass(activeClass).addClass(inactiveClass).attr('aria-selected', false);
    return this;
  };

  /**
   * Show / hide and position the menu so the selected item remains stationary
   * @returns {OptionSelector}
   * @private
   */
  OptionSelector.prototype._toggleMenu = function () {
    this.$menu.toggleClass(activeClass).toggleClass(inactiveClass);
    if (this.$menu.hasClass(activeClass)) {
      this.$menu.css('top', -1 * this.$selected.position().top);
    } else {
      this.$menu.css('top', 0);
    }
    return this;
  };

  /**
   * Activate / deactivate any targets based on the trigger clicked
   * @param {jQuery} $clicked
   * @returns {OptionSelector}
   * @private
   */
  OptionSelector.prototype._updateTargets = function ($clicked) {
    var targetAttr = $clicked.attr(attrNameTrigger),
        $selectedTriggers = this.$el.find('[' + attrNameTrigger + '="' + targetAttr + '"]'),
        $triggers = this.$el.find('[' + attrNameTrigger + ']').not($selectedTriggers),
        $target = this.$el.find('[' + attrNamePanel + '="' + targetAttr + '"]'),
        $panels = this.$el.find('[' + attrNamePanel + ']').not('[' + attrNamePanel + '="' + targetAttr + '"]');

    $target.add($selectedTriggers).removeClass(inactiveClass).addClass(activeClass);
    $panels.add($triggers).removeClass(activeClass).addClass(inactiveClass);
    return this;
  };

  return OptionSelector;

});
