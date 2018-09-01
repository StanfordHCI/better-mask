class RenameReferralsColumnApplicationIdToAppId < ActiveRecord::Migration[5.2]
  def change
    remove_foreign_key :referrals, column: :application_id
    rename_column :referrals, :application_id, :app_id
    add_foreign_key :referrals, :apps
  end
end
