
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Race Sessions (e2e)', () => {
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

  it('GET /race-sessions - should return paginated sessions', async () => {
    const response = await request(app.getHttpServer())
      .get('/race-sessions')
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('meta');
    expect(response.body.meta.page).toBe(1);
    expect(response.body.meta.limit).toBe(20);
  });

  it('GET /race-sessions?raceId=1 - should filter by race', async () => {
    const response = await request(app.getHttpServer())
      .get('/race-sessions?raceId=1')
      .expect(200);

    expect(
      response.body.data.every(
        (session: { raceId: number }) => session.raceId === 1,
      ),
    ).toBe(true);
  });

  it('GET /race-sessions?season=2024 - should filter by season', async () => {
    const response = await request(app.getHttpServer())
      .get('/race-sessions?season=2024')
      .expect(200);

    expect(
      response.body.data.every(
        (session: { race: { season: { year: number } } }) =>
          session.race.season.year === 2024,
      ),
    ).toBe(true);
  });

  it('GET /race-sessions?type=RACE - should filter by session type', async () => {
    const response = await request(app.getHttpServer())
      .get('/race-sessions?type=RACE')
      .expect(200);

    expect(
      response.body.data.every(
        (session: { type: string }) => session.type === 'RACE',
      ),
    ).toBe(true);
  });

  it('GET /race-sessions?page=2&limit=5 - should paginate results', async () => {
    const response = await request(app.getHttpServer())
      .get('/race-sessions?page=2&limit=5')
      .expect(200);

    expect(response.body.meta.page).toBe(2);
    expect(response.body.meta.limit).toBe(5);
  });

  it('GET /race-sessions?page=0 - should reject invalid page', async () => {
    await request(app.getHttpServer())
      .get('/race-sessions?page=0')
      .expect(400);
  });

  it('GET /race-sessions?limit=101 - should reject limit above maximum', async () => {
    await request(app.getHttpServer())
      .get('/race-sessions?limit=101')
      .expect(400);
  });

  it('GET /race-sessions?type=INVALID - should reject invalid session type', async () => {
    await request(app.getHttpServer())
      .get('/race-sessions?type=INVALID')
      .expect(400);
  });

  it('GET /race-sessions?raceId=abc - should reject non-numeric race ID', async () => {
    await request(app.getHttpServer())
      .get('/race-sessions?raceId=abc')
      .expect(400);
  });

  it('GET /race-sessions/:id - should return an existing session', async () => {
    const listResponse = await request(app.getHttpServer())
      .get('/race-sessions?limit=1')
      .expect(200);

    if (listResponse.body.data.length > 0) {
      const id = listResponse.body.data[0].id;

      const response = await request(app.getHttpServer())
        .get(`/race-sessions/${id}`)
        .expect(200);

      expect(response.body.id).toBe(id);
      expect(response.body).toHaveProperty('race');
      expect(response.body).toHaveProperty('results');
    }
  });

  it('GET /race-sessions/999999 - should return 404 when session does not exist', async () => {
    await request(app.getHttpServer())
      .get('/race-sessions/999999')
      .expect(404);
  });

  it('GET /race-sessions/abc - should reject non-numeric ID', async () => {
    await request(app.getHttpServer())
      .get('/race-sessions/abc')
      .expect(400);
  });
});
