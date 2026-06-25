/**
 * @file prisma.service.ts
 * @description Core service for database connectivity and ORM operations.
 * @responsibility Manages the lifecycle of the Prisma Client and applies security extensions.
 * @strategy Extends PrismaClient and decorates it with the custom EncryptionExtension.
 * @logic Injects EncryptionService to enable transparent encryption/decryption of Profile data.
 * @mapping Ensures all database calls through this service respect the RNF01 security requirements.
 */

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { extendPrismaClient } from './prisma.extension';
import { EncryptionService } from '../security/services/encryption/encryption.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private _extendedClient: ReturnType<typeof extendPrismaClient>;

  constructor(
    private readonly encryptionService: EncryptionService,
    private readonly configService: ConfigService,
  ) {
    const pool = new Pool({
      connectionString: configService.getOrThrow<string>('DATABASE_URL'),
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    const adapter = new PrismaPg(pool);

    super({ adapter });

    this._extendedClient = extendPrismaClient(this, this.encryptionService);
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  get client() {
    return this._extendedClient;
  }
}
