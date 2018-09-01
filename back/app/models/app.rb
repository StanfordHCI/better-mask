# == Schema Information
#
# Table name: apps
#
#  id                    :bigint(8)        not null, primary key
#  api_key               :string(255)
#  minting_quota         :integer          default(0), not null
#  name                  :string(255)      not null
#  referral_landing_path :string(255)
#  slug                  :string(255)      not null
#  url                   :string(255)
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  oauth_application_id  :bigint(8)
#
# Indexes
#
#  index_apps_on_oauth_application_id  (oauth_application_id)
#
# Foreign Keys
#
#  fk_rails_...  (oauth_application_id => oauth_applications.id)
#

class App < ApplicationRecord
  belongs_to :oauth_application, class_name: 'Doorkeeper::Application'

  def self.dti_app
    find_by(slug: 'dti')
  end

  def is_dti_airdrop?
    # HACK for DTI airdrop
    App.dti_app.present? && self.id == App.dti_app.id
  end

  def reward_quota_exceeded?
    false # TODO sum rewards amounts and check < quota
  end

  def referral_landing_url
    URI::join(url, referral_landing_path || '')
  end
end
