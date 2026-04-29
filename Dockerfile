FROM node:20-alpine AS base

# 1. Instalar dependencias solo cuando sea necesario
FROM base AS deps
# libc6-compat es requerido por process.dlopen, que a menudo lo necesitan las herramientas de compilación
# openssl es requerido por Prisma
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copiar archivos de dependencias y schema de Prisma
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Instalar TODAS las dependencias y generar Prisma Client
RUN npm install
RUN npx prisma generate

# 2. Reconstruir el código fuente solo cuando sea necesario
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Construir Next.js (Esto creará el .next/standalone si configuraste output: 'standalone')
RUN npm run build

# 3. Imagen de producción (La ligerísima)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Instalar openssl para Prisma en tiempo de ejecución
RUN apk add --no-cache openssl

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiamos la carpeta public (si tienes imágenes, fuentes estáticas, etc)
COPY --from=builder /app/public ./public

# Copiamos la carpeta standalone que Next.js genera (contiene dependencias node_modules minificadas)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# IMPORTANTÍSIMO: Prisma no suele copiarse completo en el standalone de Next.js, así que lo forzamos.
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Copiar la carpeta prisma para poder correr migraciones / db push desde el contenedor
COPY --from=builder /app/prisma ./prisma
# Copiar package.json para que npx sepa las versiones
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Ejecutamos directamente Node.js sobre el archivo generado, sin usar 'npm run start'
CMD ["node", "server.js"]
