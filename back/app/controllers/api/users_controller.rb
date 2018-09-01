class Api::UsersController < Api::BaseController
  include ReferralsHelper

  def me
    render json: {
      profile: current_resource_owner,
      joined_through_referral: current_resource_owner.joined_through_referral(current_social_app),
    }, status: :ok
  end

  def referral_link
    app = App.find_by({oauth_application_id: current_application.id})
    return render json: {error: 'Current oAuth application isn\'t linked with a social app.'}, status: 400 unless app.present?

    reflink = get_referral_link(current_resource_owner, app)

    render json: {referral_link: reflink}
  end
end
