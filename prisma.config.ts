import { defineConfig } from 'prisma/config';
import * as process from 'process';

if (process.env.NODE_ENV !== 'production') {
  try {
    const dotenv = await import('dotenv');
    dotenv.config();
    console.log('Prisma: Carregando configurações via .env (Modo Development)');
  } catch {
  }
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  const envStatus = process.env.NODE_ENV === 'production' ? 'PRODUÇÃO' : 'DEVELOPMENT';
  throw new Error(`[ERRO CRÍTICO] DATABASE_URL não encontrada no ambiente de ${envStatus}.`);
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: databaseUrl,
  },
});