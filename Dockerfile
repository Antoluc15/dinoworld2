FROM php:8.1-apache

# Actualiza los paquetes y herramientas de compilación
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libonig-dev \
    libzip-dev \
    libxml2-dev \
    unzip \
    && docker-php-ext-install pdo pdo_mysql pdo_pgsql

# Copia los archivos de tu proyecto
COPY . /var/www/html/

# Establece permisos correctos
RUN chown -R www-data:www-data /var/www/html && chmod -R 755 /var/www/html

# Exponemos el puerto 80
EXPOSE 80

# Inicia el servidor Apache
CMD ["apache2-foreground"]
