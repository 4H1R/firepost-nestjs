import { User } from '@prisma/client';

export class LoginResponseEntity {
  user: Omit<User, 'password'>;
  accessToken: string;
  refreshToken: string;
}
