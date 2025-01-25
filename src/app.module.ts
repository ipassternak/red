import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import serverConfig from '@lib/config/server';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [serverConfig],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
