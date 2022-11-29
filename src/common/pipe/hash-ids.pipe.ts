import { PipeTransform, Injectable } from '@nestjs/common';

import { hashIds } from 'src/utils';
import { ValidationErrorException } from '../exception';

@Injectable()
export class ParseHashIdsPipe implements PipeTransform {
  transform(value: any) {
    const result = hashIds.decode(value)[0];
    if (!result) throw new ValidationErrorException({ id: 'This field is not valid' });

    return result;
  }
}
