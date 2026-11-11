import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Races (e2e)', () => {
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

  it('GET /races - should return paginated races', async () => {
    const response = await request(app.getHttpServer())
      .get('/races')
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('meta');
    expect(response.body.meta.page).toBe(1);
    expect(response.body.meta.limit).toBe(20);
  });

  it('GET /races?search=monaco - should filter by name', async () => {
    const response = await request(app.getHttpServer())
      .get('/races?search=monaco')
      .expect(200);

    expect(
      response.body.data.every(
        (race: { name: string }) =>
          race.name.toLowerCase().includes('monaco'),
      ),
    ).toBe(true);
  });

  it('GET /races?season=2024 - should filter by season', async () => {
    const response = await request(app.getHttpServer())
        .get('/races?season=2024')
        .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('meta');
    expect(
        response.body.data.every(
        (race: { seasonId: number }) => race.seasonId > 0,
        ),
    ).toBe(true);
    });

  it('GET /races?circuitId=1 - should filter by circuit', async () => {
    const response = await request(app.getHttpServer())
      .get('/races?circuitId=1')
      .expect(200);

    expect(
      response.body.data.every(
        (race: { circuitId: number }) => race.circuitId === 1,
      ),
    ).toBe(true);
  });

  it('GET /races?page=0 - should reject invalid page', async () => {
    await request(app.getHttpServer()).get('/races?page=0').expect(400);
  });

  it('GET /races?limit=101 - should reject limit above maximum', async () => {
    await request(app.getHttpServer()).get('/races?limit=101').expect(400);
  });

  it('GET /races?season=abc - should reject invalid season', async () => {
    await request(app.getHttpServer()).get('/races?season=abc').expect(400);
  });

  it('GET /races/:id - should return an existing race', async () => {
    const listResponse = await request(app.getHttpServer())
      .get('/races?limit=1')
      .expect(200);

    if (listResponse.body.data.length > 0) {
      const id = listResponse.body.data[0].id;

      const response = await request(app.getHttpServer())
        .get(`/races/${id}`)
        .expect(200);

      expect(response.body.id).toBe(id);
    }
  });

  it('GET /races/999999 - should return 404 when race does not exist', async () => {
    await request(app.getHttpServer()).get('/races/999999').expect(404);
  });

  it('GET /races/abc - should reject non-numeric ID', async () => {
    await request(app.getHttpServer()).get('/races/abc').expect(400);
  });
});