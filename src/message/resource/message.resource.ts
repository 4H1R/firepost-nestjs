import { Message } from '@prisma/client';

import { JsonResource } from 'src/common/resource';
import { hashIds } from 'src/utils';

export class MessageResource extends JsonResource {
  public static toJson(message: Message) {
    return {
      ...message,
      id: hashIds.encode(message.id),
      userId: hashIds.encode(message.userId),
      senderId: hashIds.encode(message.senderId),
    };
  }
}
