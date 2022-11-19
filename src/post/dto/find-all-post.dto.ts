import { OmitType } from '@nestjs/swagger';

import { FindAllDto } from 'src/common/dto';

export class FindAllPostDto extends OmitType(FindAllDto, ['query'] as const) {}
