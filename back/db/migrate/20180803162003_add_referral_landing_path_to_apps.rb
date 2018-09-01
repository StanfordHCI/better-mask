class AddReferralLandingPathToApps < ActiveRecord::Migration[5.2]
  def change
    add_column :apps, :referral_landing_path, :string
  end
end
