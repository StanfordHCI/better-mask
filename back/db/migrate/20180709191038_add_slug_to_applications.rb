class AddSlugToApplications < ActiveRecord::Migration[5.2]
  def change
    add_column :applications, :slug, :string, null: false
  end
end
