describe('dropdown list', function () {

  'use strict';

  beforeEach(function (done) {
    var self = this;
    requirejs(
        ['jquery', 'DropdownList'],
        function ($, DropdownList) {
          self.$html = $(window.__html__['test/fixtures/DropdownList.html']);
          self.$panel = self.$html.find('.js-dropdown-list__panel');
          self.dropdownList = new DropdownList(self.$html);
          done();
        }, done);
  });

  it('selects the first item in the list', function() {
    expect(this.$html.find('.js-dropdown-list__item.is-active .js-dropdown-list__trigger').html()).to.equal('Item 1');
  });

  it('replaces the currently selected item', function() {
    this.$panel.find('.js-dropdown-list__trigger').last().click();
    this.$panel.find('.js-dropdown-list__trigger').first().click();
    expect(this.$html.find('.js-dropdown-list__item.is-active .js-dropdown-list__trigger').html()).to.equal('Item 1');
    expect(this.$html.find('.js-dropdown-list__item.is-active').length).to.equal(1);
  });

  it('toggles the panel when the selected item is clicked', function() {
    this.$html.find('.js-dropdown-list__item.is-active .js-dropdown-list__trigger').click();
    expect(this.$panel.hasClass('is-active')).to.equal(true);
    this.$html.find('.js-dropdown-list__item.is-active .js-dropdown-list__trigger').click();
    expect(this.$panel.hasClass('is-active')).to.equal(false);
  });

  it('closes the panel when an item on it is clicked', function() {
    this.$html.find('.js-dropdown-list__item.is-active .js-dropdown-list__trigger').click();
    this.$panel.find('.js-dropdown-list__trigger').first().click();
    expect(this.$panel.hasClass('is-active')).to.equal(false);
  });

});
