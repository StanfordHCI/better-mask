class UpdateReferralsDataModel < ActiveRecord::Migration[5.2]
  def change
    add_reference :referrals, :referring_user
    add_reference :referrals, :application, foreign_key: true

    add_column :referrals, :http_referrer, :string
    add_column :referrals, :ip_address, :string

    # Add last, makes the migration easier to revert manually when it fails
    add_foreign_key :referrals, :users, column: :referring_user_id
  end
end
