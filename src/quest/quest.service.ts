import {
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, QuestStatus } from '@prisma/client';

import { AuthAccessPayload } from '@lib/types/auth';
import { createAppException } from '@lib/utils/exception';
import { PrismaService } from '@src/database/prisma.service';

import {
  ChangeQuestVisibilityDto,
  CreateQuestDataDto,
  GetQuestListParamsDto,
  QuestListResponseDto,
  QuestResponseDto,
} from './dto/quest.dto';

export const QuestAccessForbiddenException = createAppException(
  'Only author can view or change the quest',
  HttpStatus.FORBIDDEN,
  'QUEST_ERR_ACCESS_FORBIDDEN',
);

export const QuestTitleAlreadyTakenException = createAppException(
  'Quest title already taken',
  HttpStatus.CONFLICT,
  'QUEST_ERR_TITLE_TAKEN',
);

@Injectable()
export class QuestService {
  private readonly logger = new Logger(QuestService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async getListGallery(
    params: GetQuestListParamsDto,
  ): Promise<QuestListResponseDto> {
    const where: Prisma.QuestWhereInput = {
      title: {
        contains: params.title,
        mode: 'insensitive',
      },
      status: QuestStatus.PUBLISHED,
    };
    const [data, total] = await Promise.all([
      this.prismaService.quest.findMany({
        where,
        take: params.pageSize,
        skip: (params.page - 1) * params.pageSize,
        orderBy: { [params.sortColumn]: params.sortOrder },
        include: {
          author: true,
        },
      }),
      this.prismaService.quest.count({ where }),
    ]);
    return {
      meta: { total },
      data,
    };
  }

  async getListAuthored(
    params: GetQuestListParamsDto,
    access: AuthAccessPayload,
  ): Promise<QuestListResponseDto> {
    const where: Prisma.QuestWhereInput = {
      authorId: access.sub,
      title: {
        contains: params.title,
        mode: 'insensitive',
      },
      status: params.status,
    };
    const [data, total] = await Promise.all([
      this.prismaService.quest.findMany({
        where,
        take: params.pageSize,
        skip: (params.page - 1) * params.pageSize,
        orderBy: { [params.sortColumn]: params.sortOrder },
        include: {
          author: true,
        },
      }),
      this.prismaService.quest.count({ where }),
    ]);
    return {
      meta: { total },
      data,
    };
  }

  async get(id: string, access: AuthAccessPayload): Promise<QuestResponseDto> {
    const quest = await this.prismaService.quest.findUnique({
      where: { id },
      include: {
        author: true,
      },
    });
    if (!quest) throw new NotFoundException('Quest not found');
    if (
      quest.status === QuestStatus.UNPUBLISHED &&
      quest.authorId !== access.sub
    )
      throw new QuestAccessForbiddenException();
    return quest;
  }

  async create(
    data: CreateQuestDataDto,
    access: AuthAccessPayload,
  ): Promise<QuestResponseDto> {
    const quest = await this.prismaService.quest
      .create({
        data: {
          title: data.title,
          description: data.description,
          difficulty: data.difficulty,
          author: {
            connect: { id: access.sub },
          },
        },
        include: {
          author: true,
        },
      })
      .catch((error: unknown): never => {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002')
            throw new QuestTitleAlreadyTakenException();
        }
        this.logger.fatal({
          service: `${QuestService.name}.create`,
          error,
          context: {},
        });
        throw new InternalServerErrorException();
      });
    return quest;
  }

  async changeVisibility(
    id: string,
    data: ChangeQuestVisibilityDto,
    access: AuthAccessPayload,
  ): Promise<QuestResponseDto> {
    const quest = await this.get(id, access);
    if (quest.authorId !== access.sub)
      throw new QuestAccessForbiddenException();
    if (quest.status === data.status)
      throw new ConflictException('Invaid quest status');
    return await this.prismaService.quest.update({
      where: { id },
      data: { status: data.status },
      include: {
        author: true,
      },
    });
  }
}
