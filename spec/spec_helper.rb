ENV['RAILS_ENV'] ||= 'test'

require_relative 'dummy/config/environment'

require 'mas/development_dependencies/rspec/spec_helper'

RSpec.configure do |config|
  config.infer_spec_type_from_file_location!
end
