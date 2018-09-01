# Make sure some deployment-specific environment variables are set
# and raise an error on startup if they're not. This prevents runtime
# errors due to improper configuration.
#
# Add these values to config/application.yml

# We need to replace key validation and get rid of our dependency on Figaro:
#
# Exemple pseudo-code-ish implementation:
# required_keys = ["FACEBOOK_APP_ID", "FACEBOOK_APP_SECRET", "..."]
# required_keys.each do |key|
#   raise "Key misssing" unless ENV.has_key key
# end

Figaro.require_keys(
  "FACEBOOK_APP_ID",
  "FACEBOOK_APP_SECRET",
  "ALLOWED_ORIGINS"
)
