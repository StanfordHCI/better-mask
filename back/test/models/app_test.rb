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

require 'test_helper'

class AppTest < ActiveSupport::TestCase
  test "network name validation" do
    app1 = App.new(name: 'Test App 1', slug: 'test1', network: 'invalid_network_id', developer: User.first)
    saved = app1.save
    assert !saved, 'App 1 should not have been saved'
    assert_not_nil app1.errors.messages[:network]
    app2 = App.create(name: 'Test app 2', slug: 'test2', network: ContractInteraction::NETWORK_RINKEBY, developer: User.first)
    assert app2.save, 'App 2 should have been saved'
  end
end
