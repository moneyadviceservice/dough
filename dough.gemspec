$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "dough/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "dough-ruby"
  s.version     = Dough::VERSION
  s.authors     = ['Money Advice Service']
  s.email       = ['development.team@moneyadviceservice.org.uk']
  s.homepage    = "https://github.com/moneyadviceservice/dough-ruby"
  s.summary     = "Dough Ruby"
  s.description = "Dough Ruby"

  s.files = Dir["{app,config,db,lib}/**/*"] + ["MIT-LICENSE", "Rakefile", "README.rdoc"]
  s.test_files = Dir["test/**/*"]

  s.add_dependency "rails", "~> 3.2.17"
  # s.add_dependency "jquery-rails"

  s.add_development_dependency "sqlite3"
  s.add_development_dependency "mas-development_dependencies"
end
