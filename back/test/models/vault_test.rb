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

require 'test_helper'

class VaultTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
