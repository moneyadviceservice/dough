#!/bin/bash

set -e -x

time bundle install
time bundle exec rspec
