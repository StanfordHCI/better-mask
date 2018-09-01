class AddApiKeyToApps < ActiveRecord::Migration[5.2]
  def change
    add_column :apps, :api_key, :string
  end
end
