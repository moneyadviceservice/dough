require 'dough/helpers/form_row'
require 'dough/helpers/renderer'

require 'active_support/core_ext'

module Dough
  module Helpers
    def method_missing(method_name, *args, &block)
      if args.first.class == String
        args.push text: args.slice!(0)
        render_helper(method_name, *args)
      elsif args.first.class == Hash
        render_helper(method_name, *args)
      else
        super
      end
    end

    private

    def helper
      "Dough::Helpers::Renderer".constantize
    end

    def render_helper method_name, *args
      optional_args = *args
      options = { helper_name: method_name.to_s, renderer: self }
      optional_args.each { |option| options.merge! option } if optional_args
      helper.new(options).render
    end
  end
end
