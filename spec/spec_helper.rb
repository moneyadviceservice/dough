ENV['RAILS_ENV'] ||= 'test'

require_relative 'dummy/config/environment'

require 'rspec/rails'

RSpec.configure do |config|
  config.order = 'random'
  config.run_all_when_everything_filtered = true
  config.infer_spec_type_from_file_location!
  config.include Rails.application.routes.url_helpers
  config.infer_base_class_for_anonymous_controllers = false
end
