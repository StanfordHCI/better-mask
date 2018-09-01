class AddTokenToReferrals < ActiveRecord::Migration[5.2]
  def change
    add_column :referrals, :token, :string, null: false
    add_index :referrals, :token, unique: true
  end
end
