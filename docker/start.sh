#!/bin/sh
set -e

# Generate APP_KEY only if it wasn't set via Render's env vars
if [ -z "$APP_KEY" ]; then
    php artisan key:generate --force
fi

# Make sure storage/bootstrap cache dirs are writable
mkdir -p storage/framework/{sessions,views,cache}
chmod -R 775 storage bootstrap/cache

php artisan storage:link || true

# Cache config/routes/views for production performance
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations against your Aiven MySQL database
php artisan migrate --force

# Render injects $PORT — the app MUST listen on it
php artisan serve --host 0.0.0.0 --port "${PORT:-10000}"