import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/health (GET)', async () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect((response) => {
        expect(response.body.status).toBe('OK');
        expect(response.body.database).toBe('CONNECTED');
        expect(response.body.service).toBe('f1-data-platform');
        expect(response.body.timestamp).toBeDefined();
      });
  });

  it('/drivers (GET)', async () => {
    return request(app.getHttpServer())
      .get('/drivers')
      .expect(200)
      .expect(Array);
  });

  it('/drivers/abc (GET) should return 400', async () => {
    return request(app.getHttpServer())
      .get('/drivers/abc')
      .expect(400);
  });

  afterAll(async () => {
    await app.close();
  });
});