$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "dough/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "dough"
  s.version     = Dough::VERSION
  s.authors     = ['Money Advice Service']
  s.email       = ['development.team@moneyadviceservice.org.uk']
  s.homepage    = "https://github.com/moneyadviceservice/dough"
  s.summary     = "Dough"
  s.description = "Dough"

  s.files = Dir["{app,config,db,lib}/**/*"] + ["LICENSE", "Rakefile", "README.md"]
  s.test_files = Dir["spec/**/*"]

  s.add_dependency "rails", "~> 3.2.17"

  s.add_development_dependency "mas-development_dependencies"
  s.add_development_dependency "sass-rails"
end
