describe('Print', function () {
  'use strict';
  var ctx = {};

  beforeEach(function(done) {
    requirejs(['jquery', 'Print'], function ($, Print) {
      ctx.$html = $(window.__html__['spec/js/fixtures/Print.html']).appendTo('body');
      ctx.$component = ctx.$html.find('[data-dough-component="Print"]');
      ctx.describedClass = Print;
      ctx.subject = new ctx.describedClass(ctx.$component, {});
      ctx.subject.init();

      ctx.windowPrintStub = sinon.stub(window, 'print');

      done();
    }, done);
  });

  afterEach(function() {
    ctx.windowPrintStub.restore();
    ctx.$html.remove();
  });

  describe('when the target element is clicked', function() {
    it('triggers the browser to show the print dialog', function() {
      expect(ctx.windowPrintStub.called).not.to.eq(true);
      ctx.$component.click();
      expect(ctx.windowPrintStub.called).to.eq(true);
    });
  });
});
