import { Module } from '@nestjs/common';

import { PostService } from './post.service';
import { PostController } from './post.controller';
import { UserPostController } from './user-post.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [PostController, UserPostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
