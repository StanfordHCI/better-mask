module ReferralsHelper
  def get_referral_link(user, app)
    referral_link_url(referral_code: user.referral_code, app_slug: app.slug)
  end
end
