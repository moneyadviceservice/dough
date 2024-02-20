require 'dough/forms/object_error'

module Dough
  module Forms
    class Builder < ActionView::Helpers::FormBuilder
      include ActionView::Helpers::RenderingHelper
      include ActionView::Helpers::TranslationHelper
      include ActionView::Helpers::UrlHelper

      # Returns a summary of errors to be displayed on the form.
      #
      # Usage (assuming 'f' is the form builder variable name):
      #
      #  <%= f.errors_summary %>
      #
      def errors_summary
        ApplicationController.render(partial: errors_summary_partial_name, locals: { errors: object_errors }) if object_errors.present?
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
        'dough/forms/builder/errors_summary'
      end

      # Returns *all* error messages for the field passed on the argument.
      #
      # Usage (assuming 'f' is the form builder variable name):
      #
      #  <%= f.errors_for(:age) %>
      #  <%= f.errors_for(:name) %>
      #
      def errors_for(field_name)
        errors = object_errors.select { |error, _| error.field_name == field_name }
        ApplicationController.render(partial: errors_for_partial_name, collection: errors, as: 'error')
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
        'dough/forms/builder/errors_for'
      end

      def object_errors
        object.errors.map.each_with_index do |error, index|
          object_error_class.new(
            object: object,
            field_name: error.attribute,
            message: error.message,
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

      # Returns an Array<Pathname> for locating the views
      # for the error summary and the error for each field.
      # You can overwrite this method to look for the summary:
      #
      # class MyBuilder < Dough::Form::Builder
      #   def partial_paths
      #     [Rails.root.join('app/views/my_builder_partials/')]
      #   end
      # end
      #
      def partial_paths
        [Dough::Engine.root.join('app/views/dough/forms/builder/')]
      end
    end
  end
end
