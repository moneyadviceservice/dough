describe('Field input tooltip', function() {

  'use strict';

  beforeEach(function(done) {
    var self = this;
    requirejs(
        ['jquery', 'FieldTooltip'],
        function($, FieldTooltip) {
          self.$html = $(window.__html__['test/fixtures/FieldTooltip.html']).appendTo('body');
          self.component = self.$html.find('[data-dough-component="FieldTooltip"]');
          self.FieldTooltip = FieldTooltip;
          done();
        }, done);
  });

  afterEach(function () {
    this.$html.remove();
  });

  it('picks up the correct input element', function() {
    this.fieldTooltip = new this.FieldTooltip(this.component);
    this.fieldTooltip.init();

    expect(this.fieldTooltip.$inputTarget.attr('id')).to.equal('my_input');
  });

});
