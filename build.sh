#!/bin/bash

set -e -x

export RAILS_ENV=build
export BUNDLE_WITHOUT="development:test"

npm install
# Temporary fix to disable github pages which is causing build problems
# ./node_modules/gulp/bin/gulp.js build

time bundle install
time bundle exec rake app:gem:build
