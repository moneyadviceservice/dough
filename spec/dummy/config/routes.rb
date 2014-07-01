Dummy::Application.routes.draw do
  root to: "home#index"

  resources :forms, only: [:index]
end

Rails.application.routes.draw do
  mount Dough::Engine => "/dough"
end
