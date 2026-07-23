# ---- Stage 1: build frontend assets (Vite/Inertia/React) ----
FROM node:20-alpine AS assets
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Stage 2: PHP runtime ----
FROM php:8.3-fpm AS app

RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Install PHP deps first (better layer caching)
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --optimize-autoloader

# Copy app code
COPY . .

# Bring in the built frontend assets from stage 1
COPY --from=assets /app/public/build ./public/build

RUN composer dump-autoload --optimize --no-dev

RUN chmod +x docker/start.sh

# Render sets $PORT at runtime — the app must listen on it
EXPOSE 10000

CMD ["docker/start.sh"]