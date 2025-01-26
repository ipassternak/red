import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

import { AppException } from '@lib/utils/exception';

export interface AppExceptionPayload {
  statusCode: number;
  message: string | string[];
  errorCode?: string;
}

const DEFAULT_STATUS_CODE = 500;
const DEFAULT_MESSAGE = 'Internal server error';

@Catch()
export class AppFilter implements ExceptionFilter {
  private readonly logger = new Logger(AppFilter.name);

  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    this.logger.error(exception);

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : DEFAULT_STATUS_CODE;
    const message =
      statusCode >= 500 && statusCode <= 599
        ? DEFAULT_MESSAGE
        : exception.message;
    const errorCode =
      exception instanceof AppException ? exception.errorCode : undefined;

    const payload: AppExceptionPayload = {
      statusCode,
      message,
      errorCode,
    };

    response.status(statusCode).json(payload);
  }
}
