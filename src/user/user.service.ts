import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { paginate } from 'lib/paginator';

import { PrismaService } from 'src/prisma/prisma.service';
import { FindAllUserDto, UpdateUserDto } from './dto';
import { createUserSearchQuery } from './helper.user';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll({ query, page }: FindAllUserDto) {
    return await paginate<User, Prisma.UserFindManyArgs>(
      this.prisma.user,
      createUserSearchQuery(query),
      { page },
    );
  }

  async findOne(username: string, currentUser: User) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: {
        _count: { select: { followers: true, followings: true, posts: true } },
        followers: { where: { follower: currentUser }, take: 1 },
      },
    });

    if (!user) throw new NotFoundException();
    return user;
  }

  async findUnique(username: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) throw new NotFoundException();

    return user;
  }

  async update(username: string, updateUserDto: UpdateUserDto) {
    return await this.prisma.user.update({
      where: { username },
      data: updateUserDto,
    });
  }

  async remove(username: string) {
    return await this.prisma.user.delete({ where: { username } });
  }
}
