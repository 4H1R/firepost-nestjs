import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { PrismaService } from 'src/prisma/prisma.service';
import { TPayloadEntity } from '../type';
import { hashIds } from 'src/utils';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService, config: ConfigService) {
    super({
      secretOrKey: config.get('jwtSecret'),
      ignoreExpiration: true,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: TPayloadEntity) {
    const id = hashIds.decode(payload.sub)[0] as number;
    const accessToken = await this.prisma.accessToken.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!accessToken) throw new UnauthorizedException();
    const tokenMatches = await bcrypt.compare(payload.token, accessToken.token);
    if (!tokenMatches) throw new UnauthorizedException();

    return accessToken;
  }
}
