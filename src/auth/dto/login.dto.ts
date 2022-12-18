import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { DeviceNameDto } from './device-name.dto';

export class LoginDto extends DeviceNameDto {
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
