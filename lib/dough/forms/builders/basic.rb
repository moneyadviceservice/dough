module Dough
  module Forms
    module Builders
      class Basic < ::ActionView::Helpers::FormBuilder

        def text_field(name, *args)
          @template.content_tag :div, class: 'form__item' do
            label(name, class: 'form__label-heading') + @template.tag(:br) + super
          end
        end

      end
    end
  end
end
