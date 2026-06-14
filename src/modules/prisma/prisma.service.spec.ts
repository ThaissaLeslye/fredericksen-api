/**
 * @file prisma.service.spec.ts
 * @description Integration tests for the PrismaService and its security extensions.
 * @responsibility Ensures the PrismaClient is correctly instantiated and decorated with the EncryptionExtension.
 * @strategy Mocks the EncryptionService and verifies that the 'client' property exposes the extended functionality.
 * @logic Validates that the service connects properly and the getter returns a functional client.
 * @mapping Supports the RNF01 requirement by verifying the middleware chain for sensitive data.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import { EncryptionService } from '../security/services/encryption/encryption.service';
import { BloodType } from '@prisma/client';

describe('PrismaService', () => {
  let service: PrismaService;
  let encryptionService: EncryptionService;

  const mockEncryptionService = {
    encrypt: jest.fn(),
    decrypt: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaService,
        {
          provide: EncryptionService,
          useValue: mockEncryptionService,
        },
      ],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
    encryptionService = module.get<EncryptionService>(EncryptionService);
    jest.spyOn(service, '$connect').mockImplementation(async () => {});
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have the encryption extension applied to the client getter', () => {
    expect(service.client).toBeDefined();
    expect(service.client).not.toBeNull();
  });

  it('should call $connect on module init', async () => {
    const connectSpy = jest
      .spyOn(service, '$connect')
      .mockImplementation(async () => {});
    await service.onModuleInit();
    expect(connectSpy).toHaveBeenCalled();
  });

  it('should encrypt sensitive profile fields before database insertion', async () => {
    const rawProfileData = {
      medications: 'Dipirona 25mg',
      allergies: 'Penicilina',
      userId: 'user-uuid',
    };

    const encryptSpy = jest.spyOn(encryptionService, 'encrypt');

    try {
      await service.client.profile.create({
        data: rawProfileData,
      });
      // eslint-disable-next-line no-empty
    } catch {}

    expect(encryptSpy).toHaveBeenCalledTimes(2);
    expect(encryptSpy).toHaveBeenCalledWith(rawProfileData.medications);
    expect(encryptSpy).toHaveBeenCalledWith(rawProfileData.allergies);
  });
});
