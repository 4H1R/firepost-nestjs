import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FollowerService } from './follower.service';
import { PostModule } from 'src/post/post.module';

@Module({
  imports: [PostModule],
  controllers: [UserController],
  providers: [UserService, FollowerService],
  exports: [UserService],
})
export class UserModule {}
