import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { AppConfigDto } from '@config/app.dto';
import { AuthAccessPayload, AuthRefreshPayload } from '@lib/types/auth';
import { validatePassword } from '@lib/utils/hash';

import { LoginRequestDto, LoginResponseDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService<AppConfigDto, true>,
    private readonly jwtService: JwtService,
  ) {}

  async verifyRefresh(payload: AuthRefreshPayload): Promise<boolean> {
    return false;
  }

  async verifyAccess(payload: AuthAccessPayload): Promise<boolean> {
    return false;
  }

  async login(data: LoginRequestDto): Promise<LoginResponseDto> {
    return {
      accessToken: '',
      refreshToken: '',
    };
  }

  async refresh(payload: AuthRefreshPayload): Promise<LoginResponseDto> {
    return {
      accessToken: '',
      refreshToken: '',
    };
  }

  async me(payload: AuthAccessPayload): Promise<unknown> {
    return payload;
  }
}
