import { randomUUID } from 'node:crypto';

import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma, Session, User } from '@prisma/client';
import { Profile as OAuthGithubProfile } from 'passport-github2';
import { Profile as OAuthGoogleProfile } from 'passport-google-oauth20';

import { AppConfigDto } from '@config/app.dto';
import { AuthAccessPayload, AuthRefreshPayload } from '@lib/types/auth';
import { AppException, createAppException } from '@lib/utils/exception';
import { PrismaService } from '@src/database/prisma.service';
import { UserResponseDto } from '@src/user/dto/user.dto';
import { UserService } from '@src/user/user.service';

import { TokenResponseDto } from './dto/auth.dto';

export const CredentialsAlreadyTakenException = createAppException(
  'Credentials already taken',
  HttpStatus.CONFLICT,
  'AUTH_ERR_CREDENTIALS_TAKEN',
);

export const ActiveSessionsLimitException = createAppException(
  'Active sessions limit exceeded',
  HttpStatus.UNAUTHORIZED,
  'AUTH_ERR_SESSIONS_LIMIT',
);

const OAUTH_GOOGLE_PREFIX = 'google';
const OAUTH_GITHUB_PREFIX = 'github';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly configService: ConfigService<AppConfigDto, true>,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}

  private async issueTokens(session: Session): Promise<TokenResponseDto> {
    const accessPayload: AuthAccessPayload = {
      use: 'access',
      gid: session.gid,
      sub: session.sub,
    };
    const accessToken = await this.jwtService.signAsync(accessPayload, {
      expiresIn: this.configService.get('auth.jwt.accessTtl', {
        infer: true,
      }),
    });
    const refreshPayload: AuthRefreshPayload = {
      use: 'refresh',
      sid: session.sid,
      gid: session.gid,
    };
    const refreshToken = await this.jwtService.signAsync(refreshPayload, {
      expiresIn: this.configService.get('auth.jwt.refreshTtl', {
        infer: true,
      }),
    });
    return { accessToken, refreshToken };
  }

  private async initSession(user: User): Promise<TokenResponseDto> {
    const sid = randomUUID();
    const gid = randomUUID();
    const sub = user.id;
    const session = await this.prismaService.session.create({
      data: {
        sid,
        gid,
        sub,
      },
    });
    return await this.issueTokens(session);
  }

  private async rotateSession(session: Session): Promise<TokenResponseDto> {
    const gid = randomUUID();
    await this.prismaService.session.update({
      where: {
        sid: session.sid,
      },
      data: {
        gid,
      },
    });
    const rotated = { ...session, gid };
    return await this.issueTokens(rotated);
  }

  private async revokeSession(session: Session): Promise<void> {
    await this.prismaService.session.delete({
      where: {
        sid: session.sid,
      },
    });
  }

  async cleanupSessions(): Promise<void> {
    const refreshTtl = this.configService.get('auth.jwt.refreshTtl', {
      infer: true,
    });
    await this.prismaService.$queryRaw`
      DELETE FROM "sessions"
      WHERE "created_at" < NOW() - MAKE_INTERVAL(secs => ${refreshTtl} / 1000)
    `;
  }

  async verifyRefresh(payload: AuthRefreshPayload): Promise<boolean> {
    if (payload.use !== 'refresh') return false;
    const session = await this.prismaService.session.findUnique({
      where: {
        sid: payload.sid,
      },
    });
    if (!session) return false;
    const ttl = Date.now() - session.createdAt.getTime();
    const refreshInterval = Date.now() - session.updatedAt.getTime();
    const refreshTtl = this.configService.get('auth.jwt.refreshTtl', {
      infer: true,
    });
    const refreshNotBefore = this.configService.get(
      'auth.jwt.refreshNotBefore',
      { infer: true },
    );
    return ttl < refreshTtl && refreshInterval > refreshNotBefore;
  }

  async verifyAccess(payload: AuthAccessPayload): Promise<boolean> {
    if (payload.use !== 'access') return false;
    const session = await this.prismaService.session.findFirst({
      where: {
        gid: payload.gid,
      },
    });
    if (!session) return false;
    const ttl = Date.now() - session.updatedAt.getTime();
    return ttl < this.configService.get('auth.jwt.accessTtl', { infer: true });
  }

  private async checkSessionLimit(user: User): Promise<boolean> {
    const limit = this.configService.get('auth.activeSessionsLimit', {
      infer: true,
    });
    if (limit === undefined) return true;
    const activeSessionsCount = await this.prismaService.session.count({
      where: {
        sub: user.id,
      },
    });
    return activeSessionsCount < limit;
  }

  async refresh(payload: AuthRefreshPayload): Promise<TokenResponseDto> {
    const session = await this.prismaService.session.findUniqueOrThrow({
      where: {
        sid: payload.sid,
      },
    });
    const isFraud = session.gid !== payload.gid;
    if (isFraud) {
      await this.revokeSession(session);
      throw new UnauthorizedException('Refresh denied. Fraud attempt detected');
    }
    return await this.rotateSession(session);
  }

  async me(payload: AuthAccessPayload): Promise<UserResponseDto> {
    return await this.userService.get(payload.sub);
  }

  async logout(payload: AuthAccessPayload): Promise<void> {
    const session = await this.prismaService.session.findFirstOrThrow({
      where: {
        gid: payload.gid,
      },
    });
    await this.revokeSession(session);
  }

  private async login({
    oid,
    email,
    fullName,
  }: {
    oid: string;
    email: string;
    fullName: string;
  }): Promise<TokenResponseDto> {
    const user = await this.prismaService.user
      .upsert({
        where: {
          oid,
        },
        update: {
          updatedAt: new Date(),
        },
        create: {
          oid,
          email,
          fullName,
        },
      })
      .catch((error: unknown): never => {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002')
            throw new CredentialsAlreadyTakenException();
        }
        this.logger.fatal({
          service: `${AuthService.name}.login`,
          error,
          context: { oid, email, fullName },
        });
        throw new InternalServerErrorException();
      });
    const isUnlimited = await this.checkSessionLimit(user);
    if (!isUnlimited) throw new ActiveSessionsLimitException();
    return await this.initSession(user);
  }

  private async redirectLogin({
    oid,
    email,
    fullName,
  }: {
    oid: string;
    email: string;
    fullName: string;
  }): Promise<URL> {
    try {
      const tokens = await this.login({ oid, email, fullName });
      const url = new URL(
        this.configService.get('auth.oauth.successRedirectUri', {
          infer: true,
        }),
      );
      url.searchParams.set('accessToken', tokens.accessToken);
      url.searchParams.set('refreshToken', tokens.refreshToken);
      return url;
    } catch (error) {
      const url = new URL(
        this.configService.get('auth.oauth.errorRedirectUri', {
          infer: true,
        }),
      );
      const errorCode = error instanceof AppException ? error.errorCode : null;
      url.searchParams.set('errorCode', `${errorCode}`);
      return url;
    }
  }

  async oauthGoogle(profile: OAuthGoogleProfile): Promise<URL> {
    const { emails = [] } = profile;
    const email = emails.find((e) => e.verified) ?? emails[0];
    return await this.redirectLogin({
      oid: `${OAUTH_GOOGLE_PREFIX}:${profile.id}`,
      email: email.value,
      fullName: profile.displayName,
    });
  }

  async oauthGithub(profile: OAuthGithubProfile): Promise<URL> {
    const { emails = [] } = profile;
    const email = emails[0];
    return await this.redirectLogin({
      oid: `${OAUTH_GITHUB_PREFIX}:${profile.id}`,
      email: email.value,
      fullName: profile.displayName,
    });
  }
}
