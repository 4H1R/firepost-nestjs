import { faker } from '@faker-js/faker';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export const userFactory = async (): Promise<Prisma.UserCreateInput> => ({
  name: faker.name.fullName(),
  username: faker.helpers.unique(faker.internet.userName),
  email: faker.helpers.unique(faker.internet.email).toLowerCase(),
  bio: faker.datatype.boolean()
    ? faker.lorem.paragraph(faker.datatype.number({ min: 1, max: 4 }))
    : null,
  image: faker.datatype.boolean() ? faker.image.avatar() : null,
  isVerified: faker.datatype.boolean(),
  website: faker.datatype.boolean() ? `https://${faker.internet.domainName()}` : null,
  password: await bcrypt.hash('password', 10),
  emailVerifiedAt: faker.datatype.boolean() ? new Date() : null,
});

type PostFactory = {
  userId: number;
};

export const postFactory = (data: PostFactory): Prisma.PostCreateManyInput => ({
  ...data,
  images: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }).map(() =>
    faker.image.abstract(500, 500, true),
  ),
  description: faker.lorem.paragraphs(faker.datatype.number({ min: 2, max: 5 })),
});

type MessageFactory = {
  userId: number;
  senderId: number;
};

export const messageFactory = (data: MessageFactory): Prisma.MessageCreateManyInput => ({
  ...data,
  text: faker.lorem.words(faker.datatype.number({ min: 2, max: 30 })),
});
