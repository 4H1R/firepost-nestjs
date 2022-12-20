import { User } from '@prisma/client';
import { FindAllDto } from 'src/common/dto';

export class FindAllPostSaveDto extends FindAllDto {
  currentUser: User;
}
