class AddUniqueIndexUsersOnReferralCode < ActiveRecord::Migration[5.2]
  def change
    add_index :users, :referral_code, unique: true
  end
end
