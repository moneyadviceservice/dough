define(['rivets', 'utilities'], function (rivets, utilities) {
  'use strict';

  rivets.configure({
    preloadData: false,
    prefix: 'data-dough-bind'
  });

  rivets.binders.range = {
    publishes: true,
    bind: function (el) {
      return rivets._.Util.bindEvent(el, 'input change', this.publish);
    },
    unbind: function (el) {
      return rivets._.Util.unbindEvent(el, 'input change', this.publish);
    },
    routine: rivets.binders.value.routine
  };

  rivets.binders.percentageclass = function(el, value) {
    $(el).removeClass(function (index, css) {
      return (css.match (/\bpercentage-\S+/g) || []).join(' ');
    });
    if(value) {
      $(el).addClass('percentage-' + value);
    }
  };

  rivets.binders.liveregion = function(el, value) {
    $(el).empty();
    $('<span role="status" aria-atomic="false" aria-relevant="text" />')
        .appendTo($(el))
        .append(value)
        .css('visibility', 'hidden')
        .css('visibility', 'visible');
  };

  rivets.binders.inputchange = {
    publishes: true,
    bind: function (el) {
      return rivets._.Util.bindEvent(el, 'change keyup', this.publish);
    },
    unbind: function (el) {
      return rivets._.Util.unbindEvent(el, 'change keyup', this.publish);
    },
    routine: function(el, value) {
      $(el).val(value);
    }
  };

  rivets.binders.html = function(el, value) {
    el.innerHTML = (value != null) ? utilities.decodeHtml(value) : '';
  };

  rivets.formatters.percentageOut = function (value) {
    return value.toFixed(1) + '%';
  };

  rivets.formatters.percentageIn = {
    publish: function (value) {
      return parseFloat(value) || 0;
    }
  };

  rivets.formatters.currency = function (value) {
      return utilities.numberToCurrency(value);
    };

  rivets.formatters.currencyIn = {
    publish: function (value) {
      return parseInt(value, 10);
    }
  };

  rivets.formatters.isZero = function (value) {
    return value === 0;
  };

  return rivets;
});
