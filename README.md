# Dough

A reusable UI component library from the Money Advice Service, free for use on any Rails based project. More info and a fuller introduction available [on our blog](http://making.moneyadviceservice.org.uk/2015/01/making-with-dough/).

[![Code Climate](https://codeclimate.com/github/moneyadviceservice/dough/badges/gpa.svg)](https://codeclimate.com/github/moneyadviceservice/dough)

## Prerequisites

* [Git]
* [Bower]
* [NodeJS]
* [Gulp]

## Usage

Add the following to your Gemfile and bundle:

Rails 4:
`gem 'dough-ruby'`

Rails 5:
`gem 'dough-ruby', require: 'dough'`

## Installation

Clone the repository:

```sh
$ git clone https://github.com/moneyadviceservice/dough.git
```

Make sure all dependencies are available:

```sh
$ npm install -g bower
$ bower install
$ npm install
```

## How to use a local copy of Dough

**Dough is a bower module embedded inside a ruby gem.**

Use these instructions when you're working on Dough and want to
see the effects within another project. For example, if you're working on _Pension Calculator_,
you want to use a local copy of Dough.

For the purpose of this example, _PROJECT_ refers to _Pension Calculator_, or whatever you're working on.

#### Make sure you have the latest bundle in _PROJECT_

```sh
cd PROJECT
bundle install
```

#### Link `dough-ruby` to your local copy, in _PROJECT_'s `Gemfile`

***DO NOT COMMIT THIS!!!***

```sh
# Add this to the top of the file if it doesn't exist already
gem 'dough-ruby', path: '~/Sites/dough' # or whatever your local Dough is
```

#### Set up `bower link` in Dough

```sh
cd ~/Sites/dough # or whatever your local Dough is
bower link
```

#### Connect the link above to _PROJECT_

```sh
cd PROJECT
bower link dough
```

#### Troubleshooting

If you don't see your local CSS after following the steps

```sh
rm -r tmp/cache
```

## Running Javascript tests

Make sure you ran npm install.

```sh
$ ./node_modules/karma/bin/karma start spec/js/karma.conf.js --single-run
```

## Javascript style checking

Make sure you ran npm install.
```
./node_modules/jshint/bin/jshint ./assets/js --config .jshintrc
```

```
./node_modules/jscs/bin/jscs js
```

To prevent commiting JavaScript files that violate JSHint and JSCS rules:

```shell
cat > .git/hooks/pre-commit <<EOF
!/bin/sh
./script/git-pre-commit-jshint.sh
EOF
chmod +x .git/hooks/pre-commit
```

## JavaScript documentation

Dough's [JS documentation](http://moneyadviceservice.github.io/dough) follows the [jsDoc](https://github.com/jsdoc3/jsdoc) syntax and is generated using Gulp.

To generate documentation

```shell
gulp jsdoc
```

To generate and deploy documentation to the [gh-pages](https://github.com/moneyadviceservice/dough/tree/gh-pages) branch.

```shell
gulp build
```

The *jsDoc* theme used is [jaguar-jsdoc](https://github.com/davidshimjs/jaguarjs-jsdoc).

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
[gulp]: https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md

## Releases
31/7/14 - v1.0.0 - breaking change - VisibilityToggler component renamed to Collapsable
