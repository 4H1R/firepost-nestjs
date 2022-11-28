import { IsOptional, IsString } from 'class-validator';

import { PaginateDto } from './paginate.dto';

export class FindAllDto extends PaginateDto {
  @IsString()
  @IsOptional()
  query?: string;
}
