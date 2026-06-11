/**
 * @file prisma.service.ts
 * @description Core service for database connectivity and ORM operations.
 * @responsibility Manages the lifecycle of the Prisma Client and applies security extensions.
 * @strategy Extends PrismaClient and decorates it with the custom EncryptionExtension.
 * @logic Injects EncryptionService to enable transparent encryption/decryption of Profile data.
 * @mapping Ensures all database calls through this service respect the RNF01 security requirements.
 */

import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { extendPrismaClient } from './prisma.extension';
import { EncryptionService } from '../security/services/encryption/encryption.service';
import { OnModuleInit } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private _extendedClient: ReturnType<typeof extendPrismaClient>;

  constructor(private readonly encryptionService: EncryptionService) {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    const adapter = new PrismaPg(pool);

    super({ adapter });

    this._extendedClient = extendPrismaClient(this, this.encryptionService);
  }

  async onModuleInit() {
    await this.$connect();
  }
  get client() {
    return this._extendedClient;
  }
}
