import { IsNumberString, IsOptional } from 'class-validator';

import { PaginateDto } from 'src/common/dto';

export class FindAllPostDto extends PaginateDto {
  @IsNumberString()
  @IsOptional()
  userId?: number;
}
