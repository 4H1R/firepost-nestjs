import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FollowerService } from './follower.service';

@Module({
  controllers: [UserController],
  providers: [UserService, FollowerService],
})
export class UserModule {}
