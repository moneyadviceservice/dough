// Karma configuration
// Generated on Tue Apr 01 2014 09:56:45 GMT+0100 (BST)

module.exports = function(config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../../',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['requirejs', 'mocha', 'chai-jquery', 'chai', 'sinon', 'fixture', 'jquery-3.3.1'],

    // list of files / patterns to load in the browser
    files: [
      'spec/js/fixtures/stylesheets/lib.css',
      'spec/js/test-main.js',
      'spec/js/fixtures/*.html',
      'spec/js/fixtures/Validation/*.html',
      'vendor/assets/non_bower_components/modernizr/modernizr.js',
      {pattern: 'assets/js/**/*.js', included: false},
      {pattern: 'vendor/assets/bower_components/**/*.js', included: false},
      {pattern: 'spec/js/tests/*_spec.js', included: false}
    ],

    // list of files to exclude
    exclude: [
      'vendor/assets/bower_components/**/test/*.js'
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      '**/*.html': ['html2js'],
      'assets/js/**/*.js': ['coverage']
    },

    // test results reporter to use
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec'],

    // configure the reporter
    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['ChromeHeadless'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });
};
