import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GracefulShutdownModule } from 'nestjs-graceful-shutdown';
import { LoggerModule } from 'nestjs-pino';

import serverConfig from '@lib/config/server';
import { AppConfig } from '@lib/types/config';

import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [serverConfig],
    }),
    LoggerModule.forRootAsync({
      useFactory: (configService: ConfigService<AppConfig, true>) => ({
        pinoHttp: {
          level: configService.get('server.logLevel', { infer: true }),
        },
      }),
      inject: [ConfigService],
    }),
    GracefulShutdownModule.forRootAsync({
      useFactory: (configService: ConfigService<AppConfig, true>) => ({
        gracefulShutdownTimeout: configService.get('server.shutdownTimeout', {
          infer: true,
        }),
      }),
      inject: [ConfigService],
    }),
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
