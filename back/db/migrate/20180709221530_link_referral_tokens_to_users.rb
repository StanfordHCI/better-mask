class LinkReferralTokensToUsers < ActiveRecord::Migration[5.2]
  def change
    add_reference :referral_tokens, :user, null: true, foreign_key: true
  end
end
