describe('confirmation form', function () {
  'use strict';
  var sandbox;

  var itBehavesLikeAConfirmableForm = function() {
    afterEach(function() {
      this.$html.remove();
      sandbox.restore();
    });

    // We want to know whether the form submission has been
    // blocked. So we listen for submit, and then check
    // whether default has been prevented. This flag is
    // assessed later on.
    // Note that we also need to block submission ourselves
    // so Karma doesn't complain.
    beforeEach(function() {
      var self = this;
      self.$form.submit(function(e) {
        self.defaultPrevented = e.isDefaultPrevented();
        e.preventDefault();
      });
    });

    it('exists', function() {
      expect(this.$input).to.exist;
    });

    it('lets submission continue if the user confirms', function() {
      sandbox.stub(window, 'confirm').returns(true);
      this.$input.click();
      expect(this.defaultPrevented).to.eq(false);
    });

    it('blocks submission if the user does not confirm', function() {
      var confirm = sandbox.stub(window, 'confirm').returns(false);
      this.$input.click();
      expect(this.defaultPrevented).to.eq(true);
    });

    it('blocks submission if the user does not confirm', function() {
      var calledWith,
          stubFn = function(arg) { calledWith = arg; return true; },
          confirm = sandbox.stub(window, 'confirm').callsFake(stubFn);
      this.$input.click();
      expect(calledWith).to.eq('The message');
    });
  };

  describe('on an input field', function() {
    beforeEach(function (done) {
      var self = this;

      requirejs(['jquery', 'ConfirmableForm'], function ($, ConfirmableForm) {
        self.$html = $(window.__html__['spec/js/fixtures/ConfirmableFormOnInput.html']).appendTo('body');
        self.$input = self.$html.find('input');
        self.$form = self.$html.find('form');
        self.ConfirmableForm = new ConfirmableForm(self.$input).init();
        sandbox = sinon.sandbox.create();

        done();
      }, done);
    });

    itBehavesLikeAConfirmableForm();
  });

  describe('on a form', function() {
    beforeEach(function (done) {
      var self = this;

      requirejs(['jquery', 'ConfirmableForm'], function ($, ConfirmableForm) {
        self.$html = $(window.__html__['spec/js/fixtures/ConfirmableForm.html']).appendTo('body');
        self.$input = self.$html.find('input');
        self.$form = self.$html.find('form');
        self.ConfirmableForm = new ConfirmableForm(self.$form).init();
        sandbox = sinon.sandbox.create();

        done();
      }, done);
    });

    itBehavesLikeAConfirmableForm();
  });
});
