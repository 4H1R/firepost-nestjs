import { User } from '@prisma/client';
import { FindAllDto } from 'src/common/dto';

export interface IFindOneMessage {
  currentUser: User;
  username: string;
  query: FindAllDto;
}
