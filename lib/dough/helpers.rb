require "dough/helpers/inset_block"
require "dough/helpers/form_row"

module Dough
  module Helpers
    def inset_block(text)
      Helpers::InsetBlock.new(renderer: self, text: text).render
    end
  end
end
