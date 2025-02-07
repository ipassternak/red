import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OAuthGoogleGuard extends AuthGuard('oauth-google') {
  constructor() {
    super({
      property: 'oauthPayload',
    });
  }
}
