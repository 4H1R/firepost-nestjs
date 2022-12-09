import request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';

import { createAppForTesting, actingAs, ActingAsResponse, createUser } from './helper.testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { messageFactory } from 'prisma/factories';

describe('Message', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let loginResponse: ActingAsResponse;

  beforeAll(async () => {
    const created = await createAppForTesting();
    app = created.app;
    prisma = created.prisma;
    loginResponse = await actingAs({ app, prisma });
  });

  describe('Find All', () => {
    it('users can get messaged users', async () => {
      const user = await createUser({
        prisma,
        data: {
          messages: {
            create: await messageFactory({ senderId: loginResponse.decodedId, userId: undefined }),
          },
        },
      });

      await createUser({
        prisma,
        data: {
          messages: { create: await messageFactory({ senderId: user.id, userId: undefined }) },
        },
      });

      const response = await request(app.getHttpServer())
        .get('/api/messages')
        .auth(loginResponse.accessToken, { type: 'bearer' })
        .expect(HttpStatus.OK);

      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].username).toBe(user.username);
    });
  });

  describe('Fine One', () => {
    it('users cannot get his messages', async () => {
      return request(app.getHttpServer())
        .get(`/api/users/${loginResponse.user.username}/messages`)
        .auth(loginResponse.accessToken, { type: 'bearer' })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('users can get messages of users', async () => {
      const user = await createUser({
        prisma,
        data: {
          messages: {
            create: await messageFactory({ senderId: loginResponse.decodedId, userId: undefined }),
          },
        },
      });

      await createUser({
        prisma,
        data: {
          messages: { create: await messageFactory({ senderId: user.id, userId: undefined }) },
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/api/users/${user.username}/messages`)
        .auth(loginResponse.accessToken, { type: 'bearer' })
        .expect(HttpStatus.OK);

      expect(response.body.data.length).toBe(1);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
