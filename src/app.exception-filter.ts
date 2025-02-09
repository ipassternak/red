import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

import { AppException, AppExceptionPayload } from '@lib/utils/exception';

const DEFAULT_STATUS_CODE = 500;
const DEFAULT_MESSAGE = 'Internal server error';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AppExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    this.logger.error({
      service: `${AppExceptionFilter.name}.catch`,
      error: exception,
    });

    const payload: AppExceptionPayload = {
      statusCode: DEFAULT_STATUS_CODE,
      message: DEFAULT_MESSAGE,
      errorCode: null,
      details: null,
    };

    if (exception instanceof HttpException) {
      payload.message = exception.message;
      payload.statusCode = exception.getStatus();
    }

    if (exception instanceof AppException) {
      payload.errorCode = exception.errorCode;
      payload.details = exception.details;
    }

    response.status(payload.statusCode).json(payload);
  }
}
