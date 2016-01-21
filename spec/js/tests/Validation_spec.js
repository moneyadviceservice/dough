describe('Validation', function() {

  'use strict';

  function focusInOut($input) {
    $input.focus().blur();
  }

  describe('Without Server Markup', function() {
    beforeEach(function(done) {
      var self = this;
      requirejs(
          ['jquery', 'Validation'],
          function($, Validation) {
            self.$html = $(window.__html__['spec/js/fixtures/Validation/NoServerMarkup.html']).appendTo('body');
            self.component = self.$html.find('[data-dough-component="Validation"]');
            self.Validation = Validation;
            done();
          }, done);
    });

    afterEach(function() {
      this.$html.remove();
    });

    describe('Validation', function() {
      describe('When showValidationSummary is not set', function() {
        it('generates a fallback validation summary list', function() {
          var validation = new this.Validation(this.component).init();
          expect(validation.$el.find('.' + validation.config.validationSummaryClass).length).to.equal(1);
        });

        it('generates an inline message', function() {
          var validation = new this.Validation(this.component).init();
          expect(validation.$el.find('.' + validation.config.inlineErrorClass).length).to.equal(1);
        });
      });

      describe('When showValidationSummary is enabled', function() {
        it('generates a fallback validation summary list', function() {
          var validation = new this.Validation(this.component, {showValidationSummary: true}).init();
          expect(validation.$el.find('.' + validation.config.validationSummaryClass).length).to.equal(1);
        });

        it('generates an inline message', function() {
          var validation = new this.Validation(this.component, {showValidationSummary: true}).init();
          expect(validation.$el.find('.' + validation.config.inlineErrorClass).length).to.equal(1);
        });
      });

      describe('When showValidationSummary is disabled', function() {
        it('does not generate a fallback validation summary list', function() {
          var validation = new this.Validation(this.component, {showValidationSummary: false}).init();
          expect(validation.$el.find('.' + validation.config.validationSummaryClass).length).to.equal(0);
        });

        it('generates an inline message', function() {
          var validation = new this.Validation(this.component, {showValidationSummary: false}).init();
          expect(validation.$el.find('.' + validation.config.inlineErrorClass).length).to.equal(1);
        });
      });
    });
  });

  describe('With existing Server Markup', function() {
    beforeEach(function(done) {
      var self = this;
      requirejs(
          ['jquery', 'Validation'],
          function($, Validation) {
            self.$html = $(window.__html__['spec/js/fixtures/Validation/WithServerMarkup.html']).appendTo('body');
            self.component = self.$html.find('[data-dough-component="Validation"]');
            self.Validation = Validation;
            done();
          }, done);
    });

    afterEach(function() {
      this.$html.remove();
    });

    describe('Validation', function() {
      describe('When showValidationSummary is not set', function() {
        it('does not generate a fallback validation summary list', function() {
          var validation = new this.Validation(this.component).init();
          expect(validation.$el.find('.' + validation.config.validationSummaryClass).length).to.equal(1);
        });

        it('does not generate an inline message', function() {
          var validation = new this.Validation(this.component).init();
          expect(validation.$el.find('.' + validation.config.inlineErrorClass).length).to.equal(1);
        });
      });

      describe('When showValidationSummary is enabled', function() {
        it('does not generate a fallback validation summary list', function() {
          var validation = new this.Validation(this.component, {showValidationSummary: true}).init();
          expect(validation.$el.find('.' + validation.config.validationSummaryClass).length).to.equal(1);
        });

        it('does not generate an inline message', function() {
          var validation = new this.Validation(this.component, {showValidationSummary: true}).init();
          expect(validation.$el.find('.' + validation.config.inlineErrorClass).length).to.equal(1);
        });
      });

      describe('When showValidationSummary is disabled', function() {
        it('does not generate a fallback validation summary list', function() {
          var validation = new this.Validation(this.component, {showValidationSummary: false}).init();
          expect(validation.$el.find('.' + validation.config.validationSummaryClass).length).to.equal(1);
        });

        it('does not generate an inline message', function() {
          var validation = new this.Validation(this.component, {showValidationSummary: false}).init();
          expect(validation.$el.find('.' + validation.config.inlineErrorClass).length).to.equal(1);
        });
      });
    });

    it('bails out and lets the server take over', function() {
      var validation = new this.Validation(this.component).init();
      expect(validation.enabled).to.equal(false);
    });
  });

  // Basic required field
  describe('with a required field', function() {
    beforeEach(function(done) {
      var self = this;
      requirejs(
          ['jquery', 'Validation'],
          function($, Validation) {
            self.$html = $(window.__html__['spec/js/fixtures/Validation/NonEmpty.html']).appendTo('body');
            self.component = self.$html.find('[data-dough-component="Validation"]');
            self.Validation = Validation;
            done();
          }, done);
    });

    afterEach(function() {
      this.$html.remove();
    });

    it('shows the correct inline error if left empty on blur', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input'),
          errorLookingFor = $input.attr(validation.config.attributeEmpty),
          inlineErrorMessage = '.' + validation.config.inlineErrorClass + ':contains("' + errorLookingFor + '")';

      focusInOut($input);

      expect(validation.$el.find(inlineErrorMessage).length).to.equal(1);
    });

    it('adds the is-errored class to the parent form__row', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input');

      focusInOut($input);

      expect($input.parents('.form__row')).to.have.class(validation.config.rowInvalidClass);
    });

    it('adds the aria-invalid attribute to the input', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input');

      focusInOut($input);

      expect($input).to.have.attr('aria-invalid', 'true');
    });

    it('references the inline error with the aria-describedby attribute on the input when invalid', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input');

      focusInOut($input);

      expect($input.attr('aria-describedby').indexOf(validation._getInlineErrorID($input.attr('name')))).not.to.equal(-1);
    });

    it('removes references to the inline error from aria-describedby when valid', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input');

      focusInOut($input);
      $input.val('test').keyup();

      expect($input.attr('aria-describedby').indexOf(validation._getInlineErrorID($input.attr('name')))).to.equal(-1);
    });

    describe('when the validation summary is to be shown', function() {
      it('shows the validation summary if left empty on submit', function() {
        var validation = new this.Validation(this.component, {showValidationSummary: true}).init(),
            $input = validation.$el.find('#input'),
            $validationSummary = validation.$el.find('.' + validation.config.validationSummaryClass);

        validation.$el.submit();

        expect($validationSummary).to.not.have.class(validation.config.validationSummaryHiddenClass);
      });

      it('does not show the validation summary if the form has not been submitted', function() {
        var validation = new this.Validation(this.component, {showValidationSummary: true}).init(),
            $input = validation.$el.find('#input'),
            $validationSummary = validation.$el.find('.' + validation.config.validationSummaryClass);

        expect($validationSummary).to.have.class(validation.config.validationSummaryHiddenClass);
      });

      it('adds the error to the validation summary list if left empty on submit', function() {
        var validation = new this.Validation(this.component, {showValidationSummary: true}).init(),
            $input = validation.$el.find('#input'),
            errorLookingFor = $input.attr(validation.config.attributeEmpty),
            $validationSummaryList = validation.$el.find('[' + validation.config.validationSummaryListAttribute + ']');

        validation.$el.submit();

        expect($validationSummaryList.find('li')).to.have.text(errorLookingFor);
      });
    });

    describe('when the validation summary is not to be shown', function() {
      it('has not created the validation summary', function() {
        var validation = new this.Validation(this.component, {showValidationSummary: false}).init(),
            $validationSummary = validation.$el.find('.' + validation.config.validationSummaryClass);

        expect($validationSummary.length).to.equal(0);
      });

      it('does not create the validation summary on submit', function() {
        var validation = new this.Validation(this.component, {showValidationSummary: false}).init(),
            $validationSummary = validation.$el.find('.' + validation.config.validationSummaryClass);

        validation.$el.submit();

        expect($validationSummary.length).to.equal(0);
      });
    });

    it('removes all relevant errors and error states if value corrected as the user types', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input'),
          errorLookingFor = $input.attr(validation.config.attributeEmpty),
          $validationSummaryList = validation.$el.find('[' + validation.config.validationSummaryListAttribute + ']'),
          $inlineError = $input.parent('.form__row').find('.' + validation.config.inlineErrorClass);

      validation.$el.submit();
      $input.val('test').keyup();

      expect($input.parents('.form__row')).not.to.have.class(validation.config.rowInvalidClass);
      expect($validationSummaryList.filter(':contains("' + errorLookingFor + '")').length).to.equal(0);
      expect($inlineError.filter(':contains("' + errorLookingFor + '")').length).to.equal(0);
    });

    it('allows the form to submit if the value is filled in', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input'),
          $validationSummaryList = validation.$el.find('[' + validation.config.validationSummaryListAttribute + ']');

      $input.val('test');
      validation.$el.submit();

      expect($validationSummaryList.find('li').length).to.equal(0);
    });
  });

  // Basic required field
  describe('with a form ID', function() {
    beforeEach(function(done) {
      var self = this;
      requirejs(
          ['jquery', 'Validation'],
          function($, Validation) {
            self.$html = $(window.__html__['spec/js/fixtures/Validation/WithFormID.html']).appendTo('body');
            self.component = self.$html.find('[data-dough-component="Validation"]');
            self.Validation = Validation;
            done();
          }, done);
    });

    afterEach(function() {
      this.$html.remove();
    });

    it('references the inline error with the aria-describedby attribute on the input when invalid', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input');

      focusInOut($input);

      expect($input.attr('aria-describedby').indexOf('error-test_form_0-name')).not.to.equal(-1);
    });

    it('removes references to the inline error from aria-describedby when valid', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input');

      focusInOut($input);
      $input.val('test').keyup();

      expect($input.attr('aria-describedby').indexOf('error-test_form_0-name')).to.equal(-1);
    });
  });

  // Radio buttons
  describe('Required Radio Buttons', function() {
    beforeEach(function(done) {
      var self = this;
      requirejs(
          ['jquery', 'Validation'],
          function($, Validation) {
            self.$html = $(window.__html__['spec/js/fixtures/Validation/RadioButtons.html']).appendTo('body');
            self.component = self.$html.find('[data-dough-component="Validation"]');
            self.Validation = Validation;
            done();
          }, done);
    });

    afterEach(function() {
      this.$html.remove();
    });

    it('shows the correct inline error if the first radio left empty on blur', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input1'),
          errorLookingFor = $input.attr(validation.config.attributeEmpty);

      focusInOut($input);

      expect(validation.$el.find('.' + validation.config.inlineErrorClass + ':contains("' + errorLookingFor + '")').length).to.equal(1);
    });

    it('shows the correct inline error if the second radio left empty on blur', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input2'),
          errorLookingFor = $input.attr(validation.config.attributeEmpty);

      focusInOut($input);

      expect(validation.$el.find('.' + validation.config.inlineErrorClass + ':contains("' + errorLookingFor + '")').length).to.equal(1);
    });

    it('adds the is-errored class to the parent form__row', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input1');

      focusInOut($input);

      expect($input.parents('.form__row')).to.have.class(validation.config.rowInvalidClass);
    });

    it('adds the aria-invalid attribute to both inputs if either blurred', function() {
      var validation = new this.Validation(this.component).init(),
          $input1 = validation.$el.find('#input1'),
          $input2 = validation.$el.find('#input2');

      focusInOut($input1);

      expect($input1).to.have.attr('aria-invalid', 'true');
      expect($input2).to.have.attr('aria-invalid', 'true');
    });

    it('references the inline error with the aria-describedby attribute on both inputs when invalid', function() {
      var validation = new this.Validation(this.component).init(),
          $input1 = validation.$el.find('#input1'),
          $input2 = validation.$el.find('#input2');

      focusInOut($input1);

      expect($input1.attr('aria-describedby').indexOf(validation._getInlineErrorID($input1.attr('name')))).not.to.equal(-1);
      expect($input2.attr('aria-describedby').indexOf(validation._getInlineErrorID($input2.attr('name')))).not.to.equal(-1);
    });

    it('removes references to the inline error from aria-describedby when valid on both inputs', function() {
      var validation = new this.Validation(this.component).init(),
          $input1 = validation.$el.find('#input1'),
          $input2 = validation.$el.find('#input2');

      focusInOut($input1);
      $input1.prop('checked', true).change();

      expect($input1.attr('aria-describedby').indexOf(validation._getInlineErrorID($input1.attr('name')))).to.equal(-1);
      expect($input2.attr('aria-describedby').indexOf(validation._getInlineErrorID($input2.attr('name')))).to.equal(-1);
    });

    describe('when the validation summary is to be shown', function() {
      it('shows the validation summary if left empty on submit', function() {
        var validation = new this.Validation(this.component, {showValidationSummary: true}).init(),
            $validationSummary = validation.$el.find('.' + validation.config.validationSummaryClass);

        validation.$el.submit();

        expect($validationSummary).to.not.have.class(validation.config.validationSummaryHiddenClass);
      });

      it('does not show the validation summary if the form has not been submitted', function() {
        var validation = new this.Validation(this.component, {showValidationSummary: true}).init(),
            $validationSummary = validation.$el.find('.' + validation.config.validationSummaryClass);

        expect($validationSummary).to.have.class(validation.config.validationSummaryHiddenClass);
      });

      it('adds the error (only once) to the validation summary list if left empty on submit', function() {
        var validation = new this.Validation(this.component, {showValidationSummary: true}).init(),
            $input = validation.$el.find('#input1'),
            errorLookingFor = $input.attr(validation.config.attributeEmpty),
            $validationSummaryList = validation.$el.find('[' + validation.config.validationSummaryListAttribute + ']');

        validation.$el.submit();

        expect($validationSummaryList.find('li:contains("' + errorLookingFor + '")').length).to.equal(1);
      });
    });

    describe('when the validation summary is not to be shown', function() {
      it('has not created the validation summary', function() {
        var validation = new this.Validation(this.component, {showValidationSummary: false}).init(),
            $validationSummary = validation.$el.find('.' + validation.config.validationSummaryClass);

        expect($validationSummary.length).to.equal(0);
      });

      it('does not create the validation summary on submit', function() {
        var validation = new this.Validation(this.component, {showValidationSummary: false}).init(),
            $validationSummary = validation.$el.find('.' + validation.config.validationSummaryClass);

        validation.$el.submit();

        expect($validationSummary.length).to.equal(0);
      });
    });

    it('removes all relevant errors and error states if value corrected as the radio is selected', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input1'),
          errorLookingFor = $input.attr(validation.config.attributeEmpty),
          $validationSummaryList = validation.$el.find('[' + validation.config.validationSummaryListAttribute + ']'),
          $inlineError = $input.parent('.form__row').find('.' + validation.config.inlineErrorClass);

      validation.$el.submit();
      $input.prop('checked', true).change();

      expect($input.parents('.form__row')).not.to.have.class(validation.config.rowInvalidClass);
      expect($validationSummaryList.filter(':contains("' + errorLookingFor + '")').length).to.equal(0);
      expect($inlineError.filter(':contains("' + errorLookingFor + '")').length).to.equal(0);
    });

    it('allows the form to submit if the value is filled in', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input1'),
          $validationSummaryList = validation.$el.find('[' + validation.config.validationSummaryListAttribute + ']');

      $input.prop('checked', true).change();
      validation.$el.submit();

      expect($validationSummaryList.find('li').length).to.equal(0);
    });
  });



  // Minimum length check
  describe('MinLength', function() {
    beforeEach(function(done) {
      var self = this;
      requirejs(
          ['jquery', 'Validation'],
          function($, Validation) {
            self.$html = $(window.__html__['spec/js/fixtures/Validation/MinLength.html']).appendTo('body');
            self.component = self.$html.find('[data-dough-component="Validation"]');
            self.Validation = Validation;
            done();
          }, done);
    });

    afterEach(function() {
      this.$html.remove();
    });

    it('shows the "empty" inline error if empty on blur', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input'),
          errorLookingFor = $input.attr(validation.config.attributeEmpty);

      $input.val('');
      focusInOut($input);

      expect(validation.$el.find('.' + validation.config.inlineErrorClass + ':contains("' + errorLookingFor + '")').length).to.equal(1);
    });

    it('shows the "invalid" inline error if not enough chars on blur', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input'),
          errorLookingFor = $input.attr(validation.config.attributeInvalid);

      $input.val('te');
      focusInOut($input);

      expect(validation.$el.find('.' + validation.config.inlineErrorClass + ':contains("' + errorLookingFor + '")').length).to.equal(1);
    });

    it('adds the is-errored class to the parent form__row', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input');

      $input.val('te');
      focusInOut($input);

      expect($input.parents('.form__row')).to.have.class(validation.config.rowInvalidClass);
    });

    it('adds the aria-invalid attribute to the input', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input');

      focusInOut($input);

      expect($input).to.have.attr('aria-invalid', 'true');
    });

    it('references the inline error with the aria-describedby attribute on the input when invalid', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input');

      focusInOut($input);

      expect($input.attr('aria-describedby').indexOf(validation._getInlineErrorID($input.attr('name')))).not.to.equal(-1);
    });

    it('removes references to the inline error from aria-describedby when valid', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input');

      focusInOut($input);
      $input.val('tested').keyup();

      expect($input.attr('aria-describedby').indexOf(validation._getInlineErrorID($input.attr('name')))).to.equal(-1);
    });

    it('shows the validation summary if not enough chars on submit', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input'),
          $validationSummary = validation.$el.find('.' + validation.config.validationSummaryClass);

      $input.val('te');
      validation.$el.submit();

      expect($validationSummary).to.not.have.class(validation.config.validationSummaryHiddenClass);
    });

    it('does not show the validation summary if the form has not been submitted', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input'),
          $validationSummary = validation.$el.find('.' + validation.config.validationSummaryClass);

      expect($validationSummary).to.have.class(validation.config.validationSummaryHiddenClass);
    });

    it('adds the error to the validation summary list if not enough chars on submit', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input'),
          errorLookingFor = $input.attr(validation.config.attributeInvalid),
          $validationSummaryList = validation.$el.find('[' + validation.config.validationSummaryListAttribute + ']');

      $input.val('te');
      validation.$el.submit();

      expect($validationSummaryList.find('li')).to.have.text(errorLookingFor);
    });

    it('removes all relevant errors and error states if value corrected as the user types', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input'),
          errorLookingFor = $input.attr(validation.config.attributeInvalid),
          $validationSummaryList = validation.$el.find('[' + validation.config.validationSummaryListAttribute + ']'),
          $inlineError = $input.parent('.form__row').find('.' + validation.config.inlineErrorClass);

      validation.$el.submit();
      $input.val('tested').keyup();

      expect($input.parents('.form__row')).not.to.have.class(validation.config.rowInvalidClass);
      expect($validationSummaryList.filter(':contains("' + errorLookingFor + '")').length).to.equal(0);
      expect($inlineError.filter(':contains("' + errorLookingFor + '")').length).to.equal(0);
    });

    it('allows the form to submit if the value is filled in', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input'),
          $validationSummaryList = validation.$el.find('[' + validation.config.validationSummaryListAttribute + ']');

      $input.val('tested');
      validation.$el.submit();

      expect($validationSummaryList.find('li').length).to.equal(0);
    });
  });


  // Regular expression check
  describe('RegExp', function() {
    beforeEach(function(done) {
      var self = this;
      requirejs(
          ['jquery', 'Validation'],
          function($, Validation) {
            self.$html = $(window.__html__['spec/js/fixtures/Validation/RegExp.html']).appendTo('body');
            self.component = self.$html.find('[data-dough-component="Validation"]');
            self.Validation = Validation;
            done();
          }, done);
    });

    afterEach(function() {
      this.$html.remove();
    });

    it('shows the "empty" inline error if empty on blur', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input'),
          errorLookingFor = $input.attr(validation.config.attributeEmpty);

      $input.val('');
      focusInOut($input);

      expect(validation.$el.find('.' + validation.config.inlineErrorClass + ':contains("' + errorLookingFor + '")').length).to.equal(1);
    });

    it('shows the "invalid" inline error if the regexp does not match', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input'),
          errorLookingFor = $input.attr(validation.config.attributeInvalid);

      $input.val('test');
      focusInOut($input);

      expect(validation.$el.find('.' + validation.config.inlineErrorClass + ':contains("' + errorLookingFor + '")').length).to.equal(1);
    });

    it('adds the is-errored class to the parent form__row', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input');

      $input.val('test');
      focusInOut($input);

      expect($input.parents('.form__row')).to.have.class(validation.config.rowInvalidClass);
    });

    it('adds the aria-invalid attribute to the input', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input');

      focusInOut($input);

      expect($input).to.have.attr('aria-invalid', 'true');
    });

    it('references the inline error with the aria-describedby attribute on the input when invalid', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input');

      focusInOut($input);

      expect($input.attr('aria-describedby').indexOf(validation._getInlineErrorID($input.attr('name')))).not.to.equal(-1);
    });

    it('removes references to the inline error from aria-describedby when valid', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input');

      focusInOut($input);
      $input.val('test@tested.com').keyup();

      expect($input.attr('aria-describedby').indexOf(validation._getInlineErrorID($input.attr('name')))).to.equal(-1);
    });

    it('shows the validation summary if the regexp does not match on submit', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input'),
          $validationSummary = validation.$el.find('.' + validation.config.validationSummaryClass);

      $input.val('test');
      validation.$el.submit();

      expect($validationSummary).to.not.have.class(validation.config.validationSummaryHiddenClass);
    });

    it('does not show the validation summary if the form has not been submitted', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input'),
          $validationSummary = validation.$el.find('.' + validation.config.validationSummaryClass);

      expect($validationSummary).to.have.class(validation.config.validationSummaryHiddenClass);
    });

    it('adds the error to the validation summary list if invalid on submit', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input'),
          errorLookingFor = $input.attr(validation.config.attributeInvalid),
          $validationSummaryList = validation.$el.find('[' + validation.config.validationSummaryListAttribute + ']');

      $input.val('test');
      validation.$el.submit();

      expect($validationSummaryList.find('li')).to.have.text(errorLookingFor);
    });

    it('removes all relevant errors and error states if value corrected as the user types', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input'),
          errorLookingFor = $input.attr(validation.config.attributeInvalid),
          $validationSummaryList = validation.$el.find('[' + validation.config.validationSummaryListAttribute + ']'),
          $inlineError = $input.parent('.form__row').find('.' + validation.config.inlineErrorClass);

      validation.$el.submit();
      $input.val('test@tested.com').keyup();

      expect($input.parents('.form__row')).not.to.have.class(validation.config.rowInvalidClass);
      expect($validationSummaryList.filter(':contains("' + errorLookingFor + '")').length).to.equal(0);
      expect($inlineError.filter(':contains("' + errorLookingFor + '")').length).to.equal(0);
    });

    it('allows the form to submit if the value is filled in', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input'),
          $validationSummaryList = validation.$el.find('[' + validation.config.validationSummaryListAttribute + ']');

      $input.val('test@tested.com');
      validation.$el.submit();

      expect($validationSummaryList.find('li').length).to.equal(0);
    });
  });


  // Number range check
  describe('NumberRange', function() {
    beforeEach(function(done) {
      var self = this;
      requirejs(
          ['jquery', 'Validation'],
          function($, Validation) {
            self.$html = $(window.__html__['spec/js/fixtures/Validation/NumberRange.html']).appendTo('body');
            self.component = self.$html.find('[data-dough-component="Validation"]');
            self.Validation = Validation;
            done();
          }, done);
    });

    afterEach(function() {
      this.$html.remove();
    });

    it('shows the "empty" inline error if empty on blur', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input'),
          errorLookingFor = $input.attr(validation.config.attributeEmpty);

      $input.val('');
      focusInOut($input);

      expect(validation.$el.find('.' + validation.config.inlineErrorClass + ':contains("' + errorLookingFor + '")').length).to.equal(1);
    });

    it('shows the "invalid" inline error if the number is too low', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input'),
          errorLookingFor = $input.attr(validation.config.attributeInvalid);

      $input.val('0');
      focusInOut($input);

      expect(validation.$el.find('.' + validation.config.inlineErrorClass + ':contains("' + errorLookingFor + '")').length).to.equal(1);
    });

    it('shows the "invalid" inline error if the number is too high', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input'),
          errorLookingFor = $input.attr(validation.config.attributeInvalid);

      $input.val('6');
      focusInOut($input);

      expect(validation.$el.find('.' + validation.config.inlineErrorClass + ':contains("' + errorLookingFor + '")').length).to.equal(1);
    });

    it('shows the "invalid" inline error if the value is not a number', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input'),
          errorLookingFor = $input.attr(validation.config.attributeInvalid);

      $input.val('test');
      focusInOut($input);

      expect(validation.$el.find('.' + validation.config.inlineErrorClass + ':contains("' + errorLookingFor + '")').length).to.equal(1);
    });

    it('adds the is-errored class to the parent form__row', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input');

      $input.val('0');
      focusInOut($input);

      expect($input.parents('.form__row')).to.have.class(validation.config.rowInvalidClass);
    });

    it('adds the aria-invalid attribute to the input', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input');

      focusInOut($input);

      expect($input).to.have.attr('aria-invalid', 'true');
    });

    it('references the inline error with the aria-describedby attribute on the input when invalid', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input');

      focusInOut($input);

      expect($input.attr('aria-describedby').indexOf(validation._getInlineErrorID($input.attr('name')))).not.to.equal(-1);
    });

    it('removes references to the inline error from aria-describedby when valid', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input');

      focusInOut($input);
      $input.val('3').keyup();

      expect($input.attr('aria-describedby').indexOf(validation._getInlineErrorID($input.attr('name')))).to.equal(-1);
    });

    it('shows the validation summary if the number is too low on submit', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input'),
          $validationSummary = validation.$el.find('.' + validation.config.validationSummaryClass);

      $input.val('0');
      validation.$el.submit();

      expect($validationSummary).to.not.have.class(validation.config.validationSummaryHiddenClass);
    });

    it('shows the validation summary if the number is too high on submit', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input'),
          $validationSummary = validation.$el.find('.' + validation.config.validationSummaryClass);

      $input.val('6');
      validation.$el.submit();

      expect($validationSummary).to.not.have.class(validation.config.validationSummaryHiddenClass);
    });

    it('shows the validation summary if the value is not a number on submit', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input'),
          $validationSummary = validation.$el.find('.' + validation.config.validationSummaryClass);

      $input.val('test');
      validation.$el.submit();

      expect($validationSummary).to.not.have.class(validation.config.validationSummaryHiddenClass);
    });

    it('does not show the validation summary if the form has not been submitted', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input'),
          $validationSummary = validation.$el.find('.' + validation.config.validationSummaryClass);

      expect($validationSummary).to.have.class(validation.config.validationSummaryHiddenClass);
    });

    it('adds the error to the validation summary list if invalid on submit', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input'),
          errorLookingFor = $input.attr(validation.config.attributeInvalid),
          $validationSummaryList = validation.$el.find('[' + validation.config.validationSummaryListAttribute + ']');

      $input.val('6');
      validation.$el.submit();

      expect($validationSummaryList.find('li')).to.have.text(errorLookingFor);
    });

    it('removes all relevant errors and error states if value corrected as the user types', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input'),
          errorLookingFor = $input.attr(validation.config.attributeInvalid),
          $validationSummaryList = validation.$el.find('[' + validation.config.validationSummaryListAttribute + ']'),
          $inlineError = $input.parent('.form__row').find('.' + validation.config.inlineErrorClass);

      validation.$el.submit();
      $input.val('3').keyup();

      expect($input.parents('.form__row')).not.to.have.class(validation.config.rowInvalidClass);
      expect($validationSummaryList.filter(':contains("' + errorLookingFor + '")').length).to.equal(0);
      expect($inlineError.filter(':contains("' + errorLookingFor + '")').length).to.equal(0);
    });

    it('allows the form to submit if the value is filled in', function() {
      var validation = new this.Validation(this.component).init(),
          $input = validation.$el.find('#input'),
          $validationSummaryList = validation.$el.find('[' + validation.config.validationSummaryListAttribute + ']');

      $input.val('3');
      validation.$el.submit();

      expect($validationSummaryList.find('li').length).to.equal(0);
    });
  });


  // Error ordering/numbering check
  describe('Numbering', function() {
    beforeEach(function(done) {
      var self = this;
      requirejs(
          ['jquery', 'Validation'],
          function($, Validation) {
            self.$html = $(window.__html__['spec/js/fixtures/Validation/MultipleFields.html']).appendTo('body');
            self.component = self.$html.find('[data-dough-component="Validation"]');
            self.Validation = Validation;
            done();
          }, done);
    });

    afterEach(function() {
      this.$html.remove();
    });

    it('adds a number "1" to the first inline error', function() {
      var validation = new this.Validation(this.component).init(),
          $input1 = validation.$el.find('#input1'),
          $inlineError = $input1.parent('.form__row').find('.' + validation.config.inlineErrorClass);

      focusInOut($input1);
      expect($inlineError.filter(':contains("1. ")').length).to.equal(1);
    });

    it('adds a number "2" to the second inline error', function() {
      var validation = new this.Validation(this.component).init(),
          $input1 = validation.$el.find('#input1'),
          $input2 = validation.$el.find('#input2'),
          $inlineError = $input2.parent('.form__row').find('.' + validation.config.inlineErrorClass);

      focusInOut($input1);
      focusInOut($input2);

      expect($inlineError.filter(':contains("2. ")').length).to.equal(1);
    });

    it('adds a number "1" to the second field when it is the first error', function() {
      var validation = new this.Validation(this.component).init(),
          $input1 = validation.$el.find('#input1'),
          $input2 = validation.$el.find('#input2'),
          $inlineError = $input2.parent('.form__row').find('.' + validation.config.inlineErrorClass);

      focusInOut($input2);

      expect($inlineError.filter(':contains("1. ")').length).to.equal(1);
    });

    it('numbers the errors according to how they are displayed, regardless of the order they are filled in', function() {
      var validation = new this.Validation(this.component).init(),
          $input1 = validation.$el.find('#input1'),
          $input2 = validation.$el.find('#input2'),
          $input3 = validation.$el.find('#input3'),
          $inlineError1 = $input1.parent('.form__row').find('.' + validation.config.inlineErrorClass),
          $inlineError2 = $input2.parent('.form__row').find('.' + validation.config.inlineErrorClass),
          $inlineError3 = $input3.parent('.form__row').find('.' + validation.config.inlineErrorClass);


      focusInOut($input3);
      focusInOut($input2);
      focusInOut($input1);

      expect($inlineError1.filter(':contains("1. ")').length).to.equal(1);
      expect($inlineError2.filter(':contains("2. ")').length).to.equal(1);
      expect($inlineError3.filter(':contains("3. ")').length).to.equal(1);
    });

    it('numbers the errors according to how they are displayed, even when one is corrected', function() {
      var validation = new this.Validation(this.component).init(),
          $input1 = validation.$el.find('#input1'),
          $input2 = validation.$el.find('#input2'),
          $input3 = validation.$el.find('#input3'),
          $inlineError1 = $input1.parent('.form__row').find('.' + validation.config.inlineErrorClass),
          $inlineError2 = $input2.parent('.form__row').find('.' + validation.config.inlineErrorClass),
          $inlineError3 = $input3.parent('.form__row').find('.' + validation.config.inlineErrorClass);

      focusInOut($input3);
      focusInOut($input2);
      focusInOut($input1);

      $input2.val('test').keyup();

      expect($inlineError1.filter(':contains("1. ")').length).to.equal(1);
      expect($inlineError3.filter(':contains("2. ")').length).to.equal(1);
    });

    it('matches the inline error numbers with the validation summary order', function() {
      var validation = new this.Validation(this.component).init(),
          $input1 = validation.$el.find('#input1'),
          $input2 = validation.$el.find('#input2'),
          $input3 = validation.$el.find('#input3'),
          $inlineError1 = $input1.parent('.form__row').find('.' + validation.config.inlineErrorClass),
          $inlineError2 = $input2.parent('.form__row').find('.' + validation.config.inlineErrorClass),
          $inlineError3 = $input3.parent('.form__row').find('.' + validation.config.inlineErrorClass),
          $validationSummaryList = validation.$el.find('[' + validation.config.validationSummaryListAttribute + ']');

      focusInOut($input3);
      focusInOut($input2);
      focusInOut($input1);

      validation.$el.submit();

      expect($inlineError1.filter(':contains("' + $validationSummaryList.find('li:eq(0)').text() + '")').length).to.equal(1);
      expect($inlineError2.filter(':contains("' + $validationSummaryList.find('li:eq(1)').text() + '")').length).to.equal(1);
      expect($inlineError3.filter(':contains("' + $validationSummaryList.find('li:eq(2)').text() + '")').length).to.equal(1);
    });
  });
});
