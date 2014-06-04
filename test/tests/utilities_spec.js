describe('utilities', function () {

  'use strict';

  before(function (done) {
    var self = this;
    requirejs(
        ['utilities'],
        function (utilities) {
          self.mod = utilities;
          done();
        }, done);
  });

  describe('currencyToInteger', function() {

    it('should remove any £ and , values', function() {
      expect(this.mod.currencyToInteger('£2,374,000')).to.equal(2374000);
    });

    it('should remove any decimal place', function() {
      expect(this.mod.currencyToInteger('£53,000.34')).to.equal(53000);
    });

  });

  describe('numberToCurrency', function() {

    it('should round to the nearest integer', function() {
      expect(this.mod.numberToCurrency('237400.12')).to.equal('£237,400');
      expect(this.mod.numberToCurrency('58.90')).to.equal('£59');
    });

  });

  describe('getURLParam', function() {
    beforeEach(function(){
      this.query = '?utf8=✓&dob_year=1961&dob_month=8&dob_day=5&salary=£24%2C000&salary_frequency=yearly&gender=male';
    });

    it('should extract a named param', function() {
      var val = this.mod.getUrlParam(this.query, 'gender');
      expect(val).to.equal('male');
    });

    it('should decode a named param', function() {
      var val = this.mod.getUrlParam(this.query, 'salary');
      expect(val).to.equal('£24,000');
    });
  });

});
