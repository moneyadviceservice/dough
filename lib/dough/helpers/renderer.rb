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
        context = renderer.render(partial: template_file, locals: options)
        if context.empty?
          fail NameError
        else
          context
        end
      end
    end
  end
end

