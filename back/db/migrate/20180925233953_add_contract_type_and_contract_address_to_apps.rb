class AddContractTypeAndContractAddressToApps < ActiveRecord::Migration[5.2]
  def change
    add_column :apps, :contract_type, :string
    add_column :apps, :contract_address, :string
  end
end
