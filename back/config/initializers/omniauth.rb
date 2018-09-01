# Don't forget to restart your server when you edit this file!

OmniAuth.config.logger = Rails.logger

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :facebook, ENV['FACEBOOK_APP_ID'], ENV['FACEBOOK_APP_SECRET'],
           scope: 'public_profile', info_fields: 'id, name, link',
           origin_param: 'return_to'
end
