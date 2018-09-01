class RemoveReferredUserFromReferrals < ActiveRecord::Migration[5.2]
  def change
    remove_column :referrals, :referred_user_id
  end
end
