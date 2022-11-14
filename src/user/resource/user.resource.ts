import { User } from '@prisma/client';

import { JsonResource } from 'src/common/resource';

export class UserResource extends JsonResource {
  public static toJson(user: User) {
    return {
      username: user.username,
      name: user.name,
      bio: user.bio,
      isVerified: user.isVerified,
    };
  }
}
