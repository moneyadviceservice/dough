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

#### To use Dough in your project

If you already have a `bower.json`, rename this to `bower.json.erb` and add the `dough`  reference to `dependencies`:

```sh
"dependencies": {
  "dough": "<%= gem_path('dough-ruby') %>"
}
```

Then run

```sh
bowndler install
```

This will create `bower.json`, pull in the latest Dough gem and also install any other Bower dependencies you have defined. From this point on you should edit `bower.json.erb` instead of `bower.json` when updating your Bower configuration.

#### Alternatively, you can setup a `bower link` to Dough

```sh
cd ~/Sites/dough # or whatever your local Dough is
bower link
```

#### Connect the link above to _PROJECT_

```sh
cd PROJECT
bower link dough
```

This will setup a symlink so you can live develop Dough and your project simultaneously.

## Running Javascript tests

Make sure you ran npm install.

```sh
$ ./node_modules/karma/bin/karma start test/karma.conf.js --single-run
```

## Javascript style checking

```
./node_modules/jscs/bin/jscs js
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
31/7/14 - v1.0.0 - breaking change - VisibilityToggler component renamed to Collapsable
