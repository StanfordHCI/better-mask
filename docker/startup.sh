#! /bin/bash

set -e

wait_for_db() {
  # Wait for PostgreSQL
  until nc -z -v -w30 $DB_HOST 3306
  do
    echo 'Waiting for MySQL...'
    sleep 1
  done
  echo "MySQL is up and running"
}

migrate_db() {
  cd /home/app/webapp
  # TODO Load the schema and seed the db if the database schema hasn't been loaded yet
  # (ie run bundle exec rake db:schema:load db:seed)
  # An idea to check if the schema is loaded & decide what to do accordingly:
  # mysql -u root --database blockchain-explorer-back_development -e "SELECT * FROM schema_migrations"
  # If we don't have a mysql CLI, we could also probably do that with a rake task?
  bundle exec rake db:migrate
  echo "Database migrated!"
}

start_app() {
  echo "Precompiling assets"
  bundle exec rake assets:precompile
  chown -R app:app /home/app/webapp
}

wait_for_db
migrate_db
start_app

# Startup script of the base image:
/sbin/my_init
