require "dough/helpers/form_row"
require "dough/helpers/renderer"

require "active_support/core_ext"

module Dough
  module Helpers
    def method_missing(method_name, *args, &block)
      helper = "Dough::Helpers::Renderer".constantize
      text, optional_args = *args
      options = { helper_name: method_name.to_s, renderer: self, text: text }
      options.merge! optional_args if optional_args
      helper.new(options).render
    end
  end
end
