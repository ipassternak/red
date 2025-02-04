import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';

import { AuthAccessPayload, AuthRefreshPayload } from '@lib/types/auth';

import { AuthService } from './auth.service';
import { LoginRequestDto, LoginResponseDto } from './dto/login.dto';
import { JwtAccessGuard } from './guards/jwt-access.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ description: 'Log in new session' })
  @ApiCreatedResponse({ type: LoginResponseDto })
  async login(@Body() data: LoginRequestDto): Promise<LoginResponseDto> {
    return await this.authService.login(data);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @ApiOperation({ description: 'Refresh active session' })
  @ApiCreatedResponse({ type: LoginResponseDto })
  async refresh(
    @Req() request: { refreshPayload: AuthRefreshPayload },
  ): Promise<LoginResponseDto> {
    const { refreshPayload } = request;
    return await this.authService.refresh(refreshPayload);
  }

  @UseGuards(JwtAccessGuard)
  @Get('me')
  @ApiOperation({ description: 'Get active session subject' })
  async me(
    @Req() request: { accessPayload: AuthAccessPayload },
  ): Promise<unknown> {
    const { accessPayload } = request;
    return await this.authService.me(accessPayload);
  }
}
