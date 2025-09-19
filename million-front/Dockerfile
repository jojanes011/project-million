# Usa una imagen oficial de Node.js
FROM node:20-alpine AS base

# --- Dependencias ---
FROM base AS deps
WORKDIR /app

# Copia package.json y package-lock.json
COPY package.json package-lock.json ./
# Instala las dependencias de producción
RUN npm install --production

# --- Builder ---
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variables de entorno para la URL de la API en producción
ENV NEXT_PUBLIC_API_URL_BASE "http://localhost:5124"

# Construye la aplicación Next.js
RUN npm run build

# --- Runner ---
FROM base AS runner
WORKDIR /app

# Variables de entorno
ENV NODE_ENV production
# La variable del backend se configurará dinámicamente en DigitalOcean
# ENV NEXT_PUBLIC_API_URL_BASE="" 

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Copia los artefactos de la compilación
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Expone el puerto en el que corre la aplicación Next.js
EXPOSE 3000

# Comando para iniciar el servidor de Node.js
CMD ["node", "server.js"]
