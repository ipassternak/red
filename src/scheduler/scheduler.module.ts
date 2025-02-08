import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { AuthModule } from '@src/auth/auth.module';

import { SchedulerService } from './scheduler.service';

@Module({
  imports: [ScheduleModule.forRoot(), AuthModule],
  controllers: [],
  providers: [SchedulerService],
  exports: [],
})
export class SchedulerModule {}
