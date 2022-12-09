import { Controller, Get, HttpCode, HttpStatus, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { PostService } from '../service';
import { PostImageResource } from '../resource';
import { PaginateDto } from 'src/common/dto';
import { UserService } from 'src/user/service';
import { ParseUsernamePipe } from 'src/common/pipe';

@ApiTags('posts')
@ApiBearerAuth()
@Controller('users/:username')
export class UserPostController {
  constructor(
    private readonly postService: PostService,
    private readonly userService: UserService,
  ) {}

  @Get('posts')
  @HttpCode(HttpStatus.OK)
  async posts(
    @Param('username', new ParseUsernamePipe()) username: string,
    @Query() dto: PaginateDto,
  ) {
    const user = await this.userService.findUnique(username);
    const posts = await this.postService.findAll({ ...dto, userId: user.id });
    const data = PostImageResource.toArrayJson(posts.data);
    return { ...posts, data };
  }
}
