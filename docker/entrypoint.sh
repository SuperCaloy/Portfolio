#!/bin/bash

# Install PHP dependencies if missing
if [ ! -d "vendor" ]; then
    composer install --no-interaction --prefer-dist --optimize-autoloader
fi

# Install Node dependencies if missing
if [ ! -d "node_modules" ]; then
    npm install
fi

# Build assets if build folder is missing
if [ ! -d "public/build" ]; then
    npm run build
fi

# Execute PHP-FPM
exec php-fpm