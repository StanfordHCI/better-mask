class AddWalletAddressToVaults < ActiveRecord::Migration[5.2]
  def change
    add_column :vaults, :wallet_address, :string
  end
end
