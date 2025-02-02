import { randomUUID } from 'node:crypto';

import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    req.headers['x-request-id'] ??= randomUUID();
    res.setHeader('X-Request-Id', req.headers['x-request-id']);
    next();
  }
}
