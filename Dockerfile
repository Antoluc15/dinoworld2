FROM php:8.1-apache

# Copia todos los archivos a la carpeta del servidor web
COPY . /var/www/html/

# Exponemos el puerto 80 para el servidor web
EXPOSE 80

# Inicia el servidor Apache
CMD ["apache2-foreground"]
