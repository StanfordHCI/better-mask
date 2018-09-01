require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module BettermaskBack
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 5.2

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration can go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded after loading
    # the framework and any gems in your application.
    #

    # Omniauth requires a session (which is using cookies) to work.
    # Ideally, we'd want to get rid of these two middlewares
    # config.middleware.use ActionDispatch::Cookies
    # config.middleware.use ActionDispatch::Session::CookieStore

    config.middleware.insert_before 0, Rack::Cors do
      allow do
        allowed_origins = JSON.parse ENV["ALLOWED_ORIGINS"]

        begin
          apps = ::App.all
          app_origins = apps.map(&:url)
        rescue ActiveRecord::StatementInvalid # Happens when db is not initialized yet
          app_origins = []
        end

        allowed_origins.concat(app_origins)

        puts "CORS - allowed origins: #{allowed_origins}"
        origins(allowed_origins)

        resource '*', :headers => :any, :methods => [:get, :post, :options, :put, :delete]
      end
    end
  end
end
