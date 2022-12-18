import { Prisma } from '@prisma/client';

export const createUserSearchQuery = (query: string | undefined): Prisma.UserFindManyArgs => {
  if (!query) return {};
  return {
    where: {
      OR: [
        { username: { contains: query, mode: 'insensitive' } },
        { name: { contains: query, mode: 'insensitive' } },
      ],
    },
  };
};
