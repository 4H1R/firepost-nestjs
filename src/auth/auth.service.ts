import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { PrismaService } from 'src/prisma/prisma.service';
import { ValidationErrorException } from 'src/common/exception';
import { LoginDto, RegisterDto } from './dto';
import { PayloadEntity } from './entity';
import { AuthResource } from 'src/user/resource';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(registerDto: RegisterDto) {
    const { password, email, username } = registerDto;

    const lowercasedEmail = email.toLocaleLowerCase();
    let user = await this.prisma.user.findUnique({ where: { email: lowercasedEmail } });
    if (user) {
      throw new ValidationErrorException({ email: 'This email has already been taken.' });
    }

    user = await this.prisma.user.findUnique({ where: { username } });
    if (user) {
      throw new ValidationErrorException({ username: 'This username has already been taken.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await this.prisma.user.create({
      data: {
        ...registerDto,
        email: lowercasedEmail,
        password: hashedPassword,
      },
    });

    return this.createAuthResponse(createdUser);
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) this.throwInvalidCredentials();
    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) this.throwInvalidCredentials();

    return this.createAuthResponse(user);
  }

  async refresh(refreshToken: string) {
    try {
      const token = this.jwt.verify(refreshToken);
      const user = await this.prisma.user.findUnique({
        where: { id: token.sub },
      });

      const result = this.createAuthResponse(user);
      return { ...result, refreshToken };
    } catch (e) {
      // token is not signed by us
      throw new UnauthorizedException();
    }
  }

  private me(user: User) {
    return AuthResource.toJson(user);
  }

  private createAuthResponse(user: User) {
    const payload: PayloadEntity = { sub: user.id };

    return {
      accessToken: this.jwt.sign(payload),
      refreshToken: this.jwt.sign(payload, { expiresIn: '1w' }),
      user: this.me(user),
    };
  }

  private throwInvalidCredentials() {
    throw new ValidationErrorException({
      email: "These credentials doesn't match our records.",
    });
  }
}
