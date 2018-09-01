# == Schema Information
#
# Table name: referrals
#
#  id                :bigint(8)        not null, primary key
#  converted         :boolean          default(FALSE), not null
#  http_referrer     :string(255)
#  ip_address        :string(255)
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  app_id            :bigint(8)
#  referral_token_id :bigint(8)
#  referring_user_id :bigint(8)
#
# Indexes
#
#  index_referrals_on_app_id             (app_id)
#  index_referrals_on_referral_token_id  (referral_token_id)
#  index_referrals_on_referring_user_id  (referring_user_id)
#
# Foreign Keys
#
#  fk_rails_...  (app_id => apps.id)
#  fk_rails_...  (referral_token_id => referral_tokens.id)
#  fk_rails_...  (referring_user_id => users.id)
#

class Referral < ApplicationRecord
  belongs_to :app
  belongs_to :referring_user, class_name: 'User', optional: false
  belongs_to :referral_token, optional: false

  before_validation :generate_token

  def referring_user_name
    referring_user.name
  end

  def referred_user
    referral_token.user
  end

  def token
    referral_token.token
  end

  def self.create_or_touch_pending(params, ip: nil, referred_user: nil)
    referring_user = User.find_by!(referral_code: params[:referral_code])
    app = App.find_by!(slug: params[:application_slug])

    referral = nil

    if params[:referral_token]
      # Try to link the pending referral with this referral token:
      token = ReferralToken.find_by(token: params[:referral_token])
      referral = create_or_touch_for_existing_token(token, app, referring_user, ip: ip, http_referrer: params[:http_referrer]) if token.present?
    else
      # Create a new referral (it will generate a new referral token):
      referral = Referral.new(referring_user: referring_user, app: app, http_referrer: params[:http_referrer], ip_address: ip)
      referral.save!
    end

    # If the user is authenticated, try to link the referral's token with this user:
    if referred_user.present?
      token = referral.referral_token || ReferralToken.new(token: SecureRandom.hex(48))
      token.user = referred_user
      token.save
    end

    referral
  end

  def self.record_conversion(app, user)
    ref = joins(:referral_token)
            .where(referral_tokens: {user: user}, app: app)
            .order(created_at: :desc)

    # We filter the list to make sure we don't mark self-referrals as converted. However, if the referral
    # token claiming logic worked correctly, there should be no self referral in this list
    # see https://trello.com/c/FuLmYri3
    # XXX add a logger to record the fact that the filtering logic in the upstream flow
    # hasn't worked as expected?
    ref = ref.select {|r| r.referred_user.id != r.referring_user.id}

    return unless ref.first.present?
    converted_referral = ref.first

    # We only update the latest referral, because we assume that it's the one
    # that triggered the conversion.
    converted_referral.update(converted: true)

    if app.is_dti_airdrop?
      AirdropMint.reward_converted_referral(converted_referral)
    end
  end

  #
  # Delete all referrals where the user passed as argument to this method has referred themselves
  # (most likely by creating an anonymous referral token in an incognito session and
  # claiming it afterwards by signing in in this incognito session)
  #
  def self.delete_self_referrals(user)
    ref = joins(:referral_token).where(referring_user: user, referral_tokens: {user: user})
    # XXX performance overhead of destroy_all vs delete_all (are there lifecycle hooks that need to be called?)
    ref.destroy_all
  end

  private

  def generate_token
    # If the token was previously set, don't overwrite it:
    return if self.referral_token.present?
    token = ReferralToken.create(token: SecureRandom.hex(48))
    self.referral_token = token
  end

  def self.create_or_touch_for_existing_token(token, app, referring_user, params = {})
    # Try finding a referral for this {referral_token, app, referring_user} tuple:
    existing_referral = Referral.find_by(referring_user: referring_user, app: app, referral_token: token)

    if existing_referral.present?
      # Refresh updated_at for the referral and the token:
      existing_referral.touch
      token.touch
      return existing_referral
    end

    # Otherwise, create a new one:
    new_referral = Referral.new(referring_user: referring_user, app: app, http_referrer: params[:http_referrer], ip_address: params[:ip])
    new_referral.referral_token = token

    return new_referral
  end
end
