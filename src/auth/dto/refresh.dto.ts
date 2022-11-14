import { IsJWT, IsNotEmpty, IsString } from 'class-validator';

export class RefreshDto {
  @IsJWT()
  @IsString()
  @IsNotEmpty()
  refresh: string;
}
