import { Post } from '@prisma/client';

import { JsonResource } from 'src/common/resource';

export class PostImage extends JsonResource {
  public static toJson(post: Post) {
    return post;
  }
}
