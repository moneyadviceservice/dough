module Dough
  module Helpers
    class InsetBlock
      attr_reader :text, :renderer

      def initialize(options = {})
        @text = options[:text]
        @renderer = options[:renderer]
      end

      def render
        renderer.render partial: 'dough/helpers/inset_block/inset_block', locals: { text: text }
      end
    end
  end
end
