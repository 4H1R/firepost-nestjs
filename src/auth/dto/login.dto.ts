import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @MaxLength(255)
  @MinLength(3)
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @MaxLength(25)
  @MinLength(8)
  @IsString()
  @IsNotEmpty()
  password: string;
}
