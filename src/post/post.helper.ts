import { Prisma } from '@prisma/client';

type IncludePostProps = {
  currentUserId: number;
};

export const includePostData = ({ currentUserId }: IncludePostProps) => ({
  user: true,
  _count: { select: { likes: true, comments: true } },
  likes: { where: { userId: currentUserId }, take: 1 },
  saves: { where: { userId: currentUserId }, take: 1 },
});

export const orderLatestPost: Prisma.PostOrderByWithAggregationInput = {
  id: 'desc',
};
