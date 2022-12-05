import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateMessageDto {
  @MaxLength(500)
  @IsString()
  @IsNotEmpty()
  text: string;
}
