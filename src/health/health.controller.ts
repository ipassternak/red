import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(private health: HealthCheckService) {}

  @Get()
  @ApiExcludeEndpoint()
  @HealthCheck({ swaggerDocumentation: false })
  async check(): Promise<HealthCheckResult> {
    return await this.health.check([]);
  }
}
