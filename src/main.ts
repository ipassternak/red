import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { setupGracefulShutdown } from 'nestjs-graceful-shutdown';
import { Logger } from 'nestjs-pino';

import { AppConfig } from '@lib/types/config';

import { AppFilter } from './app.filter';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  app.useGlobalFilters(new AppFilter());
  setupGracefulShutdown({ app });
  const logger = app.get(Logger);
  app.useLogger(logger);
  const config = app.get(ConfigService<AppConfig, true>);
  app.set('trust proxy', config.get('server.trustProxy', { infer: true }));
  await app.listen(config.get('server.port', { infer: true }));
}

void bootstrap();
