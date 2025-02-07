import { ApiProperty } from '@nestjs/swagger';

export class TokenResponseDto {
  @ApiProperty({ description: 'Access token' })
  accessToken: string;

  @ApiProperty({ description: 'Refresh token' })
  refreshToken: string;
}

export class UserResponseDto {
  @ApiProperty({ description: 'ID' })
  id: string;

  @ApiProperty({ description: 'OID' })
  oid: string;

  @ApiProperty({ description: 'Email' })
  email: string;

  @ApiProperty({ description: 'Full name' })
  fullName: string;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  createdAt: Date;
}
