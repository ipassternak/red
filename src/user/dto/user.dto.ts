import { ApiProperty } from '@nestjs/swagger';
import { JsonValue } from '@prisma/client/runtime/library';
import { Exclude, Type } from 'class-transformer';

import { ResponseDto } from '@lib/dto/common.dto';
import { FileDataDto } from '@src/files/dto/files.dto';

export class UserResponseDto extends ResponseDto {
  @ApiProperty({ description: 'User ID' })
  id: string;

  @Exclude()
  oid: string;

  @Exclude()
  email: string;

  @ApiProperty({ description: 'User full name' })
  fullName: string;

  @ApiProperty({ type: FileDataDto })
  @Type(() => FileDataDto)
  avatar: JsonValue;

  @Exclude()
  updatedAt: Date;

  @ApiProperty({ description: 'Date when the user was created' })
  createdAt: Date;
}
