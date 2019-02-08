require 'sass/rails'

module Dough
  class Engine < ::Rails::Engine
    isolate_namespace Dough

    config.to_prepare do
      ::ApplicationController.helper(Helpers)
    end

    initializer 'dough.assets.precompile' do |app|
      app.config.assets.precompile += %w[dough/assets/stylesheets/basic.css
                                         dough/assets/stylesheets/font_files.css
                                         dough/assets/stylesheets/font_base64.css]
      app.config.assets.precompile << /\.(?:png|svg|eot|woff|ttf)$/
    end
  end
end
