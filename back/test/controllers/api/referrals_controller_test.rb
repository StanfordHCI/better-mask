require 'test_helper'

class Api::ReferralsControllerTest < ActionDispatch::IntegrationTest
  test 'can mark a referral as converted' do
    alice = users(:alice)
    token = referral_tokens(:claimed)
    referral = Referral.where(referral_token: token).first

    oauth_app = referral.app.oauth_application

    assert referral.converted === false

    oauth_application(oauth_app)
    oauth_user(alice)
    post '/api/referrals/convert'

    assert_response :no_content

    referral.reload
    assert referral.converted === true
  end
end
