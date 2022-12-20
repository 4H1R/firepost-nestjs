import { Module } from '@nestjs/common';

import { UserModule } from 'src/user/user.module';
import {
  PostController,
  PostUserController,
  PostLikeController,
  PostCommentController,
  PostSaveController,
} from './controller';
import {
  PostCommentService,
  PostLikeService,
  PostSaveService,
  PostService,
  PostUserService,
} from './service';

@Module({
  imports: [UserModule],
  controllers: [
    PostSaveController,
    PostController,
    PostUserController,
    PostLikeController,
    PostCommentController,
  ],
  providers: [PostService, PostUserService, PostLikeService, PostCommentService, PostSaveService],
  exports: [PostService],
})
export class PostModule {}
