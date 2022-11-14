import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationErrorException extends HttpException {
  constructor(errors: Record<string, string[] | string>) {
    super(
      {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'Unprocessable Entity',
        errors,
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
