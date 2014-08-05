describe('Validation', function() {

  'use strict';

  beforeEach(function(done) {
    var self = this;
    requirejs(
        ['jquery', 'Validation'],
        function($, Validation) {
          self.$html = $(window.__html__['test/fixtures/Validation.html']).appendTo('body');
          self.component = self.$html.find('[data-dough-component="Validation"]');
          self.Validation = Validation;
          done();
        }, done);
  });

  afterEach(function() {
    this.$html.remove();
  });

});
