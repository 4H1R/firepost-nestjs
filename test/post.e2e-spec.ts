import request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';

import { createAppForTesting, actingAs, ActingAsResponse } from './helper.testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { postFactory } from 'prisma/factories';
import { hashIds } from 'src/utils';

describe('Post', () => {
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
    it('users can get all posts', async () => {
      return request(app.getHttpServer())
        .get('/api/posts')
        .auth(loginResponse.accessToken, { type: 'bearer' })
        .expect(HttpStatus.OK);
    });
  });

  describe('Find One', () => {
    it('users can get one post', async () => {
      const post = await prisma.post.create({
        data: postFactory({ userId: loginResponse.decodedId }),
      });

      return request(app.getHttpServer())
        .get(`/api/posts/${hashIds.encode(post.id)}`)
        .auth(loginResponse.accessToken, { type: 'bearer' })
        .expect(HttpStatus.OK);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
