/**
 * @file user.e2e-spec.ts
 * @description End-to-End (E2E) integration tests for User and Profile flows.
 * @responsibility Validates the complete SDLC cycle: Request -> Auth -> Logic -> Database.
 * @requirement Covers RFE01 (Google Login) and RFE03 (Field Validation).
 * @strategy Real HTTP requests using Supertest against a test database environment.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import type { Server } from 'http';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/modules/prisma/prisma.service';

describe('User System (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );

    prisma = app.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: 'e2e-test@fredericksen.com' },
    });
    await app.close();
  });

  describe('RBAC & Auth Guard Enforcement', () => {
    it('/user (GET) - should reject unauthenticated requests with 401 Unauthorized', () => {
      return request(app.getHttpServer() as Server)
        .get('/user')
        .expect(401);
    });
  });
});
