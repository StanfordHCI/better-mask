# == Schema Information
#
# Table name: vaults
#
#  id             :bigint(8)        not null, primary key
#  password       :string(255)      not null
#  seed_words     :string(255)      not null
#  wallet_address :string(255)
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  user_id        :bigint(8)        not null
#
# Indexes
#
#  index_vaults_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#

class Vault < ApplicationRecord
  belongs_to :user

  after_create :push_transactions

  #
  # Perform the blockchain related operations that we couldn't perform earlier
  # because the user did not have a vault, therefore they did not have wallet address
  #
  def push_transactions
    AirdropMint.push_transactions_for_pending_rewards(user)
  end
end
