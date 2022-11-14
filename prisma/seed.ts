import { PrismaClient, User } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { userFactory } from './factories';

const prisma = new PrismaClient();

const userFollowers = (users: User[]) => {
  return users.reduce((curr, user) => {
    const randomUsers = faker.helpers
      .arrayElements(users)
      .filter((randomUser) => randomUser.id !== user.id)
      .map((randomUser) => ({ userId: user.id, followerId: randomUser.id }));
    curr.push(...randomUsers);
    return curr;
  }, [] as { userId: number; followerId: number }[]);
};

const createFakeData = async <T>(func: () => Promise<T>, count = 50) => {
  return await Promise.all(Array(count).fill(null).map(func));
};

async function main() {
  const usersData = await createFakeData(userFactory);
  await prisma.user.createMany({ data: usersData });
  const users = await prisma.user.findMany();
  await prisma.userFollowers.createMany({ data: userFollowers(users) });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
