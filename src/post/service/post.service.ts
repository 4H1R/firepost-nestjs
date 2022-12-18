import { Injectable, NotFoundException } from '@nestjs/common';
import { Post, Prisma, User } from '@prisma/client';
import { paginate } from 'lib/paginator';

import { PaginateDto } from 'src/common/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto, UpdatePostDto } from '../dto';
import { includePostData } from '../post.helper';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}
  create(createPostDto: CreatePostDto, currentUser: User) {
    return this.prisma.post.create({ data: { ...createPostDto, userId: currentUser.id } });
  }

  findAll({ page }: PaginateDto) {
    const prismaQuery: Prisma.PostFindManyArgs = { orderBy: { id: 'desc' } };

    return paginate<Post, Prisma.PostFindManyArgs>(this.prisma.post, prismaQuery, { page });
  }

  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({
      include: includePostData({ currentUserId: 2 }),
      where: { id },
    });

    if (!post) throw new NotFoundException();
    return post;
  }

  async findUnique(id: number) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException();
    return post;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
