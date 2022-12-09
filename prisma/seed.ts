import { Post, Prisma, PrismaClient, User } from '@prisma/client';
import { faker } from '@faker-js/faker';

import { messageFactory, postFactory, userFactory } from './factories';

const CREATE_COUNT = 50;

const prisma = new PrismaClient();

const createFakeData = async <T>(func: () => Promise<T>, count = CREATE_COUNT) => {
  return await Promise.all(Array(count).fill(null).map(func));
};

const userFollowers = (users: User[]) => {
  return users.reduce((curr, user) => {
    const randomUsers = faker.helpers
      .arrayElements(users, faker.datatype.number({ min: 0, max: 30 }))
      .filter((randomUser) => randomUser.id !== user.id)
      .map((randomUser) => ({ userId: user.id, followerId: randomUser.id }));
    curr.push(...randomUsers);
    return curr;
  }, [] as Prisma.UserFollowerCreateManyInput[]);
};

const userPosts = (users: User[]) => {
  const posts = users.reduce((curr, user) => {
    const posts = Array.from({ length: faker.datatype.number({ min: 0, max: 20 }) }).map(() =>
      postFactory({ userId: user.id }),
    );
    curr.push(...posts);
    return curr;
  }, [] as Prisma.PostCreateManyInput[]);

  return faker.helpers.shuffle(posts);
};

const userMessages = (users: User[]) => {
  const messages = users.reduce((curr, user) => {
    const messages = Array.from({ length: faker.datatype.number({ min: 0, max: 50 }) }).map(() => {
      let senderId = user.id;
      while (senderId === user.id) senderId = faker.helpers.arrayElement(users).id;
      return messageFactory({ userId: user.id, senderId });
    });
    curr.push(...messages);
    return curr;
  }, [] as Prisma.MessageCreateManyInput[]);

  return faker.helpers.shuffle(messages);
};
const postSaves = (users: User[], posts: Post[]) => {
  return users.reduce((curr, user) => {
    const result = faker.helpers
      .arrayElements(posts, faker.datatype.number({ min: 0, max: 30 }))
      .map((post) => ({ userId: user.id, postId: post.id }));
    curr.push(...result);
    return curr;
  }, [] as Prisma.PostSaveCreateManyInput[]);
};

const postLikes = (users: User[], posts: Post[]) => {
  return users.reduce((curr, user) => {
    const result = faker.helpers
      .arrayElements(posts, faker.datatype.number({ min: 0, max: 30 }))
      .map((post) => ({ userId: user.id, postId: post.id }));
    curr.push(...result);
    return curr;
  }, [] as Prisma.PostLikeCreateManyInput[]);
};

async function main() {
  await prisma.user.createMany({ data: await createFakeData(userFactory) });
  const users = await prisma.user.findMany({ take: CREATE_COUNT, orderBy: { id: 'desc' } });
  await prisma.userFollower.createMany({ data: userFollowers(users) });
  const { count: createdPostsCount } = await prisma.post.createMany({ data: userPosts(users) });
  const posts = await prisma.post.findMany({ take: createdPostsCount, orderBy: { id: 'desc' } });
  await prisma.postSave.createMany({ data: postSaves(users, posts) });
  await prisma.postLike.createMany({ data: postLikes(users, posts) });
  await prisma.message.createMany({ data: userMessages(users) });
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
