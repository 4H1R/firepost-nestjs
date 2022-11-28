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
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';

import { UserService } from './user.service';
import { ProfileResource, UserResource } from './resource';
import { FindAllUserDto, UpdateUserDto } from './dto';
import { CurrentUser } from 'src/auth/decorator';
import { FollowerService } from './follower.service';
import { PaginateDto } from 'src/common/dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly followerService: FollowerService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() findAllUserDto: FindAllUserDto) {
    const result = await this.userService.findAll(findAllUserDto);
    const users = UserResource.toArrayJson(result.data);
    return { ...result, data: users };
  }

  @Get(':username')
  @HttpCode(HttpStatus.OK)
  async findOne(@CurrentUser() currentUser: User, @Param('username') username: string) {
    const user = await this.userService.findOne(username, currentUser);
    return ProfileResource.toJson(user);
  }

  @Patch(':username')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('username') username: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: User,
  ) {
    if (currentUser.username !== username) throw new UnauthorizedException();
    return this.userService.update(username, updateUserDto);
  }

  @Delete(':username')
  @HttpCode(HttpStatus.OK)
  remove(@Param('username') username: string, @CurrentUser() currentUser: User) {
    if (currentUser.username !== username) throw new UnauthorizedException();
    return this.userService.remove(username);
  }

  @Get(':username/followers')
  @HttpCode(HttpStatus.OK)
  async followers(@Param('username') username: string, @Query() query: PaginateDto) {
    const result = await this.followerService.followers({ username, ...query });

    const data = result.data.map(({ follower }) => UserResource.toJson(follower));
    return { ...result, data };
  }

  @Get(':username/followings')
  @HttpCode(HttpStatus.OK)
  async followings(@Param('username') username: string, @Query() query: PaginateDto) {
    const result = await this.followerService.followings({
      username,
      ...query,
    });

    const data = result.data.map(({ user }) => UserResource.toJson(user));
    return { ...result, data };
  }

  @Post(':username/followers')
  @HttpCode(HttpStatus.CREATED)
  async follow(@CurrentUser() currentUser: User, @Param('username') username: string) {
    if (currentUser.username === username) throw new UnauthorizedException();

    const user = await this.userService.findUnique(username);
    await this.followerService.follow({
      followerId: currentUser.id,
      userId: user.id,
    });

    return { message: `You followed ${user.username} Successfully.` };
  }

  @Delete(':username/followers')
  @HttpCode(HttpStatus.OK)
  async unFollow(@CurrentUser() currentUser: User, @Param('username') username: string) {
    if (currentUser.username === username) throw new UnauthorizedException();

    const user = await this.userService.findUnique(username);
    await this.followerService.unFollow({
      followerId: currentUser.id,
      userId: user.id,
    });

    return { message: `You un followed ${user.username} Successfully.` };
  }
}
