class CreateAirdropMints < ActiveRecord::Migration[5.2]
  def change
    create_table :airdrop_mints do |t|
      t.references :user, foreign_key: true
      t.references :app, foreign_key: true
      t.boolean :minted

      t.timestamps
    end
  end
end
