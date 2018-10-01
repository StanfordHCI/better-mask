class ReferralSetMintedNotNullAddDefaultFalse < ActiveRecord::Migration[5.2]
  def change
    # When creating, minted should always be false:
    change_column :airdrop_mints, :minted, :boolean, null: false, default: false
  end
end
