class CreateVaults < ActiveRecord::Migration[5.2]
  def change
    create_table :vaults do |t|
      t.string :password, null: false
      t.string :seed_words, null: false
      t.references :user, foreign_key: true, null: false

      t.timestamps
    end
  end
end
