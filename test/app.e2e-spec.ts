import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('CORS Enforcement (e2e)', () => {
  let app: INestApplication<App>;
  const allowedOrigin = 'https://rick.tllo.app';

  beforeEach(async () => {
    process.env.FREDERICKSEN_WEB_URL = 'https://rick.tllo.app/';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    const frontend = process.env.FREDERICKSEN_WEB_URL;
    const sanitizedOrigin =
      frontend && frontend.endsWith('/') ? frontend.slice(0, -1) : frontend;

    app.enableCors({
      origin: sanitizedOrigin,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
      allowedHeaders: 'Content-Type,Accept,Authorization',
    });

    await app.init();
  });

  it('should allow requests from the configured sanitized origin', async () => {
    const response = await request(app.getHttpServer())
      .get('/')
      .set('Origin', allowedOrigin);

    expect(response.headers['access-control-allow-origin']).toBe(allowedOrigin);
    expect(response.status).toBe(200);
  });

  it('should block requests from unauthorized origins', async () => {
    const response = await request(app.getHttpServer())
      .get('/')
      .set('Origin', 'https://malicious-domain.com');

    expect(response.headers['access-control-allow-origin']).toBeUndefined();
  });

  afterEach(async () => {
    await app.close();
  });
});
