import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsString } from 'class-validator';

import { ResponseDto } from '@lib/dto/common.dto';

export class FileDataDto extends ResponseDto {
  @ApiProperty({ description: 'File id' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'File name' })
  @IsString()
  mimeType: string;

  @ApiProperty({ description: 'File size in bytes' })
  @IsInt()
  size: number;

  @ApiProperty({ description: 'File path' })
  @IsString()
  filePath: string;

  @ApiProperty({ description: 'Original file name' })
  @IsString()
  originalName: string;

  @ApiProperty({ description: 'Owner id' })
  @IsString()
  ownerId: string;

  @ApiProperty({ description: 'Creation date' })
  @IsDateString()
  createdAt: string;

  toJSON(): object {
    return {
      id: this.id,
      mimeType: this.mimeType,
      size: this.size,
      filePath: this.filePath,
      originalName: this.originalName,
      ownerId: this.ownerId,
      createdAt: this.createdAt,
    };
  }
}

export class ServeFileParamsDto {
  @ApiProperty({ description: 'File id' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'File mime type' })
  @IsString()
  mimeType: string;
}
