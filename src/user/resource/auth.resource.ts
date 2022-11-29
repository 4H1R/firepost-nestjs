import { User } from '@prisma/client';

import { JsonResource } from 'src/common/resource';
import { exclude, hashIds } from 'src/utils';

export class AuthResource extends JsonResource {
  public static toJson(user: User) {
    return { ...exclude(user, 'password'), id: hashIds.encode(user.id) };
  }
}
