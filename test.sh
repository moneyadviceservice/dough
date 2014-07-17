#!/bin/bash

set -e -x

bower install
npm install

time bundle install
time bundle exec rspec

./node_modules/karma/bin/karma start test/karma.conf.js --single-run
