import { Type } from 'class-transformer';
import { IsNotEmptyObject, ValidateNested } from 'class-validator';

import { AuthConfigDto } from './auth.dto';
import { DatabaseConfigDto } from './database.dto';
import { FilesConfigDto } from './files';
import { QuestConstructorConfigDto } from './quest-constructor';
import { SchedulerConfigDto } from './scheduler';
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

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => DatabaseConfigDto)
  database = new DatabaseConfigDto();

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => SchedulerConfigDto)
  scheduler = new SchedulerConfigDto();

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => QuestConstructorConfigDto)
  questConstructor = new QuestConstructorConfigDto();

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => FilesConfigDto)
  files: FilesConfigDto = new FilesConfigDto();
}
