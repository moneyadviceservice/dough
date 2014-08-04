describe('Field input tooltip', function() {

  'use strict';

  beforeEach(function(done) {
    var self = this;
    requirejs(
        ['jquery', 'FieldHelpText'],
        function($, FieldHelpText) {
          self.$html = $(window.__html__['test/fixtures/FieldHelpText.html']).appendTo('body');
          self.component = self.$html.find('[data-dough-component="FieldHelpText"]');
          self.FieldHelpText = FieldHelpText;
          done();
        }, done);
  });

  afterEach(function() {
    this.$html.remove();
  });

  it('picks up the correct input element', function() {
    var fieldHelpText = new this.FieldHelpText(this.component);
    fieldHelpText.init();

    expect(fieldHelpText.$inputTarget.attr('id')).to.equal('my_input');
  });

  it('should have role=tooltip added by the component', function() {
    var fieldHelpText = new this.FieldHelpText(this.component);
    fieldHelpText.init();

    expect(fieldHelpText.$el.attr('role')).to.equal('tooltip');
  });

  it('ensures the tooltip is hidden on page load', function() {
    var fieldHelpText = new this.FieldHelpText(this.component);
    fieldHelpText.init();

    expect(fieldHelpText.$el.hasClass(fieldHelpText.config.hiddenClass)).to.equal(true);
  });

  it('removes the hidden class when the input has focus', function() {
    var fieldHelpText = new this.FieldHelpText(this.component);
    fieldHelpText.init();
    fieldHelpText.$inputTarget.focus();

    expect(fieldHelpText.$el.hasClass(fieldHelpText.config.hiddenClass)).to.equal(false);
  });

  it('adds the hidden class when the input has focus', function() {
    var fieldHelpText = new this.FieldHelpText(this.component);
    fieldHelpText.init();
    fieldHelpText.$inputTarget.blur();

    expect(fieldHelpText.$el.hasClass(fieldHelpText.config.hiddenClass)).to.equal(true);
  });

  it('removes the pre-init js hidden class after init', function() {
    var fieldHelpText = new this.FieldHelpText(this.component);
    fieldHelpText.init();

    expect(fieldHelpText.$el.hasClass(fieldHelpText.config.preInitHiddenClass)).to.equal(false);
  })

});
