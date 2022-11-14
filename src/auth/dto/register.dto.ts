import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { LoginDto } from './login.dto';

export class RegisterDto extends LoginDto {
  @MaxLength(255)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  name: string;

  @Matches(/^[a-zA-Z0-9._]+$/)
  @MaxLength(31)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  username: string;
}
