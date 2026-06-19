/**
 * @file encryption.service.ts
 * @description Service responsible for encrypting and decrypting sensitive data using AES-256-CTR.
 * @responsibility Ensures medical data like medications and allergies are stored securely (LGPD compliance).
 * @strategy Uses a 32-byte key derived from environment variables and a random 16-byte IV per operation.
 * @logic Implements Node.js 'crypto' module for high-entropy cryptographic operations.
 * @mapping Directly impacts 'medicamentos' and 'alergias' fields in the Profile model.
 */

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly key: Buffer;
  private readonly PREFIX_GCM = 'v2:gcm:';

  constructor(private readonly configService: ConfigService) {
    const b64Key = this.configService.getOrThrow<string>('ENCRYPTION_KEY');
    this.key = Buffer.from(b64Key, 'base64');

    if (this.key.length !== 32) {
      throw new InternalServerErrorException(
        'Falha de Segurança: A chave de criptografia deve ter exatamente 32 bytes.',
      );
    }
  }

  encrypt(text: string): string {
    const iv = randomBytes(12);
    const cipher = createCipheriv(this.algorithm, this.key, iv);

    const encrypted = Buffer.concat([
      cipher.update(text, 'utf-8'),
      cipher.final(),
    ]);

    const tag = cipher.getAuthTag();

    return `${this.PREFIX_GCM}${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`;
  }

  decrypt(encryptedData: string): string {
    return this.decryptGcm(encryptedData);
  }

  private decryptGcm(encryptedData: string): string {
    const dataWithoutPrefix = encryptedData.replace(this.PREFIX_GCM, '');
    const parts = dataWithoutPrefix.split(':');

    if (parts.length !== 3) {
      throw new InternalServerErrorException(
        'Falha de Integridade: Payload GCM corrompido.',
      );
    }

    try {
      const [ivHex, tagHex, encryptedTextHex] = parts;
      const decipher = createDecipheriv(
        this.algorithm,
        this.key,
        Buffer.from(ivHex, 'hex'),
      );

      decipher.setAuthTag(Buffer.from(tagHex, 'hex'));

      const decrypted = Buffer.concat([
        decipher.update(Buffer.from(encryptedTextHex, 'hex')),
        decipher.final(),
      ]);

      return decrypted.toString('utf-8');
    } catch {
      throw new InternalServerErrorException(
        'Erro de Autenticidade: O dado foi adulterado ou a chave é inválida.',
      );
    }
  }
}
