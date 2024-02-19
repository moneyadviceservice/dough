#
# FIXME: Should be obeying Rails conventions
#
module Dough
  module Forms
    module Builders
      module ValidationModule
        include ActionView::Helpers::UrlHelper
        include ActionView::Helpers::RenderingHelper
        include ActionView::Helpers::TranslationHelper

        def validation_summary
          view_renderer.render(view_context, partial: 'summary_for_errors', locals: { errors: errors, error_prefix: error_prefix })
        end

        def compiled_method_container
          view_context.compiled_method_container
        end

        def in_rendering_context(options, &blk)
          view_context.in_rendering_context(options, &blk)
        end

        def _run(*args, &blk)
          view_context._run(*args, &blk)
        end

        def errors_for(subject = nil, field)
          subject ||= object
          filtered_errors = errors.select { |hash| hash[:object] == subject && hash[:field] == field }

          view_renderer.render(view_context, partial: 'errors_for_field', collection: filtered_errors, as: 'error', locals: { error_prefix: error_prefix })
        end

        def validates(*models)
          @error_models = models
        end

        def error_count
          errors.count
        end

        def lookup_context
          ActionView::LookupContext.new(
            ActionController::Base.view_paths + [Dough::Engine.root.join('app/views/dough/forms/builders/validation')]
          )
        end

        def view_renderer
          ActionView::Renderer.new(lookup_context)
        end

        def view_context
          ActionView::Base.new(lookup_context)
        end

        private

        def error_models
          @error_models ||= [object]
        end

        def errors
          @errors ||= begin
            [].tap do |errors|
              counter = 1

              error_models.each do |model|
                collate_model_errors(model).each do |field, message|
                  errors << { number: counter, object: model, field: field, message: message }
                  counter += 1
                end
              end
            end
          end
        end

        def collate_model_errors(model)
          field_order = Array(model.try(:field_order))

          [].tap do |model_errors|
            (field_order | model.errors.keys).each do |field|
              model.errors.full_messages_for(field).each do |message|
                model_errors << [field, message]
              end
            end
          end
        end

        def error_prefix
          @options
            .try { |options| options[:html] }
            .try { |html| html[:id] } || object_name
        end
      end

      class Validation < ::ActionView::Helpers::FormBuilder
        include ValidationModule
      end
    end
  end
end
