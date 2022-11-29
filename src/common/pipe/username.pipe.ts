import { PipeTransform, Injectable } from '@nestjs/common';

import { usernameRegex } from 'src/fixture';
import { ValidationErrorException } from '../exception';

@Injectable()
export class ParseUsernamePipe implements PipeTransform {
  transform(value: any) {
    if (!usernameRegex.test(value))
      throw new ValidationErrorException({ username: 'This is not a valid username' });
    return value;
  }
}
