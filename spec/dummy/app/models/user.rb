class User
  extend ActiveModel::Naming
  extend ActiveModel::Translation

  attr_reader   :errors
  attr_accessor :name

  def initialize
    @errors = ActiveModel::Errors.new(self)
  end

  def to_key
  end
end
