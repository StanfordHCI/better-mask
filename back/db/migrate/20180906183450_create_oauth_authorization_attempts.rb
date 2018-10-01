class CreateOauthAuthorizationAttempts < ActiveRecord::Migration[5.2]
  def change
    create_table :oauth_authorization_attempts do |t|
      t.references :user, foreign_key: true, null: true

      t.timestamps
    end
  end
end
