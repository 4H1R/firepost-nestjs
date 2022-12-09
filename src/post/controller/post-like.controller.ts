import { Controller, Get, Post, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';

import { CurrentUser } from 'src/auth/decorator';
import { FindAllDto } from 'src/common/dto';
import { ParseHashIdsPipe } from 'src/common/pipe';
import { PostLikeService, PostService } from '../service';
import { UserResource } from 'src/user/resource';

@ApiTags('post-likes')
@ApiBearerAuth()
@Controller('posts/:id/likes')
export class PostLikeController {
  constructor(
    private readonly postService: PostService,
    private readonly likeService: PostLikeService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Param('id', new ParseHashIdsPipe()) id, @CurrentUser() currentUser: User) {
    const post = await this.postService.findUnique(id);
    await this.likeService.create({ userId: currentUser.id, postId: post.id });
    return { message: 'You liked this post successfully.' };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Param('id', new ParseHashIdsPipe()) id, @Query() dto: FindAllDto) {
    const result = await this.likeService.findAll({ ...dto, postId: id });
    const users = result.data.map(({ user }) => user);
    return { ...result, data: UserResource.toArrayJson(users) };
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', new ParseHashIdsPipe()) id, @CurrentUser() currentUser: User) {
    const post = await this.postService.findUnique(id);
    await this.likeService.remove({ userId: currentUser.id, postId: post.id });
    return { message: 'You un liked this post successfully.' };
  }
}
