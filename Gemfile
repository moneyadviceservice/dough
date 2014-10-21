source "https://rubygems.org"
source 'http://gems.test.mas' if ENV['MAS_BUILD']

gemspec

group :development, :test do
  gem 'mas-development_dependencies', '2.3.0', github: 'moneyadviceservice/mas-development_dependencies'
  gem 'pry'
  gem 'rspec-rails'
  gem 'capybara', '2.4.1'
  gem 'rubocop'
  gem 'capybara', '2.4.1'
end

gem 'mas-build' if ENV['MAS_BUILD']
