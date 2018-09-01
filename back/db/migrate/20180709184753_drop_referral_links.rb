class DropReferralLinks < ActiveRecord::Migration[5.2]
  def change
    remove_foreign_key :referrals, :referral_links
    remove_column :referrals, :referral_link_id

    drop_table :referral_links
  end
end
