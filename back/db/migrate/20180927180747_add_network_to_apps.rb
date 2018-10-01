class AddNetworkToApps < ActiveRecord::Migration[5.2]
  def change
    add_column :apps, :network, :string
  end
end
