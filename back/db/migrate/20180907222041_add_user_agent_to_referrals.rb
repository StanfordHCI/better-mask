class AddUserAgentToReferrals < ActiveRecord::Migration[5.2]
  def change
    add_column :referrals, :user_agent, :string
  end
end
