Rails.application.routes.draw do
  use_doorkeeper

  root 'home#index'

  get 'auth/facebook/callback', to: 'sessions#create'
  get 'auth/failure', to: redirect('/')
  get 'me', to: 'sessions#me'
  get 'logout', to: 'sessions#destroy'
  get 'extension-oauth-callback', to: 'sessions#extension_oauth_callback'


  #
  # REFERRALS
  #

  get 'r/:referral_code/:app_slug', to: 'referrals#show', as: :referral_link

  resources :referrals, only: [:create] do
    collection do
      get 'post_auth_hook', to: 'referrals#post_auth_hook'
    end
  end

  resources :referral_tokens, only: [] do
    collection do
      post 'claim'
    end
  end

  namespace :api do
    resources :apps, only: [:index]
    resources :referrals, only: [:index] do
      collection do
        post :convert
      end
    end
    resources :vaults, only: [:index, :create] do
      collection do
        get :unlock
        get :wallet_address
      end
    end

    resources :coin_rewards, only: [] do
      collection do
        post :mint
      end
    end

    get '/me', to: 'users#me'
    get '/referral-link', to: 'users#referral_link'
  end
end
