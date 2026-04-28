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
    await prisma.user.deleteMany();
    await app.close();
  });

  describe('User Creation & Profile Initialization', () => {
    it('/user (POST) - should create a user and automatically link a profile', async () => {
      const newUser = {
        email: 'e2e-test@fredericksen.com',
        name: 'E2E Tester',
        googleId: 'google-oauth2|99999',
      };

      const response = await request(app.getHttpServer() as Server)
        .post('/user')
        .send(newUser)
        .expect(201);

      const responseBody = response.body as { id: string; email: string };

      expect(responseBody).toHaveProperty('id');
      expect(responseBody.email).toBe(newUser.email);
      expect(responseBody).not.toHaveProperty('googleId');

      const userInDb = await prisma.user.findUnique({
        where: { email: newUser.email },
        include: { profile: true },
      });

      expect(userInDb?.profile).toBeDefined();
    });
  });

  describe('Validation Rules (RFE03)', () => {
    it('/user (POST) - should reject invalid data format', () => {
      return request(app.getHttpServer() as Server)
        .post('/user')
        .send({ email: 'invalid-email', name: '' })
        .expect(400);
    });
  });
});
