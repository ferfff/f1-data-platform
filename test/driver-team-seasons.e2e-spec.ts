
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Driver Team Seasons (e2e)', () => {
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

  it('GET /driver-team-seasons - should return paginated data', async () => {
    const response = await request(app.getHttpServer())
      .get('/driver-team-seasons')
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('meta');
    expect(response.body.meta.page).toBe(1);
    expect(response.body.meta.limit).toBe(20);
  });

  it('should filter by season', async () => {
    const response = await request(app.getHttpServer())
      .get('/driver-team-seasons?season=2024')
      .expect(200);

    expect(
      response.body.data.every(
        (item: { season: { year: number } }) =>
          item.season.year === 2024,
      ),
    ).toBe(true);
  });

  it('should filter by driver', async () => {
    const response = await request(app.getHttpServer())
      .get('/driver-team-seasons?driverId=1')
      .expect(200);

    expect(
      response.body.data.every(
        (item: { driverId: number }) => item.driverId === 1,
      ),
    ).toBe(true);
  });

  it('should filter by constructor', async () => {
    const response = await request(app.getHttpServer())
      .get('/driver-team-seasons?constructorId=1')
      .expect(200);

    expect(
      response.body.data.every(
        (item: { constructorId: number }) => item.constructorId === 1,
      ),
    ).toBe(true);
  });

  it('should filter by driver number', async () => {
    const response = await request(app.getHttpServer())
      .get('/driver-team-seasons?number=33')
      .expect(200);

    expect(
      response.body.data.every(
        (item: { number: number }) => item.number === 33,
      ),
    ).toBe(true);
  });

  it('should paginate results', async () => {
    const response = await request(app.getHttpServer())
      .get('/driver-team-seasons?page=2&limit=5')
      .expect(200);

    expect(response.body.meta.page).toBe(2);
    expect(response.body.meta.limit).toBe(5);
  });

  it('should reject invalid season', async () => {
    await request(app.getHttpServer())
      .get('/driver-team-seasons?season=abc')
      .expect(400);
  });

  it('should reject invalid driver ID', async () => {
    await request(app.getHttpServer())
      .get('/driver-team-seasons?driverId=abc')
      .expect(400);
  });

  it('should reject number above maximum', async () => {
    await request(app.getHttpServer())
      .get('/driver-team-seasons?number=100')
      .expect(400);
  });

  it('should reject invalid page', async () => {
    await request(app.getHttpServer())
      .get('/driver-team-seasons?page=0')
      .expect(400);
  });

  it('should reject limit above maximum', async () => {
    await request(app.getHttpServer())
      .get('/driver-team-seasons?limit=101')
      .expect(400);
  });

  it('should return an existing record by ID', async () => {
    const listResponse = await request(app.getHttpServer())
      .get('/driver-team-seasons?limit=1')
      .expect(200);

    if (listResponse.body.data.length > 0) {
      const id = listResponse.body.data[0].id;

      const response = await request(app.getHttpServer())
        .get(`/driver-team-seasons/${id}`)
        .expect(200);

      expect(response.body.id).toBe(id);
      expect(response.body).toHaveProperty('driver');
      expect(response.body).toHaveProperty('constructor');
      expect(response.body).toHaveProperty('season');
    }
  });

  it('should return 404 for a nonexistent ID', async () => {
    await request(app.getHttpServer())
      .get('/driver-team-seasons/999999')
      .expect(404);
  });

  it('should reject a non-numeric ID', async () => {
    await request(app.getHttpServer())
      .get('/driver-team-seasons/abc')
      .expect(400);
  });
});
