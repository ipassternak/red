import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { JwtAccessGuard } from '@src/auth/guards/jwt-access.guard';

import { UserResponseDto } from './dto/user.dto';
import { UserService } from './user.service';

@UseGuards(JwtAccessGuard)
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('/api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:id')
  @ApiOperation({ description: 'Get user by id' })
  @SerializeOptions({ type: UserResponseDto })
  @ApiOkResponse({ type: UserResponseDto })
  async get(@Param('id') id: string): Promise<UserResponseDto> {
    return await this.userService.get(id);
  }
}
