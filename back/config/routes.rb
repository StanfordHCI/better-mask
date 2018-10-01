Rails.application.routes.draw do
  use_doorkeeper

  root 'home#index'

  get 'welcome-extension', to: 'home#extension_install_hook'
  get 'download-bettermask', to: 'home#download_bettermask'
  get 'coming-soon/:platform', to: 'home#coming_soon'
  get 'detect-web3', to: 'home#detect_web3'

  get 'auth/facebook/callback', to: 'sessions#create'
  get 'auth/failure', to: redirect('/')
  get 'me', to: 'sessions#me'
  get 'logout', to: 'sessions#destroy'
  get 'extension-oauth-callback', to: 'sessions#extension_oauth_callback'


  #
  # REFERRALS
  #

  get 'r/:referral_code/:app_slug', to: 'referrals#show', as: :referral_link
  get 'r/:referral_code/:app_slug/:source', to: 'referrals#show', as: :referral_link_with_source

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

  get 'admin', to: 'admin#index'

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
    get '/referral-links', to: 'users#referral_links'
    get '/offers', to: 'users#offers'
  end
end
