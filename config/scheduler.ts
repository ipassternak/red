import { IsNotEmpty, IsString } from 'class-validator';

export class SchedulerConfigDto {
  @IsString()
  @IsNotEmpty()
  authCleanupSessions = '0 0 * * *';
}
