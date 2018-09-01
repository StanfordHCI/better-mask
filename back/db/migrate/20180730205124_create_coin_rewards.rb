class CreateCoinRewards < ActiveRecord::Migration[5.2]
  def change
    create_table :coin_rewards do |t|
      t.references :user, foreign_key: true
      t.integer :amount, null: false
      t.references :app, foreign_key: true
      t.references :referral, foreign_key: true, null: false

      t.timestamps
    end
  end
end
