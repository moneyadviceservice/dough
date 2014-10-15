require 'dough/helpers/form_row'
require 'dough/helpers/renderer'

require 'active_support/core_ext'

module Dough
  module Helpers

    #
    # Leverage method_missing so that we don't have to create boilerplate code to deliver template dependant
    # helpers.
    #
    # We should only use this pattern when a template partial is needed
    #
    def method_missing(method_name, *args, &block)
      if helper_exists?(method_name)
        parsed_args = merge_optional_string(args)
        render_helper(method_name, parsed_args)
      else
        super
      end
    end

    private

    #
    # @TODO
    #
    # Find a better home for all this logic
    #

    #
    # Checks to see whether the a template of the same name as the helper exists.
    #
    # If it does we render that we that parameters passed
    #
    def helper_exists? method_name
      view_paths = ActionController::Base.view_paths 
      context = ActionView::LookupContext.new(view_paths) 

      context.exists?(method_name, ["dough/helpers/#{method_name}"], true)
    end

    def merge_optional_string args
      new_args = {}
      args.push text: args.slice!(0) if args.first.class == String
      args.each { |arg| new_args.merge!(arg) }

      new_args
    end

    def render_helper method_name, *args
      optional_args = *args
      options = { helper_name: method_name.to_s, renderer: self }
      optional_args.each { |option| options.merge! option } if optional_args

      Dough::Helpers::Renderer.new(options).render
    end
  end
end
