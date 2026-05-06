#!/bin/sh
set -e

for ambiente in local hml prod
do
  echo "Subindo ambiente: ${ambiente}"
  docker compose \
    -p "finance-api-${ambiente}" \
    -f docker-compose.yml \
    -f "docker-compose.${ambiente}.yml" \
    up -d --build
done
