import { Module } from '@nestjs/common';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FollowerService } from './follower.service';
import { UserFollowerController } from './user-follower.controller';

@Module({
  controllers: [UserController, UserFollowerController],
  providers: [UserService, FollowerService],
  exports: [UserService],
})
export class UserModule {}
