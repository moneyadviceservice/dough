module Dough
  module Helpers
    class InsetBlock
      include ActionView::Helpers::RenderingHelper

      attr_reader :text, :renderer

      def initialize(options = {})
        @text = options[:text]
        @renderer = options[:renderer]
      end

      def render
        renderer.render lookup_context, partial: 'inset_block', locals: { text: text }
      end

      private

      def lookup_context
        # OBJECT MUTATED? May need to dupe
        renderer.lookup_context.view_paths << Dough::Engine.root.join('app/views/dough/helpers/inset_block')
        renderer.lookup_context
      end
    end
  end
end
