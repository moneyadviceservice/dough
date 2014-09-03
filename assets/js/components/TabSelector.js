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
 * @param  {object} $         [description]
 * @param  {object} DoughBaseComponent [description]
 * @return {object}
 * @private
 */
define(['jquery', 'DoughBaseComponent', 'eventsWithPromises', 'mediaQueries'],
    function($, DoughBaseComponent, eventsWithPromises, mediaQueries) {
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
      },
      i18nStrings = {
        selected: 'selected',
        show: 'click to show'
      };

  /**
   * Call DoughBaseComponent constructor. Find options list.
   * @constructor
   */
  TabSelector = function($el, config) {
    var $first;

    this.uiEvents = uiEvents;
    TabSelector.baseConstructor.apply(this, arguments);
    this.i18nStrings = (config && config.i18nStrings) ? config.i18nStrings : i18nStrings;
    this.selectors = $.extend(this.selectors || {}, selectors);

    this.$triggersContainer = this.$el.find(selectors.triggers).addClass(this.selectors.inactiveClass);
    this._setupAccessibility();
    $first = this.$triggersContainer.find('[' + selectors.trigger + ']').first();
    if ($first.length) {
      this._updateTriggers($first.attr(selectors.trigger));
    }

    // set height after triggers updated, so active trigger is visible on small viewport
    this._setTriggerContainerHeight();

    this._subscribeHubEvents();
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
      'aria-hidden': 'true',
      'tabindex': '-1'
    });
    this._convertLinksToButtons();
  };

  TabSelector.prototype._setTriggerContainerHeight = function() {
    this.$el.find(selectors.triggersWrapper).height(this.$triggersContainer.outerHeight());
  };

  TabSelector.prototype._subscribeHubEvents = function() {
    var _this = this;

    eventsWithPromises.subscribe('mediaquery:resize', function(data) {
      if ($.inArray(data.newSize, ['mq-xs', 'mq-s']) !== -1) {
        _this.$triggersContainer.removeClass(_this.selectors.activeClass).addClass(_this.selectors.inactiveClass);
      }
    });
  };

  /**
   * Change all links in tabs to button elements
   * @private
   */
  TabSelector.prototype._convertLinksToButtons = function() {
    var _this = this;
    this.$el.find('[' + this.selectors.trigger + '] a').each(function() {
      var content = $(this).html();
      $(this).replaceWith('<button class="unstyled-button" type="button">' + content +
        ' <span class="visually-hidden" data-dough-tab-selector-show> ' + _this.i18nStrings.show + '</span></button>');
    });
  };

  /**
   * Handle a click on a trigger
   * @returns {TabSelector}
   * @private
   */
  TabSelector.prototype._handleClickEvent = function(e) {
    var $trigger = $(e.currentTarget),
        targetAttr;

    this._deSelectItem(this.$el.find('[' + selectors.trigger + '].is-active'));
    targetAttr = $trigger.attr(selectors.trigger);
    this._updateTriggers(targetAttr);
    this._positionMenu($trigger);
    this._updateTargets(targetAttr);
    this._toggleMenu($trigger);
    e.preventDefault();
    return this;
  };

  /**
   * Deselect a trigger
   * @param {jQuery} $el
   * @private
   */
  TabSelector.prototype._deSelectItem = function($el) {
    $el.removeClass(this.selectors.activeClass).addClass(this.selectors.inactiveClass).attr('aria-selected', false);
    return this;
  };

  /**
   * Show / hide and position the menu so the selected item remains stationary
   * @returns {TabSelector}
   * @private
   */
  TabSelector.prototype._toggleMenu = function($trigger) {
    // if the clicked item is outside the menu, and the menu is closed, do nothing
    if (!$trigger.closest(this.$triggersContainer).length &&
        !this.$triggersContainer.hasClass(this.selectors.activeClass)) {
      return;
    }
    this.$triggersContainer.toggleClass(this.selectors.activeClass).toggleClass(this.selectors.inactiveClass);
    this._positionMenu($trigger);
    return this;
  };

  /**
   * Position the menu when it's open
   * @param {jQuery} $selected - selected trigger
   * @private
   */
  TabSelector.prototype._positionMenu = function($selected) {
    var pos;
    if ($selected) {
      pos = this.$triggersContainer.hasClass(this.selectors.activeClass) ? -1 * $selected.position().top : 0;
      $selected.length && this.$triggersContainer.css('top', pos);
    }

    return this;
  };

  /**
   * Activate / deactivate trigger
   * @param {string} targetAttr - the value of the clicked trigger
   * @returns {TabSelector}
   * @private
   */
  TabSelector.prototype._updateTriggers = function(targetAttr) {
    var $selectedTriggers = this.$el.find('[' + selectors.trigger + '="' + targetAttr + '"]'),
        $unselectedTriggers = this.$el.find('[' + selectors.trigger + ']').not($selectedTriggers);

    $selectedTriggers
        .removeClass(this.selectors.inactiveClass)
        .addClass(this.selectors.activeClass)
        .find('button')
        .width('auto') // webkit clips / hides the button content unless a re-render is forced
        .attr({
          'aria-selected': 'true'
        })
        .find('[data-dough-tab-selector-show]')
        .text(this.i18nStrings.selected);

    $unselectedTriggers
        .removeClass(this.selectors.activeClass)
        .addClass(this.selectors.inactiveClass)
        .find('button')
        .attr('aria-selected', 'false')
        .find('[data-dough-tab-selector-show]')
        .text(this.i18nStrings.show);

    return this;
  };

  /**
   * Activate / deactivate any targets based on the trigger clicked
   * @param {string} targetAttr - the value of the clicked trigger
   * @returns {TabSelector}
   * @private
   */
  TabSelector.prototype._updateTargets = function(targetAttr) {
    var $selectedTarget = this.$el.find('[' + selectors.target + '="' + targetAttr + '"]'),
        $unselectedTargets = this.$el.find('[' + selectors.target + ']')
            .not('[' + selectors.target + '="' + targetAttr + '"]');

    $selectedTarget
        .removeClass(this.selectors.inactiveClass)
        .addClass(this.selectors.activeClass)
        .attr({
          'aria-hidden': 'false',
          'tabindex': 0
        });

    this._focusTarget($selectedTarget);

    $unselectedTargets
        .removeClass(this.selectors.activeClass)
        .addClass(this.selectors.inactiveClass)
        .attr({
          'aria-hidden': 'true',
          'tabindex': -1
        });

    return this;
  };

  /**
   * Focus the selected target panel
   * @param {jQuery} $selectedTarget
   * @private
   */
  TabSelector.prototype._focusTarget = function($selectedTarget) {
    var scrollTop;

    //only focus if tabs not collapsed into a dropdown
    if (!mediaQueries.atSmallViewport()) {
      scrollTop = $(window).scrollTop();
      $selectedTarget.focus();
      // stop the focus from scrolling the page
      $('html,body').scrollTop(scrollTop);
    }
  };

  return TabSelector;


});
