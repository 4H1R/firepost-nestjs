import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

export const CurrentUser = createParamDecorator((data: keyof User, ctx: ExecutionContext) => {
  const user = ctx.switchToHttp().getRequest().user as User;

  if (!user) return null;
  return data ? user[data] : user;
});
