import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { usernameValidation } from 'src/fixture';

import { LoginDto } from './login.dto';

export class RegisterDto extends LoginDto {
  @MaxLength(255)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  name: string;

  @Matches(usernameValidation.regex)
  @MaxLength(usernameValidation.max)
  @MinLength(usernameValidation.min)
  @IsString()
  @IsNotEmpty()
  username: string;
}
