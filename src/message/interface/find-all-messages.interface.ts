import { User } from '@prisma/client';
import { FindAllDto } from 'src/common/dto';

export interface IFindAllMessages {
  currentUser: User;
  query: FindAllDto;
}
