import { IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

import { usernameValidation } from 'src/fixture';

export class UpdateUserDto {
  @MaxLength(255)
  @MinLength(3)
  @IsString()
  @IsOptional()
  name?: string;

  @Matches(usernameValidation.regex)
  @MaxLength(usernameValidation.max)
  @MinLength(usernameValidation.min)
  @IsString()
  @IsOptional()
  username?: string;

  @MaxLength(255)
  @IsString()
  @IsOptional()
  bio?: string;

  @MaxLength(255)
  @IsString()
  @IsOptional()
  website?: string;
}
