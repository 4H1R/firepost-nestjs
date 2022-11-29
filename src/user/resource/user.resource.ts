import { User } from '@prisma/client';

import { JsonResource } from 'src/common/resource';
import { hashIds } from 'src/utils';

export class UserResource extends JsonResource {
  public static toJson(user: User) {
    return {
      id: hashIds.encode(user.id),
      name: user.name,
      username: user.username,
      image: user.image,
      bio: user.bio,
      isVerified: user.isVerified,
      website: user.website,
    };
  }
}
