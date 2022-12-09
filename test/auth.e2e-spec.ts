import request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';

import { createAppForTesting, createUser, actingAs } from './helper.testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { userFactory } from 'prisma/factories';

describe('Auth', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const created = await createAppForTesting();
    app = created.app;
    prisma = created.prisma;
  });

  describe('Login', () => {
    it('users can login with correct information', async () => {
      const user = await createUser({ prisma });

      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: user.email, password: 'password' })
        .expect(HttpStatus.OK);
    });

    it('users cannot login with incorrect password', async () => {
      const user = await createUser({ prisma });

      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: user.email, password: 'wrong-password' })
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);
    });
  });

  describe('Register', () => {
    it('users can register', async () => {
      const data = await userFactory();

      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ ...data, password: 'password' })
        .expect(HttpStatus.CREATED);
    });

    it('users cannot register with duplicate email', async () => {
      const user = await createUser({ prisma });
      const data = await userFactory();

      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ ...data, username: user.username })
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('users cannot register with duplicate username', async () => {
      const user = await createUser({ prisma });
      const data = await userFactory();

      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ ...data, email: user.email })
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);
    });
  });

  describe('Refresh', () => {
    it('users can get a new access token', async () => {
      const { refreshToken } = await actingAs({ prisma, app });

      const response = await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({ refresh: refreshToken })
        .expect(HttpStatus.OK);

      expect(response.body.refreshToken).toBe(refreshToken);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
