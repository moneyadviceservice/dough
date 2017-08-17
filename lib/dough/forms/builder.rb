module Dough
  module Forms
    class ObjectError
      include ActiveModel::Model
      attr_accessor :object, :field_name, :message, :counter

      def ==(other)
        object == other.object && field_name == other.field_name &&
          counter == other.counter && message == other.message
      end

      def full_message
        "#{field_name} #{message}".humanize
      end
    end

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
          ::Dough::Forms::ObjectError.new(
            object: object,
            field_name: error[0],
            message: error[1],
            counter: index + 1
          )
        end
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
