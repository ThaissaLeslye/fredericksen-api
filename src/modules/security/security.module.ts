/**
 * @module SecurityModule
 * @description Módulo responsável por encapsular serviços de segurança,
 * como criptografia e proteção de dados sensíveis (LGPD).
 */
import { Module, Global } from '@nestjs/common';
import { EncryptionService } from './services/encryption/encryption.service';

@Global()
@Module({
  providers: [EncryptionService],
  exports: [EncryptionService],
})
export class SecurityModule {}
