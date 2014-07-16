module Dough
  module Helpers
    class InsetBlock
      include ActionView::Helpers::RenderingHelper

      attr_reader :text

      def initialize(options = {})
        @text = options[:text]
      end

      def render
        renderer.render lookup_context, partial: 'inset_block', locals: { text: text }
      end

      private

      def renderer
        ActionView::Renderer.new(lookup_context)
      end

      def lookup_context
        ActionView::LookupContext.new(ActionController::Base.view_paths + [Dough::Engine.root.join('app/views/dough/helpers/inset_block')])
      end
    end
  end
end
