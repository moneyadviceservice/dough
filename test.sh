#!/bin/bash

set -e -x

bower install
npm install

time bundle install
time bundle exec rspec

export PATH=./node_modules/.bin:$PATH

karma start test/karma.conf.js --single-run
jscs app/assets/javascripts/dough
