module Dough
  module Forms
    class Builder < ActionView::Helpers::FormBuilder
      include ActionView::Helpers::RenderingHelper
      include ActionView::Helpers::TranslationHelper

      def errors_summary
        render(errors_summary_partial_name, errors: object.errors) if object.errors.present?
      end

      # This is the partial used to render the summary errors.
      #
      # You can overwrite the partial being used on your own builder:
      #
      #  class MyFormBuilder < Dough::Forms::Builder
      #    def errors_summary_partial
      #      'my_own_errors_summary_partial'
      #    end
      #  end
      #
      def errors_summary_partial_name
        'errors_summary'
      end

      def lookup_context
        ActionView::LookupContext.new(
          ActionController::Base.view_paths +
          [Dough::Engine.root.join('app/views/dough/forms/builder/')]
        )
      end

      def view_renderer
        ActionView::Renderer.new(lookup_context)
      end
    end
  end
end
