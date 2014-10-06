require "dough/helpers/callout_editorial"
require "dough/helpers/form_row"
require "dough/helpers/renderer"

require "active_support/core_ext"

module Dough
  module Helpers
    def method_missing(method_name, *args, &block)
      helper = "Dough::Helpers::Renderer".constantize
      helper.new(helper_name: method_name.to_s, renderer: self, text: args).render
    end

    def callout_editorial(text)
      Helpers::CalloutEditorial.new(renderer: self, text: text).render
    end
  end
end
