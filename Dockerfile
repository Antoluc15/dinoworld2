# Etapa de construcción de Node.js
FROM node:14 AS build

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias de Node.js
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY . .

# Etapa de producción de PHP con Apache
FROM php:8.1-apache

# Instala herramientas de desarrollo PHP y extensiones
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libonig-dev \
    libzip-dev \
    libxml2-dev \
    unzip \
    && docker-php-ext-install pdo pdo_mysql pdo_pgsql

# Copia los archivos del directorio de Node.js desde la etapa de construcción
COPY --from=build /app /var/www/html

# Establece permisos correctos
RUN chown -R www-data:www-data /var/www/html && chmod -R 755 /var/www/html

# Expone el puerto 80
EXPOSE 80

# Inicia el servidor Apache
CMD ["apache2-foreground"]
