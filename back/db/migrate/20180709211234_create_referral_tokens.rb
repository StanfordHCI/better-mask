class CreateReferralTokens < ActiveRecord::Migration[5.2]
  def change
    create_table :referral_tokens do |t|
      t.string :token, null: false

      t.timestamps
    end
  end
end
