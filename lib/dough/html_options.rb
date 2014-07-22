module Dough
  class HtmlOptions < OpenStruct
    # We want developers to be able to use any HTML attribute they want
    # If the attibute is not present we set this to an empty string first
    def method_missing(m, *args, &block)
      name = m.to_sym

      unless respond_to?(name)
        new_ostruct_member(name)
        public_send("#{name.to_sym}=", '')
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
