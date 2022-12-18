import { Injectable } from '@nestjs/common';
import { Post, Prisma, User } from '@prisma/client';
import { paginate } from 'lib/paginator';
import { PaginateDto } from 'src/common/dto';

import { PrismaService } from 'src/prisma/prisma.service';
import { IPost } from '../interface';
import { includePostData, orderLatestPost } from '../post.helper';

@Injectable()
export class PostUserService {
  constructor(private readonly prisma: PrismaService) {}
  async followingsPosts({ currentUser, dto }: { currentUser: User; dto: PaginateDto }) {
    const followings = await this.prisma.userFollower.findMany({
      where: { follower: currentUser },
      select: { userId: true },
    });
    const followingIds = followings.map(({ userId }) => userId);

    const prismaQuery: Prisma.PostFindManyArgs = {
      where: { userId: { in: followingIds } },
      include: includePostData({ currentUserId: currentUser.id }),
      orderBy: orderLatestPost,
    };

    return paginate<IPost, Prisma.PostFindManyArgs>(this.prisma.post, prismaQuery, {
      page: dto.page,
    });
  }

  findAll({ page, userId }: PaginateDto & { userId: number }) {
    const prismaQuery: Prisma.PostFindManyArgs = {
      where: { userId },
      orderBy: { id: 'desc' },
    };

    return paginate<Post, Prisma.PostFindManyArgs>(this.prisma.post, prismaQuery, { page });
  }
}
