module Dough
  module Helpers
    require "dough/helpers/inset_block"

    def dough
      @dough_renderer ||= Dough::Renderer.new(lookup_context)
    end

    def lookup_context
      # May want use whatever is in the controller instead
      ActionView::LookupContext.new(ActionController::Base.view_paths)
    end
  end

  class Renderer < ActionView::Renderer
    def inset_block(text)
      Helpers::InsetBlock.new(renderer: self, text: text).render
    end
  end
end
