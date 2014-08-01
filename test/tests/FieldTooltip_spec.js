describe('Field input tooltip', function() {

  'use strict';

  beforeEach(function(done) {
    var self = this;
    requirejs(
        ['jquery', 'FieldTooltip', 'eventsWithPromises'],
        function($, FieldTooltip, eventsWithPromises) {
          self.$html = $(window.__html__['test/fixtures/FieldTooltip.html']);
          self.FieldTooltip = FieldTooltip;
          self.eventsWithPromises = eventsWithPromises;
          done();
        }, done);
  });

});
