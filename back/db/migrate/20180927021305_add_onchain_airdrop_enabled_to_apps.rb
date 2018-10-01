class AddOnchainAirdropEnabledToApps < ActiveRecord::Migration[5.2]
  def change
    add_column :apps, :onchain_airdrop_enabled, :boolean, null: false, default: false
  end
end
