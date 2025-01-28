import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { setupGracefulShutdown } from 'nestjs-graceful-shutdown';
import { Logger } from 'nestjs-pino';

import { AppConfig } from '@lib/types/config';
import { AppValidationPipe } from '@lib/utils/exception';

import { AppExceptionFilter } from './app.exception-filter';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  app.useGlobalFilters(new AppExceptionFilter());
  app.useGlobalPipes(new AppValidationPipe());
  setupGracefulShutdown({ app });
  const logger = app.get(Logger);
  app.useLogger(logger);
  const config = app.get(ConfigService<AppConfig, true>);
  app.set('trust proxy', config.get('server.trustProxy', { infer: true }));
  app.enableCors(config.get('server.cors', { infer: true }));
  await app.listen(config.get('server.port', { infer: true }));
}

void bootstrap();
