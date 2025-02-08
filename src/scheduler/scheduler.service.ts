import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

import { AppConfigDto } from '@config/app.dto';
import { AuthService } from '@src/auth/auth.service';

@Injectable()
export class SchedulerService implements OnModuleInit {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private readonly configService: ConfigService<AppConfigDto, true>,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly authService: AuthService,
  ) {}

  private schedule(name: string, cron: string, job: () => Promise<void>): void {
    const cronJob = new CronJob(cron, async () => {
      try {
        this.logger.log({
          service: `${SchedulerService.name}.${name}`,
          message: 'Executing scheduled job',
        });
        await job();
      } catch (error: unknown) {
        this.logger.error({
          service: `${SchedulerService.name}.${name}`,
          message: 'Error occurred during job execution',
          error,
        });
      }
    });
    this.schedulerRegistry.addCronJob(name, cronJob);
    cronJob.start();
  }

  private authCleanupSessions(): void {
    const cron = this.configService.get('scheduler.authCleanupSessions', {
      infer: true,
    });
    this.schedule('authCleanupSessions', cron, async () => {
      await this.authService.cleanupSessions();
    });
  }

  onModuleInit(): void {
    this.authCleanupSessions();
  }
}
