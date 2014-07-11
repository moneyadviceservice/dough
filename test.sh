#!/bin/bash

set -e -x

time bundle install
time bundle exec rspec

bower install
npm install
./node_modules/karma/bin/karma start test/karma.conf.js --single-run
