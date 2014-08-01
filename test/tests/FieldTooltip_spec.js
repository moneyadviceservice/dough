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

  afterEach(function() {
    this.$html.remove();
  });

  it('picks up the correct input element', function() {
    var fieldTooltip = new this.FieldTooltip(this.component);
    fieldTooltip.init();

    expect(fieldTooltip.$inputTarget.attr('id')).to.equal('my_input');
  });

  it('ensures the tooltip is hidden on page load', function() {
    var fieldTooltip = new this.FieldTooltip(this.component);
    fieldTooltip.init();

    expect(fieldTooltip.$el.hasClass(fieldTooltip.config.hiddenClass)).to.equal(true);
  });

  it('removes the hidden class when the input has focus', function() {
    var fieldTooltip = new this.FieldTooltip(this.component);
    fieldTooltip.init();
    fieldTooltip.$inputTarget.focus();

    expect(fieldTooltip.$el.hasClass(fieldTooltip.config.hiddenClass)).to.equal(false);
  });

  it('adds the hidden class when the input has focus', function() {
    var fieldTooltip = new this.FieldTooltip(this.component);
    fieldTooltip.init();
    fieldTooltip.$inputTarget.blur();

    expect(fieldTooltip.$el.hasClass(fieldTooltip.config.hiddenClass)).to.equal(true);
  });

  it('removes the pre-init js hidden class after init', function() {
    var fieldTooltip = new this.FieldTooltip(this.component);
    fieldTooltip.init();

    expect(fieldTooltip.$el.hasClass(fieldTooltip.config.preInitHiddenClass)).to.equal(false);
  })

});
