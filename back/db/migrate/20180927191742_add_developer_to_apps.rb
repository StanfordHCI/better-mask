class AddDeveloperToApps < ActiveRecord::Migration[5.2]
  def change
    add_column :apps, :developer_id, :bigint
    add_index :apps, :developer_id

    id = User.first.id
    App.update_all(developer_id: id)

    add_foreign_key :apps, :users, column: :developer_id
    change_column :apps, :developer_id, :bigint, null: false
  end
end
