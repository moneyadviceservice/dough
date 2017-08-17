require 'dough/forms/object_error'

module Dough
  module Forms
    class Builder < ActionView::Helpers::FormBuilder
      include ActionView::Helpers::RenderingHelper
      include ActionView::Helpers::TranslationHelper
      include ActionView::Helpers::UrlHelper

      def errors_summary
        render(errors_summary_partial_name, errors: object_errors) if object_errors.present?
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

      def errors_for(field_name)
        errors = object_errors.select { |error, _| error.field_name == field_name }
        render(partial: errors_for_partial_name, collection: errors, as: 'error')
      end

      # This is the partial used to render the summary errors.
      #
      # You can overwrite the partial being used on your own builder:
      #
      #  class MyFormBuilder < Dough::Forms::Builder
      #    def errors_for_partial_name
      #      'my_own_errors_for_partial_name'
      #    end
      #  end
      #
      def errors_for_partial_name
        'errors_for'
      end

      def object_errors
        object.errors.map.each_with_index do |error, index|
          object_error_class.new(
            object: object,
            field_name: error[0],
            message: error[1],
            counter: index + 1,
            prefix: object_name
          )
        end
      end

      #
      # This returns the class for handling all errors on the object.
      # This class will be used on all partials for 'error_summary' and 'errors_for'
      #
      # If you need to customize the error to be displayed on the partials
      # you can overwrite the default object error class adding a class
      # that respects the interface of the default object error class.
      #
      # class MyBuilder < Dough::Forms::Builder
      #   def object_error_class
      #     MyObjectErrorClass
      #   end
      # end
      #
      # class MyObjectErrorClass < Dough::Forms::ObjectError
      # end
      #
      def object_error_class
        ::Dough::Forms::ObjectError
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
