#!/bin/sh
# @file docker-entrypoint.sh
# @description Gerencia a inicialização do container de produção.
# @logic Garante a execução das migrações do Prisma antes de iniciar o servidor NestJS.

set -e

# Executa as migrações pendentes no banco de dados
npx prisma migrate deploy

# Inicia a aplicação em modo produção
exec "$@"