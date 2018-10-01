#
# Extension prepended to the authorizations controller:
#
module AuthorizationsControllerExtension
  def redirect_or_render(auth)
    orig_redirect_uri = auth.redirect_uri

    if orig_redirect_uri.is_a? Hash
      orig_redirect_uri = url_for orig_redirect_uri
    end

    # Encode the return_to param to be URL compatible:
    escaped_redirect_uri = URI.escape(orig_redirect_uri, Regexp.new("[^#{URI::PATTERN::UNRESERVED}]"))
    # TODO referrals_xxx_path
    redirect_uri = "/referrals/post_auth_hook?redirect_uri=#{escaped_redirect_uri}"

    if auth.redirectable?
      if Doorkeeper.configuration.api_only
        render(
          json: {status: :redirect, redirect_uri: redirect_uri},
          status: auth.status
        )
      else
        redirect_to redirect_uri
      end
    else
      render json: auth.body, status: auth.status
    end
  end
end

Doorkeeper::AuthorizationsController.class_eval do
  prepend AuthorizationsControllerExtension
end
