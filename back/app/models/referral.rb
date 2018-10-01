# == Schema Information
#
# Table name: referrals
#
#  id                :bigint(8)        not null, primary key
#  converted         :boolean          default(FALSE), not null
#  http_referrer     :string(255)
#  ip_address        :string(255)
#  source            :string(255)
#  user_agent        :string(255)
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

  #
  # Create a pending referral (i.e not converted) or touch it to refresh its updated_at field:
  #
  # params hash: {:referral_code, :application_slug, :http_referrer, :referral_token, :source, :ip}
  #
  def self.create_or_touch_pending(referred_user, referral_code, app_slug, params)
    referring_user = User.find_by!(referral_code: referral_code)
    app = App.find_by!(slug: app_slug)

    referral = nil

    # 1. Create the referral, either associating it with an existing referral token
    #    or generating a new referral token if needed
    if params[:referral_token]
      token_string = params[:referral_token]

      # Remove the referral token from the params hash (it was a string - we do not want it to
      # override the instance of the ReferralToken model we have just loaded when the
      # params hash gets passed to #create or #update)
      params.delete(:referral_token)

      # Try to link the pending referral with this referral token:
      token = ReferralToken.find_by(token: token_string)
      # TODO what if token is nil? (e.g params[:referral_token] isn't referring to an existing referral token)
      referral = create_or_touch_for_existing_token(token, app, referring_user, params) if token.present?
    else
      # Create a new referral (it will generate it own new referral token):
      referral = Referral.new(params.merge(referring_user: referring_user, app: app))
      referral.save!
    end

    # 2. If the user is authenticated, try to link the referral's referral_token with this user:
    if referred_user.present?
      token = referral.referral_token || ReferralToken.new(token: SecureRandom.hex(48))

      # Don't ovveride which user has claimed this token
      # XXX implement ReferralToken#claim, call it here and in ReferralTokensController#claim
      #
      # XXX return 401 code if the token already belongs to someone else
      token.user = referred_user unless token.user.present?
      token.save
    end

    referral
  end

  def self.record_conversion(user, app)
    ref = joins(:referral_token)
            .where(referral_tokens: {user: user}, app: app)
            .order(created_at: :desc)

    # We filter the list to make sure we don't mark self-referrals as converted. However, if the referral
    # token claiming logic worked correctly, there should be no self-referral in this list
    # see https://trello.com/c/FuLmYri3
    # XXX add a logger to record the fact that the filtering logic in the upstream flow
    # hasn't worked as expected?
    ref = ref.select {|r| r.referred_user.id != r.referring_user.id}

    # Stop here if there is already a converted referral recorded for this user on this app:
    converted_referrals = ref.select {|r| r.converted}

    return if converted_referrals.present?

    # Stop here if there's no referral to convert for this user and this app:
    # XXX Should we really do this ?
    return unless ref.first.present?

    converted_referral = ref.first

    # We only update the latest referral, because we assume that it's the one
    # that triggered the conversion.
    converted_referral.update(converted: true)

    # Mint the rewards:
    AirdropMint.deliver_for_referral(converted_referral)
  end

  #
  # Record conversion for all referrals related to apps whose only condition for
  # converting is "the user signed in"
  #
  def self.on_signin_convert(user)
    # ETHSF_HACK: we may want to do this:
    # App.where(convert_on_signin: true).each {|app| Referral.record_conversion(user, app)}
    # But we're currently working in a context where *all* apps are converting on user sign in:
    App.all.each {|app| self.record_conversion(user, app)}
  end

  #
  # Delete all referrals where the user passed as argument to this method has referred themselves
  # (most likely by creating an anonymous referral token in an incognito session and
  # claiming it afterwards by signing in in this incognito session)
  #
  def self.delete_self_referrals(user)
    ref = joins(:referral_token).where(referring_user: user, referral_tokens: {user: user})
    # XXX performance overhead of destroy_all vs delete_all? (are there lifecycle hooks that need to be called?)
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

    new_params = params.merge(referring_user: referring_user, app: app)

    # Otherwise, create a new one:
    new_referral = Referral.new(new_params)
    new_referral.referral_token = token

    new_referral.save!

    return new_referral
  end
end
