# ===========================
# 1️⃣ Base de dependências
# ===========================
FROM node:18-alpine AS deps
WORKDIR /app

# Instalar openssl para o Prisma
RUN apk add --no-cache openssl

COPY package.json package-lock.json* ./
RUN npm install

# ====================================
# 2️⃣ Builder — compila Next + Prisma
# ====================================
FROM node:18-alpine AS builder
WORKDIR /app

RUN apk add --no-cache openssl

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Gera Prisma Client ANTES do build
RUN npx prisma generate

# Build do Next.js
RUN npm run build

# =====================================
# 3️⃣ Runner — o container final
# =====================================
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache openssl

# Copiar arquivos necessários do builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["npm", "start"]
