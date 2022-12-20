import { Injectable } from '@nestjs/common';
import { Post, PostSave, Prisma } from '@prisma/client';
import { paginate } from 'lib/paginator';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostLikeDto, DeletePostLikeDto, FindAllPostSaveDto } from '../dto';

@Injectable()
export class PostSaveService {
  constructor(private readonly prisma: PrismaService) {}
  findOne(data: CreatePostLikeDto) {
    return this.prisma.postSave.findUnique({ where: { userId_postId: data } });
  }

  async create(data: CreatePostLikeDto) {
    const isSaved = await this.findOne(data);
    if (!isSaved) await this.prisma.postSave.create({ data });
  }

  findAll({ page, currentUser }: FindAllPostSaveDto) {
    const prismaQuery: Prisma.PostSaveFindManyArgs = {
      where: { userId: currentUser.id },
      include: { post: true },
    };

    return paginate<PostSave & { post: Post }, Prisma.PostSaveFindManyArgs>(
      this.prisma.postSave,
      prismaQuery,
      { page },
    );
  }

  async remove(data: DeletePostLikeDto) {
    const isSaved = await this.findOne(data);
    if (isSaved) await this.prisma.postSave.delete({ where: { userId_postId: data } });
  }
}
