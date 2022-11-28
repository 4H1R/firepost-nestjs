import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class PaginateDto {
  @IsNumberString()
  @IsOptional()
  @ApiProperty({ default: 1 })
  page?: number;
}
