import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class UploadLimitsDto {
  @IsInt()
  fileSize = 1024 * 1024 * 100; // 100 MB

  @IsInt()
  filesCount = 1;
}

export class FilesConfigDto {
  @IsString()
  @IsNotEmpty()
  endPoint: string;

  @IsInt()
  port: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  accessKey?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  secretKey?: string;

  @IsBoolean()
  useSSL: boolean;

  @IsString()
  @IsNotEmpty()
  bucketName: string;

  @IsString()
  @IsNotEmpty()
  publicFolder = '/public';

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => UploadLimitsDto)
  uploadLimits = new UploadLimitsDto();
}
