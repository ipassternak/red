import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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

import { ConstructorService } from './constructor.service';
import {
  CreateInteractionDataDto,
  CreateSceneDataDto,
  InteractionListResponseDto,
  InteractionWithMetadataResponseDto,
  ManageInteractionDependenciesDataDto,
  QuestMetadataResponseDto,
  SceneListResponseDto,
  SceneWithMetadataResponseDto,
  UpdateInteractionDataDto,
  UpdateSceneDataDto,
} from './dto/constructor.dto';

@UseGuards(JwtAccessGuard)
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@Controller('/api/quest-constructor')
@ApiTags('Quest Constructor')
export class ConstructorController {
  constructor(private readonly constructorService: ConstructorService) {}

  @Get('/:questId/metadata')
  @ApiOperation({ description: 'Get quest constructor metadata' })
  @SerializeOptions({ type: QuestMetadataResponseDto })
  @ApiOkResponse({ type: QuestMetadataResponseDto })
  async getQuestMetadata(
    @Param('questId') questId: string,
  ): Promise<QuestMetadataResponseDto> {
    return await this.constructorService.getQuestMetadata(questId);
  }

  @Get('/:questId/scenes')
  @ApiOperation({ description: 'Get quest scenes' })
  @SerializeOptions({ type: SceneListResponseDto })
  @ApiOkResponse({ type: SceneListResponseDto })
  async getQuestScenes(
    @Param('questId') questId: string,
    @Req() request: { accessPayload: AuthAccessPayload },
  ): Promise<SceneListResponseDto> {
    const { accessPayload } = request;
    return await this.constructorService.getQuestScenes(questId, accessPayload);
  }

  @Get('/:questId/interactions')
  @ApiOperation({ description: 'Get quest interactions' })
  @SerializeOptions({ type: InteractionListResponseDto })
  @ApiOkResponse({ type: InteractionListResponseDto })
  async getQuestInteractions(
    @Param('questId') questId: string,
    @Req() request: { accessPayload: AuthAccessPayload },
  ): Promise<InteractionListResponseDto> {
    const { accessPayload } = request;
    return await this.constructorService.getQuestInteractions(
      questId,
      accessPayload,
    );
  }

  @Get('/:questId/scenes/:questSceneId/interactions')
  @ApiOperation({ description: 'Get scene interactions' })
  @SerializeOptions({ type: InteractionListResponseDto })
  @ApiOkResponse({ type: InteractionListResponseDto })
  async getSceneInteractions(
    @Param('questId') questId: string,
    @Param('questSceneId') questSceneId: string,
    @Req() request: { accessPayload: AuthAccessPayload },
  ): Promise<InteractionListResponseDto> {
    const { accessPayload } = request;
    return await this.constructorService.getSceneInteractions(
      questId,
      questSceneId,
      accessPayload,
    );
  }

  @Post('/:questId/scenes')
  @ApiOperation({ description: 'Create new scene' })
  @SerializeOptions({ type: SceneWithMetadataResponseDto })
  @ApiCreatedResponse({ type: SceneWithMetadataResponseDto })
  async createScene(
    @Param('questId') questId: string,
    @Body() data: CreateSceneDataDto,
    @Req() request: { accessPayload: AuthAccessPayload },
  ): Promise<SceneWithMetadataResponseDto> {
    const { accessPayload } = request;
    return await this.constructorService.createScene(
      questId,
      data,
      accessPayload,
    );
  }

  @Put('/:questId/scenes/:questSceneId')
  @ApiOperation({ description: 'Update scene' })
  @SerializeOptions({ type: SceneWithMetadataResponseDto })
  @ApiOkResponse({ type: SceneWithMetadataResponseDto })
  async updateScene(
    @Param('questId') questId: string,
    @Param('questSceneId') questSceneId: string,
    @Body() data: UpdateSceneDataDto,
    @Req() request: { accessPayload: AuthAccessPayload },
  ): Promise<SceneWithMetadataResponseDto> {
    const { accessPayload } = request;
    return await this.constructorService.updateScene(
      questId,
      questSceneId,
      data,
      accessPayload,
    );
  }

  @Delete('/:questId/scenes/:questSceneId')
  @ApiOperation({ description: 'Delete scene' })
  @SerializeOptions({ type: QuestMetadataResponseDto })
  @ApiOkResponse({ type: QuestMetadataResponseDto })
  async deleteScene(
    @Param('questId') questId: string,
    @Param('questSceneId') questSceneId: string,
    @Req() request: { accessPayload: AuthAccessPayload },
  ): Promise<QuestMetadataResponseDto> {
    const { accessPayload } = request;
    return await this.constructorService.deleteScene(
      questId,
      questSceneId,
      accessPayload,
    );
  }

  @Post('/:questId/interactions')
  @ApiOperation({ description: 'Create new interaction' })
  @SerializeOptions({ type: InteractionWithMetadataResponseDto })
  @ApiCreatedResponse({ type: InteractionWithMetadataResponseDto })
  async createInteraction(
    @Param('questId') questId: string,
    @Body() data: CreateInteractionDataDto,
    @Req() request: { accessPayload: AuthAccessPayload },
  ): Promise<InteractionWithMetadataResponseDto> {
    const { accessPayload } = request;
    return await this.constructorService.createInteraction(
      questId,
      data,
      accessPayload,
    );
  }

  @Put('/:questId/interactions/:questInteractionId')
  @ApiOperation({ description: 'Update interaction' })
  @SerializeOptions({ type: InteractionWithMetadataResponseDto })
  @ApiOkResponse({ type: InteractionWithMetadataResponseDto })
  async updateInteraction(
    @Param('questId') questId: string,
    @Param('questInteractionId') interactionId: string,
    @Body() data: UpdateInteractionDataDto,
    @Req() request: { accessPayload: AuthAccessPayload },
  ): Promise<InteractionWithMetadataResponseDto> {
    const { accessPayload } = request;
    return await this.constructorService.updateInteraction(
      questId,
      interactionId,
      data,
      accessPayload,
    );
  }

  @Delete('/:questId/interactions/:questInteractionId')
  @ApiOperation({ description: 'Delete interaction' })
  @SerializeOptions({ type: QuestMetadataResponseDto })
  @ApiOkResponse({ type: QuestMetadataResponseDto })
  async deleteInteraction(
    @Param('questId') questId: string,
    @Param('questInteractionId') interactionId: string,
    @Req() request: { accessPayload: AuthAccessPayload },
  ): Promise<QuestMetadataResponseDto> {
    const { accessPayload } = request;
    return await this.constructorService.deleteInteraction(
      questId,
      interactionId,
      accessPayload,
    );
  }

  @Post('/:questId/interactions/:questInteractionId/manage-dependencies')
  @ApiOperation({ description: 'Manage interaction dependencies' })
  @SerializeOptions({ type: InteractionWithMetadataResponseDto })
  @ApiOkResponse({ type: InteractionWithMetadataResponseDto })
  async manageInteractionDependencies(
    @Param('questId') questId: string,
    @Param('questInteractionId') interactionId: string,
    @Body() data: ManageInteractionDependenciesDataDto,
    @Req() request: { accessPayload: AuthAccessPayload },
  ): Promise<InteractionWithMetadataResponseDto> {
    const { accessPayload } = request;
    return await this.constructorService.manageInteractionDependencies(
      questId,
      interactionId,
      data,
      accessPayload,
    );
  }
}
