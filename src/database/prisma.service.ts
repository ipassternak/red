import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

import { AppConfigDto } from '@config/app.dto';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(configService: ConfigService<AppConfigDto, true>) {
    super({
      datasourceUrl: configService.get('database.url', { infer: true }),
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
