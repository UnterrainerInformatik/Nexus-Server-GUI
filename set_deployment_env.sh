#!/usr/bin/env bash

## This file will be used in the docker-compose.yml file automatically because of its name and location.
## So this is the place where to transfer the CI-variables to docker-compose.
echo "VUE_APP_TITLE=Nexus" >> .env
echo "VUE_APP_PROTOCOL=https" >> .env
echo "VUE_APP_ADDRESS=nexus-server.unterrainer.info" >> .env
echo "VUE_APP_PORT=443" >> .env
echo "VUE_APP_KEYCLOAK_HOST=https://keycloak.unterrainer.info/auth" >> .env
echo "VUE_APP_KEYCLOAK_REALM=Nexus" >> .env
echo "VUE_APP_KEYCLOAK_CLIENT=Nexus" >> .env

echo "KEYCLOAK_PASSWORD=$KEYCLOAK_PASSWORD" >> .env
echo "KEYCLOAK_DB_PASSWORD=$KEYCLOAK_DB_PASSWORD" >> .env
echo "KEYCLOAK_DB_ROOT_PASSWORD=$KEYCLOAK_DB_ROOT_PASSWORD" >> .env