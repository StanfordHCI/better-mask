# == Schema Information
#
# Table name: airdrop_mints
#
#  id         :bigint(8)        not null, primary key
#  minted     :boolean
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  app_id     :bigint(8)
#  user_id    :bigint(8)
#
# Indexes
#
#  index_airdrop_mints_on_app_id   (app_id)
#  index_airdrop_mints_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (app_id => apps.id)
#  fk_rails_...  (user_id => users.id)
#

class AirdropMint < ApplicationRecord
  belongs_to :user
  belongs_to :app

  def self.reward_converted_referral(referral)
    app = referral.app
    raise "reward_converted_referral only supports the DTI airdrop" unless app.is_dti_airdrop?

    referring_user = referral.referring_user
    self.create(user: referring_user, app: app, minted: false)

    referred_user = referral.referred_user
    self.create(user: referred_user, app: app, minted: false)
  end
end
