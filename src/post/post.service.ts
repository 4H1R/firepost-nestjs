import { Injectable } from '@nestjs/common';
import { Post, Prisma, User } from '@prisma/client';
import { paginate } from 'lib/paginator';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto, FindAllPostDto, UpdatePostDto } from './dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}
  create(createPostDto: CreatePostDto, currentUser: User) {
    return this.prisma.post.create({ data: { ...createPostDto, userId: currentUser.id } });
  }

  findAll({ page, userId }: FindAllPostDto) {
    const prismaQuery: Prisma.PostFindManyArgs = {
      where: { userId: userId ? parseInt(userId, 10) : undefined },
      orderBy: { id: 'desc' },
    };

    return paginate<Post, Prisma.PostFindManyArgs>(this.prisma.post, prismaQuery, { page });
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  async followingsPosts(authUser: User) {
    const followings = await this.prisma.userFollower.findMany({
      where: { follower: authUser },
      select: { userId: true },
    });
    const followingIds = followings.map(({ userId }) => userId);

    const prismaQuery: Prisma.PostFindManyArgs = {
      where: { userId: { in: followingIds } },
      include: { user: true },
      orderBy: { id: 'desc' },
    };

    return paginate<Post, Prisma.PostFindManyArgs>(this.prisma.post, prismaQuery, {});
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
