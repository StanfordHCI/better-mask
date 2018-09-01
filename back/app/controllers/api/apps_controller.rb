class Api::AppsController < Api::BaseController
  def index
    apps = App.all
    render json: apps, status: :ok
  end
end
