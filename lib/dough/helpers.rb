require 'dough/helpers/form_row'
require 'dough/helpers/renderer'

require 'active_support/core_ext'

module Dough
  module Helpers
    def method_missing(method_name, *args, &block)
      helper = "Dough::Helpers::Renderer".constantize
      if args.first.class == String
        options = helper_with_text method_name, *args
      elsif args.first.class == Hash
        options = helper_without_text method_name, *args
      else
        super
      end
      helper.new(options).render
    end

    private

    def helper_with_text method_name, *args
      text, optional_args = *args
      options = { helper_name: method_name.to_s, renderer: self, text: text }
      options.merge! optional_args if optional_args
      options
    end

    def helper_without_text method_name, *args
      optional_args = *args
      options = { helper_name: method_name.to_s, renderer: self }
      optional_args.each { |arg| options.merge! arg } if optional_args
      options
    end
  end
end
