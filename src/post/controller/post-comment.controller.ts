import { Controller, Get, Post, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';

import { CurrentUser } from 'src/auth/decorator';
import { FindAllDto } from 'src/common/dto';
import { ParseHashIdsPipe } from 'src/common/pipe';
import { PostCommentService, PostService } from '../service';

@ApiTags('post-comments')
@ApiBearerAuth()
@Controller('posts/:id/comments')
export class PostCommentController {
  constructor(
    private readonly postService: PostService,
    private readonly commentService: PostCommentService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Param('id', new ParseHashIdsPipe()) id, @CurrentUser() currentUser: User) {
    const post = await this.postService.findUnique(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Param('id', new ParseHashIdsPipe()) id, @Query() dto: FindAllDto) {
    // Todo implement
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', new ParseHashIdsPipe()) id, @CurrentUser() currentUser: User) {
    const post = await this.postService.findUnique(id);
  }
}
