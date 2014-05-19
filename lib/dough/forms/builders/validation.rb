module Dough
  module Forms
    module Builders
      module ValidationModule
        include ActionView::Helpers::UrlHelper
        include ActionView::Helpers::RenderingHelper

        def validation_summary
          render 'summary_for_errors', errors: errors
        end

        def errors_for(object, field)
          render 'errors_for_field', errors: errors, object: object, field: field
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
            model.errors.each do |field,message|
              @errors << {number: counter, object: model, field: field, message: model.errors.full_message(field, message)}
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
