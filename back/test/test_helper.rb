ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
require 'rails/test_help'
require 'mocha/minitest'

class ActiveSupport::TestCase
  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  def authenticate_user user
    ApplicationController.any_instance.stubs(:current_user).returns(user)
  end

  # TODO _patch, _put, _delete etc...

  # Sign in an API user
  def oauth_user user
    token = Doorkeeper::AccessToken.new(resource_owner_id: user.id)
    Api::BaseController.any_instance.stubs(:doorkeeper_token).returns(token)
  end

  def oauth_application app
    Api::BaseController.any_instance.stubs(:current_application).returns(app)
  end

  def parsed_response_body
    JSON.parse(response.body)
  end
end
