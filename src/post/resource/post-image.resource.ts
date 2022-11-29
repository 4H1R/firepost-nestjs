import { Post } from '@prisma/client';

import { JsonResource } from 'src/common/resource';
import { hashIds } from 'src/utils';

export class PostImageResource extends JsonResource {
  public static toJson(post: Post) {
    return { ...post, id: hashIds.encode(post.id), userId: hashIds.encode(post.userId) };
  }
}
