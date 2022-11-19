import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
  @MaxLength(500)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  description: string;
}
