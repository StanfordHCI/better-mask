class ReferralTokensController < ApplicationController
  def claim
    # XXX extract the referral token claiming logic as a method on the Referral model (e.g referra.claim(user))
    token = ReferralToken.find_by! token: params[:token]

    return render json: {error: 'This referral token is already claimed'}, status: 400 if token.user.present? && token.user.id != current_user.id

    if token.update user_id: current_user.id
      # Now that we know which user this token is associated with, we can get rid of all instances where the user
      # clicked on their own referral link:
      Referral.delete_self_referrals(current_user)

      # ETHSF_HACK
      # All apps currently have the "convert on sign-in" behavior
      # We could use a flag on the App model instead, e.g convert_on_sign_in
      # We should also instantly trigger the referrals converting mechanism for already existing users
      Referral.on_signin_convert(current_user)

      head :no_content
    else
      return render json: { errors: token.errors }, status: 400
    end
  rescue ActiveRecord::RecordNotFound => e
    render json: { error: e.to_s }, status: :not_found
  end
end
