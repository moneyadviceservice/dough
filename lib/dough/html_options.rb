module Dough
  class HtmlOptions < OpenStruct
    # magic
    def method_missing(m, *args, &block)
      unless respond_to?(m)
        self[m] = ''
      end

      super
    end
  end
end
