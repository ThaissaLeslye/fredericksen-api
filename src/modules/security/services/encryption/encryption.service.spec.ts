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

  it('should encrypt and decrypt a value correctly (Round-trip)', () => {
    const originalText = 'Insulina 10mg';

    const encrypted = service.encrypt(originalText);
    const decrypted = service.decrypt(encrypted);

    expect(encrypted).toContain(':');
    expect(decrypted).toBe(originalText);
  });

  it('should throw InternalServerErrorException when data is malformed (missing ":")', () => {
    const invalidData = 'textoSemSeparador';

    expect(() => service.decrypt(invalidData)).toThrow(
      InternalServerErrorException,
    );
  });
});
