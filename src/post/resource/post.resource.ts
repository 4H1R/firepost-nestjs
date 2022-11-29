import { Post, User } from '@prisma/client';

import { JsonResource } from 'src/common/resource';
import { UserResource } from 'src/user/resource';
import { PostImageResource } from './post-image.resource';

type Props = {
  user: User;
};

export class PostResource extends JsonResource {
  public static toJson(data: Post & Props) {
    const post = PostImageResource.toJson(data);
    const user = UserResource.toJson(data.user);
    return { ...post, user };
  }
}
