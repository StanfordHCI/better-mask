class AddOauthApplicationToApps < ActiveRecord::Migration[5.2]
  def change
    add_reference :apps, :oauth_application, foreign_key: true
  end
end
