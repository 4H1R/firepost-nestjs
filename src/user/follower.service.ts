import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User, UserFollower } from '@prisma/client';

import { paginate } from 'lib/paginator';
import { PrismaService } from 'src/prisma/prisma.service';
import { FollowerUserDto } from './dto';
import { createUserQuery } from './helper.user';

@Injectable()
export class FollowerService {
  constructor(private readonly prisma: PrismaService) {}

  async followers({ username, page, query }: FollowerUserDto) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) throw new NotFoundException();

    const prismaQuery: Prisma.UserFollowerFindManyArgs = {
      include: { follower: true },
      where: { userId: user.id, follower: { ...createUserQuery(query).where } },
    };

    return await paginate<UserFollower & { follower: User }, typeof prismaQuery>(
      this.prisma.userFollower,
      prismaQuery,
      { page },
    );
  }

  async followings({ username, page, query }: FollowerUserDto) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) throw new NotFoundException();

    const prismaQuery: Prisma.UserFollowerFindManyArgs = {
      include: { user: true },
      where: { followerId: user.id, user: { ...createUserQuery(query).where } },
    };

    return await paginate<UserFollower & { user: User }, typeof prismaQuery>(
      this.prisma.userFollower,
      prismaQuery,
      { page },
    );
  }

  async follow(data: { userId: number; followerId: number }) {
    const alreadyFollowed = await this.prisma.userFollower.findUnique({
      where: { userId_followerId: data },
    });

    return alreadyFollowed ?? this.prisma.userFollower.create({ data });
  }

  unFollow(data: { userId: number; followerId: number }) {
    return this.prisma.userFollower.delete({
      where: { userId_followerId: data },
    });
  }
}
