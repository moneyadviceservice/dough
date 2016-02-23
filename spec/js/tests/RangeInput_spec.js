describe('Range input', function() {

  'use strict';

  before(function(done) {
    var self = this;
    window.Modernizr = {
      inputtypes: {
        range: true
      }
    };
    requirejs(
        ['jquery', 'RangeInput', 'featureDetect', 'eventsWithPromises'],
        function($, RangeInput, featureDetect, eventsWithPromises) {
          self.featureDetect = featureDetect;
          self.RangeInput = RangeInput;
          self.eventsWithPromises = eventsWithPromises;
          done();
        }, done);
  });

  beforeEach(function() {
    this.$html = $(window.__html__['spec/js/fixtures/RangeInput.html']);
  });

  afterEach(function() {
    this.$html.remove();
  });

  describe('Range inputs supported', function() {

    beforeEach(function() {
      this.featureDetect.inputtypes.range = true;
      this.rangeInput = new this.RangeInput(this.$html);
      this.$inputText = this.$html.find('[data-dough-range-input]');
      this.$inputSlider = this.$html.find('.form__input-range');
    });

    it('creates a copy of the input if the range slider type is supported', function() {
      expect(this.$html.find('input').length).to.equal(2);
    });


    it('keeps the slider in sync if the text input changes', function() {
      this.$inputText.val('2000').trigger('change');
      expect(this.$inputSlider).to.have.value('2000');
      this.$inputText.val('50000').trigger('change');
      expect(this.$inputSlider).to.have.value('5000'); // because range input has a max of 5000
    });

    it('keeps the text input in sync if the slider changes', function() {
      this.$inputSlider.val('2000').trigger('change');
      expect(this.$inputText).to.have.value('2000');
    });

    it('publishes an event when the value changes', function() {
      var spy = sinon.spy();
      this.eventsWithPromises.subscribe('rangeInput:change', spy);
      this.$inputText.val('3000').trigger('change');
      sinon.assert.calledWith(spy, {
        emitter: this.$inputText,
        value: '3000'
      });
    });
  });

  describe('Range inputs supported, passing an HTML attribute to ignore', function() {

    beforeEach(function() {
      this.featureDetect.inputtypes.range = true;
      this.rangeInput = new this.RangeInput(this.$html, {
        ignoreAtts: 'data-attribute'
      });
      this.$inputText = this.$html.find('[data-dough-range-input]');
      this.$inputSlider = this.$html.find('.form__input-range');
    });

    it('Does not clone an attribute passed in the ignoreAtts parameter', function() {
      expect(this.$inputText.attr('data-attribute')).to.equal('foo');
      expect(this.$inputSlider.attr('data-attribute')).to.be.undefined;
    });
  });

  describe('Range inputs supported but don\'t keep inputs in sync', function() {

    beforeEach(function() {
      this.featureDetect.inputtypes.range = true;
      this.rangeInput = new this.RangeInput(this.$html, {
        keepSynced: false
      });
      this.$inputText = this.$html.find('[data-dough-range-input]');
      this.$inputSlider = this.$html.find('.form__input-range');
    });

    it('creates a copy of the input if the range slider type is supported', function() {
      expect(this.$html.find('input').length).to.equal(2);
    });
  });

  describe('Range inputs not supported', function() {

    beforeEach(function() {
      this.featureDetect.inputtypes.range = false;
      this.rangeInput = new this.RangeInput(this.$html);
      this.$inputText = this.$html.find('[data-dough-range-input]');
      this.$inputSlider = this.$html.find('.form__input-range');
    });

    it('keeps the text input in sync if the slider changes', function() {
      this.$inputSlider.val('2000').trigger('change');
      expect(this.$inputText).to.have.value('1500');
    });
  });

});

