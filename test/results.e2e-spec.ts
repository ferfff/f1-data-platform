
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Results (e2e)', () => {
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

  it('GET /results - should return paginated results', async () => {
    const response = await request(app.getHttpServer())
      .get('/results')
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('meta');
    expect(response.body.meta.page).toBe(1);
    expect(response.body.meta.limit).toBe(20);
  });

  it('GET /results?season=2024 - should filter by season', async () => {
    const response = await request(app.getHttpServer())
      .get('/results?season=2024')
      .expect(200);

    expect(response.body.data.every(
      (result: { raceSession: { race: { season: { year: number } } } }) =>
        result.raceSession.race.season.year === 2024,
    )).toBe(true);
  });

  it('GET /results?raceId=1 - should filter by race', async () => {
    const response = await request(app.getHttpServer())
      .get('/results?raceId=1')
      .expect(200);

    expect(response.body.data.every(
      (result: { raceSession: { raceId: number } }) =>
        result.raceSession.raceId === 1,
    )).toBe(true);
  });

  it('GET /results?sessionType=RACE - should filter by session type', async () => {
    const response = await request(app.getHttpServer())
      .get('/results?sessionType=RACE')
      .expect(200);

    expect(response.body.data.every(
      (result: { raceSession: { type: string } }) =>
        result.raceSession.type === 'RACE',
    )).toBe(true);
  });

  it('GET /results?driverId=1 - should filter by driver', async () => {
    const response = await request(app.getHttpServer())
      .get('/results?driverId=1')
      .expect(200);

    expect(response.body.data.every(
      (result: { driverId: number }) => result.driverId === 1,
    )).toBe(true);
  });

  it('GET /results?constructorId=1 - should filter by constructor', async () => {
    const response = await request(app.getHttpServer())
      .get('/results?constructorId=1')
      .expect(200);

    expect(response.body.data.every(
      (result: { constructorId: number }) => result.constructorId === 1,
    )).toBe(true);
  });

  it('GET /results?search=verstappen - should search by driver', async () => {
    const response = await request(app.getHttpServer())
      .get('/results?search=verstappen')
      .expect(200);

    expect(response.body.data.every(
      (result: { driver: { firstName: string; lastName: string; driverRef: string } }) => {
        const driver = result.driver;
        const search = 'verstappen';

        return (
          driver.firstName.toLowerCase().includes(search) ||
          driver.lastName.toLowerCase().includes(search) ||
          driver.driverRef.toLowerCase().includes(search)
        );
      },
    )).toBe(true);
  });

  it('GET /results?page=0 - should reject invalid page', async () => {
    await request(app.getHttpServer()).get('/results?page=0').expect(400);
  });

  it('GET /results?limit=101 - should reject limit above maximum', async () => {
    await request(app.getHttpServer()).get('/results?limit=101').expect(400);
  });

  it('GET /results?sessionType=INVALID - should reject invalid session type', async () => {
    await request(app.getHttpServer())
      .get('/results?sessionType=INVALID')
      .expect(400);
  });

  it('GET /results/:id - should return an existing result', async () => {
    const listResponse = await request(app.getHttpServer())
      .get('/results?limit=1')
      .expect(200);

    if (listResponse.body.data.length > 0) {
      const id = listResponse.body.data[0].id;

      const response = await request(app.getHttpServer())
        .get(`/results/${id}`)
        .expect(200);

      expect(response.body.id).toBe(id);
    }
  });

  it('GET /results/999999 - should return 404 when result does not exist', async () => {
    await request(app.getHttpServer()).get('/results/999999').expect(404);
  });

  it('GET /results/abc - should reject non-numeric ID', async () => {
    await request(app.getHttpServer()).get('/results/abc').expect(400);
  });
});
