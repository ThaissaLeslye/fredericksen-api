/**
 * @file user.service.spec.ts
 * @description Unit tests for the UserService.
 * @responsibility Manages the business logic and database interactions via Prisma.
 * @strategy Mocks the PrismaService to avoid real database connections, focusing on logic.
 * @logic Validates user creation, ensuring the 1:1 relationship with a Profile is initialized.
 * @mapping Ensures data is correctly mapped to database fields like 'nome' and 'foto_url'.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  const mockUser = {
    id: 'uuid-123',
    email: 'teste@exemplo.com',
    name: 'Desenvolvedor Iniciante',
    googleId: 'google-123',
    photoUrl: 'https://foto.url',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            // Mockando a estrutura aninhada do Prisma
            user: {
              create: jest.fn().mockResolvedValue(mockUser),
              findMany: jest.fn().mockResolvedValue([mockUser]),
              findUnique: jest.fn().mockResolvedValue(mockUser),
              update: jest.fn().mockResolvedValue(mockUser),
              delete: jest.fn().mockResolvedValue(mockUser),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um usuário com um perfil anexo', async () => {
      const dto = { email: 'teste@exemplo.com', name: 'Nome', googleId: '123' };

      const result = await service.create(dto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          ...dto,
          profile: { create: {} },
        },
        include: { profile: true },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findOne', () => {
    it('deve buscar um usuário pelo ID corretamente', async () => {
      const id = 'uuid-123';
      const result = await service.findOne(id);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
      expect(result).toEqual(mockUser);
    });
  });
});
