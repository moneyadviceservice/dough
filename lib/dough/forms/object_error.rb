module Dough
  module Forms
    class ObjectError
      include ActiveModel::Model
      attr_accessor :object, :field_name, :message, :counter, :prefix

      def ==(other)
        object == other.object && field_name == other.field_name &&
          counter == other.counter && message == other.message
      end

      def full_message
        if show_message_without_field_name?
          message
        else
          "#{field_name} #{message}".humanize
        end
      end

      def unique_identifier
        "error-#{prefix}-#{counter}"
      end

      def show_message_without_field_name?
        false
      end
    end
  end
end
