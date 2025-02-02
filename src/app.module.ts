import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClsModule, ClsService } from 'nestjs-cls';
import { GracefulShutdownModule } from 'nestjs-graceful-shutdown';
import { LoggerModule } from 'nestjs-pino';

import { loadConfig } from '@lib/utils/config';
import { AppConfigDto } from 'config/app.dto';

import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [loadConfig('config.json', AppConfigDto)],
    }),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
      },
    }),
    LoggerModule.forRootAsync({
      useFactory: (configService: ConfigService<AppConfigDto, true>) => ({
        pinoHttp: {
          level: configService.get('server.logLevel', { infer: true }),
        },
      }),
      inject: [ConfigService, ClsService],
    }),
    GracefulShutdownModule.forRootAsync({
      useFactory: (configService: ConfigService<AppConfigDto, true>) => ({
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
