import { Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AppConfigDto } from '@config/app.dto';
import { AuthAccessPayload } from '@lib/types/auth';
import { AuthService } from '@src/auth/auth.service';

@Injectable({
  scope: Scope.DEFAULT,
})
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
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

  async validate(payload: AuthAccessPayload): Promise<AuthAccessPayload> {
    const isValid = await this.authService.verifyAccess(payload);
    if (!isValid)
      throw new UnauthorizedException(
        'Access denied. Invalid authorization token',
      );
    return payload;
  }
}
