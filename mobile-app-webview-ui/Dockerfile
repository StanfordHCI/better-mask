##
## BUILDER CONTAINER
##

FROM node:8.11.3 as builder

ARG REACT_APP_BACKEND_URL
ARG REACT_APP_OAUTH_CLIENT_ID

RUN mkdir /app

COPY ./package.json /app/package.json
COPY ./yarn.lock /app/yarn.lock

WORKDIR /app

RUN yarn install

# Copy the resources needed to build the app
# We could copy ./ but it weigh more and bust cache more often
COPY ./src /app/src
COPY ./public /app/public

RUN NODE_PATH=./src yarn build


##
## RUNNER CONTAINER
##

FROM nginx:latest

COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf

RUN mkdir -p /var/www/toriland

COPY --from=builder /app/build /var/www/toriland
