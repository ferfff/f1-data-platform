
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Constructors (e2e)', () => {
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

  it('/constructors (GET)', async () => {
    return request(app.getHttpServer())
      .get('/constructors')
      .expect(200)
      .expect((response) => {
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.meta.page).toBe(1);
        expect(response.body.meta.limit).toBe(20);
        expect(response.body.meta.total).toBeDefined();
        expect(response.body.meta.totalPages).toBeDefined();
      });
  });

  it('/constructors?search=red (GET)', async () => {
    return request(app.getHttpServer())
      .get('/constructors?search=red')
      .expect(200)
      .expect((response) => {
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.meta).toBeDefined();
      });
  });

  it('/constructors?page=0 (GET)', async () => {
    return request(app.getHttpServer())
      .get('/constructors?page=0')
      .expect(400);
  });

  it('/constructors?limit=101 (GET)', async () => {
    return request(app.getHttpServer())
      .get('/constructors?limit=101')
      .expect(400);
  });

  it('/constructors/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/constructors')
      .expect(200);

    const firstConstructor = response.body.data[0];

    if (firstConstructor) {
      await request(app.getHttpServer())
        .get(`/constructors/${firstConstructor.id}`)
        .expect(200)
        .expect((detailResponse) => {
          expect(detailResponse.body.id).toBe(firstConstructor.id);
          expect(detailResponse.body.name).toBeDefined();
        });
    }
  });

  it('/constructors/abc (GET)', async () => {
    return request(app.getHttpServer())
      .get('/constructors/abc')
      .expect(400);
  });

  it('/constructors/999999 (GET)', async () => {
    return request(app.getHttpServer())
      .get('/constructors/999999')
      .expect(404);
  });

  afterAll(async () => {
    await app.close();
  });
});
