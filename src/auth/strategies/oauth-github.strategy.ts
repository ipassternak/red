import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';

import { AppConfigDto } from '@config/app.dto';

@Injectable()
export class OAuthGithubStrategy extends PassportStrategy(
  Strategy,
  'oauth-github',
) {
  constructor(configService: ConfigService<AppConfigDto, true>) {
    super({
      clientID: configService.get('auth.oauth.github.clientId', {
        infer: true,
      }),
      clientSecret: configService.get('auth.oauth.github.clientSecret', {
        infer: true,
      }),
      callbackURL: configService.get('auth.oauth.github.redirectUri', {
        infer: true,
      }),
      scope: ['user:email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ): Promise<Profile> {
    return profile;
  }
}
