module ActionView
  module Helpers
    class FormBuilder
      def form_row
        @template.content_tag :div, class: 'form__row' do
          yield
        end
      end
    end
  end
end
