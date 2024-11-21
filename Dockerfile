FROM php:8.1-apache

# Instala extensiones adicionales de PHP necesarias (si las usas)
RUN docker-php-ext-install pdo pdo_mysql pdo_pgsql

# Copia todos los archivos al directorio del servidor
COPY . /var/www/html/

# Establece los permisos correctos
RUN chown -R www-data:www-data /var/www/html && chmod -R 755 /var/www/html

# Exponemos el puerto 80
EXPOSE 80

# Inicia el servidor Apache
CMD ["apache2-foreground"]

