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
import { NotFoundException } from '@nestjs/common';

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

  describe('findAll', () => {
    it('deve retornar uma lista de usuários cadastrados', async () => {
      const result = await service.findAll();
      expect(prisma.user.findMany).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    it('deve buscar um usuário pelo ID corretamente', async () => {
      const id = 'uuid-123';
      const result = await service.findOne(id);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
      expect(result).toEqual(mockUser);
    });

    it('deve lançar NotFoundException se o usuário não for encontrado', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      const id = 'uuid-inexistente';

      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });
  describe('update', () => {
    it('deve atualizar os dados do usuário se ele for encontrado', async () => {
      const id = 'uuid-123';
      const updateDto = { name: 'Nome Atualizado' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.update(id, updateDto);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id },
        data: updateDto,
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('remove', () => {
    it('deve deletar o usuário do banco se ele for encontrado', async () => {
      const id = 'uuid-123';
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.remove(id);

      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id },
      });
      expect(result).toEqual(mockUser);
    });
  });
});
