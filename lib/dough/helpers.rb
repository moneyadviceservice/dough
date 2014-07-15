module Dough
  module Helpers
    require "dough/helpers/inset_block"

    def dough
      @dough_renderer ||= Dough::Renderer.new(lookup_context)
    end

    def lookup_context
      ActionView::LookupContext.new(ActionController::Base.view_paths + [Dough::Engine.root.join('app/views/dough/helpers/inset_block')])
    end
  end

  class Renderer < ActionView::AbstractRenderer
    def initialize(*)
      super
    end

    def inset_block(text)
      Helpers::InsetBlock.new(text: text).render
    end
  end
end
