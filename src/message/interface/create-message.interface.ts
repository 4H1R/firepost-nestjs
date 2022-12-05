import { User } from '@prisma/client';
import { CreateMessageDto } from '../dto';

export interface ICreateMessage {
  username: string;
  dto: CreateMessageDto;
  currentUser: User;
}
