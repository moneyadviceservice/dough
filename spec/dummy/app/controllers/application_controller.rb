class ApplicationController < ActionController::Base
  protect_from_forgery

  helper Dough::Helpers
end
