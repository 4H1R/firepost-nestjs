import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

import { usernameRegex } from 'src/fixture';
import { LoginDto } from './login.dto';

export class RegisterDto extends LoginDto {
  @MaxLength(255)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  name: string;

  @Matches(usernameRegex)
  @MaxLength(31)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  username: string;
}
