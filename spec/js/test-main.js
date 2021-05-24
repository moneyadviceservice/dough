var allTestFiles = [];
var TEST_REGEXP = /(spec|test)\.js$/i;

var pathToModule = function(path) {
  return path.replace(/^\/base\//, '').replace(/\.js$/, '');
};

Object.keys(window.__karma__.files).forEach(function(file) {
  if(TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    allTestFiles.push(pathToModule(file));
  }
});

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base',

  paths: {
    DoughBaseComponent: 'assets/js/components/DoughBaseComponent',
    featureDetect: 'assets/js/lib/featureDetect',
    modernizr: 'vendor/assets/modernizr/modernizr',
    mediaQueries: 'assets/js/lib/mediaQueries',
    componentLoader: 'assets/js/lib/componentLoader',
    BackToTop: 'assets/js/components/BackToTop',
    ChatPopup: 'assets/js/components/ChatPopup',
    Collapsable: 'assets/js/components/Collapsable',
    CollapsableMobile: 'assets/js/components/CollapsableMobile',
    CovidBanner: 'assets/js/components/CovidBanner',
    ConfirmableForm: 'assets/js/components/ConfirmableForm',
    PopupTip: 'assets/js/components/PopupTip',
    PostMessages: 'assets/js/components/PostMessages',
    Print: 'assets/js/components/Print',
    TabSelector: 'assets/js/components/TabSelector',
    RangeInput: 'assets/js/components/RangeInput',
    SearchFocus: 'assets/js/components/SearchFocus',
    ThirdPartyCookieAccess: 'assets/js/components/ThirdPartyCookieAccess',
    FieldHelpText: 'assets/js/components/FieldHelpText',
    Validation: 'assets/js/components/Validation',
    jquery: 'vendor/assets/bower_components/jquery/dist/jquery',
    rivets: 'vendor/assets/bower_components/rivets/dist/rivets',
    eventsWithPromises: 'vendor/assets/bower_components/eventsWithPromises/src/eventsWithPromises',
    rsvp: 'vendor/assets/bower_components/rsvp/rsvp',
    jqueryThrottleDebounce: 'vendor/assets/bower_components/jqueryThrottleDebounce/jquery.ba-throttle-debounce',
    utilities: 'assets/js/lib/utilities',
    squire: 'vendor/assets/bower_components/squire/src/Squire'
  },
  shim: {
    modernizr: {
      exports: 'Modernizr'
    }
  }
});

// Squire appears to be causing conflicts with AMD modules,
// so we explicitly wrap in a require module
// @see http://stackoverflow.com/questions/17205904/squirejs-causing-random-tests-to-intermittently-fail-or-not-run-at-all
require(allTestFiles, window.__karma__.start);
