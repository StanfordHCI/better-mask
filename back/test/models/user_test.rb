# == Schema Information
#
# Table name: users
#
#  id            :bigint(8)        not null, primary key
#  admin         :boolean          default(FALSE), not null
#  name          :string(255)
#  referral_code :string(255)      not null
#  token         :string(255)
#  uid           :string(255)
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
# Indexes
#
#  index_users_on_referral_code  (referral_code) UNIQUE
#

require 'test_helper'

class UserTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
