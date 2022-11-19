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

  findAll({ page }: FindAllPostDto) {
    return paginate<Post, Prisma.PostFindManyArgs>(this.prisma.post, {}, { page });
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
