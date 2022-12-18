import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UnauthorizedException,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';

import { UserService } from '../service';
import { AuthResource, ProfileResource, UserResource } from '../resource';
import { FindAllUserDto, UpdateUserDto } from '../dto';
import { CurrentUser } from 'src/auth/decorator';
import { ParseUsernamePipe } from 'src/common/pipe';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @HttpCode(HttpStatus.OK)
  async me(@CurrentUser() currentUser: User) {
    return AuthResource.toJson(currentUser);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() findAllUserDto: FindAllUserDto) {
    const result = await this.userService.findAll(findAllUserDto);
    const users = UserResource.toArrayJson(result.data);
    return { ...result, data: users };
  }

  @Get(':username')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @CurrentUser() currentUser: User,
    @Param('username', new ParseUsernamePipe()) username: string,
  ) {
    const user = await this.userService.findOne(username, currentUser);
    return ProfileResource.toJson(user);
  }

  @Patch(':username')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('username', new ParseUsernamePipe()) username: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: User,
  ) {
    if (currentUser.username !== username) throw new UnauthorizedException();
    const user = await this.userService.update(username, updateUserDto);
    return AuthResource.toJson(user);
  }

  @Delete(':username')
  @HttpCode(HttpStatus.OK)
  remove(
    @Param('username', new ParseUsernamePipe()) username: string,
    @CurrentUser() currentUser: User,
  ) {
    if (currentUser.username !== username) throw new UnauthorizedException();
    return this.userService.remove(currentUser.id);
  }
}
