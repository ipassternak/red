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
  ApiTags,
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
@ApiTags('Quests')
export class QuestController {
  constructor(private readonly questService: QuestService) {}

  @Get('/list/gallery')
  @ApiOperation({ description: 'Get list of quests from the gallery' })
  @SerializeOptions({ type: QuestListResponseDto })
  @ApiOkResponse({ type: QuestListResponseDto })
  async getListGallery(
    @Query() params: GetQuestListParamsDto,
  ): Promise<QuestListResponseDto> {
    return await this.questService.getListGallery(params);
  }

  @UseGuards(JwtAccessGuard)
  @Get('/list/authored')
  @ApiBearerAuth()
  @ApiOperation({ description: 'Get list of authored quests' })
  @SerializeOptions({ type: QuestListResponseDto })
  @ApiOkResponse({ type: QuestListResponseDto })
  async getListUnpublished(
    @Query() params: GetQuestListParamsDto,
    @Req() request: { accessPayload: AuthAccessPayload },
  ): Promise<QuestListResponseDto> {
    const { accessPayload } = request;
    return await this.questService.getListAuthored(params, accessPayload);
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
