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
            findOne: jest.fn().mockResolvedValue(mockUserFromDb),
            update: jest.fn().mockResolvedValue(mockUserFromDb),
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

  describe('getMe', () => {
    it('deve retornar uma UserEntity baseada no usuário logado', async () => {
      const result = await controller.getMe(mockActiveUser);

      expect(service.findOne).toHaveBeenCalledWith(mockActiveUser.id);
      expect(result).toBeInstanceOf(UserEntity);
      expect(result.email).toEqual(mockUserFromDb.email);
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
});
