require 'test_helper'

class Api::UsersControllerTest < ActionDispatch::IntegrationTest
  test 'Referral links endpoint' do
    oauth_user users(:alice)
    get '/api/referral-links'
    assert_response :ok
    assert_not_nil response.parsed_body['toris']
    assert_equal 'http://www.example.com/r/alice/kitties', response.parsed_body['kitties']
  end
end
