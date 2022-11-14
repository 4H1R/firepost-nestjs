import { Prisma } from '@prisma/client';

export const createUserQuery = (query: string | undefined): Prisma.UserFindManyArgs => {
  if (!query) return {};
  return {
    where: {
      OR: [{ username: { contains: query } }, { name: { contains: query } }],
    },
  };
};
