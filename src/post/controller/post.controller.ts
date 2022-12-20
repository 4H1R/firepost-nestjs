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
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';

import { PostService, PostUserService } from '../service';
import { CreatePostDto, UpdatePostDto } from '../dto';
import { CurrentUser } from 'src/auth/decorator';
import { PostResource, PostFullResource } from '../resource';
import { PaginateDto } from 'src/common/dto';
import { ParseHashIdsPipe } from 'src/common/pipe';

@ApiTags('posts')
@ApiBearerAuth()
@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly postUserService: PostUserService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@CurrentUser() currentUser: User, @Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto, currentUser);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() dto: PaginateDto) {
    const posts = await this.postService.findAll(dto);
    const data = PostResource.toArrayJson(posts.data);
    return { ...posts, data };
  }

  @Get('home')
  @HttpCode(HttpStatus.OK)
  async followingsPosts(@CurrentUser() currentUser: User, @Query() dto: PaginateDto) {
    const posts = await this.postUserService.followingsPosts({ currentUser, dto });
    const data = PostFullResource.toArrayJson(posts.data);
    return { ...posts, data };
  }

  @ApiParam({ name: 'id' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', new ParseHashIdsPipe()) id, @CurrentUser() user: User) {
    const post = await this.postService.findOne(id, user.id);
    return PostFullResource.toJson(post);
  }

  @ApiParam({ name: 'id' })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @ApiParam({ name: 'id' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
