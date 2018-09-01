class Api::CoinRewardsController < Api::BaseController
  def mint
    # When we have client credentials grant for apps:
    # - let the app provide the user deserving the reward as params[:user_id]
    # - allow linking a coin reward with a referral for convenience, but don't require it
    #   (removes the need for the app to keep track of referrals whose award has been minted)

    referral = Referral.find(params[:referral_id])

    return render(
      json: {message: 'Cannot mint a coin reward for a self-referral'}, status: :bad_request
    ) if referral.present? && referral.referred_user.present? && referral.referred_user.id === current_resource_owner.id

    tr = CoinReward.new(
      app: current_social_app,
      amount: params[:amount],
      referral_id: referral.id,
      user: referral.referring_user
    )

    if tr.save
      render json: tr, status: :created
    else
      render json: {errors: tr.errors}, status: :bad_request
    end
  rescue ActiveRecord::RecordNotFound => e
    render json: {error: e.to_s}, status: :not_found
  end
end
