import { Test, TestingModule } from '@nestjs/testing';
import {
  HealthCheckService,
  MemoryHealthIndicator,
  HealthCheckError,
} from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { PrismaService } from '../prisma/prisma.service';

describe('HealthController', () => {
  let controller: HealthController;
  let prismaService: PrismaService;

  const mockMemoryHealthIndicator = {
    checkHeap: jest.fn().mockReturnValue({ memory_heap: { status: 'up' } }),
  };

  const mockHealthCheckService = {
    check: jest.fn().mockImplementation((indicators: (() => unknown)[]) => {
      return Promise.all(indicators.map((indicator) => indicator()));
    }),
  };

  const mockPrismaService = {
    $queryRaw: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: HealthCheckService, useValue: mockHealthCheckService },
        { provide: MemoryHealthIndicator, useValue: mockMemoryHealthIndicator },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    prismaService = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('check', () => {
    it('deve retornar status de sucesso quando o banco de dados responder corretamente', async () => {
      (prismaService.$queryRaw as jest.Mock).mockResolvedValue([1]);

      const result = await controller.check();

      expect(mockMemoryHealthIndicator.checkHeap).toHaveBeenCalledWith(
        'memory_heap',
        150 * 1024 * 1024,
      );
      expect(prismaService.$queryRaw).toHaveBeenCalled();
      expect(result).toEqual([
        { memory_heap: { status: 'up' } },
        { database: { status: 'up' } },
      ]);
    });

    it('deve lançar HealthCheckError quando a query raw do banco de dados falhar', async () => {
      const dbError = new Error('Connection timeout');
      (prismaService.$queryRaw as jest.Mock).mockRejectedValue(dbError);

      await expect(controller.check()).rejects.toThrow(HealthCheckError);

      try {
        await controller.check();
      } catch (error: unknown) {
        const healthError = error as HealthCheckError;
        expect(healthError.message).toBe('Database check failed');
        expect(healthError.causes).toEqual({
          database: { status: 'down', error: 'Connection timeout' },
        });
      }
    });

    it('deve lidar corretamente com erros genéricos ou desconhecidos que não herdam da classe Error nativa', async () => {
      (prismaService.$queryRaw as jest.Mock).mockRejectedValue(
        'Erro de String Oculto',
      );

      try {
        await controller.check();
      } catch (error: unknown) {
        const healthError = error as HealthCheckError;
        expect(healthError.causes).toEqual({
          database: {
            status: 'down',
            error: 'Erro desconhecido na conexão com o banco',
          },
        });
      }
    });
  });
});
