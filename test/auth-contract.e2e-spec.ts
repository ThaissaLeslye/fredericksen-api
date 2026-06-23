import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/modules/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import cookieParser from 'cookie-parser';

describe('Cross-Repo Authentication Contract (Vue 3 <-> NestJS)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let seedUser: { id: string; email: string };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    jwtService = moduleFixture.get<JwtService>(JwtService);
    await app.init();

    seedUser = await prisma.user.create({
      data: {
        email: 'contract_test@fredericksen.local',
        name: 'Contract Inspector',
        googleId: 'google-contract-id-999',
        profile: { create: {} },
      },
    });
  });

  it('should authorize requests exclusively when the frontend supplies credentials under the access_token cookie key', async () => {
    const payload = { sub: seedUser.id, email: seedUser.email };
    const validToken = jwtService.sign(payload);

    await request(app.getHttpServer())
      .get('/profile/me')
      .set('Cookie', [`access_token=${validToken}`])
      .expect(200);

    await request(app.getHttpServer())
      .get('/profile/me')
      .set('Cookie', [`invalid_contract_key=${validToken}`])
      .expect(401);
  });

  it('should return a /user/me payload schema that complies with the frontend store model', async () => {
    const payload = { sub: seedUser.id, email: seedUser.email };
    const validToken = jwtService.sign(payload);

    const response = await request(app.getHttpServer())
      .get('/user/me')
      .set('Cookie', [`access_token=${validToken}`])
      .expect(200);

    const data = response.body as Record<string, unknown>;

    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('name');
    expect(data).toHaveProperty('email');
    expect(data).toHaveProperty('photoUrl');
    expect(data.email).toBe(seedUser.email);
  });

  afterAll(async () => {
    if (seedUser?.id) {
      await prisma.user.delete({ where: { id: seedUser.id } });
    }
    await app.close();
  });
});
