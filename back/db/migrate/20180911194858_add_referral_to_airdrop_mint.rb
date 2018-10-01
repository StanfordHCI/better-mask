class AddReferralToAirdropMint < ActiveRecord::Migration[5.2]
  def change
    add_reference :airdrop_mints, :referral, foreign_key: true, unique: true
  end
end
