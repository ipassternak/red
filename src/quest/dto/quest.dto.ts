import { ApiProperty } from '@nestjs/swagger';
import { QuestDifficulty, QuestStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

import { ListResponseDto, PageableDto } from '@lib/dto/common.dto';
import { UserResponseDto } from '@src/user/dto/user.dto';

// Requests
export enum QuestSortColumn {
  Title = 'title',
  TimeLimit = 'timeLimit',
  TotalTasks = 'totalTasks',
  TotalAttempts = 'totalAttempts',
  TotalSolved = 'totalSolved',
  AvgSolvedTime = 'avgSolvedTime',
  AvgRating = 'avgRating',
  UpdatedAt = 'updatedAt',
  CreatedAt = 'createdAt',
}

export class GetQuestListParamsDto extends PageableDto {
  @ApiProperty({
    description: 'Search by title',
    minLength: 3,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  title?: string;

  @ApiProperty({
    description: 'Sort column',
    enum: QuestSortColumn,
    default: QuestSortColumn.Title,
  })
  @IsEnum(QuestSortColumn)
  @IsOptional()
  sortColumn: QuestSortColumn = QuestSortColumn.Title;
}

export class CreateQuestDataDto {
  @ApiProperty({
    description: 'Title of the quest',
    minLength: 3,
    maxLength: 255,
  })
  @IsString()
  @Length(3, 255)
  title: string;

  @ApiProperty({
    description: 'Description of the quest',
    minLength: 1,
    maxLength: 4000,
  })
  @IsString()
  @Length(1, 4000)
  description: string;

  @ApiProperty({
    description: 'Time limit to complete the quest in minutes',
    enum: QuestStatus,
    default: QuestDifficulty.MEDIUM,
  })
  @IsEnum(QuestDifficulty)
  difficulty: QuestDifficulty = QuestDifficulty.MEDIUM;
}

export class ChangeQuestVisibilityDto {
  @ApiProperty({
    description: 'New status of the quest',
    enum: QuestStatus,
  })
  @IsEnum(QuestStatus)
  status: QuestStatus;
}

// Responses
export class QuestResponseDto {
  @ApiProperty({ description: 'Unique identifier for the quest' })
  id: string;

  @ApiProperty({
    description: 'Identifier of the author who created the quest',
  })
  authorId: string;

  @ApiProperty({ description: 'Title of the quest' })
  title: string;

  @ApiProperty({ description: 'Description of the quest' })
  description: string;

  @ApiProperty({
    description: 'Current status of the quest',
    enum: QuestStatus,
  })
  status: QuestStatus;

  @ApiProperty({
    description: 'Difficulty level of the quest',
    enum: QuestDifficulty,
  })
  difficulty: QuestDifficulty;

  @ApiProperty({ description: 'Time limit to complete the quest in minutes' })
  timeLimit: number;

  @ApiProperty({ description: 'Total number of tasks in the quest' })
  totalTasks: number;

  @ApiProperty({
    description: 'Total number of attempts made to solve the quest',
  })
  totalAttempts: number;

  @ApiProperty({
    description: 'Total number of times the quest has been solved',
  })
  totalSolved: number;

  @ApiProperty({
    description: 'Average time taken to solve the quest in seconds',
  })
  avgSolvedTime: number;

  @ApiProperty({ description: 'Average rating of the quest' })
  avgRating: number;

  @ApiProperty({ description: 'Date when the quest was last updated' })
  updatedAt: Date;

  @ApiProperty({ description: 'Date when the quest was created' })
  createdAt: Date;

  @ApiProperty({ description: 'Author of the quest', type: UserResponseDto })
  @Type(() => UserResponseDto)
  author: UserResponseDto;
}

export class QuestListResponseDto extends ListResponseDto<QuestResponseDto> {
  @ApiProperty({ type: QuestResponseDto, isArray: true })
  @Type(() => QuestResponseDto)
  data: QuestResponseDto[];
}
