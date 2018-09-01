require 'test_helper'

class ReferralTokensControllerTest < ActionDispatch::IntegrationTest
  test 'should be able to claim a token' do
    ref_token = ReferralToken.first
    user = User.first

    authenticated_post '/referral_tokens/claim', user: user, params: {token: ref_token.token}

    assert_response :success
    ref_token.reload
    assert_equal ref_token.user_id, user.id
  end

  test 'should not be able to claim a token if it is already claimed' do
    ref_token = ReferralToken.first
    user = User.first

    authenticated_post '/referral_tokens/claim', user: user, params: {token: ref_token.token}

    user = User.second

    authenticated_post '/referral_tokens/claim', user: user, params: {token: ref_token.token}

    assert_response :bad_request

    ref_token.reload
    assert_equal ref_token.user_id, User.first.id
  end
end
