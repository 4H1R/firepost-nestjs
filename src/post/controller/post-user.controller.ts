import { Controller, Get, HttpCode, HttpStatus, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';

import { PostUserService } from '../service';
import { PostResource } from '../resource';
import { PaginateDto } from 'src/common/dto';
import { UserService } from 'src/user/service';
import { ParseUsernamePipe } from 'src/common/pipe';

@ApiTags('posts')
@ApiBearerAuth()
@Controller()
export class PostUserController {
  constructor(
    private readonly userService: UserService,
    private readonly postUserService: PostUserService,
  ) {}

  @ApiParam({ name: 'username' })
  @Get('users/:username/posts')
  @HttpCode(HttpStatus.OK)
  async posts(
    @Param('username', new ParseUsernamePipe()) username: string,
    @Query() dto: PaginateDto,
  ) {
    const user = await this.userService.findUnique(username);
    const posts = await this.postUserService.findAll({ ...dto, userId: user.id });
    const data = PostResource.toArrayJson(posts.data);
    return { ...posts, data };
  }
}
