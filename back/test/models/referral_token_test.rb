# == Schema Information
#
# Table name: referral_tokens
#
#  id         :bigint(8)        not null, primary key
#  token      :string(255)      not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :bigint(8)
#
# Indexes
#
#  index_referral_tokens_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#

require 'test_helper'

class ReferralTokenTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
