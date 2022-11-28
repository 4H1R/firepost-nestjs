import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import { ValidationErrorException } from 'src/common/exception/validation.exception';

export const transformValidationErrors = (e: ValidationError[]) => {
  const errors = e.reduce((acc, curr) => {
    acc[curr.property] = Object.keys(curr.constraints).map((key) => curr.constraints[key]);
    return acc;
  }, {} as Record<string, string[]>);
  throw new ValidationErrorException(errors);
};

export const exclude = <T extends Record<string, unknown>, Key extends keyof T>(
  user: T,
  ...keys: Key[]
): Omit<T, Key> => {
  for (const key of keys) delete user[key];
  return user;
};

export const applySettingsForApp = (app: INestApplication) => {
  app.setGlobalPrefix('/api');
  app.enableCors();
  app.use(helmet());
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: transformValidationErrors,
    }),
  );
};
