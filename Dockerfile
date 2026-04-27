FROM node:24-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

# 👇 مهم: اختيار environment من الخارج
ARG BUILD_ENV=production

RUN if [ "$BUILD_ENV" = "test" ] ; \
    then npm run build -- --configuration=test ; \
    else npm run build ; \
    fi

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/dist/help-app ./dist/help-app

EXPOSE 4000
CMD ["node", "dist/help-app/server/server.mjs"]