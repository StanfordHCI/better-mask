class RenameApplicationsToApps < ActiveRecord::Migration[5.2]
  def change
    rename_table :applications, :apps
  end
end
