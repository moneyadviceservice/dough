module Dough
  module Forms
    class ObjectError
      include ActiveModel::Model
      attr_accessor :object, :field_name, :message, :counter, :prefix

      def ==(other)
        object == other.object && field_name == other.field_name &&
          counter == other.counter && message == other.message
      end

      # Returns the error message with the field name and the message
      # as default.
      # If you need to display only the message without the field
      # name for a specific field then you will need to overwrite the
      # show_message_without_field_name? method:
      #
      # class MyCustomObjectErrorClass < Dough::Forms::ObjectError
      #   def show_message_without_field_name?
      #     field_name == :age
      #   end
      # end
      #
      def full_message
        if show_message_without_field_name?
          message
        else
          "#{field_name} #{message}".humanize
        end
      end

      # Returns a unique identifier to be used on the summary hyperlink.
      #
      def unique_identifier
        "error-#{prefix}-#{counter}"
      end

      def show_message_without_field_name?
        false
      end
    end
  end
end
