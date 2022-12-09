import request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';

import { createAppForTesting, actingAs, createUser, ActingAsResponse } from './helper.testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { userFactory } from 'prisma/factories';

describe('User Followers', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let loginResponse: ActingAsResponse;

  beforeAll(async () => {
    const created = await createAppForTesting();
    app = created.app;
    prisma = created.prisma;
    loginResponse = await actingAs({ app, prisma });
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

      await request(app.getHttpServer())
        .get(`/api/users/${loginResponse.user.username}/followings`)
        .auth(loginResponse.accessToken, { type: 'bearer' })
        .expect(HttpStatus.OK);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
