#!/bin/bash

# Vérifie si le volume est vide
if [ -z "$(ls -A /var/www/html)" ]; then
    echo "Initialisation du volume avec sylius..."
    cd /usr/src
    composer create-project sylius/sylius-standard sylius
    cd sylius
    touch .env.local
    echo "DATABASE_URL=mysql://user:pwd@mysql:3306/sylius" >> .env.local

    #autoriser le nom de domain nuxt.localhost a consomer l'api
    cat <<EOT > public/index.php
<?php
header('Access-Control-Allow-Origin: http://nuxt.localhost');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE, PUT');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

use App\Kernel;

require_once dirname(__DIR__).'/vendor/autoload_runtime.php';

return function (array $context) {
    return new Kernel($context['APP_ENV'], (bool) $context['APP_DEBUG']);
};
EOT


    # activer graphql
    composer require "api-platform/graphql"
    cat <<EOT >> config/packages/api_platform.yaml
    graphql:
      enabled: true
EOT
    cp -R /usr/src/sylius/* /var/www/html/
    cp -R /usr/src/sylius/.[!.]* /var/www/html/ 2>/dev/null || true
    chown -R www-data:www-data /var/www/html
    cd /var/www/html
    composer install --no-scripts --no-interaction
    npm install
    npm run build
fi

rm -rf /usr/src/sylius

# Lancer Apache
exec apache2-foreground
