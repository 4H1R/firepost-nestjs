import { PipeTransform, Injectable } from '@nestjs/common';

import { usernameValidation } from 'src/fixture';
import { ValidationErrorException } from '../exception';

@Injectable()
export class ParseUsernamePipe implements PipeTransform {
  transform(value: any) {
    if (!usernameValidation.regex.test(value))
      throw new ValidationErrorException({ username: 'This is not a valid username' });
    return value;
  }
}
