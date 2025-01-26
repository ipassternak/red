import { HttpException, HttpStatus } from '@nestjs/common';

export class AppException extends HttpException {
  readonly name = 'AppException';
  readonly errorCode?: string;

  constructor(
    message: string | string[],
    errorCode: string,
    statusCode: number,
  ) {
    super(message, statusCode);
    this.errorCode = errorCode;
  }
}

export const createAppException = (
  message: string | string[],
  errorCode: string,
  statusCode: HttpStatus,
): new () => AppException =>
  class extends AppException {
    constructor() {
      super(message, errorCode, statusCode);
    }
  };
