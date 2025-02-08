import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserResponseDto {
  @ApiProperty({ description: 'User ID' })
  id: string;

  @Exclude()
  oid: string;

  @Exclude()
  email: string;

  @ApiProperty({ description: 'User full name' })
  fullName: string;

  @Exclude()
  updatedAt: Date;

  @ApiProperty({ description: 'Date when the user was created' })
  createdAt: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
