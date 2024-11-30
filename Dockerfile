FROM php:8.1-apache

# Instala Node.js y npm
RUN apt-get update && apt-get install -y \
    curl \
    && curl -sL https://deb.nodesource.com/setup_14.x | bash - \
    && apt-get install -y nodejs

# Instala herramientas de desarrollo PHP y extensiones
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

# Establece el directorio de trabajo
WORKDIR /var/www/html

# Instala dependencias de Node.js
COPY package*.json ./
RUN npm install

# Expone el puerto 80
EXPOSE 80

# Inicia el servidor Apache
CMD ["apache2-foreground"]
