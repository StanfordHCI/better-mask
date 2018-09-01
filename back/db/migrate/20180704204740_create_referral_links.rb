class CreateReferralLinks < ActiveRecord::Migration[5.2]
  def change
    create_table :referral_links do |t|
      t.string :code, null: false
      t.references :user, foreign_key: true, null: false
      t.references :application, foreign_key: true, null: false

      t.timestamps
    end
  end
end
