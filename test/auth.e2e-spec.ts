import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';

import { createAppForTesting, createUser, userData, actingAs } from './helper.testing';
import { PrismaService } from 'src/prisma/prisma.service';

describe('Auth', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const created = await createAppForTesting();
    app = created.app;
    prisma = created.prisma;
  });

  beforeEach(async () => {
    await prisma.clearDatabase();
  });

  describe('Login', () => {
    it('users can login with correct information', async () => {
      await createUser({ prisma });

      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'test@email.com', password: 'password' })
        .expect(HttpStatus.OK);
    });

    it('users cannot login with incorrect password', async () => {
      await createUser({ prisma });

      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'test@email.com', password: 'wrong-password' })
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);
    });
  });

  describe('Register', () => {
    it('users can register', async () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send(userData)
        .expect(HttpStatus.CREATED);
    });

    it('users cannot register with duplicate email', async () => {
      await createUser({ prisma });

      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ ...userData, username: 'another.username' })
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('users cannot register with duplicate username', async () => {
      await createUser({ prisma });

      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ ...userData, email: 'another@email.com' })
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);
    });
  });

  describe('Me', () => {
    it('guest users cannot get their information', async () => {
      return request(app.getHttpServer()).get('/api/auth/me').expect(HttpStatus.UNAUTHORIZED);
    });

    it('users can get their information', async () => {
      const { accessToken } = await actingAs({ prisma, app });

      const response = await request(app.getHttpServer())
        .get('/api/auth/me')
        .auth(accessToken, { type: 'bearer' })
        .expect(HttpStatus.OK);

      expect(response.body.email).toBeDefined();
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
