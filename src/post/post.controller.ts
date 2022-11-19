import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { PostService } from './post.service';
import { CreatePostDto, FindAllPostDto, UpdatePostDto } from './dto';
import { CurrentUser } from 'src/auth/decorator';
import { User } from '@prisma/client';

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
  findAll(@Query() dto: FindAllPostDto) {
    return this.postService.findAll(dto);
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
