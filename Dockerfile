# syntax=docker/dockerfile:1

FROM node:20-alpine AS builder
WORKDIR /app

# 🟢 انسخ dependencies الأول (cache optimization)
COPY package*.json ./

# 🔥 حل مشكلة npm + تسريع
RUN npm ci --legacy-peer-deps

# 🟢 انسخ باقي الملفات
COPY . .

# 🟢 build production
RUN npm run build


# 🟢 مرحلة التشغيل
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# 🟢 انسخ فقط الناتج
COPY --from=builder /app/dist/help-app ./dist/help-app

EXPOSE 4000

CMD ["node", "dist/help-app/server/server.mjs"]