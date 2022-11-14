import { IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @MaxLength(255)
  @MinLength(3)
  @IsString()
  @IsOptional()
  name?: string;

  @Matches(/^[a-zA-Z0-9._]+$/)
  @MaxLength(31)
  @MinLength(3)
  @IsString()
  @IsOptional()
  username?: string;

  @MaxLength(255)
  @IsString()
  @IsOptional()
  bio?: string;
}
