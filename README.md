# Dough

The Money Advice Service's frontend assets.


## Prerequisites

* [Git]
* [Bower]
* [NodeJS]
* [Grunt]

## Installation

Clone the repository:

```sh
$ git clone https://github.com/moneyadviceservice/dough.git
```

Make sure all dependencies are available:

```sh
$ bower install
$ npm install
```

## Generating Docs

Ensure all dependencies are installed, and simply run:

```sh
$ grunt
```

To run Grunt's 'watch' task, which will watch for any file changes in the Javascript components directory (```./js/components/```) and rebuild the documentation automatically, use the following:

```sh
$ grunt watch:js
```

## Running Javascript tests

Make sure you ran npm install.

```sh
$ ./node_modules/karma/bin/karma start test/karma.conf.js --single-run
```

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Keep your feature branch focused and short lived
4. Commit your changes (`git commit -am 'Add some feature'`)
5. Push to the branch (`git push origin my-new-feature`)
6. Create new Pull Request


[bower]: http://bower.io
[git]: http://git-scm.com
[nodejs]: http://nodejs.org/
[grunt]: http://gruntjs.com/getting-started

## Releases
31/7/14 - v0.2.0 - breaking change - VisibilityToggler component renamed to Collapsable
