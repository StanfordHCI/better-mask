# == Schema Information
#
# Table name: referrals
#
#  id                :bigint(8)        not null, primary key
#  converted         :boolean          default(FALSE), not null
#  http_referrer     :string(255)
#  ip_address        :string(255)
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  app_id            :bigint(8)
#  referral_token_id :bigint(8)
#  referring_user_id :bigint(8)
#
# Indexes
#
#  index_referrals_on_app_id             (app_id)
#  index_referrals_on_referral_token_id  (referral_token_id)
#  index_referrals_on_referring_user_id  (referring_user_id)
#
# Foreign Keys
#
#  fk_rails_...  (app_id => apps.id)
#  fk_rails_...  (referral_token_id => referral_tokens.id)
#  fk_rails_...  (referring_user_id => users.id)
#

require 'test_helper'

class ReferralTest < ActiveSupport::TestCase
  test 'create pending' do
    user = User.first
    app = App.first
    http_referrer = 'https://www.reddit.com/r/dogecoin'
    ip = '123.234.190.128'

    referral = Referral.create_or_touch_pending({referral_code: user.referral_code, application_slug: app.slug, http_referrer: http_referrer }, ip: ip)

    assert_equal referral.referring_user_id, user.id
    assert_equal referral.app_id, app.id
    assert_equal referral.ip_address, ip
    assert_equal referral.http_referrer, http_referrer
  end

  test 'create pending when authenticated a referral token is provided' do
    skip 'TODO'
  end

  test 'create pending when authenticated but no referral token is provided' do
    skip 'TODO'
  end

  test 'create pending when authenticated AND a referral token is provided' do
    skip 'TODO'
  end

  test 'record conversion' do
    referring_user = User.first
    referred_user = User.second

    token = ReferralToken.create(user: referred_user, token: 'whatever')

    app = App.first

    ref1 = Referral.create(referring_user: referring_user, referral_token: token, app: app, created_at: 10.minutes.ago)
    ref2 = Referral.create(referring_user: referring_user, referral_token: token, app: app)

    # Make sure the created_at dates are different, ensuring the
    # order_by clause in the query will behave as expected:
    assert ref1.created_at < ref2.created_at

    # Converted must not be nil
    assert_not_nil ref1.converted
    assert_not_nil ref2.converted

    # Mark the user as converted for this app:
    Referral.record_conversion(app, referred_user)

    ref1.reload
    ref2.reload

    assert ref2.converted, 'The most recent referral should have been marked as converted'
    assert ref1.converted === false, 'An "old" referral should not have been marked as converted'
  end
end
