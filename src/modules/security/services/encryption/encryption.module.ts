/**
 * @file encryption.module.ts
 * @description Module that encapsulates cryptographic security logic.
 * @responsibility Provides and exports the EncryptionService for use across the application.
 * @strategy Implements the Module pattern to ensure Dependency Injection (DI) compliance.
 * @logic Integrates ConfigModule to provide environment-based secrets to the service.
 * @mapping Essential for RNF01 (Security) and LGPD compliance regarding sensitive medical data.
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EncryptionService } from './encryption.service';

@Module({
  imports: [ConfigModule],
  providers: [EncryptionService],
  exports: [EncryptionService],
})
export class EncryptionModule {}
