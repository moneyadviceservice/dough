describe('Range input', function() {

  'use strict';

  beforeEach(function(done) {
    var self = this;
    requirejs(
        ['jquery', 'RangeInput', 'featureDetect', 'eventsWithPromises'],
        function($, RangeInput, featureDetect, eventsWithPromises) {
          self.featureDetect = featureDetect;
          self.$html = $(window.__html__['test/fixtures/RangeInput.html']);
          self.RangeInput = RangeInput;
          self.eventsWithPromises = eventsWithPromises;
          done();
        }, done);
  });

  it('creates a copy of the input and label if the range slider type is supported', function() {
    this.featureDetect.inputtypes.range = true;
    this.rangeInput = new this.RangeInput(this.$html);
    this.rangeInput.init();
    expect(this.$html.find('input').length).to.equal(2);
    expect(this.$html.find('label').length).to.equal(2);
  });

  it('doesn\'t create an extra input if the range slider type isn\'t supported', function() {
    this.featureDetect.inputtypes.range = false;
    this.rangeInput = new this.RangeInput(this.$html);
    this.rangeInput.init();
    expect(this.$html.find('input').length).to.equal(1);
    expect(this.$html.find('label').length).to.equal(1);
  });

  it('keeps both input values in sync', function() {
    var $inputText,
        $inputSlider;

    this.featureDetect.inputtypes.range = true;
    this.rangeInput = new this.RangeInput(this.$html);
    this.rangeInput.init();
    $inputText = this.$html.find('[data-dough-range-input]');
    $inputSlider = this.$html.find('.form__input-range');
    $inputText.val('2000').trigger('change');
    expect($inputSlider.val()).to.equal('2000');
    $inputText.val('50000').trigger('change');
    expect($inputSlider.val()).to.equal('5000');
  });

  it('publishes an event when the value changes', function() {
    var spy = sinon.spy(),
        $input = this.$html.find('[data-dough-range-input]');
    this.featureDetect.inputtypes.range = true;
    this.rangeInput = new this.RangeInput(this.$html);
    this.rangeInput.init();
    this.eventsWithPromises.subscribe('rangeInput:change', spy);
    $input.val('3000').trigger('change');
    sinon.assert.calledWith(spy, {
      emitter: $input,
      value: '3000'
    });
  });

});
