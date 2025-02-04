import { Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AppConfigDto } from '@config/app.dto';
import { AuthRefreshPayload } from '@lib/types/auth';
import { AuthService } from '@src/auth/auth.service';

@Injectable({
  scope: Scope.DEFAULT,
})
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly authService: AuthService,
    configService: ConfigService<AppConfigDto, true>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('auth.jwt.secret', { infer: true }),
    });
  }

  async validate(payload: AuthRefreshPayload): Promise<AuthRefreshPayload> {
    const isValid = await this.authService.verifyRefresh(payload);
    if (!isValid)
      throw new UnauthorizedException(
        'Refresh denied. Invalid authorization token',
      );
    return payload;
  }
}
