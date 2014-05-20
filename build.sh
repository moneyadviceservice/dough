#!/bin/bash

set -e -x

export BUNDLE_WITHOUT="development:test"

time bundle install
time bundle exec rake app:gem:build
