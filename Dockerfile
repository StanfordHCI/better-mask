FROM phusion/passenger-ruby25

ARG USE_HTTP

# Add the Certbot repository
RUN add-apt-repository ppa:certbot/certbot

# Install
#    - netcat (we use nc to wait for MySQL):
#    - certbot (we use it to auto-renew the running certificate):
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get -yq install netcat python-certbot-nginx

# Enable nginx:
RUN rm -f /etc/service/nginx/down && \
    rm /etc/nginx/sites-enabled/default

COPY ./docker/webapp.conf ./webapp.conf
COPY ./docker/webapp_ssl.conf ./webapp_ssl.conf

# Add the nginx config file
# COPY ./docker/webapp.conf /etc/nginx/sites-enabled/webapp.conf
RUN if [ -n "$USE_HTTP" ] ; then cp ./webapp.conf /etc/nginx/sites-enabled ; else cp ./webapp_ssl.conf /etc/nginx/sites-enabled ; fi

# Dockerfile:
COPY ./docker/db-env.conf /etc/nginx/main.d/db-env.conf

# Copy the Gemfile and install the dependency
# We do this first to leverage docker build caching:
RUN mkdir /home/app/webapp
COPY ./back/Gemfile /home/app/webapp/Gemfile
COPY ./back/Gemfile.lock /home/app/webapp/Gemfile.lock
WORKDIR /home/app

# Run bundler as a regular user:
# TODO only install prod dependencies?
RUN su - app -c "gem install bundler"
RUN su - app -c "cd /home/app/webapp && bundle install"

# Copy the web app files with the right ownership:
COPY --chown=app:app ./back /home/app/webapp

# Copy the startup script:
COPY  ./docker/startup.sh /home/app/startup.sh

# Let'sEncrypt certificate renewal job:
COPY  ./docker/startup.sh /etc/cron.daily

CMD ["./startup.sh"]