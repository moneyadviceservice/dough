module Dough
  module Helpers
    class CalloutEditorial
      attr_reader :text, :renderer

      def initialize(options = {})
        @text = options[:text]
        @renderer = options[:renderer]
      end

      def render
        renderer.render partial: 'dough/helpers/callout_editorial/callout_editorial', locals: { text: text }
      end
    end
  end
end
