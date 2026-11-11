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
      .expect((response) => {
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.meta).toBeDefined();
        expect(response.body.meta.total).toBeDefined();
        expect(response.body.meta.page).toBe(1);
        expect(response.body.meta.limit).toBe(20);
        expect(response.body.meta.totalPages).toBeDefined();
      });
  });

  it('/drivers?page=0 (GET)', async () => {
    return request(app.getHttpServer())
      .get('/drivers?page=0')
      .expect(400);
  });

  it('/drivers?search=max (GET)', async () => {
    return request(app.getHttpServer())
      .get('/drivers?search=max')
      .expect(200)
      .expect((response) => {
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.meta).toBeDefined();
      });
  });

  it('/drivers?limit=101 (GET)', async () => {
    return request(app.getHttpServer())
      .get('/drivers?limit=101')
      .expect(400);
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