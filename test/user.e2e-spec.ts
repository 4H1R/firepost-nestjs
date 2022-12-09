import request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';

import { createAppForTesting, actingAs, createUser, ActingAsResponse } from './helper.testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { userFactory } from 'prisma/factories';

describe('User', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let loginResponse: ActingAsResponse;

  beforeAll(async () => {
    const created = await createAppForTesting();
    app = created.app;
    prisma = created.prisma;
    loginResponse = await actingAs({ app, prisma });
  });

  describe('Me', () => {
    it('guest users cannot get their information', async () => {
      return request(app.getHttpServer()).get('/api/users/me').expect(HttpStatus.UNAUTHORIZED);
    });

    it('users can get their information', async () => {
      const { accessToken } = await actingAs({ prisma, app });

      const response = await request(app.getHttpServer())
        .get('/api/users/me')
        .auth(accessToken, { type: 'bearer' })
        .expect(HttpStatus.OK);

      expect(response.body.email).toBeDefined();
    });
  });

  describe('Find All', () => {
    it('users can get all users', async () => {
      return request(app.getHttpServer())
        .get('/api/users')
        .auth(loginResponse.accessToken, { type: 'bearer' })
        .expect(HttpStatus.OK);
    });

    it('users can search for specific user', async () => {
      await createUser({ prisma });
      const user = await createUser({ prisma });

      const response = await request(app.getHttpServer())
        .get('/api/users')
        .query({ query: user.username })
        .auth(loginResponse.accessToken, { type: 'bearer' })
        .expect(HttpStatus.OK);

      expect(response.body.data.length).toBe(1);
    });
  });

  describe('Find One', () => {
    it('users can get one user', async () => {
      return request(app.getHttpServer())
        .get(`/api/users/${loginResponse.user.username}`)
        .auth(loginResponse.accessToken, { type: 'bearer' })
        .expect(HttpStatus.OK);
    });

    it('users cannot get invalid user', async () => {
      return request(app.getHttpServer())
        .get(`/api/users/invalid.user`)
        .auth(loginResponse.accessToken, { type: 'bearer' })
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('Update', () => {
    it('users can update their own account', async () => {
      const name = 'New Name';

      const response = await request(app.getHttpServer())
        .patch(`/api/users/${loginResponse.user.username}`)
        .send({ name })
        .auth(loginResponse.accessToken, { type: 'bearer' })
        .expect(HttpStatus.OK);

      expect(response.body.name).toMatch(name);
    });

    it('users cannot update another user account', async () => {
      const user = await createUser({ prisma, data: await userFactory() });

      return request(app.getHttpServer())
        .patch(`/api/users/${user.username}`)
        .auth(loginResponse.accessToken, { type: 'bearer' })
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('Delete', () => {
    it('users can delete their accounts', async () => {
      await request(app.getHttpServer())
        .delete(`/api/users/${loginResponse.user.username}`)
        .auth(loginResponse.accessToken, { type: 'bearer' })
        .expect(HttpStatus.OK);

      const result = await prisma.user.findUnique({ where: { email: loginResponse.user.email } });
      expect(result).toBeNull();
    });

    it('users cannot delete other users accounts', async () => {
      const user = await createUser({ prisma, data: await userFactory() });

      await request(app.getHttpServer())
        .delete(`/api/users/${user.username}`)
        .auth(loginResponse.accessToken, { type: 'bearer' })
        .expect(HttpStatus.UNAUTHORIZED);

      const result = await prisma.user.findUnique({ where: { email: user.email } });
      expect(result).toBeDefined();
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
