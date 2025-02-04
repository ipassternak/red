import { Type } from 'class-transformer';
import { IsNotEmptyObject, ValidateNested } from 'class-validator';

import { AuthConfigDto } from './auth.dto';
import { ServerConfigDto } from './server.dto';

export class AppConfigDto {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => ServerConfigDto)
  server = new ServerConfigDto();

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => AuthConfigDto)
  auth = new AuthConfigDto();
}
