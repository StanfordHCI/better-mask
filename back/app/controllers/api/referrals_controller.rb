class Api::ReferralsController < Api::BaseController
  # Returns a list of the referrals made by the current user for the current app:
  def index
    user = current_resource_owner

    # DTI_HACK
    app = App.dti_app

    # TODO filter by current app
    # @see UsersController#referral_link
    converted_refs = Referral.includes(:referral_token)
                       .joins(:referral_token)
                       .joins(referral_token: :user)
                       .where(referring_user: user, app: app, converted: true)

    pending_referrals_count = Referral
                                .where(referring_user: user, converted: false)
                                .count()

    all_referrals_count = Referral
                                .where(referring_user: user)
                                .count()

    invited_users = converted_refs.map do |ref|
      {
        user_id: ref.referral_token.user.id,
        name: ref.referral_token.user.name,
        profile_picture: 'qsdfqsdf',
      }
    end

    invited_users.uniq! { |u| u[:user_id] }

    render(
      json: {
        bct: {
          invited_users: invited_users,
          pending_referrals_count: pending_referrals_count,
          total: all_referrals_count,
          earnings: invited_users.length,
          ticker: 'BCT'
        }
      },
      status: :ok,
      methods: [:referred_user]
    )
  end

  def convert
    app = current_social_app
    user = current_resource_owner
    Referral.record_conversion(user, app)

    head :no_content
  end
end
