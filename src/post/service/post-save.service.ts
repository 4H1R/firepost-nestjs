import { Injectable } from '@nestjs/common';
import { PostSave, Prisma, User } from '@prisma/client';
import { paginate } from 'lib/paginator';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostLikeDto, DeletePostLikeDto, FindAllPostLikeDto } from '../dto';

@Injectable()
export class PostSaveService {
  constructor(private readonly prisma: PrismaService) {}
  async findOne(data: CreatePostLikeDto) {
    return this.prisma.postSave.findUnique({ where: { userId_postId: data } });
  }

  async create(data: CreatePostLikeDto) {
    return this.findOne(data) ?? this.prisma.postSave.create({ data });
  }

  findAll({ page, postId }: FindAllPostLikeDto) {
    const prismaQuery: Prisma.PostSaveFindManyArgs = {
      where: { postId },
      include: { user: true },
    };

    return paginate<PostSave & { user: User }, Prisma.PostSaveFindManyArgs>(
      this.prisma.postSave,
      prismaQuery,
      {
        page,
      },
    );
  }

  async remove(data: DeletePostLikeDto) {
    const isLiked = await this.findOne(data);
    if (isLiked) this.prisma.postSave.delete({ where: { userId_postId: data } });
  }
}
