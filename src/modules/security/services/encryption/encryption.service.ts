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
  private readonly algorithm = 'aes-256-ctr';
  private readonly key: Buffer;

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
    const iv = randomBytes(16);
    const cipher = createCipheriv(this.algorithm, this.key, iv);

    const encrypted = Buffer.concat([
      cipher.update(text, 'utf-8'),
      cipher.final(),
    ]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  decrypt(encryptedData: string): string {
    const parts = encryptedData.split(':');

    if (parts.length !== 2) {
      throw new InternalServerErrorException(
        'Falha de Integridade: O dado criptografado está em um formato inválido.',
      );
    }

    try {
      const [ivHex, encryptedTextHex] = parts;
      const iv = Buffer.from(ivHex, 'hex');
      const encryptedBuffer = Buffer.from(encryptedTextHex, 'hex');

      const decipher = createDecipheriv(this.algorithm, this.key, iv);
      const decrypted = Buffer.concat([
        decipher.update(encryptedBuffer),
        decipher.final(),
      ]);

      return decrypted.toString('utf-8');
    } catch {
      throw new InternalServerErrorException(
        'Erro na decriptação: Verifique a integridade da chave e dos dados.',
      );
    }
  }
}
