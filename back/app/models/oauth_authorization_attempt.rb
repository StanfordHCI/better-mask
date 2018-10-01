# == Schema Information
#
# Table name: oauth_authorization_attempts
#
#  id         :bigint(8)        not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :bigint(8)
#
# Indexes
#
#  index_oauth_authorization_attempts_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#

class OauthAuthorizationAttempt < ApplicationRecord
  belongs_to :user, required: false
end
