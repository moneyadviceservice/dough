#!/bin/bash

set -e -x

bower install
npm install

time bundle install
time bundle exec rspec

export PATH=./node_modules/.bin:$PATH

karma start spec/js/karma.conf.js --single-run
jscs assets/js
