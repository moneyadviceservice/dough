module Dough
  module Helpers
    class Renderer
      attr_reader :text, :renderer, :helper_name, :html_content

      def initialize(options = {})
        @helper_name = options[:helper_name]
        @text = options[:text]
        @renderer = options[:renderer]
        @html_content = options[:html_content]
      end

      def render
        template_file = "dough/helpers/#{helper_name}/#{helper_name}"
        context = renderer.render(partial: template_file, locals: { text: text, html_content: html_content })
        if context.empty?
          fail NameError
        else
          context
        end
      end
    end
  end
end

