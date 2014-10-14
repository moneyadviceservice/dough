require 'dough/helpers/form_row'
require 'dough/helpers/renderer'

require 'active_support/core_ext'

module Dough
  module Helpers
    def method_missing(method_name, *args, &block)
      if args.first.class == String
        helper_with_text(method_name, *args)
      elsif args.first.class == Hash
        helper_without_text(method_name, *args)
      else
        super
      end
    end

    private

    def helper
      "Dough::Helpers::Renderer".constantize
    end

    def helper_with_text method_name, *args
      text, optional_args = *args
      options = { helper_name: method_name.to_s, renderer: self, text: text }
      options.merge! optional_args if optional_args
      helper.new(options).render
    end

    def helper_without_text method_name, *args
      optional_args = *args
      options = { helper_name: method_name.to_s, renderer: self }
      optional_args.each { |option| options.merge! option } if optional_args
      helper.new(options).render
    end
  end
end
