/**
 * @file encryption.service.spec.ts
 * @description Unit tests for the EncryptionService.
 * @responsibility Validates the AES-256-CTR encryption and decryption logic for sensivel data.
 * @strategy Uses the real EncryptionService with a mocked ConfigService to test cryptographic math.
 * @logic Asserts that a string encrypted by the service can be correctly recovered to its original state.
 * @mapping Ensures protection of fields like 'medicamentos' and 'alergias' is reliable.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EncryptionService } from './encryption.service';
import { InternalServerErrorException } from '@nestjs/common';
import { randomBytes } from 'crypto';

describe('EncryptionService', () => {
  let service: EncryptionService;
  const testKey = randomBytes(32).toString('base64');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EncryptionService,
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn().mockReturnValue(testKey),
          },
        },
      ],
    }).compile();

    service = module.get<EncryptionService>(EncryptionService);
  });

  it('should encrypt and decrypt a value correctly using pure AES-GCM (Round-trip)', () => {
    const originalText = 'Insulina 10mg';

    const encrypted = service.encrypt(originalText);
    const decrypted = service.decrypt(encrypted);

    expect(encrypted).toMatch(/^v2:gcm:/);
    expect(decrypted).toBe(originalText);
  });

  it('should throw InternalServerErrorException when a GCM authentication tag is tampered with', () => {
    const encrypted = service.encrypt('Dados Médicos Confidenciais');

    const tamperedEncrypted =
      encrypted.substring(0, encrypted.length - 1) + 'X';

    expect(() => service.decrypt(tamperedEncrypted)).toThrow(
      InternalServerErrorException,
    );
  });

  it('should throw InternalServerErrorException when payload structure is malformed', () => {
    const invalidData = 'v2:gcm:textoSemOsDelimitadoresCorretos';

    expect(() => service.decrypt(invalidData)).toThrow(
      InternalServerErrorException,
    );
  });
  it('should throw InternalServerErrorException when key length is invalid during initialization', async () => {
    const shortKey = randomBytes(16).toString('base64');
    const invalidModuleBuilder = Test.createTestingModule({
      providers: [
        EncryptionService,
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn().mockReturnValue(shortKey),
          },
        },
      ],
    });

    await expect(invalidModuleBuilder.compile()).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should throw InternalServerErrorException when cryptographic decryption engine fails with malformed hex data', () => {
    const corruptPayloadWithValidFormat =
      'v2:gcm:badiv:badtag:badencryptedtext';

    expect(() => service.decrypt(corruptPayloadWithValidFormat)).toThrow(
      InternalServerErrorException,
    );
  });
});
