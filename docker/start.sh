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

# Substitute Render's dynamic $PORT into the Nginx config template
export PORT="${PORT:-10000}"
envsubst '${PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Hands off to supervisord, which keeps both php-fpm and nginx running
exec supervisord -c /etc/supervisor/conf.d/supervisord.conf