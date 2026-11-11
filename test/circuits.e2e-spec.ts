import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Circuits (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    await app.init();
  });

  it('/circuits (GET)', async () => {
    return request(app.getHttpServer())
      .get('/circuits')
      .expect(200)
      .expect((response) => {
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.meta.page).toBe(1);
        expect(response.body.meta.limit).toBe(20);
        expect(response.body.meta.total).toBeDefined();
        expect(response.body.meta.totalPages).toBeDefined();
      });
  });

  it('/circuits?search=monza (GET)', async () => {
    return request(app.getHttpServer())
      .get('/circuits?search=monza')
      .expect(200)
      .expect((response) => {
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.meta).toBeDefined();
      });
  });

  it('/circuits?page=0 (GET)', async () => {
    return request(app.getHttpServer())
      .get('/circuits?page=0')
      .expect(400);
  });

  it('/circuits?limit=101 (GET)', async () => {
    return request(app.getHttpServer())
      .get('/circuits?limit=101')
      .expect(400);
  });

  it('/circuits/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/circuits')
      .expect(200);

    const firstCircuit = response.body.data[0];

    if (firstCircuit) {
      await request(app.getHttpServer())
        .get(`/circuits/${firstCircuit.id}`)
        .expect(200)
        .expect((detailResponse) => {
          expect(detailResponse.body.id).toBe(firstCircuit.id);
          expect(detailResponse.body.name).toBeDefined();
        });
    }
  });

  it('/circuits/abc (GET)', async () => {
    return request(app.getHttpServer())
      .get('/circuits/abc')
      .expect(400);
  });

  it('/circuits/999999 (GET)', async () => {
    return request(app.getHttpServer())
      .get('/circuits/999999')
      .expect(404);
  });

  afterAll(async () => {
    await app.close();
  });
});
