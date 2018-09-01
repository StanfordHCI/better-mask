class ApplicationController < ActionController::Base
  attr_reader :current_user
  before_action :authenticate_user

  def authenticate_user
    @current_user = User.find(session[:user_id]) if session[:user_id].present?
  end
end
