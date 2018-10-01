class HomeController < ApplicationController
  def index
  end

  def extension_install_hook
  end

  def download_bettermask
  end

  def coming_soon
    case params['platform']
      when 'android'
        platform = 'Android'
      when 'ios'
        platform = 'iOS'
      else
        platform = 'mobile'
    end

    render template: 'home/coming_soon', locals: {platform: platform}
  end

  def detect_web3
    response.headers['X-FRAME-OPTIONS'] = 'ALLOWALL'
  end
end
