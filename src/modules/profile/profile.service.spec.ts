import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

describe('ProfileService', () => {
  let service: ProfileService;
  let prisma: PrismaService;

  const mockPrismaService = {
    client: {
      profile: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
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

  describe('findOne', () => {
    it('deve buscar um perfil de usuário pelo ID com sucesso', async () => {
      const userId = 'user-uuid-123';
      const expectedProfile = {
        userId,
        medications: 'Lítio',
        allergies: 'Poeira',
      };

      mockPrismaService.client.profile.findUnique.mockResolvedValue(
        expectedProfile,
      );

      const result = await service.findOne(userId);

      expect(prisma.client.profile.findUnique).toHaveBeenCalledWith({
        where: { userId },
        include: { user: true },
      });
      expect(result).toEqual(expectedProfile);
    });
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

      mockPrismaService.client.profile.update.mockResolvedValue(expectedResult);

      const result = await service.update(userId, updateDto);

      expect(prisma.client.profile.update).toHaveBeenCalledWith({
        where: { userId },
        data: {
          medications: updateDto.medications,
          allergies: updateDto.allergies,
          bloodType: undefined,
        },
      });
      expect(result).toEqual(expectedResult);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
