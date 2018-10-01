# == Schema Information
#
# Table name: apps
#
#  id                      :bigint(8)        not null, primary key
#  api_key                 :string(255)
#  contract_address        :string(255)
#  contract_type           :string(255)
#  minting_quota           :integer          default(0), not null
#  name                    :string(255)      not null
#  network                 :string(255)
#  onchain_airdrop_enabled :boolean          default(FALSE), not null
#  referral_landing_path   :string(255)
#  slug                    :string(255)      not null
#  url                     :string(255)
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  developer_id            :bigint(8)        not null
#  oauth_application_id    :bigint(8)
#
# Indexes
#
#  index_apps_on_developer_id          (developer_id)
#  index_apps_on_oauth_application_id  (oauth_application_id)
#
# Foreign Keys
#
#  fk_rails_...  (developer_id => users.id)
#  fk_rails_...  (oauth_application_id => oauth_applications.id)
#

class App < ApplicationRecord
  belongs_to :oauth_application, class_name: 'Doorkeeper::Application', required: false
  belongs_to :developer, class_name: 'User', required: true

  validates_inclusion_of(
    :network,
    :in => [
      ContractInteraction::NETWORK_RINKEBY,
      ContractInteraction::NETWORK_MAINNET,
      ContractInteraction::NETWORK_BE,
    ],
    :allow_nil => false
  )

  def is_erc20?
    contract_type.present? && contract_type.downcase === 'erc20'
  end

  def is_erc721?
    contract_type.present? && contract_type.downcase === 'erc721'
  end

  # DTI_HACK
  def self.dti_app
    find_by(slug: 'bct')
  end

  def reward_quota_exceeded?
    false # TODO sum rewards amounts and check < quota
  end

  def referral_landing_url
    URI::join(url, referral_landing_path || '')
  end
end
