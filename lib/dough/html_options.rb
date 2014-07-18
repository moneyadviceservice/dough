module Dough
  class HtmlOptions < OpenStruct
    # magic
    def method_missing(m, *args, &block)
      unless respond_to?(m)
        self[m] = ''
      end

      super
    end

    def to_s
      hash = to_h
      hash[:class] = hash.delete(:classes)
      hash.map{|k,v| "#{k}=\"#{v}\""}.join(' ')
    end
  end
end
