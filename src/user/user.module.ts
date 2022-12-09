import { Module } from '@nestjs/common';

import { UserController, UserFollowerController } from './controller';
import { UserService, FollowerService } from './service';

@Module({
  controllers: [UserController, UserFollowerController],
  providers: [UserService, FollowerService],
  exports: [UserService],
})
export class UserModule {}
