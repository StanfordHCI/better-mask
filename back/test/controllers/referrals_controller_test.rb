require 'test_helper'

class ReferralsControllerTest < ActionDispatch::IntegrationTest
  fixtures :users
  test 'can create a referral' do
    post '/referrals', params: {application_slug: 'kitties', referral_code: 'alice', http_referrer: 'https://www.reddit.com/r/dankmemes'}

    assert_response :ok
    parsed = JSON.parse response.body

    # The created referral must have a token
    assert_not_nil parsed['token']

    # We want the referral landing page to perform as few requests as possible,
    # so we nest some resources on the DTO returned by this endpoint.
    # This is NOT a general pattern for the whole API:
    assert_not_nil parsed['referring_user_name']
    assert_not_nil parsed['app']
  end

  test 'invalid referral code yields an error' do
    post '/referrals', params: {referral_code: 'pickle_rick', application_slug: 'kitties'}
    assert_response :not_found

    post '/referrals', params: {referral_code: 'bob', application_slug: 'azerty'}
    assert_response :not_found
  end
end
