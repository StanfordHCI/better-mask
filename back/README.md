# README

## Environment-specific configuration:

In order to run the app directly on your computer (e.g `rails s`), you'll need to provide a few secrets as environment variables.
We use [Figaro](https://github.com/laserlemon/figaro) to make this process easier. The way it works is by using `config/application.yml`
as a source for environment variables to inject.

Create this file by copying `config/application.yml.template` as `config/application.yml`.

`config.application.yml` is .gitignored, so feel free to change the values in it to whatever you need. However, if you need to add
a new value to be defined, make sure to add it in *three* places:

> <REPO_ROOT>/.env.template
> <REPO_ROOT>/docker/db-env.conf
> <REPO_ROOT>/back/config/application.yml.template

> **Why the heck?**
> On our production environment, we are using docker-compose environment variables injection mechanisms to inject those values into
> the running app. In other words, make sure to also add those in places related to the Docker containers on top of places related
> to the running app.

> **Could we make this easier?**
> One way to make this easier would be to drop support for running the app locally, and write a docker-compose file for development.
> Then we would not need config/application.yml.


This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...

## Bulting on Mac

Bundling on a mac fails on mysql2 gem. [Apple has deprecated use of OpenSSL in favor of its own TLS and crypto libraries](https://stackoverflow.com/questions/30834421/error-when-trying-to-install-app-with-mysql2-gem). Solution:

`gem install mysql2 -v '0.5.1' -- --with-ldflags=-L/usr/local/opt/openssl/lib --with-cppflags=-I/usr/local/opt/openssl/include`

## Doorkeeper setup

* Login to the local application with Facebook (the fb account needs to be a developer account), and make yourself admin in the database
* Get a dev extension_id
  * build extension in the extension folder
    * run `yarn`, if you haven't.
    * run `yarn build` 
  * upload the extension locally to chrome to get the extension_id
    * Go to chrome>windows>extensions, turn on developer mode and choose "Load unpacked"
* Go to (http://localhost:8080/oauth/applications).
  * New application
  * Name: `Bettermask`
  * Redirect URI `http://localhost:8080/extension-oauth-callback`
  * not confidential
* Copy these  
  * Application UID: e.g. cb69cadb1ac1bf727948f1d4d8fb107d593015b07fb52a282592ef717a55bbd4
  * Secret: e.g. 4fc5f9b05f253e677d542e2cae9d8141e37a8463569175dc67657a6193e741ce
* Paste above to `browser-extension/env.json`.
  * See README.md in `browser-extension/` about how to set up env.json

