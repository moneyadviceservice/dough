module ActionView
  module Helpers
    class FormBuilder
      def form_row(*args, &block)
        attribute = args[0] if args[0].is_a?(Symbol) || nil

        options = args[0] if args[0].is_a?(Hash)
        options = args[1] if args[1].is_a?(Hash)
        options ||= {}

        @form_row = Dough::Helpers::FormRow.new(object: object, attribute: attribute, options: options)
        @template.render({ layout: 'dough/helpers/form_row/form_row', locals: @form_row.locals }, &block)
      end
    end
  end
end

module Dough
  module Helpers
    class FormRow
      attr_reader :object, :attribute, :options, :html_options

      def initialize(options = {})
        @object = options[:options][:object] || options[:object]
        @attribute = options[:attribute]
        @options = options[:options]
        @html_options = Dough::HtmlOptions.new(options[:options][:html_options])
        process_html_options
      end

      def locals
        { html_options: html_options }
      end

      private

      def process_html_options
        html_options.classes << ' form__row'
        html_options.classes << ' is-errored' if errored?
      end

      def errored?
        object.errors[attribute].any? if present?
      end

      def present?
        object && attribute
      end
    end
  end
end
