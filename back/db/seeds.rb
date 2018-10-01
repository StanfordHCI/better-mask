# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).

puts "Seeding database"

# We don't have a Rails model on top of the oauth_applications table. Just run it as
# a plain old sql query:
ActiveRecord::Base.connection.execute("
  INSERT INTO `oauth_applications` (`id`, `name`, `uid`, `secret`, `redirect_uri`, `scopes`, `confidential`, `created_at`, `updated_at`) VALUES
    (1,	'Tori fusion game',	'a4939c167a6f81b86afa8bc3501eae36298131e61a0dcdc640051aaffddd6a1c',	'ac8e33bc490175c4ad8630bf365d4a5a4432a693e04193760057f1338ceb9052',	'http://localhost:3003/dummy.html',	'',	0,	NOW(), NOW()),
    (2,	'Bettermask Chrome Extension',	'f9ddfe17ea237f5ad1a953fef2cd77b91f477eee46cfd150b928100c717a3496',	'060985140d9de715067faa73f0091ad9e8cc117619165a9ac0465fb00b2c97fb',	'chrome-extension://mbdipoelkahogeanbpheglloejejgomo/auth-callback.html\r\nhttp://localhost:8080/extension-oauth-callback',	'',	0,	NOW(), NOW());
    (3,	'Bettermask Mobile App',	'463c3e7503f2da201e37ab43b4d219d5d84f4e29a3d736a1fe8606441e29d4b7',	'c422a69349b761c269bf0764c310803c953b7a5f6614dcba3fdd291c7098351d',	'exp://171.64.70.193:19000/--/auth-callback\r\nurn:ietf:wg:oauth:2.0:oob',	'',	0,	NOW(), NOW());
")

App.create!(
  id: 1,
  name: 'Tori.Land',
  slug: 'toris',
  url: 'http://localhost:3003',
  oauth_application_id: 1,
  referral_landing_path: '/r'
)

App.create!(
  id: 2,
  name: 'BCT Airdrop',
  slug: 'bct',
  url: 'https://chrome.google.com/webstore/detail/example',
  oauth_application_id: nil,
  referral_landing_path: nil,
)
