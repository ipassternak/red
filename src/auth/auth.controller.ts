import {
  Controller,
  Get,
  HttpCode,
  HttpRedirectResponse,
  Post,
  Redirect,
  Req,
  UseGuards,
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

import {
  AuthAccessPayload,
  AuthRefreshPayload,
  OAuthGooglePayload,
} from '@lib/types/auth';

import { AuthService } from './auth.service';
import { TokenResponseDto, UserResponseDto } from './dto/auth.dto';
import { JwtAccessGuard } from './guards/jwt-access.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { OAuthGoogleGuard } from './guards/oauth-google.guard';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
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
  @Get('me')
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
  @Post('logout')
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
  @Get('oauth/google')
  @ApiOperation({ description: 'OAuth with Google' })
  @ApiFoundResponse({ description: 'Redirect to Google OAuth' })
  async oauthGoogle(): Promise<void> {
    return;
  }

  @UseGuards(OAuthGoogleGuard)
  @Get('oauth/google/callback')
  @Redirect()
  @ApiExcludeEndpoint()
  async oauthGoogleCallback(
    @Req() request: { oauthPayload: OAuthGooglePayload },
  ): Promise<HttpRedirectResponse> {
    const { oauthPayload } = request;
    const url = await this.authService.oauthGoogle(oauthPayload);
    return { url: url.toString(), statusCode: 302 };
  }
}
