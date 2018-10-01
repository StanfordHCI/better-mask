require 'test_helper'

class Api::AppsControllerTest < ActionDispatch::IntegrationTest
  test "Index" do
    user = User.first
    oauth_user user
    get "/api/apps"
    assert_response :ok

    res = JSON.parse response.body

    # Deciding to return something else than an array of objects would be a huge breaking change:
    assert_equal res.class.to_s, 'Array'
  end
end
