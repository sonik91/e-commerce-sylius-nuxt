#!/bin/bash

cd /app

# Vérifier la valeur de NUXT_ENV
if [ "$NUXT_ENV" = "prod" ]; then
  echo "Starting Nuxt in production mode..."
  npx nuxt build
  exec npx nuxt start
elif [ "$NUXT_ENV" = "dev" ]; then
  echo "Starting Nuxt in development mode..."
  exec npx nuxt dev
else
  echo "Invalid NUXT_ENV value: $NUXT_ENV"
  echo "default start server env prod"
  npx nuxt build
  exec npx nuxt start
  exit 1
fi
