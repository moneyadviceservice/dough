describe('Form model', function() {

  'use strict';

  beforeEach(function(done) {
    var self = this;
    this.server = sinon.fakeServer.create();
    requirejs(
        ['jquery', 'FormModel'],
        function($, FormModel) {
          self.$html = $(window.__html__['test/fixtures/FormModel.html']);
          self.FormModel = FormModel;
          self.formModel = new FormModel(self.$html);
          self.formModel.init();
          done();
        }, done);
  });

  it('populates its model using values from the DOM', function() {
    assert.deepEqual(this.formModel.model, {
      property1: 'value 1',
      property2: 'value 2'
    });
  });

  it('sends the model to the server when the form is submitted', function() {
    var query;
    this.$html.submit();
    query = this.server.requests[0].url.split('?')[1];
    expect(query).to.eq($.param(this.formModel.model));
  });

  it('updates the model after the form is submitted', function() {
    this.server.respondWith('GET', /.*/,
        [200,
          { 'Content-Type': 'application/json' },
          JSON.stringify(
              { 'property2': 'new value' }
          )]);
    this.$html.submit();
    this.server.respond();
    expect(this.formModel.model.property2).to.eq('new value');
  });

  it('updates the model when an input value changes', function() {
    this.$html.find('.input1').val('blah').trigger('change');
    expect(this.formModel.model.property1).to.eq('blah');
  });

});
