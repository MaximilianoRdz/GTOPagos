# ==========================================
# 1. Build Stage: Compilar la app Angular
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar definiciones de paquetes, lock y configuracion de npm (.npmrc con legacy-peer-deps)
COPY package.json package-lock.json .npmrc* ./
RUN npm ci

# Copiar el codigo fuente
COPY . .

# Compilar la aplicacion para entorno Docker / Produccion
RUN npm run build -- --configuration=docker

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
