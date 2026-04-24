import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { Server } from 'http';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../src/modules/prisma/prisma.service';
import cookieParser from 'cookie-parser';
import { Profile } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

describe('Auth (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let testUser: { id: string; email: string };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    jwtService = moduleFixture.get<JwtService>(JwtService);

    await app.init();

    testUser = await prisma.user.create({
      data: {
        email: 'dev_test@example.com',
        name: 'Deva Teste',
        googleId: 'google-123',
      },
    });
  });

  it('/profile (GET) - deve falhar se não houver cookie', () => {
    const server = app.getHttpServer() as unknown as Server;

    return request(server).get('/profile').expect(401);
  });

  it('/profile/me (GET) - deve ter sucesso com cookie válido', () => {
    const payload = { sub: testUser.id, email: testUser.email };
    const secret = process.env.JWT_SECRET;
    const validToken = jwtService.sign(payload, { secret });

    interface UserProfileResponse {
      id: string;
      name: string;
      email: string;
      photoUrl: string;
      profile: Profile;
    }

    const server = app.getHttpServer() as unknown as Server;

    return request(server)
      .get('/profile/me')
      .set('Cookie', [`access_token=${validToken}`])
      .expect(200)
      .expect((res) => {
        const body = res.body as UserProfileResponse;
        expect(body.email).toBe(payload.email);
      });
  });

  afterAll(async () => {
    if (testUser) {
      await prisma.user.delete({ where: { id: testUser.id } });
    }
    await app.close();
  });
});
