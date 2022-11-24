import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';

import { AuthService } from './auth.service';
import { CurrentUser, Public } from './decorator';
import { LoginDto, RegisterDto, RefreshDto } from './dto';
import { AuthResponse } from './response';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponse> {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() refreshDto: RefreshDto): Promise<AuthResponse> {
    return this.authService.refresh(refreshDto.refresh);
  }

  @ApiBearerAuth()
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async me(@CurrentUser() currentUser: User) {
    return this.authService.me(currentUser);
  }
}
