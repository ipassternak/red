import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { AuthAccessPayload } from '@lib/types/auth';
import { JwtAccessGuard } from '@src/auth/guards/jwt-access.guard';

import {
  ChangeQuestVisibilityDto,
  CreateQuestDataDto,
  GetQuestListParamsDto,
  QuestListResponseDto,
  QuestResponseDto,
} from './dto/quest.dto';
import { QuestService } from './quest.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('/api/quests')
export class QuestController {
  constructor(private readonly questService: QuestService) {}

  @Get()
  @ApiOperation({ description: 'Get list of quests' })
  @SerializeOptions({ type: QuestListResponseDto })
  @ApiOkResponse({ type: QuestListResponseDto })
  async getList(
    @Query() params: GetQuestListParamsDto,
  ): Promise<QuestListResponseDto> {
    return await this.questService.getList(params);
  }

  @Get('/:id')
  @ApiOperation({ description: 'Get quest by id' })
  @SerializeOptions({ type: QuestResponseDto })
  @ApiOkResponse({ type: QuestResponseDto })
  async get(
    @Param('id') id: string,
    @Req() request: { accessPayload: AuthAccessPayload },
  ): Promise<QuestResponseDto> {
    return await this.questService.get(id, request.accessPayload);
  }

  @UseGuards(JwtAccessGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ description: 'Create new unpublished quest' })
  @SerializeOptions({ type: QuestResponseDto })
  @ApiCreatedResponse({ type: QuestResponseDto })
  async create(
    @Body() data: CreateQuestDataDto,
    @Req() request: { accessPayload: AuthAccessPayload },
  ): Promise<QuestResponseDto> {
    const { accessPayload } = request;
    return await this.questService.create(data, accessPayload);
  }

  @UseGuards(JwtAccessGuard)
  @Post('/:id/change-visibility')
  @ApiBearerAuth()
  @ApiOperation({ description: 'Change quest visibility' })
  @ApiOkResponse({ type: QuestResponseDto })
  @HttpCode(200)
  async changeVisibility(
    @Param('id') id: string,
    @Body() data: ChangeQuestVisibilityDto,
    @Req() request: { accessPayload: AuthAccessPayload },
  ): Promise<QuestResponseDto> {
    const { accessPayload } = request;
    return await this.questService.changeVisibility(id, data, accessPayload);
  }
}
