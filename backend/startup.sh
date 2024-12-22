#!/bin/bash

su -s /bin/bash www-data -c "
    cd /app
    echo 'Running composer install'
    composer install

    echo 'Running npm install'
    npm install

    echo 'Building frontend'
    npm run build
"

echo "Startup script completed"
