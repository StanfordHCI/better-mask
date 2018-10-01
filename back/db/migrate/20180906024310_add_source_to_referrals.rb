class AddSourceToReferrals < ActiveRecord::Migration[5.2]
  def change
    add_column :referrals, :source, :string
  end
end
