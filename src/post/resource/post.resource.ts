import { Post } from '@prisma/client';

import { JsonResource } from 'src/common/resource';
import { hashIds } from 'src/utils';

export class PostResource extends JsonResource {
  public static toJson(post: Post) {
    return {
      id: hashIds.encode(post.id),
      userId: hashIds.encode(post.userId),
      description: post.description,
      images: post.images,
      updatedAt: post.updatedAt,
      createdAt: post.createdAt,
    };
  }
}
