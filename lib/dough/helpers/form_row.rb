module ActionView
  module Helpers
    class FormBuilder
      def form_row(attribute = nil, options = {}, &block)
        @form_row = FormRow.new(object: object, attribute: attribute, options: options)
        @template.render({layout: 'dough/helpers/form_row/form_row', locals: @form_row.locals}, &block)
      end

      private

      class FormRow
        attr_reader :object, :attribute, :options, :html_options

        def initialize(options = {})
          @object = options[:object]
          @attribute = options[:attribute]
          @options = options[:options]
          @html_options = HtmlOptions.new(options[:options][:html_options])
          process_html_options
        end

        def locals
          {html_options: html_options}
        end

        private

        def process_html_options
          html_options.classes << ' form__row'
          html_options.classes << ' is-errored' if errored?
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

      class HtmlOptions < OpenStruct
        # magic
        def method_missing(m, *args, &block)
          unless respond_to?(m)
            self[m] = ''
          end

          super
        end
      end
    end
  end
end
