import { Controller, Get, Post, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';

import { CurrentUser } from 'src/auth/decorator';
import { PaginateDto } from 'src/common/dto';
import { ParseHashIdsPipe } from 'src/common/pipe';
import { PostSaveService, PostService } from '../service';
import { PostResource } from '../resource';

@ApiTags('post-saved')
@ApiBearerAuth()
@Controller('posts')
export class PostSaveController {
  constructor(
    private readonly postService: PostService,
    private readonly saveService: PostSaveService,
  ) {}

  @ApiParam({ name: 'id' })
  @Post(':id/saved')
  @HttpCode(HttpStatus.CREATED)
  async create(@Param('id', new ParseHashIdsPipe()) id, @CurrentUser() currentUser: User) {
    const post = await this.postService.findUnique(id);
    await this.saveService.create({ userId: currentUser.id, postId: post.id });
    return { message: 'You liked this post successfully.' };
  }

  @Get('saved')
  @HttpCode(HttpStatus.OK)
  async findAll(@CurrentUser() currentUser: User, @Query() dto: PaginateDto) {
    const result = await this.saveService.findAll({ ...dto, currentUser });
    const posts = result.data.map(({ post }) => post);
    return { ...result, data: PostResource.toArrayJson(posts) };
  }

  @ApiParam({ name: 'id' })
  @Delete(':id/saved')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', new ParseHashIdsPipe()) id, @CurrentUser() currentUser: User) {
    const post = await this.postService.findUnique(id);
    await this.saveService.remove({ userId: currentUser.id, postId: post.id });
    return { message: 'You un liked this post successfully.' };
  }
}
