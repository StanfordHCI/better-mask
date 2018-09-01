ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
require 'rails/test_help'
require 'mocha/minitest'

class ActiveSupport::TestCase
  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all


  def authenticated_post path, args
    args = authenticated_request_args args

    post path, args
  end

  def authenticated_get path, args
    args = authenticated_request_args args

    get path, args
  end

  # TODO _patch, _put, _delete etc...

  # Sign in an API user
  def oauth_user user
    token = Doorkeeper::AccessToken.new(resource_owner_id: user.id)
    Api::BaseController.any_instance.stubs(:doorkeeper_token).returns(token)
  end

  def parsed_response_body
    JSON.parse(response.body)
  end

  private

  def authenticated_request_args args
    user = args[:user] || User.first
    args.delete :user

    raise 'authenticated_post test helper: user must have a token' unless user.token.present?

    args[:headers] ||= {}
    headers = args[:headers].merge ({Authorization: "Bearer #{user.token}"})

    args.merge ({headers: headers})
  end
end
