class LinkReferralsWithReferralTokens < ActiveRecord::Migration[5.2]
  def change
    remove_column :referrals, :token, :string

    add_reference :referrals, :referral_token, foreign_key: true
  end
end
