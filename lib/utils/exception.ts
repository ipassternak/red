import {
  HttpException,
  HttpStatus,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

export interface AppExceptionPayload {
  statusCode: number;
  message: string;
  errorCode: string | null;
  details: unknown;
}

export class AppException extends HttpException {
  readonly name = 'AppException';
  readonly errorCode: string | null;
  readonly details: unknown;

  constructor(
    message: string,
    statusCode: number,
    errorCode: string | null = null,
    details: unknown = null,
  ) {
    super(message, statusCode);
    this.errorCode = errorCode;
    this.details = details;
  }
}

export const createAppException = (
  message: string,
  statusCode: HttpStatus,
  errorCode: string | null = null,
  error: unknown = null,
): new () => AppException =>
  class extends AppException {
    constructor() {
      super(message, statusCode, errorCode, error);
    }
  };

export class AppValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transformOptions: {
        enableImplicitConversion: true,
      },
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    });
  }

  protected exceptionFactory = (errors: ValidationError[]): AppException => {
    const details = super.flattenValidationErrors(errors);
    return new AppException(
      'Request validation failed',
      this.errorHttpStatusCode,
      null,
      details,
    );
  };
}
