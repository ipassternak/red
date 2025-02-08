import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
  ValidateNested,
} from 'class-validator';

export class JwtConfigDto {
  @IsString()
  @IsNotEmpty()
  @Length(32, 128)
  secret: string;

  @IsInt()
  accessTtl: number;

  @IsInt()
  refreshTtl: number;

  @IsInt()
  refreshNotBefore: number;
}

export class OAuthGoogleConfigDto {
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @IsString()
  @IsNotEmpty()
  clientSecret: string;

  @IsString()
  @IsNotEmpty()
  redirectUri: string;
}

export class OAuthGithubConfigDto {
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @IsString()
  @IsNotEmpty()
  clientSecret: string;

  @IsString()
  @IsNotEmpty()
  redirectUri: string;
}

export class OAuthConfigDto {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => OAuthGoogleConfigDto)
  google: OAuthGoogleConfigDto = new OAuthGoogleConfigDto();

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => OAuthGithubConfigDto)
  github: OAuthGithubConfigDto = new OAuthGithubConfigDto();

  @IsString()
  @IsNotEmpty()
  successRedirectUri: string;

  @IsString()
  @IsNotEmpty()
  errorRedirectUri: string;
}

export class AuthConfigDto {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => JwtConfigDto)
  jwt: JwtConfigDto = new JwtConfigDto();

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => OAuthConfigDto)
  oauth: OAuthConfigDto = new OAuthConfigDto();

  @IsOptional()
  @IsNumber()
  @Min(1)
  activeSessionsLimit?: number;
}
