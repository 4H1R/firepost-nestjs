import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { paginate } from 'lib/paginator';

import { PrismaService } from 'src/prisma/prisma.service';
import { createUserSearchQuery } from 'src/user/helper.user';
import { UserService } from 'src/user/user.service';
import { UpdateMessageDto } from './dto';
import { ICreateMessage, IFindAllMessages, IFindOneMessage } from './interface';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService, private readonly userService: UserService) {}

  async create({ username, dto, currentUser }: ICreateMessage) {
    const user = await this.userService.findUnique(username);
    return this.prisma.message.create({
      data: { text: dto.text, userId: user.id, senderId: currentUser.id },
    });
  }

  async findAll({ query, currentUser }: IFindAllMessages) {
    return paginate<User, Prisma.UserFindManyArgs>(
      this.prisma.user,
      {
        where: {
          ...createUserSearchQuery(query.query).where,
          messages: { some: { OR: [{ senderId: currentUser.id }, { userId: currentUser.id }] } },
        },
        distinct: ['id'],
      },
      { page: query.page },
    );
  }

  async findOne({ currentUser, username }: IFindOneMessage) {
    const user = await this.userService.findUnique(username);
    return this.prisma.message.findMany({ where: { OR: [{}] } });
  }

  async findUnique(id: number) {
    const message = await this.prisma.message.findUnique({ where: { id } });
    if (!message) throw new NotFoundException();

    return message;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return this.prisma.message.update({ where: { id }, data: updateMessageDto });
  }

  remove(id: number) {
    return this.prisma.message.delete({ where: { id } });
  }
}
