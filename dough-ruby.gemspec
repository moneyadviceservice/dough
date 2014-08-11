$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "dough/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "dough-ruby"
  s.version     = Dough::VERSION
  s.authors     = ['Money Advice Service']
  s.email       = ['development.team@moneyadviceservice.org.uk']
  s.homepage    = "https://github.com/moneyadviceservice/dough"
  s.summary     = "Dough"
  s.description = "Dough"

  s.files = Dir["{app,config,db,lib,vendor/assets/non_bower_components}/**/*"] + ["LICENSE", "Rakefile", "README.md", "bower.json"]
  s.test_files = Dir["spec/**/*"]

  s.add_dependency "rails", ">= 3.2"
  s.add_dependency "sass-rails"

  s.add_development_dependency "mas-development_dependencies"
end
