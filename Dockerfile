# --- ESTÁGIO 1: Build ---
# Fixamos a versão para garantir imutabilidade (exemplo com Node 24 LTS)
FROM node:24.15.0-slim AS build 

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Copia apenas arquivos de dependência primeiro para otimizar o cache de camadas
COPY --chown=node:node package*.json ./
COPY --chown=node:node prisma ./prisma/

# Engineering Excellence: npm ci é determinístico e ideal para CI/CD
RUN npm ci

# Gera o Prisma Client antes do build do NestJS
RUN npx prisma generate

COPY --chown=node:node . .

RUN npm run build

# Remove dependências de desenvolvimento antes de migrar para o próximo estágio
RUN npm prune --omit=dev

# --- ESTÁGIO 2: Runtime (Production) ---
FROM node:24.15.0-slim AS production

# Security by Design: Definindo explicitamente o ambiente
ENV NODE_ENV=production

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Copia apenas o estritamente necessário
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/package.json ./
COPY --chown=node:node --from=build /usr/src/app/prisma ./prisma
COPY --chown=node:node --from=build /usr/src/app/prisma.config.ts ./
COPY --chown=node:node --from=build /usr/src/app/tsconfig.json ./
COPY --chown=node:node docker-entrypoint.sh ./

RUN chmod +x docker-entrypoint.sh

# Documentação para outros engenheiros e orquestradores
EXPOSE 3000

USER node

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "dist/main"]