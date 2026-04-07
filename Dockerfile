FROM php:8.2-apache

# Install dependencies for PHP and typical Sakura env
RUN apt-get update && apt-get install -y \
    libzip-dev \
    zip \
    unzip \
    git \
    && docker-php-ext-install pdo_mysql zip

# Enable mod_rewrite for Apache
RUN a2enmod rewrite

# Set working directory to the project root
WORKDIR /var/www/html

# Update Apache configuration to allow .htaccess overrides
RUN sed -i 's/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy composer files and install dependencies
COPY KAMAGI/composer.json KAMAGI/composer.lock /var/www/html/KAMAGI/
RUN cd KAMAGI && composer install --no-dev --optimize-autoloader --no-interaction

# Copy application code
COPY . /var/www/html/
