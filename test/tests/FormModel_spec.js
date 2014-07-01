describe('Form model', function() {

  'use strict';

  beforeEach(function(done) {
    var self = this;
    this.server = sinon.fakeServer.create();
    requirejs(
        ['jquery', 'FormModel'],
        function($, FormModel) {
          self.$form = $(window.__html__['test/fixtures/FormModel.html']);
          self.FormModel = FormModel;
          self.formModel = new FormModel(self.$form);
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
    this.$form.submit();
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
    this.$form.submit();
    this.server.respond();
    expect(this.formModel.model.property2).to.eq('new value');
  });

  it('updates the model when an input value changes', function() {
    this.$form.find('.input1').val('blah').trigger('change');
    expect(this.formModel.model.property1).to.eq('blah');
  });

  it('only sends model properties to the server, excluding methods', function() {
    var query;
    // add a method to the model
    this.formModel.model.myFunc = function(){};
    this.$form.submit();
    // the method should have been stripped from the serialized model sent to the server
    query = this.server.requests[0].url.split('?')[1];
    expect(query.indexOf('myFunc')).to.eq(-1);
  });
});
