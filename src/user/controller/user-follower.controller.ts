import {
  Controller,
  Get,
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

import { UserService, FollowerService } from '../service';
import { UserResource } from '../resource';
import { CurrentUser } from 'src/auth/decorator';
import { FindAllDto } from 'src/common/dto';
import { ParseUsernamePipe } from 'src/common/pipe';

@ApiTags('user-followers')
@ApiBearerAuth()
@Controller('users/:username')
export class UserFollowerController {
  constructor(
    private readonly userService: UserService,
    private readonly followerService: FollowerService,
  ) {}

  @Get('followers')
  @HttpCode(HttpStatus.OK)
  async followers(
    @Param('username', new ParseUsernamePipe()) username: string,
    @Query() query: FindAllDto,
  ) {
    const result = await this.followerService.followers({ username, ...query });

    const data = result.data.map(({ follower }) => UserResource.toJson(follower));
    return { ...result, data };
  }

  @Get('followings')
  @HttpCode(HttpStatus.OK)
  async followings(
    @Param('username', new ParseUsernamePipe()) username: string,
    @Query() query: FindAllDto,
  ) {
    const result = await this.followerService.followings({
      username,
      ...query,
    });

    const data = result.data.map(({ user }) => UserResource.toJson(user));
    return { ...result, data };
  }

  @Post('followers')
  @HttpCode(HttpStatus.CREATED)
  async follow(
    @CurrentUser() currentUser: User,
    @Param('username', new ParseUsernamePipe()) username: string,
  ) {
    if (currentUser.username === username) throw new UnauthorizedException();

    const user = await this.userService.findUnique(username);
    await this.followerService.follow({
      followerId: currentUser.id,
      userId: user.id,
    });

    return { message: `You followed ${user.username} Successfully.` };
  }

  @Delete('followers')
  @HttpCode(HttpStatus.OK)
  async unFollow(
    @CurrentUser() currentUser: User,
    @Param('username', new ParseUsernamePipe()) username: string,
  ) {
    if (currentUser.username === username) throw new UnauthorizedException();
    const user = await this.userService.findUnique(username);
    await this.followerService.unFollow({
      followerId: currentUser.id,
      userId: user.id,
    });

    return { message: `You un followed ${user.username} Successfully.` };
  }
}
