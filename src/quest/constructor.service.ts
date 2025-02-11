import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Prisma,
  Quest,
  QuestInteractionType,
  QuestStatus,
} from '@prisma/client';

import { AppConfigDto } from '@config/app.dto';
import { AuthAccessPayload } from '@lib/types/auth';
import { createAppException } from '@lib/utils/exception';
import { PrismaService } from '@src/database/prisma.service';

import {
  CreateInteractionDataDto,
  CreateSceneDataDto,
  InteractionListResponseDto,
  InteractionResponseDto,
  InteractionWithMetadataResponseDto,
  ManageInteractionDependenciesDataDto,
  QuestMetadataResponseDto,
  QuestionInteractionDataDto,
  SceneListResponseDto,
  SceneWithMetadataResponseDto,
  TransitionInteractionDataDto,
  UpdateInteractionDataDto,
  UpdateQuestDataDto,
  UpdateSceneDataDto,
} from './dto/constructor.dto';
import { QuestResponseDto } from './dto/quest.dto';
import { QuestAccessForbiddenException } from './quest.service';

const QuestCannotBeConstructedException = createAppException(
  'Quest cannot be constucted in published status',
  HttpStatus.FORBIDDEN,
  'QUEST_CANNOT_BE_CONSTRUCTED',
);

@Injectable()
export class ConstructorService {
  private readonly logger = new Logger(ConstructorService.name);

  constructor(
    private readonly configService: ConfigService<AppConfigDto, true>,
    private readonly prismaService: PrismaService,
  ) {}

  private async checkQuestAccess(
    questId: string,
    access: AuthAccessPayload,
    status?: QuestStatus,
  ): Promise<Quest> {
    const quest = await this.prismaService.quest.findUnique({
      where: {
        id: questId,
        authorId: access.sub,
      },
    });
    if (!quest) throw new NotFoundException('Quest not found');
    if (quest.authorId !== access.sub)
      throw new QuestAccessForbiddenException();
    if (status && quest.status !== status)
      throw new QuestCannotBeConstructedException();
    return quest;
  }

  async updateQuest(
    questId: string,
    data: UpdateQuestDataDto,
    access: AuthAccessPayload,
  ): Promise<QuestResponseDto> {
    await this.checkQuestAccess(questId, access, QuestStatus.UNPUBLISHED);
    const maxTimeLimit = this.configService.get(
      'questConstructor.maxTimeLimit',
      {
        infer: true,
      },
    );
    if (data.timeLimit !== undefined && data.timeLimit > maxTimeLimit)
      throw new BadRequestException('Time limit exceeds the maximum value');
    const quest = await this.prismaService.quest
      .update({
        where: { id: questId },
        data: {
          title: data.title,
          description: data.description,
          difficulty: data.difficulty,
          timeLimit: data.timeLimit,
          thumbnail: data.thumbnail,
        },
        include: {
          author: true,
        },
      })
      .catch((error: unknown): never => {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2025')
            throw new NotFoundException('Quest not found');
        }
        this.logger.fatal({
          service: `${ConstructorService.name}.updateQuest`,
          error,
          context: { questId },
        });
        throw new InternalServerErrorException();
      });
    return quest;
  }

  async getQuestMetadata(questId: string): Promise<QuestMetadataResponseDto> {
    const [totalScenes, totalInteractions, totalQuestions] = await Promise.all([
      this.prismaService.questScene.count({ where: { questId } }),
      this.prismaService.questInteraction.count({ where: { questId } }),
      this.prismaService.questInteraction.count({
        where: { questId, type: QuestInteractionType.QUESTION },
      }),
    ]);

    return {
      totalScenes,
      totalInteractions,
      totalQuestions,
    };
  }

  async getQuestScenes(
    questId: string,
    access: AuthAccessPayload,
  ): Promise<SceneListResponseDto> {
    await this.checkQuestAccess(questId, access);
    const where: Prisma.QuestSceneWhereInput = { questId };
    const [data, total] = await Promise.all([
      this.prismaService.questScene.findMany({
        where,
        orderBy: { createdAt: 'asc' },
      }),
      this.prismaService.questScene.count({ where }),
    ]);
    return {
      meta: { total },
      data,
    };
  }

  async getQuestInteractions(
    questId: string,
    access: AuthAccessPayload,
  ): Promise<InteractionListResponseDto> {
    await this.checkQuestAccess(questId, access);
    const where: Prisma.QuestInteractionWhereInput = { questId };
    const [data, total] = await Promise.all([
      this.prismaService.questInteraction.findMany({
        where,
        orderBy: { createdAt: 'asc' },
        include: {
          transitions: true,
          dependencies: true,
        },
      }),
      this.prismaService.questInteraction.count({ where }),
    ]);
    return {
      meta: { total },
      data,
    };
  }

  async getSceneInteractions(
    questId: string,
    questSceneId: string,
    access: AuthAccessPayload,
  ): Promise<InteractionListResponseDto> {
    await this.checkQuestAccess(questId, access);
    const where: Prisma.QuestInteractionWhereInput = { questId, questSceneId };
    const [data, total] = await Promise.all([
      this.prismaService.questInteraction.findMany({
        where,
        orderBy: { createdAt: 'asc' },
        include: {
          transitions: true,
          dependencies: true,
        },
      }),
      this.prismaService.questInteraction.count({ where }),
    ]);
    return {
      meta: { total },
      data,
    };
  }

  async createScene(
    questId: string,
    data: CreateSceneDataDto,
    access: AuthAccessPayload,
  ): Promise<SceneWithMetadataResponseDto> {
    await this.checkQuestAccess(questId, access, QuestStatus.UNPUBLISHED);
    const scenesCount = await this.prismaService.questScene.count({
      where: { questId },
    });
    if (
      scenesCount >=
      this.configService.get('questConstructor.maxScenesCount', { infer: true })
    )
      throw new ConflictException('Maximum scenes count reached');
    const scene = await this.prismaService.questScene.create({
      data: {
        label: data.label,
        width: data.width,
        height: data.height,
        background: data.background,
        isMain: scenesCount === 0,
        quest: {
          connect: {
            id: questId,
          },
        },
      },
    });
    const meta = await this.getQuestMetadata(questId);
    return {
      data: scene,
      meta,
    };
  }

  async updateScene(
    questId: string,
    questSceneId: string,
    data: UpdateSceneDataDto,
    access: AuthAccessPayload,
  ): Promise<SceneWithMetadataResponseDto> {
    await this.checkQuestAccess(questId, access, QuestStatus.UNPUBLISHED);
    const scene = await this.prismaService.questScene
      .update({
        where: { id: questSceneId, questId },
        data: {
          label: data.label,
          width: data.width,
          height: data.height,
          background: data.background,
        },
      })
      .catch((error: unknown): never => {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2025')
            throw new NotFoundException('Scene not found');
        }
        this.logger.fatal({
          service: `${ConstructorService.name}.updateScene`,
          error,
          context: { questId, questSceneId },
        });
        throw new InternalServerErrorException();
      });
    const meta = await this.getQuestMetadata(questId);
    return {
      data: scene,
      meta,
    };
  }

  async deleteScene(
    questId: string,
    questSceneId: string,
    access: AuthAccessPayload,
  ): Promise<QuestMetadataResponseDto> {
    await this.checkQuestAccess(questId, access, QuestStatus.UNPUBLISHED);
    await this.prismaService.questScene
      .delete({
        where: {
          id: questSceneId,
          questId,
          isMain: false,
        },
      })
      .catch((error: unknown): never => {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2025')
            throw new NotFoundException('Scene not found or is main');
        }
        this.logger.fatal({
          service: `${ConstructorService.name}.deleteScene`,
          error,
          context: { questId, questSceneId },
        });
        throw new InternalServerErrorException();
      });
    const meta = await this.getQuestMetadata(questId);
    return meta;
  }

  private async createQuestionInteraction(
    questId: string,
    data: CreateInteractionDataDto,
    question: QuestionInteractionDataDto,
  ): Promise<InteractionResponseDto> {
    const interaction = await this.prismaService.questInteraction.create({
      data: {
        penalty: data.penalty,
        dx: data.dx,
        dy: data.dy,
        radius: data.radius,
        label: data.label,
        type: QuestInteractionType.QUESTION,
        template: question.template,
        settings: question.settings,
        answers: JSON.stringify(question.answers),
        questScene: {
          connect: {
            id: data.questSceneId,
          },
        },
        quest: {
          connect: {
            id: questId,
          },
        },
      },
      include: {
        dependencies: true,
      },
    });
    return interaction;
  }

  private async createTransitionInteraction(
    questId: string,
    data: CreateInteractionDataDto,
    transitions: TransitionInteractionDataDto[],
  ): Promise<InteractionResponseDto> {
    const interaction = await this.prismaService.questInteraction
      .create({
        data: {
          penalty: data.penalty,
          dx: data.dx,
          dy: data.dy,
          radius: data.radius,
          label: data.label,
          type: QuestInteractionType.TRANSITION,
          questScene: {
            connect: {
              id: data.questSceneId,
            },
          },
          quest: {
            connect: {
              id: questId,
            },
          },
          transitions: {
            createMany: {
              data: transitions.map(({ sceneId }) => ({
                sceneId,
              })),
            },
          },
        },
        include: {
          transitions: true,
          dependencies: true,
        },
      })
      .catch((error: unknown): never => {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2003')
            throw new NotFoundException('Some of transitions scenes not found');
        }
        this.logger.fatal({
          service: `${ConstructorService.name}.createTransitionInteraction`,
          error,
          context: { questId, data, transitions },
        });
        throw new InternalServerErrorException();
      });
    return interaction;
  }

  async createInteraction(
    questId: string,
    data: CreateInteractionDataDto,
    access: AuthAccessPayload,
  ): Promise<InteractionWithMetadataResponseDto> {
    const question: QuestionInteractionDataDto =
      data.question ?? <QuestionInteractionDataDto>{};
    if (data.type === QuestInteractionType.QUESTION && !data.question)
      throw new BadRequestException(
        'Question data is required for question interaction',
      );
    const transitions = data.transitions ?? [];
    if (data.type === QuestInteractionType.TRANSITION && !data.transitions)
      throw new BadRequestException(
        'Transitions are required for transition interaction',
      );
    await this.checkQuestAccess(questId, access, QuestStatus.UNPUBLISHED);
    const interactionsCount = await this.prismaService.questInteraction.count({
      where: { questId },
    });
    if (
      interactionsCount >=
      this.configService.get('questConstructor.maxInteractionsCount', {
        infer: true,
      })
    )
      throw new ConflictException('Maximum interactions count reached');
    const scene = await this.prismaService.questScene.findUnique({
      where: { id: data.questSceneId, questId },
    });
    if (!scene)
      throw new NotFoundException(
        'Scene not found or does not belong to the quest',
      );
    const interaction =
      data.type === QuestInteractionType.QUESTION
        ? await this.createQuestionInteraction(questId, data, question)
        : await this.createTransitionInteraction(questId, data, transitions);
    const meta = await this.getQuestMetadata(questId);
    return {
      data: interaction,
      meta,
    };
  }

  async updateInteraction(
    questId: string,
    interactionId: string,
    data: UpdateInteractionDataDto,
    access: AuthAccessPayload,
  ): Promise<InteractionWithMetadataResponseDto> {
    await this.checkQuestAccess(questId, access, QuestStatus.UNPUBLISHED);
    const interaction = await this.prismaService.questInteraction
      .update({
        where: {
          id: interactionId,
          questId,
          type: QuestInteractionType.QUESTION,
        },
        data: {
          penalty: data.penalty,
          dx: data.dx,
          dy: data.dy,
          radius: data.radius,
          label: data.label,
          template: data.question.template,
          settings: data.question.settings,
          answers: JSON.stringify(data.question.answers),
        },
        include: {
          dependencies: true,
        },
      })
      .catch((error: unknown): never => {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2025')
            throw new NotFoundException(
              'Interaction not found or is not a question',
            );
        }
        this.logger.fatal({
          service: `${ConstructorService.name}.updateQuestionInteraction`,
          error,
          context: { questId, interactionId },
        });
        throw new InternalServerErrorException();
      });
    const meta = await this.getQuestMetadata(questId);
    return {
      data: interaction,
      meta,
    };
  }

  async deleteInteraction(
    questId: string,
    interactionId: string,
    access: AuthAccessPayload,
  ): Promise<QuestMetadataResponseDto> {
    await this.checkQuestAccess(questId, access, QuestStatus.UNPUBLISHED);
    await this.prismaService.questInteraction
      .delete({
        where: { id: interactionId, questId },
      })
      .catch((error: unknown): never => {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2025')
            throw new NotFoundException('Interaction not found');
        }
        this.logger.fatal({
          service: `${ConstructorService.name}.deleteInteraction`,
          error,
          context: { questId, interactionId },
        });
        throw new InternalServerErrorException();
      });
    const meta = await this.getQuestMetadata(questId);
    return meta;
  }

  async manageInteractionDependencies(
    questId: string,
    interactionId: string,
    data: ManageInteractionDependenciesDataDto,
    access: AuthAccessPayload,
  ): Promise<InteractionWithMetadataResponseDto> {
    await this.checkQuestAccess(questId, access, QuestStatus.UNPUBLISHED);
    const actions = [];
    if (data.add.length > 0)
      actions.push(
        this.prismaService.interactionLock.createMany({
          data: data.add.map(({ dependencyId }) => ({
            dependantId: interactionId,
            dependencyId,
          })),
        }),
      );
    if (data.remove.length > 0)
      actions.push(
        this.prismaService.interactionLock.deleteMany({
          where: {
            dependantId: interactionId,
            dependencyId: {
              in: data.remove.map(({ dependencyId }) => dependencyId),
            },
          },
        }),
      );
    await this.prismaService
      .$transaction(actions)
      .catch((error: unknown): never => {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002')
            throw new ConflictException('Some of dependencies already exists');
          if (error.code === 'P2003')
            throw new NotFoundException(
              'Some of dependencies or interaction not found',
            );
        }
        this.logger.fatal({
          service: `${ConstructorService.name}.manageInteractionDependencies`,
          error,
          context: {
            questId,
            interactionId,
            add: data.add,
            remove: data.remove,
          },
        });
        throw new InternalServerErrorException();
      });
    const interaction =
      await this.prismaService.questInteraction.findUniqueOrThrow({
        where: { id: interactionId },
        include: {
          transitions: true,
          dependencies: true,
        },
      });
    const meta = await this.getQuestMetadata(questId);
    return {
      data: interaction,
      meta,
    };
  }
}
