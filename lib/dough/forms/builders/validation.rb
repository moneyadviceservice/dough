module Dough
  module Forms
    module Builders
      module ValidationModule
        include ActionView::Helpers::TagHelper
        include ActionView::Context
        include ActionView::Helpers::UrlHelper

        # TODO partials
        def validation_summary
          content_tag(:div, class: "validation-summary") do
            content_tag(:ol, class: "validation-summary__list") do
              errors.map do |error|
                summary_li_for_error(error)
              end.join.html_safe
            end
          end
        end

        # TODO partials
        def errors_for(object, field)
          content_tag(:ol, id: "#{field}-errors") do
            errors.select{|hash| hash[:object] == object && hash[:field] == field}.map do |error|
              content_tag(:li, "#{error[:number]}. #{error[:message]}")
            end.join.html_safe
          end
        end

        def validates(*models)
          @error_models = models
        end

        def error_count
          errors.count
        end

        private

        def error_models
          @error_models ||= [object]
        end

        def errors
          return @errors if @errors

          @errors = []
          counter = 1

          error_models.each do |model|
            model.errors.each do |field,message|
              @errors << {number: counter, object: model, field: field, message: model.errors.full_message(field, message)}
              counter += 1
            end
          end

          @errors
        end

        def summary_li_for_error(error)
          if error[:field] == :base
            content_tag(:li, "#{error[:number]}. #{error[:message]}".html_safe)
          else
            content_tag(:li, "#{error[:number]}. #{link_to error[:message], "##{error[:field]}-errors"}".html_safe)
          end
        end
      end

      class Validation < ::ActionView::Helpers::FormBuilder
        include ValidationModule
      end
    end
  end
end
