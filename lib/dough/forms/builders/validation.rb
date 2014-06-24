module Dough
  module Forms
    module Builders
      module ValidationModule
        include ActionView::Helpers::UrlHelper
        include ActionView::Helpers::RenderingHelper

        def validation_summary
          render 'summary_for_errors', errors: errors unless errors.empty?
        end

        def errors_for(subject=nil, field)
          subject ||= object
          filtered_errors = errors.select { |hash| hash[:object] == subject && hash[:field] == field }

          render partial: 'errors_for_field', collection: filtered_errors, as: 'error'
        end

        def validates(*models)
          @error_models = models
        end

        def error_count
          errors.count
        end

        def lookup_context
          ActionView::LookupContext.new(ActionController::Base.view_paths + [Dough::Engine.root.join('app/views/dough/forms/builders/validation')])
        end

        private

        def view_renderer
          ActionView::Renderer.new(lookup_context)
        end

        def error_models
          @error_models ||= [object]
        end

        def errors
          return @errors if @errors

          @errors = []
          counter = 1

          error_models.each do |model|
            if model.respond_to? :field_order
              model_errors = []

              (model.field_order + model.errors.keys).uniq.each do |field|
                model.errors[field].each do |message|
                  model_errors << [field, message]
                end
              end
            else
              model_errors = model.errors
            end

            model_errors.each do |field,message|
              @errors << {number: counter, object: model, field: field, message: message}
              counter += 1
            end
          end

          @errors
        end
      end

      class Validation < ::ActionView::Helpers::FormBuilder
        include ValidationModule
      end
    end
  end
end
