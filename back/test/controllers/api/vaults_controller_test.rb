require 'test_helper'

class Api::VaultsControllerTest < ActionDispatch::IntegrationTest
  test "index returns no_content if the user has no vault" do
    oauth_user users(:alice)
    get '/api/vaults'
    assert_response :no_content
  end

  test "index returns the user's vault if the user has one" do
    oauth_user users(:charlie)
    get '/api/vaults'
    assert_response :ok
    assert_equal(parsed_response_body['id'], vaults(:one).id)
  end

  test "create a vault for a user who doesn't have one" do
    oauth_user users(:alice)
    post '/api/vaults', params: {seed_words: 'rofl lmao tagada tsoin tsoin', password: 'qsdfqsdf'}
    assert_response :created
    assert_equal('qsdfqsdf', parsed_response_body['password'])
  end

  test "create a vault for a user who already has one" do
    oauth_user users(:charlie)
    post '/api/vaults', params: {seed_words: 'rofl lmao tagada tsoin tsoin', password: 'qsdfqsdf'}
    assert_response :bad_request
    assert_not_nil parsed_response_body['error']
  end
end
