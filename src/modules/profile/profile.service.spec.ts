import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

describe('ProfileService', () => {
  let service: ProfileService;
  let prisma: PrismaService;

  const mockPrismaService = {
    profile: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('update', () => {
    it('deve atualizar o perfil com sucesso e mapear os campos corretamente', async () => {
      const userId = 'user-uuid';
      const updateDto = {
        medications: 'Aspirina',
        allergies: 'Poeira',
      };

      const expectedResult = {
        userId,
        medications: 'Aspirina',
        allergies: 'Poeira',
      };

      mockPrismaService.profile.update.mockResolvedValue(expectedResult);

      const result = await service.update(userId, updateDto);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.profile.update).toHaveBeenCalledWith({
        where: { userId },
        data: {
          medications: updateDto.medications,
          allergies: updateDto.allergies,
          bloodType: undefined,
        },
      });
      expect(result).toEqual(expectedResult);
    });

    it('deve lançar NotFoundException quando o Prisma retornar erro P2025', async () => {
      const userId = 'id-inexistente';

      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'Record not found',
        { code: 'P2025', clientVersion: '5.0.0' },
      );

      mockPrismaService.profile.update.mockRejectedValue(prismaError);

      await expect(service.update(userId, {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
