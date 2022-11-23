import { User, UserFollower } from '@prisma/client';

import { JsonResource } from 'src/common/resource';
import { UserResource } from './user.resource';

type Props = {
  _count: {
    followers: number;
    followings: number;
    posts: number;
  };
  followers: UserFollower[];
};

export class ProfileResource extends JsonResource {
  public static toJson(data: User & Props) {
    const user = UserResource.toJson(data);
    return {
      ...user,
      followersCount: data._count.followers,
      followingsCount: data._count.followings,
      postsCount: data._count.posts,
      isFollowed: data.followers.length !== 0,
    };
  }
}
