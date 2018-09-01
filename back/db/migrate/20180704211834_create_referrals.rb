class CreateReferrals < ActiveRecord::Migration[5.2]
  def change
    create_table :referrals do |t|
      t.references :referral_link, foreign_key: true, null: false
      t.references :referred_user, references: :user, null: true

      t.timestamps
    end

    add_foreign_key :referrals, :users, column: :referred_user_id
  end
end
