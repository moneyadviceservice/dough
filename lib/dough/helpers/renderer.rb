module Dough
  module Helpers
    class Renderer
      attr_reader :renderer, :helper_name, :options

      def initialize(options = {})
        @helper_name = options.delete(:helper_name)
        @renderer = options.delete(:renderer)
        @options = options
      end

      def render
        template_file = "dough/helpers/#{helper_name}/#{helper_name}"
        renderer.render(partial: template_file, locals: options)
      end
    end
  end
end

