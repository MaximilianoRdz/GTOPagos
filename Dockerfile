# ==========================================
# 1. Build Stage: Compilar la app Angular
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar definiciones de paquetes e instalar dependencias
COPY package.json package-lock.json ./
RUN npm ci

# Copiar el codigo fuente
COPY . .

# Compilar la aplicacion para produccion
RUN npm run build -- --configuration=production

# ==========================================
# 2. Production Stage: Servir con Nginx Alpine
# ==========================================
FROM nginx:alpine

# Copiar configuracion personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos estaticos generados por Angular
COPY --from=builder /app/dist/gtopagos/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
