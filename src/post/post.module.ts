import { Module } from '@nestjs/common';

import { UserModule } from 'src/user/user.module';
import { PostController, UserPostController, PostLikeController } from './controller';
import { PostLikeService, PostService } from './service';

@Module({
  imports: [UserModule],
  controllers: [PostController, UserPostController, PostLikeController],
  providers: [PostService, PostLikeService],
  exports: [PostService],
})
export class PostModule {}
