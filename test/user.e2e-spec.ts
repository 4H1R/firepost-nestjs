import request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';

import {
  createAppForTesting,
  actingAs,
  createUser,
  userData,
  ActingAsResponse,
} from './helper.testing';
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
  });

  beforeEach(async () => {
    await prisma.clearDatabase();
    loginResponse = await actingAs({ app, prisma });
  });

  describe('Find All', () => {
    it('users can get all users', async () => {
      return request(app.getHttpServer())
        .get('/api/users')
        .auth(loginResponse.accessToken, { type: 'bearer' })
        .expect(HttpStatus.OK);
    });

    it('users can search for specific user', async () => {
      await createUser({
        prisma,
        data: { email: 'user@email.com', username: 'another.user' },
      });

      const response = await request(app.getHttpServer())
        .get('/api/users')
        .query({ query: 'another.user' })
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
      const fakeUser = await userFactory();
      const user = await createUser({ prisma, data: fakeUser });

      return request(app.getHttpServer())
        .patch(`/api/users/${user.username}`)
        .auth(loginResponse.accessToken, { type: 'bearer' })
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('Followers', () => {
    it('users can see other users followers', async () => {
      const follower = await createUser({ prisma, data: await userFactory() });
      await prisma.userFollower.create({
        data: { userId: loginResponse.decodedId, followerId: follower.id },
      });

      const response = await request(app.getHttpServer())
        .get(`/api/users/${loginResponse.user.username}/followers`)
        .auth(loginResponse.accessToken, { type: 'bearer' })
        .expect(HttpStatus.OK);

      expect(response.body.data.length).toBe(1);
    });
  });

  describe('Follow', () => {
    it('users cannot follow themselves', async () => {
      await request(app.getHttpServer())
        .post(`/api/users/${loginResponse.user.username}/followers`)
        .auth(loginResponse.accessToken, { type: 'bearer' })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('users can follow other users', async () => {
      const user = await createUser({ prisma, data: await userFactory() });

      await request(app.getHttpServer())
        .post(`/api/users/${user.username}/followers`)
        .auth(loginResponse.accessToken, { type: 'bearer' })
        .expect(HttpStatus.CREATED);
    });

    it('users can follow other users twice without a problem', async () => {
      const user = await createUser({ prisma, data: await userFactory() });
      await prisma.userFollower.create({
        data: { userId: user.id, followerId: loginResponse.decodedId },
      });

      await request(app.getHttpServer())
        .post(`/api/users/${user.username}/followers`)
        .auth(loginResponse.accessToken, { type: 'bearer' })
        .expect(HttpStatus.CREATED);
    });
  });

  describe('UnFollow', () => {
    it('users cannot un follow themselves', async () => {
      await request(app.getHttpServer())
        .delete(`/api/users/${loginResponse.user.username}/followers`)
        .auth(loginResponse.accessToken, { type: 'bearer' })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('users can un follow other users', async () => {
      const user = await createUser({ prisma, data: await userFactory() });
      const data = { userId: user.id, followerId: loginResponse.decodedId };
      await prisma.userFollower.create({ data });

      await request(app.getHttpServer())
        .delete(`/api/users/${user.username}/followers`)
        .auth(loginResponse.accessToken, { type: 'bearer' })
        .expect(HttpStatus.OK);

      const result = await prisma.userFollower.findUnique({ where: { userId_followerId: data } });
      expect(result).toBeNull();
    });
  });

  describe('Followings', () => {
    it('users can see other users followings', async () => {
      const user = await createUser({ prisma, data: await userFactory() });
      await prisma.userFollower.create({
        data: { followerId: loginResponse.decodedId, userId: user.id },
      });

      const response = await request(app.getHttpServer())
        .get(`/api/users/${loginResponse.user.username}/followings`)
        .auth(loginResponse.accessToken, { type: 'bearer' })
        .expect(HttpStatus.OK);

      expect(response.body.data.length).toBe(1);
    });
  });

  describe('Delete', () => {
    it('users can delete their accounts', async () => {
      await request(app.getHttpServer())
        .delete(`/api/users/${loginResponse.user.username}`)
        .auth(loginResponse.accessToken, { type: 'bearer' })
        .expect(HttpStatus.OK);

      const result = await prisma.user.findUnique({ where: { email: userData.email } });
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
