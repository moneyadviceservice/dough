Dummy::Application.routes.draw do
  root to: "home#index"

  resources :components, only: [:index]
  resources :forms, only: [:index]

  get "/integrated_dough_helper", to: "integrated_dough_helper#index"
end
