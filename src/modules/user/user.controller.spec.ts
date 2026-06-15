/**
 * @file user.controller.spec.ts
 * @description Unit tests for the UserController.
 * @responsibility Ensures that HTTP requests are correctly routed,
 * parameters are extracted, and the service is called with the right data.
 * @strategy Uses Mocking for the UserService to isolate the HTTP layer from business logic.
 * @assertion Validates if the response is correctly transformed into a UserEntity instance.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { ActiveUser } from '../auth/auth.interfaces';
import { NotFoundException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockActiveUser: ActiveUser = {
    id: 'uuid-123',
    email: 'test@test.com',
    name: 'Fulana de Tal',
    photoUrl: 'photo.url',
  };

  const mockUserFromDb = {
    id: 'uuid-123',
    email: 'test@test.com',
    name: 'Test User',
    googleId: 'google-id-123',
    photoUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockUserFromDb]),
            findOne: jest.fn().mockImplementation((id: string) => {
              if (id === 'uuid-inexistente') return Promise.resolve(null);
              return Promise.resolve(mockUserFromDb);
            }),
            update: jest.fn().mockResolvedValue(mockUserFromDb),
            remove: jest.fn().mockResolvedValue({ deleted: true }),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('deve retornar um array de UserEntity', async () => {
      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Array);
      expect(result[0]).toBeInstanceOf(UserEntity);
    });
  });

  describe('getMe', () => {
    it('deve retornar uma UserEntity baseada no usuário logado', async () => {
      const result = await controller.getMe(mockActiveUser);

      expect(service.findOne).toHaveBeenCalledWith(mockActiveUser.id);
      expect(result).toBeInstanceOf(UserEntity);
      expect(result.email).toEqual(mockUserFromDb.email);
    });
  });

  describe('findOne', () => {
    it('deve retornar uma UserEntity quando o ID existir', async () => {
      const result = await controller.findOne('uuid-123');

      expect(service.findOne).toHaveBeenCalledWith('uuid-123');
      expect(result).toBeInstanceOf(UserEntity);
    });

    it('deve lançar NotFoundException quando o serviço retornar null', async () => {
      await expect(controller.findOne('uuid-inexistente')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('deve chamar o service.update e retornar a UserEntity atualizada', async () => {
      const updateDto = { name: 'Novo Nome' };

      const result = await controller.update(mockActiveUser.id, updateDto);

      expect(service.update).toHaveBeenCalledWith(mockActiveUser.id, updateDto);
      expect(result).toBeInstanceOf(UserEntity);
    });
  });

  describe('remove', () => {
    it('deve chamar o service.remove com o ID correto', async () => {
      const result = await controller.remove('uuid-123');

      expect(service.remove).toHaveBeenCalledWith('uuid-123');
      expect(result).toEqual({ deleted: true });
    });
  });
});
