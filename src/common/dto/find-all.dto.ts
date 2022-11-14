import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class FindAllDto {
  @IsNumberString()
  @IsOptional()
  @ApiProperty({ default: 1 })
  page?: number;

  @IsString()
  @IsOptional()
  query?: string;
}
