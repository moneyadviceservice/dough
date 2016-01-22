describe('utilities', function() {

  'use strict';

  before(function(done) {
    var self = this;
    requirejs(
        ['utilities'],
        function(utilities) {
          self.mod = utilities;
          done();
        }, done);

    self.clock = sinon.useFakeTimers();
  });

  after(function() {
    this.clock.restore();
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

  describe('convertCamelCaseToDashed', function() {
    [
      ['FooBar', 'foo-bar'],
      ['FOOBar', 'foo-bar'],
      ['FooBarBaz', 'foo-bar-baz'],
    ].forEach(function(fixture) {
      var input = fixture[0],
          expected = fixture[1];

      it('should convert ' + input + ' into ' + expected, function() {
        expect(this.mod.convertCamelCaseToDashed(input)).to.equal(expected);
      });
    });
  });

  describe('log', function() {
    var sandbox;

    beforeEach(function() {
      sandbox = sinon.sandbox.create();

      // stub some console methods
      sandbox.stub(window.console, 'log');
      sandbox.stub(window.console, 'warn');
    });

    afterEach(function() {
      sandbox.restore();
    });

    it('should output a console.log message by default', function() {
      this.mod.log('test');

      expect(console.log.callCount).to.be.equal(1);
    });

    it('should output a console.warn message if specified', function() {
      this.mod.log('test', 'warn');

      expect(console.warn.callCount).to.be.equal(1);
    });

    it('should not attempt to call console if browser does not support it', function() {
      var stubDoesConsoleExist = sinon.stub(this.mod, 'doesConsoleExist', function() {
        return false;
      });

      this.mod.log('test');

      expect(console.log.callCount).to.be.equal(0);

      stubDoesConsoleExist.restore();
    });
  });

  describe('doesConsoleExist', function() {
    it('return true if the console method exists', function() {
      expect(this.mod.doesConsoleExist('warn')).to.be.equal(true);
    });

    it('return false if the console method does not exist', function() {
      expect(this.mod.doesConsoleExist('blah')).to.be.equal(false);
    });
  });

  describe('debounce', function() {
    it('calls the method after certain amount of time', function() {
      var func = sinon.stub(),
          time = 2000;
      this.mod.debounce(func, time)();
      expect(func.callCount).to.be.equal(0);
      this.clock.tick(time);
      expect(func.callCount).to.be.equal(1);
    })
  });
});
