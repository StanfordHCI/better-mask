class Api::UsersController < Api::BaseController
  include ReferralsHelper

  def me
    render json: {
      profile: current_resource_owner,
      joined_through_referral: current_resource_owner.joined_through_referral(current_social_app),
      balances: {
        # DTI_HACK: only supports DTI for now:
        bct: AirdropMint.user_balance(current_resource_owner, App.dti_app)
      }
    }, status: :ok
  end

  def referral_links
    apps = App.all

    res = {}
    apps.each { |a| res[a.slug] = get_referral_link(current_resource_owner, a) }

    render json: res
  end

  def offers
    # DTI_HACK
    img_src = ActionController::Base.helpers.image_url('offers/bct.png')
    render json: {
      offers: [
        {
          name: 'BCT promotion',
          description: 'Earn 1 BCT for each friend who joins the BCT network. They also get 1 free BCT',
          appSlug: 'bct',
          imgSrc: img_src,
          referral_blurb: 'A new cryptocurrency! Earn BCT for free!'
        }
      ]
    }
  end
end
