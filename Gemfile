source 'https://rubygems.org'
source 'http://gems.dev.mas.local' if ENV['MAS_BUILD']

gemspec

group :development, :test do
  gem 'brakeman', require: false
  gem 'mas-development_dependencies', github: 'moneyadviceservice/mas-development_dependencies', ref: 'de00ee4'
  gem 'nokogiri', '1.8.5'
  gem 'pry'
  gem 'rspec-rails'
  gem 'capybara', '2.4.1'
  gem 'shoulda-matchers', '~> 2.8.0' # Dough targets 1.9.3 so we need to lock shoulda-matchers to < 3.0
  gem 'tzinfo-data'
end

gem 'mas-build' if ENV['MAS_BUILD']
