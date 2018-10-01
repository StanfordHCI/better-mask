# == Schema Information
#
# Table name: airdrop_mints
#
#  id          :bigint(8)        not null, primary key
#  minted      :boolean          default(FALSE), not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  app_id      :bigint(8)
#  referral_id :bigint(8)
#  user_id     :bigint(8)
#
# Indexes
#
#  index_airdrop_mints_on_app_id       (app_id)
#  index_airdrop_mints_on_referral_id  (referral_id)
#  index_airdrop_mints_on_user_id      (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (app_id => apps.id)
#  fk_rails_...  (referral_id => referrals.id)
#  fk_rails_...  (user_id => users.id)
#

class AirdropMint < ApplicationRecord
  belongs_to :user
  belongs_to :app
  belongs_to :referral

  #
  # Trigger the process of pushing on the blockchain the rewards that have been
  # created but not yet pushed
  #
  def self.push_transactions_for_pending_rewards(user)
    pending_rewards = where(minted: false, user: user)
    pending_rewards.each {|r| r.mint}
  end

  def self.deliver_for_referral(referral)
    app = referral.app
    referred_user = referral.referred_user

    # Don't create if this reward already exists:
    referred_user_reward = find_or_create_by(app: app, referral: referral, user: referred_user)
    referred_user_reward.mint

    referring_user = referral.referring_user

    unless referring_user == app.developer
      referring_user_reward = find_or_create_by(app: app, referral: referral, user: referring_user)
      referring_user_reward.mint
    end
  end

  #
  # Push the reward to the blockchain
  #
  # TODO rename this (transfer?)
  #
  def mint
    # Don't mint twice:
    return if self.minted

    referral = self.referral
    app = referral.app

    # Don't mint for apps that don't support on-chain interactions:
    return unless app.onchain_airdrop_enabled

    referred_user = referral.referred_user
    wallet_address = referred_user.wallet_address

    # Don't try to start minting if the user doesn't have a wallet yet.
    # The vault creation process should start minting all the pending rewards
    # when the user generates their vault:
    return unless wallet_address.present?

    contract_address = app.contract_address

    if app.is_erc721?
      contract = ERC721Contract.new(app.network, contract_address)
      token_id = contract.next_available_token_id
      raise "No ERC721 tokens left to airdrop. Unable to continue." unless token_id.present?
      contract.transfer(wallet_address, token_id)

      self.update(minted: true)
    elsif app.is_erc20?
      contract = ERC20Contract.new(app.network, contract_address)
      remaining_balance = contract.balance_available_for_airdrop
      raise "No ERC20 tokens left to airdrop. Unable to continue." unless remaining_balance > 1
      # XXX Give 1 coin? app.airdrop_amount?
      contract.transfer(wallet_address, 1)

      self.update(minted: true)
    else
      raise "Arbitrary contract type not yet implemented - must use ERC20 or ERC721."
    end
  end

  def self.user_balance(user, app)
    coins = where(user: user, app: app)
    coins.length
  end
end
