module ActionView
  module Helpers
    class FormBuilder
      def form_row(object = nil, attribute = nil, options = {}, &block)
        @form_row = FormRow.new(object: object, attribute: attribute, options: options)
        @template.render({layout: 'dough/helpers/form_row/form_row', locals: @form_row.locals}, &block)
      end

      private

      class FormRow
        attr_reader :object, :attribute, :options

        def initialize(options = {})
          @object = options[:object]
          @attribute = options[:attribute]
          @options = options[:options]
        end

        def locals
          hash = {html_options: {}}
          hash[:html_options][:class] = html_options_class
          hash
        end

        private

        def html_options_class
          string = options[:html_options][:class] if options[:html_options]
          string ||= ""
          string << ' is-errored' if errored?
          string
        end

        def errored?
          if present?
            object.errors[attribute].any?
          else
            false
          end
        end

        def present?
          object && attribute
        end
      end
    end
  end
end
