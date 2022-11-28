import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { PostService } from './post.service';
import { CreatePostDto, FindAllPostDto, UpdatePostDto } from './dto';
import { CurrentUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { PostImage } from './resource';

@ApiTags('posts')
@ApiBearerAuth()
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(@CurrentUser() currentUser: User, @Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto, currentUser);
  }

  @Get()
  async findAll(@Query() dto: FindAllPostDto) {
    const posts = await this.postService.findAll(dto);
    const data = PostImage.toArrayJson(posts.data);
    return { ...posts, data };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
