import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AccessToken } from '@prisma/client';

export const CurrentAccessToken = createParamDecorator(
  (data: keyof AccessToken, ctx: ExecutionContext) => {
    const accessToken = ctx.switchToHttp().getRequest().user as AccessToken;

    if (!accessToken) return null;
    return data ? accessToken[data] : accessToken;
  },
);
