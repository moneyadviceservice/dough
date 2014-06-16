describe('Range input', function () {

  'use strict';

 beforeEach(function (done) {
    var self = this;
    requirejs(
        ['jquery', 'RangeInput', 'featureDetect'],
        function ($, RangeInput, featureDetect) {
          self.featureDetect = featureDetect;
          self.$html = $(window.__html__['test/fixtures/RangeInput.html']);
          self.RangeInput = RangeInput;
          done();
        }, done);
  });

  it('creates a copy of the input and label if the range slider type is supported', function() {
    this.featureDetect.html5Inputs.range = true;
    this.rangeInput = new this.RangeInput(this.$html);
    this.rangeInput.init();
    expect(this.$html.find('input').length).to.equal(2);
    expect(this.$html.find('label').length).to.equal(2);
  });

  it('doesn\'t create an extra input if the range slider type isn\'t supported', function() {
    this.featureDetect.html5Inputs.range = false;
    this.rangeInput = new this.RangeInput(this.$html);
    this.rangeInput.init();
    expect(this.$html.find('input').length).to.equal(1);
    expect(this.$html.find('label').length).to.equal(1);
  });

});
