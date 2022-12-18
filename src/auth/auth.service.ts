import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import crypto from 'crypto';
import { AccessToken } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { ValidationErrorException } from 'src/common/exception';
import { LoginDto, RegisterDto } from './dto';
import { TCreateTokenEntity, TPayloadEntity } from './type';
import { AuthResource } from 'src/user/resource';
import { hashIds } from 'src/utils';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(registerDto: RegisterDto) {
    const { password, email, username } = registerDto;

    const lowercasedEmail = email.toLocaleLowerCase();
    const isEmailUsed = await this.prisma.user.findUnique({ where: { email: lowercasedEmail } });
    const isUsernameUsed = await this.prisma.user.findUnique({ where: { username } });

    if (isEmailUsed || isUsernameUsed) {
      const errorMessage = 'This field has already been taken.';
      const error: Record<string, string> = {};
      if (isEmailUsed) error['email'] = errorMessage;
      if (isUsernameUsed) error['username'] = errorMessage;
      throw new ValidationErrorException(error);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const { deviceName, ...dto } = registerDto;
    const createdUser = await this.prisma.user.create({
      data: {
        ...dto,
        email: lowercasedEmail,
        password: hashedPassword,
      },
    });

    return {
      user: AuthResource.toJson(createdUser),
      accessToken: await this.createToken({ userId: createdUser.id, deviceName }),
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) this.throwInvalidCredentials();
    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) this.throwInvalidCredentials();

    return {
      user: AuthResource.toJson(user),
      accessToken: await this.createToken({ userId: user.id, deviceName: loginDto.deviceName }),
    };
  }

  private async createToken(data: TCreateTokenEntity) {
    const token = crypto.randomBytes(20).toString('hex');
    const hashedToken = await bcrypt.hash(token, 10);
    const accessToken = await this.prisma.accessToken.create({
      data: { token: hashedToken, userId: data.userId, name: data.deviceName },
    });

    const payload: TPayloadEntity = { sub: hashIds.encode(accessToken.id), token };
    return this.jwt.sign(payload);
  }

  logout(accessToken: AccessToken) {
    return this.prisma.accessToken.delete({ where: { id: accessToken.id } });
  }

  private throwInvalidCredentials() {
    throw new ValidationErrorException({
      email: "These credentials doesn't match our records.",
    });
  }
}
