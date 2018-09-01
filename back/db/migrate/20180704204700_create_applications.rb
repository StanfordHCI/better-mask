class CreateApplications < ActiveRecord::Migration[5.2]
  def change
    create_table :applications do |t|
      t.string :name, null: false
      t.string :url

      t.timestamps
    end
  end
end
