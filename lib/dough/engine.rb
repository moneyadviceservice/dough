require 'sass-rails'

module Dough
  class Engine < ::Rails::Engine
    isolate_namespace Dough

    config.to_prepare do
      ::ApplicationController.helper(Helpers)
    end
  end
end
