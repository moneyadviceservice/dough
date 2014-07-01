/* Modernizr 2.8.2 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-flexbox-history-inputtypes-localstorage-svg-touch-mq-cssclasses-teststyles-testprop-testallprops-prefixes-domprefixes-cssclassprefix:supports!
 */
;



window.Modernizr = (function( window, document, undefined ) {

  var version = '2.8.2',

      Modernizr = {},

      enableClasses = true,

      docElement = document.documentElement,

      mod = 'modernizr',
      modElem = document.createElement(mod),
      mStyle = modElem.style,

      inputElem  = document.createElement('input')  ,

      smile = ':)',

      toString = {}.toString,

      prefixes = ' -webkit- -moz- -o- -ms- '.split(' '),



      omPrefixes = 'Webkit Moz O ms',

      cssomPrefixes = omPrefixes.split(' '),

      domPrefixes = omPrefixes.toLowerCase().split(' '),

      ns = {'svg': 'http://www.w3.org/2000/svg'},

      tests = {},
      inputs = {},
      attrs = {},

      classes = [],

      slice = classes.slice,

      featureName,


      injectElementWithStyles = function( rule, callback, nodes, testnames ) {

        var style, ret, node, docOverflow,
            div = document.createElement('div'),
            body = document.body,
            fakeBody = body || document.createElement('body');

        if ( parseInt(nodes, 10) ) {
          while ( nodes-- ) {
            node = document.createElement('div');
            node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
            div.appendChild(node);
          }
        }

        style = ['&#173;','<style id="s', mod, '">', rule, '</style>'].join('');
        div.id = mod;
        (body ? div : fakeBody).innerHTML += style;
        fakeBody.appendChild(div);
        if ( !body ) {
          fakeBody.style.background = '';
          fakeBody.style.overflow = 'hidden';
          docOverflow = docElement.style.overflow;
          docElement.style.overflow = 'hidden';
          docElement.appendChild(fakeBody);
        }

        ret = callback(div, rule);
        if ( !body ) {
          fakeBody.parentNode.removeChild(fakeBody);
          docElement.style.overflow = docOverflow;
        } else {
          div.parentNode.removeChild(div);
        }

        return !!ret;

      },

      testMediaQuery = function( mq ) {

        var matchMedia = window.matchMedia || window.msMatchMedia;
        if ( matchMedia ) {
          return matchMedia(mq) && matchMedia(mq).matches || false;
        }

        var bool;

        injectElementWithStyles('@media ' + mq + ' { #' + mod + ' { position: absolute; } }', function( node ) {
          bool = (window.getComputedStyle ?
              getComputedStyle(node, null) :
              node.currentStyle)['position'] == 'absolute';
        });

        return bool;

      },
      _hasOwnProperty = ({}).hasOwnProperty, hasOwnProp;

  if ( !is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined') ) {
    hasOwnProp = function (object, property) {
      return _hasOwnProperty.call(object, property);
    };
  }
  else {
    hasOwnProp = function (object, property) {
      return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
    };
  }


  if (!Function.prototype.bind) {
    Function.prototype.bind = function bind(that) {

      var target = this;

      if (typeof target != "function") {
        throw new TypeError();
      }

      var args = slice.call(arguments, 1),
          bound = function () {

            if (this instanceof bound) {

              var F = function(){};
              F.prototype = target.prototype;
              var self = new F();

              var result = target.apply(
                  self,
                  args.concat(slice.call(arguments))
              );
              if (Object(result) === result) {
                return result;
              }
              return self;

            } else {

              return target.apply(
                  that,
                  args.concat(slice.call(arguments))
              );

            }

          };

      return bound;
    };
  }

  function setCss( str ) {
    mStyle.cssText = str;
  }

  function setCssAll( str1, str2 ) {
    return setCss(prefixes.join(str1 + ';') + ( str2 || '' ));
  }

  function is( obj, type ) {
    return typeof obj === type;
  }

  function contains( str, substr ) {
    return !!~('' + str).indexOf(substr);
  }

  function testProps( props, prefixed ) {
    for ( var i in props ) {
      var prop = props[i];
      if ( !contains(prop, "-") && mStyle[prop] !== undefined ) {
        return prefixed == 'pfx' ? prop : true;
      }
    }
    return false;
  }

  function testDOMProps( props, obj, elem ) {
    for ( var i in props ) {
      var item = obj[props[i]];
      if ( item !== undefined) {

        if (elem === false) return props[i];

        if (is(item, 'function')){
          return item.bind(elem || obj);
        }

        return item;
      }
    }
    return false;
  }

  function testPropsAll( prop, prefixed, elem ) {

    var ucProp  = prop.charAt(0).toUpperCase() + prop.slice(1),
        props   = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

    if(is(prefixed, "string") || is(prefixed, "undefined")) {
      return testProps(props, prefixed);

    } else {
      props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
      return testDOMProps(props, prefixed, elem);
    }
  }    tests['flexbox'] = function() {
    return testPropsAll('flexWrap');
  };
  tests['touch'] = function() {
    var bool;

    if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
      bool = true;
    } else {
      injectElementWithStyles(['@media (',prefixes.join('touch-enabled),('),mod,')','{#modernizr{top:9px;position:absolute}}'].join(''), function( node ) {
        bool = node.offsetTop === 9;
      });
    }

    return bool;
  };
  tests['history'] = function() {
    return !!(window.history && history.pushState);
  };



  tests['localstorage'] = function() {
    try {
      localStorage.setItem(mod, mod);
      localStorage.removeItem(mod);
      return true;
    } catch(e) {
      return false;
    }
  };


  tests['svg'] = function() {
    return !!document.createElementNS && !!document.createElementNS(ns.svg, 'svg').createSVGRect;
  };
  function webforms() {
    Modernizr['inputtypes'] = (function(props) {

      for ( var i = 0, bool, inputElemType, defaultView, len = props.length; i < len; i++ ) {

        inputElem.setAttribute('type', inputElemType = props[i]);
        bool = inputElem.type !== 'text';

        if ( bool ) {

          inputElem.value         = smile;
          inputElem.style.cssText = 'position:absolute;visibility:hidden;';

          if ( /^range$/.test(inputElemType) && inputElem.style.WebkitAppearance !== undefined ) {

            docElement.appendChild(inputElem);
            defaultView = document.defaultView;

            bool =  defaultView.getComputedStyle &&
                defaultView.getComputedStyle(inputElem, null).WebkitAppearance !== 'textfield' &&
                (inputElem.offsetHeight !== 0);

            docElement.removeChild(inputElem);

          } else if ( /^(search|tel)$/.test(inputElemType) ){
          } else if ( /^(url|email)$/.test(inputElemType) ) {
            bool = inputElem.checkValidity && inputElem.checkValidity() === false;

          } else {
            bool = inputElem.value != smile;
          }
        }

        inputs[ props[i] ] = !!bool;
      }
      return inputs;
    })('search tel url email datetime date month week time datetime-local number range color'.split(' '));
  }
  for ( var feature in tests ) {
    if ( hasOwnProp(tests, feature) ) {
      featureName  = feature.toLowerCase();
      Modernizr[featureName] = tests[feature]();

      classes.push((Modernizr[featureName] ? '' : 'no-') + featureName);
    }
  }

  Modernizr.input || webforms();


  Modernizr.addTest = function ( feature, test ) {
    if ( typeof feature == 'object' ) {
      for ( var key in feature ) {
        if ( hasOwnProp( feature, key ) ) {
          Modernizr.addTest( key, feature[ key ] );
        }
      }
    } else {

      feature = feature.toLowerCase();

      if ( Modernizr[feature] !== undefined ) {
        return Modernizr;
      }

      test = typeof test == 'function' ? test() : test;

      if (typeof enableClasses !== "undefined" && enableClasses) {
        docElement.className+=" supports-" + (test ? '' : 'no-') + feature;
      }
      Modernizr[feature] = test;

    }

    return Modernizr;
  };


  setCss('');
  modElem = inputElem = null;


  Modernizr._version      = version;

  Modernizr._prefixes     = prefixes;
  Modernizr._domPrefixes  = domPrefixes;
  Modernizr._cssomPrefixes  = cssomPrefixes;

  Modernizr.mq            = testMediaQuery;


  Modernizr.testProp      = function(prop){
    return testProps([prop]);
  };

  Modernizr.testAllProps  = testPropsAll;


  Modernizr.testStyles    = injectElementWithStyles;    docElement.className = docElement.className.replace(/(^|\s)no-js(\s|$)/, '$1$2') +

      (enableClasses ? " supports-js supports-"+classes.join(" supports-") : '');

  return Modernizr;

})(this, this.document);
;
