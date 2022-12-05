import { registerDecorator, ValidationOptions } from 'class-validator';
import { hashIds } from 'src/utils';

export function IsValidHashIds(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidHashIds',
      constraints: [],
      target: object.constructor,
      options: { message: 'This field is not a valid id', ...validationOptions },
      propertyName,
      validator: {
        validate(value: any) {
          return !!hashIds.decode(value)[0];
        },
      },
    });
  };
}
