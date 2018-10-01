# == Schema Information
#
# Table name: users
#
#  id            :bigint(8)        not null, primary key
#  admin         :boolean          default(FALSE), not null
#  email         :string(255)
#  first_name    :string(255)
#  last_name     :string(255)
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
    user.first_name = auth['info']['first_name']
    user.last_name = auth['info']['last_name']

    user.generate_token
    user.generate_new_referral_code unless user.referral_code.present?

    user.save!
    user
  end

  def generate_token
    self.token = SecureRandom.base64(180)
  end

  def generate_new_referral_code
    length = 6
    referral_code = SecureRandom.alphanumeric(length)

    # 10 tries to generate a unique
    i = 0
    while i < 10
      if User.find_by(referral_code: referral_code).present?
        referral_code = SecureRandom.alphanumeric(length)
        i+=1
      else
        # Breaks out of the whole method:
        self.referral_code = referral_code
        return
      end
    end

    raise 'Could not generate unique referral code'
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
    # TODO vaults-user association: optional has_one or optional has_many?
    vault = Vault.find_by(user: self)
    return nil unless vault.present?
    vault.wallet_address
  end
end
