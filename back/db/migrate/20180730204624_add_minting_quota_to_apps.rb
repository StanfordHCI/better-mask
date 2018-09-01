class AddMintingQuotaToApps < ActiveRecord::Migration[5.2]
  def change
    add_column :apps, :minting_quota, :integer, null: false, default: 0
  end
end
