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
        .send({ email: user.email, password: 'password', deviceName: 'Samsung S21' })
        .expect(HttpStatus.OK);
    });

    it('users cannot login with incorrect password', async () => {
      const user = await createUser({ prisma });

      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: user.email, password: 'wrong-password', deviceName: 'Samsung S21' })
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);
    });
  });

  describe('Register', () => {
    it('users can register', async () => {
      const data = await userFactory();

      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ ...data, password: 'password', deviceName: 'Samsung S21' })
        .expect(HttpStatus.CREATED);
    });

    it('users cannot register with duplicate email', async () => {
      const user = await createUser({ prisma });
      const data = await userFactory();

      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ ...data, username: user.username, deviceName: 'Samsung S21' })
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('users cannot register with duplicate username', async () => {
      const user = await createUser({ prisma });
      const data = await userFactory();

      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ ...data, email: user.email, deviceName: 'Samsung S21' })
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);
    });
  });

  describe('Logout', () => {
    it('users can logout', async () => {
      const { accessToken } = await actingAs({ prisma, app });
      const lastAccessToken = await prisma.accessToken.findFirst({ orderBy: { id: 'desc' } });

      await request(app.getHttpServer())
        .post('/api/auth/logout')
        .auth(accessToken, { type: 'bearer' })
        .expect(HttpStatus.OK);

      const result = await prisma.accessToken.findUnique({ where: { id: lastAccessToken.id } });
      expect(result).toBeNull();
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
