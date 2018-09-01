class Api::BaseController < ApplicationController
  skip_before_action :verify_authenticity_token
  skip_before_action :authenticate_user
  before_action :doorkeeper_authorize!

  def current_resource_owner
    User.find(doorkeeper_token.resource_owner_id)
  end

  def current_application
    doorkeeper_token.application if doorkeeper_token
  end

  def current_social_app
    @current_social_app ||= App.find_by({oauth_application_id: current_application.id}) if current_application
  end
end
