#!/bin/bash

set -e -x

export RAILS_ENV=build
export BUNDLE_WITHOUT="development:test"

time bundle install
time bundle exec rake app:gem:build
