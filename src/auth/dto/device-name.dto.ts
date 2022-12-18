import { IsNotEmpty, IsString } from 'class-validator';

export class DeviceNameDto {
  @IsString()
  @IsNotEmpty()
  deviceName: string;
}
