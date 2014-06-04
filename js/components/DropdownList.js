/**
 * Renders a list of items into a dropdown, for use in situations where a native <select> isn't
 * semantically appropriate eg. to show / hide panels
 */
define(['jquery', 'MASModule'], function ($, MASModule) {
  'use strict';

  var itemSelector = '.js-dropdown-list__item',
      DropdownList,
      activeClass = 'is-active';

  /**
   * Dropdown list
   * @param {jQuery} $el
   * @constructor
   */
  DropdownList = function ($el) {
    DropdownList.baseConstructor.apply(this, arguments);
    this.$panel = this.$el.find('.js-dropdown-list__panel');
    this._selectItem(this.$panel.find(itemSelector).first());
    this.$el.height(this.$selected.height());
    this._attachUIListeners();
  };

  MASModule.extend(DropdownList);

  /**
   * Select a trigger
   * @param {jQuery} $el
   * @private
   */
  DropdownList.prototype._selectItem = function ($el) {
    this.$selected = $el.addClass(activeClass).attr('aria-selected', true);
    this.$panel.css('top', -1 * this.$selected.position().top);
  };

  /**
   * Deselect a trigger
   * @param {jQuery} $el
   * @private
   */
  DropdownList.prototype._deSelectItem = function ($el) {
    $el.removeClass(activeClass).attr('aria-selected', false);
  };

  /**
   * Show / hide and position the panel so the selected item remains stationary
   * @private
   */
  DropdownList.prototype._togglePanel = function () {
    this.$panel.toggleClass(activeClass);
    if (this.$panel.hasClass(activeClass)) {
      this.$panel.css('top', -1 * this.$selected.position().top);
    } else {
      this.$panel.removeClass(activeClass).css('top', 0);
    }
  };

  /**
   * Attach UI handlers to the component container
   * @returns {MultiToggler}
   * @private
   */
  DropdownList.prototype._attachUIListeners = function () {
    var self = this;
    this.$el.on('click', '.js-dropdown-list__item', function () {
      if (!$(this).hasClass(activeClass)) {
        self._deSelectItem(self.$el.find(itemSelector + '.is-active'));
        self._selectItem($(this));
      }
      self._togglePanel();
    });
  };

  return DropdownList;

});
