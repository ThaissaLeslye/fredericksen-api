# --- ESTÁGIO 1: Build ---
FROM node:22-slim AS build 

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node prisma ./prisma/

RUN npm ci

RUN npx prisma generate

COPY --chown=node:node . .

RUN npm run build

RUN npm run dk:doc:generate

RUN npm prune --omit=dev

# --- ESTÁGIO 2: Runtime (Production) ---
FROM node:22-slim AS production

ENV NODE_ENV=production

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/package.json ./
COPY --chown=node:node --from=build /usr/src/app/prisma ./prisma
COPY --chown=node:node --from=build /usr/src/app/prisma.config.ts ./
COPY --from=build /usr/src/app/documentation ./documentation
COPY --chown=node:node docker-entrypoint.sh ./

RUN chmod +x docker-entrypoint.sh

EXPOSE 3000

USER node

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "const http = require('http'); const req = http.request({ host: '127.0.0.1', port: process.env.PORT || 3000, path: '/health', method: 'GET', timeout: 3000 }, (res) => { process.exit(res.statusCode === 200 ? 0 : 1); }); req.on('error', () => process.exit(1)); req.end();"

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "dist/main"]