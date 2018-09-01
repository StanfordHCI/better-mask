class ReferralTokensController < ApplicationController
  def claim
    # XXX extract the referral token claiming logic as a method on the Referral model (e.g referra.claim(user))
    token = ReferralToken.find_by! token: params[:token]

    return render json: {error: 'This referral token is already claimed'}, status: 400 if token.user.present? && token.user.id != current_user.id

    if token.update user_id: current_user.id
      Referral.delete_self_referrals(current_user)

      # HACK: DTI airdrop converts referrals when the referred user signs in
      # We could use a flag on the App model instead, e.g convert_on_sign_in
      dti_airdrop_app = App.dti_app
      Referral.record_conversion(current_user, dti_airdrop_app) if dti_airdrop_app.present?
      # ----------------------------------------------------------------


      head :no_content
    else
      return render json: { errors: token.errors }, status: 400
    end
  rescue ActiveRecord::RecordNotFound => e
    render json: { error: e.to_s }, status: :not_found
  end
end
