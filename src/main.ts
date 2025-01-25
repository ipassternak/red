import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppConfig } from '@lib/types/config';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService<AppConfig, true>);
  await app.listen(config.get('server.port', { infer: true }));
}

void bootstrap();
