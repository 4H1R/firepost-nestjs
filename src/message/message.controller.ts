import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';

import { FindAllDto } from 'src/common/dto';
import { MessageService } from './message.service';
import { ParseHashIdsPipe, ParseUsernamePipe } from 'src/common/pipe';
import { CurrentUser } from 'src/auth/decorator';
import { MessageResource } from './resource';
import { CreateMessageDto, UpdateMessageDto } from './dto';
import { UserResource } from 'src/user/resource';

@ApiBearerAuth()
@ApiTags('messages')
@Controller()
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('users/:username/messages')
  async create(
    @Param('username', new ParseUsernamePipe()) username: string,
    @Body() createMessageDto: CreateMessageDto,
    @CurrentUser() currentUser: User,
  ) {
    if (username === currentUser.username) throw new UnauthorizedException();

    const message = await this.messageService.create({
      username,
      dto: createMessageDto,
      currentUser,
    });

    return MessageResource.toJson(message);
  }

  @Get('messages')
  async findAll(@CurrentUser() currentUser: User, @Query() query: FindAllDto) {
    const users = await this.messageService.findAll({ currentUser, query });
    return users;
    // const data = UserResource.toArrayJson(users.data);
    // return { ...users, data };
  }

  @Get('users/:username/messages')
  async findOne(
    @Param('username') username: string,
    @CurrentUser() currentUser: User,
    @Query() query: FindAllDto,
  ) {
    if (username === currentUser.username) throw new UnauthorizedException();
    const messages = await this.messageService.findOne({ username, currentUser, query });
    const data = MessageResource.toArrayJson(messages.data);
    return { ...messages, data };
  }

  @Patch('messages/:id')
  async update(
    @Param('id', new ParseHashIdsPipe()) id,
    @Body() updateMessageDto: UpdateMessageDto,
    @CurrentUser() currentUser: User,
  ) {
    let message = await this.messageService.findUnique(id);
    if (message.senderId !== currentUser.id) throw new UnauthorizedException();

    message = await this.messageService.update(id, updateMessageDto);
    return MessageResource.toJson(message);
  }

  @Delete('messages/:id')
  async remove(@Param('id', new ParseHashIdsPipe()) id, @CurrentUser() currentUser: User) {
    let message = await this.messageService.findUnique(id);
    if (message.senderId !== currentUser.id) throw new UnauthorizedException();

    message = await this.messageService.remove(id);
    return MessageResource.toJson(message);
  }
}
