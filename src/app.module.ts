import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import serverConfig from '@lib/config/server';
import { AppConfig } from '@lib/types/config';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
