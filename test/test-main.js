var allTestFiles = [];
var TEST_REGEXP = /(spec|test)\.js$/i;

var pathToModule = function (path) {
  return path.replace(/^\/base\//, '').replace(/\.js$/, '');
};

Object.keys(window.__karma__.files).forEach(function (file) {
  if (TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    allTestFiles.push(pathToModule(file));
  }
});

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base',

  // dynamically load all test files
  deps: allTestFiles,

  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start,
  paths: {
    DoughBaseComponent: 'app/assets/javascripts/dough/components/DoughBaseComponent',
    featureDetect: 'app/assets/javascripts/dough/lib/featureDetect',
    modernizr: 'vendor/assets/modernizr/modernizr',
    mediaQueries: 'app/assets/javascripts/dough/lib/mediaQueries',
    componentLoader: 'app/assets/javascripts/dough/lib/componentLoader',
    Collapsable: 'app/assets/javascripts/dough/components/Collapsable',
    TabSelector: 'app/assets/javascripts/dough/components/TabSelector',
    RangeInput: 'app/assets/javascripts/dough/components/RangeInput',
    FieldHelpText: 'app/assets/javascripts/dough/components/FieldHelpText',
    Validation: 'app/assets/javascripts/dough/components/Validation',
    jquery: 'vendor/assets/bower_components/jquery/dist/jquery',
    rivets: 'vendor/assets/bower_components/rivets/dist/rivets',
    eventsWithPromises: 'vendor/assets/bower_components/eventsWithPromises/src/eventsWithPromises',
    rsvp: 'vendor/assets/bower_components/rsvp/rsvp.amd',
    jqueryThrottleDebounce: 'vendor/assets/bower_components/jqueryThrottleDebounce/jquery.ba-throttle-debounce',
    utilities: 'app/assets/javascripts/dough/lib/utilities'
  },
  shim: {
    modernizr: {
      exports: 'Modernizr'
    }
  }

});
