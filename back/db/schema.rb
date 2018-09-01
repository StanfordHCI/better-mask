# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2018_09_04_160726) do

  create_table "airdrop_mints", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "app_id"
    t.boolean "minted"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["app_id"], name: "index_airdrop_mints_on_app_id"
    t.index ["user_id"], name: "index_airdrop_mints_on_user_id"
  end

  create_table "apps", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name", null: false
    t.string "url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "slug", null: false
    t.string "api_key"
    t.bigint "oauth_application_id"
    t.integer "minting_quota", default: 0, null: false
    t.string "referral_landing_path"
    t.index ["oauth_application_id"], name: "index_apps_on_oauth_application_id"
  end

  create_table "coin_rewards", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.bigint "user_id"
    t.integer "amount", null: false
    t.bigint "app_id"
    t.bigint "referral_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["app_id"], name: "index_coin_rewards_on_app_id"
    t.index ["referral_id"], name: "index_coin_rewards_on_referral_id"
    t.index ["user_id"], name: "index_coin_rewards_on_user_id"
  end

  create_table "oauth_access_grants", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "resource_owner_id", null: false
    t.bigint "application_id", null: false
    t.string "token", null: false
    t.integer "expires_in", null: false
    t.text "redirect_uri", null: false
    t.datetime "created_at", null: false
    t.datetime "revoked_at"
    t.string "scopes"
    t.index ["application_id"], name: "index_oauth_access_grants_on_application_id"
    t.index ["token"], name: "index_oauth_access_grants_on_token", unique: true
  end

  create_table "oauth_access_tokens", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "resource_owner_id"
    t.bigint "application_id"
    t.string "token", null: false
    t.string "refresh_token"
    t.integer "expires_in"
    t.datetime "revoked_at"
    t.datetime "created_at", null: false
    t.string "scopes"
    t.string "previous_refresh_token", default: "", null: false
    t.index ["application_id"], name: "index_oauth_access_tokens_on_application_id"
    t.index ["refresh_token"], name: "index_oauth_access_tokens_on_refresh_token", unique: true
    t.index ["resource_owner_id"], name: "index_oauth_access_tokens_on_resource_owner_id"
    t.index ["token"], name: "index_oauth_access_tokens_on_token", unique: true
  end

  create_table "oauth_applications", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name", null: false
    t.string "uid", null: false
    t.string "secret", null: false
    t.text "redirect_uri", null: false
    t.string "scopes", default: "", null: false
    t.boolean "confidential", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["uid"], name: "index_oauth_applications_on_uid", unique: true
  end

  create_table "referral_tokens", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "token", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id"
    t.index ["user_id"], name: "index_referral_tokens_on_user_id"
  end

  create_table "referrals", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "referring_user_id"
    t.bigint "app_id"
    t.string "http_referrer"
    t.string "ip_address"
    t.bigint "referral_token_id"
    t.boolean "converted", default: false, null: false
    t.index ["app_id"], name: "index_referrals_on_app_id"
    t.index ["referral_token_id"], name: "index_referrals_on_referral_token_id"
    t.index ["referring_user_id"], name: "index_referrals_on_referring_user_id"
  end

  create_table "users", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "uid"
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "token"
    t.string "referral_code", null: false
    t.boolean "admin", default: false, null: false
    t.index ["referral_code"], name: "index_users_on_referral_code", unique: true
  end

  create_table "vaults", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "password", null: false
    t.string "seed_words", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "wallet_address"
    t.index ["user_id"], name: "index_vaults_on_user_id"
  end

  add_foreign_key "airdrop_mints", "apps"
  add_foreign_key "airdrop_mints", "users"
  add_foreign_key "apps", "oauth_applications"
  add_foreign_key "coin_rewards", "apps"
  add_foreign_key "coin_rewards", "referrals"
  add_foreign_key "coin_rewards", "users"
  add_foreign_key "oauth_access_grants", "oauth_applications", column: "application_id"
  add_foreign_key "oauth_access_tokens", "oauth_applications", column: "application_id"
  add_foreign_key "referral_tokens", "users"
  add_foreign_key "referrals", "apps"
  add_foreign_key "referrals", "referral_tokens"
  add_foreign_key "referrals", "users", column: "referring_user_id"
  add_foreign_key "vaults", "users"
end
