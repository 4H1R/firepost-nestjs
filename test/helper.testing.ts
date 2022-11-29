import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { User, Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import request from 'supertest';

import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { applySettingsForApp, hashIds } from 'src/utils';
import { AuthResponse } from 'src/auth/response';

export const createAppForTesting = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication();
  applySettingsForApp(app);

  const prisma = moduleRef.get(PrismaService);
  await app.init();

  return { app, prisma };
};

export const userData = {
  name: 'Testing User',
  email: 'test@email.com',
  username: 'testing.user',
  password: 'password',
};

type CreateUser = {
  prisma: PrismaService;
  data?: Partial<Prisma.UserCreateManyInput>;
};

export const createUser = async ({ prisma, data }: CreateUser) => {
  return await prisma.user.create({
    data: {
      ...userData,
      ...data,
      password: await bcrypt.hash('password', 10),
    },
  });
};

type ActingAs = {
  prisma: PrismaService;
  app: INestApplication;
  user?: User;
};

export interface ActingAsResponse extends AuthResponse {
  decodedId: number;
}

export const actingAs = async ({ app, prisma, user }: ActingAs): Promise<ActingAsResponse> => {
  const currentUser = user ? user : await createUser({ prisma });
  const response = await request(app.getHttpServer())
    .post('/api/auth/login')
    .send({ email: currentUser.email, password: 'password' });

  return { ...response.body, decodedId: hashIds.decode(response.body.user.id)[0] };
};
