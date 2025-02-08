import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpRedirectResponse,
  Post,
  Redirect,
  Req,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExcludeEndpoint,
  ApiFoundResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Profile as OAuthGithubProfile } from 'passport-github2';
import { Profile as OAuthGoogleProfile } from 'passport-google-oauth20';

import { AuthAccessPayload, AuthRefreshPayload } from '@lib/types/auth';
import { UserResponseDto } from '@src/user/dto/user.dto';

import { AuthService } from './auth.service';
import { TokenResponseDto } from './dto/auth.dto';
import { JwtAccessGuard } from './guards/jwt-access.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { OAuthGithubGuard } from './guards/oauth-github.guard';
import { OAuthGoogleGuard } from './guards/oauth-google.guard';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtRefreshGuard)
  @Post('/refresh')
  @ApiBearerAuth()
  @ApiOperation({ description: 'Refresh active session' })
  @ApiCreatedResponse({ type: TokenResponseDto })
  async refresh(
    @Req() request: { refreshPayload: AuthRefreshPayload },
  ): Promise<TokenResponseDto> {
    const { refreshPayload } = request;
    return await this.authService.refresh(refreshPayload);
  }

  @UseGuards(JwtAccessGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: UserResponseDto })
  @Get('/me')
  @ApiBearerAuth()
  @ApiOperation({ description: 'Get active session subject' })
  @ApiOkResponse({ type: UserResponseDto })
  async me(
    @Req() request: { accessPayload: AuthAccessPayload },
  ): Promise<UserResponseDto> {
    const { accessPayload } = request;
    return await this.authService.me(accessPayload);
  }

  @UseGuards(JwtAccessGuard)
  @Post('/logout')
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Log out active session' })
  @ApiNoContentResponse()
  async logout(
    @Req() request: { accessPayload: AuthAccessPayload },
  ): Promise<void> {
    const { accessPayload } = request;
    await this.authService.logout(accessPayload);
  }

  @UseGuards(OAuthGoogleGuard)
  @Get('/oauth/google')
  @ApiOperation({ description: 'OAuth with Google' })
  @ApiFoundResponse({ description: 'Redirect to Google OAuth' })
  async oauthGoogle(): Promise<void> {
    return;
  }

  @UseGuards(OAuthGoogleGuard)
  @Get('/oauth/google/callback')
  @Redirect()
  @ApiExcludeEndpoint()
  async oauthGoogleCallback(
    @Req() request: { oauthProfile: OAuthGoogleProfile },
  ): Promise<HttpRedirectResponse> {
    const { oauthProfile } = request;
    const url = await this.authService.oauthGoogle(oauthProfile);
    return { url: url.toString(), statusCode: 302 };
  }

  @UseGuards(OAuthGithubGuard)
  @Get('/oauth/github')
  @ApiOperation({ description: 'OAuth with GitHub' })
  @ApiFoundResponse({ description: 'Redirect to GitHub OAuth' })
  async oauthGithub(): Promise<void> {
    return;
  }

  @UseGuards(OAuthGithubGuard)
  @Get('/oauth/github/callback')
  @Redirect()
  @ApiExcludeEndpoint()
  async oauthGithubCallback(
    @Req() request: { oauthProfile: OAuthGithubProfile },
  ): Promise<HttpRedirectResponse> {
    const { oauthProfile } = request;
    const url = await this.authService.oauthGithub(oauthProfile);
    return { url: url.toString(), statusCode: 302 };
  }
}
