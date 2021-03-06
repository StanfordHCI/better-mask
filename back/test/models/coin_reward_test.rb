# == Schema Information
#
# Table name: coin_rewards
#
#  id          :bigint(8)        not null, primary key
#  amount      :integer          not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  app_id      :bigint(8)
#  referral_id :bigint(8)        not null
#  user_id     :bigint(8)
#
# Indexes
#
#  index_coin_rewards_on_app_id       (app_id)
#  index_coin_rewards_on_referral_id  (referral_id)
#  index_coin_rewards_on_user_id      (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (app_id => apps.id)
#  fk_rails_...  (referral_id => referrals.id)
#  fk_rails_...  (user_id => users.id)
#

require 'test_helper'

class CoinRewardTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
