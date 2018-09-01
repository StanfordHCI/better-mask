class MakeUsersReferralCodeNotNull < ActiveRecord::Migration[5.2]
  def change
    change_column :users, :referral_code, :string, null: false
  end
end
