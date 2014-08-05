describe('Validation', function() {

  'use strict';

  // Basic required field
  describe('NonEmpty', function() {
    beforeEach(function(done) {
      var self = this;
      requirejs(
          ['jquery', 'Validation'],
          function($, Validation) {
            self.$html = $(window.__html__['test/fixtures/Validation/NonEmpty.html']).appendTo('body');
            self.component = self.$html.find('[data-dough-component="Validation"]');
            self.Validation = Validation;
            done();
          }, done);
    });

    afterEach(function() {
      this.$html.remove();
    });

    it('should show an inline error if left empty on blur', function() {

    });

    it('should show the validation summary if left empty on submit', function() {

    });

    it('should remove all relevant errors if corrected on key up', function() {

    });

    it('should allow the form to submit if the value is non-empty', function() {

    });
  });



  // Minimum length check
  describe('MinLength', function() {
    beforeEach(function(done) {
      var self = this;
      requirejs(
          ['jquery', 'Validation'],
          function($, Validation) {
            self.$html = $(window.__html__['test/fixtures/Validation/MinLength.html']).appendTo('body');
            self.component = self.$html.find('[data-dough-component="Validation"]');
            self.Validation = Validation;
            done();
          }, done);
    });

    afterEach(function() {
      this.$html.remove();
    });

    it('should show an inline error if left empty on blur', function() {

    });

    it('should show the validation summary if left empty on submit', function() {

    });

    it('should show the validation summary if not enough characters on submit', function() {

    });

    it('should remove all relevant errors if corrected on key up', function() {

    });

    it('should show an inline error if the value is not enough characters', function() {

    });

    it('should allow the form to submit if the value is non-empty and enough characters', function() {

    });
  });


  // Regular expression check
  describe('RegExp', function() {
    beforeEach(function(done) {
      var self = this;
      requirejs(
          ['jquery', 'Validation'],
          function($, Validation) {
            self.$html = $(window.__html__['test/fixtures/Validation/RegExp.html']).appendTo('body');
            self.component = self.$html.find('[data-dough-component="Validation"]');
            self.Validation = Validation;
            done();
          }, done);
    });

    afterEach(function() {
      this.$html.remove();
    });

    it('should show an inline error if the regexp does not match on blur', function() {

    });

    it('should show the validation summary if the regexp does not match on submit', function() {

    });

    it('should remove all relevant errors if corrected on key up', function() {

    });

    it('should allow the form to submit if the value matches the regexp', function() {

    });
  });


  // Number range check
  describe('NumberRange', function() {
    beforeEach(function(done) {
      var self = this;
      requirejs(
          ['jquery', 'Validation'],
          function($, Validation) {
            self.$html = $(window.__html__['test/fixtures/Validation/NumberRange.html']).appendTo('body');
            self.component = self.$html.find('[data-dough-component="Validation"]');
            self.Validation = Validation;
            done();
          }, done);
    });

    afterEach(function() {
      this.$html.remove();
    });

    it('should show an inline error if the value is out of range on blur', function() {

    });

    it('should show the validation summary if the value is out of range on submit', function() {

    });

    it('should remove all relevant errors if corrected on key up', function() {

    });

    it('should allow the form to submit if the value is in range', function() {

    });
  });

});
