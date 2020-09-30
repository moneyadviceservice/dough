source 'https://rubygems.org'
source 'http://gems.dev.mas.local' if ENV['MAS_BUILD']

gemspec

ruby '2.5.3'
gem 'rails', '~> 5.2.4.4'

group :development, :test do
  gem 'brakeman', require: false
  gem 'capybara', '2.4.1'
  gem 'danger', require: false
  gem 'danger-rubocop', require: false
  gem 'mas-development_dependencies', github: 'moneyadviceservice/mas-development_dependencies', ref: 'de00ee4'
  gem 'pry'
  gem 'rspec-rails'
  gem 'rubocop', '~> 0.63.1', require: false
  gem 'rubocop-rspec'
  gem 'sass'
  gem 'shoulda-matchers', '~> 2.8.0' # Dough targets 1.9.3 so we need to lock shoulda-matchers to < 3.0
  gem 'sprockets', '~> 3.7.2'
  gem 'tzinfo-data'
end

gem 'mas-build' if ENV['MAS_BUILD']
