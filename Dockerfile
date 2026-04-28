# --- ESTÁGIO 1: Build & Development ---
FROM node:20-slim AS build 

# Instala dependências do sistema para o Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Ajusta a permissão da pasta de trabalho antes de mudar de usuário
RUN chown node:node /usr/src/app

# Copia arquivos de configuração
COPY --chown=node:node package*.json ./
COPY --chown=node:node prisma ./prisma/

# Muda para o usuário node ANTES de instalar e gerar o prisma
USER node

# Instala dependências (incluindo devDependencies para o start:dev)
RUN npm install

# Gera o Prisma Client (agora como usuário node)
RUN npx prisma generate

# Copia o restante do código
COPY --chown=node:node . .

# Build do NestJS
RUN npm run build

# --- ESTÁGIO 2: Runtime (Production) ---
FROM node:20-slim AS production

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copia apenas o necessário do estágio de build
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/package.json ./

USER node

EXPOSE 3000

CMD ["node", "dist/main"]