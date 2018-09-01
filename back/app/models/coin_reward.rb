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

class CoinReward < ApplicationRecord
  # See the comment in CoinRewardsController#mint about the way the referral
  # mechanism should work when we have external social apps, with a minting quota.

  belongs_to :user
  belongs_to :app
  belongs_to :referral

  # TODO add custom validation to make sure that creating this coin reward will not make the app exceed its quota
  validates :amount, presence: true, numericality: { :greater_than_or_equal_to => 0 }
  validates :referral, presence: true
  validate :validate_quota_ok
  validate :validate_referral_not_rewarded
  validate :validate_referral_converted

  private

  def validate_quota_ok
    # Implement real logic here when app quotas are implemented,
    # e.g app.remaining_quota > amount
    true
  end

  def validate_referral_converted
    # Skip if referral is absent, let another validation take care of it:
    return unless referral.present?
    errors.add(:referral, "is not converted, therefore doesn't deserve a reward") unless referral.converted?
  end

  def validate_referral_not_rewarded
    # Skip if referral is absent, let another validation take care of it:
    return unless referral.present?
    referral_already_rewarded = CoinReward.find_by(referral_id: referral.id).present?
    errors.add(:referral, "has already been rewarded with a coin minting") if referral_already_rewarded
  end
end
