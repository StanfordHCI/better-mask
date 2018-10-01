class ReferralsController < ApplicationController
  #
  # Referral link interstitial page
  # Loads a page including a tiny script that's in charge of creating the pending referral and saving it on the
  # user's browser
  #
  def show
    session[:referral_link] = request.original_url
    app = App.find_by(slug: params[:app_slug])
    referrer = User.find_by(referral_code: params[:referral_code])

    redirect_url = app.referral_landing_url

    # TODO what to do if referrer.nil? It essentially depends whether the app only allows "invited users" or allows public signup

    locals = {app: app, referrer: referrer, redirect_url: redirect_url, source_param: params[:source]}
    render template: 'referrals/show', locals: locals
  end

  #
  # Hook used after successful oAuth authorization to claim the referral token stored in the browser
  # Happens just before redirecting to the app
  # (see initializers/doorkeeper_redirect.rb)
  #
  def post_auth_hook
    # XXX use the same logic as the one responsible for CORS headers in config/application.rb to
    # decide whether or not to send this header ?
    # and use "ALLOW-FROM #{domain}"
    response.headers['X-FRAME-OPTIONS'] = 'ALLOWALL'
  end

  #
  # Create a pending referral
  #
  def create
    tracking_params = {
      ip_address: request.remote_ip,
      user_agent: request.user_agent,
    }

    create_params = referral_params.merge(tracking_params)
    referral = Referral.create_or_touch_pending(
      current_user,
      params[:referral_code],
      params[:application_slug],
      create_params
    )

    return render json: referral, status: :ok, include: [:app], methods: [:referring_user_name, :token, :app]
  rescue ActiveRecord::RecordNotFound => e
    return render json: { error: e.to_s }, status: :not_found
  end

  private

  def referral_params
    params.permit(:http_referrer, :referral_token, :source)
  end
end
