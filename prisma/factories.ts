import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

export const userFactory = async () => ({
  name: faker.name.fullName(),
  username: faker.helpers.unique(faker.internet.userName),
  email: faker.helpers.unique(faker.internet.email).toLowerCase(),
  bio: faker.datatype.boolean()
    ? faker.lorem.paragraph(faker.datatype.number({ min: 1, max: 4 }))
    : null,
  isVerified: faker.datatype.boolean(),
  password: await bcrypt.hash('password', 10),
  emailVerifiedAt: faker.datatype.boolean() ? new Date() : null,
});
