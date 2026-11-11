
import {
  Controller,
  Get,
  INestApplication,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import * as argon2 from 'argon2';

import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../src/auth/guards/roles.guard';
import { Roles } from '../src/auth/decorators/roles.decorator';
import { UserRole } from '../src/generated/prisma/enums';

@Controller('_e2e/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
class AdminOnlyTestController {
  @Get()
  getAdminResource() {
    return { message: 'Admin access granted' };
  }
}

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  const userEmail = 'auth-e2e@example.com';
  const adminEmail = 'auth-admin-e2e@example.com';
  const inactiveEmail = 'auth-inactive-e2e@example.com';
  const password = 'TestPassword123!';

  let userToken: string;
  let adminToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule =
      await Test.createTestingModule({
        imports: [AppModule],
        controllers: [AdminOnlyTestController],
      }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    prisma = app.get(PrismaService);

    const passwordHash = await argon2.hash(password);

    const emails = [userEmail, adminEmail, inactiveEmail];

    await prisma.user.deleteMany({
      where: { email: { in: emails } },
    });

    await prisma.user.createMany({
      data: [
        {
          email: userEmail,
          passwordHash,
          role: UserRole.USER,
          isActive: true,
        },
        {
          email: adminEmail,
          passwordHash,
          role: UserRole.ADMIN,
          isActive: true,
        },
        {
          email: inactiveEmail,
          passwordHash,
          role: UserRole.USER,
          isActive: false,
        },
      ],
    });

    await app.init();

    const userLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: userEmail, password });

    userToken = userLogin.body.accessToken;

    const adminLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: adminEmail, password });

    adminToken = adminLogin.body.accessToken;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [userEmail, adminEmail, inactiveEmail],
        },
      },
    });

    await app.close();
  });

  it('POST /auth/login should return an access token', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: userEmail, password })
      .expect(200)
      .expect((response) => {
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.tokenType).toBe('Bearer');
        expect(response.body.expiresIn).toBe(3600);
      });
  });

  it('POST /auth/login should reject an incorrect password', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: userEmail,
        password: 'WrongPassword123!',
      })
      .expect(401);
  });

  it('POST /auth/login should reject a nonexistent user', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password,
      })
      .expect(401);
  });

  it('POST /auth/login should reject an inactive user', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: inactiveEmail,
        password,
      })
      .expect(401);
  });

  it('POST /auth/login should reject invalid input', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'invalid-email',
        password: '',
      })
      .expect(400);
  });

  it('GET /_e2e/admin should reject requests without a token', async () => {
    return request(app.getHttpServer())
      .get('/_e2e/admin')
      .expect(401);
  });

  it('GET /_e2e/admin should reject a USER token', async () => {
    return request(app.getHttpServer())
      .get('/_e2e/admin')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });

  it('GET /_e2e/admin should allow an ADMIN token', async () => {
    return request(app.getHttpServer())
      .get('/_e2e/admin')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect({
        message: 'Admin access granted',
      });
  });
});
