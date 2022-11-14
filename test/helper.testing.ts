import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as request from 'supertest';

import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { applySettingsForApp } from 'src/utils';
import { LoginResponseEntity } from 'src/auth/entity';

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
  data?: Partial<User>;
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
  user?: User;
  app: INestApplication;
};

export const actingAs = async ({ app, prisma, user }: ActingAs): Promise<LoginResponseEntity> => {
  const currentUser = user ? user : await createUser({ prisma });
  const response = await request(app.getHttpServer())
    .post('/api/auth/login')
    .send({ email: currentUser.email, password: 'password' });

  return response.body;
};
