describe('dropdown list', function () {

  'use strict';

  var activeItem = '.js-dropdown-list__item.is-active',
      trigger = '.js-dropdown-list__trigger',
      activeClass = 'is-active';

  beforeEach(function (done) {
    var self = this;
    requirejs(
        ['jquery', 'DropdownList'],
        function ($, DropdownList) {
          self.$html = $(window.__html__['test/fixtures/DropdownList.html']);
          self.$panel = self.$html.find('.js-dropdown-list__panel');
          self.dropdownList = new DropdownList(self.$html);
          self.dropdownList.init();
          done();
        }, done);
  });

  it('selects the first item in the list', function() {
    expect(this.$html.find(activeItem + ' ' + trigger).html()).to.equal('Item 1');
  });

  it('replaces the currently selected item', function() {
    this.$panel.find(trigger).last().click();
    this.$panel.find(trigger).first().click();
    expect(this.$html.find(activeItem + ' ' + trigger).html()).to.equal('Item 1');
    expect(this.$html.find(activeItem).length).to.equal(1);
  });

  it('toggles the panel when the selected item is clicked', function() {
    this.$html.find(activeItem + ' ' + trigger).click();
    expect(this.$panel.hasClass(activeClass)).to.equal(true);
    this.$html.find(activeItem + ' ' + trigger).click();
    expect(this.$panel.hasClass(activeClass)).to.equal(false);
  });

  it('closes the panel when an item on it is clicked', function() {
    this.$html.find(activeItem + ' ' + trigger).click();
    this.$panel.find(trigger).first().click();
    expect(this.$panel.hasClass(activeClass)).to.equal(false);
  });

});
