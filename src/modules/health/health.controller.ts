import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  MemoryHealthIndicator,
  HealthCheckError,
} from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service';
import { ApiOperation, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly memory: MemoryHealthIndicator,
    private readonly prisma: PrismaService,
  ) {}

  @ApiOperation({
    summary:
      'Verifica a integridade operacional dos componentes vitais do sistema',
  })
  @ApiOkResponse({
    description:
      'Relatório detalhado de saúde dos serviços upstream e recursos internos.',
  })
  @Get()
  async check(): Promise<unknown> {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      async () => {
        try {
          await this.prisma.$queryRaw`SELECT 1`;
          return { database: { status: 'up' } };
        } catch (err: unknown) {
          const message =
            err instanceof Error
              ? err.message
              : 'Erro desconhecido na conexão com o banco';
          throw new HealthCheckError('Database check failed', {
            database: { status: 'down', error: message },
          });
        }
      },
    ]);
  }
}
