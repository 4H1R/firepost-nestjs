import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { PostService } from './post.service';
import { CreatePostDto, UpdatePostDto } from './dto';
import { CurrentUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { PostImageResource, PostResource } from './resource';
import { PaginateDto } from 'src/common/dto';
import { ParseHashIdsPipe } from 'src/common/pipe';

@ApiTags('posts')
@ApiBearerAuth()
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@CurrentUser() currentUser: User, @Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto, currentUser);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() dto: PaginateDto) {
    const posts = await this.postService.findAll(dto);
    const data = PostImageResource.toArrayJson(posts.data);
    return { ...posts, data };
  }

  @Get('home')
  @HttpCode(HttpStatus.OK)
  async followingsPosts(@CurrentUser() authUser: User) {
    const posts = await this.postService.followingsPosts(authUser);
    const data = PostResource.toArrayJson(posts.data);
    return { ...posts, data };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', new ParseHashIdsPipe()) id) {
    const post = await this.postService.findOne(id);
    return PostResource.toJson(post);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
