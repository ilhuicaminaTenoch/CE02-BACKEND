# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies needed for prisma and bcrypt
RUN apk add --no-cache python3 make g++

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --legacy-peer-deps

RUN npx prisma generate

COPY . .

RUN npm run build

# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

# Install openssl for Prisma
RUN apk add --no-cache openssl libressl-dev libc6-compat

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules/
COPY --from=builder /app/dist ./dist/
COPY --from=builder /app/prisma ./prisma/

# DigitalOcean App Platform provides PORT env
EXPOSE 3000

# Run migrations and then the app
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]
