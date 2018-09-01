class AddConvertedToReferrals < ActiveRecord::Migration[5.2]
  def change
    add_column :referrals, :converted, :boolean, null: false, default: false
  end
end
