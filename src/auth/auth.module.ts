import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AppConfigDto } from '@config/app.dto';
import { UserModule } from '@src/user/user.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { OAuthGithubStrategy } from './strategies/oauth-github.strategy';
import { OAuthGoogleStrategy } from './strategies/oauth-google.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService<AppConfigDto, true>) => ({
        secret: configService.get('auth.jwt.secret', { infer: true }),
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    OAuthGoogleStrategy,
    OAuthGithubStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
