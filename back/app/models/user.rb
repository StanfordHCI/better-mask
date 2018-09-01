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

class User < ApplicationRecord
  has_many :referral_links

  def self.authenticate_with_omniauth(auth)
    user = find_or_initialize_by(uid: auth['uid'])

    user.name = auth['info']['name']

    user.generate_token
    user.generate_referral_code

    user.save!
    user
  end

  def generate_token
    self.token = SecureRandom.base64(180)
  end

  def generate_referral_code
    # Get rid of all diacritics, replacing all letters with their non-accented variants
    transliterated = I18n.transliterate(self.name)
    self.referral_code = transliterated.downcase.strip.gsub(' ', '').gsub(/[^\w-]/, '')
  end

  def as_json(options = {})
    options[:except] ||= [:token, :uid]
    super
  end

  def joined_through_referral(social_app)
    r = Referral.includes(:referral_token)
          .joins(:referral_token)
          .joins(referral_token: :user)
          .where(referral_tokens: {user: self}, app: social_app)

    r.length > 0
  end

  def wallet_address
    raise "not yet implemented: user - vaults association"
    # TODO vaults: has_one or has_many ? how to make it optional ?
    # how to handle the case where the user has no vault
    return nil unless vaults.present && !vaults.empty
    vaults.first.wallet_address
  end
end
