module ActionView
  module Helpers
    class FormBuilder
      def form_row(&block)
        @template.render layout: 'dough/helpers/form_row/form_row', &block
      end
    end
  end
end
