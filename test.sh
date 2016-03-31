#!/bin/bash

set -e -x

bower install
npm install

time bundle install
time bundle exec rspec

export PATH=./node_modules/.bin:$PATH

sass assets/stylesheets/_templates/karma_tests.scss spec/js/fixtures/stylesheets/lib.css
karma start spec/js/karma.conf.js --single-run

jscs assets/js
