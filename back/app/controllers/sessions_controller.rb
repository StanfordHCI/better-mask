class SessionsController < ApplicationController
  include ActionController::MimeResponds

  skip_before_action :authenticate_user, only: [:create]

  # Handle the oAuth callback when signing in with an external provider (we
  # currently only support facebook)
  #
  # TODO add unit tests all around this thing
  def create
    if request.env['omniauth.auth']
      user = User.authenticate_with_omniauth(request.env['omniauth.auth'])

      session[:user_id] = user.id

      if request.env['omniauth.origin']
        return redirect_to request.env['omniauth.origin']
      end

      # TODO default value for return_to? => our front-end
      # TODO was the return_to parameter even needed in the first place?
      respond_to do |format|
        format.json do
          render json: {message: 'Successfully authenticated', user: user}, status: 200
        end

        format.html do
          return redirect_to root_url
        end
      end
    end

    respond_error 'Auth failed'
  end

  def destroy
    reset_session
    redirect_to root_url
  end

  def me
    render json: current_user
  end

  def extension_oauth_callback
  end

  private

  def respond_error(message, status = 400)
    respond_to do |format|
      format.json do
        render json: {message: message}, status: status
      end

      format.html do
        return render body: "Error: #{message}", status: status
      end
    end
  end
end
