import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GracefulShutdownModule } from 'nestjs-graceful-shutdown';
import { LoggerModule } from 'nestjs-pino';

import { RequestIdMiddleware } from '@lib/middlewars/request-id.middleware';
import { loadConfig } from '@lib/utils/config';
import { AppConfigDto } from 'config/app.dto';

import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [loadConfig('config.json', AppConfigDto)],
    }),
    LoggerModule.forRootAsync({
      useFactory: (configService: ConfigService<AppConfigDto, true>) => ({
        pinoHttp: {
          level: configService.get('server.logLevel', { infer: true }),
        },
        exclude: [{ method: RequestMethod.GET, path: 'health' }],
      }),
      inject: [ConfigService],
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
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
