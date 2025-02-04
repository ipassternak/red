import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

export class JwtConfigDto {
  @IsString()
  @IsNotEmpty()
  @Length(32, 128)
  secret: string;

  @IsString()
  @IsNotEmpty()
  expiresIn: string;
}

export class TestUserDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class AuthConfigDto {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => JwtConfigDto)
  jwt: JwtConfigDto = new JwtConfigDto();

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TestUserDto)
  testUsers: TestUserDto[] = [];
}
