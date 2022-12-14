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

  describe('Home', () => {
    it('users can get all home posts', async () => {
      return request(app.getHttpServer())
        .get('/api/posts/home')
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

  describe('Likers', () => {
    it('users can get list of post likers', async () => {
      const post = await prisma.post.create({
        data: postFactory({ userId: loginResponse.decodedId }),
      });

      return request(app.getHttpServer())
        .get(`/api/posts/${hashIds.encode(post.id)}/likes`)
        .auth(loginResponse.accessToken, { type: 'bearer' })
        .expect(HttpStatus.OK);
    });
  });

  describe('Like', () => {
    it('users can like posts', async () => {
      const post = await prisma.post.create({
        data: postFactory({ userId: loginResponse.decodedId }),
      });

      await request(app.getHttpServer())
        .post(`/api/posts/${hashIds.encode(post.id)}/likes`)
        .auth(loginResponse.accessToken, { type: 'bearer' })
        .expect(HttpStatus.CREATED);

      const result = await prisma.postLike.findUnique({
        where: {
          userId_postId: {
            userId: post.userId,
            postId: post.id,
          },
        },
      });

      expect(result).toBeDefined();
    });
  });

  describe('UnLike', () => {
    it('users can un like posts', async () => {
      const post = await prisma.post.create({
        data: postFactory({ userId: loginResponse.decodedId }),
      });

      await request(app.getHttpServer())
        .delete(`/api/posts/${hashIds.encode(post.id)}/likes`)
        .auth(loginResponse.accessToken, { type: 'bearer' })
        .expect(HttpStatus.OK);

      const result = await prisma.postLike.findUnique({
        where: {
          userId_postId: {
            userId: post.userId,
            postId: post.id,
          },
        },
      });

      expect(result).toBeNull();
    });
  });

  describe('Saved', () => {
    it('users can get list of posts that they saved', async () => {
      return request(app.getHttpServer())
        .get(`/api/posts/saved`)
        .auth(loginResponse.accessToken, { type: 'bearer' })
        .expect(HttpStatus.OK);
    });
  });

  describe('Save', () => {
    it('users can save posts', async () => {
      const post = await prisma.post.create({
        data: postFactory({ userId: loginResponse.decodedId }),
      });

      await request(app.getHttpServer())
        .post(`/api/posts/${hashIds.encode(post.id)}/saved`)
        .auth(loginResponse.accessToken, { type: 'bearer' })
        .expect(HttpStatus.CREATED);

      const result = await prisma.postSave.findUnique({
        where: {
          userId_postId: {
            userId: post.userId,
            postId: post.id,
          },
        },
      });

      expect(result).toBeDefined();
    });
  });

  describe('Un Save', () => {
    it('users can un save posts', async () => {
      const post = await prisma.post.create({
        data: postFactory({ userId: loginResponse.decodedId }),
      });

      await request(app.getHttpServer())
        .delete(`/api/posts/${hashIds.encode(post.id)}/saved`)
        .auth(loginResponse.accessToken, { type: 'bearer' })
        .expect(HttpStatus.OK);

      const result = await prisma.postSave.findUnique({
        where: {
          userId_postId: {
            userId: post.userId,
            postId: post.id,
          },
        },
      });

      expect(result).toBeNull();
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
