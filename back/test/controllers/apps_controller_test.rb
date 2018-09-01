require 'test_helper'

class AppsControllerTest < ActionDispatch::IntegrationTest
  test "Index" do
    user = User.first
    authenticated_get "/apps", user: user
    assert_response :ok

    res = JSON.parse response.body

    # Deciding to return something else than an array of objects would be a huge breaking change:
    assert_equal res.class.to_s, 'Array'
  end
end
