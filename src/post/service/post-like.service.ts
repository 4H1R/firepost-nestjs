import { Injectable } from '@nestjs/common';
import { PostLike, Prisma, User } from '@prisma/client';
import { paginate } from 'lib/paginator';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostLikeDto, DeletePostLikeDto, FindAllPostLikeDto } from '../dto';

@Injectable()
export class PostLikeService {
  constructor(private readonly prisma: PrismaService) {}
  findOne(data: CreatePostLikeDto) {
    return this.prisma.postLike.findUnique({ where: { userId_postId: data } });
  }

  async create(data: CreatePostLikeDto) {
    const isLiked = await this.findOne(data);
    if (!isLiked) await this.prisma.postLike.create({ data });
  }

  findAll({ page, postId }: FindAllPostLikeDto) {
    const prismaQuery: Prisma.PostLikeFindManyArgs = {
      where: { postId },
      include: { user: true },
    };

    return paginate<PostLike & { user: User }, Prisma.PostLikeFindManyArgs>(
      this.prisma.postLike,
      prismaQuery,
      {
        page,
      },
    );
  }

  async remove(data: DeletePostLikeDto) {
    const isLiked = await this.findOne(data);
    if (isLiked) await this.prisma.postLike.delete({ where: { userId_postId: data } });
  }
}
