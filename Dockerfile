# Usa la imagen oficial de Node.js
FROM node:18

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json (si está disponible)
COPY package.json ./

# Instalar las dependencias usando npm
RUN npm install --force

# Copiar el resto de los archivos del frontend
COPY . .

# Exponer el puerto del frontend
EXPOSE 3000

# Iniciar la aplicación frontend
CMD ["npm", "run", "dev"]
