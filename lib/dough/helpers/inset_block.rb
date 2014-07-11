module Dough
  module Helpers
    class InsetBlock
      include ActionView::Helpers::RenderingHelper

      attr_reader :text

      def initialize(options = {})
        @text = options[:text]
      end

      def render
        renderer.render lookup_context, { partial: 'inset_block', locals: { text: text } }, {}
      end

      private

      def renderer
        @renderer ||= ActionView::PartialRenderer.new(lookup_context)
      end

      def lookup_context
        context = ActionView::LookupContext.new(ActionController::Base.view_paths)
        context.view_paths << Dough::Engine.root.join('app/views/dough/helpers/inset_block')
        context
      end
    end
  end
end
