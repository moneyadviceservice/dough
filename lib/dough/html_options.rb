module Dough
  class HtmlOptions < OpenStruct
    # We want developers to be able to use any HTML attribute they want
    # If the attibute is not present we set this to an empty string first
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
