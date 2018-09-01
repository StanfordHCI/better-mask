#!/bin/bash

/bin/certbot renew --no-self-upgrade --quiet --renew-hook "/bin/systemctl reload nginx"