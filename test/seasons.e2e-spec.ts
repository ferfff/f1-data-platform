import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Seasons (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /seasons - should return paginated seasons', async () => {
    const response = await request(app.getHttpServer())
      .get('/seasons')
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('meta');
    expect(response.body.meta).toHaveProperty('total');
    expect(response.body.meta).toHaveProperty('page', 1);
    expect(response.body.meta).toHaveProperty('limit', 20);
  });

  it('GET /seasons?search=2024 - should filter by year', async () => {
    const response = await request(app.getHttpServer())
      .get('/seasons?search=2024')
      .expect(200);

    expect(
    response.body.data.every(
        (season: { year: number }) => season.year === 2024,
    ),
    ).toBe(true);
  });

  it('GET /seasons?page=0 - should reject invalid page', async () => {
    await request(app.getHttpServer()).get('/seasons?page=0').expect(400);
  });

  it('GET /seasons?limit=101 - should reject limit above maximum', async () => {
    await request(app.getHttpServer()).get('/seasons?limit=101').expect(400);
  });

  it('GET /seasons/:id - should return an existing season', async () => {
    const listResponse = await request(app.getHttpServer())
      .get('/seasons?limit=1')
      .expect(200);

    if (listResponse.body.data.length > 0) {
      const id = listResponse.body.data[0].id;

      const response = await request(app.getHttpServer())
        .get(`/seasons/${id}`)
        .expect(200);

      expect(response.body.id).toBe(id);
    }
  });

  it('GET /seasons/999999 - should return 404 when season does not exist', async () => {
    await request(app.getHttpServer()).get('/seasons/999999').expect(404);
  });

  it('GET /seasons/abc - should reject non-numeric ID', async () => {
    await request(app.getHttpServer()).get('/seasons/abc').expect(400);
  });
});