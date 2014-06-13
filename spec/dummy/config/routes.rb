Dummy::Application.routes.draw do
  resources :forms, only: [:index]
end

Rails.application.routes.draw do
  mount Dough::Engine => "/dough"
end
