import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CorsConfigDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  origin: string[] = ['*'];

  @IsOptional()
  @IsArray()
  @IsIn(['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'], {
    each: true,
  })
  methods: string[] = [
    'GET',
    'HEAD',
    'PUT',
    'PATCH',
    'POST',
    'DELETE',
    'OPTIONS',
  ];

  @IsOptional()
  @IsBoolean()
  credentials = true;
}

export class SwaggerConfigDto {
  @IsOptional()
  @IsBoolean()
  enabled = false;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title = 'Docs';

  @IsOptional()
  @IsString()
  description = '';

  @IsOptional()
  @IsString()
  version = '1.0';

  @IsOptional()
  @IsString()
  path = '/docs';
}

export class ServerConfigDto {
  @IsInt()
  port: number;

  @IsOptional()
  @IsBoolean()
  trustProxy = false;

  @IsOptional()
  @IsIn(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
  logLevel = 'info';

  @IsOptional()
  @IsInt()
  shutdownTimeout = 5 * 1000;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CorsConfigDto)
  cors = new CorsConfigDto();

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => SwaggerConfigDto)
  swagger = new SwaggerConfigDto();
}
