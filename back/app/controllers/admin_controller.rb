class AdminController < ApplicationController
  before_action :check_admin

  def index
    # select first_name, last_name, user_agent, source from referrals join referral_tokens on referrals.`referral_token_id` =  referral_tokens.id left join users on user_id = users.id;
    referrals = Referral.includes(:referral_token)
                  .joins(:referral_token)
                  .left_joins(referral_token: :user)

    users = User.all

    render locals: {referrals: referrals, users: users}
  end

  private

  def check_admin
    return redirect_to('/404') unless current_user.present? && current_user.admin
  end
end
